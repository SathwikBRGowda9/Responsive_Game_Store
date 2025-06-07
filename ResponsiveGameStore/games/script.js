const wrapper = document.querySelector('.wrapper');
const signUpLink = document.querySelector('.signIn-link'); // Fixed
const signInLink = document.querySelector('.signUp-link'); // Fixed
const signUpForm = document.querySelector('.form-wrapper.sign-up form');
const signInForm = document.querySelector('.form-wrapper.sign-in form'); // Fixed
const signUpWrapper = document.querySelector('.form-wrapper.sign-up');
const signInWrapper = document.querySelector('.form-wrapper.sign-in');

// Switch to Sign-Up
signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('animate-signIn');
    wrapper.classList.add('animate-signUp');
});

// Switch to Sign-In
signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('animate-signUp');
    wrapper.classList.add('animate-signIn');
});

// Sign-Up Form Submission
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.querySelector('.sign-up input[type="text"]').value.trim();
    const email = document.querySelector('.sign-up input[type="email"]').value.trim();
    const password = document.querySelector('.sign-up input[type="password"]').value.trim();
    
    if (username === '' || email === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    alert('Sign-up successful! You can now sign in.');
    signUpForm.reset();
    
    // Automatically switch to sign-in form
    wrapper.classList.remove('animate-signUp');
    wrapper.classList.add('animate-signIn');
});

// Sign-In Form Submission
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.querySelector('.sign-in input[type="text"]').value.trim();
    const password = document.querySelector('.sign-in input[type="password"]').value.trim();
    
    if (username === '' || password === '') {
        alert('Please enter your username and password.');
        return;
    }
    
    alert('Sign-in successful! Redirecting...');
    window.location.href = 'GAMES.html';
});
