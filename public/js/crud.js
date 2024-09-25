let currentDataType = null;
let campaignId = null;

function setDataType(type) {
    currentDataType = type;
}

async function fetchAndUpdateData(id = null) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const tableBody = document.querySelector('#tableBody');
    
    // Show the loading spinner
    loadingSpinner.classList.remove('hidden');
    tableBody.innerHTML = ''; // Optionally clear previous data

    try {
        const response = await fetchData(currentDataType, state[currentDataType].currentPage, id);
        if (!response || !response.tableData) {
            throw new Error('Invalid response from the API');
        }

        dataItems = response.tableData;
        state[currentDataType].totalPages = response.totalPages;
        state[currentDataType].totalRecords = response.totalRecords;
        
        loadData();
        updatePagination(dataItems.length);

    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('#tableBody').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">Error loading data</td></tr>';
    } finally {
        // Hide the loading spinner when done
        loadingSpinner.classList.add('hidden');
    }
}

function addTableEventListeners() {
    // Edit button listener
    const editButtons = document.querySelectorAll('.editButton');
    editButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');

            if (currentDataType === 'campaign') {
                campaignId = id;
                // Campaign: Load the campaign-detail.html and associated script.js
                await loadPageContent('./module/campaign-detail/data.html', './module/campaign-detail/script.js');

                // Fetch campaign data by ID and populate the detail page
                const campaignData = await fetchData('detailcampaign', state[currentDataType].currentPage, id);
                console.log(campaignData);
                if (!campaignData) {
                    showErrorDialog('Failed to load campaign data.');
                }

            } else if (currentDataType === 'admin') {
                // Fetch data and open the edit modal for other data types
                const data = await fetchById(currentDataType, id);
                
                if (data) {
                    populateEditModal(data);
                    document.getElementById('editModal').classList.remove('hidden');
                } else {
                    showErrorDialog(`Failed to load ${currentDataType} data.`);
                }
            } else if (currentDataType === 'detailcampaign') {
                // Fetch data and open the edit modal for other data types
                const data = await fetchById(currentDataType, id);
                const adminDropdownList = document.getElementById('edit_adminDropdownList');
                adminDropdownList.classList.add('hidden');
                console.log(campaignId);

                const admins = await fetchList('admin'); // Wait for the fetch to complete
                if (admins.listData && Array.isArray(admins.listData)) {
                    populateEditAdminDropdown(admins.listData);  // Pass the listData to the function
                }
                
                if (data) {
                    populateEditModal(data);
                    document.getElementById('editModal').classList.remove('hidden');
                } else {
                    showErrorDialog(`Failed to load ${currentDataType} data.`);
                }
            }
        });
    });

    // Delete button listener remains the same for all data types
    const deleteButtons = document.querySelectorAll('.deleteButton');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            document.getElementById('confirmDeleteButton').setAttribute('data-id', id);
            document.getElementById('deleteModal').classList.remove('hidden');
        });
    });
}

async function handleCreate() {
    const formData = getFormData('create');
    if (currentDataType == 'detailcampaign') {
        // Get the selected admin ID and name
        const adminInput = document.getElementById('create_adminSearchDropdown');
        const selectedAdminId = adminInput.getAttribute('data-selected-id');
        const selectedAdminName = adminInput.value;

        // Add admin information to formData
        formData.cs_id = selectedAdminId;
        formData.cs_admin = selectedAdminName;
        formData.campaign_id = campaignId;
        formData.tool_id = 1;
    }
    
    // Validation
    if (!validateFormData(formData, 'create')) {
        return;
    }

    // Call the create function from api.js
    const result = await createData(currentDataType, formData);
    console.log(formData);

    if (result) {
        showSuccessDialog(`${capitalize(currentDataType)} successfully created!`);
        clearForm('create');
        closeModal('createModal');
        if (currentDataType == 'detailcampaign') {
            await fetchAndUpdateData(campaignId);
        } else {
            await fetchAndUpdateData();
        }

    } else {
        showErrorDialog(`Failed to create ${currentDataType}. Please try again.`);
    }
}

