var AVENTURE = AVENTURE || {};

AVENTURE.radarChart = (function() {
  var NS = 'http://www.w3.org/2000/svg';
  var SIZE = 300;
  var CENTER = SIZE / 2;
  var RADIUS = SIZE / 2 - 50;

  function polarToXY(angle, radius) {
    // Start from top (-90 degrees)
    var rad = (angle - 90) * Math.PI / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad)
    };
  }

  function createSVGElement(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    if (attrs) {
      var keys = Object.keys(attrs);
      for (var i = 0; i < keys.length; i++) {
        el.setAttribute(keys[i], attrs[keys[i]]);
      }
    }
    return el;
  }

  function drawGrid(svg, numAxes) {
    var levels = [0.33, 0.66, 1.0];
    var angleStep = 360 / numAxes;

    // Draw grid polygons
    for (var l = 0; l < levels.length; l++) {
      var r = RADIUS * levels[l];
      var points = [];
      for (var i = 0; i < numAxes; i++) {
        var p = polarToXY(i * angleStep, r);
        points.push(p.x + ',' + p.y);
      }
      svg.appendChild(createSVGElement('polygon', {
        points: points.join(' '),
        fill: 'none',
        stroke: 'var(--border)',
        'stroke-width': '1'
      }));
    }

    // Draw axis lines
    for (var i = 0; i < numAxes; i++) {
      var p = polarToXY(i * angleStep, RADIUS);
      svg.appendChild(createSVGElement('line', {
        x1: CENTER,
        y1: CENTER,
        x2: p.x,
        y2: p.y,
        stroke: 'var(--border)',
        'stroke-width': '1'
      }));
    }
  }

  function drawLabels(svg, data) {
    var numAxes = data.length;
    var angleStep = 360 / numAxes;
    var labelRadius = RADIUS + 30;

    for (var i = 0; i < numAxes; i++) {
      var p = polarToXY(i * angleStep, labelRadius);
      var anchor = 'middle';
      if (p.x < CENTER - 10) anchor = 'end';
      else if (p.x > CENTER + 10) anchor = 'start';

      // Label A (the one pointing outward)
      var text = createSVGElement('text', {
        x: p.x,
        y: p.y,
        'text-anchor': anchor,
        'dominant-baseline': 'central',
        fill: 'var(--text-secondary)',
        'font-size': '11',
        'font-weight': '600',
        'font-family': 'Nunito, sans-serif'
      });
      text.textContent = data[i].label;
      svg.appendChild(text);
    }
  }

  function drawDataPolygon(svg, data, animated) {
    var numAxes = data.length;
    var angleStep = 360 / numAxes;

    // Start from center if animated
    var startPoints = [];
    var endPoints = [];

    for (var i = 0; i < numAxes; i++) {
      var r = RADIUS * data[i].value;
      var ep = polarToXY(i * angleStep, r);
      endPoints.push(ep);

      if (animated) {
        startPoints.push({ x: CENTER, y: CENTER });
      }
    }

    var polygon = createSVGElement('polygon', {
      points: (animated ? startPoints : endPoints).map(function(p) {
        return p.x + ',' + p.y;
      }).join(' '),
      fill: 'rgba(108, 99, 255, 0.2)',
      stroke: 'var(--accent)',
      'stroke-width': '2',
      'class': 'radar-polygon'
    });
    svg.appendChild(polygon);

    // Draw dots
    var dots = [];
    for (var i = 0; i < endPoints.length; i++) {
      var dot = createSVGElement('circle', {
        cx: animated ? CENTER : endPoints[i].x,
        cy: animated ? CENTER : endPoints[i].y,
        r: '4',
        fill: 'var(--accent)',
        'class': 'radar-polygon'
      });
      svg.appendChild(dot);
      dots.push(dot);
    }

    // Animate if needed
    if (animated) {
      setTimeout(function() {
        polygon.setAttribute('points', endPoints.map(function(p) {
          return p.x + ',' + p.y;
        }).join(' '));
        for (var i = 0; i < dots.length; i++) {
          dots[i].setAttribute('cx', endPoints[i].x);
          dots[i].setAttribute('cy', endPoints[i].y);
        }
      }, 100);
    }

    return { polygon: polygon, dots: dots };
  }

  return {
    render: function(container, data, animated) {
      var svg = createSVGElement('svg', {
        viewBox: '0 0 ' + SIZE + ' ' + SIZE,
        width: '100%',
        height: '100%'
      });

      drawGrid(svg, data.length);
      drawLabels(svg, data);
      drawDataPolygon(svg, data, animated !== false);

      container.innerHTML = '';
      container.appendChild(svg);
      return svg;
    }
  };
})();
