// JavaScript: nightmode.js

// This function will be used to update the night mode switches' positions
function updateSwitchPositions(isNightMode) {
  document.querySelectorAll('.night-mode-switch').forEach(sw => {
    sw.checked = isNightMode;
  });
}

// This function sets the theme based on the night mode status
function applyTheme(isNightMode) {
  const bodyClassList = document.body.classList;
  isNightMode ? bodyClassList.add('night-mode') : bodyClassList.remove('night-mode');
}

// This function will be called to synchronize the theme and switch positions across pages
function synchronizeTheme() {
  const isNightMode = localStorage.getItem('nightMode') === 'true';
  applyTheme(isNightMode);
  updateSwitchPositions(isNightMode);
}

document.addEventListener('DOMContentLoaded', function() {
  synchronizeTheme(); // Apply the correct theme and switch positions when the document is loaded

  // Add event listeners to all switches
  document.querySelectorAll('.night-mode-switch').forEach(sw => {
    sw.addEventListener('change', function() {
      const isNightMode = this.checked;
      localStorage.setItem('nightMode', isNightMode);
      applyTheme(isNightMode);
      updateSwitchPositions(isNightMode);
    });
  });

  // Listen for storage changes to update the theme if it's changed in another tab
  window.addEventListener('storage', function(event) {
    if (event.key === 'nightMode') {
      synchronizeTheme();
    }
  });
});
