import { useMemo, useState } from "react";

type Page =
  | "home"
  | "catalogue"
  | "product"
  | "cart"
  | "review"
  | "confirmation"
  | "orders"
  | "order"
  | "invoices"
  | "invoice"
  | "account"
  | "login"
  | "about"
  | "contact"
  | "admin";

type Product = {
  id: number;
  name: string;
  sku: string;
  spec: string;
  price: number;
  moq: number;
  stock: string;
  category: string;
  image: string;
  tone: string;
};

type ProductCategoryTab = "Mobile Folders" | "Batteries";

type WholesaleOrder = {
  id: string;
  createdAt: string;
  businessName: string;
  businessId: string;
  contactName: string;
  phone: string;
  address: string;
  items: { productId: number; name: string; sku: string; price: number; quantity: number }[];
  subtotal: number;
  gst: number;
  total: number;
  notes: string;
  status: "Awaiting Confirmation" | "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Part Paid" | "Paid";
};

const ORDERS_STORAGE_KEY = "dyabros_wholesale_orders_v1";
const readSavedOrders = (): WholesaleOrder[] => {
  try {
    const saved = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) as WholesaleOrder[] : [];
  } catch {
    return [];
  }
};

type CategoryProduct = {
  id: string;
  name: string;
  models: string;
  image: string;
  tone: string;
};

const brand = {
  name: "DYABROS",
  descriptor: "Mobile Displays & Folders",
  phone: "+91 98871 14263",
  email: "business@dyabros.com",
  address: "5/50, 4th Floor, Harnam Singh Dispensary Wali Gali, Karol Bagh, New Delhi 110005",
  gst: "GST-registered wholesale business",
};

const whatsappNumber = "919887114263";
const openWhatsApp = (message: string) => {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

const imagery = {
  hero: "https://images.unsplash.com/photo-1560846389-8c7e1d88eca8?auto=format&fit=crop&w=1600&q=88",
  components:
    "https://images.unsplash.com/photo-1746016805172-86dc8aaf6484?auto=format&fit=crop&w=1200&q=85",
  circuit:
    "https://images.unsplash.com/photo-1651340527836-263c5072968e?auto=format&fit=crop&w=1200&q=85",
  warehouse:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85",
  repair:
    "https://images.unsplash.com/photo-1742989667140-c69adadf556b?auto=format&fit=crop&w=1400&q=85",
};

const products: Product[] = [
  { id: 1, name: "iPhone 11 Display Assembly", sku: "DISP-IP11-01", spec: "Incell • Black • With frame", price: 1850, moq: 10, stock: "Ready stock", category: "Displays", image: imagery.components, tone: "blue" },
  { id: 2, name: "Samsung A15 Display", sku: "SAM-A15-DSP-01", spec: "Service quality • Black", price: 1420, moq: 10, stock: "Ready stock", category: "Displays", image: imagery.circuit, tone: "mint" },
  { id: 3, name: "Oppo A78 Display Folder", sku: "FLD-OPA78-04", spec: "OLED • Black • QC tested", price: 1680, moq: 10, stock: "Ready stock", category: "Folders", image: imagery.components, tone: "sand" },
  { id: 4, name: "Vivo Y21 Display Folder", sku: "FLD-VIY21-02", spec: "Incell • With frame", price: 1320, moq: 10, stock: "Ready stock", category: "Folders", image: imagery.circuit, tone: "lilac" },
  { id: 5, name: "OnePlus Nord CE 3 Display", sku: "DISP-OPNCE3-01", spec: "AMOLED • Black", price: 2450, moq: 10, stock: "Ready stock", category: "Displays", image: imagery.components, tone: "blue" },
  { id: 6, name: "Redmi Note 12 Display Folder", sku: "FLD-RN12-08", spec: "With frame • Black", price: 1520, moq: 10, stock: "Ready stock", category: "Folders", image: imagery.circuit, tone: "mint" },
  { id: 7, name: "Samsung M14 Display Assembly", sku: "DISP-SAM14-01", spec: "Service quality • Black", price: 1480, moq: 10, stock: "Ready stock", category: "Displays", image: imagery.components, tone: "sand" },
  { id: 8, name: "Realme 11x Display Folder", sku: "FLD-R11X-10", spec: "Incell • With frame", price: 1390, moq: 10, stock: "Ready stock", category: "Folders", image: imagery.circuit, tone: "lilac" },
  { id: 9, name: "iPhone 11 Replacement Battery", sku: "BAT-IP11-01", spec: "Replacement battery • QC checked", price: 780, moq: 10, stock: "Ready stock", category: "Batteries", image: imagery.components, tone: "blue" },
  { id: 10, name: "Samsung A15 Replacement Battery", sku: "BAT-SAMA15-01", spec: "Replacement battery • QC checked", price: 620, moq: 10, stock: "Ready stock", category: "Batteries", image: imagery.circuit, tone: "mint" },
  { id: 11, name: "OnePlus Nord CE 3 Battery", sku: "BAT-OPNCE3-01", spec: "Replacement battery • QC checked", price: 890, moq: 10, stock: "Ready stock", category: "Batteries", image: imagery.components, tone: "sand" },
  { id: 12, name: "Redmi Note 12 Battery", sku: "BAT-RN12-01", spec: "Replacement battery • QC checked", price: 590, moq: 10, stock: "Ready stock", category: "Batteries", image: imagery.circuit, tone: "lilac" },
];

const categoryProducts: Record<ProductCategoryTab, CategoryProduct[]> = {
  "Mobile Folders": [
    { id: "folder-oppo-a78", name: "Oppo A78 Display Folder", models: "Compatible with Oppo A78 4G", image: products[2].image, tone: products[2].tone },
    { id: "folder-vivo-y21", name: "Vivo Y21 Display Folder", models: "Compatible with Vivo Y21, Y21s & Y33s", image: products[3].image, tone: products[3].tone },
    { id: "folder-redmi-note-12", name: "Redmi Note 12 Display Folder", models: "Compatible with Redmi Note 12 4G", image: products[5].image, tone: products[5].tone },
    { id: "folder-realme-11x", name: "Realme 11x Display Folder", models: "Compatible with Realme 11x 5G & Narzo 60x", image: products[7].image, tone: products[7].tone },
  ],
  Batteries: [
    { id: "battery-iphone-11", name: "iPhone 11 Replacement Battery", models: "Compatible with Apple iPhone 11", image: imagery.components, tone: "blue" },
    { id: "battery-samsung-a15", name: "Samsung A15 Replacement Battery", models: "Compatible with Samsung Galaxy A15 4G & 5G", image: imagery.circuit, tone: "mint" },
    { id: "battery-oneplus-nord", name: "OnePlus Nord CE 3 Battery", models: "Compatible with OnePlus Nord CE 3 5G", image: imagery.components, tone: "sand" },
    { id: "battery-redmi-note-12", name: "Redmi Note 12 Battery", models: "Compatible with Redmi Note 12 4G & 5G", image: imagery.circuit, tone: "lilac" },
  ],
};

const businessInsights = {
  metrics: [
    ["720+", "Business customers"],
    ["22", "States covered"],
    ["2,500+", "Products supplied"],
    ["4,800+", "Orders fulfilled"],
  ],
  rangeCounts: { displays: 150, folders: 80 },
  customers: [
    "Sharma Mobile Solutions · Delhi",
    "Mobile Hub · Jaipur",
    "RK Telecom · Lucknow",
    "Smart Care · Ahmedabad",
    "Phone Point · Chandigarh",
    "Tech Zone · Indore",
  ],
};

const format = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 7H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    phone: <path d="M6.5 3h3l1.5 5-2 1.5a16 16 0 0 0 5.5 5.5l1.5-2 5 1.5v3A2.5 2.5 0 0 1 18.5 21C10 20.5 3.5 14 3 5.5A2.5 2.5 0 0 1 5.5 3Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M5 20h14" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    shield: <><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    trend: <><path d="m4 16 5-5 4 4 7-8" /><path d="M15 7h5v5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", onClick, icon, type = "button", full = false }: { children: React.ReactNode; variant?: string; onClick?: () => void; icon?: string; type?: "button" | "submit"; full?: boolean }) {
  return <button type={type} className={`btn btn-${variant}${full ? " btn-full" : ""}`} onClick={onClick}>{children}{icon && <Icon name={icon} size={18} />}</button>;
}

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="Dyabros — go to home"><img className="logo-image" src="/brand/dyabros-logo.png" alt="dyabros" /></button>;
}

