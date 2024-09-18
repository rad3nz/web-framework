function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('block');
  }
  
function showSuccessDialog(message) {
    showDialog('Success', message, 'bg-green-500');
}
  
function showErrorDialog(message) {
    showDialog('Error', message, 'bg-red-500');
}
  
function showDialog(title, message, colorClass) {
    const dialog = document.createElement('div');
    dialog.classList.add(
      'fixed',
      'inset-0',
      'z-50', 
      'flex',
      'items-center',
      'justify-center',
      'bg-gray-500',
      'bg-opacity-75'
    );
    dialog.id = "adminDialog"; 
    dialog.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 class="text-xl font-bold mb-4">${title}</h2>
        <p class="text-gray-700 mb-4">${message}</p>
        <button class="${colorClass} text-white px-4 py-2 rounded" onclick="closeDialog()">OK</button>
      </div>
    `;
    document.body.appendChild(dialog);
}
  
function closeDialog() {
    const dialog = document.getElementById('adminDialog');
    if (dialog) {
      dialog.remove();
    }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}
  
function debounce(func, delay) {
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    }
}