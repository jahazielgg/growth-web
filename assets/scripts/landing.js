// Growth · movimiento de la landing. GSAP + ScrollTrigger + Lenis.
// Reglas: solo transform, opacity y clip-path; todo ligado al scroll; sin movimiento, la página queda completa y quieta.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const countEl = $("[data-m-count]"), labelEl = $("[data-m-label]");

  // Frase del manifiesto en palabras, siempre (el scroll solo las enciende).
  const manifesto = $("#manifesto");
  const words = manifesto.textContent.trim().split(/\s+/);
  manifesto.innerHTML = words.map((w, i) => `<span class="w"${i >= words.length - 6 ? ' style="color:var(--lime)"' : ""}>${w}</span>`).join(" ");

  const reduce = document.documentElement.classList.contains("rm");
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    countEl.textContent = fmt(405.1);
    labelEl.textContent = "Te quedan";
    return;
  }
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

  /* ESCENA 1 · Apertura: entrada por líneas y tres planos con profundidad propia */
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

  /* ESCENA 2 · Un mes en un scroll: tres pagos entran, la cifra baja, el teléfono sube y responde */
  const phone = $(".m-phone"), notes = $$("[data-note]"), steps = $$(".m-step");
  const imgs = $$(".m-screen img");
  const wide = matchMedia("(min-width:880px)").matches;
  const money = { v: 2500 };
  const paint = () => { countEl.textContent = fmt(money.v); };
  gsap.set(phone, { yPercent: 115, rotate: 4 });
  gsap.set(imgs[1], { clipPath: "inset(100% 0% 0% 0%)" });
  gsap.set(steps.slice(1), { opacity: 0, y: 24 });
  gsap.set(notes, { xPercent: -50, yPercent: -50, opacity: 0 });
  if (!wide) gsap.set(notes, { left: "50%", top: "60%" }); else gsap.set(notes, { left: "74%", top: "46%" });

  const swap = (a, b, at) => {
    tl.to(a, { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }, at)
      .to(b, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, at + 0.35);
  };
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: ".month", start: "top top", end: "bottom bottom", scrub: 0.6 },
    onUpdate() { const late = tl.time() > 7.1; labelEl.textContent = late ? "Te quedan" : "Este mes"; paint(); }
  });
  tl.to({}, { duration: 10 }, 0);
  swap(steps[0], steps[1], 0.8);
  const drops = [[120, 2380], [44.9, 2335.1], [18.5, 2316.6]];
  notes.forEach((n, i) => {
    const t = 1.3 + i * 1.15;
    tl.fromTo(n, { opacity: 0, y: 90 + i * 10, scale: 0.92, rotate: i % 2 ? 3 : -3 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.55, ease: "expo.out" }, t)
      .to(n, { opacity: 0, y: -50, scale: 0.78, duration: 0.45, ease: "power2.in" }, t + 0.75)
      .to(money, { v: drops[i][1], duration: 0.45, ease: "power2.inOut", onUpdate: paint }, t + 0.75);
  });
  tl.to(phone, { yPercent: 0, rotate: 0, duration: 1.3, ease: "expo.out" }, 5)
    .to(phone, { rotate: -2.5, scale: 1.03, duration: 0.5, ease: "power1.inOut", yoyo: true, repeat: 1 }, 6.4);
  swap(steps[1], steps[2], 5.6);
  tl.to(imgs[1], { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" }, 6.5)
    .to(money, { v: 405.1, duration: 1, ease: "power3.inOut", onUpdate: paint }, 6.5);

  /* ESCENA 3 · Funciones: índice fijo y panel que se revela con el scroll */
  const mm = gsap.matchMedia();
  mm.add("(min-width:880px)", () => {
    const F = window.GROWTH_FEATURES, n = F.length;
    const buttons = $$("[data-feat-list] button"), panels = $$("[data-panel]"), counter = $("[data-feat-count]");
    let cur = -1;
    const show = (i, dir = 1) => {
      if (i === cur) return;
      const out = panels[cur], inn = panels[i];
      if (out) {
        out.setAttribute("aria-hidden", "true");
        gsap.to(out.querySelector(".panel-ui"), { clipPath: dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)", duration: 0.6, ease: "expo.in", overwrite: true,
          onComplete: () => gsap.set(out, { visibility: "hidden" }) });
        gsap.to(out.querySelector("p"), { opacity: 0, duration: 0.25, overwrite: true });
      }
      inn.setAttribute("aria-hidden", "false");
      gsap.set(inn, { visibility: "visible" });
      gsap.fromTo(inn.querySelector(".panel-ui"), { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out", delay: out ? 0.25 : 0, overwrite: true });
      gsap.fromTo(inn.querySelectorAll(".panel-ui .row,.panel-ui .chips span,.panel-ui .notif,.panel-ui .chat p,.panel-ui .file,.panel-ui .dev,.panel-ui .bars,.panel-ui .goal,.panel-ui .lockbig,.panel-ui .avs,.panel-ui .shot"),
        { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: out ? 0.45 : 0.1, overwrite: true });
      gsap.fromTo(inn.querySelector("p"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", delay: out ? 0.5 : 0.15, overwrite: true });
      buttons.forEach((b, k) => b.classList.toggle("on", k === i));
      counter.textContent = `${String(i + 1).padStart(2, "0")} / ${n}`;
      dir = i > cur ? 1 : -1; cur = i;
    };
    show(0);
    const st = ScrollTrigger.create({
      trigger: ".feat", start: "top top", end: "bottom bottom",
      onUpdate: (self) => {
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        if (i !== cur) show(i, i > cur ? 1 : -1);
      }
    });
    const click = (e) => {
      const b = e.target.closest("button[data-i]"); if (!b) return;
      const i = +b.dataset.i, len = st.end - st.start;
      lenis.scrollTo(st.start + (i + 0.5) / n * len, { duration: 1.6 });
    };
    $("[data-feat-list]").addEventListener("click", click);
    return () => $("[data-feat-list]").removeEventListener("click", click);
  });
  mm.add("(max-width:879px)", () => {
    $$(".card").forEach((c) => {
      gsap.from(c.querySelector(".panel-ui"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 85%", once: true } });
      gsap.from([c.querySelector("h3"), c.querySelector("p")], { y: 24, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: c, start: "top 85%", once: true } });
    });
  });

  /* ESCENA 4 · Manifiesto: la frase se enciende palabra por palabra */
  gsap.to("#manifesto .w", { opacity: 1, ease: "none", stagger: 0.5,
    scrollTrigger: { trigger: ".manifesto", start: "top top", end: "bottom bottom", scrub: true } });
  gsap.from(".facts li, .more", { y: 20, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".manifesto", start: "top 40%", once: true } });

  /* ESCENA 5 · Cierre: vuelve el lima */
  gsap.from(".close-title .ln>span", { yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".close", start: "top 55%", once: true } });
  gsap.from([".close .cta", ".close-note"], { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.3, scrollTrigger: { trigger: ".close", start: "top 45%", once: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
