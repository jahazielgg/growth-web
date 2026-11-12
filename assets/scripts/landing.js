// Growth · movimiento de la landing. GSAP + ScrollTrigger + Lenis.
// Reglas: solo transform, opacity y clip-path; todo ligado al scroll; sin movimiento, la página queda completa y quieta.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const simNum = $("[data-sim-num]"), homeTotal = $("[data-home-total]");
  const BASE = 405.1, HOME = 1228;

  // La frase de confianza en palabras, siempre (el scroll solo las enciende).
  const trust = $("#trust");
  const words = trust.textContent.trim().split(/\s+/);
  trust.innerHTML = words.map((w, i) => `<span class="w"${i >= words.length - 3 ? ' style="color:var(--lime)"' : ""}>${w}</span>`).join(" ");

  // Simulador de la escena 2: la cifra baja con el gasto y el motivo se ve.
  const sim = { v: BASE };
  const chips = $$(".sim-chips button");
  chips.forEach((b) => b.addEventListener("click", () => {
    chips.forEach((o) => { const on = o === b; o.classList.toggle("on", on); o.setAttribute("aria-pressed", on); });
    const target = BASE - parseFloat(b.dataset.cost);
    if (!window.gsap || document.documentElement.classList.contains("rm")) { simNum.textContent = fmt(target); return; }
    gsap.to(sim, { v: target, duration: 0.8, ease: "expo.out", onUpdate: () => (simNum.textContent = fmt(sim.v)) });
  }));

  const reduce = document.documentElement.classList.contains("rm");
  if (reduce || !window.gsap || !window.ScrollTrigger) { homeTotal.textContent = fmt(HOME); return; }
  gsap.registerPlugin(ScrollTrigger);

  // Scroll suave, movido por el reloj de GSAP.
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const target = $(a.getAttribute("href"));
    if (target) { e.preventDefault(); lenis.scrollTo(target, { duration: 1.4 }); }
  }));

  /* HERO · entrada por líneas y tres planos con profundidad propia */
  gsap.from(".hero-title .ln>span", { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.12 });
  gsap.from(".hero-phone img", { y: "28%", duration: 1.5, ease: "expo.out", delay: 0.25 });
  gsap.from([".tag", ".leaf"], { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.7)", stagger: 0.12, delay: 1 });
  gsap.from([".hero-foot", ".cue", ".bar"], { opacity: 0, y: 18, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.7 });
  gsap.utils.toArray(".hero [data-depth]").forEach((el) => {
    const d = parseFloat(el.dataset.depth);
    gsap.fromTo(el, { y: 0 }, { y: () => d * innerHeight, ease: "none",
      scrollTrigger: { trigger: document.body, start: 0, end: () => innerHeight, scrub: true, invalidateOnRefresh: true } });
  });
  gsap.to(".leaf", { rotate: 38, ease: "none", scrollTrigger: { trigger: document.body, start: 0, end: () => innerHeight, scrub: true } });
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const hero = $("#hero");
    const px = [[".hero-phone", 10], [".tag-a", 34], [".tag-b", -40], [".leaf", -56]].map(([s, k]) => ({ k, x: gsap.quickTo(s, "x", { duration: 0.9, ease: "power3" }) }));
    hero.addEventListener("pointermove", (e) => { const nx = e.clientX / innerWidth - 0.5; px.forEach((p) => p.x(nx * p.k)); });
  }

  const scrub = (section, extra = {}) => gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, ...extra }
  });

  /* ESCENA 1 · el aviso de Apple Pay cae en Movimientos y la lista se acomoda */
  {
    const rows = $$("[data-row]"), nu = $("[data-new]"), notif = $("[data-notif]");
    gsap.set(rows, { y: -76 });
    gsap.set(nu, { opacity: 0, scale: 0.94, y: -14 });
    gsap.set(notif, { opacity: 0, y: -80, scale: 0.94 });
    scrub(".relief").to({}, { duration: 6 })
      .to(notif, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" }, 0.3)
      .to(notif, { y: 70, scale: 0.9, opacity: 0, duration: 0.9, ease: "power2.in" }, 2.8)
      .to(rows, { y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 3.3)
      .to(nu, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "expo.out" }, 3.5);
  }

  /* ESCENA 2 · la captura sube, la cifra aparece y queda para jugar */
  {
    const tl = scrub(".reveal");
    gsap.set(".shot-phone", { yPercent: 40, rotate: 5, opacity: 0 });
    tl.to({}, { duration: 8 })
      .to(".shot-phone", { yPercent: 0, rotate: 0, opacity: 1, duration: 2.6, ease: "expo.out" }, 0.2)
      .to(".shot-phone", { yPercent: -4, duration: 5, ease: "none" }, 3)
      .fromTo(".sim", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "expo.out" }, 0.8);
    sim.v = 0; simNum.textContent = fmt(0);
    ScrollTrigger.create({ trigger: ".reveal", start: "top 30%", once: true,
      onEnter: () => gsap.to(sim, { v: BASE, duration: 1.8, ease: "expo.out", onUpdate: () => (simNum.textContent = fmt(sim.v)) }) });
  }

  /* ESCENA 3 · la casa: las categorías se llenan y cada quien aparece con lo que anotó */
  {
    const total = { v: 0 };
    gsap.set(".home-card", { y: 70, opacity: 0 });
    gsap.set(".hb-t i", { scaleX: 0 });
    gsap.set("[data-hf]", { y: 30, opacity: 0 });
    scrub(".home").to({}, { duration: 6 })
      .to(".home-card", { y: 0, opacity: 1, duration: 1.4, ease: "expo.out" }, 0.2)
      .to(".hb-t i", { scaleX: 1, duration: 1.6, ease: "power3.out", stagger: 0.25 }, 1)
      .to(total, { v: HOME, duration: 2.4, ease: "power2.out", onUpdate: () => (homeTotal.textContent = fmt(total.v)) }, 1)
      .to("[data-hf]", { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.55 }, 2.6);
  }

  /* CONFIANZA · la frase se enciende palabra por palabra y luego llegan las tres respuestas */
  {
    gsap.set(".trust-cols > div, .facts li, .trust .more", { y: 24, opacity: 0 });
    scrub(".trust").to({}, { duration: 10 })
      .to("#trust .w", { opacity: 1, duration: 0.6, stagger: 0.6 }, 0.3)
      .to(".trust-cols > div", { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.3 }, 5)
      .to([".facts li", ".trust .more"], { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1 }, 6.4);
  }

  /* TODO LO QUE TIENES */
  gsap.from(".all-grid li", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.05,
    scrollTrigger: { trigger: ".all-grid", start: "top 85%", once: true } });

  /* CIERRE · vuelve el lima */
  gsap.from(".close-title .ln>span", { yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".close", start: "top 55%", once: true } });
  gsap.from([".close .cta", ".close-note"], { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.3, scrollTrigger: { trigger: ".close", start: "top 45%", once: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
