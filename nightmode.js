document.addEventListener('DOMContentLoaded', function() {
  const nightModeSwitches = document.querySelectorAll('.night-mode-switch');
  const body = document.body;
  
  // Initialize the night mode state based on localStorage
  const nightModeOn = localStorage.getItem('nightMode') === 'true';
  nightModeSwitches.forEach(checkbox => checkbox.checked = nightModeOn);
  body.classList.toggle('night-mode', nightModeOn);

  // Function to handle change for all switches
  const handleSwitchChange = (isNightMode) => {
    body.classList.toggle('night-mode', isNightMode);
    localStorage.setItem('nightMode', isNightMode);
    nightModeSwitches.forEach(checkbox => checkbox.checked = isNightMode);
  };

  // Event listener for changes on all switches
  nightModeSwitches.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      handleSwitchChange(this.checked);
    });
  });

  // Event listener for external changes in localStorage
  window.addEventListener('storage', function(event) {
    if (event.key === 'nightMode') {
      const nightModeOn = event.newValue === 'true';
      nightModeSwitches.forEach(checkbox => checkbox.checked = nightModeOn);
      body.classList.toggle('night-mode', nightModeOn);
    }
  });
});
