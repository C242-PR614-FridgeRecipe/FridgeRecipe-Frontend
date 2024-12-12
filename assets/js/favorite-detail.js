document.addEventListener('DOMContentLoaded', async () => {
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
            window.location.href = 'login.html'; // Redirect ke halaman login
        });
    } else {
        // Jika pengguna belum login, pastikan tetap ke halaman login
        authLink.textContent = 'Sign In';
        authLink.href = 'login.html';
        authLink.classList.remove('logout');
    }
    // Ambil recipeId dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipeId');

    if (!recipeId) {
        alert('Recipe ID not found.');
        window.location.href = 'favorite.html';
        return;
    }

    try {
        // Ambil token dari localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You are not logged in yet. Please Sign In first.');
        }

        // Fetch data detail resep dari backend
        const response = await fetch(`http://localhost:5000/api/user/favorite/${recipeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve recipe details.');
        }

        const recipe = await response.json();

        // Tampilkan detail resep di halaman
        renderRecipeDetail(recipe);
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
});

// Fungsi untuk merender detail resep ke halaman
function renderRecipeDetail(recipe) {
    const recipeTitle = document.getElementById('recipeTitle');
    const recipeDetail = document.getElementById('recipeDetail');

    recipeTitle.textContent = recipe.title;

    recipeDetail.innerHTML = `
        <div class="row align-items-start">
            <!-- Bagian kiri: gambar -->
            <div class="col-md-4 text-center">
                <img src="${recipe.image || 'https://via.placeholder.com/800'}" alt="${recipe.title}" class="detail-image">
            </div>
            <!-- Bagian kanan: detail resep -->
            <div class="col-md-8">
                <p><strong>INGREDIENTS :</strong></p>
                <p>${recipe.ingredients}</p>
                <p><strong>DIRECTIONS :</strong></p>
                <p>${recipe.directions}</p>
                <a href="favorit.html" class="btn btn-primary mt-3">Back</a>
            </div>
        </div>
    `;
}
