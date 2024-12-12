document.addEventListener('DOMContentLoaded', async () => {
  const authLink = document.getElementById('authLink');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn) {
      authLink.textContent = 'Sign Out';
      authLink.href = '#';
      authLink.classList.add('logout');
      authLink.addEventListener('click', function (e) {
          e.preventDefault();
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('authToken');
          alert('You have been Sign Out.');
          window.location.href = 'login.html';
      });

      fetchFavorites();
  } else {
      authLink.textContent = 'Sign In';
      authLink.href = 'login.html';
      authLink.classList.remove('logout');
      alert('You must sign in to view the page.');
      window.location.href = 'login.html';
  }

  async function fetchFavorites() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You are not logged in yet. Please sign in first.');
        }

        const response = await fetch('http://localhost:5000/api/user/favorite', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: Token is invalid or has expired.');
            }
            throw new Error('You do not have a favorite recipe');
        }

        const data = await response.json();
        console.log('Data dari API:', data); // Debug log

        // Jika data memiliki properti 'favorites', ambil array-nya
        const favorites = Array.isArray(data) ? data : data.favorites;
        if (!Array.isArray(favorites)) {
            throw new Error('Invalid favorite data.');
        }

        renderFavorites(favorites);
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
}

function renderFavorites(favorites) {
    const favoriteList = document.getElementById('favoritesContainer');
    favoriteList.innerHTML = ''; // Kosongkan kontainer sebelum menambahkan konten baru

    favorites.forEach((favorite) => {
            const listItem = document.createElement('div');
            listItem.className = 'col-md-4 mb-4';
            listItem.innerHTML = `
                <div class="card">
                    <img src="${favorite.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${favorite.title}">
                    <div class="card-body">
                        <h5 class="card-title text-center fw-bold fs-4">${favorite.title}</h5>
                         <div class="ingredients-section">
                            <p class="section-title"><strong>Ingredients:</strong></p>
                            <p>${favorite.ingredients}</p>
                        </div>
                        <a href="favorite-detail.html?recipeId=${favorite.id}" class="btn btn-primary">Details</a>
                        <button class="btn btn-danger delete-btn" data-id="${favorite.id}">Remove</button>
                    </div>
                </div>
            `;
    
            favoriteList.appendChild(listItem);
        });

    // Menambahkan event listener untuk tombol hapus
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.getAttribute('data-id'); // Ambil recipeId dari atribut data-id
            console.log('Deleting recipeId:', recipeId); // Debug log untuk memastikan recipeId yang benar
            if (recipeId) {
                deleteFavorite(recipeId); // Pastikan hanya memanggil deleteFavorite jika recipeId ada
            } else {
                console.error('recipeId tidak ditemukan!');
            }
        });
    });

    const detailButtons = document.querySelectorAll('.detail-btn');
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.getAttribute('data-id'); // Ambil recipeId dari atribut data-id
            console.log(' recipeId:', recipeId); // Debug log untuk memastikan recipeId yang benar
            if (recipeId) {
                detailFavorite(recipeId); // Pastikan hanya memanggil deleteFavorite jika recipeId ada
            } else {
                console.error('recipeId tidak ditemukan!');
            }
        });
    });
}

// Fungsi untuk menghapus resep favorit
async function deleteFavorite(recipeId) {
    console.log('Deleting recipeId:', recipeId); // Pastikan recipeId yang benar dikirim

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You are not logged in yet. Please Sign In first.');
        }

        const response = await fetch(`http://localhost:5000/api/user/favorite/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Response Status:', response.status); // Log status HTTP

        if (!response.ok) {
            throw new Error('Failed to delete a favorite recipe.');
        }

        alert('Resep favorit berhasil dihapus.');
        fetchFavorites(); // Memperbarui daftar favorit setelah menghapus
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
}
});
