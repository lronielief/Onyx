const ageGate = document.querySelector("#ageGate");
const confirmAge = document.querySelector("#confirmAge");
const menuToggle = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#siteNav");
const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");

const ageConfirmed = window.localStorage.getItem("onyxAgeConfirmed") === "true";

if (ageGate) {
  if (ageConfirmed) {
    ageGate.hidden = true;
  } else {
    document.body.classList.add("is-locked");
  }

  confirmAge?.addEventListener("click", () => {
    window.localStorage.setItem("onyxAgeConfirmed", "true");
    ageGate.hidden = true;
    document.body.classList.remove("is-locked");
  });
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

// Homepage booking quick inquiry
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const arrival = formData.get("arrival");
  const suite = formData.get("suite");

  if (bookingMessage) {
    bookingMessage.textContent = arrival
      ? `Availability inquiry prepared for ${suite} arriving ${arrival}. Redirecting to reservation details...`
      : "Please select an arrival date to prepare the inquiry.";
  }

  if (arrival) {
    setTimeout(() => {
      window.location.href = `reserve.html?suite=${encodeURIComponent(suite || "")}&arrival=${encodeURIComponent(arrival)}`;
    }, 600);
  }
});

// Interactive Reservation Page Logic (reserve.html)
const reservePageForm = document.querySelector("#reservePageForm");
if (reservePageForm) {
  const urlParams = new URLSearchParams(window.location.search);
  const suiteParam = urlParams.get("suite");
  const arrivalParam = urlParams.get("arrival");

  const suiteSelect = reservePageForm.querySelector('select[name="suite"]');
  const arrivalInput = reservePageForm.querySelector('input[name="arrival"]');
  const departureInput = reservePageForm.querySelector('input[name="departure"]');
  const guestsSelect = reservePageForm.querySelector('select[name="guests"]');

  const summarySuite = document.querySelector("#summarySuite");
  const summaryDates = document.querySelector("#summaryDates");
  const summaryGuests = document.querySelector("#summaryGuests");
  const summaryStatus = document.querySelector("#summaryStatus");

  if (suiteParam && suiteSelect) {
    const paramLower = suiteParam.toLowerCase();
    for (const option of suiteSelect.options) {
      if (
        option.value.toLowerCase().includes(paramLower) ||
        option.textContent.toLowerCase().includes(paramLower)
      ) {
        option.selected = true;
        break;
      }
    }
  }

  if (arrivalParam && arrivalInput) {
    arrivalInput.value = arrivalParam;
  }

  const today = new Date().toISOString().split("T")[0];
  if (arrivalInput && !arrivalInput.min) arrivalInput.min = today;
  if (departureInput && !departureInput.min) departureInput.min = today;

  function updateSummary() {
    if (summarySuite && suiteSelect) {
      summarySuite.textContent =
        suiteSelect.options[suiteSelect.selectedIndex]?.text || suiteSelect.value;
    }
    if (summaryDates && arrivalInput) {
      const arr = arrivalInput.value || "Select arrival";
      const dep = departureInput?.value ? ` to ${departureInput.value}` : "";
      summaryDates.textContent = `${arr}${dep}`;
    }
    if (summaryGuests && guestsSelect) {
      summaryGuests.textContent = guestsSelect.value;
    }
  }

  reservePageForm.addEventListener("input", updateSummary);
  reservePageForm.addEventListener("change", updateSummary);
  updateSummary();

  reservePageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(reservePageForm);
    const name = formData.get("fullName") || "Guest";
    const selectedSuite = suiteSelect?.options[suiteSelect.selectedIndex]?.text || "Suite";

    if (summaryStatus) {
      summaryStatus.innerHTML = `
        <div style="padding: 16px; background: rgba(199, 150, 49, 0.18); border: 1px solid var(--gold); border-radius: 6px; margin-top: 18px;">
          <strong style="color: var(--pale-gold); display: block; font-size: 1.05rem; margin-bottom: 6px;">Inquiry Confirmed</strong>
          <p style="margin: 0; font-size: 0.88rem; color: var(--linen); line-height: 1.5;">
            Thank you, <strong>${name}</strong>. Your reservation inquiry for the <strong>${selectedSuite}</strong> has been logged. Our VIP Reservations Concierge will contact you shortly to confirm your booking.
          </p>
        </div>
      `;
      summaryStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

// ==========================================================================
// Cinematic Hero Particle Engine & 3D Logo Stage Parallax
// ==========================================================================
(function initCinematicHero() {
  const canvas = document.querySelector("#heroParticles");
  const heroSection = document.querySelector("#heroSection");
  const cardContainer = document.querySelector("#cardContainer");
  const playingCard = document.querySelector("#playingCard");

  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let isVisible = true;

  const PARTICLE_COUNT = 45;
  const particles = [];

  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -(Math.random() * 0.45 + 0.15),
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      baseAlpha: Math.random() * 0.5 + 0.25,
      color: Math.random() > 0.4 ? "242, 213, 129" : "199, 150, 49",
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      p.alpha = p.baseAlpha + Math.sin(Date.now() * p.pulseSpeed) * 0.2;
      p.alpha = Math.max(0.05, Math.min(0.85, p.alpha));

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
      grad.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    if (isVisible) {
      animationFrameId = requestAnimationFrame(drawParticles);
    }
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(drawParticles);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(heroSection);
  }

  resizeCanvas();
  initParticles();
  animationFrameId = requestAnimationFrame(drawParticles);

  // 3D Parallax Tilt Effect on Card Container & Mobile Tap Flip
  if (cardContainer) {
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isHovering = false;
    let tiltRafId = null;

    function updateTilt() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      cardContainer.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(${isHovering ? "1.02, 1.02, 1.02" : "1, 1, 1"})`;

      if (
        isHovering ||
        Math.abs(targetRotateX - currentRotateX) > 0.05 ||
        Math.abs(targetRotateY - currentRotateY) > 0.05
      ) {
        tiltRafId = requestAnimationFrame(updateTilt);
      } else {
        tiltRafId = null;
      }
    }

    heroSection.addEventListener("mousemove", (e) => {
      const rect = cardContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotateY = Math.max(-12, Math.min(12, deltaX * 14));
      targetRotateX = Math.max(-12, Math.min(14, -deltaY * 14));

      isHovering = true;
      if (!tiltRafId) tiltRafId = requestAnimationFrame(updateTilt);
    });

    heroSection.addEventListener("mouseleave", () => {
      targetRotateX = 0;
      targetRotateY = 0;
      isHovering = false;
      if (!tiltRafId) tiltRafId = requestAnimationFrame(updateTilt);
    });

    // Tap or click to toggle flip
    if (playingCard) {
      playingCard.addEventListener("click", () => {
        playingCard.classList.toggle("is-flipped");
      });
    }
  }
})();

/* ==========================================================================
   Hero Section 10-Second Highlights Animation Loop
   Every 10 seconds:
   1. The hero text smoothly vanishes on the left.
   2. The card slides to the left and expands into FOUR luxury image cards.
   3. The 4 cards show authentic images (Suites, Dining, Gaming, Concierge) with NO text.
   4. Stays presented for ~3.8s, then smoothly slides and collapses back to normal.
   5. Repeats continuously every 10 seconds in a seamless loop.
   ========================================================================== */
(function initHeroHighlightsLoop() {
  const heroSection = document.querySelector("#heroSection");
  const heroContent = document.querySelector(".hero__content");
  const heroCardsShowcase = document.querySelector("#heroCardsShowcase");
  const cardContainer = document.querySelector("#cardContainer");

  if (!heroSection || !heroContent || !heroCardsShowcase) return;

  let isUserInteracting = false;
  let cycleTimeout = null;
  let resetTimeout = null;
  let touchTimeout = null;

  const CYCLE_INTERVAL = 10000;     // 10 seconds total loop
  const VANISH_DELAY = 5800;        // At 5.8s, text vanishes and cards slide in
  const HIGHLIGHTS_DURATION = 3800; // Remains expanded showing 4 image cards for 3.8s

  function flipToHighlights() {
    if (isUserInteracting || document.hidden) return;

    // 1. Text vanishes smoothly on the left
    heroContent.classList.add("is-vanished");

    // 2. Card slides to the left and expands into 4 image cards (no text)
    heroSection.classList.add("is-cards-active");

    // 3. Return to normal after duration
    resetTimeout = setTimeout(() => {
      restoreNormal();
    }, HIGHLIGHTS_DURATION);
  }

  function restoreNormal() {
    // 4 cards slide back together into single card
    heroSection.classList.remove("is-cards-active");

    // Text returns to normal on the left
    heroContent.classList.remove("is-vanished");
  }

  function startLoop() {
    stopLoop();
    cycleTimeout = setTimeout(function tick() {
      flipToHighlights();
      cycleTimeout = setTimeout(tick, CYCLE_INTERVAL);
    }, VANISH_DELAY);
  }

  function stopLoop() {
    if (cycleTimeout) clearTimeout(cycleTimeout);
    if (resetTimeout) clearTimeout(resetTimeout);
    if (touchTimeout) clearTimeout(touchTimeout);
  }

  // Pause loop if user hovers over hero content (e.g. clicking buttons) or the cards
  heroContent.addEventListener("mouseenter", () => {
    isUserInteracting = true;
  });
  heroContent.addEventListener("mouseleave", () => {
    isUserInteracting = false;
  });

  heroCardsShowcase.addEventListener("mouseenter", () => {
    isUserInteracting = true;
  });
  heroCardsShowcase.addEventListener("mouseleave", () => {
    isUserInteracting = false;
  });

  heroCardsShowcase.addEventListener("touchstart", () => {
    isUserInteracting = true;
    if (touchTimeout) clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      isUserInteracting = false;
    }, 6000);
  }, { passive: true });

  if (cardContainer) {
    cardContainer.addEventListener("mouseenter", () => {
      isUserInteracting = true;
    });
    cardContainer.addEventListener("mouseleave", () => {
      isUserInteracting = false;
    });
  }

  // Handle visibility changes so background tabs don't desynchronize
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopLoop();
      restoreNormal();
    } else {
      startLoop();
    }
  });

  startLoop();
})();

/* ==========================================================================
   Curated Experiences Carousel (Side-Scroll Navigation)
   ========================================================================== */
(function initExperienceCarousel() {
  const carousel = document.getElementById("experienceCarousel");
  if (!carousel) return;

  const btnPrev = document.getElementById("carouselBtnPrev");
  const btnNext = document.getElementById("carouselBtnNext");
  const sideLeft = document.getElementById("carouselSideLeft");
  const sideRight = document.getElementById("carouselSideRight");
  const counter = document.getElementById("carouselCounter");
  const dotsContainer = document.getElementById("carouselDots");
  const cards = carousel.querySelectorAll(".feature-card");

  if (!cards.length) return;

  // Build pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    cards.forEach((card, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `carousel-dot ${idx === 0 ? "is-active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      dot.addEventListener("click", () => {
        const targetLeft = cards[idx].offsetLeft - carousel.offsetLeft;
        carousel.scrollTo({ left: targetLeft, behavior: "smooth" });
      });
      dotsContainer.appendChild(dot);
    });
  }

  function getScrollStep() {
    const firstCard = cards[0];
    return (firstCard ? firstCard.offsetWidth : 350) + 24;
  }

  function scrollByStep(direction) {
    const step = getScrollStep();
    carousel.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  btnPrev?.addEventListener("click", () => scrollByStep(-1));
  sideLeft?.addEventListener("click", () => scrollByStep(-1));
  btnNext?.addEventListener("click", () => scrollByStep(1));
  sideRight?.addEventListener("click", () => scrollByStep(1));

  // Keyboard navigation
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByStep(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByStep(1);
    }
  });

  // Track scrolling state
  let scrollTimeout;
  function updateCarouselState() {
    const step = getScrollStep();
    const scrollLeft = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    // Active index calculation
    const activeIndex = Math.min(
      cards.length - 1,
      Math.max(0, Math.round(scrollLeft / step))
    );

    // Update Counter
    if (counter) {
      const currentPad = String(activeIndex + 1).padStart(2, "0");
      const totalPad = String(cards.length).padStart(2, "0");
      counter.textContent = `${currentPad} / ${totalPad}`;
    }

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".carousel-dot");
      dots.forEach((dot, i) => {
        const isActive = i === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    }

    // Update Button Disabled States
    const isAtStart = scrollLeft <= 8;
    const isAtEnd = scrollLeft >= maxScroll - 8;

    if (btnPrev) btnPrev.disabled = isAtStart;
    if (sideLeft) sideLeft.disabled = isAtStart;
    if (btnNext) btnNext.disabled = isAtEnd;
    if (sideRight) sideRight.disabled = isAtEnd;
  }

  carousel.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(updateCarouselState);
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    () => {
      updateCarouselState();
    },
    { passive: true }
  );

  updateCarouselState();
})();

