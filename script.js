const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('siteNav');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 30);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  header.classList.toggle('menu-active', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    header.classList.remove('menu-active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
const customCursor = document.querySelector('.custom-cursor');

const hasFinePointer = window.matchMedia(
  '(hover: hover) and (pointer: fine)'
).matches;

if (customCursor && hasFinePointer) {
  document.addEventListener(
    'pointermove',
    (event) => {
      customCursor.style.left = `${event.clientX}px`;
      customCursor.style.top = `${event.clientY}px`;
      customCursor.classList.add('is-visible');
    },
    { passive: true }
  );

  document
    .querySelectorAll('a, button, .set-card, .image-card')
    .forEach((element) => {
      element.addEventListener('pointerenter', () => {
        customCursor.classList.add('is-hovering');
      });

      element.addEventListener('pointerleave', () => {
        customCursor.classList.remove('is-hovering');
      });
    });

  document.documentElement.addEventListener('mouseleave', () => {
    customCursor.classList.remove('is-visible');
    customCursor.classList.remove('is-hovering');
  });
}
/* LEBHE shopping bag */

(() => {
  const siteHeader = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuToggle");
  const mobileNavigation = document.getElementById("siteNav");

  if (!siteHeader || !menuButton) {
    return;
  }

  const cartTrigger = document.createElement("button");

  cartTrigger.className = "cart-trigger";
  cartTrigger.type = "button";
  cartTrigger.setAttribute("aria-expanded", "false");
  cartTrigger.setAttribute("aria-controls", "cartDrawer");

  cartTrigger.innerHTML = `
    <span class="cart-trigger__label">Bag</span>
    <span
      class="cart-trigger__count"
      data-cart-count
      aria-label="0 products in bag"
    >
      0
    </span>
  `;

  siteHeader.insertBefore(cartTrigger, menuButton);

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div
        class="cart-overlay"
        data-cart-overlay
        aria-hidden="true"
      ></div>

      <aside
        class="cart-drawer"
        id="cartDrawer"
        data-cart-drawer
        role="dialog"
        aria-modal="true"
        aria-labelledby="cartDrawerTitle"
        aria-hidden="true"
      >
        <div class="cart-drawer__header">
          <h2
            class="cart-drawer__title"
            id="cartDrawerTitle"
          >
            Your bag
          </h2>

          <button
            class="cart-close"
            type="button"
            data-cart-close
            aria-label="Close shopping bag"
          >
            ×
          </button>
        </div>

        <div
          class="cart-items"
          data-cart-items
          aria-live="polite"
        >
          <div class="cart-empty">
            <p>Your bag is empty.</p>
            <span>
              Select a colour and size to add a LEBHE piece.
            </span>
          </div>
        </div>

        <div class="cart-drawer__footer">
          <div class="cart-subtotal">
            <span>Subtotal</span>
            <span data-cart-subtotal>€0</span>
          </div>

          <button
            class="cart-checkout-button"
            type="button"
            data-cart-checkout
            disabled
          >
            Checkout
          </button>

          <p class="cart-checkout-note">
            Shipping and taxes calculated at checkout.
          </p>
        </div>
      </aside>

      <div
        class="cart-toast"
        data-cart-toast
        role="status"
        aria-live="polite"
      >
        Added to bag
      </div>
    `
  );

  const cartDrawer =
    document.querySelector("[data-cart-drawer]");

  const cartOverlay =
    document.querySelector("[data-cart-overlay]");

  const cartClose =
    document.querySelector("[data-cart-close]");

  const checkoutButton =
    document.querySelector("[data-cart-checkout]");
  const cartCount =
    document.querySelector("[data-cart-count]");

  const cartItemsContainer =
    document.querySelector("[data-cart-items]");

  const cartSubtotal =
    document.querySelector("[data-cart-subtotal]");

  const cartToast =
    document.querySelector("[data-cart-toast]");

  const CART_STORAGE_KEY = "lebhe-shopping-bag";

  let cartItems = [];
  let toastTimer;

  try {
    cartItems =
      JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY)
      ) || [];
  } catch (error) {
    cartItems = [];
  }

  function formatPrice(value) {
    return `€${Number(value).toFixed(0)}`;
  }

  function saveCart() {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      /*
        The bag will still work during
        the current visit.
      */
    }
  }

  function showCartToast(message) {
    cartToast.textContent = message;
    cartToast.classList.add("is-visible");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      cartToast.classList.remove("is-visible");
    }, 1800);
  }

  function renderCart() {
    const totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const subtotal = cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    cartCount.textContent = totalQuantity;

    cartCount.setAttribute(
      "aria-label",
      `${totalQuantity} products in bag`
    );

    cartSubtotal.textContent =
      formatPrice(subtotal);

    checkoutButton.disabled =
      cartItems.length === 0;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p>Your bag is empty.</p>
          <span>
            Select a colour and size to add a LEBHE piece.
          </span>
        </div>
      `;

      return;
    }

    cartItemsContainer.innerHTML = cartItems
      .map(
        (item, index) => `
          <article class="cart-item">
            <img
              class="cart-item__image"
              src="${item.image}"
              alt="${item.name} — ${item.color}"
            >

            <div class="cart-item__details">
              <h3 class="cart-item__name">
                ${item.name}
              </h3>

              <p class="cart-item__variant">
                ${item.color}<br>
                Size: ${item.size}
              </p>

              <p class="cart-item__price">
                ${formatPrice(item.price)}
              </p>

              <div class="cart-item__actions">
                <div
                  class="cart-quantity"
                  aria-label="Quantity controls"
                >
                  <button
                    type="button"
                    data-cart-action="decrease"
                    data-cart-index="${index}"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>${item.quantity}</span>

                  <button
                    type="button"
                    data-cart-action="increase"
                    data-cart-index="${index}"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  class="cart-remove"
                  type="button"
                  data-cart-action="remove"
                  data-cart-index="${index}"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  document
    .querySelectorAll("[data-add-to-cart]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;

        const product =
          button.closest("[data-product]");

        if (!product) return;

        const selectedOption =
          product.querySelector(
            "[data-product-color].is-active, [data-cap-option].is-active"
          );

        const selectedSize =
          product.querySelector(
            ".size-button.is-active"
          );

        const selectedColorText =
          product.querySelector(
            "[data-selected-color], [data-selected-cap]"
          );

        const productImage =
          product.querySelector(
            "[data-product-image], [data-cap-image]"
          );

        const name =
          product.dataset.productName;

        const price =
          Number(product.dataset.productPrice);

        const color =
          selectedColorText?.textContent.trim() ||
          selectedOption?.dataset.label ||
          "Selected colour";

        const size =
          selectedSize?.dataset.size ||
          selectedSize?.textContent.trim();

        const image =
          selectedOption?.dataset.frontImage ||
          selectedOption?.dataset.image ||
          productImage?.getAttribute("src") ||
          "";

        if (!name || !price || !size) return;

        const existingItem = cartItems.find(
          (item) =>
            item.name === name &&
            item.color === color &&
            item.size === size
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({
            name,
            price,
            color,
            size,
            image,
            quantity: 1
          });
        }

        saveCart();
        renderCart();
        openCart();
        showCartToast("Added to bag");
      });
    });

  cartItemsContainer.addEventListener(
    "click",
    (event) => {
      const actionButton =
        event.target.closest(
          "[data-cart-action]"
        );

      if (!actionButton) return;

      const itemIndex =
        Number(actionButton.dataset.cartIndex);

      const action =
        actionButton.dataset.cartAction;

      const item = cartItems[itemIndex];

      if (!item) return;

      if (action === "increase") {
        item.quantity += 1;
      }

      if (action === "decrease") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          cartItems.splice(itemIndex, 1);
        }
      }

      if (action === "remove") {
        cartItems.splice(itemIndex, 1);
      }

      saveCart();
      renderCart();
    }
  );

  checkoutButton.addEventListener(
    "click",
    () => {
      if (cartItems.length === 0) return;

      showCartToast(
        "Checkout will be connected to Shopify"
      );
    }
  );

  renderCart();
  function openCart() {
    mobileNavigation?.classList.remove("open");
    siteHeader.classList.remove("menu-active");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute("aria-expanded", "false");

    document.body.classList.add("cart-open");

    cartTrigger.setAttribute("aria-expanded", "true");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartOverlay.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      cartClose.focus();
    }, 420);
  }

  function closeCart(restoreFocus = true) {
    document.body.classList.remove("cart-open");

    cartTrigger.setAttribute("aria-expanded", "false");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartOverlay.setAttribute("aria-hidden", "true");

    if (restoreFocus) {
      cartTrigger.focus();
    }
  }

  cartTrigger.addEventListener("click", openCart);
  cartClose.addEventListener("click", () => closeCart());
  cartOverlay.addEventListener("click", () => closeCart());

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("cart-open")
    ) {
      closeCart();
    }
  });

  if (customCursor && hasFinePointer) {
    [cartTrigger, cartClose, checkoutButton].forEach(
      (element) => {
        element.addEventListener("pointerenter", () => {
          customCursor.classList.add("is-hovering");
        });

        element.addEventListener("pointerleave", () => {
          customCursor.classList.remove("is-hovering");
        });
      }
    );
  }
})();
