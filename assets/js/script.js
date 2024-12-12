document.getElementById('ingredientForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const ingredientsInput = document.getElementById('ingredients').value.trim();
    const query = ingredientsInput.split(',').map(item => item.trim()).join(',');
    const endpoint = `http://localhost:5000/api/recipes/search?ingredients=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(endpoint, { 
            method: "GET" 
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data from server.");
        }

        const data = await response.json();
        console.log("Raw data:", data);

        // Ambil array dari properti recipes
        
        const recipes = data.recipes || [];

        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = "";

        if (recipes.length === 0) {
            resultContainer.innerHTML = '<p>No recipes found.</p>';
        } else {
            resultContainer.innerHTML = '<div class="row">';  // Start of row to group items in columns
        
            recipes.forEach(recipe => {
                // Konversi ingredients menjadi daftar string dengan simbol "-"
                const ingredientsList = Array.isArray(recipe.ingredients)
                    ? recipe.ingredients.map(ingredient => `- ${ingredient.trim()}`).join('<br>') // Jika sudah array
                    : recipe.ingredients.split(',').map(item => `- ${item.trim()}`).join('<br>'); // Jika string, ubah jadi array
            
                resultContainer.innerHTML += 
                `
                    <div class="row mb-3">
                        <!-- Bagian kiri: gambar -->
                        <div class="col-md-4 mt-3 text-center">
                            <img src="${recipe.image || 'https://via.placeholder.com/800'}" alt="${recipe.title}" class="detail-image">
                        </div>
                        <!-- Bagian kanan: detail resep -->
                        <div class="col-md-8">
                            <p class="mt-3"><strong>${recipe.title}</strong></p>
                            <p class="mt-3"><strong>Ingredients:</strong></p>
                            <p>${ingredientsList}</p> <!-- Menampilkan daftar bahan tanpa elemen ul -->
                            <a href="recipe-detail.html?recipeId=${recipe.id}" class="btn btn-primary">View Recipe</a>
                            <button class="btn btn-success add-to-favorite" data-recipe-id="${recipe.id}">Add to Favorite</button>
                        </div>
                    </div>
                `;
            });
            
            resultContainer.innerHTML += '</div>';  // End of row
            resultContainer.classList.add('loaded');

            const favoriteButtons = document.querySelectorAll('.add-to-favorite');
            favoriteButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const recipeId = e.target.getAttribute('data-recipe-id');
                    await addToFavorite(recipeId);
                });
            });
        }

        const detailButtons = document.querySelectorAll('.detail-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const recipeId = e.target.getAttribute('data-recipe-id'); // Ambil recipeId dari atribut data-id
                console.log('detail recipeId:', recipeId); // Debug log untuk memastikan recipeId yang benar
                if (recipeId) {
                    detailFavorite(recipeId); // Pastikan hanya memanggil deleteFavorite jika recipeId ada
                } else {
                    console.error('recipeId tidak ditemukan!');
                }
            });
        });
        
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('resultContainer').innerHTML = `<p class="text-danger">An error occurred: ${error.message}</p>`;
    }
});

// Fungsi untuk menambahkan resep ke favorit
const addToFavorite = async (recipeId) => {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
    if (!token) {
        alert('Please login to add favorites!');
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/user/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ recipeId }),
        });
        
        const data = await response.json();
        console.log('Response from server:', data); // Tambahkan ini untuk memeriksa response

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add to favorites');
        }

        alert(data.message || 'Recipe added to favorites!');
    } catch (error) {
        console.error('Error adding to favorites:', error);
        alert('Sign In First');
    }
};

document.addEventListener('DOMContentLoaded', function () {
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
});