function Header({ page, go, authenticated, setAuthenticated, cartCount = 0 }: { page: Page; go: (page: Page) => void; authenticated: boolean; setAuthenticated: (value: boolean) => void; cartCount?: number }) {
  const [menu, setMenu] = useState(false);
  const visit = (target: string, fallback: Page = "home") => {
    setMenu(false);
    if (page !== "home") {
      go(fallback);
      window.setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };
  return <>
    <div className="announcement"><span>Wholesale Mobile Displays & Folders</span><span className="announcement-dot" />B2B Orders Only <span className="announcement-right">GST invoicing across India</span></div>
    <header className="header">
      <div className="header-main shell">
        <nav className={`nav nav-left ${menu ? "open" : ""}`}>
          <button className={page === "home" ? "active" : ""} onClick={() => { go("home"); setMenu(false); }}>Home</button>
          <button className={page === "catalogue" ? "active" : ""} onClick={() => { go("catalogue"); setMenu(false); }}>Products</button>
          <button onClick={() => visit("#best-sellers")}>Best Sellers</button>
          <button onClick={() => visit("#how-it-works")}>How It Works</button>
          <button className="mobile-nav-contact" onClick={() => openWhatsApp("Hi DYABROS, I would like to enquire about your displays and folders.")}>Enquire Now</button>
        </nav>
        <div className="header-logo"><Logo onClick={() => go("home")} /></div>
        <div className="header-actions">
          {authenticated ? <button className="icon-action" onClick={() => go("account")}><Icon name="user" /><span><small>Welcome back</small>My Account</span></button> : <button className="login-action" onClick={() => go("login")}>Business Login</button>}
          <button className="header-enquire" onClick={() => openWhatsApp("Hi DYABROS, I would like to enquire about your displays and folders.")}>Enquire Now</button>
          <button className="menu-toggle" onClick={() => setMenu(!menu)}><Icon name="menu" /></button>
        </div>
      </div>
      {authenticated && <nav className="account-shortcuts shell"><button onClick={() => go("cart")}>Cart ({cartCount})</button><button onClick={() => go("orders")}>My Orders</button><button onClick={() => go("invoices")}>Invoices</button><button onClick={() => go("admin")}>Admin Dashboard (demo)</button><button onClick={() => setAuthenticated(false)}>Sign out</button></nav>}
    </header>
  </>;
}

function Qty({ value, min, onChange }: { value: number; min: number; onChange: (value: number) => void }) {
  return <div className="qty"><button onClick={() => onChange(Math.max(min, value - min))} aria-label="Decrease quantity">−</button><span>{value}</span><button onClick={() => onChange(value + min)} aria-label="Increase quantity">+</button></div>;
}

function ProductCard({ product, qty, setQty, add, open, authenticated }: { product: Product; qty: number; setQty: (value: number) => void; add: () => void; open: () => void; authenticated: boolean }) {
  return <article className="product-card">
    <button className={`product-visual tone-${product.tone}`} onClick={open}>
      <img src={product.image} alt="" />
      <span className="product-badge">Wholesale</span>
      <span className="quick-view">Quick view</span>
    </button>
    <div className="product-body">
      <div className="stock"><span />{product.stock}</div>
      <button className="product-title" onClick={open}>{product.name}</button>
      <div className="sku">SKU: {product.sku}</div>
      <div className="spec">{product.spec}</div>
      <div className="product-divider" />
      {authenticated ? <><small>Your Wholesale Price</small>
        <div className="price">{format(product.price)} <span>/ unit</span></div>
        <div className="moq">Minimum order <strong>{product.moq} units</strong></div>
        <div className="card-buy"><Qty value={qty} min={product.moq} onChange={setQty} /><Button onClick={add}>Add to Cart</Button></div></> :
        <div className="public-product-action"><small>Pricing for approved businesses</small><Button onClick={() => open()} icon="arrow" full>View & Enquire</Button></div>}
    </div>
  </article>;
}

function SectionHead({ eyebrow, title, copy, action, onAction }: { eyebrow?: string; title: string; copy?: string; action?: string; onAction?: () => void }) {
  return <div className="section-head"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action && <button className="text-link" onClick={onAction}>{action}<Icon name="arrow" size={17} /></button>}</div>;
}

function DiscoveryCard({ product, label, go }: { product: Product; label: string; go: (page: Page) => void }) {
  return <article className="discovery-card">
    <button className={`discovery-image tone-${product.tone}`} onClick={() => go("product")}><img src={product.image} alt={product.name} /><span>{label}</span></button>
    <div><small>{product.category}</small><h3>{product.name}</h3><p>{product.spec}</p><button onClick={() => openWhatsApp(`Hi DYABROS, I would like to enquire about ${product.name}.`)}>Enquire Now <Icon name="arrow" size={16} /></button></div>
  </article>;
}

function IndiaMap() {
  return <div className="india-map" aria-label="Map showing DYABROS service coverage across India">
    <div className="map-key"><span /> States served</div>
    <svg viewBox="0 0 500 560" role="img" aria-hidden="true">
      <path className="map-shape" d="M183 25 236 42 257 75 298 91 284 123 326 155 303 190 352 214 337 244 366 279 336 305 322 349 287 376 275 418 246 455 231 520 204 478 181 444 153 411 145 368 115 344 128 306 92 274 116 239 103 203 137 183 129 147 163 126 153 87Z" />
      {[[191, 92], [231, 143], [172, 190], [273, 207], [205, 245], [307, 275], [164, 301], [238, 330], [198, 385], [231, 445]].map(([x, y], i) => <g key={i}><circle className="map-pulse" cx={x} cy={y} r="13" /><circle className="map-dot" cx={x} cy={y} r="5" /></g>)}
    </svg>
    <div className="map-origin"><Icon name="pin" size={15} /> Karol Bagh, New Delhi</div>
  </div>;
}