async function handleEdit() {
    const id = document.getElementById(`${currentDataType === 'admin' ? 'cs' : 'campaign'}_id`).value;
    const formData = getFormData('edit');

    if (currentDataType == 'detailcampaign') {
        // Get the selected admin ID and name
        console.log(campaignId);
        const adminInput = document.getElementById('edit_adminSearchDropdown');
        const selectedAdminId = adminInput.getAttribute('data-selected-id');
        const selectedAdminName = adminInput.value;

        // Add admin information to formData
        formData.cs_id = selectedAdminId;
        formData.cs_admin = selectedAdminName;
        formData.tool_id = 1;
        console.log(campaignId);
    }
    
    // Validation
    if (!validateFormData(formData, 'edit')) {
        return;
    }

    // Call the update function from api.js
    const result = await updateData(currentDataType, id, formData);
    console.log(result);

    if (result) {
        showSuccessDialog(`${capitalize(currentDataType)} successfully updated!`);
        if (currentDataType == 'detailcampaign') {
            await fetchAndUpdateData(campaignId);
        } else {
            await fetchAndUpdateData();
        }
        closeModal('editModal');
    } else {
        showErrorDialog(`Failed to update ${currentDataType}. Please try again.`);
    }
}

async function handleDelete() {
    const id = document.getElementById('confirmDeleteButton').getAttribute('data-id');

    // Call the delete function from api.js
    const result = await deleteData(currentDataType, id);
    console.log(result);

    if (result) {
        showSuccessDialog(`${capitalize(currentDataType)} successfully deleted!`);

        if (currentDataType == 'detailcampaign') {
            await fetchAndUpdateData(campaignId);
        } else {
            await fetchAndUpdateData();
        }
        closeModal('deleteModal');
    } else {
        showErrorDialog(`Failed to delete ${currentDataType}. Please try again.`);
    }
}

// Helper functions
function getFormData(formType) {
    const formData = {};
    const form = document.getElementById(`${formType}Form`);
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.name === 'phone') {
            //if phone field is detected, add prefix '62' if it's not already present
            formData[input.name] = input.value.startsWith('62') ? input.value : `62${input.value}`;
        } else {
            formData[input.name] = input.value;
        }
    });
    return formData;
}

function validateFormData(formData) {
    // Add your validation logic here
    // Return true if valid, false otherwise
    return true;
}

function clearForm(formType) {
    const form = document.getElementById(`${formType}Form`);
    if (currentDataType == 'detailcampaign') {
        const adminInput = document.getElementById('create_adminSearchDropdown');
        adminInput.value = '';
        adminInput.removeAttribute('data-selected-id');
        document.getElementById('create_adminDropdownList').classList.add('hidden');
    }

    form.reset();
}

function populateEditModal(data) {
    const form = document.getElementById('editForm');
    for (const key in data) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            if (key === 'phone') {
                //remove '62' prefix
                const phoneNumberWithoutPrefix = data[key].startsWith('62') ? data[key].substring(2) : data[key];
                input.value = phoneNumberWithoutPrefix;
            } else {
                input.value = data[key];
            }
        }
    }
}

async function loadPageContent(htmlPath, jsPath) {
    try {
        // Fetch and load the HTML content
        const response = await fetch(htmlPath);
        if (!response.ok) {
            throw new Error('Failed to load page content.');
        }

        const htmlContent = await response.text();
        document.getElementById('content').innerHTML = htmlContent;

        // Dynamically load and inject the associated JavaScript file
        const scriptElement = document.createElement('script');
        scriptElement.src = jsPath;
        scriptElement.onload = function() {
            console.log(`Script ${jsPath} loaded successfully.`);
        };
        scriptElement.onerror = function() {
            console.error(`Failed to load script ${jsPath}.`);
        };

        // Append the script element to the body (or head)
        document.body.appendChild(scriptElement);
    } catch (error) {
        console.error(error);
        showErrorDialog('Failed to load page.');
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize
fetchAndUpdateData();