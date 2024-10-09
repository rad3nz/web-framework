const app_id = 5;
const otpUrl = 'https://auth.katib.cloud/login';
const unameLoginUrl = 'https://auth.katib.cloud/username/login';
const otpLoginUrl = 'https://auth.katib.cloud/otp/login';

document.getElementById('switch-method').addEventListener('click', function() {
    const usernamePasswordSection = document.getElementById('username-password-section');
    const phoneOtpSection = document.getElementById('phone-otp-section');
    const switchButton = document.getElementById('switch-method');
    
    // Reset fields and messages when switching
    document.getElementById('message').textContent = '';
    document.getElementById('messageOTP').textContent = '';
    document.getElementById('phone').value = '';
    document.getElementById('otp').value = '';

    if (usernamePasswordSection.style.display === 'none') {
        usernamePasswordSection.style.display = 'block';
        phoneOtpSection.style.display = 'none';
        switchButton.textContent = 'Switch to WhatsApp Login';
    } else {
        usernamePasswordSection.style.display = 'none';
        phoneOtpSection.style.display = 'block';
        switchButton.textContent = 'Switch to Username Login';
    }
});

document.getElementById('send-otp').addEventListener('click', async function() {
    const phone = document.getElementById('phone').value.trim();
    const loadingOTPDiv = document.getElementById('loadingOTP');
    const messageOTPDiv = document.getElementById('messageOTP');

    if (!phone) {
        messageOTPDiv.textContent = 'Please enter your phone number!';
        messageOTPDiv.style.color = 'red';
        return;
    }

    loadingOTPDiv.style.display = 'block';

    try {
        const response = await fetch(otpUrl +'/' + app_id + '/' + phone, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error('Phone number is not registered!');
        }

        const { owner_id, user_id, level, nama } = result;

        // Store in sessionStorage
        sessionStorage.setItem('owner_id', owner_id);
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('level', level);
        sessionStorage.setItem('nama', nama);

        messageOTPDiv.textContent = 'OTP has been sent to your phone!';
        messageOTPDiv.style.color = 'green';
        loadingOTPDiv.style.display = 'none';

        // Show OTP field
        document.getElementById('send-otp').style.display = 'none';
        document.querySelector('label[for="otp"]').style.display = 'block';
        document.getElementById('otp').style.display = 'block';

    } catch (error) {
        loadingOTPDiv.style.display = 'none';
        messageOTPDiv.textContent = error.message || 'Failed to send OTP.';
        messageOTPDiv.style.color = 'red';
    }
});

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const usernamePasswordSection = document.getElementById('username-password-section');
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block';

    const messageDiv = document.getElementById('message');
    let response, result;

    try {
        if (usernamePasswordSection.style.display !== 'none') {
            const username = document.getElementById('username').value.trim();
            let password = document.getElementById('password').value.trim();

            if (!username || !password) {
                throw new Error('Username and password are required.');
            }

            response = await fetch(unameLoginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id, username, password })
            });
        } else {
            const phone = document.getElementById('phone').value.trim();
            const otp = document.getElementById('otp').value.trim();

            if (!phone || !otp) {
                throw new Error('Phone number and OTP are required.');
            }

            response = await fetch(otpLoginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });
        }

        result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed!');
        }

        messageDiv.textContent = 'Login successful!';
        messageDiv.style.color = 'green';

        sessionStorage.setItem('owner_id', result.owner_id);
        sessionStorage.setItem('user_id', result.user_id); // No need for JSON.stringify
        sessionStorage.setItem('level', result.level);
        sessionStorage.setItem('nama', result.nama);

        // Redirect to another page
        window.location.href = '../index.html'; 

    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = 'red';
    } finally {
        loadingDiv.style.display = 'none';
    }
});