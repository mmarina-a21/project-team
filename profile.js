<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile Page</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" type="image/png" href="Images/logo.ico">
</head>
<body>
  <header>
    <nav id="main-nav">
        <ul>
            <div id="logo-container">
                <a href="index.html">
                    <img src="Images/logo.png" alt="Yapatron Logo" id="logo">
                </a>
            </div>
            <li><a href="index.html">Forums</a></li>
            <li><a href="profile.html">Profile</a></li>
            <li><a href="communities.html">Communities</a></li>
            <li><a href="authenticator.html">Log in / Sign up</a></li>
            <li>
                <input type="search" id="search" placeholder="Search">
            </li> 
            <div id="theme-switch-wrapper-main" class="theme-switch-wrapper">
                <label class="theme-switch">
                    <input type="checkbox" class="night-mode-switch" />
                    <div class="slider round"></div>
                </label>
              </div>
        </ul>
    </nav>          
</header>
<main>
    <div class="profile-container">
      <h1>Profile</h1>
      <div class="profile-picture-container">
          <form id="uploadForm" enctype="multipart/form-data">
              <input type="file" id="fileInput" name="profilePic" accept="image/*" onchange="uploadProfilePicture()" style="display: none;">
              <button type="button" onclick="document.getElementById('fileInput').click();">Upload Picture</button>
          </form>
          <img id="profile-picture" src="/uploads/default_profile_picture.png" alt="Profile Picture">
      </div>
      <div class="profile-details">
          <p><strong>Username:</strong> <span id="profile-username"></span></p>
          <p><strong>Email:</strong> <span id="profile-email"></span></p>
      </div>
  </div>
</main>
<footer>
    <p>© 2024 Yapatron. All rights reserved.</p>
</footer>
<script src="js/profile.js"></script> 
<script src="js/nightmode.js"></script>
</body>
</html>
