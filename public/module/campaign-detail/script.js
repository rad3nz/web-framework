pagemodule = 'Campaign Detail'
console.log(pagemodule);

setDataType('detailcampaign');

console.log(campaignId);

window.rowTemplate = function(item, index) {
    return `
        <tr>
            <td class="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-4 py-4 whitespace-normal text-sm text-gray-500">${item.cs_admin}</td>
            <td class="px-4 py-4 whitespace-normal text-sm text-gray-500">${item.campaign_message}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${item.url}</td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
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
        showErrorDialog('Campaign Message is required.');
        return false;
    }

    return true;
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


// Initialize
fetchAndUpdateData(campaignId);