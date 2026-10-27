/* ============ Navigator — combined scripts (original order) ============ */

/* ---- block 1 ---- */

    // "Master any ___." — picked once per page load, not animated. Alternates
    // skill -> subject -> skill each time the page is reloaded. Runs here,
    // before the GSAP scripts below, so the letter-scatter effect on load
    // always scatters/assembles the correct word from the start.
    (function () {
      var line2 = document.getElementById('hlLine2');
      if (!line2) return;
      var STORAGE_KEY = 'navHlSkillWord';
      var last = null;
      try { last = localStorage.getItem(STORAGE_KEY); } catch (e) {}
      var word = last ? (last === 'skill' ? 'subject' : 'skill') : 'skill';
      line2.textContent = word;
      try { localStorage.setItem(STORAGE_KEY, word); } catch (e) {}
    })();
  

/* ---- block 2 ---- */

  (function () {
    // Preloader removed: reveal the hero immediately.
    function reveal() {
      var hero = document.querySelector('.hero');
      if (hero) hero.classList.add('revealed');
      runHeadlineScatter();
    }
    if (document.readyState === 'complete') reveal();
    else window.addEventListener('load', reveal);
  })();

  // --- Hero headline: scattered letters, gathered by a sweeping lime line ---
  // After settling, the last word cycles through a few alternatives.
  var HL_WORDS = ['scattered', 'guessing', 'confused', 'wasted', 'lost'];

  // "Master any ___." — not animated; picked once per page load (see the
  // inline script right after the </h1>). Kept here so the arrow-building
  // script can lock hlMask2's width to whichever of these is widest.
  var HL_SKILLS = ['skill', 'subject'];

  function startWordCycle() {
    var line4 = document.getElementById('hlLine4');
    var mask4 = document.getElementById('hlMask4');
    if (!line4 || typeof gsap === 'undefined') return;
    if (mask4) mask4.classList.add('hl-cycling');
    var idx = 0;

    function next() {
      idx = (idx + 1) % HL_WORDS.length;
      gsap.to(line4, {
        yPercent: -60,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: function () {
          line4.textContent = HL_WORDS[idx];
          gsap.fromTo(line4,
            { yPercent: 60, opacity: 0 },
            {
              yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out',
              onComplete: function () {
                if (window.hlRebuildArrow) window.hlRebuildArrow();
                gsap.delayedCall(2, next);
              }
            }
          );
        }
      });
    }

    gsap.delayedCall(2, next);
  }

  // CSS-only fallback cycler, used only if GSAP never loaded — still keeps
  // the "no more ___" rotation working with zero dependencies.
  function startWordCycleFallback() {
    var line4 = document.getElementById('hlLine4');
    var mask4 = document.getElementById('hlMask4');
    if (!line4) return;
    if (mask4) mask4.classList.add('hl-cycling');
    var idx = 0;

    function next() {
      line4.classList.add('hl-word-out');
      setTimeout(function () {
        idx = (idx + 1) % HL_WORDS.length;
        line4.textContent = HL_WORDS[idx];
        line4.classList.remove('hl-word-out');
        setTimeout(function () { if (window.hlRebuildArrow) window.hlRebuildArrow(); }, 360);
        setTimeout(next, 2350);
      }, 350);
    }

    setTimeout(next, 2000);
  }

  function runHeadlineScatter() {
    var headline = document.getElementById('heroHeadline');
    if (!headline) return;

    function showPlain() {
      if (window.hlFitHeadlineScale) window.hlFitHeadlineScale();
      headline.classList.add('hl-ready');
      startWordCycleFallback();
      window.dispatchEvent(new Event('hl-settled'));
    }

    var watchdog = setTimeout(showPlain, 3000);

    if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
      clearTimeout(watchdog);
      showPlain();
      return;
    }

    try {
      gsap.registerPlugin(SplitText);

      document.fonts.ready.then(function () {
        // Shrink the headline to fit BEFORE splitting into chars, so the
        // scatter/gather animation itself never plays out in an overflowing
        // row — chars fly in and land at the size that already fits.
        if (window.hlFitHeadlineScale) window.hlFitHeadlineScale();

        var lineEls = Array.prototype.slice.call(headline.querySelectorAll('.hl-line'));
        var split = SplitText.create(lineEls, {
          type: 'chars',
          charsClass: 'hl-char',
          tag: 'span'
        });
        var chars = split.chars;
        if (!chars.length) { clearTimeout(watchdog); showPlain(); return; }

        clearTimeout(watchdog);
        headline.classList.add('hl-ready');

        gsap.set(chars, {
          x: function () { return gsap.utils.random(-220, 220); },
          y: function () { return gsap.utils.random(-160, 220); },
          z: function () { return gsap.utils.random(-520, 220); },
          rotationX: function () { return gsap.utils.random(-70, 70); },
          rotationY: function () { return gsap.utils.random(-70, 70); },
          rotationZ: function () { return gsap.utils.random(-65, 65); },
          opacity: function () { return gsap.utils.random(0.4, 1); }
        });

        return gsap.to(chars, {
          x: 0, y: 0, z: 0,
          rotationX: 0, rotationY: 0, rotationZ: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'back.out(1.6)',
          delay: 0.4,
          stagger: { each: 0.035, from: 'random' },
          onComplete: function () { startWordCycle(); window.dispatchEvent(new Event('hl-settled')); }
        });
      });
    } catch (e) {
      clearTimeout(watchdog);
      showPlain();
    }
  }


  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // --- Immersive Mode: scrub bar fills + chapter advances once in view ----
  (function () {
    const section = document.getElementById('immersive');
    if (!section) return;
    const fill = document.getElementById('immersiveFill');
    const chapters = document.getElementById('immersiveChapters');
    if (!fill || !chapters) return;

    let played = false;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !played) {
          played = true;
          setTimeout(function () {
            fill.style.width = '58%';
            const active = chapters.querySelector('.immersive-chapter.active');
            const next = active ? active.nextElementSibling : null;
            if (active) {
              active.classList.remove('active');
              active.classList.add('done');
              const mark = active.querySelector('.immersive-chapter-mark');
              if (mark) {
                mark.classList.add('immersive-chapter-checked');
                mark.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
              }
            }
            if (next) next.classList.add('active');
          }, 550);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(section);
  })();

  // --- Rare Features lock-screen notification stack -----------------------
  (function () {
    const stack = document.getElementById('rareNotifStack');
    const stage = document.getElementById('rareLockStage');
    const expandBtn = document.getElementById('rareExpandBtn');
    const hint = document.getElementById('rareLockHint');
    const dotsWrap = document.getElementById('rareStackDots');
    if (!stack || !stage) return;

    const cards = Array.from(stack.querySelectorAll('.rare-notif'));
    let order = cards.map((_, i) => i); // order[0] = front card
    let expanded = false;
    let lastWheel = 0;

    const COLLAPSED_HINT = 'Scroll or tap the stack to flip through them — double-tap, drag down, or tap "Show all" to lay them out flat.';
    const EXPANDED_HINT = 'Tap the arrow on any card to open the full detail.';

    // Build position dots
    cards.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'rare-dot';
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    const PEEK_STEP = 10;      // px each card behind shifts DOWN, tucking under the front one
    const PEEK_LAYERS = 3;     // how many cards peek before fading out
    const FRONT_TOP = 30;      // resting position of the front card
    const STACK_GAP = 12;      // vertical gap between cards once expanded into a list
    const HEIGHT_BUFFER = 16;  // breathing room under the lowest peeking edge

    function layout() {
      if (expanded) {
        // Lay every card out as a flat list, but keep position:absolute and
        // just animate `top` — switching to position:relative/flex here was
        // what caused the old hard jump-cut on double-tap.
        let cum = 0;
        cards.forEach((el) => {
          el.style.zIndex = '1';
          el.style.top = cum + 'px';
          el.style.transform = 'none';
          el.style.opacity = '1';
          el.classList.remove('is-front', 'is-peek');
          cum += el.offsetHeight + STACK_GAP;
        });
        stack.style.height = Math.max(cum - STACK_GAP, 0) + 'px';
      } else {
        order.forEach((cardIndex, p) => {
          const el = cards[cardIndex];
          const capped = Math.min(p, PEEK_LAYERS);
          el.style.zIndex = String(10 - p);
          el.style.top = (FRONT_TOP + capped * PEEK_STEP) + 'px'; // under, not over
          el.style.transform = 'scale(' + (1 - capped * 0.045) + ')';
          el.style.opacity = p <= PEEK_LAYERS ? String(1 - capped * 0.16) : '0';
          el.classList.toggle('is-front', p === 0);
          el.classList.toggle('is-peek', p > 0);
        });
        const frontH = cards[order[0]].offsetHeight;
        stack.style.height = (FRONT_TOP + PEEK_LAYERS * PEEK_STEP + frontH + HEIGHT_BUFFER) + 'px';
      }
      dots.forEach((d, i) => d.classList.toggle('active', order[0] === i));
    }

    function cycle(dir) {
      if (expanded) return;
      if (dir === 1) order.push(order.shift());
      else order.unshift(order.pop());
      layout();
    }

    function setExpanded(val) {
      expanded = val;
      stack.classList.toggle('expanded', expanded);
      expandBtn.setAttribute('aria-expanded', String(expanded));
      expandBtn.querySelector('.reb-text').textContent = expanded ? 'Collapse' : 'Show all 6';
      hint.textContent = expanded ? EXPANDED_HINT : COLLAPSED_HINT;
      layout();
    }

    layout();

    // Explicit button — the "chevron" toggle for the whole stack
    expandBtn.addEventListener('click', () => setExpanded(!expanded));

    // Tap/click the stage to cycle (front card only, ignore chevrons)
    stage.addEventListener('click', (e) => {
      if (expanded) return;
      if (e.target.closest('.rn-chevron')) return;
      cycle(1);
    });

    // Double-tap / double-click the stage toggles expand
    stage.addEventListener('dblclick', (e) => {
      if (e.target.closest('.rn-chevron')) return;
      setExpanded(!expanded);
    });

    // Scroll over the stack gently cycles the front card
    stage.addEventListener('wheel', (e) => {
      if (expanded) return;
      const now = Date.now();
      if (now - lastWheel < 380) return;
      if (Math.abs(e.deltaY) < 12) return;
      lastWheel = now;
      cycle(e.deltaY > 0 ? 1 : -1);
    }, { passive: true });

    // Touch: swipe up/down to cycle, drag-down far enough to expand
    let touchStartY = null;
    stage.addEventListener('touchstart', (e) => {
      if (e.target.closest('.rn-chevron')) { touchStartY = null; return; }
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      if (touchStartY === null) return;
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
      const delta = endY - touchStartY;
      touchStartY = null;
      if (Math.abs(delta) < 18) return; // treat as a tap, click handler covers it
      if (!expanded && delta > 55) { setExpanded(true); return; }
      if (expanded && delta < -55) { setExpanded(false); return; }
      cycle(delta < 0 ? 1 : -1);
    }, { passive: true });

    // Per-card chevron — expands that single notification's full text
    cards.forEach((card) => {
      const chevron = card.querySelector('.rn-chevron');
      chevron.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('is-open');
        layout(); // re-measure so cards below shift smoothly, not jump
      });
    });

    // Recompute on resize — card heights can reflow at different widths
    let resizeRAF = null;
    window.addEventListener('resize', () => {
      if (resizeRAF) return;
      resizeRAF = requestAnimationFrame(() => { resizeRAF = null; layout(); });
    });
  })();


