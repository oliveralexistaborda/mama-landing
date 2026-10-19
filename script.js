/* Portada + historia en el tiempo. Sin dependencias. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  // ---------- Portada: animación de entrada ----------
  window.addEventListener("load", function () {
    requestAnimationFrame(function () {
      document.body.classList.add("is-visible");
    });
  });

  // ---------- Portada: movimiento sutil al desplazarse ----------
  if (!reduced) {
    var media = null;
    var ticking = false;

    function updateParallax() {
      if (!media) media = document.querySelector(".hero__media");
      if (media) {
        var y = window.scrollY || window.pageYOffset || 0;
        media.style.setProperty("--parallax", (y * 0.12) + "px");
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    window.setTimeout(function () {
      var els = document.querySelectorAll(".hero__title, .hero__subtitle, .hero__media, .hero__scroll");
      els.forEach(function (el) {
        el.style.transition = "opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)";
      });
    }, 1300);
  }

  // ---------- Utilidades de fecha ----------
  function daysSince(dateStr) {
    var parts = String(dateStr).split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 0;
    var start = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    var now = new Date();
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor((today - start) / 86400000);
  }

  function formatNumber(n) {
    return Number(n).toLocaleString("es-ES", { maximumFractionDigits: 0 });
  }

  // ---------- Historia: aparición de cada acontecimiento ----------
  var storyItems = document.querySelectorAll(".story__item");
  if (reduced || !("IntersectionObserver" in window)) {
    storyItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var storyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          storyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    storyItems.forEach(function (el) { storyObserver.observe(el); });
  }

  // ---------- Historia: contadores animados ----------
  function setStoryCounterValue(el) {
    if (!el) return;
    el.textContent = formatNumber(daysSince(el.dataset.date));
  }

  function animateCounter(el) {
    if (!el || el.dataset.animated === "true") return;
    el.dataset.animated = "true";
    var target = daysSince(el.dataset.date);
    if (reduced) {
      el.textContent = formatNumber(target);
      return;
    }
    var start = null;
    var duration = 1500;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = formatNumber(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }
    requestAnimationFrame(step);
  }

  var storyCounters = document.querySelectorAll("[data-story-counter]");
  if (reduced || !("IntersectionObserver" in window)) {
    storyCounters.forEach(animateCounter);
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    storyCounters.forEach(function (el) { counterObserver.observe(el); });
  }

  // Actualización automática al cambiar de día.
  function updateStoryCounters() {
    storyCounters.forEach(function (el) {
      if (el.dataset.animated === "true") setStoryCounterValue(el);
    });
  }

  function scheduleMidnightUpdate() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    var delay = next.getTime() - now.getTime();
    window.setTimeout(function () {
      updateStoryCounters();
      scheduleMidnightUpdate();
    }, delay);
  }
  scheduleMidnightUpdate();

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) updateStoryCounters();
  });

  // ---------- Historia: línea temporal que se revela al hacer scroll ----------
  var storyTimeline = document.querySelector(".story__timeline");
  if (storyTimeline) {
    if (reduced) {
      storyTimeline.style.setProperty("--story-progress", "1");
    } else {
      var storyTicking = false;
      function updateStoryProgress() {
        var rect = storyTimeline.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = (vh - rect.top) / (rect.height + vh);
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        storyTimeline.style.setProperty("--story-progress", String(progress));
        storyTicking = false;
      }
      function onStoryScroll() {
        if (!storyTicking) {
          requestAnimationFrame(updateStoryProgress);
          storyTicking = true;
        }
      }
      window.addEventListener("scroll", onStoryScroll, { passive: true });
      window.addEventListener("resize", onStoryScroll, { passive: true });
      updateStoryProgress();
    }
  }
  // ---------- Mamá está en todo: revelado progresivo ----------
  var likesSection = document.querySelector(".likes");
  if (likesSection) {
    if (reduced || !("IntersectionObserver" in window)) {
      likesSection.classList.add("is-visible");
    } else {
      var likesObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            likesSection.classList.add("is-visible");
            likesObserver.unobserve(likesSection);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      likesObserver.observe(likesSection);
    }
  }
  // ---------- Historias: revelado ----------
  var storiesSection = document.querySelector(".stories");
  if (storiesSection) {
    if (reduced || !("IntersectionObserver" in window)) {
      storiesSection.classList.add("is-visible");
    } else {
      var storiesObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            storiesSection.classList.add("is-visible");
            storiesObserver.unobserve(storiesSection);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      storiesObserver.observe(storiesSection);
    }
  }

  // ---------- Mensaje final: revelado ----------
  var finalMessageSection = document.querySelector(".final-message");
  if (finalMessageSection) {
    if (reduced || !("IntersectionObserver" in window)) {
      finalMessageSection.classList.add("is-visible");
    } else {
      var finalMessageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            finalMessageSection.classList.add("is-visible");
            finalMessageObserver.unobserve(finalMessageSection);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
      finalMessageObserver.observe(finalMessageSection);
    }
  }
})();
