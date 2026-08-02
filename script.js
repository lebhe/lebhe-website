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
