// ─────────────────────────────────────────────────────
//  NOVA MOTION — Collection Teaser (Home)
// ─────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import collectionHero from "@/assets/images/collection/collection-hero.jpg";
import { shopHref, isShopExternal } from "@/config/urls";

export default function CollectionTeaser() {
  const shopUrl = shopHref();
  const externalShop = isShopExternal();

  return (
    <section id="collection" className="collection-teaser">
      <div className="collection-teaser-media">
        <img
          src={collectionHero}
          alt="Nova Motion studio collection with gift box, water bottle, and apparel"
        />
        <div className="collection-teaser-shade" aria-hidden />
        <span className="collection-teaser-eyebrow">Studio Collection</span>
      </div>

      <div className="collection-teaser-copy">
        <h2 className="display-heading" style={{ fontSize: "clamp(36px, 4vw, 56px)", marginBottom: 24 }}>
          Curated pieces for<br />
          <em style={{ color: "var(--color-gold)" }}>life in motion.</em>
        </h2>
        <p className="body-text" style={{ marginBottom: 32, maxWidth: 460 }}>
          From ribbed crew socks to studio essentials, every Nova Motion piece is designed with the same timeless attention to detail as our classes.
        </p>

        {externalShop ? (
          <a href={shopUrl} className="btn-primary" style={{ display: "inline-flex" }}>
            Explore the Collection
          </a>
        ) : (
          <Link to="/collection" className="btn-primary" style={{ display: "inline-flex" }}>
            Explore the Collection
          </Link>
        )}
      </div>
    </section>
  );
}