/* ==========================================================================
   Guest Acclaim & Reviews Interactive Filter Tabs
   ========================================================================== */
(function initGuestFeedbackTabs() {
  const tabsContainer = document.querySelector(".guest-feedback__tabs");
  const reviewsGrid = document.getElementById("reviewsGrid");
  if (!tabsContainer || !reviewsGrid) return;

  const tabs = tabsContainer.querySelectorAll(".feedback-tab");
  const cards = reviewsGrid.querySelectorAll(".review-card");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const filter = tab.getAttribute("data-filter");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          card.style.animation = "chat-fade-in 0.3s ease-out";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Open Concierge Chat buttons throughout page
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".open-concierge-chat");
    if (!btn) return;
    const trigger = document.getElementById("chatTrigger");
    const widget = document.getElementById("chatWidget");
    if (widget && !widget.classList.contains("is-open")) {
      trigger?.click();
    }
  });
})();

/* ==========================================================================
   Concierge Chat Support Engine (Accessible & Visual Enhancements)
   ========================================================================== */
(function initChatSupport() {
  if (document.querySelector("#chatWidget")) return;

  function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const isLightSaved = window.localStorage.getItem("onyxChatTheme") === "light";

  const widget = document.createElement("div");
  widget.id = "chatWidget";
  widget.className = `chat-widget ${isLightSaved ? "is-light" : ""}`;
  widget.innerHTML = `
    <div class="chat-widget__window" id="chatWindow" role="region" aria-label="ONYX Concierge Live Chat">
      <div class="chat-widget__header">
        <div class="chat-widget__header-info">
          <div class="chat-widget__header-avatar" aria-hidden="true">O</div>
          <div>
            <div class="chat-widget__header-title">ONYX Concierge</div>
            <div class="chat-widget__header-subtitle">
              <span>Live Support &bull; Online</span>
            </div>
          </div>
        </div>
        <div class="chat-widget__header-actions">
          <button type="button" class="chat-widget__btn-icon" id="chatThemeToggle" aria-label="Toggle Contrast Theme" title="Toggle Light/Dark Theme">
            ${isLightSaved ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'}
          </button>
          <button type="button" class="chat-widget__btn-icon" id="chatCloseBtn" aria-label="Close Chat Window" title="Close Chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="chat-widget__messages" id="chatMessages" role="log" aria-live="polite"></div>
      <div class="chat-widget__chips" id="chatChips">
        <button type="button" class="chat-chip" data-query="Reserve a Suite">Reserve a Suite</button>
        <button type="button" class="chat-chip" data-query="Dining & Lounges">Fine Dining</button>
        <button type="button" class="chat-chip" data-query="Gaming Salon Privé">Gaming Salon</button>
        <button type="button" class="chat-chip" data-query="Responsible Gaming">Responsible Play</button>
        <button type="button" class="chat-chip" data-query="Speak with an Associate">Contact Liaison</button>
      </div>
      <form class="chat-widget__form" id="chatForm">
        <input type="text" class="chat-widget__input" id="chatInput" placeholder="Ask a question or request assistance..." autocomplete="off" aria-label="Inquire with our concierge" />
        <button type="submit" class="chat-widget__send" aria-label="Send Message" title="Send Message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
    <button type="button" class="chat-widget__trigger" id="chatTrigger" aria-label="Open ONYX Chat" aria-expanded="false">
      <svg class="chat-widget__trigger-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
    </button>
  `;

  document.body.appendChild(widget);

  const trigger = document.getElementById("chatTrigger");
  const closeBtn = document.getElementById("chatCloseBtn");
  const themeToggle = document.getElementById("chatThemeToggle");
  const messagesContainer = document.getElementById("chatMessages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const chipsContainer = document.getElementById("chatChips");

  let hasGreeted = false;

  const sunSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  themeToggle.addEventListener("click", () => {
    const isLight = widget.classList.toggle("is-light");
    themeToggle.innerHTML = isLight ? sunSvg : moonSvg;
    window.localStorage.setItem("onyxChatTheme", isLight ? "light" : "dark");
  });

  function appendMessage(content, sender = "bot") {
    const row = document.createElement("div");
    row.className = `chat-msg-row chat-msg-row--${sender}`;

    if (sender === "bot") {
      const avatar = document.createElement("div");
      avatar.className = "chat-msg-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = "O";
      row.appendChild(avatar);
    }

    const contentBox = document.createElement("div");
    contentBox.className = "chat-msg-content";

    const bubble = document.createElement("div");
    bubble.className = "chat-msg__bubble";
    bubble.innerHTML = content;

    const time = document.createElement("span");
    time.className = "chat-msg__time";
    time.textContent = getTimeString();

    contentBox.appendChild(bubble);
    contentBox.appendChild(time);
    row.appendChild(contentBox);

    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return row;
  }

  function showBotResponse(replyText) {
    const typingRow = document.createElement("div");
    typingRow.className = "chat-msg-row chat-msg-row--bot";
    typingRow.innerHTML = `
      <div class="chat-msg-avatar" aria-hidden="true">O</div>
      <div class="chat-msg-content">
        <div class="chat-msg__bubble chat-typing" aria-label="Concierge is replying...">
          <span class="chat-typing-dot"></span>
          <span class="chat-typing-dot"></span>
          <span class="chat-typing-dot"></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingRow);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      typingRow.remove();
      appendMessage(replyText, "bot");
    }, 450);
  }

  function handleUserQuery(userQuery) {
    const q = userQuery.toLowerCase().trim();
    let reply = "";

    if (
      q.includes("suite") ||
      q.includes("room") ||
      q.includes("stay") ||
      q.includes("penthouse") ||
      q.includes("book") ||
      q.includes("reserve")
    ) {
      reply = `We would be delighted to host your stay. Explore our signature residences at <a href="stay.html">Accommodations</a> or arrange your arrival via our <a href="reserve.html">Reservation Concierge</a>.`;
    } else if (
      q.includes("dining") ||
      q.includes("restaurant") ||
      q.includes("food") ||
      q.includes("prime 54") ||
      q.includes("kintsugi") ||
      q.includes("bar") ||
      q.includes("table")
    ) {
      reply = `ONYX offers premier dining at Prime 54 Steakhouse and the Kintsugi Omakase counter. Explore our curated menus on the <a href="dining.html">Dining Experiences</a> page.`;
    } else if (
      q.includes("gaming") ||
      q.includes("salon") ||
      q.includes("prive") ||
      q.includes("baccarat") ||
      q.includes("roulette") ||
      q.includes("blackjack") ||
      q.includes("poker") ||
      q.includes("card")
    ) {
      reply = `Our Regulated Gaming Salon Privé offers European roulette, bespoke baccarat salons, and high-limit tables under stringent regulatory standards. View full details at our <a href="casino.html">Regulated Gaming Salon</a>.`;
    } else if (
      q.includes("responsible") ||
      q.includes("limit") ||
      q.includes("exclusion") ||
      q.includes("help") ||
      q.includes("support") ||
      q.includes("safe")
    ) {
      reply = `ONYX upholds strict patron protections, including loss limits and self-exclusion. Please visit our <a href="responsible.html">Responsible Gaming Portal</a> or contact the National Problem Gambling Helpline at 1-800-522-4700.`;
    } else if (
      q.includes("event") ||
      q.includes("gala") ||
      q.includes("wedding") ||
      q.includes("summit")
    ) {
      reply = `Our private event coordinators craft tailored galas, banquets, and board sessions. Discover our venues at <a href="events.html">Private Events</a>.`;
    } else if (
      q.includes("associate") ||
      q.includes("contact") ||
      q.includes("phone") ||
      q.includes("call") ||
      q.includes("human") ||
      q.includes("liaison") ||
      q.includes("desk")
    ) {
      reply = `You may speak with our Executive Liaison directly 24/7 at <strong>+1 (800) 888-ONYX</strong> or email <a href="mailto:concierge@onyxresort.com">concierge@onyxresort.com</a>.`;
    } else {
      reply = `Thank you for contacting ONYX Concierge. Your inquiry regarding "${userQuery.replace(/</g, "&lt;")}" has been received. For immediate priority bookings, please visit our <a href="reserve.html">Reservation Portal</a> or call our desk at +1 (800) 888-ONYX.`;
    }

    showBotResponse(reply);
  }

  function openChat() {
    widget.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    if (!hasGreeted) {
      hasGreeted = true;
      appendMessage(
        "Welcome to ONYX. How may our Private Client Services assist your stay, dining, or gaming arrangements this evening?",
        "bot"
      );
    }
    setTimeout(() => input.focus(), 300);
  }

  function closeChat() {
    widget.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }

  trigger.addEventListener("click", () => {
    if (widget.classList.contains("is-open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener("click", closeChat);

  // Close on Escape key
  widget.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("is-open")) {
      closeChat();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    appendMessage(val, "user");
    input.value = "";
    handleUserQuery(val);
  });

  chipsContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".chat-chip");
    if (!chip) return;
    const query = chip.getAttribute("data-query");
    appendMessage(query, "user");
    handleUserQuery(query);
  });
})();

/* ==========================================================================
   Interactive 3D Suite Dual-Stack Deck & Dealing Table Engine
   ========================================================================== */
(function initSuiteDeck() {
  const stage = document.getElementById("suiteDeckStage");
  const pile = document.getElementById("suitePile");
  const dealtMat = document.getElementById("suiteDealtMat");
  if (!stage || !pile || !dealtMat) return;

  const cards = Array.from(pile.querySelectorAll(".suite-card"));
  const pills = Array.from(document.querySelectorAll(".suite-pill"));
  const dealBtn = document.getElementById("dealCardBtn");
  const returnBtn = document.getElementById("returnCardBtn");
  const statusEl = document.getElementById("suiteDeckStatus");

  // Dual-Stack state:
  // leftStack holds card indices currently on the shuffled deck (left side)
  // rightStack holds card indices currently dealt on the table (right side)
  let leftStack = [0, 1, 2, 3];
  let rightStack = [];

  // Guest Feedback & Acclaim Specifications Data for Zoom Front View
  const SUITES_DATA = [
    {
      suit: "♠",
      tier: "KING • THE RESIDENCES",
      title: "The Residences",
      subtitle: "Evelyn & Julian Vance • London",
      desc: "“The Chairman’s Residence is the epitome of quiet luxury. The private terrace at dusk, the butler service that anticipated our arrival, and the acoustic stillness made this our favorite sanctuary.”",
      area: "5.0 / 5.0 Rating",
      bed: "Chairman's Penthouse",
      bath: "STC 62 Acoustic Stillness",
      service: "Dedicated Guild Butler",
      rate: "5.0 / 5.0",
      reserveUrl: "stay.html",
      ctaText: "Explore Residences",
      media: [
        { type: "photo", src: "assets/suites/chairman-1.jpg", caption: "Presidential Master Suite & City Vista", thumbTitle: "Master Wing" },
        { type: "photo", src: "assets/suites/chairman-2.jpg", caption: "Private Living Terrace & Sky Panorama", thumbTitle: "Terrace" },
        { type: "photo", src: "assets/suites/chairman-3.jpg", caption: "Private Lift Foyer & Onyx Bar", thumbTitle: "Foyer" },
        { type: "video", src: "assets/suites/suite-preview.mp4", caption: "Cinematic Residence Tour & Ambience", thumbTitle: "Video Tour" }
      ]
    },
    {
      suit: "♥",
      suitClass: "red",
      tier: "QUEEN • DINING & LOUNGES",
      title: "Dining & Lounges",
      subtitle: "Kenjiro Takahashi • Tokyo",
      desc: "“The omakase at Kintsugi was nothing short of perfection. Rare seasonal seafood flown in directly from Toyosu, paired with an extraordinary vintage sake selection. Attentive service was masterclass.”",
      area: "5.0 / 5.0 Rating",
      bed: "Kintsugi 10-Seat Counter",
      bath: "Miyazaki A5 Wagyu & Robata",
      service: "Grand Cru Decanting",
      rate: "5.0 / 5.0",
      reserveUrl: "dining.html",
      ctaText: "Explore Dining",
      media: [
        { type: "photo", src: "assets/suites/garden-1.jpg", caption: "Kintsugi Robata Bar & Tasting Counter", thumbTitle: "Counter" },
        { type: "photo", src: "assets/suites/garden-2.jpg", caption: "Private Dining Room & Sommelier Cellar", thumbTitle: "Cellar Room" },
        { type: "photo", src: "assets/suites/garden-3.jpg", caption: "Evening Courtyard Lounge & Cocktails", thumbTitle: "Lounge" },
        { type: "video", src: "assets/suites/suite-preview.mp4", caption: "Atmospheric Culinary Showcase", thumbTitle: "Video Tour" }
      ]
    },
    {
      suit: "♦",
      suitClass: "red",
      tier: "JACK • REGULATED GAMING",
      title: "Salon Privé",
      subtitle: "Christian Beaumont • Monaco",
      desc: "“ONYX has set the new benchmark for private gaming. The European single-zero roulette salon and high-stakes baccarat tables offer complete discretion and world-class composure under PAGCOR oversight.”",
      area: "5.0 / 5.0 Rating",
      bed: "Regulated Salon Privé",
      bath: "European Single-Zero Roulette",
      service: "Strict Discretion & Age 21+",
      rate: "5.0 / 5.0",
      reserveUrl: "casino.html",
      ctaText: "Explore Gaming",
      media: [
        { type: "photo", src: "assets/suites/premier-1.jpg", caption: "Salon Privé Private Gaming Salon", thumbTitle: "Salon" },
        { type: "photo", src: "assets/suites/premier-2.jpg", caption: "Baccarat High-Limit Chamber", thumbTitle: "Chamber" },
        { type: "photo", src: "assets/suites/premier-3.jpg", caption: "Private Cashier & VIP Reception Foyer", thumbTitle: "VIP Foyer" },
        { type: "video", src: "assets/suites/suite-preview.mp4", caption: "Discreet Gaming Salon Experience", thumbTitle: "Video Tour" }
      ]
    },
    {
      suit: "♣",
      tier: "ACE • CONCIERGE SERVICES",
      title: "Concierge Services",
      subtitle: "Dr. Alessandra Rossi • Milan",
      desc: "“From arranging our private tarmac chauffeur transfer to orchestrating a bespoke private dinner on our terrace with 2 hours notice, the ONYX Concierge liaisons operate with unmatched elegance.”",
      area: "5.0 / 5.0 Rating",
      bed: "Private Arrival Liaison",
      bath: "Maybach Tarmac Chauffeur",
      service: "24/7 Dedicated Guild Butler",
      rate: "5.0 / 5.0",
      reserveUrl: "reserve.html",
      ctaText: "Contact Concierge",
      media: [
        { type: "photo", src: "assets/suites/royal-1.jpg", caption: "Private Airport Escort & Maybach Fleet", thumbTitle: "Chauffeur" },
        { type: "photo", src: "assets/suites/royal-2.jpg", caption: "Bespoke Rooftop Terrace Dinner Setting", thumbTitle: "Terrace Dinner" },
        { type: "photo", src: "assets/suites/royal-3.jpg", caption: "Guild Concierge Desk & Private Reception", thumbTitle: "Reception" },
        { type: "video", src: "assets/suites/suite-preview.mp4", caption: "Bespoke Concierge & Arrival Protocol", thumbTitle: "Video Tour" }
      ]
    }
  ];

  // Optional subtle card flick audio using Web Audio API
  function playCardFlickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(950, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (_) {
      // Audio context might be restricted; fail silently
    }
  }

  function setStatus(msg) {
    if (statusEl) {
      statusEl.textContent = msg;
    }
  }

  function calculateMatCoordinates(card) {
    const pileRect = pile.getBoundingClientRect();
    const matRect = dealtMat.getBoundingClientRect();
    const cardW = card.offsetWidth || 320;
    const cardH = card.offsetHeight || 460;
    const dx = matRect.left - pileRect.left + (matRect.width - cardW) / 2;
    const dy = matRect.top - pileRect.top + (matRect.height - cardH) / 2;
    return { dx: Math.round(dx), dy: Math.round(dy) };
  }

  function updatePills() {
    // If cards are dealt, highlight top of right stack; otherwise top of left stack
    const highlightedIdx = rightStack.length > 0
      ? rightStack[rightStack.length - 1]
      : (leftStack.length > 0 ? leftStack[0] : -1);

    pills.forEach((pill, idx) => {
      const isActive = idx === highlightedIdx;
      pill.classList.toggle("is-active", isActive);
      pill.setAttribute("aria-selected", String(isActive));
    });
  }

  // Master layout renderer for both stacks
  function updateStacks() {
    // 1. Render Left Stack (Shuffled Deck)
    leftStack.forEach((cardIdx, i) => {
      const card = cards[cardIdx];
      const cardTitle = card.querySelector(".card-title")?.textContent.trim() || "Suite";
      const isTop = i === 0;
      const offsetX = i * 6;
      const offsetY = i * 6;
      const rot = isTop ? 0 : ((i % 2 === 0 ? -1 : 1) * (i * 1.5));

      card.classList.remove("is-dealt");
      card.style.zIndex = String(25 - i);
      card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0px) rotate(${rot}deg)`;
      card.setAttribute("aria-label", `${cardTitle} in shuffled deck. Click to deal to table.`);
    });

    // 2. Render Right Stack (Dealt Table Mat)
    rightStack.forEach((cardIdx, k) => {
      const card = cards[cardIdx];
      const cardTitle = card.querySelector(".card-title")?.textContent.trim() || "Suite";
      const { dx, dy } = calculateMatCoordinates(card);
      const isTop = k === rightStack.length - 1;
      const offsetX = k * 7;
      const offsetY = k * 7;
      const rot = isTop ? 0 : ((k % 2 === 0 ? 1 : -1) * (k * 1.8));

      card.classList.add("is-dealt");
      card.style.zIndex = String(50 + k);
      card.style.transform = `translate3d(${dx + offsetX}px, ${dy + offsetY}px, 0px) rotate(${rot}deg)`;
      card.setAttribute("aria-label", `${cardTitle} dealt on table. Click to return to deck.`);
    });

    // 3. Dealt Mat State
    if (rightStack.length > 0) {
      dealtMat.classList.add("has-card");
    } else {
      dealtMat.classList.remove("has-card");
    }

    updatePills();

    // 4. Status updates
    if (rightStack.length === 4) {
      setStatus("All 4 residences dealt on the table. Click cards on the right to return to the deck.");
    } else if (rightStack.length > 0) {
      const topIdx = rightStack[rightStack.length - 1];
      const topTitle = SUITES_DATA[topIdx]?.title || "Suite";
      setStatus(`${topTitle} displayed (${rightStack.length} dealt). Click left deck to deal next, or click dealt card to return.`);
    } else {
      setStatus("Shuffled deck ready. Click top card on left to flip and deal to table.");
    }
  }

  // Deal top card from left stack to right stack
  function dealTopCard() {
    if (leftStack.length === 0) {
      setStatus("All cards already dealt to table.");
      return;
    }
    const cardIdx = leftStack.shift();
    rightStack.push(cardIdx);
    playCardFlickSound();
    updateStacks();
  }

  // Return top card from right stack back to left stack
  function returnTopCard() {
    if (rightStack.length === 0) {
      setStatus("No cards on the table to return.");
      return;
    }
    const cardIdx = rightStack.pop();
    leftStack.unshift(cardIdx);
    playCardFlickSound();
    updateStacks();
  }

  // Deal a specific card index
  function dealSpecificCard(cardIdx) {
    const leftPos = leftStack.indexOf(cardIdx);
    if (leftPos !== -1) {
      leftStack.splice(leftPos, 1);
      rightStack.push(cardIdx);
      playCardFlickSound();
      updateStacks();
    } else {
      // If already in right stack, bring to top if not already top
      const rightPos = rightStack.indexOf(cardIdx);
      if (rightPos !== -1 && rightPos !== rightStack.length - 1) {
        rightStack.splice(rightPos, 1);
        rightStack.push(cardIdx);
        playCardFlickSound();
        updateStacks();
      }
    }
  }

  // Return a specific card index
  function returnSpecificCard(cardIdx) {
    const rightPos = rightStack.indexOf(cardIdx);
    if (rightPos !== -1) {
      rightStack.splice(rightPos, 1);
      leftStack.unshift(cardIdx);
      playCardFlickSound();
      updateStacks();
    }
  }

  /* ==========================================================================
     Suite Zoom Front View Modal Logic
     ========================================================================== */
  const modal = document.getElementById("suiteZoomModal");
  const modalCloseBtn = document.getElementById("suiteZoomClose");
  const modalBackdrop = document.getElementById("suiteZoomBackdrop");
  const zoomSuit = document.getElementById("zoomSuiteSuit");
  const zoomTier = document.getElementById("zoomSuiteTier");
  const zoomTitle = document.getElementById("zoomSuiteTitle");
  const zoomSubtitle = document.getElementById("zoomSuiteSubtitle");
  const zoomDesc = document.getElementById("zoomSuiteDesc");
  const zoomSpecArea = document.getElementById("zoomSpecArea");
  const zoomSpecBed = document.getElementById("zoomSpecBed");
  const zoomSpecBath = document.getElementById("zoomSpecBath");
  const zoomSpecService = document.getElementById("zoomSpecService");
  const zoomRate = document.getElementById("zoomSuiteRate");
  const zoomReserveLink = document.getElementById("zoomReserveLink");
  const zoomMainImg = document.getElementById("zoomMainImg");
  const zoomMainVideo = document.getElementById("zoomMainVideo");
  const zoomCaption = document.getElementById("zoomMediaCaption");
  const zoomThumbsContainer = document.getElementById("zoomThumbs");

  function openSuiteZoomModal(suiteIdx) {
    const data = SUITES_DATA[suiteIdx];
    if (!data || !modal) return;

    // Set Header & Details
    if (zoomSuit) {
      zoomSuit.textContent = data.suit;
      zoomSuit.className = `suite-zoom-suit ${data.suitClass || ""}`;
    }
    if (zoomTier) zoomTier.textContent = data.tier;
    if (zoomTitle) zoomTitle.textContent = data.title;
    if (zoomSubtitle) zoomSubtitle.textContent = data.subtitle;
    if (zoomDesc) zoomDesc.textContent = data.desc;
    if (zoomSpecArea) zoomSpecArea.textContent = data.area;
    if (zoomSpecBed) zoomSpecBed.textContent = data.bed;
    if (zoomSpecBath) zoomSpecBath.textContent = data.bath;
    if (zoomSpecService) zoomSpecService.textContent = data.service;
    if (zoomRate) zoomRate.innerHTML = `${data.rate} <span>Score</span>`;
    if (zoomReserveLink) {
      zoomReserveLink.href = data.reserveUrl;
      zoomReserveLink.innerHTML = `${data.ctaText || "Explore Experience"} &rarr;`;
    }

    // Build media tabs
    if (zoomThumbsContainer) {
      zoomThumbsContainer.innerHTML = "";
      data.media.forEach((item, mIdx) => {
        const thumbBtn = document.createElement("button");
        thumbBtn.type = "button";
        thumbBtn.className = `zoom-thumb ${mIdx === 0 ? "is-active" : ""} ${item.type === "video" ? "zoom-thumb--video" : ""}`;
        thumbBtn.setAttribute("aria-label", `View ${item.thumbTitle}`);

        if (item.type === "video") {
          thumbBtn.innerHTML = `
            <div class="zoom-thumb__play-icon">&#9658;</div>
            <span>${item.thumbTitle}</span>
          `;
        } else {
          thumbBtn.innerHTML = `
            <img src="${item.src}" alt="${item.thumbTitle}" />
            <span>${item.thumbTitle}</span>
          `;
        }

        thumbBtn.addEventListener("click", () => {
          zoomThumbsContainer.querySelectorAll(".zoom-thumb").forEach((t) => t.classList.remove("is-active"));
          thumbBtn.classList.add("is-active");

          if (item.type === "video") {
            if (zoomMainImg) zoomMainImg.style.display = "none";
            if (zoomMainVideo) {
              zoomMainVideo.style.display = "block";
              zoomMainVideo.currentTime = 0;
              zoomMainVideo.play().catch(() => {});
            }
          } else {
            if (zoomMainVideo) {
              zoomMainVideo.pause();
              zoomMainVideo.style.display = "none";
            }
            if (zoomMainImg) {
              zoomMainImg.style.display = "block";
              zoomMainImg.src = item.src;
              zoomMainImg.alt = item.caption;
            }
          }
          if (zoomCaption) zoomCaption.textContent = item.caption;
        });

        zoomThumbsContainer.appendChild(thumbBtn);
      });
    }

    // Default to first photo
    if (zoomMainVideo) {
      zoomMainVideo.pause();
      zoomMainVideo.style.display = "none";
    }
    if (zoomMainImg && data.media[0]) {
      zoomMainImg.style.display = "block";
      zoomMainImg.src = data.media[0].src;
      zoomMainImg.alt = data.media[0].caption;
    }
    if (zoomCaption && data.media[0]) {
      zoomCaption.textContent = data.media[0].caption;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    setTimeout(() => modalCloseBtn?.focus(), 150);
  }

  function closeSuiteZoomModal() {
    if (!modal) return;
    if (zoomMainVideo) zoomMainVideo.pause();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  modalCloseBtn?.addEventListener("click", closeSuiteZoomModal);
  modalBackdrop?.addEventListener("click", closeSuiteZoomModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) {
      closeSuiteZoomModal();
    }
  });

  /* ==========================================================================
     Click & Interaction Handlers
     ========================================================================== */
  // Unified card click handling on pile
  pile.addEventListener("click", (e) => {
    // 1. Inspect & Reserve button clicked &rarr; Open Zoom View!
    const reserveBtn = e.target.closest(".card-reserve-btn");
    if (reserveBtn) {
      e.stopPropagation();
      const suiteIdx = parseInt(reserveBtn.getAttribute("data-suite-idx"), 10);
      openSuiteZoomModal(isNaN(suiteIdx) ? 0 : suiteIdx);
      return;
    }

    // 2. Return button on card front clicked
    const returnTrigger = e.target.closest(".card-return-btn");
    if (returnTrigger) {
      e.stopPropagation();
      const card = e.target.closest(".suite-card");
      if (card) {
        const cardIdx = parseInt(card.getAttribute("data-index"), 10);
        returnSpecificCard(cardIdx);
      } else {
        returnTopCard();
      }
      return;
    }

    const card = e.target.closest(".suite-card");
    if (!card) {
      // Clicked on empty pile area
      if (leftStack.length > 0) {
        dealTopCard();
      }
      return;
    }

    const cardIdx = parseInt(card.getAttribute("data-index"), 10);

    // If card is already on right stack (dealt) &rarr; return it!
    if (card.classList.contains("is-dealt")) {
      returnSpecificCard(cardIdx);
      return;
    }

    // If card is on left stack &rarr; deal it!
    dealSpecificCard(cardIdx);
  });

  // Clicking the dealt mat area directly when cards are dealt returns the top card
  dealtMat.addEventListener("click", () => {
    if (rightStack.length > 0) {
      returnTopCard();
    }
  });

  // Header Action Buttons
  dealBtn?.addEventListener("click", () => {
    if (leftStack.length > 0) {
      dealTopCard();
    } else {
      setStatus("All suites already dealt to table.");
    }
  });

  returnBtn?.addEventListener("click", () => {
    if (rightStack.length > 0) {
      returnTopCard();
    } else {
      setStatus("No suites currently on table.");
    }
  });

  // Suite Quick-select Pills
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const idx = parseInt(pill.getAttribute("data-index"), 10);
      if (leftStack.includes(idx)) {
        dealSpecificCard(idx);
      } else if (rightStack.includes(idx)) {
        // If it's already top of right stack, clicking returns it
        if (rightStack[rightStack.length - 1] === idx) {
          returnSpecificCard(idx);
        } else {
          // Bring it to the top of the right stack
          dealSpecificCard(idx);
        }
      }
    });
  });

  // Keyboard navigation on cards
  pile.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.target.closest(".card-reserve-btn") || e.target.closest(".card-return-btn")) {
        return; // Handled by standard button click
      }
      const card = e.target.closest(".suite-card");
      if (card) {
        e.preventDefault();
        const cardIdx = parseInt(card.getAttribute("data-index"), 10);
        if (card.classList.contains("is-dealt")) {
          returnSpecificCard(cardIdx);
        } else {
          dealSpecificCard(cardIdx);
        }
      }
    }
  });

  // Recalculate coordinates on window resize
  window.addEventListener(
    "resize",
    () => {
      updateStacks();
    },
    { passive: true }
  );

  // Initial layout
  updateStacks();
})();

