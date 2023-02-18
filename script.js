(function() {
  var TextBubble, bubble, bubbleForLines, canvas, container, ctx, err, font, height, j, keyDown, len, length, markers, mctx, measureText, padding, scale, t, textBubbles, timeline, touchEndHandler, updateSize, viewport, width;

  canvas = document.querySelector('#main-canvas');

  ctx = canvas.getContext('2d');

  width = 0;

  height = 0;

  scale = 1;

  updateSize = function() {
    width = innerWidth;
    height = innerHeight;
    scale = devicePixelRatio;
    canvas.width = width * scale;
    return canvas.height = height * scale;
  };

  updateSize();

  window.addEventListener('resize', updateSize);

  // # # # # # # # # # # #
  font = '24px Amatic SC, sans-serif';

  padding = -1;

  mctx = document.createElement('canvas').getContext('2d');

  measureText = function(font, text) {
    mctx.font = font;
    return mctx.measureText(text).width;
  };

  textBubbles = [];

  TextBubble = class TextBubble extends Trace.Object {
    constructor() {
      super();
      textBubbles.push(this);
      this.text = new Trace.AnimatedString('');
      this.chars = new Trace.AnimatedNumber(0);
      this.visibility = new Trace.AnimatedNumber(1);
      this.width = new Trace.AnimatedNumber(0);
      this.width.interpolatorSettings = {
        spring: [900, 70]
      };
      this.width.interpolator = Trace.AnimatedNumber.springInterpolator;
      this.height = new Trace.AnimatedNumber(0);
      this.height.interpolatorSettings = {
        spring: [900, 70]
      };
      this.height.interpolator = Trace.AnimatedNumber.springInterpolator;
      this.positions = [];
      this.widths = [];
      this.offsets = [];
      this.springs = [];
      this.timer = 0;
      this.typeset(0);
    }

    typeset(t) {
      var char, charWidth, i, j, len, posX, posY, spring, text;
      this.positions = [];
      this.widths = [];
      this.offsets = [];
      text = this.text.getValue(t, 0);
      if (text.length !== this.springs.length) {
        this.springs = [];
      }
      width = 0;
      posX = 0;
      posY = 0;
      for (i = j = 0, len = text.length; j < len; i = ++j) {
        char = text[i];
        charWidth = measureText(font, char);
        this.positions.push([posX, posY]);
        posX += padding + charWidth;
        if (char === ' ') {
          posX += 3;
          if (posX > 180 || posX + measureText(text.substr(i).split(/\s/)[0]) > 180) {
            posX = 0;
            posY += 22;
          }
        }
        this.widths.push(charWidth);
        this.offsets.push(Math.random());
        if (!this.springs[i]) {
          spring = new Trace.AnimatedNumber(0);
          spring.interpolatorSettings = {
            spring: [900, 35]
          };
          spring.interpolator = Trace.AnimatedNumber.springInterpolator;
          this.springs.push(spring);
        }
        if (posX > width) {
          width = posX;
        }
      }
      this.width.defaultValue = width;
      return this.height.defaultValue = posY;
    }

    drawSelf(ctx, transform, t, dt) {
      var bottom, char, chars, cscale, cvis, da, db, dc, dd, de, i, j, left, len, results, right, state, text, top, value, visibility;
      Trace.Utils.setTransformMatrix(ctx, transform);
      this.timer += dt;
      text = this.text.getValue(t, dt);
      chars = this.chars.getValue(t, dt);
      visibility = this.visibility.getValue(t, dt);
      if (text !== this.lastText) {
        this.typeset(t);
        this.lastText = text;
      }
      width = this.width.getValue(t, dt);
      height = this.height.getValue(t, dt);
      ctx.globalAlpha = this.opacity.getValue(t, dt);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      top = -height / 2 - 14;
      left = -width / 2 - 10;
      right = width / 2 + 10;
      bottom = height / 2 + 14;
      state = Math.floor(3 * (this.timer % 1));
      da = 10 + 5 * state;
      db = 8 + 6 * Math.sin(state);
      dc = 1 + 0.015 * Math.cos(state);
      dd = 14 - 2 * state;
      de = 10 + 2 * state;
      ctx.moveTo(left + dc, top);
      ctx.bezierCurveTo(left + da, dc * top * 2, right - dd, top * 2, right, top);
      ctx.bezierCurveTo(right + 5, top + 10, right + 5, bottom - 10, right, bottom);
      ctx.bezierCurveTo(right - db, bottom * 2, left + 10, bottom * 2, left, bottom);
      ctx.bezierCurveTo(left - 5, bottom - de, left - 5, top + 10, left + dc, top);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.translate(-width / 2, -height / 2);
      results = [];
      for (i = j = 0, len = text.length; j < len; i = ++j) {
        char = text[i];
        cscale = 1;
        if (i + 1 > Math.floor(chars)) {
          cscale = 0;
        }
        cvis = 1 - ((1 - visibility) * (1 + this.offsets[i]));
        cvis = Math.max(0, cvis);
        this.springs[i].defaultValue = cscale;
        value = this.springs[i].getValue(t, dt);
        value = Math.max(0, value);
        value *= cvis;
        ctx.save();
        ctx.globalAlpha *= value;
        ctx.translate(...this.positions[i]);
        ctx.translate(this.widths[i] / 2, 0);
        ctx.scale(1 - 0.5 * (1 - value), 1 - 0.25 * (1 - value));
        ctx.rotate((Math.floor(3 * ((this.timer + this.offsets[i]) % 1)) - 1.5) / 70);
        ctx.fillText(char, 0, 0);
        results.push(ctx.restore());
      }
      return results;
    }

  };

  timeline = new Trace.Timeline(ctx);

  timeline.run();

  window.t = timeline;

  viewport = new Trace.Viewport();

  timeline.addChild(viewport);

  viewport.canvasWidth = width;

  viewport.canvasHeight = height;

  viewport.canvasScale = scale;

  window.addEventListener('resize', function() {
    viewport.canvasWidth = innerWidth;
    return viewport.canvasHeight = innerHeight;
  });

  viewport.width = 150;

  viewport.height = 100;

  bubbleForLines = function(lines, time = 0) {
    var bubble, char, i, j, k, len, len1, line, markers, t;
    bubble = new TextBubble();
    markers = [];
    bubble.transform.scaleX.addKey(time, 0);
    bubble.transform.scaleX.addKey(time + 0.25, 1, Trace.Easing.easeOutExpo);
    bubble.transform.scaleY.addKey(time, 0);
    bubble.transform.scaleY.addKey(time + 0.25, 1, Trace.Easing.easeOutExpo);
    t = time;
    for (j = 0, len = lines.length; j < len; j++) {
      line = lines[j];
      bubble.text.addKey(t, line);
      bubble.visibility.addKey(t, 1, Trace.Easing.step);
      bubble.chars.addKey(t, 0, Trace.Easing.step);
      for (i = k = 0, len1 = line.length; k < len1; i = ++k) {
        char = line[i];
        if (char === '.') {
          t += 0.1;
        } else {
          t += 0.025;
        }
        bubble.chars.addKey(t, i + 1);
      }
      markers.push(t);
      bubble.visibility.addKey(t, 1);
      t += 0.25;
      bubble.visibility.addKey(t, 0, Trace.Easing.easeInExpo);
      bubble.chars.addKey(t, line.length);
      t += 0.05;
    }
    t -= 0.25;
    bubble.transform.scaleX.addKey(t, 1);
    bubble.transform.scaleY.addKey(t, 1);
    t += 0.25;
    bubble.transform.scaleX.addKey(t, 0, Trace.Easing.easeInExpo);
    bubble.transform.scaleY.addKey(t, 0, Trace.Easing.easeInExpo);
    return [bubble, markers, t];
  };

  container = new Trace.Object();

  [bubble, markers, length] = bubbleForLines(['Welcome!', 'Karuna Tata', 'Know more', ':love: Open Source']);

  container.addChild(bubble);

  for (j = 0, len = markers.length; j < len; j++) {
    t = markers[j];
    timeline.markers.set(t, 0);
  }

  viewport.addChild(container);

  container.addKeys({
    transform: {
      translateX: 75,
      translateY: 50
    }
  });

  timeline.duration = length + 0.5;

  timeline.loop = true;

  try {
    timeline.play();
  } catch (error) {
    err = error;
    timeline.paused = false;
    console.log(err);
    console.log(timeline.play);
  }

  keyDown = false;

  window.addEventListener('keydown', function(e) {
    if (e.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (e.key === 'f' || e.key === 'c') {
      if (keyDown) {
        return;
      }
      keyDown = true;
      timeline.play();
      return timeline.playbackRate = 1.5;
    }
  });

  window.addEventListener('keyup', function(e) {
    if (e.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (e.key === 'f' || e.key === 'c') {
      keyDown = false;
      return timeline.playbackRate = 1;
    }
  });

  canvas.addEventListener('touchstart', function(e) {
    if (keyDown) {
      return;
    }
    e.preventDefault();
    keyDown = true;
    timeline.play();
    return timeline.playbackRate = 1.5;
  });

  touchEndHandler = function(e) {
    e.preventDefault();
    keyDown = false;
    return timeline.playbackRate = 1;
  };

  canvas.addEventListener('touchend', touchEndHandler);

  canvas.addEventListener('touchcancel', touchEndHandler);

  new FontFaceObserver('Amatic SC').load().then(function() {
    var k, len1, results;
    console.log('loaded');
    results = [];
    for (k = 0, len1 = textBubbles.length; k < len1; k++) {
      bubble = textBubbles[k];
      results.push(bubble.typeset(timeline.currentTime));
    }
    return results;
  });

}).call(this);
