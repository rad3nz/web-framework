pagemodule = 'Campaign'
console.log(pagemodule);

setDataType('campaign');

window.rowTemplate = function(item, index) {
    return `
        <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">No:</span>${index + 1}
            </td>
            <td class="flex border-b px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:border-b-0">
                <span class="font-bold mr-2 sm:hidden">Nama Campaign:</span>${item.campaign_name}
            </td>
            <td class="flex justify-end px-6 py-4 whitespace-nowrap text-sm font-medium sm:table-cell text-right">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.campaign_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.campaign_id}">Delete</button>
            </td>
        </tr>
    `;
};

fetchAndUpdateData();

// Implement specific validation for campaign
function validateFormData(formData) {
    if (!formData.campaign_name || formData.campaign_name.trim() === '') {
        showErrorDialog('Campaign name is required.');
        return false;
    }

    return true;
}

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