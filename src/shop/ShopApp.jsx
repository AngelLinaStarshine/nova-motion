// ─────────────────────────────────────────────────────
//  NOVA MOTION — Mobile Shop App  (/collection)
// ─────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PRODUCTS,
  CASUAL_SOCKS,
  SHOP_HERO_IMAGE,
  SOCK_SIZE_OPTIONS,
  productCartId,
  productDisplayName,
} from "@/data/products";
import { isStudioExternal, studioHref } from "@/config/urls";
import ProductImageZoom from "@/shop/ProductImageZoom";
import "@/styles/shop.css";

export default function ShopApp({ cartCount, onCartOpen, onAddToCart }) {
  const [screen, setScreen]   = useState("home");
  const [product, setProduct] = useState(null);
  const [size, setSize]       = useState(SOCK_SIZE_OPTIONS[0].id);

  const openShop = () => {
    setScreen("shop");
    setProduct(null);
  };

  const openSocks = () => setScreen("socks");

  const openProduct = (p) => {
    setProduct(p);
    setSize(SOCK_SIZE_OPTIONS[0].id);
    setScreen("product");
  };

  const goHome = () => {
    setScreen("home");
    setProduct(null);
  };

  const handleAdd = () => {
    if (!product || product.comingSoon || !size) return;
    onAddToCart({
      ...product,
      cartId: productCartId(product, size),
      selectedSize: size,
      lineName: productDisplayName(product, size),
    });
  };

  const pilatesProduct = PRODUCTS.find((p) => p.sockType === "pilates");

  return (
    <div className="shop-stage">
      <div className="shop-app">
        {screen === "product" && product ? (
          <ProductScreen
            product={product}
            size={size}
            onSize={setSize}
            onBack={() => setScreen("socks")}
            onAdd={handleAdd}
            cartCount={cartCount}
            onCartOpen={onCartOpen}
          />
        ) : screen === "socks" ? (
          <SocksScreen
            onBack={openShop}
            onSelect={openProduct}
            cartCount={cartCount}
            onCartOpen={onCartOpen}
          />
        ) : screen === "shop" ? (
          <ShopScreen
            onHome={goHome}
            onBrowseSocks={openSocks}
            pilatesProduct={pilatesProduct}
            cartCount={cartCount}
            onCartOpen={onCartOpen}
          />
        ) : (
          <HomeScreen
            onHome={goHome}
            cartCount={cartCount}
            onCartOpen={onCartOpen}
          />
        )}

        <ShopBottomNav
          screen={screen}
          cartCount={cartCount}
          onShop={openShop}
          onCart={onCartOpen}
        />
      </div>
    </div>
  );
}

