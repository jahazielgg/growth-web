/* Growth / Connected Life — progressive enhancement.
   Product demonstrations are deterministic, fictional and never modify real accounts.
   Motion is optional; semantic content remains readable without it. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Workspaces: three genuinely different financial contexts.
     An interactive prototype, not a claim about shipped functionality. */
  const workspaces = {
    personal: {
      breadcrumb: "Personal", eyebrow: "TU PANORAMA",
      title: "Tu dinero, a tu manera.",
      label1: "Gastos del mes", value1: "S/ 1,840",
      label2: "Próximo compromiso", value2: "S/ 180",
      activity1: "Compra en supermercado", amount1: "− S/ 83",
      activity2: "Almuerzo", amount2: "− S/ 29",
      insight: "Una sola vista para saber qué está pasando con tu dinero.",
      avatars: "A"
    },
    casa: {
      breadcrumb: "Nuestra casa", eyebrow: "LO QUE COMPARTEN",
      title: "La casa también tiene sus cuentas.",
      label1: "Gastos del espacio", value1: "S/ 2,120",
      label2: "Pendiente de dividir", value2: "S/ 240",
      activity1: "Servicios del mes", amount1: "− S/ 150",
      activity2: "Compra para todos", amount2: "− S/ 96",
      insight: "Cada uno ve lo del grupo. Lo personal sigue siendo personal.",
      avatars: "A  M  J"
    },
    viaje: {
      breadcrumb: "Viaje al sur", eyebrow: "PLANES COMPARTIDOS",
      title: "Un viaje. Cuentas claras.",
      label1: "Gastos del viaje", value1: "S/ 760",
      label2: "Fondo del grupo", value2: "S/ 1,500",
      activity1: "Reserva del hospedaje", amount1: "− S/ 420",
      activity2: "Pasajes", amount2: "− S/ 340",
      insight: "Para enfocarse en lo que harán juntos, no en perseguir transferencias.",
      avatars: "A  M  J  L"
    }
  };
  const tabs = $$(".workspace-tab");
  const panel = $("#workspace-panel");
  const keys = ["breadcrumb","eyebrow","title","label1","value1","label2","value2","activity1","amount1","activity2","amount2","insight","avatars"];
  const output = Object.fromEntries(keys.map(k => [k, $("[data-ws-" + k + "]")]));
  tabs.forEach(tab => tab.id = "space-tab-" + tab.dataset.space);
  function selectWorkspace(name, focus = false) {
    const data = workspaces[name];
    if (!data) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.space === name;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panel.setAttribute("aria-labelledby", "space-tab-" + name);
    keys.forEach(key => { if (output[key]) output[key].textContent = data[key]; });
    if (window.gsap && !reduced) {
      gsap.killTweensOf(panel);
      gsap.fromTo(panel, {opacity: .83}, {opacity: 1, duration: .35, overwrite: "auto", ease: "power2.out"});
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectWorkspace(tab.dataset.space));
    tab.addEventListener("keydown", e => {
      if (!["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) return;
      e.preventDefault();
      let next = i;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") next = (i + tabs.length - 1) % tabs.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = tabs.length - 1;
      selectWorkspace(tabs[next].dataset.space, true);
    });
  });
  selectWorkspace("personal");

  /* MCP concept: only demonstrates authorized read-only context.
     No external request, no AI generation, no financial advice. */
  const prompts = {
    mudanza: {
      question: "¿Podemos mudarnos el próximo año sin dejar de ahorrar?",
      scopes: "Ingresos · Pagos fijos · Metas",
      answer: "Puedo ayudarte a comparar cómo cambiarían tus gastos recurrentes y tus metas de ahorro en distintos escenarios de mudanza.",
      evidence: "Solo consultaría la información que autorizaste."
    },
    viaje: {
      question: "Queremos hacer un viaje. ¿Por dónde empezamos?",
      scopes: "Workspace Viaje · Metas",
      answer: "Podemos reunir el presupuesto compartido, los gastos previstos y lo que cada persona quiere aportar para explorar un plan realista.",
      evidence: "Tus datos privados quedan fuera del workspace."
    },
    revision: {
      question: "¿Qué gastos tengo pendientes de revisar?",
      scopes: "Movimientos · Estado de revisión",
      answer: "Podría mostrarte los movimientos sin confirmar y sus posibles categorías, para que decidas qué corregir antes de sacar conclusiones.",
      evidence: "La revisión y las correcciones siguen bajo tu control."
    }
  };
  const promptButtons = $$(".prompt-choice");
  const question = $("[data-chat-question]");
  const answer = $("[data-chat-answer]");
  const scopes = $("[data-chat-scopes]");
  const evidence = $("[data-chat-evidence]");
  function selectPrompt(name) {
    const data = prompts[name]; if (!data) return;
    promptButtons.forEach(button => {
      const active = button.dataset.prompt === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    question.textContent = data.question;
    answer.textContent = data.answer;
    scopes.textContent = data.scopes;
    evidence.textContent = data.evidence;
    if (window.gsap && !reduced) {
      gsap.killTweensOf([".chat-query p", ".chat-answer", ".permissions-strip"]);
      gsap.fromTo([".chat-query p", ".chat-answer", ".permissions-strip"],
        {opacity:.58, y:7}, {opacity:1, y:0, stagger:.055, duration:.42, ease:"power2.out", overwrite:"auto"});
    }
  }
  promptButtons.forEach(button => button.addEventListener("click", () => selectPrompt(button.dataset.prompt)));
  selectPrompt("mudanza");

  /* Motion is a supporting layer, not a requirement to read the page. */
  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mobile = matchMedia("(max-width: 900px)").matches;

  // One scroll controller only; native scrolling on touch/reduced motion.
  if (!mobile && window.Lenis) {
    const lenis = new Lenis({lerp:.085, smoothWheel:true});
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(link => link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, {offset:-70, duration:1.25});
    }));
  }

  const reveal = (selector, options = {}) => $$(selector).forEach(el => {
    gsap.fromTo(el, {y: options.y ?? 38, opacity:0},
      {y:0, opacity:1, duration:options.duration ?? .95, ease:"power3.out",
        scrollTrigger:{trigger:el,start:"top 88%",once:true},
        clearProps:"transform,opacity"});
  });

  // Hero: headline leads; media follows. Avoid a preloader that delays comprehension.
  gsap.from(".hero-kicker", {autoAlpha:0,y:16,duration:.65,ease:"power2.out"});
  gsap.from(".hero h1 span", {opacity:0,y:46,duration:1.05,ease:"expo.out",stagger:.105,delay:.12});
  gsap.from(".hero-copy>p, .hero-actions", {opacity:0,y:22,duration:.85,ease:"power3.out",stagger:.09,delay:.48});
  gsap.from(".art-phone", {opacity:0,y:80,rotate:-13,duration:1.4,ease:"expo.out",delay:.28});
  gsap.from(".art-card", {opacity:0,scale:.82,duration:.9,ease:"back.out(1.5)",stagger:.12,delay:.7});

  if (!mobile) {
    const art = $(".hero-art");
    const move = [
      {el:$(".art-card-left"),move:22},
      {el:$(".art-card-right"),move:-20},
      {el:$(".art-card-bottom"),move:24}
    ].map(item => ({...item, update:gsap.quickTo(item.el,"x",{duration:.85,ease:"power3.out"})}));
    art.addEventListener("pointermove",e => {
      const rect=art.getBoundingClientRect();
      const nx=(e.clientX-rect.left)/rect.width-.5;
      move.forEach(item=>item.update(nx*item.move));
    });
    art.addEventListener("pointerleave",()=>move.forEach(item=>item.update(0)));
  }

  reveal(".section-heading, .spaces-intro, .context-copy, .privacy-copy, .devices-copy, .future-shell>div:first-child");
  reveal(".story-line, .context-bottom, .closing-label");

  // A single change of state: scattered expenses resolve into a reviewable record.
  const fragments = $$(".fragment");
  fragments.forEach((el,i) => {
    gsap.to(el, {
      x:mobile ? (i%2 ? -16 : 14) : (i%2 ? 46 : 30),
      y:mobile ? 0 : (i-1.5)*-11,
      rotate:0,
      ease:"none",
      scrollTrigger:{trigger:".friction-stage",start:"top 85%",end:"bottom 38%",scrub:.75}
    });
  });
  gsap.fromTo(".order-panel",{opacity:.6,y:55},{opacity:1,y:0,ease:"none",
    scrollTrigger:{trigger:".friction-stage",start:"top 80%",end:"center 50%",scrub:.7}});

  // Workspace entrance uses the horizontal / vertical split, not a second pinned scroll.
  gsap.fromTo(".workspace-demo",{opacity:.45,y:72},{opacity:1,y:0,ease:"none",
    scrollTrigger:{trigger:".workspace-demo",start:"top 95%",end:"top 46%",scrub:.7}});

  // Signature moment: one large contextual surface enters, then the user controls it.
  gsap.fromTo(".context-experience",{opacity:.55,y:90,rotation:mobile?0:4,scale:.94},
    {opacity:1,y:0,rotation:0,scale:1,ease:"none",
      scrollTrigger:{trigger:".context",start:"top 65%",end:"center 50%",scrub:.65}});
  gsap.fromTo(".context-connector",{opacity:.4,x:-35},{opacity:1,x:0,ease:"none",
    scrollTrigger:{trigger:".context",start:"top 55%",end:"center 55%",scrub:.65}});

  reveal(".privacy-demo, .devices-visual, .future-column, .closing-inner>p, .closing-actions", {y:46});
  gsap.fromTo(".device-mobile",{y:65,rotate:10},{y:0,rotate:0,ease:"none",
    scrollTrigger:{trigger:".devices-visual",start:"top 88%",end:"bottom 32%",scrub:.6}});

  // Hero background depth and legible finale.
  gsap.to(".art-halo",{rotate:12,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
  gsap.fromTo(".closing h2",{opacity:.55,y:65},{opacity:1,y:0,ease:"none",
    scrollTrigger:{trigger:".closing",start:"top 80%",end:"center 55%",scrub:.75}});

  window.addEventListener("load",() => ScrollTrigger.refresh(),{once:true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(()=>ScrollTrigger.refresh());
})();
