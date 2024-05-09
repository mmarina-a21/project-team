function switchForm(form) {
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');

    // Hide both forms initially
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';

    // Show the requested form and ensure it is displayed with flex to keep the centering
    if (form === 'signup') {
        signupForm.style.display = 'flex';
    } else {
        loginForm.style.display = 'flex';
    }
}

function signup() {
    const username = document.querySelector('#signup-form input[type="text"]').value;
    const email = document.querySelector('#signup-form input[type="email"]').value;
    const password = document.querySelector('#signup-form input[type="password"]').value;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('user', JSON.stringify({ username, email }));
            window.location.href = 'profile.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Signup failed:', error);
    });
}

function login() {
    const username = document.querySelector('#login-form input[type="text"]').value; // Changed from input[type="email"] to input[type="text"]
    const password = document.querySelector('#login-form input[type="password"]').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Using username instead of email
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('user', JSON.stringify({ username: data.user, email: data.email, bio: data.bio, posts: data.posts }));
            window.location.href = 'profile.html';
        } else {
            alert('Invalid credentials!');
        }
    })
    .catch(error => {
        console.error('Login failed:', error);
    });
}