/* ==========================================================================
   Stay & Gaming Pages: Pure Advertising Video/Photo Slideshow Controllers
   ========================================================================== */
(function initAdSlideshows() {
  function createAdSlideshow(slideshowId, progressId, prevId, nextId) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return;

    const slides = Array.from(slideshow.querySelectorAll(".ad-slide"));
    const indicators = Array.from(slideshow.querySelectorAll(".ad-indicator"));
    const prevBtn = document.getElementById(prevId) || slideshow.querySelector(".ad-nav-paddle--prev");
    const nextBtn = document.getElementById(nextId) || slideshow.querySelector(".ad-nav-paddle--next");
    const progressFill = document.getElementById(progressId) || slideshow.querySelector(".ad-progress-fill");

    if (!slides.length) return;

    let currentIndex = 0;
    let slideTimeout = null;
    let activeVideoCleanup = null;
    const PHOTO_DURATION = 5000; // 5.0s for photo slides

    function clearCurrentTimer() {
      if (slideTimeout) {
        clearTimeout(slideTimeout);
        slideTimeout = null;
      }
      if (activeVideoCleanup) {
        activeVideoCleanup();
        activeVideoCleanup = null;
      }
    }

    function advanceToNext() {
      activateSlide(currentIndex + 1);
    }

    function activateSlide(index) {
      clearCurrentTimer();

      // Infinite loop index calculation
      const total = slides.length;
      const nextIdx = ((index % total) + total) % total;

      // Deactivate previous slide
      const prevSlide = slides[currentIndex];
      if (prevSlide) {
        prevSlide.classList.remove("is-active");
        const prevVideo = prevSlide.querySelector("video");
        if (prevVideo) {
          prevVideo.pause();
        }
      }

      currentIndex = nextIdx;
      const currentSlide = slides[currentIndex];
      currentSlide.classList.add("is-active");

      // Update indicators
      indicators.forEach((ind, i) => {
        const isActive = i === currentIndex;
        ind.classList.toggle("is-active", isActive);
        ind.setAttribute("aria-selected", String(isActive));
      });

      // Reset progress bar visual
      if (progressFill) {
        progressFill.style.transition = "none";
        progressFill.style.width = "0%";
      }

      const isVideo = currentSlide.getAttribute("data-type") === "video";
      const currentVideo = currentSlide.querySelector("video");

      if (isVideo && currentVideo) {
        // 1. Video Slide Handling: Auto-advance upon video completion
        currentVideo.currentTime = 0;
        currentVideo.play().catch(() => {});

        const onVideoEnded = () => {
          advanceToNext();
        };

        const onTimeUpdate = () => {
          if (progressFill && currentVideo.duration) {
            const pct = Math.min(100, (currentVideo.currentTime / currentVideo.duration) * 100);
            progressFill.style.transition = "none";
            progressFill.style.width = pct.toFixed(1) + "%";
          }
        };

        currentVideo.addEventListener("ended", onVideoEnded);
        currentVideo.addEventListener("timeupdate", onTimeUpdate);

        activeVideoCleanup = () => {
          currentVideo.removeEventListener("ended", onVideoEnded);
          currentVideo.removeEventListener("timeupdate", onTimeUpdate);
        };

        const fallbackMs = currentVideo.duration && !isNaN(currentVideo.duration)
          ? (currentVideo.duration * 1000) + 400
          : 5800;

        slideTimeout = setTimeout(() => {
          advanceToNext();
        }, fallbackMs);

      } else {
        // 2. Photo Slide Handling: 5s timer with progress bar
        if (progressFill) {
          void progressFill.offsetWidth; // Force reflow
          progressFill.style.transition = `width ${PHOTO_DURATION}ms linear`;
          progressFill.style.width = "100%";
        }

        slideTimeout = setTimeout(() => {
          advanceToNext();
        }, PHOTO_DURATION);
      }
    }

    // Navigation Paddles
    prevBtn?.addEventListener("click", () => {
      activateSlide(currentIndex - 1);
    });

    nextBtn?.addEventListener("click", () => {
      activateSlide(currentIndex + 1);
    });

    // Indicator Pills
    indicators.forEach((ind, i) => {
      ind.addEventListener("click", () => {
        activateSlide(i);
      });
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    slideshow.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slideshow.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          activateSlide(currentIndex + 1);
        } else {
          activateSlide(currentIndex - 1);
        }
      }
    }, { passive: true });

    // Keyboard navigation
    slideshow.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        activateSlide(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        activateSlide(currentIndex + 1);
      }
    });

    // Start with Slide 0 immediately
    activateSlide(0);
  }

  // Initialize both Stay and Gaming slideshows
  createAdSlideshow("stayAdSlideshow", "adProgressFill", "adPaddlePrev", "adPaddleNext");
  createAdSlideshow("gamingAdSlideshow", "gamingProgressFill", "gamingPaddlePrev", "gamingPaddleNext");
})();