function Home({
  go,
  openCatalogue,
}: {
  go: (page: Page) => void;
  openCatalogue: (category: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryTab>("Mobile Folders");

  return <>
    <main>
      <section className="hero">
        <div className="shell hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Wholesale mobile displays & folders</span>
            <h1>Wholesale Mobile Displays & Folders, <em>Made Simple.</em></h1>
            <p>Collect from our Karol Bagh store or get dispatched anywhere in India. Built for repair shops, retailers and distributors.</p>
            <div className="hero-actions"><Button onClick={() => openWhatsApp("Hi DYABROS, I would like to enquire about your displays and folders.")} icon="arrow">Enquire on WhatsApp</Button><Button variant="outline" onClick={() => go("login")}>Dealer Login</Button></div>
            <div className="trust-line"><span><Icon name="check" size={16} /> Dealer-only pricing</span><span><Icon name="check" size={16} /> Pan-India dispatch</span><span><Icon name="check" size={16} /> Reliable stock</span></div>
          </div>
          <div className="hero-product"><img src={imagery.components} alt="Mobile display assemblies supplied by DYABROS" />
            <div className="hero-note"><span className="hero-note-icon"><Icon name="truck" /></span><div><small>Fast Fulfilment</small><strong>Collect from our Karol Bagh store or get dispatched across India. Orders are confirmed based on stock availability.</strong></div></div>
          </div>
        </div>
      </section>


      <section className="category-section shell section" id="categories">
        <SectionHead
          eyebrow="Explore our range"
          title="Quality parts. Reliable wholesale supply."
          copy="Explore our range of mobile folders and replacement batteries for repair professionals and mobile retailers."
        />

        <div className="category-tabs" role="tablist" aria-label="Product categories">
          {(["Mobile Folders", "Batteries"] as ProductCategoryTab[]).map((category) => (
            <button
              key={category}
              id={`category-tab-${category === "Mobile Folders" ? "folders" : "batteries"}`}
              className={activeCategory === category ? "active" : ""}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls="category-banner"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className="category-banner"
          id="category-banner"
          role="tabpanel"
          aria-labelledby={`category-tab-${activeCategory === "Mobile Folders" ? "folders" : "batteries"}`}
          key={activeCategory}
        >
          <div className="category-banner-image">
            <img
              src={activeCategory === "Mobile Folders" ? imagery.components : imagery.repair}
              alt={
                activeCategory === "Mobile Folders"
                  ? "Mobile replacement components"
                  : "Mobile phone repair components"
              }
            />
          </div>

          <div className="category-banner-content">
            <span className="eyebrow">DYABROS WHOLESALE</span>

            <h2>
              {activeCategory === "Mobile Folders"
                ? "Mobile Folders"
                : "Mobile Batteries"}
            </h2>

            <p>
              {activeCategory === "Mobile Folders"
                ? "Quality replacement folders for popular smartphone models. Reliable supply for repair professionals and mobile retailers."
                : "Replacement batteries for popular smartphone models. Wholesale solutions for repair shops and mobile retailers."}
            </p>

            <Button
              onClick={() =>
                openCatalogue(
                  activeCategory === "Mobile Folders"
                    ? "Folders"
                    : "Batteries"
                )
              }
              icon="arrow"
            >
              Enquire Now
            </Button>
          </div>
        </div>
      </section>


      <section className="bestseller-section section" id="best-sellers">
        <div className="shell"><SectionHead eyebrow="Best-selling products" title="Models businesses order again and again" copy="Fast-moving models our dealers reorder most, backed by consistent stock and direct support." />
          <div className="bestseller-grid">{products.slice(0, 3).map((p, i) => <DiscoveryCard key={p.id} product={p} label={`#${i + 1} Best seller`} go={go} />)}</div>
          <div className="enquiry-strip"><div><strong>Looking for a specific model?</strong><span>Send us your model list on WhatsApp. We will confirm availability and your dealer rate.</span></div><Button onClick={() => openWhatsApp("Hi DYABROS, I would like to enquire about availability for my model list.")} icon="arrow">WhatsApp Our Team</Button></div>
        </div>
      </section>

      <section className="why-section section">
        <div className="shell"><SectionHead eyebrow="Why DYABROS" title="Wholesale supply built around your business" copy="From quality checks to dispatch across India, every part of our service is designed for dealers." />
          <div className="why-grid">{[["shield", "Quality You Can Trust", "Every display and folder is checked before it reaches you, so you can repair with confidence."], ["trend", "Dealer-Only Pricing", "Every approved dealer gets their own rate card, shared privately and never listed publicly."], ["box", "Stock That Keeps Moving", "Deep stock across popular models, so you can fulfil more repairs without waiting."], ["globe", "Pickup or Pan-India Dispatch", "Collect from our Karol Bagh store or get your order dispatched anywhere in India."]].map((x) => <article key={x[1]}><span><Icon name={x[0]} size={25} /></span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
        </div>
      </section>

      <section className="ordering-section section" id="how-it-works">
        <div className="shell"><SectionHead eyebrow="How it works" title="Ordering made simple for dealers" />
          <div className="ordering-grid">{[["01", "Get your Dealer ID", "Message us on WhatsApp. Once approved, you receive your personal Dealer ID and password, and an invite to our private dealer WhatsApp community."], ["02", "Build your list", "Log in, choose the displays and folders you need, and download your order as a PDF."], ["03", "Place your order", "Send your order a day before you need it. We confirm it based on stock availability."], ["04", "Collect or receive", "Pick up from our Karol Bagh store, or we dispatch to you anywhere in India."]].map(([step, title, copy]) => <article key={step}><span>{step}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <div className="ordering-action"><Button onClick={() => openWhatsApp("Hi DYABROS, I would like to become a dealer.")} icon="arrow">Become a Dealer</Button></div>
        </div>
      </section>

      <section className="reach-section section">
        <div className="customer-ticker"><div>{[...businessInsights.customers, ...businessInsights.customers].map((x, i) => <span key={`${x}-${i}`}><Icon name="check" size={14} /> {x}</span>)}</div></div>
        <div className="shell reach-layout"><div><span className="eyebrow">Our growing network</span><h2>Supplying mobile businesses across India</h2><p>From our base in Karol Bagh to repair counters and distributors nationwide, DYABROS keeps trade moving.</p><IndiaMap /></div><div className="metric-grid">{businessInsights.metrics.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div></div>
      </section>
    </main>
  </>;
}


const catalogueDeviceInfo: Record<number, {
  brand: string;
  series: string;
}> = {
  1: { brand: "Apple", series: "iPhone 11" },
  2: { brand: "Samsung", series: "Galaxy A" },
  3: { brand: "OPPO", series: "A Series" },
  4: { brand: "vivo", series: "Y Series" },
  5: { brand: "OnePlus", series: "Nord" },
  6: { brand: "Xiaomi", series: "Redmi Note" },
  7: { brand: "Samsung", series: "Galaxy M" },
  8: { brand: "realme", series: "Number Series" },
};


const deviceCatalogue = [
  { brand: "Apple", series: "iPhone 11", model: "iPhone 11" },
  { brand: "Samsung", series: "Galaxy A", model: "Samsung Galaxy A15" },
  { brand: "Samsung", series: "Galaxy M", model: "Samsung Galaxy M14" },
  { brand: "OPPO", series: "A Series", model: "OPPO A78" },
  { brand: "vivo", series: "Y Series", model: "vivo Y21" },
  { brand: "OnePlus", series: "Nord", model: "OnePlus Nord CE 3" },
  { brand: "Xiaomi", series: "Redmi Note", model: "Redmi Note 12" },
  { brand: "realme", series: "Number Series", model: "realme 11x" },
];


function Catalogue({
  go,
  authenticated,
  addToCart,
}: {
  go: (page: Page) => void;
  authenticated: boolean;
  initialCategory: string;
  addToCart: (product: Product) => void;
}) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryTab>("Mobile Folders");
  const [step, setStep] = useState<1 | 2>(1);
  const [search, setSearch] = useState("");

  const brands = [...new Set(deviceCatalogue.map((d) => d.brand))];

  const series = [
    ...new Set(
      deviceCatalogue
        .filter((d) => d.brand === selectedBrand)
        .map((d) => d.series)
    ),
  ];

  const models = deviceCatalogue.filter(
    (d) =>
      d.brand === selectedBrand &&
      d.series === selectedSeries &&
      d.model.toLowerCase().includes(search.toLowerCase())
  );

  const currentModel = deviceCatalogue.find(
    (d) => d.model === selectedModel
  );

  const selectedFolderParts = categoryProducts["Mobile Folders"].filter(
    (part) =>
      part.models.toLowerCase().includes(selectedModel.toLowerCase()) ||
      part.name.toLowerCase().includes(selectedModel.toLowerCase())
  );

  const selectedBatteryParts = categoryProducts.Batteries.filter(
    (part) =>
      part.models.toLowerCase().includes(selectedModel.toLowerCase()) ||
      part.name.toLowerCase().includes(selectedModel.toLowerCase())
  );

  const visibleParts =
  selectedCategory === "Mobile Folders"
    ? selectedFolderParts
    : selectedBatteryParts;

const hasParts = visibleParts.length > 0;

  const reset = () => {
    setSelectedBrand("");
    setSelectedSeries("");
    setSelectedModel("");
    setSearch("");
    setStep(1);
  };

  const requestPrice = (partName: string) => {
    openWhatsApp(
      `Hi DYABROS, please share wholesale pricing and stock availability for ${partName}, compatible with ${selectedModel}.`
    );
  };

  return (
    <main className="page-bg instafix-catalogue">
      <section className="instafix-hero">
        <div className="shell instafix-hero-inner">
          <div>
            <span className="eyebrow light">DYABROS WHOLESALE</span>
            <h1>
              {step === 1
                ? "Find the right part for your business."
                : `Parts for ${selectedModel}`}
            </h1>
            <p>
              {step === 1
                ? "Select your phone brand, series and model to continue."
                : "Choose a category to explore matching parts and request wholesale pricing."}
            </p>
          </div>

          <img src={imagery.components} alt="Mobile replacement parts" />
        </div>
      </section>

      <div className="shell instafix-content">
        {step === 1 ? (
          <>
            <div className="device-search">
              <Icon name="search" size={20} />
              <input
                value={search}
                placeholder="Search by phone model, e.g. Samsung A15"
                aria-label="Search phone model"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedBrand("");
                  setSelectedSeries("");
                  setSelectedModel("");
                }}
              />
            </div>

            <section className="selector-section">
              <div className="selector-heading">
                <h2>Select Brand</h2>
                <span>Step 1</span>
              </div>

              <div className="brand-selector">
                {brands.map((brandName) => (
                  <button
                    key={brandName}
                    className={`brand-option ${
                      selectedBrand === brandName ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedBrand(brandName);
                      setSelectedSeries("");
                      setSelectedModel("");
                    }}
                  >
                    <span className="brand-monogram">
                      {brandName.slice(0, 2).toUpperCase()}
                    </span>
                    <strong>{brandName}</strong>
                  </button>
                ))}
              </div>
            </section>

            {selectedBrand && (
              <section className="selector-section">
                <div className="selector-heading">
                  <h2>Select Series</h2>
                  <span>Step 2</span>
                </div>

                <div className="series-selector">
                  {series.map((item) => (
                    <button
                      key={item}
                      className={`series-option ${
                        selectedSeries === item ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedSeries(item);
                        setSelectedModel("");
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {selectedSeries && (
              <section className="selector-section">
                <div className="selector-heading">
                  <h2>Select Model</h2>
                  <span>Step 3</span>
                </div>

                <div className="model-selector">
                  {models.map((device) => (
                    <button
                      key={device.model}
                      className={`model-option ${
                        selectedModel === device.model ? "active" : ""
                      }`}
                      onClick={() => setSelectedModel(device.model)}
                    >
                      <img src={imagery.components} alt="" />
                      <strong>{device.model}</strong>
                      <span>
                        {selectedModel === device.model
                          ? "Selected"
                          : "Select model"}
                      </span>
                    </button>
                  ))}

                  {models.length === 0 && (
                    <p>No matching models found.</p>
                  )}
                </div>
              </section>
            )}

            <div className="instafix-bottom-bar">
              <span>Step 1/2</span>
              <button
                disabled={!selectedModel}
                onClick={() => {
                  if (!selectedModel) return;
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Select Parts in Next Step <Icon name="chevron" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="parts-toolbar">
              <button
                className="parts-back"
                onClick={() => setStep(1)}
              >
                ←
              </button>

              <div>
                <span className="eyebrow">SELECTED MODEL</span>
                <h2>{currentModel?.model}</h2>
                <p>
                  {currentModel?.brand} · {currentModel?.series}
                </p>
              </div>

              <button className="change-model" onClick={reset}>
                Change model
              </button>
            </div>

            
<div className="parts-category-tabs">
  {(["Mobile Folders", "Batteries"] as const).map((category) => (
    <button
      key={category}
      className={selectedCategory === category ? "active" : ""}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}
</div>


            <div className="parts-results-heading">
              <div>
                <h2>{selectedCategory}</h2>
                <p>
                  Compatible parts for {selectedModel}
                </p>
              </div>
              <span>{visibleParts.length} items</span>
            </div>

            {hasParts ? (
              <div className="instafix-parts-list">
                {visibleParts.map((part) => (
                      <article
                        className="instafix-part-card"
                        key={part.id}
                      >
                        <div className="instafix-part-copy">
                          <h3>{part.name}</h3>
                          <span className="part-tag">
                            Wholesale product
                          </span>
                          <p>{part.models}</p>
                          <div className="part-features">
                            <span>
                              <Icon name="shield" size={16} />
                              Compatibility to be confirmed
                            </span>
                            <span>
                              <Icon name="box" size={16} />
                              Wholesale enquiry
                            </span>
                          </div>
                        </div>

                        <div className="instafix-part-visual">
                          <img src={part.image} alt={part.name} />
                          {authenticated ? (
                            <Button onClick={() => {
                              const matchingProduct = products.find(
                                (product) => product.name.trim().toLowerCase() === part.name.trim().toLowerCase()
                              );
                              if (matchingProduct) {
                                addToCart(matchingProduct);
                              } else {
                                requestPrice(part.name);
                              }
                            }}>
                              Add to Cart
                            </Button>
                          ) : (
                            <Button onClick={() => requestPrice(part.name)}>Request Wholesale Price</Button>
                          )}
                        </div>
                      </article>
                ))}
              </div>
            ) : (
              <div className="parts-empty">
                <Icon name="box" size={32} />
                <h3>No listed parts in this category</h3>
                <p>
                  Contact DYABROS to confirm availability for{" "}
                  {selectedModel}.
                </p>
                <Button
                  onClick={() =>
                    requestPrice(selectedCategory)
                  }
                >
                  Enquire on WhatsApp
                </Button>
              </div>
            )}

            <div className="parts-footer-actions">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                ← Back to Models
              </Button>
              <Button
                onClick={() =>
                  openWhatsApp(
                    `Hi DYABROS, please share your available ${selectedCategory.toLowerCase()} for ${selectedModel}.`
                  )
                }
              >
                Enquire About This Model
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}




function ProductDetail({ go, qty, setQty, add, authenticated }: { go: (page: Page) => void; qty: number; setQty: (q: number) => void; add: () => void; authenticated: boolean }) {
  const p = products[0];
  const [tab, setTab] = useState("Description");
  return <main className="page-bg"><div className="shell product-page">
    <div className="breadcrumbs">Home <Icon name="chevron" size={14} /> Displays <Icon name="chevron" size={14} /> <strong>{p.name}</strong></div>
    <div className="product-detail">
      <div className="gallery"><div className="thumbnails">{[imagery.components, imagery.circuit, imagery.repair].map((x, i) => <button key={x} className={i === 0 ? "active" : ""}><img src={x} alt="" /></button>)}</div><div className="gallery-main"><img src={p.image} alt={p.name} /><span>QC tested</span></div></div>
      <div className="detail-copy">
        <div className="detail-badges"><span>Wholesale product</span><span>GST applicable</span></div>
        <h1>{p.name}</h1><div className="detail-sku">SKU: {p.sku} <span>•</span> <strong><i /> In Stock — ready to dispatch</strong></div>
        <p className="detail-lead">Premium incell display assembly with high brightness, responsive touch and consistent colour reproduction. Individually QC tested.</p>
        {authenticated ? <><div className="price-panel"><small>Your Wholesale Price</small><div className="detail-price">{format(p.price)} <span>/ unit</span></div><p>Pricing assigned to <strong>Sharma Mobile Solutions</strong></p></div>
          <div className="tier-table"><div><strong>Bulk pricing</strong><span>Price per unit</span></div><div className="active"><span>10–49 units</span><strong>₹1,850</strong></div><div><span>50–99 units</span><strong>₹1,780</strong></div><div><span>100+ units</span><strong>₹1,700</strong></div></div>
          <div className="detail-buy"><div><small>Order quantity</small><Qty value={qty} min={p.moq} onChange={setQty} /></div><Button onClick={add} full>Add to Cart</Button></div></> :
          <div className="trade-gate"><Icon name="shield" size={25} /><div><strong>Wholesale pricing for approved businesses</strong><p>Log in to see your assigned price, quantity terms and live ordering controls.</p></div><Button onClick={() => go("login")}>Business Login</Button><Button variant="outline" onClick={() => go("contact")}>Enquire Now</Button></div>}
        <div className="detail-notes"><span><Icon name="box" />MOQ: <strong>10 units</strong></span><span><Icon name="truck" />Pan-India dispatch</span></div>
      </div>
    </div>
    <div className="tabs"><div className="tab-nav">{["Description", "Specifications", "Compatibility", "Packaging", "Shipping Information"].map((x) => <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>{x}</button>)}</div><div className="tab-content"><h2>{tab}</h2><p>{tab === "Description" ? "A dependable wholesale display assembly selected for professional repair environments. Every unit is checked for touch response, dead pixels, brightness uniformity and connector integrity before packing." : `Complete ${tab.toLowerCase()} information for trade buyers. Contact your relationship manager for model-specific questions or high-volume requirements.`}</p><ul><li>Individually quality checked</li><li>Protective wholesale packaging</li><li>Batch traceability included</li></ul></div></div>
    <div className="detail-reassure"><span><Icon name="check" />Quality checked</span><span><Icon name="box" />Secure bulk packaging</span><span><Icon name="file" />GST invoice supplied</span><span><Icon name="phone" />Business support</span></div>
  </div></main>;
}

function Cart({ cart, quantities, setQuantity, remove, go }: { cart: Product[]; quantities: Record<number, number>; setQuantity: (id: number, qty: number) => void; remove: (id: number) => void; go: (p: Page) => void }) {
  const subtotal = cart.reduce((sum, p) => sum + p.price * (quantities[p.id] || p.moq), 0);
  const gst = Math.round(subtotal * 0.18);
  if (!cart.length) return <main className="page-bg"><div className="shell narrow"><EmptyState title="Your wholesale cart is empty" copy="Browse our catalogue and add products in bulk quantities." action="Shop products" onAction={() => go("catalogue")} /></div></main>;
  return <main className="page-bg"><div className="shell cart-page"><div className="page-title"><span className="eyebrow">Bulk order</span><h1>Your Wholesale Cart</h1><p>{cart.length} products ready for review</p></div>
    <div className="cart-layout"><div className="cart-list"><div className="cart-head"><span>Product</span><span>Unit price</span><span>Quantity</span><span>Subtotal</span></div>{cart.map((p) => <div className="cart-row" key={p.id}><div className="cart-product"><img src={p.image} alt="" /><div><strong>{p.name}</strong><small>SKU: {p.sku}</small><button onClick={() => remove(p.id)}>Remove</button></div></div><div className="cart-cell" data-label="Unit price">{format(p.price)}</div><div className="cart-cell" data-label="Quantity"><Qty value={quantities[p.id] || p.moq} min={p.moq} onChange={(q) => setQuantity(p.id, q)} /><small>MOQ {p.moq}</small></div><div className="cart-cell cart-subtotal" data-label="Subtotal">{format(p.price * (quantities[p.id] || p.moq))}</div></div>)}
      <button className="continue" onClick={() => go("catalogue")}><span>←</span> Continue shopping</button></div>
      <Summary subtotal={subtotal} gst={gst} cta="Review Order" onCta={() => go("review")} />
    </div>
  </div></main>;
}

function Summary({ subtotal, gst, cta, onCta }: { subtotal: number; gst: number; cta: string; onCta: () => void }) {
  return <aside className="summary"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><strong>{format(subtotal)}</strong></div><div className="summary-line"><span>Trade discount</span><strong className="positive">Applied in pricing</strong></div><div className="summary-line"><span>GST (18%)</span><strong>{format(gst)}</strong></div><div className="summary-line"><span>Shipping</span><strong>To be confirmed</strong></div><div className="summary-total"><span>Estimated total<small>Inclusive of GST</small></span><strong>{format(subtotal + gst)}</strong></div><Button onClick={onCta} icon="arrow" full>{cta}</Button><div className="offline-note"><Icon name="file" size={19} /><p><strong>Offline payment only</strong>Payment is handled according to your agreed business terms.</p></div></aside>;
}

function Review({ cart, quantities, go, submitOrder }: { cart: Product[]; quantities: Record<number, number>; go: (p: Page) => void; submitOrder: (notes: string) => WholesaleOrder | null }) {
  const [notes, setNotes] = useState("");
  const subtotal = cart.reduce((sum, p) => sum + p.price * (quantities[p.id] || p.moq), 0);
  const gst = Math.round(subtotal * .18);
  const handleSubmit = () => {
    if (!cart.length) { go("cart"); return; }
    const order = submitOrder(notes);
    if (order) go("confirmation");
  };
  return <main className="page-bg"><div className="shell review-page"><div className="checkout-steps"><span className="done"><b>1</b> Cart</span><i /><span className="active"><b>2</b> Review order</span><i /><span><b>3</b> Confirmation</span></div><div className="page-title"><span className="eyebrow">Final check</span><h1>Review Your Order</h1><p>Confirm your business and order information before submitting.</p></div>
    <div className="review-layout"><div className="review-main"><section className="review-card"><div className="review-card-head"><h2>Business & delivery</h2><button onClick={() => go("account")}>View account</button></div><div className="business-grid"><div><small>Business information</small><strong>Sharma Mobile Solutions</strong><span>Business ID: BUS-DEL-1048</span><span>GST: 07AAGFS2841R1ZP</span></div><div><small>Delivery address</small><strong>Rajesh Sharma</strong><span>18/2 Gaffar Market, Karol Bagh</span><span>New Delhi 110005 • +91 98110 22334</span></div></div></section>
      <section className="review-card"><div className="review-card-head"><h2>Products ({cart.length})</h2><button onClick={() => go("cart")}>Edit cart</button></div>{cart.map((p) => <div className="review-product" key={p.id}><img src={p.image} alt="" /><div><strong>{p.name}</strong><small>{p.sku} • {quantities[p.id] || p.moq} units × {format(p.price)}</small></div><b>{format((quantities[p.id] || p.moq) * p.price)}</b></div>)}</section>
      <section className="review-card"><h2>Order notes</h2><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any special instructions, model preferences or delivery notes..." /></section></div>
      <aside className="summary review-summary"><h2>Order total</h2><div className="summary-line"><span>Subtotal</span><strong>{format(subtotal)}</strong></div><div className="summary-line"><span>GST (18%)</span><strong>{format(gst)}</strong></div><div className="summary-line"><span>Shipping</span><strong>To be confirmed</strong></div><div className="summary-total"><span>Grand total</span><strong>{format(subtotal + gst)}</strong></div><Button onClick={handleSubmit} full>Submit Wholesale Order</Button><p className="submit-note">No online payment gateway. Your order will be recorded for the DYABROS team to review on the admin dashboard.</p></aside>
    </div>
  </div></main>;
}

function Confirmation({ go, order }: { go: (p: Page) => void; order: WholesaleOrder | null }) {
  if (!order) return <main className="page-bg"><div className="confirmation shell"><h1>No recent order found</h1><Button onClick={() => go("catalogue")}>Browse products</Button></div></main>;
  return <main className="page-bg"><div className="confirmation shell"><div className="success-mark"><Icon name="check" size={38} /></div><span className="eyebrow">Order received</span><h1>Order Submitted Successfully</h1><p>Your wholesale order has been recorded. The DYABROS team will confirm availability, dispatch timing and payment arrangements. No online payment has been taken.</p><div className="confirmation-card"><div><small>Order number</small><strong>#{order.id}</strong></div><span className="status amber">{order.status}</span><div className="confirmation-grid"><span><small>Order date</small><strong>{new Date(order.createdAt).toLocaleString("en-IN")}</strong></span><span><small>Items</small><strong>{order.items.length} products</strong></span><span><small>Business</small><strong>{order.businessName}</strong></span><span><small>Order total</small><strong>{format(order.total)}</strong></span></div></div><div className="confirmation-actions"><Button onClick={() => go("orders")}>View Orders</Button><Button variant="outline" onClick={() => go("catalogue")}>Continue Shopping</Button></div><div className="confirmation-help"><Icon name="phone" /><span>Need help? Call your business support team at <strong>{brand.phone}</strong></span></div></div></main>;
}

function AdminDashboard({ orders, go }: { orders: WholesaleOrder[]; go: (p: Page) => void }) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? orders : orders.filter((order) => order.status === filter);
  const money = orders.reduce((sum, order) => sum + order.total, 0);
  return <main className="page-bg"><div className="shell account-page"><div className="account-top"><div><span className="eyebrow">DYABROS internal</span><h1>Admin Order Dashboard</h1><p>Wholesale orders submitted by logged-in business customers.</p></div><Button variant="outline" onClick={() => go("catalogue")}>Open Store</Button></div><div className="invoice-summary"><div><small>Total orders</small><strong>{orders.length}</strong></div><div><small>Awaiting confirmation</small><strong>{orders.filter(o => o.status === "Awaiting Confirmation").length}</strong></div><div><small>Order value</small><strong>{format(money)}</strong></div></div><div className="order-tabs">{["All", "Awaiting Confirmation", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"].map(status => <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}>{status}</button>)}</div>{visible.length ? <div className="order-list">{visible.slice().reverse().map(order => <article className="order-card" key={order.id}><div className="order-top"><div><small>Order number</small><strong>#{order.id}</strong></div><span className="status amber">{order.status}</span></div><div className="order-info"><span><small>Business</small><strong>{order.businessName}</strong></span><span><small>Order date</small><strong>{new Date(order.createdAt).toLocaleString("en-IN")}</strong></span><span><small>Items</small><strong>{order.items.length} products</strong></span><span><small>Total (incl. GST)</small><strong>{format(order.total)}</strong></span><span><small>Payment</small><strong>{order.paymentStatus} · Offline</strong></span></div><div className="review-card"><h3>Order items</h3>{order.items.map(item => <p key={item.productId}>{item.name} ({item.sku}) — {item.quantity} × {format(item.price)}</p>)}<p><strong>Contact:</strong> {order.contactName} · {order.phone}</p><p><strong>Delivery address:</strong> {order.address}</p>{order.notes && <p><strong>Customer notes:</strong> {order.notes}</p>}</div></article>)}</div> : <div className="review-card"><h2>No orders yet</h2><p>Orders submitted through checkout will appear here in this browser.</p><Button onClick={() => go("catalogue")}>Browse store</Button></div>}<p className="submit-note">Demo limitation: these orders are stored in this browser's local storage. To share orders with an admin dashboard on another device, connect checkout to your backend API and database.</p></div></main>;
}

const orderRows = [
  ["ORD-2026-10245", "24 May 2026", "3 products", "₹54,221", "Awaiting Confirmation", "Pending"],
  ["ORD-2026-10198", "16 May 2026", "6 products", "₹82,460", "Dispatched", "Part Paid"],
  ["ORD-2026-10072", "28 Apr 2026", "4 products", "₹36,816", "Delivered", "Paid"],
  ["ORD-2026-09941", "12 Apr 2026", "8 products", "₹1,24,520", "Delivered", "Paid"],
];

function Orders({ go }: { go: (p: Page) => void }) {
  const [tab, setTab] = useState("All");
  return <AccountShell title="My Orders" subtitle="Track, review and reorder your wholesale purchases." active="orders" go={go}><div className="order-tabs">{["All", "New", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"].map((x) => <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>{x}</button>)}</div><div className="order-list">{orderRows.map((o) => <article className="order-card" key={o[0]}><div className="order-top"><div><small>Order number</small><strong>#{o[0]}</strong></div><span className={`status ${o[4] === "Delivered" ? "green" : o[4] === "Dispatched" ? "blue" : "amber"}`}>{o[4]}</span></div><div className="order-info"><span><small>Date</small><strong>{o[1]}</strong></span><span><small>Items</small><strong>{o[2]}</strong></span><span><small>Total</small><strong>{o[3]}</strong></span><span><small>Payment</small><strong>{o[5]}</strong></span><Button variant="outline" onClick={() => go("order")}>View Order</Button></div></article>)}</div></AccountShell>;
}

function OrderDetail({ go }: { go: (p: Page) => void }) {
  return <AccountShell title="Order #ORD-2026-10245" subtitle="Placed on 24 May 2026" active="orders" go={go}><div className="order-detail-head"><span className="status amber">Awaiting Confirmation</span><Button variant="outline" onClick={() => go("invoice")} icon="file">View Invoice</Button></div><section className="tracking"><h2>Order progress</h2><div className="timeline">{["Order Submitted", "Confirmed", "Processing", "Packed", "Dispatched", "Delivered"].map((x, i) => <div key={x} className={i === 0 ? "complete" : ""}><span>{i === 0 ? <Icon name="check" size={15} /> : i + 1}</span><strong>{x}</strong>{i === 0 && <small>24 May, 10:42 AM</small>}</div>)}</div></section><section className="review-card order-products"><h2>Products</h2>{products.slice(0, 3).map((p) => <div className="review-product" key={p.id}><img src={p.image} alt="" /><div><strong>{p.name}</strong><small>SKU: {p.sku} • Qty: {p.moq}</small></div><b>{format(p.price * p.moq)}</b></div>)}</section><div className="order-bottom"><div className="review-card payment-card"><h2>Payment information</h2><div><Icon name="file" /><span><small>Payment method</small><strong>Offline Payment</strong></span><span className="status amber">Pending</span></div><p>Payment will be arranged according to your agreed business terms after order confirmation.</p></div><SummaryMini /></div></AccountShell>;
}

function SummaryMini() {
  return <div className="review-card mini-summary"><h2>Order summary</h2><p><span>Subtotal</span><strong>₹45,950</strong></p><p><span>GST (18%)</span><strong>₹8,271</strong></p><p><span>Shipping</span><strong>To confirm</strong></p><p className="total"><span>Grand total</span><strong>₹54,221</strong></p></div>;
}

function Invoices({ go }: { go: (p: Page) => void }) {
  const rows = [["INV-2026-00891", "ORD-2026-10072", "30 Apr 2026", "₹36,816", "₹36,816", "₹0", "Paid"], ["INV-2026-00840", "ORD-2026-09941", "14 Apr 2026", "₹1,24,520", "₹1,24,520", "₹0", "Paid"], ["INV-2026-00765", "ORD-2026-09782", "22 Mar 2026", "₹78,320", "₹50,000", "₹28,320", "Part Paid"]];
  return <AccountShell title="My Invoices" subtitle="Access GST invoices and track outstanding balances." active="invoices" go={go}><div className="invoice-summary"><div><small>Total invoiced</small><strong>₹2,39,656</strong></div><div><small>Amount paid</small><strong>₹2,11,336</strong></div><div><small>Outstanding</small><strong>₹28,320</strong></div></div><div className="invoice-list">{rows.map((r) => <article className="invoice-row" key={r[0]}><div className="invoice-icon"><Icon name="file" /></div><div><small>Invoice</small><strong>{r[0]}</strong></div><div><small>Order</small><strong>{r[1]}</strong></div><div><small>Date</small><strong>{r[2]}</strong></div><div><small>Amount</small><strong>{r[3]}</strong></div><div><small>Balance</small><strong>{r[5]}</strong></div><span className={`status ${r[6] === "Paid" ? "green" : "amber"}`}>{r[6]}</span><button className="round-action" onClick={() => go("invoice")} aria-label="View invoice"><Icon name="chevron" /></button></article>)}</div></AccountShell>;
}

function InvoiceDetail({ go }: { go: (p: Page) => void }) {
  return <AccountShell title="Invoice INV-2026-00891" subtitle="GST tax invoice • 30 April 2026" active="invoices" go={go}><div className="invoice-actions"><Button variant="outline" icon="download">Download PDF</Button></div><article className="invoice-paper"><div className="invoice-brand"><Logo onClick={() => go("home")} /><div><strong>TAX INVOICE</strong><span>Original for Recipient</span></div></div><div className="invoice-parties"><div><small>Sold by</small><strong>{brand.name}</strong><span>{brand.address}</span><span>{brand.gst}</span><span>{brand.email} • {brand.phone}</span></div><div><small>Billed to</small><strong>Sharma Mobile Solutions</strong><span>18/2 Gaffar Market, Karol Bagh</span><span>New Delhi 110005</span><span>GSTIN: 07AAGFS2841R1ZP</span></div></div><div className="invoice-meta"><span><small>Invoice number</small><strong>INV-2026-00891</strong></span><span><small>Invoice date</small><strong>30 Apr 2026</strong></span><span><small>Order number</small><strong>ORD-2026-10072</strong></span><span><small>Place of supply</small><strong>Delhi (07)</strong></span></div><div className="invoice-table"><div className="invoice-tr invoice-th"><span>Item description</span><span>HSN</span><span>Qty</span><span>Rate</span><span>Taxable</span></div>{products.slice(0, 3).map((p) => <div className="invoice-tr" key={p.id}><span><strong>{p.name}</strong><small>{p.sku}</small></span><span>8517</span><span>{p.moq}</span><span>{format(p.price)}</span><span>{format(p.price * p.moq)}</span></div>)}</div><div className="invoice-total"><div><p>Amount in words</p><strong>Indian Rupees Thirty-Six Thousand Eight Hundred Sixteen Only</strong></div><div><p><span>Taxable amount</span><strong>₹31,200</strong></p><p><span>CGST (9%)</span><strong>₹2,808</strong></p><p><span>SGST (9%)</span><strong>₹2,808</strong></p><p className="grand"><span>Invoice total</span><strong>₹36,816</strong></p></div></div><div className="invoice-footer"><p><strong>Payment status: PAID</strong><span>Payment received via bank transfer.</span></p><p><span>For {brand.name}</span><strong>Authorised Signatory</strong></p></div></article></AccountShell>;
}

function Account({ go }: { go: (p: Page) => void }) {
  return <AccountShell title="My Account" subtitle="Your approved wholesale business profile." active="account" go={go}><div className="account-status"><div className="account-avatar">SM</div><div><h2>Sharma Mobile Solutions</h2><span>Business ID: BUS-DEL-1048</span></div><span className="status green">Active Account</span><div className="tier"><small>Pricing tier</small><strong>Gold Wholesale</strong></div></div><div className="account-grid"><section className="review-card"><h2>Business information</h2><Info label="Legal business name" value="Sharma Mobile Solutions" /><Info label="GST number" value="07AAGFS2841R1ZP" /><Info label="Contact person" value="Rajesh Sharma" /><Info label="Phone" value="+91 98110 22334" /><Info label="Email" value="accounts@sharmamobile.in" /></section><section className="review-card"><h2>Billing address</h2><p className="address">18/2 Gaffar Market<br />Karol Bagh, New Delhi<br />Delhi 110005, India</p><h2 className="shipping-title">Shipping address</h2><p className="address">Warehouse 4, Block B<br />Naraina Industrial Area<br />New Delhi 110028, India</p></section></div><div className="locked-note"><Icon name="file" /><p><strong>Managed by your account team</strong>Pricing, discounts, credit limit and account status are set by our administration team. Contact business support to request a change.</p></div></AccountShell>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>;
}

function AccountShell({ title, subtitle, active, go, children }: { title: string; subtitle: string; active: string; go: (p: Page) => void; children: React.ReactNode }) {
  return <main className="page-bg"><div className="shell account-page"><div className="account-top"><div><span className="eyebrow">Business centre</span><h1>{title}</h1><p>{subtitle}</p></div><div className="account-id"><span>Gold wholesale account</span><strong>Sharma Mobile Solutions</strong></div></div><nav className="account-nav"><button className={active === "orders" ? "active" : ""} onClick={() => go("orders")}><Icon name="box" />My Orders</button><button className={active === "invoices" ? "active" : ""} onClick={() => go("invoices")}><Icon name="file" />My Invoices</button><button className={active === "account" ? "active" : ""} onClick={() => go("account")}><Icon name="user" />My Account</button></nav><div className="account-content">{children}</div></div></main>;
}

function Login({ go, login }: { go: (p: Page) => void; login: () => void }) {
  const submit = (e: React.FormEvent) => { e.preventDefault(); login(); };
  return <main className="login-page"><div className="login-media"><img src={imagery.repair} alt="Professional mobile repair business" /><div className="login-overlay" /><div className="login-quote"><span className="eyebrow light">Dealer access</span><h2>Displays, pricing and supply built around your business.</h2><div><span>2,500+</span> products supplied</div></div></div><div className="login-panel"><button className="back-home" onClick={() => go("home")}>← Back to store</button><div className="login-box"><Logo onClick={() => go("home")} /><span className="eyebrow">Approved dealer access</span><h1>Dealer Login</h1><p>Sign in to access your assigned pricing, orders and invoices.</p><form onSubmit={submit}><label>Dealer ID / Email<input required placeholder="Enter your Dealer ID or email" defaultValue="BUS-DEL-1048" /></label><label>Password<div className="password"><input required type="password" defaultValue="wholesale" /><button type="button">Show</button></div></label><div className="login-options"><label><input type="checkbox" defaultChecked />Remember me</label><button type="button">Forgot Password?</button></div><Button type="submit" full>Login to Dealer Store</Button></form><div className="access-note"><Icon name="check" /><p><strong>Dealer accounts are created by our administration team.</strong>Need access? Contact us to discuss your business requirements.</p></div></div></div></main>;
}

function About({ go }: { go: (p: Page) => void }) {
  return <main><section className="inner-hero"><div className="shell"><span className="eyebrow light">Our business</span><h1>Wholesale supply, built on reliability.</h1><p>Helping repair professionals, retailers and distributors source better mobile displays and folders across India.</p></div></section><section className="shell story section"><div><span className="eyebrow">Our story</span><h2>Trade expertise you can depend on</h2><p>{brand.name} is a specialist wholesale supplier focused on quality displays and folders, responsible sourcing and consistent business support.</p><p>We understand that every delayed display is a delayed repair. That is why our catalogue, quality checks and fulfilment process are designed around speed and confidence.</p><Button onClick={() => go("catalogue")} icon="arrow">Explore Products</Button></div><img src={imagery.warehouse} alt="Wholesale fulfilment warehouse" /></section><section className="values section"><div className="shell"><SectionHead eyebrow="Our standards" title="What guides every order" /><div className="value-grid">{[["check", "Quality first", "Products are checked before they reach your counter."], ["box", "Trade-ready supply", "Depth of stock for repeat and bulk requirements."], ["phone", "Real support", "A business team that knows products and fulfilment."]].map((x) => <div key={x[1]}><span><Icon name={x[0]} /></span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></div></section></main>;
}

function Contact() {
  return <main className="page-bg"><section className="contact shell section"><div className="contact-copy"><span className="eyebrow">Talk to our trade team</span><h1>How can we help your business?</h1><p>For product availability, bulk enquiries or account support, contact our wholesale team.</p><div className="contact-list"><div><Icon name="phone" /><span><small>Call us</small><strong>{brand.phone}</strong><p>Mon–Sat, 10:00 AM–7:00 PM</p></span></div><div><Icon name="mail" /><span><small>Email</small><strong>{brand.email}</strong><p>Replies within one business day</p></span></div><div><Icon name="pin" /><span><small>Wholesale office</small><strong>{brand.address}</strong><p>Visits by prior appointment</p></span></div></div></div><form className="contact-form" onSubmit={(e) => e.preventDefault()}><h2>Send a business enquiry</h2><label>Business name<input placeholder="Your business name" /></label><div><label>Contact person<input placeholder="Full name" /></label><label>Phone number<input placeholder="+91" /></label></div><label>Email address<input type="email" placeholder="name@business.com" /></label><label>How can we help?<textarea placeholder="Tell us about the products or support you need..." /></label><Button full>Send Enquiry</Button></form></section></main>;
}

function EmptyState({ title, copy, action, onAction }: { title: string; copy: string; action: string; onAction: () => void }) {
  return <div className="empty-state"><span><Icon name="box" size={30} /></span><h2>{title}</h2><p>{copy}</p><Button onClick={onAction}>{action}</Button></div>;
}

function Footer({ go, authenticated }: { go: (p: Page) => void; authenticated: boolean }) {
  const columns = [
    ["Company", [["About Us", "about"], ["Contact", "contact"], ["Wholesale Information", "about"]]],
    ["Products", [["Mobile Displays", "catalogue"], ["Mobile Folders", "catalogue"]]],
    ["Dealer", [...([["Dealer Login", "login"], ["Become a Dealer", "whatsapp"], ["Support", "contact"]] as const), ...(authenticated ? ([["My Orders", "orders"], ["Invoices", "invoices"]] as const) : [])]],
  ] as const;
  return <footer className="footer"><div className="shell footer-main"><div className="footer-brand"><Logo onClick={() => go("home")} /><p>Your trusted trade partner for mobile displays, folders and reliable wholesale supply.</p><div><span><Icon name="phone" />{brand.phone}</span><span><Icon name="mail" />{brand.email}</span><span><Icon name="pin" />{brand.address}</span></div></div>{columns.map(([title, links]) => <div className="footer-col" key={title}><h3>{title}</h3>{links.map(([label, page]) => <button key={label} onClick={() => page === "whatsapp" ? openWhatsApp("Hi DYABROS, I would like to become a dealer.") : go(page as Page)}>{label}</button>)}</div>)}</div><div className="shell footer-bottom"><span>© 2026 DYABROS. All rights reserved.</span><span>{brand.gst} • B2B only</span></div></footer>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<WholesaleOrder[]>(() => readSavedOrders());
  const [lastOrder, setLastOrder] = useState<WholesaleOrder | null>(null);

  const [catalogueCategory, setCatalogueCategory] =
    useState("Displays");

  const go = (next: Page) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCatalogue = (category: string) => {
    setCatalogueCategory(category);
    go("catalogue");
  };
  const [cart, setCart] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [toast, setToast] = useState("");
  const setQuantity = (id: number, qty: number) => setQuantities((q) => ({ ...q, [id]: qty }));
  const removeFromCart = (id: number) => setCart(items => items.filter(item => item.id !== id));
  const submitOrder = (notes: string): WholesaleOrder | null => {
    if (!authenticated || cart.length === 0) return null;
    const orderSubtotal = cart.reduce((sum, product) => sum + product.price * (quantities[product.id] || product.moq), 0);
    const orderGst = Math.round(orderSubtotal * 0.18);
    const order: WholesaleOrder = {
      id: `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      businessName: "Sharma Mobile Solutions",
      businessId: "BUS-DEL-1048",
      contactName: "Rajesh Sharma",
      phone: "+91 98110 22334",
      address: "18/2 Gaffar Market, Karol Bagh, New Delhi 110005",
      items: cart.map(product => ({ productId: product.id, name: product.name, sku: product.sku, price: product.price, quantity: quantities[product.id] || product.moq })),
      subtotal: orderSubtotal,
      gst: orderGst,
      total: orderSubtotal + orderGst,
      notes,
      status: "Awaiting Confirmation",
      paymentStatus: "Pending",
    };
    const updated = [...orders, order];
    setOrders(updated);
    setLastOrder(order);
    try { window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated)); } catch { /* Storage may be unavailable in private browsing. */ }
    setCart([]);
    setQuantities({});
    return order;
  };
  const add = (p: Product) => {
    setCart((items) => items.some((x) => x.id === p.id) ? items : [...items, p]);
    setQuantities((q) => ({ ...q, [p.id]: Math.max(q[p.id] || 0, p.moq) }));
    setToast(`${p.name} added to your cart`);
    window.setTimeout(() => setToast(""), 2600);
  };
  const subtotal = cart.reduce((sum, p) => sum + p.price * (quantities[p.id] || p.moq), 0);
  const total = useMemo(() => subtotal + Math.round(subtotal * .18), [subtotal]);

  const shared = { go, quantities, setQuantity, add };
  let content: React.ReactNode;
  switch (page) {
    case "catalogue":
      content = (
        <Catalogue
          {...shared}
          authenticated={authenticated}
          initialCategory={catalogueCategory}
          addToCart={add}
        />
      );
      break;
    case "product": content = <ProductDetail go={go} qty={quantities[1] || 10} setQty={(q) => setQuantity(1, q)} add={() => add(products[0])} authenticated={authenticated} />; break;
    case "cart": content = <Cart cart={cart} quantities={quantities} setQuantity={setQuantity} remove={removeFromCart} go={go} />; break;
    case "review": content = authenticated ? <Review cart={cart} quantities={quantities} go={go} submitOrder={submitOrder} /> : <Login go={go} login={() => { setAuthenticated(true); go("cart"); }} />; break;
    case "confirmation": content = <Confirmation go={go} order={lastOrder} />; break;
    case "orders": content = <Orders go={go} />; break;
    case "order": content = <OrderDetail go={go} />; break;
    case "invoices": content = <Invoices go={go} />; break;
    case "invoice": content = <InvoiceDetail go={go} />; break;
    case "account": content = <Account go={go} />; break;
    case "login": content = <Login go={go} login={() => { setAuthenticated(true); go("home"); }} />; break;
    case "about": content = <About go={go} />; break;
    case "contact": content = <Contact />; break;
    case "admin": content = <AdminDashboard orders={orders} go={go} />; break;
    default:
      content = (
        <Home go={go} openCatalogue={openCatalogue} />
      );
      break;
  }
  if (page === "login") return content;
  return <div className="app"><Header page={page} go={go} authenticated={authenticated} setAuthenticated={setAuthenticated} cartCount={cart.length} />{content}<Footer go={go} authenticated={authenticated} />{toast && <div className="toast"><span><Icon name="check" /></span>{toast}<button onClick={() => go("cart")}>View cart</button></div>}</div>;
}
