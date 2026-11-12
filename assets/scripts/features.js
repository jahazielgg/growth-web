// «Todo lo que tienes con Growth»: las funciones, en segundo plano.
// Landing de visión: describe el producto hacia el que vamos, no solo lo que ya está publicado.
(() => {
  const ALL = [
    ["Captura sola", "Apple Pay, avisos del banco y Android se vuelven movimientos sin que escribas nada."],
    ["Pendientes", "Lo que no está claro te espera para que lo confirmes. Nada se inventa."],
    ["Hasta tu próximo ingreso", "Cuánto te queda de verdad, ya restado lo que viene."],
    ["¿Me lo puedo permitir?", "Prueba una compra antes de hacerla y mira cómo queda tu mes."],
    ["Growth MCP", "Conecta Claude, ChatGPT u otro asistente a tus finanzas, con los permisos que elijas."],
    ["Espacios compartidos", "Casa, pareja o viaje: su gente, presupuesto, pagos fijos y metas."],
    ["Quién debe a quién", "Divide por partes, montos o porcentajes, y salda con un toque."],
    ["Pagos fijos y calendario", "Lo que se repite, a la vista y en tu calendario si lo pides."],
    ["Presupuestos y metas", "Por categoría, por espacio y comparados con el mes pasado."],
    ["En todas partes", "iPhone, iPad, Mac, Windows, Android y web. Una sola cuenta."],
    ["Cifrado de extremo a extremo", "Solo tus dispositivos tienen la llave. Nosotros no vemos nada."],
    ["Face ID o código", "Bloquea la app. Growth nunca recibe datos biométricos."],
    ["Tus datos, tuyos", "Exporta a Excel o JSON cuando quieras, sin pedir permiso."],
    ["Sin publicidad", "Sin analítica, sin anuncios, sin vender tu información. Nunca."],
  ];
  const list = document.querySelector("[data-all]");
  ALL.forEach(([t, d], i) => list.insertAdjacentHTML("beforeend",
    `<li><span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${t}</b><p>${d}</p></li>`));
})();
