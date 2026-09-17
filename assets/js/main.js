/* Bar H Solutions — homepage behaviour */
(function () {
  'use strict';

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Tapping a link jumps down the page — close the panel behind it.
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // The panel is desktop nav again above 900px; drop the open state on resize.
    var wide = window.matchMedia('(min-width: 901px)');
    var onWide = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- series dropdown ----------
     CSS opens the panel on hover; this adds click, touch and keyboard. */
  var subToggles = document.querySelectorAll('.sub-toggle');

  var closeSubs = function (except) {
    Array.prototype.forEach.call(subToggles, function (btn) {
      if (btn !== except) btn.setAttribute('aria-expanded', 'false');
    });
  };

  Array.prototype.forEach.call(subToggles, function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeSubs(btn);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  if (subToggles.length) {
    // Leaving the panel by any route collapses it.
    Array.prototype.forEach.call(document.querySelectorAll('.sub a'), function (a) {
      a.addEventListener('click', function () { closeSubs(); });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-sub')) closeSubs();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('.sub-toggle[aria-expanded="true"]');
      if (open) {
        closeSubs();
        open.focus();
      }
    });
  }

  /* ---------- quote form ----------
     Placeholder handler: until `action` points at a real endpoint, confirm
     inline rather than posting the lead into the void. */
  var form = document.getElementById('quote-form');

  if (form) {
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      var wired = form.getAttribute('action') && form.getAttribute('action') !== '#';
      if (wired) return; // real endpoint configured — let the browser post it

      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      form.reset();
      if (status) status.textContent = "Thanks — we'll be in touch within one business day.";
    });
  }

  /* ---------- standard features ----------
     Rows open on click, tap or keyboard focus. Where the viewport is wide
     enough and motion is not being avoided, the section also pins: it holds
     still while the scroll steps through the three features in turn, then
     releases and the page carries on. Opening one closes the others and
     nothing closes on its own, so a row is always open. */
  var featureList = document.querySelector('[data-feature-list]');
  var featureTrack = document.querySelector('[data-feature-track]');

  if (featureList) {
    var rows = featureList.querySelectorAll('article');

    var openRow = function (row) {
      Array.prototype.forEach.call(rows, function (other) {
        var isIt = other === row;
        other.classList.toggle('is-open', isIt);
        other.querySelector('button').setAttribute('aria-expanded', String(isIt));
      });
    };

    /* Choosing a feature by hand. While the section is pinned the scroll
       position is what decides the open row, so opening one without moving the
       scroll to match leaves the two disagreeing and the next scroll snaps the
       choice away. Travel to that feature's place in the track instead. The
       section is sticky, so it does not visibly move — only the rail and the
       drift catch up. */
    var pickRow = function (row, i) {};

    Array.prototype.forEach.call(rows, function (row, i) {
      var button = row.querySelector('button');
      button.addEventListener('click', function () { pickRow(row, i); });
      button.addEventListener('focus', function () { pickRow(row, i); });
    });

    if (featureTrack) {
      var section = featureTrack.closest('section');
      var roomy = window.matchMedia('(min-width: 901px)');
      var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
      var step = -1;
      var queued = false;
      var steerTo = null;
      var steerTimer = null;

      /* The middle of a feature's share of the track, so landing there leaves
         the scroll and the open row agreeing rather than on a boundary. */
      var restFor = function (i) {
        var span = featureTrack.offsetHeight - window.innerHeight;
        var top = featureTrack.getBoundingClientRect().top + window.pageYOffset;
        return Math.round(top + ((i + 0.5) / rows.length) * span);
      };

      pickRow = function (row, i) {
        if (step === i && row.classList.contains('is-open')) return;

        openRow(row);
        if (!section.classList.contains('is-pinned')) return;

        step = i;
        steerTo = restFor(i);
        window.clearTimeout(steerTimer);
        steerTimer = window.setTimeout(function () { steerTo = null; }, 1200);
        window.scrollTo(0, steerTo);
      };

      /* Which feature the scroll has reached. 0 until the pin engages — which
         is when the section has settled at the middle of the screen — then a
         third of the remaining track per feature. */
      var stepTo = function () {
        var span = featureTrack.offsetHeight - window.innerHeight;
        if (span <= 0) return;

        var run = -featureTrack.getBoundingClientRect().top / span;
        var reached = Math.min(Math.max(run, 0), 0.999);
        var next = Math.floor(reached * rows.length);

        /* --run drives the drift and the rail, so something keeps moving with
           the scroll between one feature and the next. */
        section.style.setProperty('--run', reached.toFixed(4));

        /* Travelling to a feature someone picked: let the rail keep up, but
           leave the open row alone — it is already the one they asked for, and
           swapping through the features on the way is the glitch. */
        if (steerTo !== null) {
          if (Math.abs(window.pageYOffset - steerTo) <= 2) {
            steerTo = null;
            window.clearTimeout(steerTimer);
          }
          return;
        }

        if (next !== step) {
          step = next;
          openRow(rows[next]);
        }
      };

      var onScroll = function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () {
          queued = false;
          if (section.classList.contains('is-pinned')) stepTo();
        });
      };

      var settle = function () {
        var pin = roomy.matches && !calm.matches;
        section.classList.toggle('is-pinned', pin);
        if (pin) { step = -1; stepTo(); }
        else { section.style.removeProperty('--run'); }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', settle);
      if (roomy.addEventListener) roomy.addEventListener('change', settle);
      if (calm.addEventListener) calm.addEventListener('change', settle);
      settle();
    }
  }

  /* ---------- build rotator ----------
     Cross-fades the slides inside a [data-rotator] and gives it dot controls.
     The dots are built here rather than in the markup, so a page without JS
     shows one still photograph instead of buttons that do nothing. Auto-advance
     is skipped entirely under prefers-reduced-motion, and pauses while the
     rotator is hovered or holds keyboard focus. */
  var rotators = document.querySelectorAll('[data-rotator]');

  Array.prototype.forEach.call(rotators, function (rot) {
    var slides = rot.querySelectorAll('.rotator-frame img');
    if (slides.length < 2) return;

    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    var dots = document.createElement('div');
    var index = 0;
    var timer = null;

    dots.className = 'rotator-dots';

    var show = function (next) {
      slides[index].classList.remove('is-active');
      dots.children[index].setAttribute('aria-current', 'false');
      index = (next + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      dots.children[index].setAttribute('aria-current', 'true');
    };

    var stop = function () {
      if (timer) { clearInterval(timer); timer = null; }
    };

    var start = function () {
      if (still.matches || timer) return;
      timer = setInterval(function () { show(index + 1); }, 5000);
    };

    Array.prototype.forEach.call(slides, function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + slides.length);
      dot.setAttribute('aria-current', String(i === 0));
      dot.addEventListener('click', function () { stop(); show(i); });
      dots.appendChild(dot);
    });

    rot.appendChild(dots);

    rot.addEventListener('mouseenter', stop);
    rot.addEventListener('mouseleave', start);
    rot.addEventListener('focusin', stop);
    rot.addEventListener('focusout', start);

    start();
  });

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
