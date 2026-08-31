import { StrictMode, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useCart } from "@/hooks/useCart";
import ShopApp from "@/shop/ShopApp";
import CartPanel from "@/components/CartPanel";
import Toast from "@/components/Toast";
import "@/styles/globals.css";

function ShopRoot() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, duration = 2800) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      cart.add(product);
      const label = product.lineName ?? product.name;
      showToast(`✓  ${label} added to cart`);
    },
    [cart, showToast]
  );

  const handleCheckout = useCallback(() => {
    cart.clear();
    setCartOpen(false);
    showToast("✓  Order placed! Confirmation sent to your email.");
  }, [cart, showToast]);

  return (
    <>
      <ShopApp
        cartCount={cart.count}
        onCartOpen={() => setCartOpen(true)}
        onAddToCart={handleAddToCart}
      />

      {cartOpen && (
        <CartPanel
          items={cart.items}
          total={cart.total}
          onClose={() => setCartOpen(false)}
          onUpdate={(id, d) => cart.updateQty(id, d)}
          onRemove={(id) => cart.remove(id)}
          onCheckout={handleCheckout}
        />
      )}

      <Toast message={toast} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ShopRoot />
  </StrictMode>
);
