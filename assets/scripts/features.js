// Las doce funciones de Growth. Cada una trae su maqueta (HTML) o una captura real.
// Los datos salen de la app y de la política de privacidad; nada aquí es una promesa nueva.
(() => {
  const shot = (src, alt, cls = "") => `<img class="shot ${cls}" src="${src}" alt="${alt}" loading="lazy">`;
  const ic = {
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
    bag: '<path d="M6 8h12l1 12H5L6 8zM9 8V6a3 3 0 0 1 6 0v2"/>',
    car: '<path d="M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16M4 16h16v3H4zM7 19v1M17 19v1"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    down: '<path d="M12 4v12M6 12l6 6 6-6"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  };
  const svg = (k) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[k]}</svg>`;

  const FEATURES = [
    { t: "Movimientos", d: "Lo que entró, lo que salió y el ritmo de cada día. Cada movimiento con su categoría y su cuenta.",
      ui: shot("assets/screens/movements.jpg", "Movimientos del mes en Growth", "top") },
    { t: "Hasta tu próximo ingreso", d: "Una cifra: cuánto te queda hasta que vuelva a entrar dinero, y qué pago viene.",
      ui: shot("assets/screens/insights.jpg", "Lo que te queda hasta tu próximo ingreso", "top") },
    { t: "Cuentas y categorías", d: "Separa tu dinero por cuenta y por categoría. Ves en qué se te va el mes.",
      ui: `<div class="ui"><h4>Cuentas</h4>
        <div class="row"><i class="dot a"></i><b>Mi cuenta</b><em>Principal</em></div>
        <div class="row"><i class="dot b"></i><b>Efectivo</b><em>Cartera</em></div>
        <h4>Categorías</h4>
        <div class="chips"><span>${svg("fork")}Comida</span><span>${svg("bag")}Compras</span><span>${svg("car")}Transporte</span><span>${svg("bulb")}Servicios</span></div></div>` },
    { t: "Pagos fijos y calendario", d: "Tus pagos que se repiten, con aviso de cuál viene. Si lo pides, Growth crea el evento en tu calendario.",
      ui: `<div class="ui"><h4>Próximos pagos</h4>
        <div class="row"><i class="dot a">${svg("cal")}</i><b>Netflix</b><em>en 3 días · S/ 44.90</em></div>
        <div class="row"><i class="dot b">${svg("cal")}</i><b>Internet</b><em>en 9 días</em></div>
        <div class="row"><i class="dot c">${svg("cal")}</i><b>Gimnasio</b><em>en 14 días</em></div>
        <div class="cal"><span></span><span></span><span class="on"></span><span></span><span></span><span></span><span></span><span></span><span></span><span class="on"></span><span></span><span></span><span></span><span></span></div></div>` },
    { t: "Presupuestos y metas", d: "Ponle presupuesto a tus categorías, compara con el mes pasado y ahorra para lo que quieres.",
      ui: `<div class="ui"><h4>Comida</h4>
        <div class="bars"><div class="bar-t"><div class="bar-f" style="--w:78%"></div><div class="bar-g" style="--w:58%"></div></div><span class="mono">S/ 605 · mes pasado</span></div>
        <h4>Meta</h4>
        <div class="goal"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" class="trk"/><circle cx="40" cy="40" r="32" class="arc" pathLength="100" style="--v:68"/></svg><div><b>68%</b><span class="mono">de tu meta</span></div></div></div>` },
    { t: "Apple Pay y atajos", d: "Pagas con Apple Pay o con un atajo y Growth lo anota. El monto y el comercio se procesan en tu dispositivo.",
      ui: `<div class="ui flow"><div class="notif"><i></i><div><span class="mono">Apple Pay</span><b>Almuerzo</b></div><em>S/ 18.50</em></div>
        <div class="arrow">${svg("down")}</div>
        <div class="row hl"><i class="dot a">${svg("fork")}</i><b>Almuerzo</b><em>Comida · anotado</em></div></div>` },
    { t: "ChatGPT y Claude", d: "Dile a tu asistente lo que gastaste y queda registrado en Growth.",
      ui: `<div class="ui chat"><p class="me">gasté 18.50 en almuerzo</p><p class="ai">Listo, lo anoté en Comida.</p>
        <div class="row hl"><i class="dot a">${svg("fork")}</i><b>Almuerzo</b><em>− S/ 18.50</em></div></div>` },
    { t: "Cuentas compartidas", d: "Invita a alguien y vean juntos lo que registran en ese espacio. La invitación pasa por iCloud.",
      ui: `<div class="ui"><div class="avs"><i>T</i><i>A</i></div><h4>Espacio compartido</h4>
        <div class="row"><i class="dot a">T</i><b>Súper</b><em>− S/ 86.20</em></div>
        <div class="row"><i class="dot b">A</i><b>Farmacia</b><em>− S/ 32.00</em></div></div>` },
    { t: "Face ID o código", d: "Bloquea la app con Face ID o con un código. Growth nunca recibe datos biométricos.",
      ui: `<div class="ui center"><div class="lockbig">${svg("lock")}</div><h4>Growth bloqueado</h4><span class="mono">Face ID · código</span></div>` },
    { t: "iCloud y Growth Sync", d: "Con iCloud o con Growth Sync tus datos viajan cifrados desde tu dispositivo. Nosotros no podemos leerlos.",
      ui: `<div class="ui sync"><div class="dev">iPhone</div><div class="wire"><code class="mono">a8f3·9c1e·47bd</code>${svg("lock")}</div><div class="dev">Mac</div></div>` },
    { t: "Exportar a Excel y JSON", d: "Llévate tus datos cuando quieras, en archivos que abre cualquier programa.",
      ui: `<div class="ui center"><div class="files"><div class="file"><b>Growth.xlsx</b><span class="mono">Excel</span></div><div class="file"><b>Growth.json</b><span class="mono">JSON</span></div></div></div>` },
    { t: "En la Mac, sin contraseñas", d: "Abre Growth en tu Mac y escanea el código con tu teléfono. Entras con tu cuenta y listo.",
      ui: shot("assets/screens/mac-link.jpg", "Growth en la Mac: un código QR para entrar con el teléfono", "wide") },
  ];

  const pad = (n) => String(n).padStart(2, "0");
  window.GROWTH_FEATURES = FEATURES;

  const list = document.querySelector("[data-feat-list]");
  const panels = document.querySelector("[data-feat-panels]");
  const cards = document.querySelector("[data-feat-cards]");
  FEATURES.forEach((f, i) => {
    list.insertAdjacentHTML("beforeend", `<li><button type="button" data-i="${i}"><span class="mono">${pad(i + 1)}</span><b>${f.t}</b></button></li>`);
    panels.insertAdjacentHTML("beforeend", `<article class="panel" data-panel="${i}" aria-hidden="${i ? "true" : "false"}"><div class="panel-ui">${f.ui}</div><p>${f.d}</p></article>`);
    cards.insertAdjacentHTML("beforeend", `<article class="card"><span class="mono">${pad(i + 1)}</span><h3>${f.t}</h3><div class="panel-ui">${f.ui}</div><p>${f.d}</p></article>`);
  });
})();
