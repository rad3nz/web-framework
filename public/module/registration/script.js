document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting the traditional way

    // Get form data
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Create the payload object
    const payload = {
        nama: name,
        phone: whatsapp
    };

    // Send POST request to the API
    fetch('https://auth.katib.id/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)  // Convert payload to JSON
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // Parse the JSON response
        } else {
            throw new Error('Failed to register');
        }
    })
    .then(data => {
        console.log('Registration successful:', data);
        alert('Registration successful!');

        // Clear the form fields after successful registration
        document.getElementById('registerForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed: ' + error.message);
    });
});
