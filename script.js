/* ============================================================
   CONFIGURACIÓN
   ============================================================ */

// Rango de kilos de plástico retirado (Qp). 
const KG = { min: 0, max: 10000, paso: 100, porDefecto: 1000};

// Parámetros de cada pestaña (nombre, símbolo, unidad, descripción)
const PARAMETROS = {
  pesca: [
    { id: "V0", sim: "V0", nombre: "Valor Base Potencial", unidad: "€" },
    { id: "ratio", sim: "Scom/Stotal", nombre: "Ratio de Especies Comerciales", unidad: "" },
    { id: "Crep", sim: "Creparación", nombre: "Coste de daños", unidad: "€" },
    { id: "Cinac", sim: "Cinactividad", nombre: "Coste por tiempo perdido", unidad: "€" },
    { id: "Pcal", sim: "Pcalidad", nombre: "Devaluación del producto", unidad: "€" },
    { id: "Qp", sim: "Qp", nombre: "Plástico Retirado", unidad: "kg" },
    { id: "alfa", sim: "α", nombre: "Factor de eficiencia de limpieza", unidad: "€/kg" },
    { id: "Kgeo", sim: "Kgeo", nombre: "Factor Geoeconómico", unidad: "" },
  ],
  turismo: [
    { id: "V0", sim: "V0", nombre: "Valor Base Potencial del Turismo", unidad: "€" },
    { id: "ratio", sim: "Nplaya/Ntotal", nombre: "Ratio de Dependencia del Sol y Playa", unidad: "" },
    { id: "Pcanc", sim: "Pcancelaciones", nombre: "Coste de pérdida de visitas", unidad: "€" },
    { id: "Prep", sim: "Preputación", nombre: "Devaluación por imagen de destino", unidad: "€" },
    { id: "Phost", sim: "Phostelería", nombre: "Pérdida en Gasto Medio y Comercio Local", unidad: "€" },
    { id: "Qp", sim: "Qp", nombre: "Plástico Retirado", unidad: "kg" },
    { id: "beta", sim: "β", nombre: "Factor de recuperación turística", unidad: "€/kg" },
    { id: "Kgeo", sim: "Kgeo", nombre: "Factor Geoeconómico", unidad: "" },
  ],
};

// Localizaciones: aparecen como puntos en el mapa y rellenan los valores de Pesca y Turismo.
// OJO: los valores son estimaciones de ejemplo; sustitúyelos por datos reales cuando los tengas.
const LOCALIZACIONES = [
  {
    id: "gijon", nombre: "Gijón", coords: [43.5453, -5.6619],
    pesca:   { V0: 33000000, ratio: 0.14, Crep: 660000, Cinac: 40000, Pcal: 17000, Qp: 15000, Kgeo: 1.0 },
    turismo: { V0: 450000000, ratio: 0.45, Pcanc: 3600000, Prep: 2250000, Phost: 2700000, Qp: 40000, Kgeo: 1.0 },
  },
  {
    id: "cudillero", nombre: "Cudillero", coords: [43.5636, -6.1456],
    pesca:   { V0: 2500000, ratio: 0.12, Crep: 50000, Cinac: 30000, Pcal: 10000, Qp: 3000, Kgeo: 0.95 },
    turismo: { V0: 20000000, ratio: 0.35, Pcanc: 140000, Prep: 100000, Phost: 120000, Qp: 5000,  Kgeo: 0.95 },
  },
  {
    id: "ciudaddelcabo", nombre: "Ciudad del Cabo", coords: [-33.9249, 18.4241],
    pesca:   { V0: 75000000, ratio: 0.10, Crep: 2250000, Cinac: 1500000, Pcal: 750000, Qp: 25000,  Kgeo: 0.45 },
    turismo: { V0: 1350000000, ratio: 0.35, Pcanc: 10800000, Prep: 8100000, Phost: 9450000, Qp: 150000,  Kgeo: 0.50 },
  },
  {
    id: "danang", nombre: "Da Nang", coords: [16.0544, 108.2022],
    pesca:   { V0: 900000, ratio: 0.70, Crep: 20000, Cinac: 14000, Pcal: 9000, Qp: 5000, Kgeo: 0.30 },
    turismo: { V0: 1240000000, ratio: 0.65, Pcanc: 18600000, Prep: 12400000, Phost: 14880000, Qp: 300000, Kgeo: 0.35 },
  },
  {
    id: "valparaiso", nombre: "Valparaíso", coords: [-33.0472, -71.6127],
    pesca:   { V0: 1000000, ratio: 0.65, Crep: 18000, Cinac: 11000, Pcal: 7000, Qp: 5000, Kgeo: 0.60 },
    turismo: { V0: 150000000, ratio: 0.30, Pcanc: 1500000, Prep: 1200000, Phost: 1350000, Qp: 50000, Kgeo: 0.65 },
  },
  {
    id: "brisbane", nombre: "Brisbane", coords: [-27.4698, 153.0251],
    pesca:   { V0: 20000000, ratio: 0.08, Crep: 36000, Cinac: 9000, Pcal: 6000, Qp: 5000, Kgeo: 1.35 },
    turismo: { V0: 9690000000, ratio: 0.15, Pcanc: 19.38, Prep: 9690000, Phost: 14540000, Qp: 30000, Kgeo: 1.40 },
  },
];

