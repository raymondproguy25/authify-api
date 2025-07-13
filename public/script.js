// Wait for form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // Basic client validation
    if (!username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful!');
        // Save user info to localStorage (optional)
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        window.location.href = 'profile.html';
      } else {
        alert(data.message || 'Signup failed.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
      console.error(err);
    }
  });
});
