var AVENTURE = AVENTURE || {};

AVENTURE.components = (function() {
  return {
    headerBar: function(title, showBack, rightContent) {
      var bar = document.createElement('div');
      bar.className = 'header-bar';

      if (showBack) {
        var btn = document.createElement('button');
        btn.className = 'back-btn';
        btn.innerHTML = '\u2190 Retour';
        btn.onclick = function() { window.history.back(); };
        bar.appendChild(btn);
      } else {
        bar.appendChild(document.createElement('div'));
      }

      var t = document.createElement('span');
      t.className = 'title';
      t.textContent = title;
      bar.appendChild(t);

      if (rightContent) {
        bar.appendChild(rightContent);
      } else {
        bar.appendChild(document.createElement('div'));
      }

      return bar;
    },

    progressBar: function(current, total, label) {
      var wrapper = document.createElement('div');
      if (label) {
        var lbl = document.createElement('div');
        lbl.className = 'progress-label';
        lbl.innerHTML = '<span>' + label + '</span><span>' + current + '/' + total + '</span>';
        wrapper.appendChild(lbl);
      }
      var bar = document.createElement('div');
      bar.className = 'progress-bar';
      var fill = document.createElement('div');
      fill.className = 'fill';
      fill.style.width = (total > 0 ? (current / total * 100) : 0) + '%';
      bar.appendChild(fill);
      wrapper.appendChild(bar);
      return wrapper;
    },

    pointsDisplay: function() {
      var state = AVENTURE.gameState.get();
      var div = document.createElement('div');
      div.className = 'points-display';
      div.innerHTML = '\u2b50 ' + state.totalPoints + ' pts';
      return div;
    },

    themeToggle: function() {
      var btn = document.createElement('button');
      btn.className = 'btn-icon';
      btn.innerHTML = AVENTURE.gameState.get().darkMode ? '\u2600\ufe0f' : '\ud83c\udf19';
      btn.title = 'Changer le theme';
      btn.onclick = function() {
        AVENTURE.gameState.toggleDarkMode();
        btn.innerHTML = AVENTURE.gameState.get().darkMode ? '\u2600\ufe0f' : '\ud83c\udf19';
      };
      return btn;
    },

    showBadgeNotification: function(badge) {
      var notif = document.getElementById('badge-notification');
      notif.innerHTML = '<span style="font-size:1.5rem">' + badge.icon + '</span>' +
        '<div><strong>' + badge.nom + '</strong><br><small>' + badge.description + '</small></div>';
      notif.classList.remove('hidden');
      notif.classList.add('show');
      setTimeout(function() {
        notif.classList.remove('show');
        notif.classList.add('hidden');
      }, 3000);
    },

    showPointsPop: function(points, x, y) {
      var pop = document.createElement('div');
      pop.className = 'points-pop';
      pop.textContent = '+' + points + ' pts';
      pop.style.left = (x || window.innerWidth / 2) + 'px';
      pop.style.top = (y || 200) + 'px';
      document.body.appendChild(pop);
      setTimeout(function() {
        if (pop.parentNode) pop.parentNode.removeChild(pop);
      }, 700);
    },

    sectorLabel: function(secteur) {
      var colors = {
        sante: 'var(--color-sante)',
        informatique: 'var(--color-informatique)',
        commerce: 'var(--color-commerce)',
        construction: 'var(--color-construction)',
        technique: 'var(--color-technique)',
        artisanat: 'var(--color-artisanat)',
        gastronomie: 'var(--color-gastronomie)',
        nature: 'var(--color-nature)',
        social: 'var(--color-social)',
        automobile: 'var(--color-automobile)',
        aeronautique: 'var(--color-aeronautique)'
      };
      var names = {
        sante: 'Sante',
        informatique: 'Informatique',
        commerce: 'Commerce',
        construction: 'Construction',
        technique: 'Technique',
        artisanat: 'Artisanat',
        gastronomie: 'Gastronomie',
        nature: 'Nature',
        social: 'Social',
        automobile: 'Automobile',
        aeronautique: 'Aeronautique'
      };
      var span = document.createElement('span');
      span.className = 'tag';
      span.textContent = names[secteur] || secteur;
      span.style.background = (colors[secteur] || 'var(--accent)') + '20';
      span.style.color = colors[secteur] || 'var(--accent)';
      return span;
    }
  };
})();
