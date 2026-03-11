var AVENTURE = AVENTURE || {};

AVENTURE.screens = (function() {
  var C = AVENTURE.components;

  function el(tag, className, innerHTML) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (innerHTML) e.innerHTML = innerHTML;
    return e;
  }

  return {
    // ===== HOME =====
    renderHome: function(container) {
      var screen = el('div', 'home-screen');

      // Theme toggle
      var toggle = C.themeToggle();
      toggle.className = 'btn-icon';
      toggle.style.position = 'absolute';
      toggle.style.top = '16px';
      toggle.style.right = '16px';
      screen.appendChild(toggle);

      screen.appendChild(el('div', 'logo', '\u2708\ufe0f\ud83c\udfd7\ufe0f\ud83d\udcbb\ud83c\udf73\ud83c\udf3e'));
      screen.appendChild(el('h1', '', 'Aventure Metier'));
      screen.appendChild(el('p', 'subtitle', 'Decouvre ton futur metier en vivant des aventures !'));

      var inputGroup = el('div', 'input-group');
      var input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Ton prenom...';
      input.id = 'player-name';
      var state = AVENTURE.gameState.get();
      if (state.playerName) input.value = state.playerName;
      inputGroup.appendChild(input);
      screen.appendChild(inputGroup);

      var actions = el('div', 'home-actions');

      var startBtn = el('button', 'btn btn-primary pulse');
      startBtn.textContent = "Commencer l'aventure";
      startBtn.onclick = function() {
        var name = document.getElementById('player-name').value.trim();
        if (!name) {
          input.style.borderColor = 'var(--danger)';
          input.placeholder = 'Entre ton prenom !';
          return;
        }
        AVENTURE.gameState.set('playerName', name);
        AVENTURE.router.navigate('#scenarios');
      };
      actions.appendChild(startBtn);

      if (AVENTURE.gameState.hasSave() && state.scenariosCompleted.length > 0) {
        var contBtn = el('button', 'btn btn-secondary');
        contBtn.textContent = 'Continuer ma partie';
        contBtn.onclick = function() {
          AVENTURE.router.navigate('#scenarios');
        };
        actions.appendChild(contBtn);
      }

      screen.appendChild(actions);

      var footer = el('div', 'home-footer');
      var aboutBtn = el('button', '', 'A propos');
      aboutBtn.onclick = function() {
        alert("Aventure Metier — Un jeu d'orientation professionnelle base sur les donnees de orientation.ch.\n\nConcu pour les jeunes du Canton de Zurich.\n\n33 metiers suisses reels (CFC/AFP)\n11 scenarios immersifs\n\nBonne exploration !");
      };
      footer.appendChild(aboutBtn);
      var resetBtn = el('button', '', 'Recommencer');
      resetBtn.onclick = function() {
        if (confirm('Tu es sur ? Toute ta progression sera effacee.')) {
          AVENTURE.gameState.reset();
          AVENTURE.router.navigate('#accueil');
        }
      };
      footer.appendChild(resetBtn);
      screen.appendChild(footer);

      container.appendChild(screen);
    },

    // ===== SCENARIO MAP =====
    renderMap: function(container) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var state = AVENTURE.gameState.get();
      var scenarios = AVENTURE.scenarioEngine.getScenarioList();
      var completed = state.scenariosCompleted.length;

      // Header
      var actions = el('div', 'header-actions');
      actions.appendChild(C.pointsDisplay());
      actions.appendChild(C.themeToggle());
      cont.appendChild(C.headerBar('AVENTURE METIER', false, actions));

      // Welcome
      var welcome = el('div', '', '');
      welcome.style.padding = '0 0 8px';
      welcome.innerHTML = '<h2>Salut ' + (state.playerName || 'aventurier') + ' !</h2><p>Choisis un scenario et vis une journee dans un nouveau metier.</p>';
      cont.appendChild(welcome);

      // Progress
      cont.appendChild(C.progressBar(completed, scenarios.length, 'Progression'));
      cont.appendChild(el('div', 'spacer-md'));

      // Grid
      var grid = el('div', 'scenario-grid');
      for (var i = 0; i < scenarios.length; i++) {
        (function(s) {
          var card = el('div', 'scenario-card' + (s.completed ? ' completed' : ''));
          card.setAttribute('data-sector', s.secteur);
          card.innerHTML = '<span class="icon">' + s.icon + '</span>' +
            '<div class="name">' + s.titre + '</div>' +
            '<div class="sector">' + s.secteur + '</div>';
          card.onclick = function() {
            AVENTURE.scenarioEngine.startScenario(s.id);
            AVENTURE.router.navigate('#scenario/' + s.id);
          };
          grid.appendChild(card);
        })(scenarios[i]);
      }
      cont.appendChild(grid);

      cont.appendChild(el('div', 'spacer-md'));

      // Results button
      if (completed >= 3) {
        var resBtn = el('button', 'btn btn-primary');
        resBtn.style.width = '100%';
        resBtn.textContent = 'Voir mes resultats (' + completed + ' scenarios completes)';
        resBtn.onclick = function() { AVENTURE.router.navigate('#resultats'); };
        cont.appendChild(resBtn);
        cont.appendChild(el('div', 'spacer-sm'));
      }

      // All careers button
      var allBtn = el('button', 'btn btn-secondary');
      allBtn.style.width = '100%';
      allBtn.textContent = 'Explorer tous les metiers';
      allBtn.onclick = function() { AVENTURE.router.navigate('#tous-metiers'); };
      cont.appendChild(allBtn);

      cont.appendChild(el('div', 'spacer-sm'));

      // Profile button
      if (completed > 0) {
        var profBtn = el('button', 'btn btn-secondary');
        profBtn.style.width = '100%';
        profBtn.textContent = 'Mon profil & badges';
        profBtn.onclick = function() { AVENTURE.router.navigate('#profil'); };
        cont.appendChild(profBtn);
      }

      cont.appendChild(el('div', 'spacer-lg'));
      screen.appendChild(cont);
      container.appendChild(screen);
    },

    // ===== SCENARIO PLAY =====
    renderScenario: function(container, scenarioId) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var scenario = AVENTURE.scenarioEngine.getCurrentScenario();
      var scene = AVENTURE.scenarioEngine.getCurrentScene();

      if (!scenario || !scene) {
        AVENTURE.router.navigate('#scenarios');
        return;
      }

      // Check if scenario is complete
      if (scene.fin) {
        AVENTURE.router.navigate('#scenario-fin/' + scenarioId);
        return;
      }

      // Header
      var actions = el('div', 'header-actions');
      actions.appendChild(C.pointsDisplay());
      cont.appendChild(C.headerBar(scenario.titre, false, actions));

      // Progress
      var progress = AVENTURE.scenarioEngine.getSceneProgress();
      cont.appendChild(C.progressBar(progress.current, progress.total + 1, scenario.icon + ' ' + scenario.titre));
      cont.appendChild(el('div', 'spacer-md'));

      // Scene text
      var textDiv = el('div', 'scene-text');
      textDiv.textContent = scene.texte;
      cont.appendChild(textDiv);

      // Choices
      var choicesDiv = el('div', 'choices-container');
      var letters = ['A', 'B', 'C', 'D'];
      for (var i = 0; i < scene.choix.length; i++) {
        (function(index, choice) {
          var btn = el('button', 'btn-choice choice-enter');
          btn.setAttribute('data-letter', letters[index]);
          btn.textContent = choice.texte;
          btn.onclick = function() {
            // Visual feedback
            btn.classList.add('selected');
            var allBtns = choicesDiv.querySelectorAll('.btn-choice');
            for (var j = 0; j < allBtns.length; j++) {
              allBtns[j].style.pointerEvents = 'none';
              if (allBtns[j] !== btn) allBtns[j].style.opacity = '0.4';
            }

            // Calculate points for popup
            var pts = 0;
            var tagKeys = Object.keys(choice.tags);
            for (var j = 0; j < tagKeys.length; j++) pts += choice.tags[tagKeys[j]] * 5;

            C.showPointsPop(pts, btn.getBoundingClientRect().right, btn.getBoundingClientRect().top);

            // Process choice after brief delay
            setTimeout(function() {
              AVENTURE.scenarioEngine.makeChoice(index);
              var nextScene = AVENTURE.scenarioEngine.getCurrentScene();
              if (nextScene && nextScene.fin) {
                AVENTURE.router.navigate('#scenario-fin/' + scenarioId);
              } else {
                AVENTURE.screens.renderScenario(container, scenarioId);
                container.querySelector('.screen').classList.add('fade-enter');
              }
            }, 600);
          };
          choicesDiv.appendChild(btn);
        })(i, scene.choix[i]);
      }
      cont.appendChild(choicesDiv);

      // Quit button
      cont.appendChild(el('div', 'spacer-lg'));
      var quitBtn = el('button', 'btn btn-secondary');
      quitBtn.style.width = '100%';
      quitBtn.style.opacity = '0.6';
      quitBtn.textContent = 'Quitter le scenario';
      quitBtn.onclick = function() {
        AVENTURE.router.navigate('#scenarios');
      };
      cont.appendChild(quitBtn);

      cont.appendChild(el('div', 'spacer-lg'));
      screen.appendChild(cont);
      container.innerHTML = '';
      container.appendChild(screen);
    },

    // ===== SCENARIO END =====
    renderScenarioEnd: function(container, scenarioId) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var scenario = AVENTURE.scenarioEngine.getCurrentScenario();
      var scene = AVENTURE.scenarioEngine.getCurrentScene();

      if (!scenario || !scene) {
        // Try to get scenario from ID
        for (var i = 0; i < AVENTURE.scenarios.length; i++) {
          if (AVENTURE.scenarios[i].id === scenarioId) {
            scenario = AVENTURE.scenarios[i];
            break;
          }
        }
      }

      // End the scenario and get badges
      var newBadges = AVENTURE.scenarioEngine.endScenario();

      // Show badge notifications
      if (newBadges && newBadges.length > 0) {
        for (var b = 0; b < newBadges.length; b++) {
          (function(badge, delay) {
            setTimeout(function() {
              C.showBadgeNotification(badge);
            }, delay);
          })(newBadges[b], b * 3500);
        }
      }

      cont.appendChild(C.headerBar('SCENARIO TERMINE', true));

      var endDiv = el('div', 'scenario-end');
      endDiv.innerHTML = '<div class="end-icon">' + (scenario ? scenario.icon : '\u2705') + '</div>' +
        '<h2>Bravo !</h2>' +
        '<p class="end-description">Tu as termine le scenario "' + (scenario ? scenario.titre : '') + '". Tes choix en disent long sur tes preferences !</p>';

      // Related professions
      if (scene && scene.resumeProfessions && scene.resumeProfessions.length > 0) {
        var relDiv = el('div', 'related-professions');
        relDiv.innerHTML = '<h3>Metiers decouverts</h3>';
        for (var i = 0; i < scene.resumeProfessions.length; i++) {
          var prof = AVENTURE.matching.getProfessionById(scene.resumeProfessions[i]);
          if (prof) {
            (function(p) {
              var item = el('div', 'match-item card-enter');
              item.style.animationDelay = (i * 0.15) + 's';
              item.innerHTML = '<span style="font-size:1.5rem">' + p.icon + '</span>' +
                '<div class="match-info"><div class="match-name">' + p.nom + '</div>' +
                '<div class="match-sector">' + p.secteur + ' &bull; ' + p.duree + ' ans</div></div>';
              item.onclick = function() {
                AVENTURE.gameState.viewCareer(p.id);
                AVENTURE.router.navigate('#metier/' + p.id);
              };
              relDiv.appendChild(item);
            })(prof);
          }
        }
        endDiv.appendChild(relDiv);
      }

      // Actions
      var actionsDiv = el('div', 'end-actions');
      var nextBtn = el('button', 'btn btn-primary');
      nextBtn.textContent = 'Continuer les aventures';
      nextBtn.onclick = function() { AVENTURE.router.navigate('#scenarios'); };
      actionsDiv.appendChild(nextBtn);

      var state = AVENTURE.gameState.get();
      if (state.scenariosCompleted.length >= 3) {
        var resBtn = el('button', 'btn btn-secondary');
        resBtn.textContent = 'Voir mes resultats';
        resBtn.onclick = function() { AVENTURE.router.navigate('#resultats'); };
        actionsDiv.appendChild(resBtn);
      }

      endDiv.appendChild(actionsDiv);
      cont.appendChild(endDiv);
      cont.appendChild(el('div', 'spacer-lg'));
      screen.appendChild(cont);
      container.appendChild(screen);
    },

    // ===== RESULTS =====
    renderResults: function(container) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var state = AVENTURE.gameState.get();
      var actions = el('div', 'header-actions');
      actions.appendChild(C.pointsDisplay());
      cont.appendChild(C.headerBar('TES RESULTATS', true, actions));

      cont.appendChild(el('div', 'spacer-md'));
      cont.appendChild(el('h2', '', 'Ton profil, ' + (state.playerName || 'aventurier') + ' !'));
      cont.appendChild(el('p', '', 'Base sur ' + state.scenariosCompleted.length + ' scenarios explores'));

      // Radar chart
      var radarDiv = el('div', 'radar-container');
      cont.appendChild(radarDiv);

      var radarData = AVENTURE.matching.getRadarData(state.profil);
      AVENTURE.radarChart.render(radarDiv, radarData, true);

      cont.appendChild(el('div', 'spacer-md'));
      cont.appendChild(el('h2', '', 'Tes metiers recommandes'));
      cont.appendChild(el('p', '', 'Les metiers qui correspondent le mieux a tes preferences'));
      cont.appendChild(el('div', 'spacer-sm'));

      // Top matches
      var matches = AVENTURE.matching.getTopMatches(state.profil, 5);
      var matchList = el('div', '');
      matchList.style.display = 'flex';
      matchList.style.flexDirection = 'column';
      matchList.style.gap = '12px';

      for (var i = 0; i < matches.length; i++) {
        (function(match, rank) {
          var item = el('div', 'match-item');
          item.innerHTML = '<div class="match-rank">#' + (rank + 1) + '</div>' +
            '<span style="font-size:1.5rem">' + match.profession.icon + '</span>' +
            '<div class="match-info"><div class="match-name">' + match.profession.nom + '</div>' +
            '<div class="match-sector">' + match.profession.secteur + ' &bull; ' + match.profession.duree + ' ans</div></div>' +
            '<div class="match-score"><div class="bar"><div class="fill" style="width:' + match.score + '%"></div></div>' +
            '<span class="pct">' + match.score + '%</span></div>';
          item.onclick = function() {
            AVENTURE.gameState.viewCareer(match.profession.id);
            AVENTURE.router.navigate('#metier/' + match.profession.id);
          };
          matchList.appendChild(item);
        })(matches[i], i);
      }
      cont.appendChild(matchList);

      cont.appendChild(el('div', 'spacer-md'));

      // All careers
      var allBtn = el('button', 'btn btn-secondary');
      allBtn.style.width = '100%';
      allBtn.textContent = 'Explorer tous les metiers';
      allBtn.onclick = function() { AVENTURE.router.navigate('#tous-metiers'); };
      cont.appendChild(allBtn);

      cont.appendChild(el('div', 'spacer-sm'));

      var mapBtn = el('button', 'btn btn-secondary');
      mapBtn.style.width = '100%';
      mapBtn.textContent = 'Retour aux scenarios';
      mapBtn.onclick = function() { AVENTURE.router.navigate('#scenarios'); };
      cont.appendChild(mapBtn);

      cont.appendChild(el('div', 'spacer-lg'));
      screen.appendChild(cont);
      container.appendChild(screen);
    },

    // ===== CAREER CARD =====
    renderCareer: function(container, professionId) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var prof = AVENTURE.matching.getProfessionById(professionId);
      if (!prof) {
        AVENTURE.router.navigate('#scenarios');
        return;
      }

      AVENTURE.gameState.viewCareer(professionId);
      // Check for badge
      AVENTURE.scenarioEngine.checkBadges();

      cont.appendChild(C.headerBar('FICHE METIER', true));
      cont.appendChild(el('div', 'spacer-md'));

      // Flip card
      var flipCard = el('div', 'flip-card');
      var inner = el('div', 'flip-card-inner');

      // Front
      var front = el('div', 'flip-card-front');
      front.innerHTML = '<div class="card-icon">' + prof.icon + '</div>' +
        '<h2>' + prof.nom + '</h2>' +
        '<span class="card-type">' + prof.type + ' &bull; ' + prof.duree + ' ans</span>';

      // Show match score if player has a profile
      var state = AVENTURE.gameState.get();
      var hasProfile = state.scenariosCompleted.length > 0;
      if (hasProfile) {
        var score = AVENTURE.matching.getMatchScore(state.profil, prof);
        front.innerHTML += '<div class="card-match">' + score + '%</div><div style="color:var(--text-muted);font-size:0.85rem">compatibilite</div>';
      }

      front.appendChild(C.sectorLabel(prof.secteur));

      var hint = el('div', 'flip-hint');
      hint.textContent = '\u21bb Clique pour voir les details';
      front.appendChild(hint);
      inner.appendChild(front);

      // Back
      var back = el('div', 'flip-card-back');
      back.style.position = 'relative';

      // Description
      var descSec = el('div', 'card-detail-section');
      descSec.innerHTML = '<h3>Description</h3><p>' + prof.description + '</p>';
      back.appendChild(descSec);

      // Activities
      var actSec = el('div', 'card-detail-section');
      actSec.innerHTML = '<h3>Activites quotidiennes</h3><ul>' +
        prof.activites.map(function(a) { return '<li>' + a + '</li>'; }).join('') + '</ul>';
      back.appendChild(actSec);

      // Salary apprentice
      var salSec = el('div', 'card-detail-section');
      salSec.innerHTML = '<h3>Salaire apprentissage (CHF/mois)</h3>';
      var salGrid = el('div', 'salary-grid');
      var years = Object.keys(prof.salaireApprentissage);
      for (var y = 0; y < years.length; y++) {
        var item = el('div', 'salary-item');
        item.innerHTML = '<div class="year">' + years[y] + 'e annee</div><div class="amount">' +
          prof.salaireApprentissage[years[y]] + '.-</div>';
        salGrid.appendChild(item);
      }
      salSec.appendChild(salGrid);

      // Salary post-CFC
      var postSal = el('div', 'salary-post');
      postSal.innerHTML = '<div class="label">Salaire apres ' + prof.type + '</div>' +
        '<div class="range">CHF ' + prof.salaireApresCFC.min.toLocaleString('fr-CH') +
        ' - ' + prof.salaireApresCFC.max.toLocaleString('fr-CH') + ' / mois</div>';
      salSec.appendChild(postSal);
      back.appendChild(salSec);

      // Qualities
      var qualSec = el('div', 'card-detail-section');
      qualSec.innerHTML = '<h3>Qualites requises</h3>';
      var tagList = el('div', 'tag-list');
      for (var q = 0; q < prof.qualitesRequises.length; q++) {
        var tag = el('span', 'tag');
        tag.textContent = prof.qualitesRequises[q];
        tagList.appendChild(tag);
      }
      qualSec.appendChild(tagList);
      back.appendChild(qualSec);

      // Passerelle (for aeronautique)
      if (prof.passerelle) {
        var passBox = el('div', 'passerelle-box');
        passBox.innerHTML = '<h4>\u2708\ufe0f Passerelle aeronautique</h4><p>' + prof.passerelle + '</p>';
        back.appendChild(passBox);
      }

      // Link to orientation.ch
      var link = el('a', 'link-orientation');
      link.href = prof.urlOrientation;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Voir sur orientation.ch \u2192';
      back.appendChild(link);

      var flipHint2 = el('div', 'flip-hint');
      flipHint2.textContent = '\u21bb Retourner la carte';
      flipHint2.style.marginTop = '12px';
      back.appendChild(flipHint2);

      inner.appendChild(back);
      flipCard.appendChild(inner);

      flipCard.onclick = function() {
        flipCard.classList.toggle('flipped');
      };

      cont.appendChild(flipCard);
      cont.appendChild(el('div', 'spacer-lg'));

      screen.appendChild(cont);
      container.appendChild(screen);
    },

    // ===== ALL CAREERS =====
    renderAllCareers: function(container) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var state = AVENTURE.gameState.get();
      cont.appendChild(C.headerBar('TOUS LES METIERS', true));
      cont.appendChild(el('div', 'spacer-md'));
      cont.appendChild(el('h2', '', '33 metiers a explorer'));
      cont.appendChild(el('p', '', 'Clique sur un metier pour decouvrir sa fiche complete.'));
      cont.appendChild(el('div', 'spacer-md'));

      // Group by sector
      var sectors = {};
      for (var i = 0; i < AVENTURE.professions.length; i++) {
        var p = AVENTURE.professions[i];
        if (!sectors[p.secteur]) sectors[p.secteur] = [];
        sectors[p.secteur].push(p);
      }

      var sectorOrder = ['sante', 'informatique', 'commerce', 'construction', 'technique',
                         'artisanat', 'gastronomie', 'nature', 'social', 'automobile', 'aeronautique'];
      var sectorNames = {
        sante: 'Sante', informatique: 'Informatique', commerce: 'Commerce',
        construction: 'Construction', technique: 'Technique', artisanat: 'Artisanat & Arts',
        gastronomie: 'Gastronomie', nature: 'Nature', social: 'Social',
        automobile: 'Automobile', aeronautique: 'Aeronautique'
      };

      for (var s = 0; s < sectorOrder.length; s++) {
        var sector = sectorOrder[s];
        if (!sectors[sector]) continue;

        var sectionTitle = el('h3', '');
        sectionTitle.appendChild(C.sectorLabel(sector));
        cont.appendChild(sectionTitle);
        cont.appendChild(el('div', 'spacer-sm'));

        for (var j = 0; j < sectors[sector].length; j++) {
          (function(prof) {
            var hasProfile = state.scenariosCompleted.length > 0;
            var score = hasProfile ? AVENTURE.matching.getMatchScore(state.profil, prof) : null;

            var item = el('div', 'match-item');
            var scoreHtml = score !== null ?
              '<div class="match-score"><div class="bar"><div class="fill" style="width:' + score + '%"></div></div>' +
              '<span class="pct">' + score + '%</span></div>' : '';

            item.innerHTML = '<span style="font-size:1.5rem">' + prof.icon + '</span>' +
              '<div class="match-info"><div class="match-name">' + prof.nom + '</div>' +
              '<div class="match-sector">' + prof.type + ' &bull; ' + prof.duree + ' ans &bull; CHF ' +
              prof.salaireApresCFC.min.toLocaleString('fr-CH') + '-' +
              prof.salaireApresCFC.max.toLocaleString('fr-CH') + '</div></div>' + scoreHtml;
            item.onclick = function() {
              AVENTURE.gameState.viewCareer(prof.id);
              AVENTURE.router.navigate('#metier/' + prof.id);
            };
            cont.appendChild(item);
          })(sectors[sector][j]);
        }
        cont.appendChild(el('div', 'spacer-md'));
      }

      cont.appendChild(el('div', 'spacer-lg'));
      screen.appendChild(cont);
      container.appendChild(screen);
    },

    // ===== PROFILE =====
    renderProfile: function(container) {
      var screen = el('div', 'screen');
      var cont = el('div', 'container');

      var state = AVENTURE.gameState.get();
      cont.appendChild(C.headerBar('MON PROFIL', true, C.themeToggle()));
      cont.appendChild(el('div', 'spacer-md'));

      cont.appendChild(el('h2', '', (state.playerName || 'Aventurier') + ' — Profil'));

      // Stats
      var stats = el('div', '');
      stats.style.display = 'flex';
      stats.style.gap = '16px';
      stats.style.flexWrap = 'wrap';
      stats.style.marginBottom = '16px';

      var statItems = [
        { label: 'Points', value: state.totalPoints, icon: '\u2b50' },
        { label: 'Scenarios', value: state.scenariosCompleted.length + '/11', icon: '\ud83c\udfae' },
        { label: 'Badges', value: state.badges.length + '/' + AVENTURE.badges.length, icon: '\ud83c\udfc5' },
        { label: 'Fiches vues', value: state.careersViewed.length, icon: '\ud83d\udcda' }
      ];

      for (var i = 0; i < statItems.length; i++) {
        var statCard = el('div', 'card');
        statCard.style.flex = '1';
        statCard.style.minWidth = '100px';
        statCard.style.textAlign = 'center';
        statCard.innerHTML = '<div style="font-size:1.5rem">' + statItems[i].icon + '</div>' +
          '<div style="font-size:1.5rem;font-weight:800;color:var(--accent)">' + statItems[i].value + '</div>' +
          '<div style="font-size:0.8rem;color:var(--text-muted)">' + statItems[i].label + '</div>';
        stats.appendChild(statCard);
      }
      cont.appendChild(stats);

      // Radar chart
      if (state.scenariosCompleted.length > 0) {
        cont.appendChild(el('h3', '', 'Ton radar de preferences'));
        var radarDiv = el('div', 'radar-container');
        cont.appendChild(radarDiv);
        var radarData = AVENTURE.matching.getRadarData(state.profil);
        AVENTURE.radarChart.render(radarDiv, radarData, true);
      }

      cont.appendChild(el('div', 'spacer-md'));

      // Badges
      cont.appendChild(el('h3', '', 'Tes badges'));
      cont.appendChild(el('div', 'spacer-sm'));
      var badgeGrid = el('div', 'badge-grid');

      for (var i = 0; i < AVENTURE.badges.length; i++) {
        var badge = AVENTURE.badges[i];
        var earned = AVENTURE.gameState.hasBadge(badge.id);
        var bItem = el('div', 'badge-item ' + (earned ? 'earned' : 'locked'));
        bItem.innerHTML = '<span class="badge-icon">' + (earned ? badge.icon : '\ud83d\udd12') + '</span>' +
          '<div class="badge-name">' + (earned ? badge.nom : '???') + '</div>';
        if (earned) {
          bItem.title = badge.description;
        }
        badgeGrid.appendChild(bItem);
      }
      cont.appendChild(badgeGrid);

      cont.appendChild(el('div', 'spacer-lg'));
      screen.appendChild(cont);
      container.appendChild(screen);
    }
  };
})();
