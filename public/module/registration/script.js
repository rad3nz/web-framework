// Function to handle API requests for both registration and login
function sendApiRequest(endpoint, payload) {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)  // Convert payload to JSON
    });
}

// Function to handle form submission for registration or login
function handleRegisterForm(event, endpoint) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Create the payload object
    const payload = {
        nama: name,
        phone: whatsapp
    };

    // Call the API request function
    sendApiRequest(endpoint, payload)
    .then(response => {
        if (response.ok) {
            return response.json();  // Parse the JSON response
        } else {
            throw new Error('Failed to process request');
        }
    })
    .then(data => {
        console.log('Request successful:', data);
        alert('Request successful!');

        // Clear the form fields after a successful request
        document.getElementById('registerForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Request failed: ' + error.message);
    });
}

// Event listener for the registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    // Replace with the correct API endpoint for registration
    handleRegisterForm(event, 'https://auth.katib.id/register');
});
