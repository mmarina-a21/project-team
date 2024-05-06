function loadProfilePicture(event) {
  var reader = new FileReader();
  reader.onload = function() {
    var output = document.getElementById('profile-picture');
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

window.onload = function() {
  const userData = JSON.parse(sessionStorage.getItem('user'));
  if (userData) {
      document.getElementById('profile-username').textContent = userData.username;
      document.getElementById('profile-email').textContent = userData.email;
  } else {
      window.location.href = 'authenticator.html'; // Redirect if no user data found
  }
}

window.onload = function() {
  const userData = JSON.parse(sessionStorage.getItem('user'));
  if (userData && userData.username) {
      document.getElementById('profile-username').textContent = userData.username;
      document.getElementById('profile-email').textContent = userData.email;

      // Fetch and update profile picture
      fetch(`/get-profile-picture?username=${encodeURIComponent(userData.username)}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);  // Check what is returned
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
      window.location.href = 'authenticator.html';  // Redirect if no user data found
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

