function loadProfilePicture(event) {
    var reader = new FileReader();
    reader.onload = function() {
      var output = document.getElementById('profile-picture');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