/* ==========================================================================
   Gaming Page: Area Photo Lightbox Modal Controller
   ========================================================================== */
(function initGamingAreaLightbox() {
  const modal = document.getElementById("gamingAreaModal");
  if (!modal) return;

  const modalImg = document.getElementById("gamingModalImg");
  const modalTitle = document.getElementById("gamingModalTitle");
  const modalSub = document.getElementById("gamingModalSub");
  const modalClose = document.getElementById("gamingModalClose");
  const modalBackdrop = document.getElementById("gamingModalBackdrop");

  const cards = document.querySelectorAll(".gaming-area-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const img = card.querySelector(".gaming-area-card__img");
      const title = card.querySelector(".gaming-area-card__title");
      const sub = card.querySelector(".gaming-area-card__sub");

      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = title ? title.textContent : "Gaming Area";
      }
      if (modalTitle && title) modalTitle.textContent = title.textContent;
      if (modalSub && sub) modalSub.textContent = sub.textContent;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
    });
  });

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();

/* ==========================================================================
   Stay Page: 3 Options Filter (The Hotels, The Villas, The Resort)
   ========================================================================== */
(function initStayPillarFilter() {
  const tabs = Array.from(document.querySelectorAll(".stay-pillar-btn"));
  const cards = Array.from(document.querySelectorAll(".stay-showcase-card, .stay-option-card"));
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const filter = tab.getAttribute("data-filter");
      cards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || filter === cat) {
          card.classList.remove("is-hidden");
          if (filter === cat) {
            card.classList.add("is-focused");
          } else {
            card.classList.remove("is-focused");
          }
        } else {
          card.classList.add("is-hidden");
          card.classList.remove("is-focused");
        }
      });
    });
  });
})();