/* ---- block 3 ---- */


(function () {
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var ICONS = {
    book: '<svg viewBox="0 0 24 24"><path d="M5 2.5h15v19H6.8c-.9 0-1.5.35-1.8.9V2.5z"/><path d="M5 19.6c.35-.7 1-1.1 1.9-1.1H20v3H6.9C5.8 21.5 5 20.8 5 19.6z"/><path class="bk-bolt" d="M13.6 5.2l-4.4 6.4h3.1l-.9 5 4.5-6.6h-3.2l.9-4.8z"/></svg>',
    headphones: '<svg viewBox="0 0 24 24"><path class="hp-arch" d="M3.6 15.5v-3.1a8.4 8.4 0 0116.8 0v3.1"/><rect class="hp-cup" x="1.2" y="13.4" width="5.4" height="8.2" rx="2.4"/><rect class="hp-cup" x="17.4" y="13.4" width="5.4" height="8.2" rx="2.4"/><g class="hp-wave"><path d="M9.2 15.6v4.2"/><path d="M11.1 13.9v7.6"/><path d="M13.0 15.1v5.2"/><path d="M14.9 13.4v8.6"/></g></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 002.4 7.2C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 001.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 001.9-1.9C22 15.1 22 12 22 12s0-3.1-.4-4.8z"/><path class="yt-play" d="M10 15.2l5-3.2-5-3.2z"/></svg>',
    google: '<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>'
  };

  function lockMaskWidthFor(maskId, wordId, words, align) {
    var mask = document.getElementById(maskId);
    var word = document.getElementById(wordId);
    if (!mask || !word) return;
    var probe = document.createElement('span');
    var cs = getComputedStyle(word);
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;';
    probe.style.font = cs.font;
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.fontSize = cs.fontSize;
    probe.style.letterSpacing = cs.letterSpacing;
    probe.style.textTransform = cs.textTransform;
    document.body.appendChild(probe);
    var widest = 0;
    words.forEach(function (wd) {
      probe.textContent = wd;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    });
    probe.remove();
    mask.style.width = Math.ceil(widest) + 'px';
    mask.style.textAlign = align || 'center';
    mask.dataset.locked = '1';
  }

  // The headline's font-size comes from a vw-based clamp(), which sizes
  // relative to viewport width but has no idea how wide the actual words
  // ("ANY SKILL", "GUESSING", etc.) render at that size. On many screens
  // (and especially at browser zoom levels, which scale viewport + font
  // together and never gain relative headroom) the widest row overflows
  // its container and gets clipped left/right since .hl-row is nowrap.
  // Fix: measure the widest possible rendering of every row — using the
  // widest candidate word for the two cycling lines — and shrink a single
  // --hl-scale CSS variable on the headline until every row fits.
  var HL_ROW_WORD_SETS = {
    hlLine2: (typeof HL_SKILLS !== 'undefined' ? HL_SKILLS : ['skill', 'subject']),
    hlLine4: ['scattered', 'guessing', 'confused', 'wasted', 'lost']
  };

  function fitHeadlineScale() {
    var headline = document.getElementById('heroHeadline');
    if (!headline) return;

    // Reset to natural size before measuring, so we don't compound a
    // previous shrink on top of itself (e.g. after a resize back up).
    headline.style.setProperty('--hl-scale', 1);

    var available = headline.clientWidth;
    if (!available) return;

    var rows = Array.prototype.slice.call(headline.querySelectorAll('.hl-row'));
    var tightest = 1;

    rows.forEach(function (row) {
      // Measure the row's REAL rendered width (so inter-word spacing between
      // sibling .hl-line spans is included, not just the sum of their parts),
      // temporarily swapping any cycling word for the widest candidate it
      // could ever show so the fit holds for every word in its rotation.
      var cyclingLines = Array.prototype.slice.call(row.querySelectorAll('.hl-line'))
        .filter(function (line) { return HL_ROW_WORD_SETS[line.id]; });

      var restores = cyclingLines.map(function (line) {
        var original = line.textContent;
        var wordSet = HL_ROW_WORD_SETS[line.id];
        var cs = getComputedStyle(line);
        var probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;';
        probe.style.font = cs.font;
        probe.style.fontFamily = cs.fontFamily;
        probe.style.fontWeight = cs.fontWeight;
        probe.style.fontSize = cs.fontSize;
        probe.style.letterSpacing = cs.letterSpacing;
        probe.style.textTransform = cs.textTransform;
        document.body.appendChild(probe);
        var widestWord = original, widestWidth = -1;
        wordSet.forEach(function (wd) {
          probe.textContent = wd;
          var w = probe.getBoundingClientRect().width;
          if (w > widestWidth) { widestWidth = w; widestWord = wd; }
        });
        probe.remove();
        line.textContent = widestWord;
        return { line: line, original: original };
      });

      var width = row.getBoundingClientRect().width;

      // Put every cycling word back exactly as it was.
      restores.forEach(function (r) { r.line.textContent = r.original; });

      if (width > 0) {
        tightest = Math.min(tightest, available / width);
      }
    });

    // Small safety margin so text never sits flush against the edge.
    var scale = Math.min(1, tightest * 0.99);
    headline.style.setProperty('--hl-scale', scale);
  }
  window.hlFitHeadlineScale = fitHeadlineScale;

  function lockMaskWidth() {
    fitHeadlineScale();
    // Reserve space for the widest cycling word up front on both rotating
    // lines, so swapping never grows/shrinks the row and clips text.
    lockMaskWidthFor('hlMask4', 'hlLine4', ['scattered', 'guessing', 'confused', 'wasted', 'lost']);
    lockMaskWidthFor('hlMask2', 'hlLine2', (typeof HL_SKILLS !== 'undefined' ? HL_SKILLS : ['skill', 'subject']), 'left');
  }

  function rectOf(el) {
    var chars = Array.prototype.slice.call(el.querySelectorAll('.hl-char'));
    if (!chars.length) return el.getBoundingClientRect();
    var left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    chars.forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      left = Math.min(left, r.left); right = Math.max(right, r.right);
      top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
    });
    if (left === Infinity) return el.getBoundingClientRect();
    return { left: left, right: right, top: top, bottom: bottom, width: right - left, height: bottom - top };
  }

  function placeIcon(headline, box, key, cls, size, x, y) {
    var el = headline.querySelector('.hl-icon-' + cls);
    if (!el) {
      el = document.createElement('span');
      el.className = 'hl-icon hl-icon-' + cls;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = ICONS[key];
      headline.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('hl-icon-in'); });
    }
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = (x - box.left) + 'px';
    el.style.top = (y - box.top) + 'px';
  }

  var frozen = null;
  var ytLocked = null; // YouTube icon position/size, locked once and never recalculated.

  function build() {
    var headline = document.getElementById('heroHeadline');
    if (!headline) return;
    lockMaskWidth();

    var old = headline.querySelector('.hl-arrow');
    if (old) old.remove();

    var box = headline.getBoundingClientRect();
    var word = document.getElementById('hlLine4');
    if (!word) return;

    // Always re-measure the *current* word so the arrow underline correctly
    // fits whichever word is on screen right now.
    var w = rectOf(word);
    if (!frozen) {
      frozen = {
        left: w.left, right: w.right, top: w.top, bottom: w.bottom,
        width: w.width, height: w.height
      };
    }
    var x1 = w.left - box.left;
    var x2 = w.right - box.left;
    var y = w.bottom - box.top + 6;

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'hl-arrow');
    svg.setAttribute('aria-hidden', 'true');

    var line = document.createElementNS(SVG_NS, 'path');
    line.setAttribute('d', 'M ' + x1 + ' ' + y + ' L ' + x2 + ' ' + y);
    svg.appendChild(line);

    var head = document.createElementNS(SVG_NS, 'path');
    head.setAttribute('class', 'hl-arrow-head');
    head.setAttribute(
      'd',
      'M ' + (x2 - 13) + ' ' + (y - 9) +
      ' L ' + (x2 + 2) + ' ' + y +
      ' L ' + (x2 - 13) + ' ' + (y + 9)
    );
    svg.appendChild(head);

    headline.appendChild(svg);

    var len = line.getTotalLength();
    line.style.strokeDasharray = len + ' ' + len;
    line.style.strokeDashoffset = String(len);
    head.style.opacity = '0';
    requestAnimationFrame(function () {
      line.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.65,0,0.35,1)';
      line.style.strokeDashoffset = '0';
    });
    setTimeout(function () {
      head.style.transition = 'opacity 0.25s ease';
      head.style.opacity = '1';
    }, 520);

    // --- icons ---------------------------------------------------------
    var master = document.getElementById('hlLine1');
    var noMore = document.getElementById('hlLine3');

    if (master) {
      var m = rectOf(master);
      var bs = Math.max(34, Math.min(72, m.height * 0.30));
      placeIcon(headline, box, 'book', 'book', bs,
        m.left + m.width * 0.5 - bs * 0.5, m.top - bs * 1.05);
    }
    var skillLine = document.getElementById('hlLine2');
    if (skillLine) {
      var sw = rectOf(skillLine);
      var gs = Math.max(26, Math.min(54, sw.height * 0.30));
      placeIcon(headline, box, 'google', 'google', gs,
        sw.left + sw.width * 0.5 - gs * 0.5, sw.top - gs * 1.05);
    }
    if (noMore) {
      var n = rectOf(noMore);
      var hs = Math.max(34, Math.min(72, n.height * 0.30));
      placeIcon(headline, box, 'headphones', 'headphones', hs,
        n.left - hs * 1.35, n.top + n.height * 0.5 - hs * 0.5);
    }
    // Lock the YouTube icon's position/size ONCE, based on the cycling
    // mask's right edge — NOT the first-shown word's own rect. hlMask4 is
    // centered and width-locked to the widest candidate word, so each word
    // (scattered/guessing/confused/wasted/lost) sits at a different right
    // edge inside that fixed box. Anchoring to the word itself meant a
    // later, wider word (e.g. "confused") could extend further right than
    // the first word did and overlap an icon placed relative to it.
    // Anchoring to the mask's edge instead guarantees clearance for every
    // word in the rotation, not just whichever one happened to show first.
    if (!ytLocked) {
      var mask4 = document.getElementById('hlMask4');
      var maskRect = mask4 ? mask4.getBoundingClientRect() : frozen;
      var ys = Math.max(36, Math.min(76, frozen.height * 0.32));
      var ytX = maskRect.right + ys * 0.9;
      // Keep the icon inside the headline box, with a small right margin —
      // on narrow viewports the word can sit close enough to the edge that
      // the unclamped position pushes the icon off-screen / under the fixed
      // nav bar (or, on later wider words, overlapping the last letters).
      var maxX = box.left + box.width - ys - 8;
      if (ytX > maxX) ytX = maxX;
      ytLocked = {
        size: ys,
        x: ytX,
        y: frozen.top + frozen.height * 0.5 - ys * 0.5
      };
    }
    var ytEl = headline.querySelector('.hl-icon-yt');
    if (!ytEl) {
      placeIcon(headline, box, 'youtube', 'yt', ytLocked.size, ytLocked.x, ytLocked.y);
      var ytElNew = headline.querySelector('.hl-icon-yt');
      if (ytElNew) ytElNew.classList.remove('hl-icon-in');
      setTimeout(function () {
        var el = headline.querySelector('.hl-icon-yt');
        if (el) el.classList.add('hl-icon-in');
      }, 770);
    } else {
      placeIcon(headline, box, 'youtube', 'yt', ytLocked.size, ytLocked.x, ytLocked.y);
    }
  }

  var raf = null;
  function rebuild() {
    // NOTE: frozen/ytLocked are intentionally NOT reset here. This runs on
    // every word-cycle tick; resetting them would re-measure against
    // whichever word is currently showing and make the arrow + YouTube
    // icon jump around. Use hardReset() below for real layout changes.
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { raf = null; build(); });
  }

  function hardReset() {
    frozen = null;
    ytLocked = null;
    rebuild();
  }
  window.hlHardResetArrow = hardReset;

  // Let the word-cycle code (in the other script block) ask the arrow to
  // re-measure and re-fit itself every time the underlined word changes,
  // instead of only once — otherwise the arrow keeps the length of
  // whichever word happened to be on screen at first build.
  window.hlRebuildArrow = rebuild;

  window.addEventListener('hl-settled', function () {
    frozen = null;
    ytLocked = null;
    setTimeout(build, 120);
  });
  window.addEventListener('resize', hardReset);
})();



