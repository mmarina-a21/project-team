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
