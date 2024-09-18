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
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editAdminButton" data-id="${item.cs_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteAdminButton" data-id="${item.cs_id}">Delete</button>
            </td>
        </tr>
    `;
};

// Fetch and update data when the module loads
fetchAndUpdateData();

// Make changePage function globally accessible
window.changePage = function(newPage) {
    if (newPage >= 1 && newPage <= state.admin.totalPages) {
        state.admin.currentPage = newPage;
        fetchAndUpdateData();
    }
};

// Open Create Modal
addButton = document.getElementById('addButton');
if (addButton) {
    addButton.addEventListener('click', function() {
        document.getElementById('create_data_name').value = '';
        document.getElementById('create_phone').value = '';
        document.getElementById('createModal').classList.remove('hidden');
    });
}

// Table Event Listener
function addTableEventListeners() {
    // Open Edit Modal
    const editAdminButtons = document.querySelectorAll('.editAdminButton');
    editAdminButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const adminId = this.getAttribute('data-id');
            const adminData = await fetchById(currentDataType, adminId);
            if (adminData) {
                document.getElementById('cs_id').value = adminId;
                document.getElementById('cs_admin').value = adminData.cs_admin;
                document.getElementById('phone').value = adminData.phone.replace(/^62/, '');
                document.getElementById('editModal').classList.remove('hidden');
            } else {
                showErrorDialog('Failed to load admin data.');
            }
        });
    });

    // Open Delete Modal
    const deleteAdminButtons = document.querySelectorAll('.deleteAdminButton');
    deleteAdminButtons.forEach(button => {
        button.addEventListener('click', function() {
            const adminId = this.getAttribute('data-id');
            document.getElementById('confirmDeleteButton').setAttribute('data-id', adminId);
            document.getElementById('deleteModal').classList.remove('hidden');
        });
    });
}

// Function to Validate Phone Number
function validatePhoneNumber(phoneNumber) {
    const regex = /^[0-9]{9,12}$/; // Only 9-12 digits allowed after prefix '62'
    return regex.test(phoneNumber);
}

// CREATE ADMIN FUNCTION
async function handleCreateAdmin() {
    const adminName = document.getElementById('create_data_name').value;
    let phone = document.getElementById('create_phone').value;

    // Validation for phone number
    if (!validatePhoneNumber(phone)) {
        document.getElementById('createPhoneTooltip').classList.remove('hidden');
        return;
    }
    document.getElementById('createPhoneTooltip').classList.add('hidden');
    
    // Add country prefix
    phone = `62${phone}`;

    // Call the create function from api.js
    const result = await createData(currentDataType, adminName, phone);

    if (result) {
        showSuccessDialog('Admin successfully created!');

        // Clear the input fields
        document.getElementById('create_data_name').value = '';
        document.getElementById('create_phone').value = '';

        // Close the modal
        closeModal('createModal');

        // Refresh the table data after successful creation
        await fetchAndUpdateData();
    } else {
        showErrorDialog('Failed to create admin. Please try again.');
    }
}

// EDIT ADMIN FUNCTION
async function handleEditAdmin() {
    const adminId = document.getElementById('cs_id').value;
    const adminName = document.getElementById('cs_admin').value;
    let phone = document.getElementById('phone').value;

    // Remove prefix and validate phone number
    phone = phone.replace(/^62/, '');
    if (!validatePhoneNumber(phone)) {
        document.getElementById('phoneTooltip').classList.remove('hidden');
        return;
    }
    document.getElementById('phoneTooltip').classList.add('hidden');

    phone = `62${phone}`; // Add the prefix back

    // Call the update function from api.js
    const result = await updateData(currentDataType, adminId, adminName, phone);

    if (result) {
        showSuccessDialog('Admin successfully updated!');
        await fetchAndUpdateData();
        closeModal('editModal');
    } else {
        showErrorDialog('Failed to update admin. Please try again.');
    }
}

// DELETE ADMIN FUNCTION
async function handleDeleteAdmin() {
    const adminId = document.getElementById('confirmDeleteButton').getAttribute('data-id');

    // Call the delete function from api.js
    const result = await deleteData(currentDataType, adminId);

    if (result) {
        showSuccessDialog('Admin successfully deleted!');
        await fetchAndUpdateData();
        closeModal('deleteModal');
    } else {
        showErrorDialog('Failed to delete admin. Please try again.');
    }
}

// Event listeners for modals
document.getElementById('saveCreateButton').addEventListener('click', handleCreateAdmin);
document.getElementById('saveChangesButton').addEventListener('click', handleEditAdmin);
document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteAdmin);

