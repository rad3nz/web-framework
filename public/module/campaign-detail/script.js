pagemodule = 'Campaign Detail'
console.log(pagemodule);

setDataType('campaign');

window.rowTemplate = function(item, index) {
    return `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.campaign_message}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 editButton" data-id="${item.campaign_id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 deleteButton" data-id="${item.campaign_id}">Delete</button>
            </td>
        </tr>
    `;
};

fetchAndUpdateData();