/* ==========================================================================
   Stay Page: Bai Hotel-Inspired Interactive Room Photo Galleries
   ========================================================================== */
(function initStayShowcaseGalleries() {
  const galleries = Array.from(document.querySelectorAll(".stay-showcase-gallery"));
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const mainImg = gallery.querySelector(".stay-gallery__main-img");
    const counterEl = gallery.querySelector(".counter-text");
    const thumbs = Array.from(gallery.querySelectorAll(".stay-thumb-btn"));
    const prevBtn = gallery.querySelector(".stay-gallery__paddle--prev");
    const nextBtn = gallery.querySelector(".stay-gallery__paddle--next");
    const viewport = gallery.querySelector(".stay-gallery__viewport");

    if (!mainImg || !thumbs.length) return;

    let currentIndex = 0;
    const total = thumbs.length;

    function selectPhoto(index, smoothTransition = true) {
      const nextIdx = ((index % total) + total) % total;
      currentIndex = nextIdx;

      thumbs.forEach((thumb, i) => {
        const isActive = i === currentIndex;
        thumb.classList.toggle("is-active", isActive);
        thumb.setAttribute("aria-selected", String(isActive));
      });

      const activeThumb = thumbs[currentIndex];
      const newSrc = activeThumb.getAttribute("data-src");
      const newAlt = activeThumb.getAttribute("data-alt");

      if (smoothTransition) {
        mainImg.style.opacity = "0.45";
        mainImg.style.transform = "scale(0.985)";
        setTimeout(() => {
          mainImg.src = newSrc;
          if (newAlt) mainImg.alt = newAlt;
          mainImg.style.opacity = "1";
          mainImg.style.transform = "scale(1)";
        }, 120);
      } else {
        mainImg.src = newSrc;
        if (newAlt) mainImg.alt = newAlt;
      }

      if (counterEl) {
        counterEl.textContent = `${currentIndex + 1} / ${total} Views`;
      }
    }

    // Thumbnail Clicks
    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener("click", () => {
        selectPhoto(idx);
      });
    });

    // Previous & Next Navigation Paddles
    prevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPhoto(currentIndex - 1);
    });

    nextBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPhoto(currentIndex + 1);
    });

    // Touch Swipe Support for Mobile Viewports
    if (viewport) {
      let touchStartX = 0;
      viewport.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.touches[0].clientX;
        },
        { passive: true }
      );

      viewport.addEventListener(
        "touchend",
        (e) => {
          const diff = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(diff) > 40) {
            if (diff < 0) {
              selectPhoto(currentIndex + 1); // Swiped left -> next
            } else {
              selectPhoto(currentIndex - 1); // Swiped right -> prev
            }
          }
        },
        { passive: true }
      );
    }
  });
})();

