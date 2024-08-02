// Login input system
const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const response = await fetch('/apiuser/login', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 200) {
        
        // Check if data.user exist and has an id property
        if (data.user && data.user.id) {
            // Store token in local storage
            localStorage.setItem('access_token', data.token);
            // Store user ID in local storage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Store token in cookie (if needed)
            document.cookie = `access_token=${data.token}; path=/; secure; samesite=none;`;

            // Redirect to admin page
            window.location.href = '/admin';
            
        } else {
            console.error('User ID not found in response data');
        }
    } else {
        console.error('Login failed:', data.msg);
    }
});