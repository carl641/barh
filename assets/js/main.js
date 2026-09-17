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
     Hovering a feature opens it. Buttons carry the same behaviour on click,
     tap and keyboard focus, because hover reaches neither a phone nor a
     keyboard. Opening one closes the rest and nothing closes on its own, so a
     row is always open and the column is never a set of bare headings. */
  var featureList = document.querySelector('[data-feature-list]');

  if (featureList) {
    var rows = featureList.querySelectorAll('article');

    var openRow = function (row) {
      Array.prototype.forEach.call(rows, function (other) {
        var isIt = other === row;
        other.classList.toggle('is-open', isIt);
        other.querySelector('button').setAttribute('aria-expanded', String(isIt));
      });
    };

    Array.prototype.forEach.call(rows, function (row) {
      var button = row.querySelector('button');
      row.addEventListener('mouseenter', function () { openRow(row); });
      button.addEventListener('click', function () { openRow(row); });
      button.addEventListener('focus', function () { openRow(row); });
    });
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