/* ---- block 4 ---- */
// Scroll-driven word-by-word storytelling reveal for the "Why I made
// Navigator" paragraph: dim words brighten in sequence as the section scrolls.
(function () {
  var el = document.querySelector('.why-text');
  if (!el) return;
  var runway = document.querySelector('.why-runway');

  function splitWords(node) {
    var kids = Array.prototype.slice.call(node.childNodes);
    kids.forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var s = document.createElement('span');
            s.className = 'why-word';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitWords(child);
      }
    });
  }

  splitWords(el);
  el.classList.add('why-text-split');
  var words = Array.prototype.slice.call(el.querySelectorAll('.why-word'));
  if (!words.length) return;

  // Doodle markers fade in once reveal progress passes their word position.
  // circle ~ "scattered and directionless" (early), triangle ~ "didn't know" (early-mid),
  // square (Reddit/Google marks) ~ same "scattered" beat as the circle, just after it.
  // NOTE: square's threshold must stay comfortably below phase2Start (computed below
  // from the word "goals") or it never gets a visible window before phase2 hides it.
  var doodleEls = Array.prototype.slice.call(document.querySelectorAll('[data-why-doodle]'));
  var doodleThresholds = { 'why-doodle-circle': 0.08, 'why-doodle-triangle': 0.24, 'why-doodle-square': 0.12 };

  // Curved roadmap arrow (phase 2): path draws itself via dash-offset as the
  // sweep moves through the "I wanted a detailed roadmap..." line; checkpoint
  // dots pop in as the draw passes them.
  var roadmapPath = document.querySelector('.why-roadmap-arrow-path');
  var roadmapDots = Array.prototype.slice.call(document.querySelectorAll('.why-roadmap-dot'));
  var roadmapLen = 0;
  if (roadmapPath) {
    roadmapLen = roadmapPath.getTotalLength();
    roadmapPath.style.strokeDasharray = String(roadmapLen);
    roadmapPath.style.strokeDashoffset = String(roadmapLen);
  }

  // Phase 2 swap: once the sweep reaches "people didn't know what to learn
  // next...", the Google / Reddit / YouTube / confused-scrolling markers fade
  // out and the broken-bridge + fork-in-the-road clips fade in. Scrolling back
  // up reverses it, so phase 1 returns exactly as before.
  var phase2Start = 0.34;
  for (var pi = 0; pi < words.length; pi++) {
    if (/^goals/i.test(words[pi].textContent || '')) {
      phase2Start = (pi + 4) / (words.length + 6);
      break;
    }
  }

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight || 1;
    var p = 0;

    if (runway) {
      // Don't start the reveal until the hero has fully scrolled away, i.e.
      // until .why-runway's top has reached the top of the viewport (the
      // moment .why finishes pinning). Sweep across the rest of the runway.
      var rr = runway.getBoundingClientRect();
      var runwayTravel = Math.max(1, rr.height - vh);
      /* Finish the word sweep after 260vh, leaving the final 120vh of the
         pinned panel exclusively for the curtain overlay. */
      var revealTravel = Math.min(runwayTravel, vh * 2.6);
      p = -rr.top / revealTravel;
    } else {
      var r = el.getBoundingClientRect();
      var start = vh * 0.82;
      var end = vh * 0.32;
      var span = (r.height + (start - end)) || 1;
      p = (start - r.top) / span;
    }
    p = Math.max(0, Math.min(1, p));

    var n = words.length;
    var head = p * (n + 6) - 6; // trailing edge of the highlight sweep
    for (var i = 0; i < n; i++) {
      var t = Math.max(0, Math.min(1, (head + 6 - i) / 6));
      words[i].style.opacity = String(0.16 + 0.84 * t);
      words[i].style.transform = 'translateY(' + ((1 - t) * 0.22).toFixed(3) + 'em)';
      words[i].style.filter = t < 1 ? 'blur(' + ((1 - t) * 3).toFixed(2) + 'px)' : 'none';
    }

    var phase2 = p >= phase2Start;
    doodleEls.forEach(function (d) {
      if (d.hasAttribute('data-why-doodle-phase2')) {
        d.classList.toggle('is-visible', phase2);
        return;
      }
      var key = d.className.split(/\s+/).filter(function (c) { return c.indexOf('why-doodle-') === 0; })[0];
      var threshold = doodleThresholds[key] || 0;
      d.classList.toggle('is-visible', !phase2 && p >= threshold);
    });

    if (roadmapPath) {
      // Draw across the first ~55% of phase 2 so the arrow completes while
      // the roadmap line is still being swept in.
      var q = Math.max(0, Math.min(1, (p - phase2Start) / Math.max(0.0001, (1 - phase2Start) * 0.55)));
      roadmapPath.style.strokeDashoffset = String(roadmapLen * (1 - q));
      for (var di = 0; di < roadmapDots.length; di++) {
        roadmapDots[di].classList.toggle('is-on', q >= parseFloat(roadmapDots[di].getAttribute('data-at') || '0'));
      }
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();


/* ---- auth-aware routing (was type="module") ---- */
(async function () {
  const {createClient} = await import('https://esm.sh/@supabase/supabase-js@2');

  // --- Auth-aware routing for "Get started" / "Build my first roadmap" -----

  const SUPABASE_URL = 'https://ykczxitiyuwbuslmdead.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY3p4aXRpeXV3YnVzbG1kZWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODc1OTYsImV4cCI6MjA5ODU2MzU5Nn0.LwGmS3Ko2Vri4DpFCyuB8uW-RWwtFK_UbX9L_sCgpRM';
  const AUTH_PAGE = 'navigator-auth-v4.html';
  const APP_PAGE = 'navigator-app-v34.html';

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Pushes the current session to the Navigator browser extension, if
  // installed, so its popup can read your roadmap without a separate login.
  function navigatorBroadcastSession(session) {
    if (!session) return;
    try {
      window.postMessage({
        type: 'NAVIGATOR_SESSION_SYNC',
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        userId: session.user?.id,
        expiresAt: session.expires_at
      }, '*');
    } catch {}
  }
  // Reflects login state in the UI the moment we know it: hides "Get started"
  // and points "Build my first roadmap" straight at the app (no click-time
  // session check / redirect delay) once a session exists.
  let currentSession = null;
  const getStartedBtn = document.getElementById('getStartedBtn');
  const buildRoadmapBtn = document.getElementById('buildRoadmapBtn');

  function applyAuthUI(session) {
    currentSession = session;
    if (session) {
      if (getStartedBtn) getStartedBtn.style.display = 'none';
      if (buildRoadmapBtn) buildRoadmapBtn.href = APP_PAGE;
    } else {
      if (getStartedBtn) getStartedBtn.style.display = '';
      if (buildRoadmapBtn) buildRoadmapBtn.href = '#';
    }
  }

  supabase.auth.getSession().then(({ data }) => {
    navigatorBroadcastSession(data.session);
    applyAuthUI(data.session);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    navigatorBroadcastSession(session);
    applyAuthUI(session);
  });

  async function routeToApp(e) {
    e.preventDefault();
    const { data } = await supabase.auth.getSession();
    window.location.href = data.session ? APP_PAGE : AUTH_PAGE;
  }

  // Not logged in yet: both buttons still need the async session check
  // (in case state changed since load) before deciding where to send you.
  getStartedBtn.addEventListener('click', routeToApp);
  buildRoadmapBtn.addEventListener('click', function (e) {
    if (currentSession) return; // real href="navigator-app-v34.html" handles it — instant nav
    routeToApp(e);
  });


})();

/* ---- block 5 ---- */

(function () {
  var nav = document.querySelector('nav');
  var hero = document.querySelector('.hero');
  var lightSections = Array.prototype.slice.call(document.querySelectorAll('.why, .finish'));
  if (!nav || !hero || !lightSections.length) return;
  var ticking = false;
  function update() {
    ticking = false;
    var line = nav.offsetHeight * 0.5;
    var h = hero.getBoundingClientRect();
    var pastHero = h.bottom <= line;
    var overLightSection = lightSections.some(function (el) {
      var r = el.getBoundingClientRect();
      return r.top <= line && r.bottom > line;
    });
    var light = pastHero && overLightSection;
    nav.classList.toggle('nav-light', light);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();


/* ---- block 6 ---- */

/* Keep the confused-guy video circle pinned in place while the "Why" section
   scrolls, releasing once the "I wanted a detailed roadmap..." line is reached. */
(function () {
  var circle = document.querySelector('.why-doodle-circle');
  var shape = circle && circle.querySelector('.why-doodle-circle-shape');
  var inner = document.querySelector('.why-inner');
  var line = document.getElementById('whyRoadmapLine');
  if (!circle || !shape || !inner || !line) return;

  var PIN_TOP = 140;
  var ticking = false;

  function update() {
    ticking = false;
    if (window.innerWidth <= 1180 || getComputedStyle(circle).display === 'none') {
      shape.style.transform = '';
      return;
    }
    var innerRect = inner.getBoundingClientRect();
    var circleTop = innerRect.top + circle.offsetTop;
    var lineRect = line.getBoundingClientRect();
    var maxDelta = Math.max(0, (lineRect.bottom - innerRect.top) - (circle.offsetTop + circle.offsetHeight));
    var delta = Math.min(Math.max(PIN_TOP - circleTop, 0), maxDelta);
    shape.style.transform = 'translateY(' + delta + 'px)';
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ===== How it works: scroll-driven black wipe from the right + step reveal ===== */
(function () {
  var runway = document.getElementById('howRunway');
  if (!runway) return;
  var els = runway.querySelectorAll('[data-how-step]');
  var thresholds = [0.01, 0.11, 0.31, 0.29, 0.39];
  var quizThreshold = 0.47;
  var quizData = [
    ['When learning something new, you prefer to&hellip;', ['Read documentation and articles thoroughly','Watch video tutorials and follow along','Jump in and build something immediately','Follow a structured course from start to finish'], 0],
    ['When you get stuck on a problem, you first&hellip;', ['Google the error message carefully','Ask a community or friend for help','Take a break and return with fresh eyes','Re-read the official docs from scratch'], 2],
    ['How do you prefer to practice new skills?', ['Solve structured exercises and challenges','Build personal projects I actually care about','Replicate existing apps step by step','Contribute to open source projects'], 1],
    ['How long can you stay focused before needing a break?', ['Less than 25 minutes (Pomodoro style)','25\u201345 minutes, then a short break','1\u20132 hours when I\u2019m in the zone','I lose track of time when engaged'], 1],
    ['When a concept doesn\u2019t click immediately, you&hellip;', ['Find a completely different explanation','Try to implement it and learn from errors','Move on and come back to it later','Break it into smaller parts and study each'], 0],
    ['What motivates you to keep learning?', ['Clear milestones and measurable progress','Building things people actually use','The intellectual thrill of &ldquo;aha&rdquo; moments','Career advancement and salary goals'], 2],
    ['How do you prefer resources to be structured?', ['Short, focused tutorials under 15 minutes','Long-form deep dives over 1 hour','Project-based with practical examples only','Interactive playgrounds and sandboxes'], 1],
    ['When learning, you tend to&hellip;', ['Master one thing deeply before moving on','Explore broadly and connect the dots later','Follow a curated path with clear next steps','Mix theory with frequent hands-on practice'], 1],
    ['What kind of feedback helps you improve most?', ['Detailed code reviews from experienced devs','Automated tests that confirm correctness','Seeing my work deployed and actually used','Community reactions and positive feedback'], 0],
    ['When starting a brand new skill, you&hellip;', ['Research the best resources before diving in','Dive in with whatever comes up first','Ask an expert for a recommended path','Follow the official documentation only'], 1]
  ];
  var quizProgressFill = document.getElementById('quizProgressFill');
  var quizQ = document.getElementById('quizQ');
  var quizOptions = document.getElementById('quizOptions');
  var quizIndex = -1;
  var letters = ['A','B','C','D'];

  function renderQuiz(i) {
    if (i === quizIndex || !quizQ) return;
    quizIndex = i;
    var d = quizData[i];
    if (quizProgressFill) quizProgressFill.style.width = ((i + 1) / 10 * 100) + '%';
    quizQ.innerHTML = d[0];
    var opts = '';
    for (var o = 0; o < d[1].length; o++) {
      opts += '<div class="app-quiz-option' + (o === d[2] ? ' active' : '') + '">' +
        '<div class="app-quiz-option-badge"><span class="app-quiz-option-letter">' + letters[o] + '</span></div>' +
        '<div class="app-quiz-option-text">' + d[1][o] + '</div></div>';
    }
    quizOptions.innerHTML = opts;
  }
  var phoneScreen = document.getElementById('phoneScreen');
  var capBox = document.getElementById('howCaption');
  var capText = document.getElementById('howCaptionText');
  var lastCap = null;
  function setSceneCap(t) {
    if (!capBox || !capText || lastCap === t) return;
    lastCap = t;
    if (!t) { capBox.classList.remove('is-on'); return; }
    capBox.classList.add('is-on');
    // Split into 2 or 3 stacked lines depending on the text: pick whichever
    // count gives the most balanced line lengths (2 lines when it stays tight).
    var words = t.split(' ');
    function sizesFor(n, k) {
      if (k >= n) { var one = []; for (var i = 0; i < n; i++) one.push(1); return one; }
      var b = Math.floor(n / k), e = n % k, s = [];
      for (var j = 0; j < k; j++) s.push(b + (j < e ? 1 : 0));
      return s;
    }
    function maxLenFor(sizes) {
      var wi = 0, m = 0;
      for (var i = 0; i < sizes.length; i++) {
        m = Math.max(m, words.slice(wi, wi + sizes[i]).join(' ').length);
        wi += sizes[i];
      }
      return m;
    }
    var linesCount;
    if (words.length <= 3) { linesCount = words.length; }
    else {
      var twoMax = maxLenFor(sizesFor(words.length, 2));
      var threeMax = maxLenFor(sizesFor(words.length, 3));
      linesCount = (twoMax <= threeMax + 4) ? 2 : 3;
    }
    var sizes = sizesFor(words.length, linesCount);
    var lines = [];
    var wi = 0;
    for (var li = 0; li < sizes.length; li++) {
      lines.push(words.slice(wi, wi + sizes[li]).join(' '));
      wi += sizes[li];
    }
    var html = lines.map(function (l) {
      return '<span class="cap-line">' + l.replace(/</g, '&lt;') + '</span>';
    }).join('');
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(capText, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, onStart: function () { capText.innerHTML = html; } });
    } else {
      capText.innerHTML = html;
    }
  }
  window.__navSetCaption = setSceneCap;
  var raf = null;
  var autoStart = null;      // ms timestamp when the curtain finished closing
  var relayFired = false;
  var AUTO_MS = 9000;        // full phone sequence duration
  var LOOP_PAUSE_MS = 9000;  // pause after the sequence finishes before it replays
                              // (must be >= the relay/roadmap timeline's own
                              // runtime — ~8.5s — or the restart fires while the
                              // roadmap reveal is still mid-animation)
  var loopTimer = null;
  var ticking = false;
  function tick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; apply(); });
  }

  function apply() {
    raf = null;
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var total = rect.height - vh;
    var p = total > 0 ? (-rect.top) / total : 0;
    p = Math.max(0, Math.min(1, p));

    // This runway begins exactly when the word sweep is complete. Start the
    // curtain immediately here, while the warm panel is still pinned beneath
    // it, and sweep right-to-left across the same viewport over 120vh.
    var scrolled = -rect.top;
    var startPx = 0;
    var spanPx = vh * 1.2;
    var w = Math.max(0, Math.min(1, (scrolled - startPx) / spanPx));
    w = w < 0.5 ? 2 * w * w : 1 - Math.pow(-2 * w + 2, 2) / 2; // easeInOutQuad
    runway.style.setProperty('--w', w.toFixed(4));
    runway.classList.toggle('is-covered', w > 0.995);
    // the nav bar wipes to black from the right on the exact same progress
    document.documentElement.style.setProperty('--navw', w.toFixed(4));
    var navEl = document.querySelector('nav');
    if (navEl) {
      // Keep the nav wipe synchronized while this runway is beneath the fixed
      // header, even though the outgoing Why panel still marks the nav light.
      // Outside this runway, later warm sections regain their normal light nav.
      var navLine = navEl.offsetHeight * 0.5;
      var howIsUnderNav = rect.top <= navLine && rect.bottom > navLine;
      navEl.classList.toggle('nav-how-active', howIsUnderNav);
      navEl.classList.toggle('nav-wiped-links', howIsUnderNav && w > 0.30);
      navEl.classList.toggle('nav-wiped-logo', howIsUnderNav && w > 0.92);
    }

    // step reveals are TIME driven: once the curtain is fully closed the
    // phone sequence plays on its own clock, so the user can simply scroll
    // past to section 4 instead of scrubbing it.
    if (w > 0.995 && autoStart === null) autoStart = performance.now();
    var pw = autoStart === null
      ? 0
      : Math.max(0, Math.min(1, (performance.now() - autoStart) / AUTO_MS));
    if (pw < 1) tick();
    if (pw >= 1 && !relayFired) {
      relayFired = true;
      window.dispatchEvent(new CustomEvent('how:sequence-done'));
      // After the sequence completes, wait, then replay it from the top so
      // the phone demo loops for anyone still on this section.
      if (loopTimer) clearTimeout(loopTimer);
      loopTimer = setTimeout(function () {
        autoStart = performance.now();
        relayFired = false;
        window.dispatchEvent(new CustomEvent('how:sequence-restart'));
        tick();
      }, LOOP_PAUSE_MS);
    }

    els.forEach(function (el) {
      var i = parseInt(el.getAttribute('data-how-step'), 10) || 0;
      el.classList.toggle('in', pw >= thresholds[i]);
    });

    // Step 2: the Navigator icon "tap" — brief press animation, then the
    // phone screen swaps from the app grid to the roadmap form.
    if (phoneScreen) phoneScreen.classList.add('opened');

    // Step 3: further scroll swaps the roadmap form for the "Learning
    // Fingerprint" quiz screen (static mock, no real quiz logic).
    var quizIn = pw >= quizThreshold;
    if (quizIn) {
      var qp = (pw - quizThreshold) / Math.max(0.0001, (1 - quizThreshold));
      // Four beats after the form: 5/10, 10/10, skill level, crafting loader.
      var phase = qp < 0.25 ? 'quiz5' : qp < 0.5 ? 'quiz10' : qp < 0.75 ? 'level' : 'craft';
      if (phoneScreen) {
        phoneScreen.classList.toggle('quiz', phase === 'quiz5' || phase === 'quiz10');
        phoneScreen.classList.toggle('level', phase === 'level');
        phoneScreen.classList.toggle('craft', phase === 'craft');
        // Restart the four-second right-to-left box orbit whenever the loader begins.
        phoneScreen.classList.toggle('craft-spinning', phase === 'craft');
      }
      renderQuiz(phase === 'quiz10' ? 9 : 4);
      setSceneCap(phase === 'craft'
        ? 'Building your roadmap'
        : phase === 'level'
          ? 'Tell us your current level'
          : 'Quick check');
    } else {
      if (pw > 0) setSceneCap('Choose your preferred language');
      if (phoneScreen) {
        phoneScreen.classList.remove('quiz');
        phoneScreen.classList.remove('level');
        phoneScreen.classList.remove('craft');
        phoneScreen.classList.remove('craft-spinning');
      }
      renderQuiz(4);
    }
  }

  function onScroll() { if (raf === null) raf = requestAnimationFrame(apply); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  apply();
})();



/* ---- block 7 ---- */

window.addEventListener('load', function () {
(function () {
  // Server/source panels removed: relay runs without the right-hand side.
  var SERVERS = [];
  var PORT = { x: 292, y: 304 };
  var END_X = 626;

  var stage = document.getElementById('relayStage');
  var integrated = document.getElementById('relayIntegrated');
  var phoneStage = document.querySelector('.how-phone-stage');
  var headingStage = document.querySelector('.how-heading-stage');
  if (!stage || !integrated || !phoneStage || typeof gsap === 'undefined') return;

  function activateRelay() {
    integrated.classList.add('is-active');
    phoneStage.classList.add('relay-active');
    if (headingStage) headingStage.classList.remove('relay-hidden');
  }
  function deactivateRelay() {
    integrated.classList.remove('is-active');
    phoneStage.classList.remove('relay-active');
    if (headingStage) headingStage.classList.remove('relay-hidden');
    // The relay timeline animates #relayLoader / #relayRoadmap opacity with
    // GSAP .to() tweens, which leave inline style="opacity:..." behind.
    // Inline styles outrank the plain CSS class rules that are supposed to
    // reset these elements each cycle (".phone .relay-loader{opacity:0}"),
    // so without clearing them the loader can get stuck showing its old
    // end-of-timeline state — the phone then opens on that leftover loader
    // frame instead of the form screen when the sequence restarts.
    gsap.set(['#relayLoader', '#relayRoadmap'], { clearProps: 'opacity' });
  }

  var svgNS = 'http://www.w3.org/2000/svg';
  var pathsG = document.getElementById('relayPaths');
  var serversWrap = document.getElementById('relayServers');

  var el = function (tag, attrs) {
    var n = document.createElementNS(svgNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  // Hand-drawn server rack: 4 stacked units, sketchy white outline, status
  // lights that blink lime once that server answers.
  function rackSvg() {
    var units = '';
    for (var i = 0; i < 4; i++) {
      var y = 14 + i * 21;
      units +=
        '<g class="rk-unit" style="--d:' + (i * 0.18) + 's">' +
          '<path d="M11 ' + y + ' h40 a3 3 0 0 1 3 3 v13 a3 3 0 0 1 -3 3 h-40 a3 3 0 0 1 -3 -3 v-13 a3 3 0 0 1 3 -3 z"/>' +
          '<path d="M14 ' + (y + 5) + ' h9 M14 ' + (y + 11) + ' h9 M26 ' + (y + 5) + ' h7 M26 ' + (y + 11) + ' h11"/>' +
          '<circle class="rk-led" cx="42" cy="' + (y + 6) + '" r="1.6"/>' +
          '<circle class="rk-led" cx="47" cy="' + (y + 6) + '" r="1.6"/>' +
          '<circle class="rk-led" cx="42" cy="' + (y + 12) + '" r="1.6"/>' +
        '</g>';
    }
    return '<svg viewBox="0 0 66 116" aria-hidden="true">' +
      '<path class="rk-shell" d="M6 5 h50 a4 4 0 0 1 4 4 v92 a4 4 0 0 1 -4 4 h-50 a4 4 0 0 1 -4 -4 v-92 a4 4 0 0 1 4 -4 z"/>' +
      '<path class="rk-shell" d="M60 44 q5 1 5 8 q0 7 -5 8"/>' +
      '<path class="rk-shell" d="M12 105 v6 M50 105 v6"/>' +
      units +
      '<path class="rk-scan" d="M8 16 h46"/>' +
    '</svg>';
  }

  var nodes = SERVERS.map(function (s) {
    var d = 'M ' + PORT.x + ' ' + PORT.y + ' C 460 ' + PORT.y + ' 560 ' + s.cy + ' ' + END_X + ' ' + s.cy;
    var track = el('path', { d: d, fill: 'none', stroke: 'rgba(200,241,53,0.16)', 'stroke-width': 2 });
    var beam = el('path', { d: d, fill: 'none', stroke: '#C8F135', 'stroke-width': 3, 'stroke-linecap': 'round' });
    var motion = el('path', { d: d, fill: 'none', stroke: 'none' });
    var arrow = el('polygon', { points: '0,0 -18,-7 -18,7', fill: '#C8F135', opacity: 0 });
    var dotHalo = el('circle', { r: 15, fill: '#3BE07A', opacity: 0 });
    var dot = el('circle', { r: 7, fill: '#3BE07A', opacity: 0 });
    pathsG.appendChild(track); pathsG.appendChild(beam); pathsG.appendChild(motion);
    pathsG.appendChild(arrow); pathsG.appendChild(dotHalo); pathsG.appendChild(dot);

    var len = beam.getTotalLength();
    gsap.set([track, beam], { strokeDasharray: len, strokeDashoffset: len });

    var card = document.createElement('div');
    card.className = 'relay-server';
    card.style.top = (s.cy - 46) + 'px';
    card.innerHTML =
      '<div class="relay-server-ring"></div>' +
      '<div class="relay-server-card">' +
        '<div class="relay-rack">' + rackSvg() + '</div>' +
        '<div style="flex:1">' +
          '<div class="relay-server-name">' + s.name + '</div>' +
          '<div class="relay-server-sub"><span class="idle">awaiting request…</span><span class="live">' + s.sub + '</span></div>' +
        '</div>' +
        '<div class="relay-server-led"></div>' +
      '</div>';
    serversWrap.appendChild(card);

    return { s: s, track: track, beam: beam, motion: motion, arrow: arrow, dot: dot, halo: dotHalo, card: card, ring: card.querySelector('.relay-server-ring'), len: len };
  });

  // idle loops
  gsap.to('#relayRing', { rotate: 360, duration: 9, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  gsap.to('#relayRing', { scale: 1.06, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' });
  gsap.to('#relayPortPulse', { attr: { r: 22 }, opacity: 0, duration: 1.4, repeat: -1, ease: 'sine.out' });

  // responsive scale of the fixed-size stage
  var scaler = document.getElementById('relayScaler');
  var fit = function () {
    var vw = window.innerWidth, vh = window.innerHeight;
    var k = Math.min((vw - 40) / 1000, (vh - 190) / 620, 1);
    scaler.style.transform = 'translate(-50%, -50%) scale(' + Math.max(k, 0.3) + ')';
  };
  fit();
  window.addEventListener('resize', fit);

  var captionEl = document.getElementById('relayCaption');
  var setCap = function (t) {
    if (window.__navSetCaption) { window.__navSetCaption(t); return; }
    if (captionEl.textContent === t) return;
    gsap.fromTo(captionEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, onStart: function () { captionEl.textContent = t; } });
  };

  gsap.registerPlugin(MotionPathPlugin);

  // Time based: the relay starts by itself as soon as the phone sequence in
  // the same scene has finished. No scroll scrubbing.
  var tl = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
  var started = false;
  window.addEventListener('how:sequence-done', function () {
    if (started) return;
    started = true;
    activateRelay();
    tl.play(0);
  });
  // Loop: when the phone sequence restarts itself after its pause, reset and
  // replay this relay timeline too so both stay in sync each cycle. Also
  // hand control back to the phone's own screens (form/quiz/etc) by undoing
  // activateRelay() — otherwise relay-active/is-active stay set for the
  // whole next cycle and the phone shows a blank reset relay layer instead
  // of picking the sequence back up from the form screen.
  window.addEventListener('how:sequence-restart', function () {
    started = false;
    tl.pause(0);
    tl.invalidate();
    deactivateRelay();
  });

  tl.to('#relayGlow', { opacity: 1, duration: 1 }, 0);
  tl.add(function () { setCap('Preloader — sending your request out'); }, 0);

  nodes.forEach(function (n, i) {
    var t = 1.1 + i * 0.55;
    tl.to(n.card, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, t - 0.5);

    // arrow flies out along the path, drawing the line
    tl.to([n.track, n.beam], { strokeDashoffset: 0, duration: 1.1 }, t);
    tl.set(n.arrow, { opacity: 1 }, t);
    tl.to(n.arrow, {
      duration: 1.1,
      motionPath: { path: n.motion, align: n.motion, alignOrigin: [0.5, 0.5], autoRotate: true }
    }, t);
    tl.to(n.arrow, { opacity: 0, duration: 0.2 }, t + 1.05);

    // server lights up
    tl.add(function () { n.card.classList.add('on'); }, t + 1.05);
    tl.fromTo(n.ring, { opacity: 0.85, scale: 1 }, { opacity: 0, scale: 1.16, duration: 0.6, immediateRender: false, transformOrigin: '50% 50%' }, t + 1.05);
    tl.fromTo(n.card, { scale: 1 }, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1, immediateRender: false, transformOrigin: '50% 50%' }, t + 1.05);

    // green dot travels back home
    var r = t + 1.25;
    tl.set([n.dot, n.halo], { opacity: 1 }, r);
    tl.to([n.dot, n.halo], {
      duration: 1.2,
      motionPath: { path: n.motion, align: n.motion, alignOrigin: [0.5, 0.5], start: 1, end: 0 }
    }, r);
    tl.to([n.dot, n.halo], { opacity: 0, duration: 0.2 }, r + 1.15);
    tl.to(n.track, { attr: { stroke: 'rgba(59,224,122,0.4)' }, duration: 0.3 }, r + 1.2);
  });

  tl.add(function () { setCap('Pulling real sources across the web'); }, 1.4);
  tl.add(function () { setCap('Bringing the signal home'); }, 3.6);

  // hand over to the roadmap
  var hand = 5.1;
  tl.add(function () { setCap('Done — begin your journey'); }, hand);
  tl.to('#relayLoader', { opacity: 0, duration: 0.4 }, hand - 0.2);
  tl.to('#relayRoadmap', { opacity: 1, duration: 0.5 }, hand);
  tl.from('.relay-rm-card', { y: 22, opacity: 0, duration: 0.5, immediateRender: false, ease: 'power2.out' }, hand);
  tl.to('#relayRmRows .relay-rm-row', { opacity: 1, y: 0, duration: 0.35, stagger: 0.14, ease: 'power2.out' }, hand + 0.2);
  gsap.set('#relayRmRows .relay-rm-row', { y: 16 });
  tl.to('#relayRmBar', { width: '20%', duration: 0.6 }, hand + 0.7);
  tl.to('#relayRmScroll', { y: -110, duration: 1.6, ease: 'power1.inOut' }, hand + 1.2);
  tl.to({}, { duration: 0.6 });
})();
});


/* ---- Section 5: retention system (streaks, XP, quiz gates, badges, finish date) ---- */
(function () {
  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var section = document.getElementById('finish');
    if (!section) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Head + copy reveals */
    gsap.utils.toArray('#finish .finish-head, #finish .finish-beat-copy, #finish .fp-copy').forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 34, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    gsap.utils.toArray('#finish .stat-card').forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 44, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 84%' }
      });
    });

    /* 01 — streak counter ticks up, week strip lights one day at a time */
    var streakNum = document.getElementById('streakNum');
    if (streakNum) {
      ScrollTrigger.create({
        trigger: '#beatStreak', start: 'top 70%', once: true,
        onEnter: function () {
          var o = { v: 0 };
          gsap.to(o, {
            v: 47, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { streakNum.textContent = Math.round(o.v); }
          });
          var days = document.querySelectorAll('#streakWeek .sw-day');
          days.forEach(function (d, i) {
            gsap.delayedCall(0.25 + i * 0.13, function () { d.classList.add('lit'); });
          });
        }
      });
    }

    /* 02 — XP bar fills past the level line, level flips */
    var xpBar = document.getElementById('xpBar');
    if (xpBar) {
      ScrollTrigger.create({
        trigger: '#beatXp', start: 'top 70%', once: true,
        onEnter: function () {
          var xpNow = document.getElementById('xpNow');
          var o = { v: 700 };
          gsap.set(xpBar, { width: '70%' });
          gsap.to(o, {
            v: 950, duration: 1.5, ease: 'power2.out', delay: 0.35,
            onUpdate: function () {
              var v = Math.round(o.v);
              if (xpNow) xpNow.textContent = v.toLocaleString() + ' XP';
              xpBar.style.width = (v / 10) + '%';
            }
          });
          var step = document.getElementById('xpStepNew');
          gsap.delayedCall(0.35, function () { if (step) step.classList.add('done'); });
          var gain = document.getElementById('xpGain');
          if (gain) {
            gsap.fromTo(gain, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)', delay: 0.3 });
          }
        }
      });
    }

    /* 03 — quiz gate: pick, check, unlock */
    var gate = document.getElementById('quizGate');
    if (gate) {
      ScrollTrigger.create({
        trigger: '#beatQuiz', start: 'top 70%', once: true,
        onEnter: function () {
          var opts = gate.querySelectorAll('.qg-opt');
          var answer = gate.querySelector('.qg-opt.is-answer');
          gsap.delayedCall(0.5, function () { if (answer) answer.classList.add('picked'); });
          gsap.delayedCall(1.15, function () {
            if (answer) { answer.classList.remove('picked'); answer.classList.add('correct'); }
            opts.forEach(function (o) { if (!o.classList.contains('correct')) o.classList.add('dim'); });
            var lock = document.getElementById('qgLock');
            var res = document.getElementById('qgResult');
            if (lock) lock.style.display = 'none';
            if (res) {
              res.classList.add('show');
              gsap.from(res, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' });
            }
          });
        }
      });
    }

    /* 04 — achievements: badge tiles unlock, then drift past the locked headline */
    var badges = document.getElementById('finishBadges');
    if (badges) {
      var tiles = gsap.utils.toArray('#finishBadges .fb-tile');
      gsap.from(tiles, {
        opacity: 0, scale: 0.72, duration: 0.7, ease: 'back.out(1.7)',
        stagger: { each: 0.09, from: 'random' },
        scrollTrigger: { trigger: badges, start: 'top 65%' }
      });
      gsap.from('#finishBadges .fb-center', {
        opacity: 0, y: 26, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: badges, start: 'top 70%' }
      });

      if (!reduce && window.innerWidth > 900) {
        /* Wait five seconds after the entrance, then move every badge one
           clockwise position per second. The cards stay upright, creating
           the motion of a rotating tyre without rotating their text. */
        var badgePositions = tiles.map(function (tile) {
          var styles = getComputedStyle(tile);
          return {
            x: styles.getPropertyValue('--x').trim(),
            y: styles.getPropertyValue('--y').trim()
          };
        });
        var currentStep = 0;
        var spinTimer = null;

        function moveBadgesClockwise() {
          currentStep = (currentStep + 1) % badgePositions.length;
          tiles.forEach(function (tile, tileIndex) {
            var nextPosition = badgePositions[(tileIndex + currentStep) % badgePositions.length];
            gsap.to(tile, {
              '--x': nextPosition.x,
              '--y': nextPosition.y,
              duration: 0.82,
              ease: 'power2.inOut',
              overwrite: 'auto'
            });
          });
        }

        ScrollTrigger.create({
          trigger: badges,
          start: 'top 65%',
          once: true,
          onEnter: function () {
            gsap.delayedCall(5, function () {
              moveBadgesClockwise();
              spinTimer = window.setInterval(moveBadgesClockwise, 1000);
            });
          }
        });

        window.addEventListener('pagehide', function () {
          if (spinTimer) window.clearInterval(spinTimer);
        }, { once: true });
      }
    }

    /* 05 — projected finish date settles, pace track fills to today */
    var fpTrack = document.getElementById('fpTrack');
    if (fpTrack) {
      ScrollTrigger.create({
        trigger: '#beatDate', start: 'top 72%', once: true,
        onEnter: function () {
          gsap.fromTo(fpTrack, { width: '0%' }, { width: '62%', duration: 1.3, ease: 'power2.out', delay: 0.25 });
          var el = document.getElementById('fpDate');
          if (el) {
            var dates = ['Apr 02', 'Mar 26', 'Mar 19', 'Mar 14'];
            dates.forEach(function (d, i) {
              gsap.delayedCall(0.3 + i * 0.28, function () {
                el.textContent = d;
                gsap.fromTo(el, { opacity: 0.35, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
              });
            });
          }
        }
      });
    }

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();

/* ===== Section 6: Three modes — click-driven carousel (no autoplay) ===== */
(function () {
  var screens = document.querySelectorAll('[data-mode-screen]');
  var copies = document.querySelectorAll('[data-mode-copy]');
  var dots = document.querySelectorAll('[data-mode-dot]');
  var prevBtn = document.getElementById('modesPrev');
  var nextBtn = document.getElementById('modesNext');
  if (!screens.length || !copies.length) return;
  var total = screens.length;
  var current = 0;
  var hasGsap = typeof gsap !== 'undefined';
  var activeTl = null;

  /* ---- Internal per-mode playback timelines ----
     The phone frame itself stays static; only the content inside the
     active screen animates, replaying from the top every time that
     mode is switched to. */

  function playRoadmap() {
    var card = document.getElementById('mdRmCard');
    var rows = document.querySelectorAll('#mdRmRows .relay-rm-row');
    var bar = document.getElementById('mdRmBar');
    var scroll = document.getElementById('mdRmScroll');
    if (!card) return null;

    gsap.set(scroll, { y: 0 });
    gsap.set(card, { opacity: 0, y: 18 });
    gsap.set(rows, { opacity: 0, y: 14 });
    gsap.set(bar, { width: '0%' });

    var tl = gsap.timeline();
    tl.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
    tl.to(rows, { opacity: 1, y: 0, duration: 0.35, stagger: 0.13, ease: 'power2.out' }, 0.2);
    tl.to(bar, { width: '22%', duration: 0.6, ease: 'power2.out' }, 0.55);
    return tl;
  }

  function playSprint() {
    var goal = document.querySelector('#mdSprintScreen .modes-sprint-goal');
    var track = document.querySelector('#mdSprintScreen .modes-sprint-track');
    var bar = document.getElementById('mdSprintBar');
    var tasks = document.querySelectorAll('#mdSprintTasks .modes-sprint-task');
    if (!goal) return null;

    gsap.set([goal, track], { opacity: 0, y: 10 });
    gsap.set(tasks, { opacity: 0, y: 10 });
    gsap.set(bar, { width: '0%' });

    var tl = gsap.timeline();
    tl.to(goal, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0);
    tl.to(track, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.12);
    tl.to(bar, { width: '36%', duration: 0.7, ease: 'power2.out' }, 0.3);
    tl.to(tasks, { opacity: 1, y: 0, duration: 0.32, stagger: 0.12, ease: 'power2.out' }, 0.45);
    return tl;
  }

  function playYoutube() {
    var creators = document.querySelectorAll('#mdYtCreators .modes-yt-creator');
    var rows = document.querySelectorAll('#mdYtList .modes-yt-row');
    if (!creators.length) return null;

    gsap.set(creators, { opacity: 0, y: 8 });
    gsap.set(rows, { opacity: 0, y: 10 });

    var tl = gsap.timeline();
    tl.to(creators, { opacity: 1, y: 0, duration: 0.3, stagger: 0.09, ease: 'power2.out' }, 0);
    tl.to(rows, { opacity: 1, y: 0, duration: 0.34, stagger: 0.13, ease: 'power2.out' }, 0.3);
    return tl;
  }

  var players = [playRoadmap, playSprint, playYoutube];

  function playActive() {
    if (!hasGsap) return;
    if (activeTl) activeTl.kill();
    var fn = players[current];
    activeTl = fn ? fn() : null;
  }

  function render() {
    screens.forEach(function (el) {
      var i = parseInt(el.getAttribute('data-mode-screen'), 10);
      el.classList.toggle('is-active', i === current);
    });
    copies.forEach(function (el) {
      var i = parseInt(el.getAttribute('data-mode-copy'), 10);
      el.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (el) {
      var i = parseInt(el.getAttribute('data-mode-dot'), 10);
      el.classList.toggle('is-active', i === current);
    });
    playActive();
  }

  function goTo(i) {
    current = ((i % total) + total) % total;
    render();
  }

  dots.forEach(function (el) {
    el.addEventListener('click', function () {
      goTo(parseInt(el.getAttribute('data-mode-dot'), 10));
    });
  });
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  render();
})();

/* ---- Section 11: reaction buttons (Accountability & social) ---- */
(function () {
  var card = document.getElementById('socialReactionCard');
  if (!card) return;
  var btns = card.querySelectorAll('.social-react-btn');
  var sent = document.getElementById('socialReactSent');
  var timer = null;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.style.borderColor = ''; });
      btn.style.borderColor = 'var(--lime)';
      if (sent) {
        sent.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(function () { sent.classList.remove('show'); }, 1800);
      }
    });
  });
})();

/* ---- Waitlist form ---- */
(function () {
  var form = document.getElementById('waitlistForm');
  if (!form) return;
  var input = document.getElementById('waitlistEmail');
  var error = document.getElementById('waitlistError');
  var success = document.getElementById('waitlistSuccess');
  var submitBtn = document.getElementById('waitlistSubmit');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = (input.value || '').trim();

    if (!isValidEmail(value)) {
      input.classList.add('invalid');
      if (error) error.classList.add('show');
      return;
    }

    input.classList.remove('invalid');
    if (error) error.classList.remove('show');

    // No backend wired up yet — this is a pre-launch capture form.
    // Swap this block for a real submit (API call / form service) at launch.
    if (submitBtn) submitBtn.disabled = true;
    form.style.display = 'none';
    if (success) success.classList.add('show');
  });

  input.addEventListener('input', function () {
    if (input.classList.contains('invalid') && isValidEmail(input.value.trim())) {
      input.classList.remove('invalid');
      if (error) error.classList.remove('show');
    }
  });
})();

