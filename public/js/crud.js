let currentDataType = null;

function setDataType(type) {
    currentDataType = type;
}

async function fetchAndUpdateData() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const tableBody = document.querySelector('#tableBody');
    
    // Show the loading spinner
    loadingSpinner.classList.remove('hidden');
    tableBody.innerHTML = ''; // Optionally clear previous data

    try {
        const response = await fetchData(currentDataType, state[currentDataType].currentPage);
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
            const data = await fetchById(currentDataType, id);
            
            if (data) {
                populateEditModal(data);
                document.getElementById('editModal').classList.remove('hidden');
            } else {
                showErrorDialog(`Failed to load ${currentDataType} data.`);
            }
        });
    });

    // Delete button listener
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
    
    // Validation
    if (!validateFormData(formData, 'create')) {
        return;
    }

    // Call the create function from api.js
    const result = await createData(currentDataType, formData);

    if (result) {
        showSuccessDialog(`${capitalize(currentDataType)} successfully created!`);
        clearForm('create');
        closeModal('createModal');
        await fetchAndUpdateData();
    } else {
        showErrorDialog(`Failed to create ${currentDataType}. Please try again.`);
    }
}

async function handleEdit() {
    const id = document.getElementById(`${currentDataType === 'admin' ? 'cs' : 'campaign'}_id`).value;
    const formData = getFormData('edit');
    
    // Validation
    if (!validateFormData(formData, 'edit')) {
        return;
    }

    // Call the update function from api.js
    const result = await updateData(currentDataType, id, formData);

    if (result) {
        showSuccessDialog(`${capitalize(currentDataType)} successfully updated!`);
        await fetchAndUpdateData();
        closeModal('editModal');
    } else {
        showErrorDialog(`Failed to update ${currentDataType}. Please try again.`);
    }
}

async function handleDelete() {
    const id = document.getElementById('confirmDeleteButton').getAttribute('data-id');

    // Call the delete function from api.js
    const result = await deleteData(currentDataType, id);

    if (result) {
        showSuccessDialog(`${capitalize(currentDataType)} successfully deleted!`);
        await fetchAndUpdateData();
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


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize
fetchAndUpdateData();