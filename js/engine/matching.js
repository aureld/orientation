var AVENTURE = AVENTURE || {};

AVENTURE.matching = (function() {
  var DIMENSIONS = [
    'manuel', 'intellectuel', 'creatif', 'analytique',
    'interieur', 'exterieur', 'equipe', 'independant',
    'contactHumain', 'technique', 'routine', 'variete'
  ];

  function normalize(profile, maxScale) {
    var maxVal = 0;
    for (var i = 0; i < DIMENSIONS.length; i++) {
      var v = profile[DIMENSIONS[i]] || 0;
      if (v > maxVal) maxVal = v;
    }
    if (maxVal === 0) return null;

    var result = {};
    for (var i = 0; i < DIMENSIONS.length; i++) {
      result[DIMENSIONS[i]] = (profile[DIMENSIONS[i]] || 0) / (maxScale || maxVal);
    }
    return result;
  }

  function cosineSimilarity(a, b) {
    var dot = 0, magA = 0, magB = 0;
    for (var i = 0; i < DIMENSIONS.length; i++) {
      var k = DIMENSIONS[i];
      var va = a[k] || 0;
      var vb = b[k] || 0;
      dot += va * vb;
      magA += va * va;
      magB += vb * vb;
    }
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  return {
    getTopMatches: function(playerProfil, n) {
      var normalizedPlayer = normalize(playerProfil);
      if (!normalizedPlayer) return [];

      var scores = [];
      for (var i = 0; i < AVENTURE.professions.length; i++) {
        var prof = AVENTURE.professions[i];
        var normalizedProf = normalize(prof.profil, 10);
        if (!normalizedProf) continue;

        var sim = cosineSimilarity(normalizedPlayer, normalizedProf);
        scores.push({
          profession: prof,
          score: Math.round(sim * 100)
        });
      }

      scores.sort(function(a, b) { return b.score - a.score; });
      return scores.slice(0, n || 5);
    },

    getRadarData: function(playerProfil) {
      var pairs = [
        { label: 'Manuel', labelB: 'Intellectuel', a: 'manuel', b: 'intellectuel' },
        { label: 'Creatif', labelB: 'Analytique', a: 'creatif', b: 'analytique' },
        { label: 'Exterieur', labelB: 'Interieur', a: 'exterieur', b: 'interieur' },
        { label: 'Equipe', labelB: 'Independant', a: 'equipe', b: 'independant' },
        { label: 'Contact humain', labelB: 'Technique', a: 'contactHumain', b: 'technique' },
        { label: 'Variete', labelB: 'Routine', a: 'variete', b: 'routine' }
      ];

      return pairs.map(function(pair) {
        var va = playerProfil[pair.a] || 0;
        var vb = playerProfil[pair.b] || 0;
        var total = va + vb;
        var value = total === 0 ? 0.5 : va / total; // 0 = fully B, 1 = fully A
        return {
          label: pair.label,
          labelB: pair.labelB,
          value: value,
          raw: { a: va, b: vb }
        };
      });
    },

    getProfessionById: function(id) {
      for (var i = 0; i < AVENTURE.professions.length; i++) {
        if (AVENTURE.professions[i].id === id) return AVENTURE.professions[i];
      }
      return null;
    },

    getMatchScore: function(playerProfil, profession) {
      var normalizedPlayer = normalize(playerProfil);
      if (!normalizedPlayer) return 0;
      var normalizedProf = normalize(profession.profil, 10);
      if (!normalizedProf) return 0;
      return Math.round(cosineSimilarity(normalizedPlayer, normalizedProf) * 100);
    }
  };
})();
