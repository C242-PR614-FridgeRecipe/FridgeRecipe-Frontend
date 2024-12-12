document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPassword = document.getElementById('show_password');
    const authLink = document.getElementById('authLink');

    // Cek status login dari LocalStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        // Jika pengguna sudah login, ubah "Login" menjadi "Logout"
        authLink.textContent = 'Sign Out';
        authLink.href = '#'; // Logout tidak mengarah ke halaman lain
        authLink.classList.add('logout');
        authLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Logout pengguna
            localStorage.removeItem('isLoggedIn');
            alert('You have Signed Out.');
            window.location.href = 'homepage.html'; // Redirect ke halaman login
        });
    } else {
        // Jika pengguna belum login, pastikan tetap ke halaman login
        authLink.textContent = 'Sign In';
        authLink.href = 'login.html';
        authLink.classList.remove('logout');
    }
    
    // Pastikan elemen ditemukan
    if (!loginForm || !usernameInput || !passwordInput) {
        console.error('Form elements not found!');
        return;
    }

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();  // Mencegah form untuk submit secara default

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Validasi input pengguna
        if (!username || !password) {
            alert('Username dan Password tidak boleh kosong');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
        
            console.log('Response status:', response.status); // Menampilkan status HTTP
            
            const result = await response.json();
            console.log('Response data:', result); // Menampilkan data response
        
            if (response.ok && result.accessToken) {
                // Simpan token dan status login ke localStorage
                localStorage.setItem('authToken', result.accessToken);
                localStorage.setItem('isLoggedIn', true);

                // Redirect ke halaman utama
                window.location.href = 'homepage.html';
            } else {
                alert(result.message || 'Sign In failed. Please check your username and password.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login. Try again later.');
        }        
    });

    showPassword.addEventListener("input", (e) => {
        if(e.target.checked) {
            passwordInput.setAttribute("type", "text");
        } else {
            passwordInput.setAttribute("type", "password");
        }
    });
});
