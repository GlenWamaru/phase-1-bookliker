document.addEventListener("DOMContentLoaded", function () {
    const bookList = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    let currentUser; // Store the current user here

    // Function to fetch and display the list of books when the page loads
    function fetchBooks() {
        fetch("http://localhost:4000/books")
            .then(response => response.json())
            .then(books => {
                books.forEach(book => {
                    const li = document.createElement("li");
                    li.textContent = book.title;
                    li.addEventListener("click", () => showBookDetails(book));
                    bookList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching books:", error));
    }

    // Function to display book details
    function showBookDetails(book) {
        // Clear previous details
        showPanel.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = book.title;

        const thumbnail = document.createElement("img");
        thumbnail.src = book.thumbnail;

        const description = document.createElement("p");
        description.textContent = book.description;

        const likeButton = document.createElement("button");
        likeButton.textContent = "Like";
        likeButton.addEventListener("click", () => likeBook(book));

        const likedBy = document.createElement("div");
        likedBy.textContent = "Liked by:";

        book.users.forEach(user => {
            const userSpan = document.createElement("span");
            userSpan.textContent = user.username;
            likedBy.appendChild(userSpan);
        });

        showPanel.appendChild(title);
        showPanel.appendChild(thumbnail);
        showPanel.appendChild(description);
        showPanel.appendChild(likeButton);
        showPanel.appendChild(likedBy);
    }

    // Function to like a book
    function likeBook(book) {
        if (!currentUser) {
            console.error("User not selected.");
            return;
        }

        if (!book.users.find(user => user.id === currentUser.id)) {
            book.users.push(currentUser);
        } else {
            book.users = book.users.filter(user => user.id !== currentUser.id);
        }

        // Update the book's likedBy list in the DOM
        const likedBy = showPanel.querySelector("div");
        likedBy.innerHTML = "Liked by:";

        book.users.forEach(user => {
            const userSpan = document.createElement("span");
            userSpan.textContent = user.username;
            likedBy.appendChild(userSpan);
        });

        // Send a PATCH request to update the server
        fetch(`http://localhost:4000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ users: book.users }),
        })
            .then(response => response.json())
            .then(updatedBook => {
                // Optionally, you can update the book data in your client-side data here
                // For example, you can update the currentUser's liked books
            })
            .catch(error => console.error("Error liking the book:", error));
    }

    // Implement user selection logic (prompt, login form, etc.)
    // Store the selected user in the 'currentUser' variable

    // Fetch books on page load
    fetchBooks();
});
