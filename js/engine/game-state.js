var AVENTURE = AVENTURE || {};

AVENTURE.gameState = (function() {
  var SAVE_KEY = 'aventure_metier_save';
  var SAVE_VERSION = 1;

  var defaultState = {
    playerName: '',
    profil: {
      manuel: 0,
      intellectuel: 0,
      creatif: 0,
      analytique: 0,
      interieur: 0,
      exterieur: 0,
      equipe: 0,
      independant: 0,
      contactHumain: 0,
      technique: 0,
      routine: 0,
      variete: 0
    },
    scenariosCompleted: [],
    currentScenario: null,
    currentScene: null,
    choicesHistory: [],
    careersViewed: [],
    badges: [],
    darkMode: false,
    totalPoints: 0
  };

  var state = JSON.parse(JSON.stringify(defaultState));

  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  return {
    get: function() {
      return state;
    },

    set: function(key, value) {
      state[key] = value;
      this.save();
    },

    addToProfile: function(tags) {
      var keys = Object.keys(tags);
      for (var i = 0; i < keys.length; i++) {
        if (state.profil.hasOwnProperty(keys[i])) {
          state.profil[keys[i]] += tags[keys[i]];
        }
      }
      this.save();
    },

    addPoints: function(pts) {
      state.totalPoints += pts;
      this.save();
    },

    completeScenario: function(scenarioId) {
      if (state.scenariosCompleted.indexOf(scenarioId) === -1) {
        state.scenariosCompleted.push(scenarioId);
      }
      state.currentScenario = null;
      state.currentScene = null;
      this.save();
    },

    recordChoice: function(scenarioId, sceneId, choiceIndex, tags) {
      state.choicesHistory.push({
        scenarioId: scenarioId,
        sceneId: sceneId,
        choiceIndex: choiceIndex,
        tags: tags,
        timestamp: Date.now()
      });
      this.save();
    },

    viewCareer: function(professionId) {
      if (state.careersViewed.indexOf(professionId) === -1) {
        state.careersViewed.push(professionId);
        this.save();
      }
    },

    earnBadge: function(badgeId) {
      if (state.badges.indexOf(badgeId) === -1) {
        state.badges.push(badgeId);
        this.save();
        return true;
      }
      return false;
    },

    hasBadge: function(badgeId) {
      return state.badges.indexOf(badgeId) !== -1;
    },

    save: function() {
      try {
        var data = {
          version: SAVE_VERSION,
          savedAt: new Date().toISOString(),
          state: state
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      } catch(e) {
        // localStorage might be full or unavailable
      }
    },

    load: function() {
      try {
        var raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        var data = JSON.parse(raw);
        if (data.version === SAVE_VERSION && data.state) {
          state = data.state;
          // Ensure all profile keys exist (forward compat)
          var defaultKeys = Object.keys(defaultState.profil);
          for (var i = 0; i < defaultKeys.length; i++) {
            if (!state.profil.hasOwnProperty(defaultKeys[i])) {
              state.profil[defaultKeys[i]] = 0;
            }
          }
          return true;
        }
      } catch(e) {}
      return false;
    },

    hasSave: function() {
      try {
        return localStorage.getItem(SAVE_KEY) !== null;
      } catch(e) {
        return false;
      }
    },

    reset: function() {
      state = deepCopy(defaultState);
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch(e) {}
    },

    toggleDarkMode: function() {
      state.darkMode = !state.darkMode;
      document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : '');
      this.save();
    },

    applyTheme: function() {
      document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : '');
    }
  };
})();
