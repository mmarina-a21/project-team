function loadProfilePicture(event) {
  var reader = new FileReader();
  reader.onload = function() {
    var output = document.getElementById('profile-picture');
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function toggleAndUpdateBio() {
    let bioTextElement = document.getElementById('profile-bio');
    let bioEditElement = document.getElementById('bio-edit');
    let bioBtn = document.getElementById('update-bio-btn');

    // Check if we're currently in editing mode
    if (bioEditElement.style.display === 'none' || bioEditElement.style.display === '') {
        bioEditElement.style.display = 'block';
        bioBtn.style.display = 'block'; // Show the update button
        bioTextElement.style.display = 'none'; // Hide the static bio text
    } else {
        let bioText = bioEditElement.value; // Get edited bio text
        let username = JSON.parse(sessionStorage.getItem('user')).username;

        fetch('/update-bio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, bio: bioText })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                bioTextElement.textContent = bioText; // Update the bio text on success
                bioTextElement = document.getElementById('profile-bio');
                
                // Correct session storage update syntax
                let updatedUser = JSON.parse(sessionStorage.getItem('user'));
                updatedUser.bio = bioText;
                sessionStorage.setItem('user', JSON.stringify(updatedUser)); // Update session storage
                
                bioTextElement.style.display = 'block'; // Show the updated bio text
                bioEditElement.style.display = 'none'; // Hide the edit text area
            } else {
                alert('Failed to update bio: ' + data.message);
                // Leave editing mode active if update fails
                bioEditElement.style.display = 'block';
                bioBtn.style.display = 'block';
            }
        })        
        .catch(error => {
            console.error('Error updating bio:', error);
            alert('Error updating bio: ' + error.message);
            // Leave editing mode active if there's an error
            bioEditElement.style.display = 'block';
            bioBtn.style.display = 'block';
        });
    }
}

function uploadProfilePicture() {
  var formData = new FormData();
  formData.append('profilePic', document.getElementById('fileInput').files[0]);
  formData.append('username', JSON.parse(sessionStorage.getItem('user')).username); // Corrected data retrieval from sessionStorage

  fetch('/upload-profile-picture', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      if (data.success) {
          alert('Profile picture uploaded successfully!');
          document.getElementById('profile-picture').src = data.url;
      } else {
          alert('Failed to upload profile picture: ' + data.message);
      }
  })
  .catch(error => {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture: ' + error.message);
  });
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
            const user = JSON.parse(sessionStorage.getItem('user'));
            user.posts = user.posts || []; // Ensure there is an array to push to
            user.posts.push({ Title: title, Content: content }); // Assume this structure matches your backend
            sessionStorage.setItem('user', JSON.stringify(user));
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
    const postsContainer = document.getElementById('posts-list');
    postsContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        // Create elements for the title and content
        const titleElement = document.createElement('h3');
        titleElement.textContent = post.Title;  // Assuming the title property is 'Title'

        const contentElement = document.createElement('p');
        contentElement.textContent = post.Content;  // Assuming the content property is 'Content'

        // Append title and content to the post element
        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);

        // Append the post element to the container
        postsContainer.appendChild(postElement);
    });

    if(posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts to display.</p>'; // Display message if no posts
    }
}

window.onload = function() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData && userData.username) {
        displayPosts(userData.posts || []); // Display posts from session storage
        // Populate user data from sessionStorage
        document.getElementById('profile-username').textContent = userData.username;
        document.getElementById('profile-email').textContent = userData.email;
        document.getElementById('profile-bio').textContent = userData.bio || 'No bio set';
        displayPosts(userData.posts);
        // Fetch and update profile picture
        fetch(`/get-profile-picture?username=${encodeURIComponent(userData.username)}`)
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  document.getElementById('profile-picture').src = data.url;
              } else {
                  console.error('Failed to load profile picture:', data.message);
                  document.getElementById('profile-picture').src = '/uploads/default_profile_picture.png';
              }
          })
          .catch(error => {
              console.error('Error fetching profile picture:', error);
          });
    } else {
        window.location.href = 'authenticator.html'; // Redirect if no user data found
    }
}
