pagemodule = 'Admin';
console.log(pagemodule);

// Set up admin-specific functionality
setDataType('admin');

window.rowTemplate = function(item, index) {
    return `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.cs_admin}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.cs_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.cs_id}">Delete</button>
            </td>
        </tr>
    `;
};

// Fetch and update data when the module loads
fetchAndUpdateData();

// Phone number validation
function validatePhoneNumber(phoneNumber) {
    const regex = /^[0-9]{9,12}$/; // Only 9-12 digits allowed after prefix '62'
    return regex.test(phoneNumber);
}

// Implement specific validation for admin
function validateFormData(formData) {
    if (!formData.cs_admin || formData.cs_admin.trim() === '') {
        showErrorDialog('Admin name is required.');
        return false;
    }
    if (!validatePhoneNumber(formData.phone.replace(/^62/, ''))) {
        showErrorDialog('Invalid phone number. It should be 9-12 digits after the country code.');
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