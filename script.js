/**
 * ============================================================
 *  BRUCE BOGE — Portfolio Script
 *  File: script.js
 * ============================================================
 *
 *  SECTIONS IN THIS FILE
 *  ─────────────────────
 *  1. Sidebar Toggle        — Mobile "Show Contacts" expand/collapse
 *  2. Testimonials Modal    — Click-to-expand testimonial detail popup
 *  3. Navigation            — SPA-style tab switching (About / Resume / etc.)
 *  4. Portfolio Filter      — Desktop category filter buttons
 *  5. Mobile Filter Select  — Dropdown category selector for small screens
 *  6. Form Validation       — Contact form real-time validation + submission
 *  7. Smooth Scroll         — Smooth scroll for anchor links
 *  8. Skill Bar Animation   — Animates progress bars when Resume tab opens
 *  9. Outside Click Handler — Closes mobile select dropdown on outside click
 * 10. initializeFilters()   — DOMContentLoaded re-init to support dynamic content
 *
 *  HOW DATA-ATTRIBUTES WORK
 *  ─────────────────────────
 *  JS targets HTML elements exclusively via data-* attributes (not classes/IDs).
 *  This keeps JS and CSS decoupled — CSS changes won't break JS behaviour.
 *
 *  KEY DATA ATTRIBUTES:
 *    [data-sidebar]           — The aside sidebar element
 *    [data-sidebar-btn]       — "Show Contacts" toggle button
 *    [data-nav-link]          — Each navbar tab button
 *    [data-page]              — Each article section (about, resume, etc.)
 *    [data-target]            — Value on nav button matching data-page
 *    [data-testimonials-item] — Clickable testimonial card
 *    [data-testimonials-avatar/title/text] — Data inside each card
 *    [data-modal-container]   — The modal wrapper
 *    [data-overlay]           — Dark backdrop overlay
 *    [data-modal-close-btn]   — × close button inside modal
 *    [data-modal-img/title/text] — Modal content targets
 *    [data-filter-btn]        — Desktop filter buttons
 *    [data-filter-item]       — Portfolio project list items
 *    [data-select]            — Mobile category dropdown button
 *    [data-select-item]       — Options inside mobile dropdown
 *    [data-select-value]      — Displays selected category label
 *    [data-form]              — Contact form element
 *    [data-form-input]        — Each input/textarea in contact form
 * ============================================================
 */


/* ============================================================
   1. SIDEBAR TOGGLE
   ─────────────────
   On mobile/tablet (< 1024px) the sidebar is collapsed to show
   only the name & title. Clicking "Show Contacts" toggles the
   `.active` class which expands max-height via CSS transition.

   At 1024px+ the sidebar is always fully visible (sticky layout),
   so the toggle button is hidden via CSS — this JS still runs but
   has no visual effect at that size.
   ============================================================ */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
  });
}


/* ============================================================
   2. TESTIMONIALS MODAL
   ──────────────────────
   Clicking a testimonial card opens a full-screen popup modal
   populated with that card's avatar, name, and full text.

   HOW TO UPDATE:
   - To add a new testimonial: copy a <li class="testimonials-item">
     block in index.html with the correct data-* attributes.
   - Avatar uses DiceBear (api.dicebear.com) — change ?seed=Name
     to generate different avatar styles.
   - The modal HTML is static — JS dynamically fills it from the
     clicked card's data each time.
   ============================================================ */
const testimonialsItems = document.querySelectorAll("[data-testimonials-item]");
const modalContainer    = document.querySelector("[data-modal-container]");
const modalCloseBtn     = document.querySelector("[data-modal-close-btn]");
const overlay           = document.querySelector("[data-overlay]");

// Modal content targets — JS writes into these on each open
const modalImg   = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText  = document.querySelector("[data-modal-text]");

/**
 * openModal — Populates the modal with data from the clicked card
 * and makes both the modal and the overlay visible.
 * @param {HTMLElement} item — The clicked [data-testimonials-item] element
 */
function openModal(item) {
  const avatar = item.querySelector("[data-testimonials-avatar]");
  const title  = item.querySelector("[data-testimonials-title]");
  const text   = item.querySelector("[data-testimonials-text]");

  if (modalImg) {
    modalImg.src = avatar ? avatar.src : "";
    modalImg.alt = avatar ? avatar.alt : "";
  }
  if (modalTitle) modalTitle.textContent = title ? title.textContent : "";
  if (modalText)  modalText.innerHTML    = text  ? text.innerHTML   : "";

  modalContainer && modalContainer.classList.add("active");
  overlay        && overlay.classList.add("active");
}

