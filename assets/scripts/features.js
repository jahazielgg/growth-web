// «Todo lo que tienes con Growth»: las funciones, en segundo plano.
// Salen de la app y de la política de privacidad; nada aquí es una promesa nueva.
(() => {
  const ALL = [
    ["Movimientos", "Lo que entró y lo que salió, con su categoría y su cuenta."],
    ["Hasta tu próximo ingreso", "Cuánto te queda y qué pago viene."],
    ["Cuentas y categorías", "Tu dinero separado por cuenta y por en qué se va."],
    ["Pagos fijos y calendario", "Los pagos que se repiten; si lo pides, crea el evento en tu calendario."],
    ["Presupuestos y metas", "Presupuesto por categoría, comparación con el mes pasado y metas."],
    ["Apple Pay y atajos", "Registra tus compras con los atajos que configuras."],
    ["ChatGPT y Claude", "Dile a tu asistente un gasto y queda registrado."],
    ["Cuentas compartidas", "Invita a alguien y vean juntos lo que registran. La invitación pasa por iCloud."],
    ["Face ID o código", "Bloquea la app. Growth nunca recibe datos biométricos."],
    ["iCloud y Growth Sync", "Sincroniza entre tus dispositivos, con datos cifrados."],
    ["Exportar a Excel y JSON", "Llévate tus datos cuando quieras."],
    ["En la Mac, sin contraseñas", "Escaneas un código con tu teléfono y entras."],
  ];
  const list = document.querySelector("[data-all]");
  ALL.forEach(([t, d], i) => list.insertAdjacentHTML("beforeend",
    `<li><span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${t}</b><p>${d}</p></li>`));
})();
