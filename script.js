// Array to hold the bookmarks
let bookmarks = [];

// Function to add a new bookmark
function addBookmark() {
    const url = document.getElementById('url').value;
    const name = document.getElementById('name').value;
    const categoryInput = document.getElementById('category').value.trim();

    // Check if all inputs are filled
    if (url === '' || name === '' || categoryInput === '') {
        alert('Please enter both URL, name, and a category.');
        return;
    }

    // Determine the category
    let category = categoryInput;
    if (category.toLowerCase() === 'custom') {
        category = prompt('Enter custom category:');
    }

    // Fetch favicon from the URL
    const icon = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

    // Create a new bookmark object
    const bookmark = {
        name: name,
        url: url,
        category: category,
        icon: icon
    };

    // Add the bookmark to the array
    bookmarks.push(bookmark);

    // Save bookmarks to localStorage for persistence across page reloads
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Clear the input fields after adding the bookmark
    document.getElementById('url').value = '';
    document.getElementById('name').value = '';
    document.getElementById('category').value = '';

    // Re-render the bookmarks list to display the newly added bookmark
    renderBookmarks();
}

// Function to delete a bookmark
function deleteBookmark(url) {
    // Filter out the bookmark with the given URL
    bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);

    // Update localStorage with the new bookmarks array
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Re-render the bookmarks list to reflect the deletion
    renderBookmarks();
}

// Function to render the bookmarks list on the page
function renderBookmarks() {
    const bookmarksList = document.getElementById('bookmarks-list');
    bookmarksList.innerHTML = '';

    // Load bookmarks from localStorage and update the array
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks = storedBookmarks;

    // Group bookmarks by category
    const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
        if (!acc[bookmark.category]) {
            acc[bookmark.category] = [];
        }
        acc[bookmark.category].push(bookmark);
        return acc;
    }, {});

    // Display each category and its bookmarks
    for (const [category, bookmarks] of Object.entries(groupedBookmarks)) {
        const categoryHeader = document.createElement('h2');
        categoryHeader.textContent = category;
        bookmarksList.appendChild(categoryHeader);

        bookmarks.forEach(bookmark => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${bookmark.url}" target="_blank">
                    <img src="${bookmark.icon}" alt="${bookmark.name} icon" class="icon" />
                    ${bookmark.name}
                </a>
                <button class="delete-btn" onclick="deleteBookmark('${bookmark.url}')">Delete</button>
            `;
            bookmarksList.appendChild(li);
        });
    }
}

// Initialize bookmarks list on page load
document.addEventListener('DOMContentLoaded', renderBookmarks);
