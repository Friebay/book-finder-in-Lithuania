document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-query').value;
    const response = await fetch(`/api/search-books?query=${query}`);
    const books = await response.json();

    const bookCards = document.getElementById('book-cards');
    bookCards.innerHTML = books.map(book => `
        <div class="book-card">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <p>${new Date(book.published_date).toLocaleDateString()}</p>
        </div>
    `).join('');
});

async function loadNewestBooks() {
    const response = await fetch('/api/newest-books');
    const books = await response.json();

    const newestBooks = document.getElementById('newest-books');
    newestBooks.innerHTML = books.map(book => `<li>${book.title} by ${book.author}</li>`).join('');
}

loadNewestBooks();
