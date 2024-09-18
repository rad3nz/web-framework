pagemodule = 'Campaign'
console.log(pagemodule);

setDataType('campaign');

window.rowTemplate = function(item, index) {
    return `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.campaign_name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500">${item.url}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 viewCampaignButton" data-id="${item.campaign_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteCampaignButton" data-id="${item.campaign_id}">Delete</button>
            </td>
        </tr>
    `;
};

fetchAndUpdateData();

// Make changePage function globally accessible
window.changePage = function(newPage) {
  if (newPage >= 1 && newPage <= state.campaign.totalPages) {
      state.campaign.currentPage = newPage;
      fetchAndUpdateData();
  }
};

// Open Create Modal
addCampaignButton = document.getElementById('addCampaignButton');
if (addCampaignButton) {
    addCampaignButton.addEventListener('click', function() {
        document.getElementById('create_data_name').value = '';
        document.getElementById('createModal').classList.remove('hidden');
    });
}

// Table Event Listener
function addTableEventListeners() {
    // Open Edit Modal
    const editCampaignButtons = document.querySelectorAll('.editCampaignButton');
    editCampaignButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const campaignId = this.getAttribute('data-id');
            const campaignData = await fetchById(currentDataType, campaignId);
            if (campaignData) {
                document.getElementById('campaign_id').value = campaignId;
                document.getElementById('campaign_name').value = campaignData.campaign_name;
                document.getElementById('editModal').classList.remove('hidden');
            } else {
                showErrorDialog('Failed to load campaign data.');
            }
        });
    });

    // Open Delete Modal
    const deleteCampaignButtons = document.querySelectorAll('.deleteCampaignButton');
    deleteCampaignButtons.forEach(button => {
        button.addEventListener('click', function() {
            const campaignId = this.getAttribute('data-id');
            document.getElementById('confirmDeleteButton').setAttribute('data-id', campaignId);
            document.getElementById('deleteModal').classList.remove('hidden');
        });
    });
}


// CREATE campaign FUNCTION
async function handleCreateCampaign() {
    const campaignName = document.getElementById('create_data_name').value;

    // Call the create function from api.js
    const result = await createData(currentDataType, campaignName);

    if (result) {
        showSuccessDialog('campaign successfully created!');

        // Clear the input fields
        document.getElementById('create_data_name').value = '';

        // Close the modal
        closeModal('createModal');

        // Refresh the table data after successful creation
        await fetchAndUpdateData();
    } else {
        showErrorDialog('Failed to create campaign. Please try again.');
    }
}

// EDIT campaign FUNCTION
async function handleEditCampaign() {
    const campaignId = document.getElementById('campaign_id').value;
    const campaignName = document.getElementById('campaign_name').value;

    // Call the update function from api.js
    const result = await updateData(currentDataType, campaignId, campaignName);

    if (result) {
        showSuccessDialog('campaign successfully updated!');
        await fetchAndUpdateData();
        closeModal('editModal');
    } else {
        showErrorDialog('Failed to update campaign. Please try again.');
    }
}

// DELETE campaign FUNCTION
async function handleDeleteCampaign() {
    const campaignId = document.getElementById('confirmDeleteButton').getAttribute('data-id');

    // Call the delete function from api.js
    const result = await deleteData(currentDataType, campaignId);

    if (result) {
        showSuccessDialog('campaign successfully deleted!');
        await fetchAndUpdateData();
        closeModal('deleteModal');
    } else {
        showErrorDialog('Failed to delete campaign. Please try again.');
    }
}

document.getElementById('saveCreateButton').addEventListener('click', handleCreateCampaign);
document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteCampaign);