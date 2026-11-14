// Growth · movimiento de la landing. GSAP + ScrollTrigger + Lenis.
// Carácter (growth-ux §3.5): lo que aparece nace de donde tiene sentido, lo que se va dura la mitad,
// resortes sin rebote. Sin movimiento, cada escena queda en su estado final.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const reduce = document.documentElement.classList.contains("rm");
  const motion = !reduce && window.gsap && window.ScrollTrigger;

  /* ---------- Estado que no depende del movimiento ---------- */

  // 1 · La pila de avisos: el más nuevo arriba, anclada abajo como en iOS.
  const notes = $$("[data-note]");
  const slotY = (k) => -notes.slice(0, k).reduce((h, n) => h + n.offsetHeight + 8, 0);
  const placeNotes = () => notes.forEach((n, k) => { n.style.translate = `0 ${slotY(k)}px`; });
  placeNotes();
  addEventListener("resize", placeNotes);

  // 2 · ¿Me alcanza? La cifra sale de lo que el scroll ya restó y de la compra que pruebas.
  const SALARY = 2500, FIXED = 1437.48, SPENT = 657.52, DAYS = 18;
  const LEFT = SALARY - FIXED - SPENT; // 405
  const leftEl = $("[data-left]"), perDay = $("[data-perday]"), free = $(".seg.free");
  const state = { base: LEFT, cost: 0, shown: LEFT };
  const paint = () => {
    const v = state.shown;
    leftEl.textContent = money(Math.abs(v)).replace(/^/, v < 0 ? "−" : "");
    leftEl.parentElement.classList.toggle("short", v < 0);
    if (state.base > LEFT + 1) perDay.textContent = "Restando tus fijos y lo que ya gastaste…";
    else if (v < 0) perDay.textContent = `Te faltarían US$ ${money(-v)} antes de cobrar`;
    else perDay.textContent = `≈ US$ ${money(v / DAYS)} al día durante ${DAYS} días`;
    if (free) free.style.transform = `scaleX(${Math.max(0.02, Math.min(1, v / LEFT))})`;
  };
  const target = () => state.base - state.cost;
  $$(".try button").forEach((b) => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    $$(".try button").forEach((o) => o.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", String(on));
    state.cost = on ? parseFloat(b.dataset.cost) : 0;
    if (motion) gsap.to(state, { shown: target(), duration: 0.7, ease: "expo.out", overwrite: true, onUpdate: paint });
    else { state.shown = target(); paint(); }
  }));
  paint();

  // 3 · Claude o ChatGPT: la misma conversación, en el entorno de cada uno.
  const mcp = $(".mcp");
  $$(".hosts button").forEach((b) => b.addEventListener("click", () => {
    mcp.dataset.host = b.dataset.host;
    $$(".hosts button").forEach((o) => o.setAttribute("aria-selected", String(o === b)));
  }));

  // 4 · La casa: cada aporte entra a la barra cuando su dueño toca «Casa».
  const spaces = $(".spaces");
  const PUT = { familia: [340, 260, 150], depa: [720, 300, 180] };
  const house = { fill: [1, 1, 1] };
  const usd = (n) => Math.round(n).toLocaleString("en-US");
  const paintHouse = () => {
    const put = PUT[spaces.dataset.mode], all = put.reduce((a, b) => a + b, 0);
    let total = 0;
    put.forEach((v, k) => {
      const f = house.fill[k]; total += v * f;
      $(`[data-bar="${k}"]`).style.width = `${(v / all) * f * 100}%`;
      $(`[data-put="${k}"]`).textContent = `US$ ${usd(v * f)}`;
      $(`[data-who="${k}"]`).classList.toggle("sel", f > 0.02);
    });
    $("[data-total]").textContent = usd(total);
  };
  $$(".modes button").forEach((b) => b.addEventListener("click", () => {
    spaces.dataset.mode = b.dataset.mode;
    $$(".modes button").forEach((o) => o.setAttribute("aria-selected", String(o === b)));
    paintHouse();
  }));
  paintHouse();

  if (!motion) return;

  /* ---------- Movimiento ---------- */
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  const isMobile = () => matchMedia("(max-width: 879px)").matches;
  const scrub = (trigger, extra = {}) => gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger, start: "top top", end: trigger === ".seed" ? "bottom bottom" : "bottom 200%", scrub: 0.6, ...extra },
  });

  /* ENTRE ESCENAS · una sola transición en todas: la escena nueva se abre desde abajo como una carta que
     se aplana al llegar; la anterior se encoge y se redondea detrás, sobre un fondo oscuro. Sin mezclar colores. */
  {
    document.documentElement.classList.add("mx");
    const sections = $$("main > section");
    sections.forEach((sec, i) => {
      const pin = sec.querySelector(".pin");
      const prev = i === 0 ? $(".hero") : sections[i - 1].querySelector(".pin");
      const range = { trigger: sec, start: "top bottom", end: "top top", invalidateOnRefresh: true };
      // La escena nueva queda quieta en pantalla mientras sube su sección (exacto, sin suavizado, para que no tiemble).
      gsap.fromTo(pin, { y: () => -innerHeight }, { y: 0, ease: "none", scrollTrigger: { ...range, scrub: true } });
      // La carta: entra desde abajo con los bordes redondeados y se aplana al cubrir la pantalla.
      gsap.timeline({ scrollTrigger: { ...range, scrub: 0.8 } })
        .fromTo(pin,
          { clipPath: "inset(100% 2.5% 0% 2.5% round 44px 44px 0px 0px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "power1.out", duration: 1 }, 0)
        .fromTo(prev,
          { scale: 1, borderRadius: 0 },
          { scale: 0.93, borderRadius: 36, ease: "power1.in", duration: 1, immediateRender: false }, 0);
    });
  }

  /* HERO · Grow despierta; el mazo lima sube desde el borde, como en Inicio */
  gsap.from(".hero h1 .ln>span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1 });
  gsap.from(".hero-copy p, .hero-copy .badge", { y: 16, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.35 });
  gsap.from(".grow-hero", { scale: 0.9, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.15, transformOrigin: "50% 90%" });
  gsap.from(".top", { y: -20, opacity: 0, duration: 0.8, ease: "expo.out", delay: 0.6 });
  gsap.to(".grow-hero img", { scaleY: 1.015, scaleX: 0.995, transformOrigin: "50% 95%", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
  const heroScroll = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".grow-hero", { y: () => innerHeight * 0.12, ease: "none", scrollTrigger: heroScroll });
  gsap.to(".hills-back", { y: () => innerHeight * 0.06, ease: "none", scrollTrigger: heroScroll });
  gsap.to(".hero-copy", { y: () => -innerHeight * 0.08, opacity: 0.2, ease: "none", scrollTrigger: heroScroll });

  /* 1 · CAPTURA · tres pagos, tres orígenes; el último pide confirmación */
  {
    const sources = $$(".sources li");
    gsap.set(notes, { opacity: 0, y: -24, scale: 0.96 });
    const tl = scrub(".capture", {
      onUpdate: (st) => sources.forEach((s, k) => s.classList.toggle("on", st.progress > 0.18 + k * 0.24)),
    }).to({}, { duration: 10 });
    notes.forEach((n, k) => tl.to(n, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" }, 1.6 + k * 2.4));
  }

  /* 2 · EL FLUJO · del sueldo salen los fijos y lo gastado; lo que queda es lo libre */
  {
    const segs = $$("[data-seg]");
    gsap.set(segs, { scaleX: 0 });
    gsap.set(".answer, .try", { opacity: 0, y: 20 });
    state.base = SALARY; state.shown = SALARY; paint();
    const sync = () => { state.shown = target(); paint(); };
    scrub(".flow").to({}, { duration: 10 })
      .to(".answer", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, 0.2)
      .to(segs[0], { scaleX: 1, duration: 2, ease: "power2.out" }, 1)
      .to(state, { base: SALARY - FIXED, duration: 2, ease: "power2.out", onUpdate: sync }, 1)
      .to(segs[1], { scaleX: 1, duration: 2, ease: "power2.out" }, 3.2)
      .to(state, { base: LEFT, duration: 2, ease: "power2.out", onUpdate: sync }, 3.2)
      .to(segs[2], { scaleX: 1, duration: 1.2, ease: "expo.out", onUpdate: paint }, 5.4)
      .to(".try", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, 6.2);
  }

  /* 3 · MCP · añades el conector, lo permites en tu teléfono y le preguntas */
  {
    const typed = $("[data-type]"), URL = typed.textContent;
    const steps = $$(".pane-chat [data-step]");
    const typing = { n: 0 };
    typed.textContent = "";
    gsap.set(".desk", { y: 70, opacity: 0 });
    gsap.set(".pane-chat", { autoAlpha: 0 });
    gsap.set(steps, { opacity: 0, y: 14 });
    gsap.set("[data-consent]", { yPercent: 115 });
    gsap.set("[data-tile]", { scale: 0.9, opacity: 0 });
    const chat = scrub(".mcp").to({}, { duration: 12 })
      .to(".desk", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0)
      .to(typing, { n: URL.length, duration: 1.8, ease: "none", onUpdate: () => (typed.textContent = URL.slice(0, Math.round(typing.n))) }, 0.8)
      // El permiso nace abajo, donde está tu teléfono; se va más rápido de lo que llegó.
      .to("[data-consent]", { yPercent: 0, duration: 1.2, ease: "expo.out" }, 3)
      .to("[data-tile]", { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.15 }, 3.5)
      .to("[data-consent]", { yPercent: 115, duration: 0.6, ease: "power2.in" }, 5.2)
      .to(".pane-connect", { autoAlpha: 0, duration: 0.4 }, 5.4)
      .to(".pane-chat", { autoAlpha: 1, duration: 0.4 }, 5.5);
    steps.forEach((s, i) => chat.to(s, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, 6 + i * 0.95));
  }

  /* 4 · LA CASA · cada uno anota lo suyo y toca Casa; la barra suma a todos */
  {
    house.fill = [0, 0, 0]; paintHouse();
    gsap.set(".who", { y: 40, opacity: 0 });
    gsap.set(".house-card", { y: 60, opacity: 0 });
    gsap.set("[data-end]", { opacity: 0, y: 12 });
    const tl = scrub(".spaces").to({}, { duration: 10 })
      .to(".house-card", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0.2);
    [0, 1, 2].forEach((k) => {
      const at = 0.8 + k * 2.2;
      tl.to(`[data-who="${k}"]`, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, at)
        .to(house.fill, { [k]: 1, duration: 1, ease: "power2.out", onUpdate: paintHouse }, at + 0.9);
    });
    tl.to("[data-end]", { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, 8);
  }

  /* 5 · DISPOSITIVOS · el teléfono escanea, confirmas y la computadora se llena */
  {
    gsap.set(".laptop", { y: 60, opacity: 0 });
    gsap.set("[data-scanner]", { yPercent: 130 });
    gsap.set(".e2e", { opacity: 0, y: 12 });
    scrub(".devices").to({}, { duration: 10 })
      .to(".laptop", { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }, 0)
      .to("[data-scanner]", { yPercent: 0, duration: 1.2, ease: "expo.out" }, 1.4)
      .fromTo("[data-scanline]", { top: "28%" }, { top: "62%", duration: 0.7, ease: "sine.inOut", repeat: 2, yoyo: true }, 2.4)
      .to("[data-ask]", { translate: "0 0", duration: 1, ease: "expo.out" }, 4.6)
      .to("[data-scanner]", { yPercent: 130, duration: 0.6, ease: "power2.in" }, 6.4)
      .to("[data-lap-app]", { opacity: 1, duration: 0.8 }, 6.6)
      .to(".e2e", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, 7.6);
  }

  /* 6 · LA SEMILLA · diez etapas; cada una brota desde la maceta, la anterior se va en la mitad del tiempo */
  {
    const stages = $$("[data-stage]");
    const last = stages.length - 1;
    let cur = 0;
    gsap.set(stages, { opacity: 0 }); gsap.set(stages[0], { opacity: 1 });
    const show = (i) => {
      if (i === cur) return;
      const prev = stages[cur]; cur = i;
      gsap.to(prev, { opacity: 0, scale: 0.97, duration: 0.18, ease: "power2.in", overwrite: true });
      gsap.fromTo(stages[i], { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.42, ease: "expo.out", overwrite: true });
    };
    const prog = { p: 0 };
    gsap.set(".seed-copy > *", { y: 20, opacity: 0 });
    scrub(".seed").to({}, { duration: 10 })
      .to(".seed-copy h2, .seed-copy p", { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15 }, 0)
      .to(prog, { p: 1, duration: 7, ease: "none", onUpdate: () => show(Math.round(prog.p * last)) }, 1)
      .to(".seed-copy .badges", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 7.6);
  }

  addEventListener("load", () => { placeNotes(); ScrollTrigger.refresh(); });
})();