/* ============================================================
   FÓRMULAS
   ============================================================ */
function formulaPesca(p) {
  return (p.Kgeo * p.Qp * coeficientePesca(p));
}

function formulaTurismo(p) {
  return (p.Kgeo * p.Qp * coeficienteTurismo(p));
}

function coeficientePesca(p) {
  return ((p.Crep + p.Cinac + p.Pcal) / (p.V0 * p.ratio)) * 50;
}

function coeficienteTurismo(p) {
  return ((p.Pcanc + p.Prep + p.Phost) / (p.V0 * p.ratio)) * 50;
}


/* ============================================================
   LÓGICA
   ============================================================ */
const FORMULAS = { pesca: formulaPesca, turismo: formulaTurismo };
const $ = (id) => document.getElementById(id);
const eur = (n) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const zona = (id) => LOCALIZACIONES.find((l) => l.id === id) || LOCALIZACIONES[0];

const estado = { modo: "basico", kg: KG.porDefecto, loc: LOCALIZACIONES[0].id, abierto: null, valores: {} };

// Rellena los valores desde la localización (y los kg en Qp)
function cargarLocalizacion() {
  const z = zona(estado.loc);
  estado.valores = { pesca: { ...z.pesca, Qp: estado.kg }, turismo: { ...z.turismo, Qp: estado.kg } };
}

function calcular() {
  const vp = FORMULAS.pesca(estado.valores.pesca);
  const vt = FORMULAS.turismo(estado.valores.turismo);
  $("kgValor").textContent = estado.kg.toLocaleString("es-ES") + " kg";
  $("pesca").textContent = eur(vp);
  $("turismo").textContent = eur(vt);
  $("beneficio").textContent = eur(vp + vt + estado.kg);
  $("nPesca").textContent = PARAMETROS.pesca.length + " datos →";
  $("nTurismo").textContent = PARAMETROS.turismo.length + " datos →";
  $("aviso").style.display = estado.modo === "basico" ? "block" : "none";
  if (estado.abierto) $("modalDesglose").innerHTML =
    `<div><span>Resultado ${estado.abierto}</span><b>${eur(FORMULAS[estado.abierto](estado.valores[estado.abierto]))}</b></div>`;
}

