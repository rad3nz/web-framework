let dataItems = null;

const state = {
    admin: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        isSubmitting: false
    },
    campaign: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        isSubmitting: false
    }
};


function loadData() {
    const tableBody = document.querySelector('#tableBody');
    
    if (!tableBody) {
        console.error('Table body element not found.');
        return;
    }
  
    tableBody.innerHTML = '';
  
    if (!dataItems || dataItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No data available</td></tr>';
        return;
    }
  
    dataItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = window.rowTemplate(item, index);
        tableBody.appendChild(row);
    });

    addTableEventListeners();
}

function updatePagination(recordsOnCurrentPage) {
    const paginationContainer = document.getElementById("pagination");
    let paginationHTML = '';

    const currentState = state[currentDataType];

    if (currentState.totalPages > 1) {
        paginationHTML += `<div class="px-3 py-1 justify-self-start rounded-md bg-gray-400 text-gray-800 mr-2">Showing ${recordsOnCurrentPage} of ${currentState.totalRecords} entries</div>`;
        
        paginationHTML += `<div class="flex">`;
        paginationHTML += `<button class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mr-2" onclick="changePage(${currentState.currentPage - 1})" ${currentState.currentPage === 1 ? 'disabled' : ''}>Previous</button>`;

        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, currentState.currentPage - halfVisible);
        let endPage = Math.min(currentState.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mr-2" onclick="changePage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="px-3 py-1">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentState.currentPage) {
                paginationHTML += `<button class="px-3 py-1 rounded-md bg-blue-500 text-blue mr-2">${i}</button>`;
            } else {
                paginationHTML += `<button class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mr-2" onclick="changePage(${i})">${i}</button>`;
            }
        }

        if (endPage < currentState.totalPages) {
            if (endPage < currentState.totalPages - 1) {
                paginationHTML += `<span class="px-3 py-1">...</span>`;
            }
            paginationHTML += `<button class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mr-2" onclick="changePage(${currentState.totalPages})">${currentState.totalPages}</button>`;
        }

        paginationHTML += `<button class="px-3 py-1 rounded-md bg-gray-200 text-gray-700" onclick="changePage(${currentState.currentPage + 1})" ${currentState.currentPage === currentState.totalPages ? 'disabled' : ''}>Next</button>`;
        paginationHTML += `</div>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(pageNumber) {
    const currentState = state[currentDataType];
    if (pageNumber < 1 || pageNumber > currentState.totalPages) return;

    currentState.currentPage = pageNumber;
    fetchAndUpdateData();
}
