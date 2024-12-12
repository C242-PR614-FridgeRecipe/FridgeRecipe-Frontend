document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const showPassword = document.getElementById('show_password');
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (!registerForm) {
        console.error("Register form not found!");
        return;
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Mencegah refresh halaman

        if (!usernameInput || !passwordInput || !confirmPasswordInput) {
            console.error("Form elements not found!");
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validasi input
        if (password !== confirmPassword) {
            alert("Password do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Pendaftaran gagal: ${errorData.message}`);
                return;
            }

            alert("Registration successful! Please Sign In.");
            window.location.href = "login.html"; // Redirect ke halaman login
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while trying to register. Please try again later.");
        }
    });

    showPassword.addEventListener("input", (e) => {
        if(e.target.checked) {
            passwordInput.setAttribute("type", "text"); 
            confirmPasswordInput.setAttribute("type", "text");
        } else {
            passwordInput.setAttribute("type", "password");
            confirmPasswordInput.setAttribute("type", "password");
        }
    });
});
