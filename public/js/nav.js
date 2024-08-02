let ul = document.querySelector('.links-container');

// Check if user is logged in
token = localStorage.getItem('access_token');
let user = JSON.parse(localStorage.getItem('user'));

if (token) {
    // Decode the token to get user information (using a library like jwt-decode)
    // const decodedToken = jwt_decode(token);
    ul.innerHTML += `
        <li class="link-item"><a href="/editor" class="link">Editor</a></li>
        <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
        <li class="link-item"><a href="#" onclick="logoutUser()" class="link">Logout</a></li>
    `;
} else {
    // No one is logged in
    ul.innerHTML += `
        <li class="link-item"><a href="/login" class="link">Login</a></li>
    `;
}

// Logout function
const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    // delete cookie
    document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;`;
    
    location.reload();
}