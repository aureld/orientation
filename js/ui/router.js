var AVENTURE = AVENTURE || {};

AVENTURE.router = (function() {
  var currentScreen = null;
  var container = null;

  function parseHash() {
    var hash = window.location.hash || '#accueil';
    var parts = hash.slice(1).split('/');
    return {
      screen: parts[0] || 'accueil',
      param: parts[1] || null
    };
  }

  function route() {
    if (!container) container = document.getElementById('app');
    var parsed = parseHash();
    var screen = parsed.screen;
    var param = parsed.param;

    // Fade out current content
    container.classList.remove('fade-enter');
    container.classList.add('fade-exit');

    setTimeout(function() {
      container.innerHTML = '';
      container.classList.remove('fade-exit');

      switch(screen) {
        case 'accueil':
          AVENTURE.screens.renderHome(container);
          break;
        case 'scenarios':
          AVENTURE.screens.renderMap(container);
          break;
        case 'scenario':
          AVENTURE.screens.renderScenario(container, param);
          break;
        case 'scenario-fin':
          AVENTURE.screens.renderScenarioEnd(container, param);
          break;
        case 'resultats':
          AVENTURE.screens.renderResults(container);
          break;
        case 'metier':
          AVENTURE.screens.renderCareer(container, param);
          break;
        case 'profil':
          AVENTURE.screens.renderProfile(container);
          break;
        case 'tous-metiers':
          AVENTURE.screens.renderAllCareers(container);
          break;
        default:
          AVENTURE.screens.renderHome(container);
      }

      container.classList.add('fade-enter');
      window.scrollTo(0, 0);
    }, 200);
  }

  return {
    init: function() {
      container = document.getElementById('app');
      window.addEventListener('hashchange', route);
      route();
    },

    navigate: function(hash) {
      window.location.hash = hash;
    },

    getCurrentScreen: function() {
      return parseHash().screen;
    }
  };
})();
