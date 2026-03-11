var AVENTURE = AVENTURE || {};

AVENTURE.scenarioEngine = (function() {
  function getScenario(id) {
    for (var i = 0; i < AVENTURE.scenarios.length; i++) {
      if (AVENTURE.scenarios[i].id === id) return AVENTURE.scenarios[i];
    }
    return null;
  }

  function getScene(scenario, sceneId) {
    for (var i = 0; i < scenario.scenes.length; i++) {
      if (scenario.scenes[i].id === sceneId) return scenario.scenes[i];
    }
    return null;
  }

  function countScenesInBranch(scenario, startSceneId) {
    var count = 0;
    var scene = getScene(scenario, startSceneId);
    var visited = {};
    while (scene && !visited[scene.id]) {
      visited[scene.id] = true;
      count++;
      if (scene.fin) break;
      if (scene.choix && scene.choix.length > 0) {
        scene = getScene(scenario, scene.choix[0].suite);
      } else {
        break;
      }
    }
    return count;
  }

  return {
    startScenario: function(scenarioId) {
      var scenario = getScenario(scenarioId);
      if (!scenario) return null;
      var state = AVENTURE.gameState.get();
      state.currentScenario = scenarioId;
      state.currentScene = scenario.scenes[0].id;
      AVENTURE.gameState.save();
      return this.getCurrentScene();
    },

    getCurrentScene: function() {
      var state = AVENTURE.gameState.get();
      if (!state.currentScenario || !state.currentScene) return null;
      var scenario = getScenario(state.currentScenario);
      if (!scenario) return null;
      return getScene(scenario, state.currentScene);
    },

    getCurrentScenario: function() {
      var state = AVENTURE.gameState.get();
      if (!state.currentScenario) return null;
      return getScenario(state.currentScenario);
    },

    makeChoice: function(choiceIndex) {
      var state = AVENTURE.gameState.get();
      var scenario = getScenario(state.currentScenario);
      var scene = getScene(scenario, state.currentScene);
      if (!scene || !scene.choix || !scene.choix[choiceIndex]) return null;

      var choice = scene.choix[choiceIndex];

      // Record the choice
      AVENTURE.gameState.recordChoice(
        state.currentScenario,
        state.currentScene,
        choiceIndex,
        choice.tags
      );

      // Add tags to profile
      AVENTURE.gameState.addToProfile(choice.tags);

      // Add points
      var points = 0;
      var tagKeys = Object.keys(choice.tags);
      for (var i = 0; i < tagKeys.length; i++) {
        points += choice.tags[tagKeys[i]] * 5;
      }
      AVENTURE.gameState.addPoints(points);

      // Move to next scene
      if (choice.suite) {
        state.currentScene = choice.suite;
        AVENTURE.gameState.save();
      }

      return this.getCurrentScene();
    },

    isScenarioComplete: function() {
      var scene = this.getCurrentScene();
      return scene && scene.fin === true;
    },

    endScenario: function() {
      var state = AVENTURE.gameState.get();
      var scenarioId = state.currentScenario;

      // Bonus points for completing a scenario
      AVENTURE.gameState.addPoints(20);

      // Mark scenario as completed
      AVENTURE.gameState.completeScenario(scenarioId);

      // Check badges
      return this.checkBadges();
    },

    checkBadges: function() {
      var state = AVENTURE.gameState.get();
      var newBadges = [];

      for (var i = 0; i < AVENTURE.badges.length; i++) {
        var badge = AVENTURE.badges[i];
        if (AVENTURE.gameState.hasBadge(badge.id)) continue;

        var earned = false;
        switch(badge.condition.type) {
          case 'scenariosCompleted':
            earned = state.scenariosCompleted.length >= badge.condition.count;
            break;
          case 'careersViewed':
            earned = state.careersViewed.length >= badge.condition.count;
            break;
          case 'specificScenario':
            earned = state.scenariosCompleted.indexOf(badge.condition.scenarioId) !== -1;
            break;
          case 'points':
            earned = state.totalPoints >= badge.condition.count;
            break;
        }

        if (earned) {
          AVENTURE.gameState.earnBadge(badge.id);
          newBadges.push(badge);
        }
      }

      return newBadges;
    },

    getSceneProgress: function() {
      var state = AVENTURE.gameState.get();
      var scenario = getScenario(state.currentScenario);
      if (!scenario) return { current: 0, total: 0 };

      // Count how many choices were made in this scenario
      var choicesInScenario = 0;
      for (var i = 0; i < state.choicesHistory.length; i++) {
        if (state.choicesHistory[i].scenarioId === state.currentScenario) {
          choicesInScenario++;
        }
      }

      // Estimate total (branch usually has 2-3 scenes)
      return {
        current: choicesInScenario + 1,
        total: choicesInScenario + (this.isScenarioComplete() ? 0 : 1) + 1
      };
    },

    getScenarioList: function() {
      var state = AVENTURE.gameState.get();
      return AVENTURE.scenarios.map(function(s) {
        return {
          id: s.id,
          titre: s.titre,
          description: s.description,
          secteur: s.secteur,
          icon: s.icon,
          completed: state.scenariosCompleted.indexOf(s.id) !== -1
        };
      });
    }
  };
})();
