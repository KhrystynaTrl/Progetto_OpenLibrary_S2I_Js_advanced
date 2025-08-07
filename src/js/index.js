// Open Library Search Application
import axios from 'axios';

class BookSearchApp {
  constructor() {
    this.form = document.querySelector('form');
    this.searchInput = document.querySelector('#book-search');
    this.resultsContainer = document.querySelector('#search-results');
    this.init();
  }

  init() {
    // Prevent default form submission and handle search
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    // Results container already exists in HTML

    // Add real-time search with debouncing
    let searchTimeout;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (e.target.value.trim().length > 2) {
          this.handleSearch();
        }
      }, 300);
    });
  }

  // Removed createResultsContainer - results container exists in HTML

  async handleSearch() {
    const query = this.searchInput.value.trim();
    
    if (!query) {
      this.showError('Please enter a search term');
      return;
    }

    this.showLoading();

    try {
      const books = await this.searchBooks(query);
      this.displayResults(books);
    } catch (error) {
      console.error('Search error:', error);
      this.showError('Failed to search books. Please try again.');
    }
  }

  async searchBooks(query) {
    // Using Open Library Search API
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query,
        limit: 10,
        fields: 'key,title,author_name,first_publish_year,isbn,cover_i'
      },
      timeout: 10000 // 10 second timeout
    });

    return response.data.docs || [];
  }

  showLoading() {
    this.resultsContainer.innerHTML = '<div class="loading">Searching books...</div>';
  }

  showError(message) {
    this.resultsContainer.innerHTML = `<div class="error">${message}</div>`;
  }

  displayResults(books) {
    if (books.length === 0) {
      this.resultsContainer.innerHTML = '<div class="no-results">No books found. Try a different search term.</div>';
      return;
    }

    const resultsHTML = books.map(book => {
      const title = book.title || 'Unknown Title';
      const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
      const year = book.first_publish_year || 'Unknown Year';
      const coverUrl = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null;

      return `
        <div class="book-item">
          ${coverUrl ? `<img src="${coverUrl}" alt="${title} cover" class="book-cover">` : '<div class="no-cover">No Cover</div>'}
          <div class="book-info">
            <h3 class="book-title">${this.escapeHtml(title)}</h3>
            <p class="book-author">by ${this.escapeHtml(authors)}</p>
            <p class="book-year">Published: ${year}</p>
          </div>
        </div>
      `;
    }).join('');

    this.resultsContainer.innerHTML = `
      <h2>Search Results (${books.length} found)</h2>
      <div class="books-grid">
        ${resultsHTML}
      </div>
    `;
  }

  // Security fix: Escape HTML to prevent XSS attacks
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookSearchApp();
});