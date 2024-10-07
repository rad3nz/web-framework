// Define the API endpoints as variables
const apiRegister = 'https://auth.katib.id/register';
const apiCheckout = 'https://auth.katib.id/checkout';

// Function to handle API requests for both registration and checkout
function sendApiRequest(endpoint, payload) {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)  // Convert payload to JSON
    });
}

// Function to handle checkout API request
function initiateCheckout() {
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Create the payload object for checkout
    const payload = {
        method:"DANA",
        customerName: name,
        customerEmail: email,
        customerPhone: whatsapp
    };

    return sendApiRequest(apiCheckout, payload)
    .then(response => {
        if (response.ok) {
            return response.json();  // Parse the response JSON
        } else {
            throw new Error('Failed to initiate checkout');
        }
    })
    .then(data => {
        if (data.data) {
            // If checkout is successful and checkout_url is provided, redirect
            console.log('Checkout successxful:', data);
            window.location.href = data.data.data.checkout_url;  // Redirect to the checkout page
            console.log(data.data.data.checkout_url);
            return true;
        } else {
            throw new Error('Checkout URL not found');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Checkout failed: ' + error.message);
        return false;
    });
}

// Function to handle form submission for registration
function handleRegisterForm() {
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Create the payload object for registration
    const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: whatsapp
    };

    // Call the API request function for registration
    sendApiRequest(apiRegister, payload)
    .then(response => {
        if (response.ok) {
            return response.json();  // Parse the JSON response
        } else {
            throw new Error('Failed to process registration');
        }
    })
    .then(data => {
        console.log('Registration successful:', data);
        alert('Registration successful!');

        // Clear the form fields after a successful request
        document.getElementById('registerForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed: ' + error.message);
    });
}

// Event listener for the registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // First, initiate the checkout process
    initiateCheckout().then(success => {
        // If the checkout succeeds, proceed with the registration
        if (success) {
            handleRegisterForm();
        }
    });
});
