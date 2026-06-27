// Namaste Overseas - Updated Application Logic (SPA Router, Catalog Engine, Inquiry Cart)

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  let activeFilters = {
    search: "",
    categories: [],
    sizes: [],
    materials: []
  };
  
  let currentSort = "id-asc";
  let currentPage = 1;
  const ITEMS_PER_PAGE = 9;
  
  // Cart state loaded from localStorage
  let cart = JSON.parse(localStorage.getItem("namaste_export_cart")) || [];

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const navLinks = document.querySelectorAll(".nav-link");
  const footerLinks = document.querySelectorAll(".footer-link");
  const views = document.querySelectorAll(".app-view");
  const header = document.getElementById("app-header");
  
  // Catalog elements
  const catalogGrid = document.getElementById("products-catalog-grid");
  const paginationContainer = document.getElementById("catalog-pagination");
  const resultsCountText = document.getElementById("results-count-text");
  const searchInput = document.getElementById("search-products-field");
  const sortSelect = document.getElementById("catalog-sort-select");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  
  // Filter Sidebar elements
  const filterCatContainer = document.getElementById("filter-categories-container");
  const filterSizeContainer = document.getElementById("filter-sizes-container");
  const filterMatContainer = document.getElementById("filter-materials-container");

  // Home elements
  const homeCategoriesGrid = document.getElementById("home-categories-grid");
  const featuredProductsGrid = document.getElementById("featured-products-grid");
  
  // Cart & Drawer elements
  const cartTrigger = document.getElementById("cart-trigger-btn");
  const cartCountBadge = document.getElementById("cart-count-badge");
  const floatingRfqTrigger = document.getElementById("floating-rfq-trigger");
  const floatingRfqCount = document.getElementById("floating-rfq-count");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartDrawer = document.getElementById("cart-drawer-panel");
  const cartCloseBtn = document.getElementById("cart-close-btn");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartQuoteForm = document.getElementById("cart-quote-form");
  const cartFooterControls = document.getElementById("cart-footer-controls");
  const cartSuccessMsg = document.getElementById("cart-success-msg");

  // Product Modal elements
  const productDetailModal = document.getElementById("product-detail-modal");
  const productModalCloseBtn = document.getElementById("product-modal-close-btn");
  const productModalImg = document.getElementById("product-modal-img");
  const productModalCategory = document.getElementById("product-modal-category");
  const productModalTitle = document.getElementById("product-modal-title");
  const productModalDesc = document.getElementById("product-modal-description");
  const productModalSize = document.getElementById("product-modal-size");
  const productModalMaterial = document.getElementById("product-modal-material");
  const productModalPackaging = document.getElementById("product-modal-packaging");
  const productModalFeaturesContainer = document.getElementById("product-modal-features-container");
  const productModalAddBtn = document.getElementById("product-modal-add-btn");

  // Certificate Lightbox elements
  const certificateLightboxModal = document.getElementById("certificate-lightbox-modal");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const lightboxImageImg = document.getElementById("lightbox-image-img");

  // Toast Container
  const toastContainer = document.getElementById("toast-container");

  // ==========================================
  // CLIENT-SIDE ROUTER
  // ==========================================
  function navigateToView(targetHash) {
    const cleanHash = targetHash.replace("#", "") || "home";
    
    // Update active nav item
    navLinks.forEach(link => {
      if (link.getAttribute("data-target") === cleanHash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update active view
    views.forEach(view => {
      const viewId = view.getAttribute("id");
      if (viewId === `view-${cleanHash}`) {
        view.style.display = "flex";
        setTimeout(() => {
          view.classList.add("active");
        }, 50);
      } else {
        view.classList.remove("active");
        view.style.display = "none";
      }
    });

    // Scroll container to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Custom view actions
    if (cleanHash === "products") {
      renderCatalog();
    }
  }

  // Handle Hash navigation
  window.addEventListener("hashchange", () => {
    navigateToView(window.location.hash);
  });

  // Handle dynamic triggers
  document.addEventListener("click", (e) => {
    const targetBtn = e.target.closest(".navigate-to-btn");
    if (targetBtn) {
      const targetHash = targetBtn.getAttribute("data-target");
      window.location.hash = targetHash;
    }
  });

  // Setup header link triggers
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      window.location.hash = target;
    });
  });

  // Setup footer links triggers
  footerLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      window.location.hash = target;
    });
  });

  // Header scroll appearance
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // ==========================================
  // HOME PAGE INITIALIZATION
  // ==========================================
  function initHomePage() {
    // 1. Populate Home Page Categories Grid (Strict non-overlapping Product 9 to 14)
    const homeCategoryImages = {
      "Classic Teddy": "assets/products/Product 9.jpg",
      "Safari Friends": "assets/products/Product 10.jpg",
      "Cute Bunnies & Pets": "assets/products/Product 11.jpg",
      "Marine Life": "assets/products/Product 12.jpg",
      "Fantasy & Whimsical": "assets/products/Product 13.jpg",
      "Custom Mascots": "assets/products/Product 14.jpg"
    };

    homeCategoriesGrid.innerHTML = "";
    categories.forEach(cat => {
      const imagePath = homeCategoryImages[cat] || "assets/products/Product 9.jpg";
      
      const catCard = document.createElement("div");
      catCard.className = "category-card";
      catCard.innerHTML = `
        <div class="category-image-wrap">
          <img src="${imagePath}" alt="${cat} Collection">
        </div>
        <h4 class="category-name">${cat}</h4>
      `;
      
      catCard.addEventListener("click", () => {
        // Apply filter and redirect
        activeFilters.categories = [cat];
        window.location.hash = "products";
        syncFilterCheckboxes();
      });
      
      homeCategoriesGrid.appendChild(catCard);
    });

    // 2. Populate Home Page Featured Products (Strictly Product 1.jpg to Product 8.jpg)
    featuredProductsGrid.innerHTML = "";
    const featuredItems = products.filter(p => p.id >= 1 && p.id <= 8);
    
    featuredItems.forEach(item => {
      const card = createProductCardDOM(item);
      featuredProductsGrid.appendChild(card);
    });
  }

  // ==========================================
  // CATALOG ENGINE (FILTERS, SEARCH, SORT, PAGINATION)
  // ==========================================
  
  // Dynamically generate filter options in the sidebar
  function initFilterSidebar() {
    // Generate Categories
    filterCatContainer.innerHTML = "";
    categories.forEach(cat => {
      const label = document.createElement("label");
      label.className = "checkbox-option";
      label.innerHTML = `
        <input type="checkbox" name="category" value="${cat}">
        <span class="checkbox-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>${cat}</span>
      `;
      
      label.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          activeFilters.categories.push(cat);
        } else {
          activeFilters.categories = activeFilters.categories.filter(c => c !== cat);
        }
        currentPage = 1;
        renderCatalog();
      });
      
      filterCatContainer.appendChild(label);
    });

    // Generate Sizes
    filterSizeContainer.innerHTML = "";
    sizes.forEach(sz => {
      const label = document.createElement("label");
      label.className = "checkbox-option";
      label.innerHTML = `
        <input type="checkbox" name="size" value="${sz}">
        <span class="checkbox-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>${sz.split(" ")[0]}</span>
      `;
      
      label.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          activeFilters.sizes.push(sz);
        } else {
          activeFilters.sizes = activeFilters.sizes.filter(s => s !== sz);
        }
        currentPage = 1;
        renderCatalog();
      });
      
      filterSizeContainer.appendChild(label);
    });

    // Generate Materials
    filterMatContainer.innerHTML = "";
    materials.forEach(mat => {
      const label = document.createElement("label");
      label.className = "checkbox-option";
      label.innerHTML = `
        <input type="checkbox" name="material" value="${mat}">
        <span class="checkbox-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>${mat}</span>
      `;
      
      label.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          activeFilters.materials.push(mat);
        } else {
          activeFilters.materials = activeFilters.materials.filter(m => m !== mat);
        }
        currentPage = 1;
        renderCatalog();
      });
      
      filterMatContainer.appendChild(label);
    });
  }

  // Synchronize checkboxes if filters are modified programmatically
  function syncFilterCheckboxes() {
    // Sync Categories
    const catCheckboxes = filterCatContainer.querySelectorAll("input[type='checkbox']");
    catCheckboxes.forEach(cb => {
      cb.checked = activeFilters.categories.includes(cb.value);
    });
    
    // Sync Sizes
    const sizeCheckboxes = filterSizeContainer.querySelectorAll("input[type='checkbox']");
    sizeCheckboxes.forEach(cb => {
      cb.checked = activeFilters.sizes.includes(cb.value);
    });
    
    // Sync Materials
    const matCheckboxes = filterMatContainer.querySelectorAll("input[type='checkbox']");
    matCheckboxes.forEach(cb => {
      cb.checked = activeFilters.materials.includes(cb.value);
    });
  }

  // Create single product card element in DOM
  function createProductCardDOM(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.category}</span>
      </div>
      <div class="product-info">
        <h4 class="product-title">${product.name}</h4>
        <div class="product-meta-specs">
          <span class="spec-pill">${product.size.split(" ")[0]}</span>
          <span class="spec-pill">${product.material}</span>
        </div>
        <div class="product-footer-row">
          <div class="product-moq">MOQ: <span>${product.moq}</span></div>
          <button class="product-action-btn add-to-cart-quick" aria-label="Add to inquiry list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Click event on Image triggers detail modal
    card.querySelector(".product-img-wrap").addEventListener("click", () => {
      openProductModal(product);
    });

    // Click event on title triggers detail modal
    card.querySelector(".product-title").addEventListener("click", () => {
      openProductModal(product);
    });

    // Add to Quote List trigger
    card.querySelector(".add-to-cart-quick").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCartItem(product.id);
    });

    return card;
  }

  // Search input change listener
  searchInput.addEventListener("input", (e) => {
    activeFilters.search = e.target.value.trim().toLowerCase();
    currentPage = 1;
    renderCatalog();
  });

  // Sort dropdown change listener
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  // Reset all filters in sidebar
  clearFiltersBtn.addEventListener("click", () => {
    activeFilters = {
      search: "",
      categories: [],
      sizes: [],
      materials: []
    };
    searchInput.value = "";
    currentPage = 1;
    syncFilterCheckboxes();
    renderCatalog();
    showToast("Filters Reset Successful");
  });

  // Main rendering routine for the products page catalog
  function renderCatalog() {
    // 1. Apply Filtering
    let filtered = products.filter(product => {
      // Search check
      if (activeFilters.search) {
        const titleMatch = product.name.toLowerCase().includes(activeFilters.search);
        const descMatch = product.description.toLowerCase().includes(activeFilters.search);
        if (!titleMatch && !descMatch) return false;
      }
      
      // Category check
      if (activeFilters.categories.length > 0) {
        if (!activeFilters.categories.includes(product.category)) return false;
      }

      // Size check
      if (activeFilters.sizes.length > 0) {
        if (!activeFilters.sizes.includes(product.size)) return false;
      }

      // Material check
      if (activeFilters.materials.length > 0) {
        if (!activeFilters.materials.includes(product.material)) return false;
      }

      return true;
    });

    // 2. Apply Sorting
    if (currentSort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Default: ID ascending
      filtered.sort((a, b) => a.id - b.id);
    }

    // Update result count header card
    resultsCountText.innerHTML = `Showing <span>${filtered.length}</span> of <span>53</span> products`;

    // 3. Apply Pagination math
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    
    // Bounds check
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    const paginatedItems = filtered.slice(startIndex, endIndex);

    // 4. Render Grid Content
    catalogGrid.innerHTML = "";
    if (paginatedItems.length === 0) {
      catalogGrid.innerHTML = `
        <div class="no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h4 class="no-results-title">No matching products found</h4>
          <p class="no-results-desc">Try widening your search queries or resetting the sidebar filter checkboxes.</p>
        </div>
      `;
    } else {
      paginatedItems.forEach(product => {
        const card = createProductCardDOM(product);
        catalogGrid.appendChild(card);
      });
    }

    // 5. Render Pagination controls
    renderPagination(totalPages);
  }

  // Populate page buttons in UI
  function renderPagination(totalPages) {
    paginationContainer.innerHTML = "";
    if (totalPages <= 1) return;

    // Previous Page Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.innerHTML = `&lt;`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      currentPage--;
      renderCatalog();
      window.scrollTo({ top: 200, behavior: "smooth" });
    });
    paginationContainer.appendChild(prevBtn);

    // Number Buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.className = `page-btn ${currentPage === i ? "active" : ""}`;
      pageBtn.innerText = i;
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderCatalog();
        window.scrollTo({ top: 200, behavior: "smooth" });
      });
      paginationContainer.appendChild(pageBtn);
    }

    // Next Page Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.innerHTML = `&gt;`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      currentPage++;
      renderCatalog();
      window.scrollTo({ top: 200, behavior: "smooth" });
    });
    paginationContainer.appendChild(nextBtn);
  }

  // ==========================================
  // INQUIRY CART ("QUOTE LIST") DRAWER
  // ==========================================
  
  // Open / Close Drawer
  const openCartDrawer = () => {
    cartOverlay.classList.add("active");
    cartDrawer.classList.add("active");
    renderCartItems();
  };

  cartTrigger.addEventListener("click", openCartDrawer);
  floatingRfqTrigger.addEventListener("click", openCartDrawer);

  const closeCartDrawer = () => {
    cartOverlay.classList.remove("active");
    cartDrawer.classList.remove("active");
    // Reset forms success
    cartQuoteForm.style.display = "flex";
    cartSuccessMsg.style.display = "none";
  };

  cartCloseBtn.addEventListener("click", closeCartDrawer);
  cartOverlay.addEventListener("click", closeCartDrawer);

  // Add or Remove Item from Cart list
  function toggleCartItem(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    if (cart.includes(productId)) {
      cart = cart.filter(id => id !== productId);
      showToast(`Removed: ${p.name}`);
    } else {
      cart.push(productId);
      showToast(`Added to Quote: ${p.name}`);
    }

    // Sync state
    localStorage.setItem("namaste_export_cart", JSON.stringify(cart));
    updateCartCountBadge();
    renderCartItems();
  }

  // Update badge number in header capsule and floating FAB
  function updateCartCountBadge() {
    cartCountBadge.innerText = cart.length;
    floatingRfqCount.innerText = cart.length;
    
    if (cart.length > 0) {
      cartCountBadge.style.display = "flex";
    } else {
      cartCountBadge.style.display = "none";
    }
  }

  // Render items inside the cart drawer
  function renderCartItems() {
    cartItemsList.innerHTML = "";
    
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h4 class="cart-empty-title">Your Quote list is empty</h4>
          <p class="cart-empty-desc">Navigate to our catalog to select plush toy categories for custom export quotations.</p>
        </div>
      `;
      cartQuoteForm.style.display = "none";
    } else {
      cartQuoteForm.style.display = "flex";
      
      cart.forEach(itemId => {
        const item = products.find(prod => prod.id === itemId);
        if (!item) return;

        const cartItemDOM = document.createElement("div");
        cartItemDOM.className = "cart-item";
        cartItemDOM.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h5 class="cart-item-name">${item.name}</h5>
            <span class="cart-item-spec">${item.size.split(" ")[0]} &bull; ${item.material}</span>
          </div>
          <button class="cart-item-remove" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        `;

        cartItemDOM.querySelector(".cart-item-remove").addEventListener("click", () => {
          toggleCartItem(itemId);
        });

        cartItemsList.appendChild(cartItemDOM);
      });
    }
  }

  // Handle Cart Submission Form
  cartQuoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Verify cart size
    if (cart.length === 0) return;

    // Collect values
    const inquiryData = {
      name: document.getElementById("cart-name-field").value,
      company: document.getElementById("cart-company-field").value,
      country: document.getElementById("cart-country-field").value,
      notes: document.getElementById("cart-notes-field").value,
      items: cart.map(id => {
        const p = products.find(prod => prod.id === id);
        return p ? p.name : id;
      })
    };

    console.log("Submitting bulk inquiry dataset: ", inquiryData);

    // Animate Success State
    cartQuoteForm.style.display = "none";
    cartSuccessMsg.style.display = "flex";

    // Clear cart state
    cart = [];
    localStorage.removeItem("namaste_export_cart");
    updateCartCountBadge();

    showToast("Bulk Inquiry Logged Successfully!");
  });

  // ==========================================
  // PRODUCT DETAILS MODAL VIEW
  // ==========================================
  function openProductModal(product) {
    productModalImg.src = product.image;
    productModalImg.alt = product.name;
    productModalCategory.innerText = product.category;
    productModalTitle.innerText = product.name;
    productModalDesc.innerText = product.description;
    productModalSize.innerText = product.size;
    productModalMaterial.innerText = product.material;
    productModalPackaging.innerText = product.packaging;
    
    // Build Safety Features list
    productModalFeaturesContainer.innerHTML = "";
    product.features.forEach(feat => {
      const pill = document.createElement("span");
      pill.className = "feature-tag-pill";
      pill.innerText = feat;
      productModalFeaturesContainer.appendChild(pill);
    });

    // Update Action button text based on cart presence
    updateModalAddBtnState(product.id);

    // Setup action listener on click
    productModalAddBtn.onclick = () => {
      toggleCartItem(product.id);
      updateModalAddBtnState(product.id);
    };

    productDetailModal.classList.add("active");
  }

  function updateModalAddBtnState(productId) {
    if (cart.includes(productId)) {
      productModalAddBtn.innerText = "Remove from Inquiry List";
      productModalAddBtn.classList.remove("btn-primary");
      productModalAddBtn.classList.add("btn-secondary");
    } else {
      productModalAddBtn.innerText = "Add to Quote Request";
      productModalAddBtn.classList.remove("btn-secondary");
      productModalAddBtn.classList.add("btn-primary");
    }
  }

  const closeProductModal = () => {
    productDetailModal.classList.remove("active");
  };

  productModalCloseBtn.addEventListener("click", closeProductModal);
  productDetailModal.addEventListener("click", (e) => {
    if (e.target === productDetailModal) closeProductModal();
  });

  // ==========================================
  // CERTIFICATIONS LIGHTBOX IMAGE ZOOM
  // ==========================================
  
  // Bind click event to cert image containers
  document.addEventListener("click", (e) => {
    const certFrame = e.target.closest(".zoom-certificate");
    if (certFrame) {
      const src = certFrame.getAttribute("data-src");
      if (src) {
        lightboxImageImg.src = src;
        certificateLightboxModal.classList.add("active");
      }
    }
  });

  const closeLightbox = () => {
    certificateLightboxModal.classList.remove("active");
  };

  lightboxCloseBtn.addEventListener("click", closeLightbox);
  certificateLightboxModal.addEventListener("click", (e) => {
    if (e.target === certificateLightboxModal) closeLightbox();
  });

  // ==========================================
  // DIRECT INQUIRY FORM HANDLERS (VALIDATION)
  // ==========================================
  
  // 1. Home Quick Contact Form
  const homeContactForm = document.getElementById("home-quick-contact-form");
  const homeSuccessAlert = document.getElementById("home-success-msg");
  
  if (homeContactForm) {
    homeContactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Perform simple validation check
      const name = document.getElementById("home-name").value;
      const company = document.getElementById("home-company").value;
      const country = document.getElementById("home-country").value;
      const quantity = document.getElementById("home-quantity").value;
      const message = document.getElementById("home-message").value;

      if (!name || !company || !country || !quantity || !message) {
        showToast("Error: Please fill in all fields.");
        return;
      }

      console.log("Logged Home Quick Export Inquiry: ", { name, company, country, quantity, message });

      homeContactForm.style.display = "none";
      homeSuccessAlert.style.display = "flex";
      showToast("Export Inquiry Submitted!");
    });
  }

  // 2. Main Contact Form
  const mainContactForm = document.getElementById("main-contact-form");
  const mainSuccessAlert = document.getElementById("main-success-msg");

  if (mainContactForm) {
    mainContactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect data
      const name = document.getElementById("contact-name").value;
      const company = document.getElementById("contact-company").value;
      const country = document.getElementById("contact-country").value;
      const quantity = document.getElementById("contact-quantity").value;
      const message = document.getElementById("contact-message").value;

      if (!name || !company || !country || !quantity || !message) {
        showToast("Error: Please complete all form inputs.");
        return;
      }

      console.log("Logged Dedicated Export Desk Inquiry: ", { name, company, country, quantity, message });

      mainContactForm.style.display = "none";
      mainSuccessAlert.style.display = "flex";
      showToast("FOB Estimate Request Received");
    });
  }

  // ==========================================
  // DYNAMIC TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2700);
  }

  // ==========================================
  // RUN INITIALIZATION MODULES
  // ==========================================
  initHomePage();
  initFilterSidebar();
  updateCartCountBadge();

  // Setup routing entry point based on URL Hash
  const currentHash = window.location.hash || "#home";
  navigateToView(currentHash);
});