/**
 * closeModal — Removes .active from modal and overlay to hide them.
 * Called by the × button and by clicking outside the modal (overlay).
 */
function closeModal() {
  modalContainer && modalContainer.classList.remove("active");
  overlay        && overlay.classList.remove("active");
}

// Attach click → open on every testimonial card
testimonialsItems.forEach((item) => {
  item.addEventListener("click", function () {
    openModal(this);
  });
});

// × button inside modal
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}

// Clicking the dark overlay also closes the modal
if (overlay) {
  overlay.addEventListener("click", closeModal);
}


/* ============================================================
   3. NAVIGATION (SPA tab switching)
   ───────────────────────────────────
   The portfolio works as a Single Page Application — only one
   <article data-page="..."> is visible at a time.

   Each navbar button has:
     data-nav-link        — marks it as a nav button
     data-target="about"  — must match a <article data-page="about">

   On click:
     1. Remove .active from all nav buttons
     2. Add .active to clicked button
     3. Hide all article pages
     4. Show the matching article
     5. Scroll to top

   HOW TO ADD A NEW PAGE:
     - Add a <li> with a <button data-nav-link data-target="newpage"> in the navbar
     - Add an <article class="newpage" data-page="newpage"> in .main-content
     - CSS handles visibility via `article.active { display: block; }`
   ============================================================ */
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages           = document.querySelectorAll("[data-page]");

navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    const targetPage = this.getAttribute("data-target");

    // Deactivate all links, activate the clicked one
    navigationLinks.forEach((navLink) => navLink.classList.remove("active"));
    this.classList.add("active");

    // Hide all pages, show the matching one
    pages.forEach((page) => page.classList.remove("active"));
    const targetElement = document.querySelector(`[data-page="${targetPage}"]`);
    if (targetElement) {
      targetElement.classList.add("active");
      window.scrollTo(0, 0); // Always start at the top of the new page
    }
  });
});


/* ============================================================
   4. PORTFOLIO FILTER (desktop)
   ──────────────────────────────
   Desktop-only filter buttons (visible at 768px+) above the
   project grid. Each button has data-category="web|n8n|all" etc.
   Each project <li> has data-filter-item data-category="web".

   HOW TO ADD A NEW CATEGORY:
     - Add a <li class="filter-item"><button data-filter-btn data-category="newcat">
     - Tag project <li> items with data-category="newcat"
     - Repeat for the mobile select list (see section 5)
   ============================================================ */
const filterBtns  = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const selectedCategory = this.getAttribute("data-category");

    // Update active state on filter buttons
    filterBtns.forEach((filterBtn) => filterBtn.classList.remove("active"));
    this.classList.add("active");

    // Show/hide project items based on category match
    filterItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      if (selectedCategory === "all" || selectedCategory === itemCategory) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  });
});


/* ============================================================
   5. MOBILE FILTER SELECT
   ────────────────────────
   On screens < 768px the desktop filter buttons are hidden and
   replaced by a custom dropdown select. Clicking an option:
     1. Updates the visible selected label
     2. Closes the dropdown
     3. Filters the project items (same logic as desktop)

   The dropdown uses CSS for open/close animation via .active class.
   ============================================================ */
const select      = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const selectList  = document.querySelector(".select-list");

// Toggle dropdown open/close
if (select) {
  select.addEventListener("click", function () {
    this.classList.toggle("active");
  });
}

// Handle option selection
selectItems.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedCategory = this.getAttribute("data-category");

    // Update display label
    if (selectValue) selectValue.innerText = this.innerText;

    // Close the dropdown
    if (select) select.classList.remove("active");

    // Filter project items
    filterItems.forEach((filterItem) => {
      const itemCategory = filterItem.getAttribute("data-category");
      if (selectedCategory === "all" || selectedCategory === itemCategory) {
        filterItem.classList.add("active");
      } else {
        filterItem.classList.remove("active");
      }
    });
  });
});


/* ============================================================
   6. CONTACT FORM VALIDATION & SUBMISSION
   ─────────────────────────────────────────
   The Send button stays disabled until all fields pass HTML5
   validation (required, type checks). On valid submit an alert
   is shown and the form resets.

   HOW TO CONNECT A REAL BACKEND:
   Replace the alert() and console.log() inside form.addEventListener
   with a fetch() call to your API endpoint or service (e.g. EmailJS,
   Formspree, or a custom Node/Express endpoint).

   Example with Formspree:
     fetch("https://formspree.io/f/YOUR_ID", {
       method: "POST",
       body: formData,
       headers: { Accept: "application/json" }
     }).then(() => alert("Sent!"));
   ============================================================ */
