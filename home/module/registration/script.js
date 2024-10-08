// Define the API endpoints
const apiChannel = 'https://api.wa-go.com/channel';
const apiCheckout = 'https://api.wa-go.com/checkout';

// Fetch the available payment channels from the API
function fetchPaymentChannels() {
    return fetch(apiChannel, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => data.data);
}

// Initiate the checkout process by sending user and payment details to the API
function initiateCheckout(payload) {
    return fetch(apiCheckout, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to initiate checkout');
        }
    });
}

// Function to show the payment section and hide the user details section
function showPaymentSection() {
    document.getElementById('userDetailsSection').classList.add('hidden');
    document.getElementById('paymentSection').classList.remove('hidden');
}

// Function to show the user details section and hide the payment section
function showUserDetailsSection() {
    document.getElementById('paymentSection').classList.add('hidden');
    document.getElementById('userDetailsSection').classList.remove('hidden');
}

// Populate payment channels after selecting payment
function populatePaymentChannels(channels) {
    const paymentOptionsContainer = document.getElementById('paymentOptions');
    paymentOptionsContainer.innerHTML = '';

    channels.forEach(channel => {
        const optionHTML = `
            <div class="flex items-center mb-8">
                <input id="${channel.code}" name="paymentChannel" type="radio" value="${channel.code}"
                       class="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300">
                <label for="${channel.code}" class="ml-3 block text-sm font-medium text-gray-700">
                    <img src="${channel.icon_url}" class="inline-block mr-2 h-6 w-12" alt="${channel.name}">
                    ${channel.name}
                </label>
            </div>
        `;
        paymentOptionsContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
}

// Event listener for the Select Payment button
document.getElementById('selectPaymentBtn').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent form submission

    // Fetch payment channels and show payment section
    fetchPaymentChannels().then(channels => {
        populatePaymentChannels(channels);
        showPaymentSection();
    });
});

// Event listener for the Back button
document.getElementById('backBtn').addEventListener('click', function(event) {
    event.preventDefault();
    showUserDetailsSection();
});

// Event listener for the form submission (Submit Payment button)
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    // Get user input and selected payment method
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const selectedPaymentMethod = document.querySelector('input[name="paymentChannel"]:checked').value;

    // Prepare payload for the checkout API
    const payload = {
        method: selectedPaymentMethod,
        customerName: name,
        customerEmail: email,
        customerPhone: whatsapp
    };

    // Initiate the checkout process
    initiateCheckout(payload)
        .then(data => {
            if (data.data && data.data.data.checkout_url) {
                // Redirect to the checkout page if successful
                window.location.href = data.data.data.checkout_url;
            } else {
                throw new Error('Checkout URL not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Checkout failed: ' + error.message);
        });
});