/* ================================================================
   SECTION TRANSITION — ported from v4 (sweep effect on the CTA
   section, right before the footer). ScrollTrigger scrubs the
   effect; reverses naturally on scroll-up; respects reduced motion.
   ================================================================ */
(function () {
  function initSectionTransitions() {
    var sections = document.querySelectorAll('.section-transition[data-transition]');
    if (!sections.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    sections.forEach(function (section) {
      section.style.setProperty('--transition-progress', reduced ? '1' : '0');
    });

    if (reduced) return;

    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      sections.forEach(function (section) {
        var state = { progress: 0 };
        gsap.to(state, {
          progress: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 96%',
            end: 'top 28%',
            scrub: 0.55,
            invalidateOnRefresh: true
          },
          onUpdate: function () {
            section.style.setProperty('--transition-progress', state.progress.toFixed(4));
          }
        });
      });
      ScrollTrigger.refresh();
      return;
    }

    /* Lightweight fallback if the CDN animation library cannot load. */
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || 1;
      sections.forEach(function (section) {
        var top = section.getBoundingClientRect().top;
        var progress = Math.max(0, Math.min(1, (vh * .96 - top) / (vh * .68)));
        section.style.setProperty('--transition-progress', progress.toFixed(4));
      });
    }
    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  if (document.readyState === 'complete') initSectionTransitions();
  else window.addEventListener('load', initSectionTransitions);
})();