const form       = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn    = document.querySelector(".form-btn");

if (form) {
  // Enable Send button only when all inputs are valid
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // Handle submission — replace alert() with real API call when ready
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data     = Object.fromEntries(formData);

    console.log("Form submitted:", data); // TODO: replace with real send logic
    alert("Thank you for your message! I'll get back to you soon.");

    form.reset();
    formBtn.setAttribute("disabled", ""); // Re-disable after reset
  });
}


/* ============================================================
   7. SMOOTH SCROLL (anchor links)
   ─────────────────────────────────
   Intercepts clicks on <a href="#section"> links and replaces
   the default jump with a smooth CSS scroll animation.
   Plain "#" links (back-to-top style) are ignored intentionally.
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});


/* ============================================================
   8. SKILL BAR ANIMATION (Resume page)
   ──────────────────────────────────────
   The progress bars in the Resume Skills section animate from
   0% to their target width when the Resume tab becomes active.
   A 100ms delay is used so the animation plays after the tab
   fade-in transition completes.

   HOW TO UPDATE SKILL LEVELS:
   Each bar is a <div class="skill-progress-fill" style="width: XX%">
   Change the inline `width` value to adjust the percentage.
   ============================================================ */
const skillBars = document.querySelectorAll(".skill-progress-fill");

/**
 * animateSkillBars — Resets each bar to 0% then animates it to its
 * original width. Uses inline style manipulation for smooth CSS transitions.
 */
const animateSkillBars = () => {
  skillBars.forEach((bar) => {
    const barPosition    = bar.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (barPosition < screenPosition) {
      const targetWidth  = bar.style.width; // Preserve the original width
      bar.style.width    = "0%";            // Reset to 0 first
      setTimeout(() => {
        bar.style.width  = targetWidth;     // Animate to target
      }, 100);
    }
  });
};

// Run immediately if Resume page is already active on load
const resumePage = document.querySelector('[data-page="resume"]');
if (resumePage && resumePage.classList.contains("active")) {
  animateSkillBars();
}

// Also trigger when user navigates TO the Resume tab
navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    if (this.getAttribute("data-target") === "resume") {
      setTimeout(animateSkillBars, 300); // After page fade-in (~250ms)
    }
  });
});


/* ============================================================
   9. OUTSIDE CLICK — Close mobile dropdown
   ─────────────────────────────────────────
   If user clicks anywhere on the document that is NOT inside
   the filter select button, the dropdown closes automatically.
   Prevents the dropdown from staying open when user clicks away.
   ============================================================ */
document.addEventListener("click", function (e) {
  if (select && selectList && !select.contains(e.target)) {
    select.classList.remove("active");
  }
});


/* ============================================================
  10. INITIALIZE FILTERS (DOMContentLoaded)
   ───────────────────────────────────────────
   Runs once when the DOM is fully loaded. Re-initialises the
   filter system to handle any dynamically injected content
   (e.g. projects loaded from an external source in the future).

   This is a safe guard — the event listeners above already work
   for static content, so this adds resilience for future changes.

   HOW TO EXTEND:
   If you add dynamic project loading (e.g. from GitHub API or a
   CMS), call initializeFilters() again after injecting new items.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initializeFilters();
});

/**
 * initializeFilters — Sets up category filtering for both desktop
 * filter buttons and the mobile select dropdown.
 * Safe to call multiple times (e.g. after dynamic content load).
 */
function initializeFilters() {
  const filterBtns  = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");
  const selectItems = document.querySelectorAll("[data-select-item]");

  /**
   * filterFunc — Shows items matching selectedValue, hides the rest.
   * @param {string} selectedValue — The data-category value to match
   */
  const filterFunc = function (selectedValue) {
    filterItems.forEach((item) => {
      const matches = selectedValue === "all" ||
                      selectedValue === item.getAttribute("data-category");
      item.classList.toggle("active",  matches);
    });
  };

  // Desktop: filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const selectedValue = this.getAttribute("data-category");
      filterBtns.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
      filterFunc(selectedValue);
    });
  });

  // Mobile: dropdown option selection
  const selectEl = document.querySelector("[data-select]");
  selectItems.forEach((item) => {
    item.addEventListener("click", function () {
      const selectedValue = this.getAttribute("data-category");
      const selectValueEl = document.querySelector("[data-select-value]");
      if (selectValueEl) selectValueEl.innerText = this.innerText;
      if (selectEl) selectEl.classList.remove("active");
      filterFunc(selectedValue);
    });
  });
}