/* ==========================================================================
   Stay Page: Stay Details & Reservation / Inquiry Pop-Up Modal
   ========================================================================== */
(function initStayReserveModal() {
  const modal = document.getElementById("stayDetailsModal");
  if (!modal) return;

  const modalClose = document.getElementById("stayModalClose");
  const modalBackdrop = document.getElementById("stayModalBackdrop");
  const modalBadge = document.getElementById("stayModalBadge");
  const modalTitle = document.getElementById("stayModalTitle");
  const modalSubtitle = document.getElementById("stayModalSubtitle");
  const modalPrice = document.getElementById("stayModalPrice");
  const modalPriceUnit = document.getElementById("stayModalPriceUnit");
  const modalImg = document.getElementById("stayModalImg");
  const modalCaption = document.getElementById("stayModalCaption");
  const modalDesc = document.getElementById("stayModalDesc");
  const modalSpecs = document.getElementById("stayModalSpecs");
  const modalTags = document.getElementById("stayModalTags");

  const form = document.getElementById("stayReserveForm");
  const formSuccess = document.getElementById("stayFormSuccess");
  const formAccommodation = document.getElementById("stayFormAccommodation");
  const formCheckIn = document.getElementById("stayFormCheckIn");
  const formCheckOut = document.getElementById("stayFormCheckOut");
  const successGuestName = document.getElementById("successGuestName");
  const successAccommodation = document.getElementById("successAccommodation");
  const successRefCode = document.getElementById("successRefCode");
  const resetFormBtn = document.getElementById("stayResetFormBtn");

  const STAY_MODAL_DATA = [
    {
      badge: "Option 01 • The Hotels",
      title: "The Luxury Hotels",
      subtitle: "Skyline Towers • 85 – 180 sq.m • Levels 40–58",
      price: "₱28,000",
      priceUnit: "/ night",
      img: "assets/suites/premier-1.jpg",
      caption: "Master Bedroom • Skyline Panorama",
      desc: "High-elevation architectural sanctuaries featuring panoramic skyline vistas, custom onyx-clad Italian marble bathrooms, STC 62 acoustic studio seclusion, and an executive workspace tuned for deep contemplation.",
      specs: [
        { label: "Experience", val: "High-Rise Tower Suites" },
        { label: "Occupancy", val: "2 Adults" },
        { label: "Bed Type", val: "Custom King • 800-thread Frette" },
        { label: "Acoustics", val: "STC 62 Studio Seclusion" },
        { label: "Bath", val: "Onyx Marble Soaking Tub" },
        { label: "Service", val: "24/7 White-Glove In-Room" }
      ],
      tags: ["Skyline Vista", "Onyx Bath", "Nespresso Bar", "Soundproofed", "24/7 Butler", "Valet Parking"]
    },
    {
      badge: "Option 02 • The Villas",
      title: "The Private Villas",
      subtitle: "Garden & Plunge Pavilions • 140 – 260 sq.m",
      price: "₱46,000",
      priceUnit: "/ night",
      img: "assets/stay/villa-pool.jpg",
      caption: "Private Heated Plunge Pool & Courtyard",
      desc: "Secluded ground-level sanctuaries framed by verdant botanical gardens. Features open-air heated plunge pools, private teak dining terraces, outdoor soaking tubs, and 24/7 dedicated guild butler care.",
      specs: [
        { label: "Experience", val: "Private Pool Pavilions" },
        { label: "Occupancy", val: "Up to 3 Adults" },
        { label: "Plunge Pool", val: "Private Heated Terrace Pool" },
        { label: "Outdoor Bath", val: "Garden Soaking Tub" },
        { label: "Butler", val: "Dedicated 24/7 Guild Butler" },
        { label: "Privacy", val: "Private Courtyard Perimeter" }
      ],
      tags: ["Private Plunge Pool", "Outdoor Tub", "Botanical Garden", "Teak Terrace", "24/7 Butler", "Alfresco Dining"]
    },
    {
      badge: "Option 03 • The Resort",
      title: "The Grand Resort",
      subtitle: "Master Estate & Grounds • 260 – 380 sq.m",
      price: "₱78,000",
      priceUnit: "/ night",
      img: "assets/stay/resort-hotel-hero.jpg",
      caption: "Grand Facade & Ocean Reflection Lagoons",
      desc: "The pinnacle of ONYX destination living. Encompasses expansive multi-bedroom master estates, heated oceanfront reflection lagoons, private helicopter arrival bays, direct salon privé access, and master sommelier service.",
      specs: [
        { label: "Experience", val: "Full Destination Estate" },
        { label: "Occupancy", val: "Up to 6 Adults" },
        { label: "Arrival", val: "Private Lift & Heliport VIP" },
        { label: "Gaming", val: "Direct Salon Privé Access" },
        { label: "Sommelier", val: "Master Cellar Privileges" },
        { label: "Beachfront", val: "Ocean Lagoon Club Access" }
      ],
      tags: ["Heliport VIP", "Resort Lagoons", "Salon Privé Access", "Master Cellar", "Ocean Horizon", "Chauffeured Escort"]
    }
  ];

  function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const checkout = new Date(today);
    checkout.setDate(today.getDate() + 3);

    const fmt = (d) => d.toISOString().split("T")[0];
    if (formCheckIn && !formCheckIn.value) formCheckIn.value = fmt(tomorrow);
    if (formCheckOut && !formCheckOut.value) formCheckOut.value = fmt(checkout);
  }

  function openModal(idx) {
    const data = STAY_MODAL_DATA[idx];
    if (!data) return;

    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
    if (modalPrice) modalPrice.textContent = data.price;
    if (modalPriceUnit) modalPriceUnit.textContent = data.priceUnit;
    if (modalDesc) modalDesc.textContent = data.desc;

    // Check if the card currently has a selected image in gallery
    const card = document.querySelectorAll(".stay-showcase-card")[idx];
    const activeGalleryImg = card ? card.querySelector(".stay-gallery__main-img") : null;
    if (modalImg) {
      modalImg.src = (activeGalleryImg && activeGalleryImg.src) || data.img;
      modalImg.alt = data.title;
    }
    if (modalCaption) modalCaption.textContent = data.caption;

    // Populate specs
    if (modalSpecs) {
      modalSpecs.innerHTML = "";
      data.specs.forEach((s) => {
        const item = document.createElement("div");
        item.className = "stay-modal-spec-item";
        item.innerHTML = `
          <span class="stay-modal-spec-label">${s.label}</span>
          <span class="stay-modal-spec-val">${s.val}</span>
        `;
        modalSpecs.appendChild(item);
      });
    }

    // Populate tags
    if (modalTags) {
      modalTags.innerHTML = "";
      data.tags.forEach((t) => {
        const pill = document.createElement("span");
        pill.className = "tag-pill";
        pill.textContent = t;
        modalTags.appendChild(pill);
      });
    }

    // Pre-select accommodation in dropdown
    if (formAccommodation) {
      for (let i = 0; i < formAccommodation.options.length; i++) {
        if (formAccommodation.options[i].value === data.title) {
          formAccommodation.selectedIndex = i;
          break;
        }
      }
    }

    setDefaultDates();

    // Reset form view
    if (form) form.style.display = "flex";
    if (formSuccess) formSuccess.style.display = "none";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  // Trigger buttons on cards (both Reserve and Inquire buttons)
  const triggers = document.querySelectorAll(".stay-details-trigger, .stay-inquire-trigger");
  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-stay-idx"), 10) || 0;
      openModal(idx);
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Handle Form Submission
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const guestName = document.getElementById("stayFormName")?.value || "Distinguished Guest";
    const selectedStay = formAccommodation?.value || "The Luxury Hotels";
    const ref = "ONYX-" + Math.floor(100000 + Math.random() * 900000);

    if (successGuestName) successGuestName.textContent = guestName;
    if (successAccommodation) successAccommodation.textContent = selectedStay;
    if (successRefCode) successRefCode.textContent = ref;

    form.style.display = "none";
    if (formSuccess) formSuccess.style.display = "flex";
  });

  resetFormBtn?.addEventListener("click", () => {
    if (form) {
      form.reset();
      setDefaultDates();
      form.style.display = "flex";
    }
    if (formSuccess) formSuccess.style.display = "none";
  });
})();

