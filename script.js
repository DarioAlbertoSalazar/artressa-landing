/* =========================================================
   ARTRESSA — Crea · Innova · Soluciona
   JS: menú móvil, carrusel, acordeón FAQ, formulario -> WhatsApp
========================================================= */

// ============ CONFIG: reemplazar con el número real del cliente ============
// Formato: código de país + número, sin espacios ni signos (ej. México: 521 + 10 dígitos)
const WHATSAPP_NUMBER = "5215512345678"; // <-- [WHATSAPP] reemplazar aquí

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------- Menú móvil ---------------------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const abierto = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    // Cierra el menú al hacer clic en un link (mobile)
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------- Carrusel ---------------------- */
  const slides = document.querySelectorAll(".carousel-slide");
  const dotsContainer = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentSlide = 0;
  let autoplayTimer;

  if (slides.length && dotsContainer) {
    // Crear los puntos de navegación dinámicamente
    slides.forEach(function (_, index) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", function () {
        goToSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    function goToSlide(index) {
      slides[currentSlide].classList.remove("active");
      dots[currentSlide].classList.remove("active");
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); resetAutoplay(); });

    // Pausar en hover
    const carousel = document.getElementById("carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", function () { clearInterval(autoplayTimer); });
      carousel.addEventListener("mouseleave", startAutoplay);
    }

    // Navegación con teclado
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { nextSlide(); resetAutoplay(); }
      if (e.key === "ArrowLeft") { prevSlide(); resetAutoplay(); }
    });

    startAutoplay();
  }

  /* ---------------------- Acordeón FAQ ---------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");

      // Cierra los demás (acordeón exclusivo)
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------------------- Formulario -> WhatsApp ---------------------- */
  const quoteForm = document.getElementById("quoteForm");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const empresa = document.getElementById("empresa").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const email = document.getElementById("email").value.trim();
      const tipo = document.getElementById("tipo").value;
      const medidas = document.getElementById("medidas").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      // Validación básica
      if (!nombre || !telefono || !tipo) {
        alert("Por favor completa los campos obligatorios: Nombre, Teléfono y Equipo de interés.");
        return;
      }

      // Construir el mensaje para WhatsApp
      let texto = "Hola, quiero solicitar una cotización:\n\n";
      texto += "*Nombre:* " + nombre + "\n";
      if (empresa) texto += "*Empresa:* " + empresa + "\n";
      texto += "*Teléfono:* " + telefono + "\n";
      if (email) texto += "*Correo:* " + email + "\n";
      texto += "*Equipo:* " + tipo + "\n";
      if (medidas) texto += "*Medidas:* " + medidas + "\n";
      if (mensaje) texto += "*Proyecto:* " + mensaje + "\n";

      const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);

      window.open(url, "_blank");

      quoteForm.reset();
    });
  }

  /* ---------------------- Año dinámico en footer ---------------------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ---------------------- Navbar: sombra al hacer scroll ---------------------- */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
      } else {
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
      }
    });
  }

});
