/* =========================================================
   VERDULERÍA LA VERDADERA — interacciones
   JS mínimo y sin librerías. Todo es mejora progresiva:
   sin JS la página se ve y funciona completa.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN DE HORARIOS (EDITAR acá si cambian) ----------
     days: 0 = domingo, 1 = lunes … 6 = sábado
     slots: franjas en horas decimales (13.5 = 13:30)                        */
  var HOURS = {
    timeZone: 'America/Argentina/Cordoba',
    days: [1, 2, 3, 4, 5, 6],
    slots: [[8, 13.5], [18, 21]]
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. Aparición al hacer scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 2. Estado "abierto / cerrado" en vivo (hora de Córdoba) ---------- */
  var DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function nowInStore() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: HOURS.timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    var get = function (type) { return parts.find(function (p) { return p.type === type; }).value; };
    return { day: DAY_INDEX[get('weekday')], hour: Number(get('hour')) + Number(get('minute')) / 60 };
  }

  function fmt(h) {
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }

  function statusText(now) {
    var openToday = HOURS.days.indexOf(now.day) !== -1;
    if (openToday) {
      for (var i = 0; i < HOURS.slots.length; i++) {
        var s = HOURS.slots[i];
        if (now.hour >= s[0] && now.hour < s[1]) {
          return { open: true, text: 'Abierto ahora · cierra a las ' + fmt(s[1]) };
        }
        if (now.hour < s[0]) {
          return { open: false, text: 'Cerrado · abrimos a las ' + fmt(s[0]) };
        }
      }
    }
    // Buscar el próximo día de apertura
    for (var d = 1; d <= 7; d++) {
      var next = (now.day + d) % 7;
      if (HOURS.days.indexOf(next) !== -1) {
        var label = d === 1 ? 'mañana' : ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'][next];
        return { open: false, text: 'Cerrado · abrimos ' + label + ' a las ' + fmt(HOURS.slots[0][0]) };
      }
    }
    return { open: false, text: 'Cerrado' };
  }

  var statusTexts = document.querySelectorAll('[data-status-text]');
  var statusHosts = Array.prototype.map.call(statusTexts, function (el) { return el.parentElement; });
  var nowMarker = document.querySelector('[data-now-marker]');

  function updateStatus() {
    var now;
    try { now = nowInStore(); } catch (e) { return; } // navegadores muy viejos: queda el texto estático
    var st = statusText(now);
    statusTexts.forEach(function (el) { el.textContent = st.text; });
    statusHosts.forEach(function (host) {
      host.classList.toggle('is-open', st.open);
      host.classList.toggle('is-closed', !st.open);
    });
    if (nowMarker) {
      nowMarker.style.left = (now.hour / 24 * 100) + '%';
      nowMarker.classList.add('is-set');
    }
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ---------- 3. Header con borde al scrollear + botón flotante ---------- */
  var header = document.querySelector('[data-header]');
  var fab = document.querySelector('[data-fab]');
  var hero = document.querySelector('.hero');
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      var past = !entries[0].isIntersecting;
      if (fab) fab.classList.toggle('is-visible', past);
    }, { threshold: 0.05 }).observe(hero);
  }

  /* ---------- 4. Parallax de productos decorativos (solo transform, rAF) ---------- */
  var decos = Array.prototype.slice.call(document.querySelectorAll('.deco[data-speed]'));
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (reduceMotion || ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      decos.forEach(function (el) {
        var rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return; // fuera de pantalla: no calcular
        var offset = (rect.top + rect.height / 2 - vh / 2) * Number(el.dataset.speed);
        el.style.translate = '0 ' + offset.toFixed(1) + 'px';
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 5. Los productos del hero siguen al mouse (solo desktop) ---------- */
  var art = document.querySelector('.hero-art');
  if (art && finePointer && !reduceMotion) {
    var heroRaf = 0;
    hero.addEventListener('pointermove', function (e) {
      cancelAnimationFrame(heroRaf);
      heroRaf = requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        art.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        art.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', function () {
      art.style.setProperty('--mx', 0);
      art.style.setProperty('--my', 0);
    });
  }

  /* ---------- 6. Año del footer ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
