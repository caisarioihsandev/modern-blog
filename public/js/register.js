// Register input system
const registerForm = document.querySelector("#registerForm");
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.querySelector("#usernameReg").value;
    const email = document.querySelector("#emailReg").value;
    const password = document.querySelector("#passwordReg").value;

    const response = await fetch('/apiuser/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password})
    });

    const data = await response.json();

    if (response.status === 200) {
        console.log(data);
        location.href = '/';
    } else {
        console.error("Failed to register");
    }
});