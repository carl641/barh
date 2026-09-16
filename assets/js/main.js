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

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
