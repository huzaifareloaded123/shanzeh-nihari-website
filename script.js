
/* SHANZEH NIHARI — ORDERING SYSTEM */

document.addEventListener("DOMContentLoaded", () => {
  const DELIVERY_FEE = 200;

  const menu = [
    {
      id: 1,
      name: "Single Nihari",
      price: 500,
      description: "Traditional nihari with rich aromatic gravy.",
      badge: "CLASSIC"
    },
    {
      id: 2,
      name: "Single Nihari Fry",
      price: 600,
      description: "Our classic nihari with a delicious fried finish.",
      badge: "POPULAR"
    },
    {
      id: 3,
      name: "Double Nihari",
      price: 1050,
      description: "A generous serving of authentic nihari.",
      badge: "HEARTY"
    },
    {
      id: 4,
      name: "Nalli Nihari",
      price: 800,
      description: "Rich nihari with flavourful nalli.",
      badge: "SPECIAL"
    },
    {
      id: 5,
      name: "Maghaz Nihari",
      price: 800,
      description: "A traditional Karachi specialty.",
      badge: "SPECIAL"
    },
    {
      id: 6,
      name: "Desi Ghee Tarka",
      price: 150,
      description: "Extra desi ghee tarka for a richer flavour.",
      badge: "ADD-ON"
    },
    {
      id: 7,
      name: "Single Special Nihari",
      price: 1350,
      description: "Our premium special nihari serving.",
      badge: "PREMIUM"
    },
    {
      id: 8,
      name: "Special Nihari Thaal",
      price: 1850,
      description: "Our signature nihari thaal experience.",
      badge: "SIGNATURE"
    }
  ];

  // Temporary food image.
  // Replace with original restaurant photographs later.
  const foodImage =
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";

  const cart = new Map();

  const $ = (selector) => document.querySelector(selector);

  const menuGrid = $("#menuGrid");
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
    menuGrid.innerHTML = menu.map((item) => `
      <article class="food-card">
        <div class="food-image">
          <img
            src="${foodImage}"
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
  }

  // CART
  function updateCart() {
    const count = getItemCount();
    const subtotal = getSubtotal();

    $("#cartCount").textContent = count;
    $("#cartTitleCount").textContent = `(${count})`;
    $("#cartSubtotal").textContent = money(subtotal);
    $("#checkoutSubtotal").textContent = money(subtotal);
    $("#checkoutTotal").textContent = money(
      count ? subtotal + DELIVERY_FEE : 0
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
  menuGrid.addEventListener("click", (event) => {
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

    if (!name || !phone || !address) {
      $("#checkoutMessage").textContent =
        "Please complete all required fields.";
      return;
    }

    $("#checkoutMessage").textContent =
      "Demo only: your details were checked, but no order was sent. Online ordering will be activated later.";
  });

  // Scroll animations are initialized once after the menu is rendered.

  // COPYRIGHT YEAR
  $("#year").textContent = new Date().getFullYear();

  renderMenu();
  updateCart();

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
    });
  
    // Keep the page behind the modal from scrolling
    if (!modal.classList.contains("is-hidden")) {
      document.body.style.overflow = "hidden";
    }
  
    modal.classList.remove("is-hidden");
    changeType(orderType);
  });

/* ==========================================
   SHANZEH NIHARI — SINGLE SCROLL ANIMATION ENGINE
   All menu cards are already rendered by the first DOMContentLoaded
   listener before this listener runs.
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = Array.from(document.querySelectorAll(
    ".section-heading, .food-card, .story-inner, .delivery-inner, .footer-top"
  ));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  // Only animate content below the first viewport, so nothing flashes
  // or disappears when the popup is dismissed.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });

  elements.forEach(el => {
    const card = el.classList.contains("food-card");
    if (card) {
      const index = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty("--reveal-delay", `${(index % 4) * 100}ms`);
    }
    // Never hide items already in the visible viewport.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      el.classList.add("is-visible");
    } else {
      el.classList.add("cinematic-reveal");
      observer.observe(el);
    }
  });
});

/* Popup testing mode remains unchanged: show on every refresh. */
