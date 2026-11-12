// Growth · movimiento de la landing de visión. GSAP + ScrollTrigger + Lenis.
// Reglas: solo transform, opacity y clip-path; todo ligado al scroll; sin movimiento, la página queda completa y quieta.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const reduce = document.documentElement.classList.contains("rm");
  const BASE = 405.1, DAYS = 18;

  // Frases grandes en palabras; las últimas N en lima. El scroll solo las enciende.
  $$("[data-words]").forEach((p) => {
    const words = p.textContent.trim().split(/\s+/), n = +p.dataset.accent || 0;
    p.innerHTML = words.map((w, i) => `<span class="w${i >= words.length - n ? " acc" : ""}">${w}</span>`).join(" ");
  });

  // 02 · ¿Me lo puedo permitir? La cifra, el veredicto y la línea hasta el cobro responden.
  const simNum = $("[data-sim-num]"), verdict = $("[data-verdict]"), tlFill = $("[data-tl-fill]");
  const sim = { v: BASE };
  let touched = false;
  const paint = () => {
    simNum.textContent = fmt(sim.v);
    simNum.parentElement.classList.toggle("low", sim.v < 0);
    if (tlFill) tlFill.style.transform = `scaleX(${Math.max(0, Math.min(1, sim.v / BASE))})`;
  };
  const chips = $$(".sim-chips button");
  chips.forEach((b) => b.addEventListener("click", () => {
    touched = true;
    chips.forEach((o) => { const on = o === b; o.classList.toggle("on", on); o.setAttribute("aria-pressed", on); });
    verdict.textContent = b.dataset.say;
    const target = BASE - parseFloat(b.dataset.cost);
    if (!window.gsap || reduce) { sim.v = target; paint(); return; }
    gsap.to(sim, { v: target, duration: 0.8, ease: "expo.out", overwrite: true, onUpdate: paint });
  }));
  paint();

  // 05 · Cifrado: el texto se vuelve ilegible al salir y se recupera solo al llegar.
  const cipher = $("[data-cipher]"), packet = $("[data-packet]"), toNode = $(".node.to");
  const PLAIN = cipher.textContent;
  const GLYPHS = "A9f#2kQx$7Zp!eR4m%Wb8&Ln0yT@3vH";
  const NOISE = [...PLAIN].map((c, i) => (c === " " ? " " : GLYPHS[(i * 7 + 3) % GLYPHS.length]));
  const setCipher = (amount) => {
    const k = Math.round(amount * PLAIN.length);
    cipher.textContent = [...PLAIN].map((c, i) => (i < k ? NOISE[i] : c)).join("");
    packet.classList.toggle("sealed", amount > 0.5);
  };

  if (reduce || !window.gsap || !window.ScrollTrigger) { setCipher(1); return; }
  gsap.registerPlugin(ScrollTrigger);

  // Scroll suave, movido por el reloj de GSAP.
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const target = a.getAttribute("href").length > 1 && $(a.getAttribute("href"));
    if (target) { e.preventDefault(); lenis.scrollTo(target, { duration: 1.4 }); }
  }));

  const mm = gsap.matchMedia();
  const isMobile = () => matchMedia("(max-width: 879px)").matches;

  /* HERO · entrada por líneas y planos con profundidad propia */
  gsap.from(".hero-title .ln>span", { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.12 });
  gsap.from(".hero-phone img", { y: "28%", duration: 1.5, ease: "expo.out", delay: 0.25 });
  gsap.from([".tag", ".leaf"], { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.7)", stagger: 0.14, delay: 1 });
  gsap.from([".hero-foot", ".cue", ".bar"], { opacity: 0, y: 18, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.7 });
  gsap.utils.toArray(".hero [data-depth]").forEach((el) => {
    const d = parseFloat(el.dataset.depth);
    gsap.fromTo(el, { y: 0 }, { y: () => d * innerHeight, ease: "none",
      scrollTrigger: { trigger: document.body, start: 0, end: () => innerHeight, scrub: true, invalidateOnRefresh: true } });
  });
  gsap.to(".leaf", { rotate: 38, ease: "none", scrollTrigger: { trigger: document.body, start: 0, end: () => innerHeight, scrub: true } });
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const hero = $("#hero");
    const px = [[".hero-phone", 10], [".tag-a", 34], [".tag-b", -40], [".tag-c", 24], [".leaf", -56]].map(([s, k]) => ({ k, x: gsap.quickTo(s, "x", { duration: 0.9, ease: "power3" }) }));
    hero.addEventListener("pointermove", (e) => { const nx = e.clientX / innerWidth - 0.5; px.forEach((p) => p.x(nx * p.k)); });
  }

  const scrub = (section, extra = {}) => gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, ...extra }
  });

  /* MANIFIESTOS · palabra por palabra */
  $$(".manifesto").forEach((m) => {
    scrub(m).to({}, { duration: 10 }).to($$(".w", m), { opacity: 1, duration: 0.5, stagger: 0.4 }, 0.4);
  });

  /* 01 · tres fuentes caen, una tras otra, y la lista se acomoda sola */
  {
    const step = () => (isMobile() ? 72 : 76);
    const rows = $$("[data-cap]");
    const notifs = $$("[data-notif]");
    // Cada fila vive en su sitio final; se sube según cuántas capturas faltan por llegar.
    const yAt = (k) => -(3 - k) * step();
    rows.forEach((r) => {
      const idx = +r.dataset.cap;
      gsap.set(r, { y: idx < 0 ? yAt(0) : yAt(idx + 1) - 14, opacity: idx < 0 ? 1 : 0, scale: idx < 0 ? 1 : 0.94 });
    });
    gsap.set(notifs, { opacity: 0, y: -70, scale: 0.94 });
    const tl = scrub(".capture", { invalidateOnRefresh: true }).to({}, { duration: 9 });
    notifs.forEach((n, k) => {
      const t = 0.3 + k * 2.8;
      tl.to(n, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out" }, t)
        .to(n, { y: 60, scale: 0.9, opacity: 0, duration: 0.7, ease: "power2.in" }, t + 1.3);
      const visible = rows.filter((r) => +r.dataset.cap < k);
      tl.to(visible, { y: () => yAt(k + 1), duration: 0.9, ease: "expo.out", stagger: 0.05 }, t + 1.7)
        .to(rows.find((r) => +r.dataset.cap === k), { y: () => yAt(k + 1), opacity: 1, scale: 1, duration: 0.9, ease: "expo.out" }, t + 1.8);
    });
  }

  /* 02 · la captura sube, la cifra aparece y queda para jugar */
  {
    gsap.set(".shot-phone", { yPercent: 40, rotate: 5, opacity: 0 });
    scrub(".runway").to({}, { duration: 8 })
      .to(".shot-phone", { yPercent: 0, rotate: 0, opacity: 1, duration: 2.6, ease: "expo.out" }, 0.2)
      .to(".shot-phone", { yPercent: -4, duration: 5, ease: "none" }, 3)
      .fromTo(".sim", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "expo.out" }, 0.4);
    sim.v = 0; paint();
    ScrollTrigger.create({ trigger: ".runway", start: "top 70%", once: true,
      onEnter: () => { if (!touched) gsap.to(sim, { v: BASE, duration: 1.8, ease: "expo.out", overwrite: true, onUpdate: paint }); } });
  }

  /* 03 · la conversación avanza con el scroll; las herramientas giran y se resuelven */
  {
    const msgs = $$(".chat [data-msg]");
    gsap.set(".chat", { y: 60, opacity: 0 });
    gsap.set(msgs, { y: 18, opacity: 0 });
    gsap.set(".scopes li", { y: 14, opacity: 0 });
    const tl = scrub(".mcp").to({}, { duration: 10 })
      .to(".chat", { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }, 0.1);
    msgs.forEach((m, i) => tl.to(m, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, 0.9 + i * 1.25));
    tl.to(".scopes li", { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.25 }, 7.4);
    gsap.to(".tool:not(.done) i", { rotate: 360, duration: 0.9, ease: "none", repeat: -1 });
  }

  /* 04 · los espacios se abren en abanico; la casa queda al frente y sus barras se llenan */
  {
    const total = { v: 0 }, homeTotal = $("[data-home-total]");
    const [s3, s2, s1] = $$("[data-space]");
    gsap.set([s1, s2, s3], { y: 80, opacity: 0 });
    gsap.set(".s1 .hb-t i, .sp-goal .hb-t i", { scaleX: 0 });
    gsap.set(".settle", { y: 20, opacity: 0 });
    homeTotal.textContent = fmt(0);
    mm.add({ desk: "(min-width: 880px)", mob: "(max-width: 879px)" }, (ctx) => {
      const spread = ctx.conditions.desk ? 1 : 0.55;
      scrub(".spaces").to({}, { duration: 8 })
        .to([s3, s2, s1], { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.2 }, 0.1)
        .to(s3, { x: 70 * spread, y: -10, rotate: 9 * spread, duration: 1.6, ease: "power3.out" }, 1.6)
        .to(s2, { x: 34 * spread, y: -4, rotate: 4.5 * spread, duration: 1.6, ease: "power3.out" }, 1.6)
        .to(".sp-goal .hb-t i", { scaleX: 1, duration: 1.4, ease: "power3.out" }, 1.8)
        .to(".s1 .hb-t i", { scaleX: 1, duration: 1.6, ease: "power3.out", stagger: 0.25 }, 2.4)
        .to(total, { v: 1228, duration: 2.4, ease: "power2.out", onUpdate: () => (homeTotal.textContent = fmt(total.v)) }, 2.4)
        .to(".settle", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 4.6);
    });
  }

  /* 05 · el paquete viaja: se cifra al salir, cruza el servidor ilegible y se abre solo en tu otro dispositivo */
  {
    const track = $("[data-track]");
    const shackle = $("[data-shackle]");
    const prog = { p: 0 };
    const render = () => {
      const p = prog.p;
      const vertical = isMobile();
      const span = vertical ? track.offsetHeight - packet.offsetHeight : track.offsetWidth - packet.offsetWidth;
      gsap.set(packet, vertical ? { x: 0, y: p * span } : { y: 0, x: p * span });
      // 0–0.25 se cifra · 0.25–0.75 viaja cifrado · 0.75–0.95 se descifra
      const enc = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.05, 0.28, 0, 1, p));
      const dec = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.74, 0.95, 0, 1, p));
      setCipher(enc * (1 - dec));
      shackle.setAttribute("d", enc * (1 - dec) > 0.5 ? "M8 11V7a4 4 0 0 1 8 0v4" : "M8 11V7a4 4 0 0 1 7.5-2");
      toNode.classList.toggle("got", p > 0.95);
      gsap.set(".cloud em", { opacity: p > 0.38 && p < 0.7 ? 1 : 0 });
    };
    gsap.set([".e2e-copy", ".wire", ".platforms li", ".e2e .facts li", ".e2e .more"], { y: 24, opacity: 0 });
    scrub(".e2e", { onRefresh: render }).to({}, { duration: 10 })
      .to(".e2e-copy", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0)
      .to(".wire", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0.4)
      .to(prog, { p: 1, duration: 6, ease: "power1.inOut", onUpdate: render }, 1.4)
      .to(".platforms li", { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.12 }, 7.2)
      .to([".e2e .facts li", ".e2e .more"], { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 8);
    render();
  }

  /* TODO LO QUE TIENES */
  gsap.from(".all-grid li", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.04,
    scrollTrigger: { trigger: ".all-grid", start: "top 85%", once: true } });

  /* CIERRE · vuelve el lima */
  gsap.from(".close-title .ln>span", { yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".close", start: "top 55%", once: true } });
  gsap.from([".close .cta", ".close-note"], { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.3, scrollTrigger: { trigger: ".close", start: "top 45%", once: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