/* ==========================================================================
   Dining Page: BAR, RESTO, HEAVEN VIP Menu Folio Switcher
   ========================================================================== */
(function initDiningMenuSwitcher() {
  const tabs = Array.from(document.querySelectorAll(".dining-menu-tab"));
  const cards = Array.from(document.querySelectorAll(".dining-menu-card"));
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetVenue = tab.getAttribute("data-venue");
      if (!targetVenue) return;

      // Update Tabs
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });

      // Update Cards
      cards.forEach((card) => {
        const isMatch = card.getAttribute("data-venue") === targetVenue;
        if (isMatch) {
          card.classList.add("is-active");
          card.removeAttribute("hidden");
        } else {
          card.classList.remove("is-active");
          card.setAttribute("hidden", "true");
        }
      });
    });
  });
})();

/* ==========================================================================
   Dining Page: Bottom Visual Photo Gallery Filter
   ========================================================================== */
(function initDiningGalleryFilter() {
  const filterBtns = Array.from(document.querySelectorAll(".dining-photo-filter-btn"));
  const photoCards = Array.from(document.querySelectorAll(".dining-photo-card"));
  if (!filterBtns.length || !photoCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      if (!filter) return;

      // Update Active Filter Button
      filterBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", String(isActive));
      });

      // Filter Photo Cards
      photoCards.forEach((card) => {
        const venue = card.getAttribute("data-venue");
        if (filter === "all" || filter === venue) {
          card.classList.remove("is-hidden");
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 50);
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
})();

/* ==========================================================================
   Gaming Page: Area Photo Lightbox Modal
   ========================================================================== */
(function initGamingLightbox() {
  const modal = document.getElementById("gamingAreaModal");
  const modalClose = document.getElementById("gamingModalClose");
  const modalBackdrop = document.getElementById("gamingModalBackdrop");
  const modalImg = document.getElementById("gamingModalImg");
  const modalTitle = document.getElementById("gamingModalTitle");
  const modalSub = document.getElementById("gamingModalSub");
  const cards = Array.from(document.querySelectorAll(".gaming-area-card"));

  if (!modal || !cards.length) return;

  function openModal(card) {
    const fullSrc = card.getAttribute("data-full-src") || card.querySelector("img")?.src;
    const title = card.getAttribute("data-title") || card.querySelector(".gaming-area-card__title")?.textContent;
    const sub = card.getAttribute("data-sub") || card.querySelector(".gaming-area-card__sub")?.textContent;

    if (modalImg && fullSrc) {
      modalImg.src = fullSrc;
      modalImg.alt = title || "Gaming Area Photo";
    }
    if (modalTitle && title) modalTitle.textContent = title;
    if (modalSub && sub) modalSub.innerHTML = sub;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();

/* ==========================================================================
   Events & Offers Page: Category Filter Switcher
   ========================================================================== */
(function initEventsFilterSwitcher() {
  const filterBtns = Array.from(document.querySelectorAll(".events-filter-btn"));
  const sections = Array.from(document.querySelectorAll(".events-section[data-category]"));

  if (!filterBtns.length || !sections.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      if (!filter) return;

      filterBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", String(isActive));
      });

      sections.forEach((sec) => {
        const cat = sec.getAttribute("data-category");
        if (filter === "all" || filter === cat) {
          sec.classList.remove("is-hidden");
          sec.style.opacity = "0";
          setTimeout(() => {
            sec.style.opacity = "1";
          }, 50);
        } else {
          sec.classList.add("is-hidden");
        }
      });
    });
  });
})();


