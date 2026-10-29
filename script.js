/* =========================================================
   ARTRESSA — Crea · Innova · Soluciona
   JS: navbar y progreso de scroll, menú móvil, revelados,
   contadores, parallax/giros, galería horizontal, acordeón FAQ,
   formulario de 2 pasos -> WhatsApp
========================================================= */

// ============ CONFIG: reemplazar con el número real del cliente ============
// Formato: código de país + número, sin espacios ni signos (ej. México: 521 + 10 dígitos)
const WHATSAPP_NUMBER = "5218131164776";

// Nombres de equipo para el mensaje (claves = value del <select> y data-equipo)
const EQUIPOS = {
  "jaula-doble": "Jaula de ardilla industrial doble entrada",
  "backward": "Turbina centrífuga backward inclined",
  "jaula-compacta": "Jaula de ardilla compacta",
  "ensamblado": "Ventilador centrífugo industrial ensamblado",
  "axial": "Aspa axial industrial de 6 palas",
  "radial": "Rotor de alta presión tipo radial",
  "asesoria": "No estoy seguro / necesito asesoría"
};

document.addEventListener("DOMContentLoaded", function () {

  // Preferencias del usuario y del dispositivo
  const mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqMovil = window.matchMedia("(max-width: 767px)");
  const mqGaleria = window.matchMedia("(min-width: 900px)");

  function limitar(valor, min, max) { return Math.min(max, Math.max(min, valor)); }

  /* ---------------------- Menú móvil ---------------------- */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const menuMovil = document.getElementById("menuMovil");
  const menuCerrar = document.getElementById("menuCerrar");

  function abrirMenu(abrir) {
    menuMovil.hidden = !abrir;
    document.body.classList.toggle("menu-abierto", abrir);
    navToggle.setAttribute("aria-expanded", abrir ? "true" : "false");
    if (abrir) menuCerrar.focus();
    else navToggle.focus({ preventScroll: true });
  }

  if (navToggle && menuMovil) {
    navToggle.addEventListener("click", function () { abrirMenu(true); });
    menuCerrar.addEventListener("click", function () { abrirMenu(false); });

    // Cierra el menú al elegir un link
    menuMovil.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { abrirMenu(false); });
    });

    // Cierra con Esc
    menuMovil.addEventListener("keydown", function (e) {
      if (e.key === "Escape") abrirMenu(false);
    });

    // Si la ventana pasa a escritorio con el menú abierto, se cierra
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
      if (e.matches && !menuMovil.hidden) abrirMenu(false);
    });
  }

  /* ---------------------- Revelados al entrar en pantalla ----------------------
     data-reveal="up|img|line": el CSS los oculta solo si <html> tiene .anim,
     así el contenido sigue visible sin JS o con movimiento reducido.
  ------------------------------------------------------------------------------ */
  const animar = !mqReducido.matches && "IntersectionObserver" in window;

  if (animar) {
    document.documentElement.classList.add("anim");
    // Las imágenes empiezan recortadas al 100% (clip-path) y el navegador las
    // vería sin área visible: se observa su contenedor y se marca la imagen
    const objetivos = new Map();
    const obsRevelar = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          objetivos.get(entrada.target).classList.add("is-in");
          obsRevelar.unobserve(entrada.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      const observado = el.dataset.reveal === "up" ? el : el.parentElement;
      objetivos.set(observado, el);
      obsRevelar.observe(observado);
    });
  }

  /* ---------------------- Contadores de cifras ---------------------- */
  const stats = document.getElementById("stats");
  const contadores = document.querySelectorAll("[data-count]");

  function textoContador(el, n) {
    return (el.dataset.pre || "") + n + (el.dataset.suf || "");
  }

  if (animar && stats) {
    contadores.forEach(function (el) { el.textContent = textoContador(el, 0); });
    const obsStats = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      obsStats.disconnect();
      let inicio = null;
      const duracion = 1800;
      function paso(t) {
        if (inicio === null) inicio = t;
        const k = limitar((t - inicio) / duracion, 0, 1);
        const e = 1 - Math.pow(1 - k, 3);
        contadores.forEach(function (el) {
          el.textContent = textoContador(el, Math.round(parseInt(el.dataset.count, 10) * e));
        });
        if (k < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    }, { threshold: 0.35 });
    obsStats.observe(stats);
  }

  /* ---------------------- Movimiento ligado al scroll ----------------------
     Atributos en el HTML:
       data-parallax="0.2"  desplazamiento vertical respecto a su contenedor
       data-rotate="0.05"   grados de giro por pixel de scroll
     El avance se mide con el contenedor padre (que no se transforma).
  -------------------------------------------------------------------------- */
  const capasParallax = document.querySelectorAll("[data-parallax]");
  const capasGiro = document.querySelectorAll("[data-rotate]");
  const galeria = document.getElementById("taller");
  const galeriaTrack = document.getElementById("galeriaTrack");

  function moverCapas() {
    const alto = window.innerHeight;
    const y = window.scrollY;
    // En celular se reduce la intensidad para que el scroll no se trabe
    const intensidad = mqMovil.matches ? 0.4 : 1;

    capasParallax.forEach(function (el) {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > alto + 200) return;
      const velocidad = parseFloat(el.dataset.parallax) || 0.1;
      // En el hero se mide desde el tope; en lo demás, desde el centro de la pantalla
      const centro = el.parentElement.classList.contains("hero") ? rect.top : rect.top + rect.height / 2 - alto / 2;
      el.style.transform = "translate3d(0," + (-centro * velocidad * intensidad).toFixed(1) + "px,0)";
    });

    capasGiro.forEach(function (el) {
      el.style.transform = "rotate(" + (y * (parseFloat(el.dataset.rotate) || 0.05)).toFixed(2) + "deg)";
    });

    // Galería: el scroll vertical mueve la pista en horizontal (solo escritorio)
    if (galeria && galeriaTrack && mqGaleria.matches) {
      const g = galeria.getBoundingClientRect();
      const altoSticky = limitar(alto, 640, 1000);
      const avance = limitar(-g.top / Math.max(1, g.height - altoSticky), 0, 1);
      const distancia = Math.max(0, galeriaTrack.scrollWidth - window.innerWidth);
      galeriaTrack.style.transform = "translate3d(" + (-avance * distancia).toFixed(1) + "px,0,0)";
    }
  }

  // Quita los estilos en línea cuando el usuario pide movimiento reducido
  function limpiarCapas() {
    capasParallax.forEach(function (el) { el.style.transform = ""; });
    capasGiro.forEach(function (el) { el.style.transform = ""; });
  }

  /* ---------------------- Navbar + barra de progreso ---------------------- */
  const barraProgreso = document.getElementById("scrollProgress");
  let ultimoY = 0;

  function actualizarNavbar() {
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (barraProgreso) barraProgreso.style.transform = "scaleX(" + (total > 0 ? y / total : 0).toFixed(4) + ")";
    if (!navbar) return;

    navbar.classList.toggle("is-solid", y > 24);
    // Se oculta al bajar y reaparece al subir
    const delta = y - ultimoY;
    if (Math.abs(delta) > 6) {
      navbar.classList.toggle("is-hidden", delta > 0 && y > 160);
      ultimoY = y;
    }
    if (y < 160) navbar.classList.remove("is-hidden");
  }

  // Un solo requestAnimationFrame por cuadro para todo lo ligado al scroll
  let pendiente = false;
  function alHacerScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      actualizarNavbar();
      if (!mqReducido.matches) moverCapas();
    });
  }

  window.addEventListener("scroll", alHacerScroll, { passive: true });
  window.addEventListener("resize", alHacerScroll);
  mqReducido.addEventListener("change", function () {
    if (mqReducido.matches) limpiarCapas();
    alHacerScroll();
  });
  mqGaleria.addEventListener("change", function () { if (galeriaTrack) galeriaTrack.style.transform = ""; alHacerScroll(); });
  alHacerScroll();

  /* ---------------------- Acordeón FAQ ---------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      // Cierra los demás (acordeón exclusivo)
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-answer").hidden = true;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
        item.querySelector(".faq-answer").hidden = false;
      }
    });
  });

  /* ---------------------- Formulario de 2 pasos -> WhatsApp ---------------------- */
  const quoteForm = document.getElementById("quoteForm");
  const formEnviado = document.getElementById("formEnviado");
  const agenda = document.getElementById("agenda");

  if (quoteForm) {
    const pasos = quoteForm.querySelectorAll(".form-paso");
    const segmentos = document.querySelectorAll("#pasosBarra > div");
    const pasosBarra = document.getElementById("pasosBarra");
    const equipoChip = document.getElementById("equipoChip");
    const equipoChipTxt = document.getElementById("equipoChipTxt");
    const campos = {
      1: ["nombre", "telefono", "correo"],
      2: ["equipo"]
    };
    let pasoActual = 1;

    function valor(nombre) {
      const el = quoteForm.elements[nombre];
      return (el ? el.value : "").trim();
    }

    function validar(nombre) {
      const v = valor(nombre);
      if (nombre === "nombre") return v.length < 2 ? "Escribe tu nombre." : "";
      if (nombre === "telefono") {
        const d = v.replace(/\D/g, "");
        if (!d) return "Escribe un teléfono de contacto.";
        return (d.length < 10 || d.length > 13) ? "El teléfono debe tener 10 dígitos." : "";
      }
      if (nombre === "correo") return v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Revisa el formato del correo." : "";
      if (nombre === "equipo") return v ? "" : "Elige un equipo o «No estoy seguro».";
      return "";
    }

    function mostrarError(nombre, mensaje) {
      document.getElementById("e-" + nombre).textContent = mensaje;
      const el = document.getElementById(nombre);
      if (el) el.setAttribute("aria-invalid", mensaje ? "true" : "false");
    }

    function revisarPaso(n) {
      let primero = null;
      campos[n].forEach(function (nombre) {
        const mensaje = validar(nombre);
        mostrarError(nombre, mensaje);
        if (mensaje && !primero) primero = nombre;
      });
      if (primero) {
        const el = document.getElementById(primero) || quoteForm.querySelector("[name='" + primero + "']");
        if (el) el.focus();
      }
      return !primero;
    }

    // Revalida al salir del campo o al cambiarlo si ya mostraba error
    ["nombre", "telefono", "correo", "equipo"].forEach(function (nombre) {
      const el = document.getElementById(nombre);
      el.addEventListener("blur", function () {
        if (el.value.trim() || nombre === "nombre" || nombre === "telefono") mostrarError(nombre, validar(nombre));
      });
      el.addEventListener("input", function () {
        if (el.getAttribute("aria-invalid") === "true" || nombre === "equipo") mostrarError(nombre, validar(nombre));
      });
    });

    function actualizarChip() {
      const equipo = valor("equipo");
      equipoChip.hidden = !equipo || pasoActual === 2;
      equipoChipTxt.textContent = EQUIPOS[equipo] || "";
    }

    function irAPaso(n) {
      pasoActual = n;
      pasos.forEach(function (paso) { paso.hidden = paso.dataset.paso !== String(n); });
      segmentos.forEach(function (seg, i) { seg.classList.toggle("is-on", i < n); });
      pasosBarra.setAttribute("aria-label", "Paso " + n + " de 2");
      actualizarChip();
      // Regresa al inicio de la sección si el formulario quedó arriba de la pantalla
      if (agenda.getBoundingClientRect().top < 0) {
        agenda.scrollIntoView({ behavior: mqReducido.matches ? "auto" : "smooth", block: "start" });
      }
    }

    quoteForm.addEventListener("click", function (e) {
      const boton = e.target.closest("[data-accion]");
      if (!boton) return;
      if (boton.dataset.accion === "siguiente" && revisarPaso(pasoActual)) irAPaso(pasoActual + 1);
      if (boton.dataset.accion === "atras") irAPaso(Math.max(1, pasoActual - 1));
    });

    // "Cotizar este equipo" preselecciona el producto en el formulario
    document.querySelectorAll("[data-equipo]").forEach(function (link) {
      link.addEventListener("click", function () {
        document.getElementById("equipo").value = link.dataset.equipo;
        mostrarError("equipo", "");
        formEnviado.hidden = true;
        quoteForm.hidden = false;
        actualizarChip();
      });
    });

    function urlWhatsapp() {
      const lineas = ["Hola ARTRESSA, quiero agendar una cita para cotización.", ""];
      lineas.push("• Nombre: " + valor("nombre"));
      if (valor("empresa")) lineas.push("• Empresa: " + valor("empresa"));
      lineas.push("• Teléfono: " + valor("telefono"));
      if (valor("correo")) lineas.push("• Correo: " + valor("correo"));
      lineas.push("• Equipo de interés: " + (EQUIPOS[valor("equipo")] || ""));
      if (valor("medidas")) lineas.push("• Medidas: " + valor("medidas"));
      if (valor("descripcion")) lineas.push("• Proyecto: " + valor("descripcion"));
      return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lineas.join("\n"));
    }

    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Enter en el paso 1 avanza en lugar de enviar
      if (pasoActual === 1) {
        if (revisarPaso(1)) irAPaso(2);
        return;
      }
      if (!revisarPaso(2)) return;

      const url = urlWhatsapp();
      window.open(url, "_blank", "noopener");

      document.getElementById("envNombre").textContent = valor("nombre").split(/\s+/)[0];
      document.getElementById("envWhatsapp").href = url;
      quoteForm.hidden = true;
      formEnviado.hidden = false;
      irAPaso(2);
    });

    document.getElementById("formReiniciar").addEventListener("click", function () {
      quoteForm.reset();
      Object.keys(campos).forEach(function (n) {
        campos[n].forEach(function (nombre) { mostrarError(nombre, ""); });
      });
      formEnviado.hidden = true;
      quoteForm.hidden = false;
      irAPaso(1);
    });
  }

  /* ---------------------- Año dinámico en footer ---------------------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});