function ShopHeader({ cartCount, onCartOpen, onHome }) {
  return (
    <header className="shop-header">
      <div className="shop-header-row">
        <button type="button" className="shop-logo" onClick={onHome} aria-label="Nova Motion home">
          Nova <em>Motion</em>
        </button>
        <button type="button" className="shop-cart-btn" onClick={onCartOpen} aria-label={`Open cart, ${cartCount} items`}>
          <CartIcon />
          {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}

function HomeScreen({ onHome, cartCount, onCartOpen }) {
  return (
    <>
      <ShopHeader cartCount={cartCount} onCartOpen={onCartOpen} onHome={onHome} />
      <div className="shop-screen shop-screen-home">
        <div className="shop-hero">
          <img src={SHOP_HERO_IMAGE} alt="Nova Motion. Timeless design. Made to move." />
        </div>
      </div>
    </>
  );
}

function ShopScreen({ onHome, onBrowseSocks, pilatesProduct, cartCount, onCartOpen }) {
  return (
    <>
      <ShopHeader cartCount={cartCount} onCartOpen={onCartOpen} onHome={onHome} />
      <div className="shop-screen">
        <div className="shop-body">
          <p className="shop-section-label">Shop by category</p>

          <button type="button" className="shop-category-card" onClick={onBrowseSocks}>
            <div className="shop-category-top">
              <span className="shop-category-name">Casual Socks</span>
              <span className="shop-pill gold">2 styles</span>
            </div>
            <p className="shop-category-desc">
              White and black ribbed crews. Pick your size, or tap the info icon for US shoe sizes.
            </p>
          </button>

          <div className="shop-category-card disabled" aria-disabled="true">
            <div className="shop-category-top">
              <span className="shop-category-name">Pilates Socks</span>
              <span className="shop-pill soon">Coming soon</span>
            </div>
            <p className="shop-category-desc">{pilatesProduct?.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function SocksScreen({ onBack, onSelect, cartCount, onCartOpen }) {
  return (
    <>
      <div className="shop-back-header">
        <button type="button" className="shop-back-btn" onClick={onBack} aria-label="Back to shop">
          ←
        </button>
        <h1 className="shop-back-title">Socks</h1>
        <button type="button" className="shop-cart-btn" onClick={onCartOpen} aria-label="Open cart" style={{ marginLeft: "auto" }}>
          <CartIcon />
          {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
        </button>
      </div>

      <div className="shop-screen">
        <p className="shop-section-label" style={{ padding: "16px 18px 0" }}>
          Casual, In stock
        </p>
        <div className="shop-product-grid">
          {CASUAL_SOCKS.map((p) => (
            <button key={p.id} type="button" className="shop-product-card" onClick={() => onSelect(p)}>
              <div className="shop-product-thumb">
                <img src={p.image} alt={p.colorLabel} />
              </div>
              <div className="shop-product-info">
                <span className="shop-product-type">Casual, {p.colorLabel}</span>
                <span className="shop-product-name">{p.name}</span>
                <span className="shop-product-price">${p.price}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="shop-section-label" style={{ padding: "0 18px" }}>
          Pilates, Coming soon
        </p>
        <div className="shop-product-grid" style={{ paddingTop: 0 }}>
          {PRODUCTS.filter((p) => p.comingSoon).map((p) => (
            <div key={p.id} className="shop-product-card soon" aria-disabled="true">
              <div className="shop-product-thumb">
                <img src={p.image} alt="" style={{ opacity: 0.5 }} />
              </div>
              <div className="shop-product-info">
                <span className="shop-product-type">Pilates</span>
                <span className="shop-product-name">{p.name}</span>
                <span className="shop-pill soon" style={{ alignSelf: "flex-start", marginTop: 6 }}>Coming soon</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ProductScreen({ product, size, onSize, onBack, onAdd, cartCount, onCartOpen }) {
  const gallery = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [openTip, setOpenTip]         = useState(null);
  const [zoomOpen, setZoomOpen]       = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setOpenTip(null);
    setZoomOpen(false);
  }, [product.id]);

  useEffect(() => {
    if (!openTip) return;
    const close = () => setOpenTip(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openTip]);

  const toggleTip = (id, event) => {
    event.stopPropagation();
    setOpenTip((current) => (current === id ? null : id));
  };

  return (
    <>
      <div className="shop-back-header">
        <button type="button" className="shop-back-btn" onClick={onBack} aria-label="Back to socks">
          ←
        </button>
        <h1 className="shop-back-title">{product.colorLabel || product.name}</h1>
        <button type="button" className="shop-cart-btn" onClick={onCartOpen} aria-label="Open cart" style={{ marginLeft: "auto" }}>
          <CartIcon />
          {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
        </button>
      </div>

      <div className="shop-screen">
        <div className="shop-product-hero">
          <button
            type="button"
            className="shop-product-hero-zoom"
            onClick={() => setZoomOpen(true)}
            aria-label="Zoom product image"
          >
            <img
              src={gallery[activeImage]}
              alt={`${productDisplayName(product, size)}. Photo ${activeImage + 1} of ${gallery.length}`}
            />
            <span className="shop-zoom-badge" aria-hidden>
              <ZoomIcon />
            </span>
          </button>
        </div>

        {zoomOpen && (
          <ProductImageZoom
            images={gallery}
            startIndex={activeImage}
            alt={productDisplayName(product, size)}
            onClose={() => setZoomOpen(false)}
            onIndexChange={setActiveImage}
          />
        )}

        {gallery.length > 1 && (
          <div className="shop-gallery-thumbs" role="tablist" aria-label="Product photos">
            {gallery.map((src, i) => (
              <button
                key={`${product.id}-img-${i}`}
                type="button"
                role="tab"
                aria-selected={activeImage === i}
                aria-label={`View photo ${i + 1}`}
                className={`shop-gallery-thumb${activeImage === i ? " active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}

        <div className="shop-product-detail">
          <h2>{product.name}</h2>
          {product.colorLabel && <p className="color-line">{product.colorLabel}</p>}

          {product.details ? (
            <div className="shop-product-copy">
              <p className="shop-product-tagline">{product.details.tagline}</p>
              {product.details.body.map((paragraph) => (
                <p key={paragraph} className="desc">{paragraph}</p>
              ))}
              <ul className="shop-product-highlights">
                {product.details.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="desc">{product.description}</p>
          )}

          {product.comingSoon ? (
            <div className="shop-coming-soon-box">Pilates grip socks are on the way. Check back soon or visit the studio.</div>
          ) : (
            <>
              <p className="shop-size-label">Size</p>
              <div className="shop-size-grid" role="group" aria-label="Choose size">
                {SOCK_SIZE_OPTIONS.map((opt) => (
                  <div key={opt.id} className="shop-size-cell">
                    <button
                      type="button"
                      className={`shop-size-btn${size === opt.id ? " active" : ""}`}
                      onClick={() => {
                        onSize(opt.id);
                        setOpenTip(null);
                      }}
                      aria-pressed={size === opt.id}
                    >
                      <span className="shop-size-btn-label">{opt.label}</span>
                    </button>
                    <button
                      type="button"
                      className={`shop-size-info${openTip === opt.id ? " open" : ""}`}
                      onClick={(e) => toggleTip(opt.id, e)}
                      aria-label={`US shoe size for ${opt.label}`}
                      aria-expanded={openTip === opt.id}
                    >
                      <SizeInfoIcon />
                    </button>
                    {openTip === opt.id && (
                      <div
                        className="shop-size-popover"
                        role="tooltip"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="shop-size-popover-kicker">US shoe</span>
                        <span className="shop-size-popover-value">{opt.shoeRange}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="shop-sticky-bar">
                <span className="shop-sticky-price">${product.price}</span>
                <button type="button" className="shop-add-btn" onClick={onAdd}>
                  Add to cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ShopBottomNav({ screen, cartCount, onShop, onCart }) {
  const shopActive = screen === "shop" || screen === "socks" || screen === "product";

  return (
    <nav className="shop-bottom-nav" aria-label="Shop navigation">
      <button
        type="button"
        className={`shop-nav-item${shopActive ? " active" : ""}`}
        onClick={onShop}
      >
        <span className={`shop-nav-icon-wrap${shopActive ? " is-active" : ""}`}>
          <NavIconShop />
        </span>
        Shop
      </button>
      <button
        type="button"
        className={`shop-nav-item${cartCount > 0 ? " has-cart" : ""}`}
        onClick={onCart}
      >
        <span className={`shop-nav-icon-wrap nav-cart${cartCount > 0 ? " is-bump" : ""}`}>
          <NavIconCart />
          {cartCount > 0 && <span className="shop-nav-cart-dot">{cartCount}</span>}
        </span>
        Cart
      </button>
      {isStudioExternal() ? (
        <a href={studioHref()} className="shop-nav-item">
          <span className="shop-nav-icon-wrap nav-studio">
            <NavIconStudio />
          </span>
          Studio
        </a>
      ) : (
        <Link to="/" className="shop-nav-item">
          <span className="shop-nav-icon-wrap nav-studio">
            <NavIconStudio />
          </span>
          Studio
        </Link>
      )}
    </nav>
  );
}

function NavIconShop() {
  return (
    <svg className="shop-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.2" className="nav-tile" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" className="nav-tile nav-tile-delay" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" className="nav-tile nav-tile-delay-2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" className="nav-tile nav-tile-delay-3" />
    </svg>
  );
}

function NavIconCart() {
  return (
    <svg className="shop-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M5 7h15l-1.5 11H7L5 7Z" strokeLinejoin="round" />
      <path d="M9 7V5.5A2.5 2.5 0 0114 5.5V7" strokeLinecap="round" />
      <circle cx="9.5" cy="19.5" r="1" fill="currentColor" stroke="none" className="nav-wheel" />
      <circle cx="16.5" cy="19.5" r="1" fill="currentColor" stroke="none" className="nav-wheel" />
    </svg>
  );
}

function NavIconStudio() {
  return (
    <svg className="shop-nav-svg nav-svg-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" aria-hidden>
      <path d="M15 4.2a7 7 0 108.2 11.2A9 9 0 1115 4.2Z" strokeLinejoin="round" />
      <path d="M13.5 7.5c-2.2.8-3.7 2.9-3.7 5.2s1.5 4.4 3.7 5.2" strokeLinecap="round" opacity="0.35" className="moon-detail" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" strokeLinecap="round" />
      <path d="M11 8.5v5M8.5 11h5" strokeLinecap="round" />
    </svg>
  );
}

function SizeInfoIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 10.5v5.5" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
