var AVENTURE = AVENTURE || {};

(function() {
  // Load saved state if it exists
  AVENTURE.gameState.load();

  // Apply theme
  AVENTURE.gameState.applyTheme();

  // Initialize router
  AVENTURE.router.init();
})();
