document.addEventListener('DOMContentLoaded', function() {
    fetchPosts();

    function fetchPosts() {
        fetch('/get-all-posts')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.posts) {
                displayPosts(data.posts);
            } else {
                console.error('Failed to load posts');
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }

    function displayPosts(posts) {
        const container = document.getElementById('posts-container');
        container.innerHTML = ''; // Clear existing posts if any
    
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
    
            const titleElement = document.createElement('h3');
            titleElement.textContent = post.Title;
    
            const contentElement = document.createElement('p');
            contentElement.textContent = post.Content;
    
            const userElement = document.createElement('p');
            userElement.textContent = `Posted by: ${post.Username}`;
            userElement.style.fontStyle = 'italic';
            userElement.style.fontSize = 'small';
    
            postElement.appendChild(titleElement);
            postElement.appendChild(contentElement);
            postElement.appendChild(userElement);  // Add the username to the post element
    
            container.appendChild(postElement);
        });
    }    
});

// Get the modal
var modal = document.getElementById('postModal');

// Get the button that opens the modal
var btn = document.getElementById('new-post-btn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const username = JSON.parse(sessionStorage.getItem('user')).username;

    if (!title.trim() || !content.trim()) {
        alert("Please enter both a title and content for the post.");
        return;
    }

    fetch('/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, title, content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Post created successfully!');
            document.getElementById('post-title').value = ''; // Clear the title input
            document.getElementById('post-content').value = ''; // Clear the textarea

            // Optionally, close the modal on successful post creation
            document.getElementById('postModal').style.display = 'none';

            // Update session storage with new post details
            const user = JSON.parse(sessionStorage.getItem('user'));
            user.posts = user.posts || []; // Ensure there is an array to push to
            user.posts.push({ Title: title, Content: content }); // Assume this structure matches your backend
            sessionStorage.setItem('user', JSON.stringify(user));

            // Optionally, refresh the posts displayed on the page
            fetchAndDisplayPosts();
        } else {
            alert('Failed to create post: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error creating post:', error);
        alert('Error creating post: ' + error.message);
    });
}

function fetchAndDisplayPosts() {
    const username = JSON.parse(sessionStorage.getItem('user')).username;
    fetch(`/get-posts?username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            displayPosts(data.posts);
        }
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-list'); // Ensure this ID matches your post container
    postsContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        const titleElement = document.createElement('h3');
        titleElement.textContent = post.Title;
        const contentElement = document.createElement('p');
        contentElement.textContent = post.Content;
        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);
        postsContainer.appendChild(postElement);
    });

    if(posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts to display.</p>';
    }
}