function pintarModal() {
  const tab = estado.abierto;
  const editable = estado.modo === "personalizado";
  $("modalTitulo").textContent = tab === "pesca" ? "Pesca" : "Turismo";
  $("modalDesc").textContent = editable
    ? "Modifica los valores para recalcular."
    : "Valores rellenados según la localización (solo lectura).";
  $("restaurar").style.display = editable ? "inline-block" : "none";
  $("modalLista").innerHTML = "";
  PARAMETROS[tab].forEach((def) => {
    const fila = document.createElement("div");
    fila.className = "param";
    fila.innerHTML = `<div><p><span class="sim"></span> · <b></b></p></div>
      <div class="valor"><input type="number" step="any" /><span class="pequeno"></span></div>`;
    fila.querySelector(".sim").textContent = def.sim;
    fila.querySelector("b").textContent = def.nombre;
    fila.querySelector(".valor span").textContent = def.unidad;
    const input = fila.querySelector("input");
    input.value = estado.valores[tab][def.id];
    input.disabled = !editable;
    input.addEventListener("input", () => {
      const v = Number(input.value);
      if (Number.isFinite(v)) { estado.valores[tab][def.id] = v; calcular(); }
    });
    $("modalLista").appendChild(fila);
  });
  calcular();
}

// Inicialización
const slider = $("kg");
Object.assign(slider, { min: KG.min, max: KG.max, step: KG.paso, value: KG.porDefecto });
$("kgMin").textContent = KG.min + " kg";
$("kgMax").textContent = KG.max.toLocaleString("es-ES") + " kg";
slider.addEventListener("input", () => {
  estado.kg = Number(slider.value);
  estado.valores.pesca.Qp = estado.kg;
  estado.valores.turismo.Qp = estado.kg;
  calcular();
});

const select = $("localizacion");
LOCALIZACIONES.forEach((l) => select.add(new Option(l.nombre, l.id)));
select.addEventListener("change", () => seleccionar(select.value, false));

document.querySelectorAll(".modo").forEach((b) => b.addEventListener("click", () => {
  estado.modo = b.dataset.modo;
  document.querySelectorAll(".modo").forEach((x) => x.classList.toggle("activo", x === b));
  if (estado.modo === "basico") cargarLocalizacion(); // Básico vuelve a los datos de la localización
  calcular();
}));

document.querySelectorAll(".pestana").forEach((b) => b.addEventListener("click", () => {
  estado.abierto = b.dataset.tab;
  pintarModal();
  $("modal").classList.remove("oculto");
}));

const cerrar = () => { $("modal").classList.add("oculto"); estado.abierto = null; };
$("cerrar").addEventListener("click", cerrar);
$("modal").addEventListener("click", (e) => { if (e.target.id === "modal") cerrar(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
$("restaurar").addEventListener("click", () => {
  estado.valores[estado.abierto] = { ...zona(estado.loc)[estado.abierto], Qp: estado.kg };
  pintarModal();
});

cargarLocalizacion();
calcular();

/* ============================================================
   MAPA
   ============================================================ */
const marcadores = {};

// Selecciona una localización; si viene del mapa, muestra la calculadora y baja hasta ella.
function seleccionar(id, desdeMapa) {
  estado.loc = id;
  select.value = id;
  cargarLocalizacion();
  calcular();
  if (estado.abierto) pintarModal();
  $("lugarActual").textContent = zona(id).nombre;
  Object.entries(marcadores).forEach(([k, m]) =>
    m.setStyle({ fillColor: k === id ? "#e0653a" : "#0f6e8c" }));
  if (desdeMapa) {
    $("calculadora").classList.remove("oculto");
    $("calculadora").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function iniciarMapa() {
  if (typeof L === "undefined") {
    $("mapa").innerHTML = '<p class="pequeno" style="padding:20px">No se pudo cargar el mapa. Revisa tu conexión.</p>';
    $("calculadora").classList.remove("oculto");
    return;
  }
  const mapa = L.map("mapa", { worldCopyJump: true, minZoom: 2 }).setView([15, 20], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap",
  }).addTo(mapa);
  LOCALIZACIONES.forEach((l) => {
    const m = L.circleMarker(l.coords, {
      radius: 10, color: "#fff", weight: 2, fillColor: "#0f6e8c", fillOpacity: 1,
    }).addTo(mapa);
    m.bindTooltip(l.nombre, { direction: "top" });
    m.on("click", () => seleccionar(l.id, true));
    marcadores[l.id] = m;
  });
  seleccionar(estado.loc, false);
}
iniciarMapa();
