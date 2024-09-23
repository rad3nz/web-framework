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
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.campaign_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.campaign_id}">Delete</button>
            </td>
        </tr>
    `;
};

function populateAdminDropdown(admins) {
    const adminSelect = document.getElementById('adminSelect');
    adminSelect.innerHTML = ''; // Clear existing options

    // Add default "Select Admin" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Admin';
    adminSelect.appendChild(defaultOption);

    // Add options for each admin
    admins.forEach(admin => {
        const option = document.createElement('option');
        option.value = admin.id; // Assuming each admin has an 'id' property
        option.textContent = admin.name; // Assuming each admin has a 'name' property
        adminSelect.appendChild(option);
    });
}


fetchAndUpdateData(campaignId);

// Event listeners
document.getElementById('addButton').addEventListener('click', () => {
    clearForm('create');
    document.getElementById('createModal').classList.remove('hidden');
});

document.getElementById('saveCreateButton').addEventListener('click', handleCreate);
document.getElementById('saveEditButton').addEventListener('click', handleEdit);
document.getElementById('confirmDeleteButton').addEventListener('click', handleDelete);

// Initialize
fetchAndUpdateData();