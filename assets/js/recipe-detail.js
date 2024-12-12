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
        window.location.href = 'homepage.html';
        return;
    }

    try {
        // Fetch data detail resep dari backend
        const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            // Handle different types of errors more specifically
            if (response.status === 404) {
                throw new Error('Recipe not found.');
            } else if (response.status === 500) {
                throw new Error('An error occurred on the server.');
            } else {
                throw new Error('Failed to retrieve recipe details.');
            }
        }

        const { recipe } = await response.json();

        // Tampilkan detail resep di halaman
        renderRecipeDetail(recipe);
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
        // Optional: Redirect to homepage on error
        window.location.href = 'homepage.html';
    }
});

// Fungsi untuk merender detail resep ke halaman
function renderRecipeDetail(recipe) {
    const recipeTitle = document.getElementById('recipeTitles');
    const recipeDetail = document.getElementById('recipeDetails');

    // Validasi input
    if (!recipe) {
        alert('Invalid recipe data.');
        window.location.href = 'homepage.html';
        return;
    }

    recipeTitle.textContent = recipe.title || 'Untitled Recipe';

    // Safely parse ingredients and directions
    const ingredients = Array.isArray(recipe.ingredients) 
        ? recipe.ingredients 
        : (recipe.ingredients ? JSON.parse(recipe.ingredients) : ["No ingredients available"]);

    const directions = Array.isArray(recipe.directions)
        ? recipe.directions
        : (recipe.directions ? JSON.parse(recipe.directions) : ["No directions available"]);

    // Render the recipe details
    recipeDetail.innerHTML = `
        <div class="row align-items-start">
            <!-- Bagian kiri: gambar -->
            <div class="col-md-4 text-center">
                <img src="${recipe.image || 'https://via.placeholder.com/800'}" 
                     alt="${recipe.title}" 
                     class="detail-image img-fluid" 
                     onerror="this.src='https://via.placeholder.com/800'">
            </div>
            <!-- Bagian kanan: detail resep -->
            <div class="col-md-8">
                <p><strong>INGREDIENTS:</strong></p>
                <ul class="list-unstyled">
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <p><strong>DIRECTIONS:</strong></p>
                <ol>
                    ${directions.map(direction => `<li>${direction}</li>`).join('')}
                </ol>
                <a href="homepage.html" class="btn btn-primary mt-3">Back</a>
            </div>
        </div>
    `;
}