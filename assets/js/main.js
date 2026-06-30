/* AGM | The Cool Consultant — interactions */
(function () {
  "use strict";

  // ====== Google Ads conversion tracking ======
  // Account 850-424-2511. Fill the three labels from Google Ads → Conversions.
  // Until a real label is set, fires are skipped automatically (no errors).
  var ADS = {
    id: "AW-8504242511",        // Google Ads tag ID (= account number without dashes)
    lead: "LEAD_FORM_LABEL",    // "Submit lead form" conversion label
    call: "CALL_LABEL",         // "Phone call clicks" conversion label
    whatsapp: "WHATSAPP_LABEL"  // "WhatsApp clicks" conversion label
  };
  function gtagReady() { return typeof window.gtag === "function"; }
  // Activate the Ads tag on every page (gtag library is loaded by the inline tag in <head>)
  if (gtagReady()) { try { window.gtag("config", ADS.id); } catch (e) {} }
  function fireConversion(label) {
    if (!label || /_LABEL$/.test(label) || !gtagReady()) return; // skip until real label set
    try { window.gtag("event", "conversion", { send_to: ADS.id + "/" + label }); } catch (e) {}
  }

  // Header shadow on scroll
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var answer = item.querySelector(".faq-a");
      var isOpen = item.classList.toggle("open");
      answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : null;
    });
  });

  // Dropdown navigators (select[data-nav]) — go to selected page
  document.querySelectorAll('select[data-nav]').forEach(function (s) {
    s.addEventListener('change', function () { if (s.value) window.location.href = s.value; });
  });

  // Mobile mega-menu toggles
  document.querySelectorAll('.has-dd > .dd-toggle').forEach(function (t) {
    t.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width:760px)').matches) {
        e.preventDefault();
        t.parentElement.classList.toggle('open');
      }
    });
  });

  // Scroll reveal (content also shows via CSS animation if JS is unavailable)
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Animated counters
  var counters = document.querySelectorAll("[data-count]");
  var countObserver = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffixEl = el.querySelector(".suffix, span");
      var suffix = suffixEl ? suffixEl.outerHTML : "";
      var t0 = null, dur = 1400;
      var tick = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var val = Math.floor(p * target);
        el.innerHTML = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 }) : null;
  if (countObserver) counters.forEach(function (c) { countObserver.observe(c); });

  // Form handling
  document.querySelectorAll("form[data-lead], #heroForm, #contactForm").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      // Fire the Google Analytics / Ads lead event in all cases.
      try {
        if (typeof gtag === "function") {
          gtag("event", "generate_lead", { event_category: "lead", event_label: form.id || "quote_form" });
        }
        (window.dataLayer = window.dataLayer || []).push({ event: "lead_submit", form_id: form.id || "quote_form" });
      } catch (err) {}

      // If the form posts to an external handler (e.g. Web3Forms / Formspree),
      // let it submit natively — it will email the lead and then redirect to thank-you.html.
      if (form.getAttribute("action")) {
        var b = form.querySelector('button[type="submit"]');
        if (b) { b.textContent = "Sending…"; b.disabled = true; }
        return;
      }

      // Fallback (no email service connected yet): just go to the thank-you page.
      e.preventDefault();
      var hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }
      var prefix = /\/areas\//.test(window.location.pathname) ? "../" : "";
      window.location.href = prefix + "thank-you.html";
    });
  });

  // Phone-call click conversions (site-wide)
  document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
    el.addEventListener("click", function () { fireConversion(ADS.call); });
  });
  // WhatsApp click conversions (site-wide)
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(function (el) {
    el.addEventListener("click", function () { fireConversion(ADS.whatsapp); });
  });
  // Lead-form conversion fires once on the thank-you page
  if (/thank-you/.test(window.location.pathname)) { fireConversion(ADS.lead); }
})();
