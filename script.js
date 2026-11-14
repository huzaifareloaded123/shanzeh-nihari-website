
/* SHANZEH NIHARI — ORDERING SYSTEM */

document.addEventListener("DOMContentLoaded", () => {
  const DELIVERY_FEE = 200;

  const menu = [
    {
      id: 1,
      category: "nihari",
      name: "Single Nihari",
      price: 500,
      description: "Traditional nihari with rich aromatic gravy.",
      badge: "CLASSIC"
    },
    {
      id: 2,
      category: "nihari",
      name: "Single Nihari Fry",
      price: 600,
      description: "Our classic nihari with a delicious fried finish.",
      badge: "POPULAR"
    },
    {
      id: 3,
      category: "nihari",
      name: "Double Nihari",
      price: 1050,
      description: "A generous serving of authentic nihari.",
      badge: "HEARTY"
    },
    {
      id: 4,
      category: "nihari",
      name: "Nalli Nihari",
      price: 800,
      description: "Rich nihari with flavourful nalli.",
      badge: "SPECIAL"
    },
    {
      id: 5,
      category: "nihari",
      name: "Maghaz Nihari",
      price: 800,
      description: "A traditional Karachi specialty.",
      badge: "SPECIAL"
    },
    {
      id: 6,
      category: "nihari",
      name: "Desi Ghee Tarka",
      price: 150,
      description: "Extra desi ghee tarka for a richer flavour.",
      badge: "ADD-ON"
    },
    {
      id: 7,
      category: "nihari",
      name: "Single Special Nihari",
      price: 1350,
      description: "Our premium special nihari serving.",
      badge: "PREMIUM"
    },
    {
      id: 8,
      category: "nihari",
      name: "Special Nihari Thaal",
      price: 1850,
      description: "Our signature nihari thaal experience.",
      badge: "SIGNATURE"
    },
    // Owner's banner items; prices are temporary demo values.
    { id: 9, category: "biryani-pulao", name: "Beef Pulao", price: 450, description: "Beef pulao — demo menu item.", badge: "DEMO PRICE" },
    { id: 10, category: "biryani-pulao", name: "Chana Pulao", price: 300, description: "Chana pulao — demo menu item.", badge: "DEMO PRICE" },
    { id: 11, category: "biryani-pulao", name: "Chicken Biryani", price: 380, description: "Chicken biryani — demo menu item.", badge: "DEMO PRICE" },
    { id: 12, category: "breakfast", name: "Halwa Puri", price: 250, description: "Traditional halwa puri breakfast — demo menu item.", badge: "DEMO PRICE" },
    { id: 13, category: "breakfast", name: "Paye", price: 220, description: "Traditional paye — temporary demo price.", badge: "DEMO PRICE" }
  ];

  // Distinct demo food photographs for each menu item.
  // Replace with actual Shanzeh Nihari dish photographs after owner approval.
  const foodImages = {
    1: "single-nihari.webp",
    2: "single-nihari-fry.webp",
    3: "double-nihari.webp",
    4: "nalli-nihari.webp",
    5: "maghaz-nihari.webp",
    6: "desi-ghee-tarka.webp",
    7: "single-special-nihari.webp",
    8: "special-nihari-thaal.webp",
    9: "beef-pulao.webp",
    10: "chana-pulao.webp",
    11: "chicken-biryani.webp",
    12: "halwa-puri.webp",
    13: "paye.webp",
  };

  const cart = new Map();
  function getOrderPreference() {
    try { return JSON.parse(localStorage.getItem("shanzehOrderPreference")) || null; }
    catch { return null; }
  }
  function deliveryCharge() { return getOrderPreference()?.type === "pickup" ? 0 : DELIVERY_FEE; }
  function updateOrderModeUI() {
    const fee = deliveryCharge();
    const note = document.querySelector(".delivery-note");
    if (note) note.textContent = fee ? "Delivery charges: Rs. 200 within Karachi" : "Pickup — no delivery charge";
    const summary = document.querySelector(".checkout-summary > div:nth-child(2) strong");
    if (summary) summary.textContent = money(fee);
    const address = document.querySelector("#customerAddress");
    const addressLabel = document.querySelector('label[for="customerAddress"]');
    if (address) { address.required = fee > 0; address.placeholder = fee ? "House number, street, area, Karachi" : "Optional pickup notes / address"; }
    if (addressLabel) addressLabel.textContent = fee ? "DELIVERY ADDRESS (KARACHI)" : "ADDRESS (OPTIONAL FOR PICKUP)";
    const price = document.querySelector(".premium-delivery-price");
    if (price) price.innerHTML = fee ? 'Karachi delivery <strong>Rs. 200</strong>' : 'Pickup <strong>Free</strong>';
  }

  const $ = (selector) => document.querySelector(selector);

  const menuGrid = $("#menuGrid");
  const riceMenuGrid = $("#riceMenuGrid");
  const breakfastMenuGrid = $("#breakfastMenuGrid");
  const cartDrawer = $("#cartDrawer");
  const cartOverlay = $("#cartOverlay");
  const cartItems = $("#cartItems");
  const checkoutOverlay = $("#checkoutOverlay");

  const money = (amount) =>
    "Rs. " + amount.toLocaleString("en-PK");

  function getSubtotal() {
    return [...cart.entries()].reduce((total, [id, quantity]) => {
      const item = menu.find((product) => product.id === id);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  }

  function getItemCount() {
    return [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  }

  // MENU CARDS
  function renderMenu() {
    const renderCards = (items) => items.map((item) => `
      <article class="food-card">
        <div class="food-image">
          <img
            src="${foodImages[item.id]}"
            alt="${item.name} — illustrative food photo"
            loading="lazy"
          >
          <span class="food-badge">${item.badge}</span>
        </div>

        <div class="food-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>

          <div class="food-bottom">
            <span class="price">${money(item.price)}</span>
            <button
              class="add-btn"
              type="button"
              data-add="${item.id}"
            >
              + ADD TO CART
            </button>
          </div>
        </div>
      </article>
    `).join("");
    menuGrid.innerHTML = renderCards(menu.filter(item => item.category === "nihari"));
    if (riceMenuGrid) riceMenuGrid.innerHTML = renderCards(menu.filter(item => item.category === "biryani-pulao"));
    if (breakfastMenuGrid) breakfastMenuGrid.innerHTML = renderCards(menu.filter(item => item.category === "breakfast"));
  }

  // CART
  function updateCart() {
    const count = getItemCount();
    const subtotal = getSubtotal();
    updateOrderModeUI();

    $("#cartCount").textContent = count;
    $("#cartTitleCount").textContent = `(${count})`;
    $("#cartSubtotal").textContent = money(subtotal);
    $("#checkoutSubtotal").textContent = money(subtotal);
    $("#checkoutTotal").textContent = money(
      count ? subtotal + deliveryCharge() : 0
    );

    $("#checkoutOpen").disabled = count === 0;

    if (count === 0) {
      cartItems.innerHTML =
        '<p class="empty-cart">Your cart is empty. Add something delicious!</p>';
      return;
    }

    cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
      const item = menu.find((product) => product.id === id);
      if (!item) return "";

      return `
        <div class="cart-item">
          <div>
            <h3>${item.name}</h3>
            <span class="cart-item-price">
              ${money(item.price * quantity)}
            </span>
          </div>

          <div class="quantity-controls">
            <button type="button" data-decrease="${id}"
              aria-label="Decrease ${item.name}">−</button>
            <strong>${quantity}</strong>
            <button type="button" data-increase="${id}"
              aria-label="Increase ${item.name}">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function addItem(id) {
    if (!menu.some((item) => item.id === id)) return;

    cart.set(id, (cart.get(id) || 0) + 1);
    updateCart();
    openCart();
  }

  function changeQuantity(id, difference) {
    if (!cart.has(id)) return;

    const next = cart.get(id) + difference;

    if (next <= 0) {
      cart.delete(id);
    } else {
      cart.set(id, next);
    }

    updateCart();
  }

  function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.classList.add("no-scroll");
    $("#cartClose").focus();
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  // CHECKOUT
  function openCheckout() {
    if (getItemCount() === 0) return;

    closeCart();
    checkoutOverlay.classList.add("open");
    document.body.classList.add("no-scroll");
    $("#customerName").focus();
  }

  function closeCheckout() {
    checkoutOverlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  // CLICK HANDLERS
  document.querySelector("#menu").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addItem(Number(button.dataset.add));
  });

  cartItems.addEventListener("click", (event) => {
    const increase = event.target.closest("[data-increase]");
    const decrease = event.target.closest("[data-decrease]");

    if (increase) {
      changeQuantity(Number(increase.dataset.increase), 1);
    }

    if (decrease) {
      changeQuantity(Number(decrease.dataset.decrease), -1);
    }
  });

  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  $("#checkoutOpen").addEventListener("click", openCheckout);
  $("#checkoutClose").addEventListener("click", closeCheckout);

  checkoutOverlay.addEventListener("click", (event) => {
    if (event.target === checkoutOverlay) closeCheckout();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (checkoutOverlay.classList.contains("open")) {
        closeCheckout();
      } else {
        closeCart();
      }
    }
  });

  // DEMO CHECKOUT — DOES NOT SEND AN ORDER
  $("#checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();

    if (getItemCount() === 0) return;

    const name = $("#customerName").value.trim();
    const phone = $("#customerPhone").value.trim();
    const address = $("#customerAddress").value.trim();

    if (!name || !phone || (deliveryCharge() > 0 && !address)) {
      $("#checkoutMessage").textContent =
        "Please complete all required fields.";
      return;
    }

    $("#checkoutMessage").textContent =
      "Demo only: your details were checked, but no order was sent. Online ordering will be activated later.";
  });

  // SCROLL ANIMATIONS
  const animatedSections = document.querySelectorAll(
    ".section-heading, .story-inner, .delivery-inner"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animatedSections.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  // COPYRIGHT YEAR
  $("#year").textContent = new Date().getFullYear();

  renderMenu();
  updateCart();
  document.addEventListener("shanzeh:order-preference-changed", updateCart);

  console.log("Shanzeh Nihari demo loaded.");
});

/* ==========================================
   SHANZEH NIHARI — ORDER TYPE POPUP
   ========================================== */

   document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("orderModal");
    const deliveryTab = document.getElementById("deliveryTab");
    const pickupTab = document.getElementById("pickupTab");
    const deliveryOptions = document.getElementById("deliveryOptions");
    const pickupOptions = document.getElementById("pickupOptions");
    const deliveryArea = document.getElementById("deliveryArea");
    const pickupBranch = document.getElementById("pickupBranch");
    const locationButton = document.getElementById("useLocationBtn");
    const locationStatus = document.getElementById("locationStatus");
    const helpText = document.getElementById("orderModalHelp");
    const confirmButton = document.getElementById("confirmOrderType");
  
    if (!modal) return;
  
    let orderType = "delivery";
    let currentCoordinates = null;
  
    // Restore the customer's previous choice
    try {
      const saved = JSON.parse(
        localStorage.getItem("shanzehOrderPreference")
      );
  
      // Keep all click handlers active even when a preference was saved.
      // The popup is shown on each page load while testing.
      if (saved && saved.type === "pickup") {
        orderType = "pickup";
      }
    } catch (error) {
      // Ignore unavailable or invalid saved data
    }
  
    function changeType(type) {
      orderType = type;
      currentCoordinates = null;
      locationStatus.textContent = "";
  
      const isDelivery = type === "delivery";
  
      deliveryTab.classList.toggle("active", isDelivery);
      pickupTab.classList.toggle("active", !isDelivery);
  
      deliveryOptions.hidden = !isDelivery;
      pickupOptions.hidden = isDelivery;
  
      helpText.textContent = isDelivery
        ? "Please select your location"
        : "Which outlet would you like to pick-up from?";
  
      locationButton.hidden = !isDelivery;
    }
  
    deliveryTab.addEventListener("click", () => {
      changeType("delivery");
    });
  
    pickupTab.addEventListener("click", () => {
      changeType("pickup");
    });
  
    // Get device coordinates with browser permission
    locationButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        locationStatus.textContent =
          "Location is not supported. Please select your area.";
        return;
      }
  
      locationStatus.textContent = "Getting your location...";
      locationButton.disabled = true;
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
  
          locationButton.disabled = false;
  
          // Approximate Karachi geographical bounds.
          // This is not a delivery-service boundary.
          const inKarachi =
            lat >= 24.7 && lat <= 25.5 &&
            lon >= 66.6 && lon <= 67.6;
  
          if (!inKarachi) {
            currentCoordinates = null;
            locationStatus.textContent =
              "Location appears outside Karachi. Please select a Karachi area.";
            return;
          }
  
          currentCoordinates = { lat, lon };
          deliveryArea.value = "";
  
          locationStatus.textContent =
            "Location detected! Confirm your address during checkout.";
        },
        (error) => {
          locationButton.disabled = false;
  
          if (error.code === 1) {
            locationStatus.textContent =
              "Location permission denied. Please select your area.";
          } else {
            locationStatus.textContent =
              "Could not get location. Please select your area.";
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 12000,
          maximumAge: 60000
        }
      );
    });
  
    // Manually selected area overrides GPS
    deliveryArea.addEventListener("change", () => {
      if (deliveryArea.value) {
        currentCoordinates = null;
        locationStatus.textContent = "";
      }
    });
  
    // Confirm choice
    confirmButton.addEventListener("click", () => {
      let preference;
  
      if (orderType === "delivery") {
        const area = deliveryArea.value;
  
        if (!area && !currentCoordinates) {
          locationStatus.textContent =
            "Please select your Karachi area or use current location.";
          deliveryArea.focus();
          return;
        }
  
        preference = {
          type: "delivery",
          area: area || "Current Location",
          coordinates: currentCoordinates
        };
      } else {
        if (!pickupBranch.value) {
          locationStatus.textContent =
            "Please select a pickup branch.";
          return;
        }
  
        preference = {
          type: "pickup",
          branch: pickupBranch.value
        };
      }
  
      try {
        localStorage.setItem(
          "shanzehOrderPreference",
          JSON.stringify(preference)
        );
      } catch (error) {
        // Continue even if browser storage is disabled
      }
  
      modal.classList.add("is-hidden");
      document.body.style.overflow = "";
      document.dispatchEvent(new CustomEvent("shanzeh:order-preference-changed"));
    });
  
    // Keep the page behind the modal from scrolling
    if (!modal.classList.contains("is-hidden")) {
      document.body.style.overflow = "hidden";
    }
  
    modal.classList.remove("is-hidden");
    changeType(orderType);
  });

/* ==========================================
   SHANZEH NIHARI — SCROLL ANIMATION ENGINE
   ========================================== */

   document.addEventListener("DOMContentLoaded", () => {

    // Headings, story and delivery already use the original .reveal system.
    // Animate only menu cards and footer here to avoid competing transforms.
    const selectors = [
      ".food-card",
      ".footer-top"
    ];
  
    const elements = document.querySelectorAll(
      selectors.join(", ")
    );
  
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
  
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );
  
    elements.forEach((element, index) => {
      element.classList.add("cinematic-reveal");
  
      if (element.classList.contains("food-card")) {
        const cardIndex = Array.from(
          element.parentElement.children
        ).indexOf(element);
  
        element.style.transitionDelay =
          `${(cardIndex % 4) * 110}ms`;
      }
  
      observer.observe(element);
    });
  
  });

/* Popup testing mode: show on every page refresh.
   To remember the customer's choice and skip the popup later,
   this behavior can be changed after client approval. */
    
/* SHANZEH HEADER LOCATION DISPLAY */

document.addEventListener("DOMContentLoaded", () => {
  const locationBtn = document.getElementById("headerLocationBtn");
  const typeLabel = document.getElementById("headerOrderType");
  const locationLabel = document.getElementById("headerLocationText");
  const modal = document.getElementById("orderModal");

  if (!locationBtn || !typeLabel || !locationLabel) return;

  function updateHeaderLocation() {
    let saved = null;

    try {
      saved = JSON.parse(
        localStorage.getItem("shanzehOrderPreference")
      );
    } catch (error) {
      saved = null;
    }

    if (!saved) {
      typeLabel.textContent = "SELECT LOCATION";
      locationLabel.textContent = "Choose your area";
      return;
    }

    if (saved.type === "delivery") {
      typeLabel.textContent = "DELIVERY";
      locationLabel.textContent =
        saved.area || "Current Location";
    } else if (saved.type === "pickup") {
      typeLabel.textContent = "PICKUP";
      locationLabel.textContent =
        saved.branch === "main"
          ? "Shanzeh Nihari — Main Branch"
          : saved.branch || "Select Branch";
    }
  }

  // Open existing location popup.
  locationBtn.addEventListener("click", () => {
    if (!modal) return;

    modal.classList.remove("is-hidden");
    document.body.style.overflow = "hidden";
  });

  // Update header after customer confirms selection.
  const confirmBtn = document.getElementById("confirmOrderType");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      // Confirm handler saves preference first; invalid selection leaves modal visible.
      setTimeout(() => {
        if (modal && modal.classList.contains("is-hidden")) updateHeaderLocation();
      }, 0);
    });
  }

  updateHeaderLocation();
});


/* =====================================================
   MENU CATEGORY NAVIGATION — sticky / smooth / scroll spy
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("menuCategoryBar");
  const inner = document.getElementById("menuCategoryInner");
  const pill = document.getElementById("menuActivePill");
  if (!bar || !inner || !pill) return;
  const links = [...inner.querySelectorAll("[data-category]")];
  const sections = links.map(link => document.getElementById(link.dataset.category));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = "nihari";
  let raf = 0;
  let programmaticUntil = 0;
  function positionPill(link) {
    if (!link) return;
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translate3d(${link.offsetLeft}px,0,0)`;
  }
  function selectCategory(id) {
    const link = links.find(el => el.dataset.category === id);
    if (!link) return;
    active = id;
    links.forEach(el => {
      const selected = el === link;
      el.classList.toggle("active", selected);
      if (selected) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
    positionPill(link);
    // Keep selected tab visible in the horizontally scrollable mobile bar.
    const desired = link.offsetLeft + link.offsetWidth / 2 - inner.clientWidth / 2;
    inner.scrollTo({left: desired, behavior: reduceMotion.matches ? "instant" : "smooth"});
  }
  function getOffset() {
    const header = document.querySelector(".site-header");
    return (header ? header.getBoundingClientRect().height : 0) + bar.getBoundingClientRect().height + 12;
  }
  links.forEach(link => link.addEventListener("click", event => {
    const target = document.getElementById(link.dataset.category);
    if (!target) return;
    event.preventDefault();
    selectCategory(link.dataset.category);
    programmaticUntil = performance.now() + (reduceMotion.matches ? 100 : 1100);
    const top = target.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({top, behavior: reduceMotion.matches ? "instant" : "smooth"});
    history.replaceState(null, "", `#${link.dataset.category}`);
  }));
  function spy() {
    raf = 0;
    if (performance.now() < programmaticUntil) return;
    const cutoff = getOffset() + 85;
    let current = "nihari";
    sections.forEach(section => {
      if (section && section.getBoundingClientRect().top <= cutoff) current = section.id;
    });
    if (current !== active) selectCategory(current);
  }
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(spy); }, {passive:true});
  window.addEventListener("resize", () => { positionPill(links.find(el => el.dataset.category === active)); spy(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => selectCategory(active));
  requestAnimationFrame(() => { selectCategory(active); spy(); });
  window.addEventListener("load", () => { selectCategory(active); spy(); });
});
