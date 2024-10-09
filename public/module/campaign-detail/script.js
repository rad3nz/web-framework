pagemodule = 'Campaign Detail'
console.log(pagemodule);

setDataType('detailcampaign');

console.log(campaignId);
async function loadCampaignName() {
    try {
        const campaignDetail = await fetchById('campaign', campaignId);
        const campaignName = document.getElementById('campaign-name');
        campaignName.textContent = campaignDetail.campaign_name;
    } catch (error) {
        console.error('Error fetching campaign details:', error);
    }
}
loadCampaignName();

window.rowTemplate = function(item, index) {
    return `
        <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">No:</span>${index + 1}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Admin:</span>${item.cs_admin}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Campaign Message:</span>${item.campaign_message}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Link:</span>
                <span class="mr-2">${item.url}</span>
                <button class="text-blue-600 hover:text-blue-900 copyButton" data-url="${item.url}" title="Copy link">
                    <svg class="size-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                </button>
            </td>
            <td class="flex justify-end px-6 py-4 whitespace-nowrap text-sm font-medium sm:table-cell text-right">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.cd_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.cd_id}">Delete</button>
            </td>
        </tr>
    `;
};

// Implement specific validation for campaign
function validateFormData(formData, formType) {
    if (formType === 'create') {
        if (!formData.cs_id || !formData.cs_admin || formData.cs_admin.trim() === '') {
            showErrorDialog('Please select an Admin from the dropdown.');
            return false;
        }
    }

    if (!formData.campaign_message || formData.campaign_message.trim() === '') {
        formData.campaign_message = "";
        return true;
    }

    return true;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccessAlert('Link copied to clipboard!');
    }, (err) => {
        console.error('Could not copy text: ', err);
        showErrorAlert('Failed to copy link');
    });
}

function populateAdminDropdown(admins) {
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    adminDropdownList.innerHTML = ''; // Clear existing options

    // Add options for each admin
    admins.forEach(admin => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        optionItem.textContent = admin.cs_admin;
        optionItem.setAttribute('data-value', admin.cs_id); // Store the admin ID
        optionItem.addEventListener('click', function() {
            // Set the selected admin in the input and hide dropdown
            document.getElementById('create_adminSearchDropdown').value = admin.cs_admin;
            adminDropdownList.classList.add('hidden');
            document.getElementById('create_adminSearchDropdown').setAttribute('data-selected-id', admin.cs_id); // Store the selected admin ID
        });
        adminDropdownList.appendChild(optionItem);
    });
}

// Event listeners
document.getElementById('addButton').addEventListener('click', async () => {
    clearForm('create');
    
    // Ensure the dropdown is hidden initially
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    adminDropdownList.classList.add('hidden');

    const admins = await fetchList('admin'); // Wait for the fetch to complete
    if (admins.listData && Array.isArray(admins.listData)) {
        populateAdminDropdown(admins.listData);  // Pass the listData to the function
    }
    
    document.getElementById('createModal').classList.remove('hidden');
});

document.getElementById('saveCreateButton').addEventListener('click', handleCreate);
document.getElementById('saveEditButton').addEventListener('click', handleEdit);
document.getElementById('confirmDeleteButton').addEventListener('click', handleDelete);

// Input event: Filter and show dropdown based on typed input
document.getElementById('create_adminSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    const options = adminDropdownList.querySelectorAll('li');
    
    let hasVisibleOptions = false;

    // Show matching options based on input
    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            option.style.display = '';  // Show matching options
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';  // Hide non-matching options
        }
    });

    // Show the dropdown if there are visible options and the user has started typing
    if (hasVisibleOptions && searchTerm.trim() !== '') {
        adminDropdownList.classList.remove('hidden');
    } else {
        adminDropdownList.classList.add('hidden');
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    if (!event.target.closest('#create_adminSearchDropdown') && !event.target.closest('#create_adminDropdownList')) {
        adminDropdownList.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});


// Focus event: Only show dropdown when there is content in the input field
document.getElementById('create_adminSearchDropdown').addEventListener('focus', function() {
    const adminDropdownList = document.getElementById('create_adminDropdownList');
    if (this.value.trim() !== '') {  // Only show if there is already text typed
        adminDropdownList.classList.remove('hidden');
    }
});


function populateEditAdminDropdown(admins) {
    const dropdown = document.getElementById('edit_adminSearchDropdown');
    const list = document.getElementById('edit_adminDropdownList');
    list.innerHTML = '';

    admins.forEach(admin => {
        const option = document.createElement('li');
        option.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
        option.textContent = admin.cs_admin;
        option.setAttribute('data-value', admin.cs_id);
        option.addEventListener('click', () => {
            dropdown.value = admin.cs_admin;
            dropdown.setAttribute('data-selected-id', admin.cs_id);
            list.classList.add('hidden');
        });
        list.appendChild(option);
    });
}

// Input event: Filter and show dropdown based on typed input
document.getElementById('edit_adminSearchDropdown').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const adminDropdownList = document.getElementById('edit_adminDropdownList');
    const options = adminDropdownList.querySelectorAll('li');
    
    let hasVisibleOptions = false;

    // Show matching options based on input
    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchTerm)) {
            option.style.display = '';  // Show matching options
            hasVisibleOptions = true;
        } else {
            option.style.display = 'none';  // Hide non-matching options
        }
    });

    // Show the dropdown if there are visible options and the user has started typing
    if (hasVisibleOptions && searchTerm.trim() !== '') {
        adminDropdownList.classList.remove('hidden');
    } else {
        adminDropdownList.classList.add('hidden');
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    const adminDropdownList = document.getElementById('edit_adminDropdownList');
    if (!event.target.closest('#edit_adminSearchDropdown') && !event.target.closest('#edit_adminDropdownList')) {
        adminDropdownList.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});


// Focus event: Only show dropdown when there is content in the input field
document.getElementById('edit_adminSearchDropdown').addEventListener('focus', function() {
    const adminDropdownList = document.getElementById('edit_adminDropdownList');
    if (this.value.trim() !== '') {  // Only show if there is already text typed
        adminDropdownList.classList.remove('hidden');
    }
});

document.addEventListener('click', function(e) {
    if (e.target.closest('.copyButton')) {
        const button = e.target.closest('.copyButton');
        const url = button.getAttribute('data-url');
        copyToClipboard(url);
        console.log(url);
    }
});


// Initialize
fetchAndUpdateData(campaignId);