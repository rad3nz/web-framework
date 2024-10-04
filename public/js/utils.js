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
  dialog.id = "customDialog"; 
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
  const dialog = document.getElementById('customDialog');
  if (dialog) {
      dialog.remove();
  }
}

function showAlert(title, message, type = 'blue') {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) {
      const container = document.createElement('div');
      container.id = 'alertContainer';
      container.className = 'fixed bottom-0 right-0 m-4 z-50';
      document.body.appendChild(container);
  }

  const alert = document.createElement('div');
  alert.className = `flex items-center p-4 mb-4 text-sm text-${type}-800 rounded-lg bg-${type}-50 bg-${type}-800 text-${type}-400`;
  alert.setAttribute('role', 'alert');

  alert.innerHTML = `
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">${title}</span>
      <div>
          <span class="font-medium">${title}:</span> ${message}
      </div>
  `;

  document.getElementById('alertContainer').appendChild(alert);

  // Remove the alert after 5 seconds
  setTimeout(() => {
      alert.remove();
  }, 5000);
}

function showSuccessAlert(message) {
  showAlert('Success', message, 'green');
}

function showErrorAlert(message) {
  showAlert('Error', message, 'red');
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