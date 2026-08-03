document.addEventListener("DOMContentLoaded", () => {
  // --- Section 2: Carousel Auto Scrolling Logic ---
  const trackContainer = document.querySelector(".place-companies-track-container");
  const track = document.querySelector(".place-companies-track");
  const prevBtn = document.querySelector(".place-prev-btn");
  const nextBtn = document.querySelector(".place-next-btn");
  const dots = document.querySelectorAll(".place-carousel-dots .place-dot");
  const carouselWrapper = document.querySelector(".place-carousel-wrapper");

  if (trackContainer && track) {
    
    // 1. முடிவில்லாமல் சுற்ற, Cards-ஐ Clone செய்து Track-ல் இணைத்தல் (Infinite Loop Trick)
    const cards = Array.from(track.children);
    cards.forEach((card) => {
      let clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    let scrollSpeed = 1.2; // நகரும் வேகம் (Speed-ஐக் குறைக்க/கூட்ட இந்த நம்பரை மாற்றவும்)
    let isPaused = false;
    let animationFrameId;

    // 2. தொடர்ந்து நகரும் Continuous Scroll Function (Marquee Effect)
    const continuousScroll = () => {
      if (!isPaused) {
        trackContainer.scrollLeft += scrollSpeed;

        // Clone செய்யப்பட்ட பகுதிக்கு வந்ததும், யாருக்கும் தெரியாமல் மீண்டும் 0-க்குச் செல்லும்
        if (trackContainer.scrollLeft >= track.scrollWidth / 2) {
          trackContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(continuousScroll);
    };

    // Auto Scroll-ஐத் தொடங்க
    animationFrameId = requestAnimationFrame(continuousScroll);

    // 3. Mouse மற்றும் Touch-ல் Scrolling-ஐ நிறுத்திவைக்க (Pause on Hover)
    carouselWrapper.addEventListener("mouseenter", () => (isPaused = true));
    carouselWrapper.addEventListener("mouseleave", () => (isPaused = false));
    carouselWrapper.addEventListener("touchstart", () => (isPaused = true));
    carouselWrapper.addEventListener("touchend", () => (isPaused = false));

    // 4. பட்டன்கள் (Prev/Next) மூலம் நகர்த்தும் வசதி
    const getCardWidth = () => {
      const card = document.querySelector(".place-company-card");
      return card ? card.offsetWidth + 20 : 200; // Card அகலம் + இடைவெளி
    };

    nextBtn.addEventListener("click", () => {
      isPaused = true;
      trackContainer.scrollBy({ left: getCardWidth(), behavior: "smooth" });
      setTimeout(() => { isPaused = false; }, 600); // 0.6 நொடிக்கு பிறகு மீண்டும் Auto-scroll ஆகும்
    });

    prevBtn.addEventListener("click", () => {
      isPaused = true;
      // முதலில் இருந்தால், கண்ணுக்குத் தெரியாமல் மையப்பகுதிக்குச் சென்று பின்னால் நகரும்
      if (trackContainer.scrollLeft === 0) {
        trackContainer.scrollLeft = track.scrollWidth / 2;
      }
      trackContainer.scrollBy({ left: -getCardWidth(), behavior: "smooth" });
      setTimeout(() => { isPaused = false; }, 600);
    });

    // 5. Scroll ஆக ஆக Dots தானாகவே அப்டேட் ஆக
    setInterval(() => {
      if (!isPaused) {
        let scrollPercentage = trackContainer.scrollLeft / (track.scrollWidth / 2);
        let dotIndex = Math.floor(scrollPercentage * dots.length);
        if (dotIndex >= dots.length) dotIndex = dots.length - 1;

        dots.forEach((d) => d.classList.remove("place-active"));
        if (dots[dotIndex]) {
          dots[dotIndex].classList.add("place-active");
        }
      }
    }, 150);

  }
});