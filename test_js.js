
  (function() {
    'use strict';

    /* =============================================
       PRODUCT DATA
    ============================================= */
    var PRODUCTS = [
      {
        id: 1,
        name: 'Crochet Flower Bouquet',
        price: 1000,
        origPrice: 1299,
        category: 'Flowers',
        rating: 4.8,
        reviews: 124,
        timeToCreate: '6–8 hours',
        material: 'Premium cotton yarn',
        image: './assets/crochet-flower-bouquet.jpg',
        badge: 'Bestseller',
        discount: 23,
        description: 'A beautiful handmade crochet flower bouquet that never wilts. Perfect for birthdays, anniversaries, room decoration, or gifting someone special. Each flower is individually crafted with premium cotton yarn, shaped to perfection and bound together into a stunning eternal bouquet.'
      },
      {
        id: 2,
        name: 'Crochet Teddy Bear',
        price: 2000,
        origPrice: 2499,
        category: 'Plushies',
        rating: 4.9,
        reviews: 98,
        timeToCreate: '10–12 hours',
        material: 'Soft cotton yarn',
        image: './assets/crochet-teddy-bear.jpg',
        badge: 'Most Loved',
        discount: 20,
        description: 'A soft handmade crochet teddy bear crafted with premium yarn. A perfect gift for birthdays, anniversaries, baby showers, or anyone who loves cute handmade gifts. Made entirely by hand with love, each bear is a one-of-a-kind treasure.'
      },
      {
        id: 3,
        name: 'Crochet Bunny Plushie',
        price: 1500,
        origPrice: 1899,
        category: 'Plushies',
        rating: 4.7,
        reviews: 87,
        timeToCreate: '8–10 hours',
        material: 'Premium soft yarn',
        image: './assets/crochet-bunny-plushie.jpg',
        badge: 'New Arrival',
        discount: 21,
        description: 'A charming handmade crochet bunny plushie designed to bring warmth and cuteness to any room. With its sweet loppy ears and soft texture, this bunny is a hug waiting to happen — a wonderful keepsake and gift for all ages.'
      }
    ];

    var SPECS_COMMON = [
      { k: 'Handmade', v: 'Yes — 100%' },
      { k: 'Customization', v: 'Available on request' },
      { k: 'Care', v: 'Hand wash recommended' },
      { k: 'Made In', v: 'India 🇮🇳' },
      { k: 'Packaging', v: 'Eco-friendly packaging' }
    ];

    /* =============================================
       STATE
    ============================================= */
    var S = {
      cart: [],
      wishlist: [],
      search: '',
      category: 'All',
      sort: 'featured',
      checkoutOk: false,
      detailQty: 1
    };

    function loadState() {
      try {
        var c = localStorage.getItem('lavsie_cart');
        var w = localStorage.getItem('lavsie_wishlist');
        if (c) S.cart = JSON.parse(c);
        if (w) S.wishlist = JSON.parse(w);
      } catch(e) {}
    }
    function saveState() {
      try {
        localStorage.setItem('lavsie_cart', JSON.stringify(S.cart));
        localStorage.setItem('lavsie_wishlist', JSON.stringify(S.wishlist));
      } catch(e) {}
    }

    /* =============================================
       CART OPS
    ============================================= */
    function addToCart(id, qty) {
      qty = qty || 1;
      var ex = S.cart.find(function(i){ return i.id===id; });
      if (ex) { ex.qty += qty; }
      else {
        var p = PRODUCTS.find(function(p){ return p.id===id; });
        if (p) S.cart.push({ id:p.id, name:p.name, price:p.price, image:p.image, qty:qty });
      }
      saveState(); updateCounters();
    }
    function removeFromCart(id) {
      S.cart = S.cart.filter(function(i){ return i.id!==id; });
      saveState(); updateCounters();
    }
    function changeCartQty(id, delta) {
      var item = S.cart.find(function(i){ return i.id===id; });
      if (item) { item.qty = Math.max(1, item.qty+delta); saveState(); }
    }
    function cartTotal()  { return S.cart.reduce(function(s,i){ return s+i.price*i.qty; },0); }
    function cartCount()  { return S.cart.reduce(function(s,i){ return s+i.qty; },0); }
    function inCart(id)   { return S.cart.some(function(i){ return i.id===id; }); }

    /* =============================================
       WISHLIST OPS
    ============================================= */
    function inWL(id) { return S.wishlist.some(function(i){ return i.id===id; }); }
    function toggleWL(id) {
      var idx = S.wishlist.findIndex(function(i){ return i.id===id; });
      if (idx>-1) {
        S.wishlist.splice(idx,1); saveState(); updateCounters(); return 'removed';
      } else {
        var p = PRODUCTS.find(function(p){ return p.id===id; });
        if (p) S.wishlist.push({ id:p.id, name:p.name, price:p.price, image:p.image, rating:p.rating, reviews:p.reviews });
        saveState(); updateCounters(); return 'added';
      }
    }

    /* =============================================
       FILTER / SORT
    ============================================= */
    function filteredProducts() {
      var list = PRODUCTS.slice();
      if (S.search.trim()) {
        var q = S.search.toLowerCase().trim();
        list = list.filter(function(p){
          return p.name.toLowerCase().includes(q) ||
                 p.description.toLowerCase().includes(q) ||
                 p.category.toLowerCase().includes(q) ||
                 p.material.toLowerCase().includes(q);
        });
      }
      if (S.category !== 'All') {
        list = list.filter(function(p){ return p.category===S.category; });
      }
      if (S.sort==='price-asc')  list.sort(function(a,b){ return a.price-b.price; });
      if (S.sort==='price-desc') list.sort(function(a,b){ return b.price-a.price; });
      if (S.sort==='rating')     list.sort(function(a,b){ return b.rating-a.rating; });
      return list;
    }

    /* =============================================
       UTILS
    ============================================= */
    function fp(n) { return '₹'+n.toLocaleString('en-IN'); }

    function stars(rating) {
      var full = Math.floor(rating), empty = 5-Math.ceil(rating);
      var h = '<div class="stars">';
      for(var i=0;i<Math.ceil(rating);i++) h += '<span class="star">★</span>';
      for(var j=0;j<empty;j++) h += '<span class="star e">★</span>';
      return h+'</div>';
    }

    function imgTag(src, alt, cls) {
      cls = cls || '';
      return '<img src="'+src+'" alt="'+alt+'" class="'+cls+'" onerror="this.parentElement.innerHTML=\'<div class=\\\"img-placeholder\\\">🧶</div>\'">';
    }

    /* =============================================
       TOAST
    ============================================= */
    function toast(msg, type) {
      type = type || 'default';
      var wrap = document.getElementById('toast-wrap');
      if (!wrap) return;
      var el = document.createElement('div');
      el.className = 'toast '+(type==='success'?'ok':type==='info'?'info':type==='error'?'err':'');
      el.textContent = msg;
      wrap.appendChild(el);
      setTimeout(function(){
        el.classList.add('out');
        setTimeout(function(){ el.remove(); }, 320);
      }, 3000);
    }

    /* =============================================
       UPDATE COUNTERS (surgical DOM)
    ============================================= */
    function updateCounters() {
      var cc = cartCount(), wc = S.wishlist.length;
      document.querySelectorAll('.cart-cnt').forEach(function(el){
        el.textContent = cc;
        el.style.display = cc>0?'inline-flex':'none';
      });
      document.querySelectorAll('.wl-cnt').forEach(function(el){
        el.textContent = wc;
        el.style.display = wc>0?'inline-flex':'none';
      });
    }

    /* =============================================
       RENDER: NAVBAR
    ============================================= */
    function rNavbar() {
      var cc = cartCount(), wc = S.wishlist.length;
      return '<nav class="navbar" role="navigation" aria-label="Main navigation">'+
        '<div class="navbar-inner">'+
          '<div class="navbar-brand" data-nav="home" role="button" tabindex="0" aria-label="Lavsie Loops — go to home">'+
            '<span class="navbar-brand-icon" aria-hidden="true">🧶</span>'+
            '<span>Lavsie Loops</span>'+
          '</div>'+
          '<ul class="nav-links" role="list">'+
            '<li><button data-nav="home">Home</button></li>'+
            '<li><button data-nav="shop">Shop</button></li>'+
            '<li><button data-nav="about">About</button></li>'+
            '<li><button data-nav="wishlist" aria-label="Wishlist">❤️ Wishlist '+
              '<span class="nav-badge wl-cnt" style="display:'+(wc>0?'inline-flex':'none')+'">'+wc+'</span></button></li>'+
            '<li><button data-nav="cart" aria-label="Cart">🛒 Cart '+
              '<span class="nav-badge cart-cnt" style="display:'+(cc>0?'inline-flex':'none')+'">'+cc+'</span></button></li>'+
          '</ul>'+
          '<button class="hamburger" id="hbg" aria-label="Toggle menu" aria-expanded="false">'+
            '<span></span><span></span><span></span>'+
          '</button>'+
        '</div>'+
      '</nav>'+
      '<div class="mob-menu" id="mob-menu" role="dialog" aria-label="Mobile navigation">'+
        '<ul>'+
          '<li><button data-nav="home" data-mob>🏠 Home</button></li>'+
          '<li><button data-nav="shop" data-mob>🛍️ Shop</button></li>'+
          '<li><button data-nav="about" data-mob>💕 About</button></li>'+
          '<li><button data-nav="wishlist" data-mob>❤️ Wishlist '+
            '<span class="nav-badge wl-cnt" style="display:'+(wc>0?'inline-flex':'none')+'">'+wc+'</span></button></li>'+
          '<li><button data-nav="cart" data-mob>🛒 Cart '+
            '<span class="nav-badge cart-cnt" style="display:'+(cc>0?'inline-flex':'none')+'">'+cc+'</span></button></li>'+
        '</ul>'+
      '</div>';
    }

    /* =============================================
       RENDER: HERO
    ============================================= */
    function rHero() {
      return '<section class="hero" id="hero" aria-label="Hero section">'+
        '<span class="deco" aria-hidden="true">🧶</span>'+
        '<span class="deco" aria-hidden="true">🌸</span>'+
        '<span class="deco" aria-hidden="true">✨</span>'+
        '<span class="deco" aria-hidden="true">💕</span>'+
        '<span class="deco" aria-hidden="true">🎀</span>'+
        '<span class="deco" aria-hidden="true">🌷</span>'+
        '<div class="hero-content">'+
          '<div class="hero-badge">🧶 Handmade in India with love</div>'+
          '<h1>Welcome to <span class="grad">Lavsie Loops</span> 💕</h1>'+
          '<p class="hero-sub">Handmade crochet pieces, made with love and a little bit of magic.</p>'+
          '<div class="hero-btns">'+
            '<button class="btn btn-primary btn-lg" data-nav="shop">Explore Our Collection 🛍️</button>'+
            '<button class="btn btn-secondary btn-lg" data-nav="wishlist">My Wishlist ❤️</button>'+
          '</div>'+
          '<div class="hero-stats">'+
            '<div class="hero-stat"><div class="hero-stat-n">309+</div><div class="hero-stat-l">Happy Customers</div></div>'+
            '<div class="hero-stat"><div class="hero-stat-n">100%</div><div class="hero-stat-l">Handmade</div></div>'+
            '<div class="hero-stat"><div class="hero-stat-n">4.8★</div><div class="hero-stat-l">Average Rating</div></div>'+
            '<div class="hero-stat"><div class="hero-stat-n">3+</div><div class="hero-stat-l">Unique Products</div></div>'+
          '</div>'+
        '</div>'+
      '</section>';
    }

    /* =============================================
       RENDER: SHOP CONTROLS
    ============================================= */
    function rShopControls() {
      return '<div class="shop-controls" id="shop-controls">'+
        '<div class="shop-ctrl-wrap">'+
          '<div class="search-row">'+
            '<div class="search-box">'+
              '<span class="search-icon" aria-hidden="true">🔍</span>'+
              '<input id="search-input" class="search-input" type="search" placeholder="Search handmade crochet products..." '+
                'value="'+escHtml(S.search)+'" autocomplete="off" aria-label="Search products">'+
              '<button class="search-clear'+(S.search?' vis':'')+'" id="search-clear" aria-label="Clear search">✕</button>'+
            '</div>'+
          '</div>'+
          '<div class="filter-row">'+
            '<div class="pills" role="group" aria-label="Filter by category">'+
              ['All','Flowers','Plushies','Gifts'].map(function(c){
                return '<button class="pill'+(S.category===c?' active':'')+'" data-cat="'+c+'">'+c+'</button>';
              }).join('')+
            '</div>'+
            '<select class="sort-select" id="sort-select" aria-label="Sort products">'+
              '<option value="featured"'+(S.sort==='featured'?' selected':'')+'>✦ Featured</option>'+
              '<option value="price-asc"'+(S.sort==='price-asc'?' selected':'')+'>Price: Low to High</option>'+
              '<option value="price-desc"'+(S.sort==='price-desc'?' selected':'')+'>Price: High to Low</option>'+
              '<option value="rating"'+(S.sort==='rating'?' selected':'')+'>Top Rated</option>'+
            '</select>'+
          '</div>'+
        '</div>'+
      '</div>';
    }

    /* =============================================
       RENDER: PRODUCT CARD
    ============================================= */
    function rProductCard(p) {
      var wished = inWL(p.id);
      return '<article class="p-card" aria-label="'+escHtml(p.name)+'">'+
        (p.badge?'<div class="p-card-badge">'+p.badge+'</div>':'')+
        '<button class="p-card-wish'+(wished?' on':'')+'" data-action="toggle-wl" data-id="'+p.id+'" '+
          'aria-label="'+(wished?'Remove from':'Add to')+' wishlist" aria-pressed="'+(wished?'true':'false')+'">'+
          (wished?'❤️':'🤍')+
        '</button>'+
        '<div class="p-img-wrap">'+
          imgTag(p.image, p.name)+
        '</div>'+
        '<div class="p-card-body">'+
          '<div class="p-card-cat">'+p.category+'</div>'+
          '<div class="p-card-name">'+escHtml(p.name)+'</div>'+
          '<div class="p-card-desc">'+escHtml(p.description)+'</div>'+
          '<div class="stars-row">'+
            stars(p.rating)+
            '<span class="rat-val">'+p.rating+'</span>'+
            '<span class="rat-cnt">('+p.reviews+' reviews)</span>'+
          '</div>'+
          '<div class="price-row">'+
            '<span class="price-main">'+fp(p.price)+'</span>'+
            '<span class="price-orig">'+fp(p.origPrice)+'</span>'+
            '<span class="price-off">'+p.discount+'% off</span>'+
          '</div>'+
          '<div class="p-card-actions">'+
            '<button class="btn btn-primary btn-full" data-action="add-cart" data-id="'+p.id+'" '+
              'aria-label="Add '+escHtml(p.name)+' to cart">🛒 Add to Cart</button>'+
            '<div class="p-card-acts-row">'+
              '<button class="btn btn-secondary" style="flex:1" data-action="view-detail" data-id="'+p.id+'" '+
                'aria-label="View details for '+escHtml(p.name)+'">View Details</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</article>';
    }

    /* =============================================
       RENDER: PRODUCT GRID CONTENT
    ============================================= */
    function rProductGridContent() {
      var list = filteredProducts();
      if (!list.length) {
        return '<div class="empty-state">'+
          '<span class="empty-icon">🧶</span>'+
          '<div class="empty-title">No crochet treasures found!</div>'+
          '<p class="empty-txt">Try a different search term or browse all products.</p>'+
          '<button class="btn btn-primary" data-action="clear-search">View All Products</button>'+
        '</div>';
      }
      return '<div class="products-grid">'+list.map(rProductCard).join('')+'</div>';
    }

    /* =============================================
       RENDER: PRODUCTS SECTION
    ============================================= */
    function rProductsSection() {
      return '<section class="products-section" id="shop" aria-label="Products">'+
        '<div class="container">'+
          '<div class="products-header">'+
            '<h2 class="section-title">Our Handmade Collection 🧶</h2>'+
            '<p class="section-subtitle">Little pieces of happiness, carefully handmade just for you.</p>'+
          '</div>'+
          '<div id="products-grid-wrap">'+rProductGridContent()+'</div>'+
        '</div>'+
      '</section>';
    }

    /* =============================================
       RENDER: FEATURES
    ============================================= */
    function rFeatures() {
      var items = [
        { icon:'🧶', title:'100% Handmade', desc:'Every piece is carefully crafted by hand, one stitch at a time.' },
        { icon:'💗', title:'Made With Love', desc:'Created with patience, passion and meticulous attention to detail.' },
        { icon:'🌱', title:'Eco-Friendly Packaging', desc:'Thoughtful packaging that is gentle on our planet.' },
        { icon:'🎁', title:'Perfect for Gifting', desc:'Unique handmade gifts for birthdays, anniversaries and special moments.' }
      ];
      return '<section class="feat-section" id="features" aria-label="Why Lavsie Loops">'+
        '<div class="container">'+
          '<div class="text-center">'+
            '<h2 class="section-title">Why Lavsie Loops? 💕</h2>'+
            '<p class="section-subtitle">We put heart into every loop, every knot, every creation.</p>'+
          '</div>'+
          '<div class="feat-grid">'+
            items.map(function(f){
              return '<div class="feat-card">'+
                '<span class="feat-icon" aria-hidden="true">'+f.icon+'</span>'+
                '<div class="feat-title">'+f.title+'</div>'+
                '<div class="feat-desc">'+f.desc+'</div>'+
              '</div>';
            }).join('')+
          '</div>'+
        '</div>'+
      '</section>';
    }

    /* =============================================
       RENDER: ABOUT
    ============================================= */
    function rAbout() {
      return '<section class="about-section" id="about" aria-label="About Lavsie Loops">'+
        '<div class="about-inner">'+
          '<div class="about-text">'+
            '<div class="about-label">🧶 Our Story</div>'+
            '<h2 class="about-title">Made With Love 🧶</h2>'+
            '<p class="about-body">Every Lavsie Loops creation is carefully handmade, one loop at a time. We believe handmade gifts carry a little more warmth, personality, and love. From the first loop to the final finishing touch, each piece is made entirely by hand — because some things should never be rushed.</p>'+
            '<p class="about-body">Whether it's a cozy plushie, a timeless bouquet, or a heartfelt keepsake — every Lavsie Loops piece is a little story, waiting to be gifted.</p>'+
            '<button class="btn btn-primary btn-lg" data-nav="shop">Shop Our Collection 🧶</button>'+
            '<div class="about-stats">'+
              '<div class="about-stat"><div class="about-stat-n">309+</div><div class="about-stat-l">Happy Customers</div></div>'+
              '<div class="about-stat"><div class="about-stat-n">100%</div><div class="about-stat-l">Handmade</div></div>'+
              '<div class="about-stat"><div class="about-stat-n">4.8★</div><div class="about-stat-l">Avg Rating</div></div>'+
            '</div>'+
          '</div>'+
          '<div class="about-visual">'+
            '<div class="about-card">'+
              '<span class="about-card-icon" aria-hidden="true">🌸</span>'+
              '<p class="about-card-q">"Every loop is a little act of love. We make things that last — not just in looks, but in the feelings they carry."</p>'+
              '<p class="about-card-who">— The Lavsie Loops Studio</p>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</section>';
    }

    /* =============================================
       RENDER: REVIEWS
    ============================================= */
    function rReviews() {
      var revs = [
        { text:'"Absolutely adorable! The crochet bag was even cuter than I expected. The quality is amazing — you can tell it was made with so much care."', name:'Priya S.', color:'#D6547E', letter:'P' },
        { text:'"The lavender crochet work is so beautiful and looks amazing on my shelf. I get compliments every time someone visits!"', name:'Ananya R.', color:'#9B87E8', letter:'A' },
        { text:'"Such a thoughtful handmade gift. I ordered the pink bag for my best friend\'s birthday and she absolutely loved it. 10/10!"', name:'Sneha M.', color:'#E8A46B', letter:'S' }
      ];
      return '<section class="reviews-section" aria-label="Customer reviews">'+
        '<div class="container">'+
          '<div class="text-center">'+
            '<h2 class="section-title">Loved by Crochet Lovers 💕</h2>'+
            '<p class="section-subtitle">Real words from our wonderful customers.</p>'+
          '</div>'+
          '<div class="reviews-grid">'+
            revs.map(function(r){
              return '<article class="rev-card">'+
                '<div class="rev-stars">'+
                  '<span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>'+
                '</div>'+
                '<p class="rev-text">'+r.text+'</p>'+
                '<div class="rev-author">'+
                  '<div class="rev-avatar" style="background:'+r.color+'">'+r.letter+'</div>'+
                  '<div><div class="rev-name">'+r.name+'</div><div class="rev-verified">✓ Verified Purchase</div></div>'+
                '</div>'+
              '</article>';
            }).join('')+
          '</div>'+
        '</div>'+
      '</section>';
    }

    /* =============================================
       RENDER: CTA
    ============================================= */
    function rCTA() {
      return '<section class="cta-section" aria-label="Call to action">'+
        '<div class="cta-content">'+
          '<h2 class="cta-title">Find Your Perfect Handmade Treasure 💕</h2>'+
          '<p class="cta-sub">Made one loop at a time, just for you.</p>'+
          '<button class="btn-cta" data-nav="shop">Shop Now 🧶</button>'+
        '</div>'+
      '</section>';
    }

    /* =============================================
       RENDER: FOOTER
    ============================================= */
    function rFooter() {
      return '<footer class="footer" role="contentinfo">'+
        '<div class="footer-grid">'+
          '<div>'+
            '<div class="ft-brand"><span aria-hidden="true">🧶</span>Lavsie Loops</div>'+
            '<p class="ft-tag">"Handmade with Love, Looped with Care."<br>Every piece carries a little extra warmth — handcrafted in India, made just for you.</p>'+
            '<div class="ft-social">'+
              '<a href="#" class="social-a" aria-label="Instagram" title="Instagram">📸</a>'+
              '<a href="#" class="social-a" aria-label="Facebook" title="Facebook">📘</a>'+
              '<a href="#" class="social-a" aria-label="Pinterest" title="Pinterest">📌</a>'+
            '</div>'+
          '</div>'+
          '<div>'+
            '<div class="ft-col-t">Quick Links</div>'+
            '<ul class="ft-links">'+
              '<li><button data-nav="home">Home</button></li>'+
              '<li><button data-nav="shop">Shop</button></li>'+
              '<li><button data-nav="about">About Us</button></li>'+
              '<li><button data-nav="wishlist">Wishlist</button></li>'+
              '<li><button data-nav="cart">Cart</button></li>'+
              '<li><button>Contact</button></li>'+
            '</ul>'+
          '</div>'+
          '<div>'+
            '<div class="ft-col-t">Categories</div>'+
            '<ul class="ft-links">'+
              '<li><button data-cat-nav="All">All Products</button></li>'+
              '<li><button data-cat-nav="Flowers">Flowers</button></li>'+
              '<li><button data-cat-nav="Plushies">Plushies</button></li>'+
              '<li><button data-cat-nav="Gifts">Gifts</button></li>'+
            '</ul>'+
          '</div>'+
          '<div>'+
            '<div class="ft-col-t">Contact Us</div>'+
            '<div class="ft-contact-item"><span>📧</span><a href="mailto:hello@lavsieloops.com">hello@lavsieloops.com</a></div>'+
            '<div class="ft-contact-item"><span>📍</span><span>Made in India 🇮🇳</span></div>'+
            '<div class="ft-contact-item"><span>⏱️</span><span>Ships in 3–5 business days</span></div>'+
          '</div>'+
        '</div>'+
        '<div class="footer-bottom">'+
          '<div class="footer-bottom-inner">© 2026 Lavsie Loops. All Rights Reserved. Made with 💕 in India.</div>'+
        '</div>'+
      '</footer>';
    }

    /* =============================================
       PAGE: HOME
    ============================================= */
    function pgHome() {
      return '<main id="main-content" class="page-in">'+
        rHero()+
        rShopControls()+
        rProductsSection()+
        rFeatures()+
        rAbout()+
        rReviews()+
        rCTA()+
      '</main>';
    }

    /* =============================================
       PAGE: PRODUCT DETAIL
    ============================================= */
    function pgProductDetail(id) {
      var p = PRODUCTS.find(function(x){ return x.id===id; });
      if (!p) {
        return '<main class="page-in"><div class="empty-state">'+
          '<span class="empty-icon">🔍</span>'+
          '<div class="empty-title">Product not found</div>'+
          '<p class="empty-txt">This product doesn\'t exist.</p>'+
          '<button class="btn btn-primary" data-nav="shop">Browse Products</button>'+
        '</div></main>';
      }
      S.detailQty = 1;
      var wished = inWL(p.id);
      var specs = [{ k:'Material', v:p.material }].concat(SPECS_COMMON);
      return '<main class="page-in" id="main-content">'+
        '<div class="pd-page">'+
          '<nav class="pd-crumb" aria-label="Breadcrumb">'+
            '<button data-nav="home">Home</button>'+
            '<span aria-hidden="true">›</span>'+
            '<button data-nav="shop">Shop</button>'+
            '<span aria-hidden="true">›</span>'+
            '<span>'+escHtml(p.category)+'</span>'+
            '<span aria-hidden="true">›</span>'+
            '<span>'+escHtml(p.name)+'</span>'+
          '</nav>'+
          '<div class="pd-grid">'+
            '<div class="pd-images">'+
              '<div class="pd-main-img" id="pd-main-img">'+
                imgTag(p.image, p.name)+
              '</div>'+
              '<div class="pd-thumbs">'+
                '<div class="pd-thumb on" aria-label="Product image 1">'+imgTag(p.image,p.name)+'</div>'+
                '<div class="pd-thumb" aria-label="Product image 2">'+imgTag(p.image,p.name)+'</div>'+
              '</div>'+
            '</div>'+
            '<div class="pd-info">'+
              '<div class="pd-cat">'+p.category+'</div>'+
              '<h1 class="pd-name">'+escHtml(p.name)+'</h1>'+
              '<div class="pd-rating-row">'+
                stars(p.rating)+
                '<span class="rat-val">'+p.rating+'</span>'+
                '<span class="rat-cnt">('+p.reviews+' reviews)</span>'+
              '</div>'+
              '<div class="pd-price-row">'+
                '<div class="pd-price">'+fp(p.price)+'</div>'+
                '<span class="price-orig">'+fp(p.origPrice)+'</span>'+
                '<span class="price-off">'+p.discount+'% off</span>'+
              '</div>'+
              '<div class="pd-avail">✓ In Stock — Ready to ship</div>'+
              '<p class="pd-desc">'+escHtml(p.description)+'</p>'+
              '<div class="pd-time">'+
                '<span class="pd-time-icon" aria-hidden="true">🧶</span>'+
                '<div><div class="pd-time-lbl">Time to Create</div><div class="pd-time-val">'+p.timeToCreate+'</div></div>'+
              '</div>'+
              '<div class="pd-specs">'+
                '<div class="pd-specs-title">📋 Product Specifications</div>'+
                specs.map(function(s){
                  return '<div class="pd-spec-row">'+
                    '<div class="pd-spec-k">'+escHtml(s.k)+'</div>'+
                    '<div class="pd-spec-v">'+escHtml(s.v)+'</div>'+
                  '</div>';
                }).join('')+
              '</div>'+
              '<div><div style="font-size:.8rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;">Quantity</div>'+
              '<div class="pd-qty-ctrl" id="pd-qty-ctrl">'+
                '<button class="qty-btn" data-action="dec-detail-qty" aria-label="Decrease quantity">−</button>'+
                '<div class="qty-num" id="detail-qty" data-qty="1">1</div>'+
                '<button class="qty-btn" data-action="inc-detail-qty" aria-label="Increase quantity">+</button>'+
              '</div></div>'+
              '<div class="pd-actions">'+
                '<button class="btn btn-primary btn-lg" data-action="detail-add-cart" data-id="'+p.id+'" '+
                  'aria-label="Add '+escHtml(p.name)+' to cart">🛒 Add to Cart</button>'+
                '<button class="btn '+(wished?'btn-primary':'btn-secondary')+' btn-lg" id="pd-wl-btn" '+
                  'data-action="detail-toggle-wl" data-id="'+p.id+'" '+
                  'aria-label="'+(wished?'Remove from':'Add to')+' wishlist" aria-pressed="'+(wished?'true':'false')+'">'+
                  (wished?'❤️ Wishlisted':'🤍 Add to Wishlist')+
                '</button>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</main>';
    }

    /* =============================================
       PAGE: CART
    ============================================= */
    function pgCart() {
      return '<main class="page-in" id="main-content">'+
        '<div class="cart-page">'+
          (S.checkoutOk ? rCheckoutOk() : rCartContent())+
        '</div>'+
      '</main>';
    }

    function rCheckoutOk() {
      return '<div class="checkout-ok">'+
        '<div class="checkout-ok-icon" aria-hidden="true">🎀</div>'+
        '<h2 class="checkout-ok-title">Thank you for shopping with Lavsie Loops! 💕</h2>'+
        '<p class="checkout-ok-txt">Your order has been placed successfully. We\'re lovingly hand-packing your crochet treasures and will ship them soon. Expect delivery in 3–5 business days.</p>'+
        '<button class="btn btn-primary btn-lg" data-action="continue-shopping">Continue Shopping 🧶</button>'+
      '</div>';
    }

    function rCartContent() {
      if (!S.cart.length) {
        return '<div class="empty-state">'+
          '<span class="empty-icon" aria-hidden="true">🛒</span>'+
          '<div class="empty-title">Your cart is feeling a little empty.</div>'+
          '<p class="empty-txt">Let\'s add something handmade!</p>'+
          '<button class="btn btn-primary" data-nav="shop">Explore Collection 🧶</button>'+
        '</div>';
      }
      var sub = cartTotal();
      var delivery = 50;
      var total = sub + delivery;
      return '<h1 class="cart-pg-title">Your Cart 🛒</h1>'+
        '<div class="cart-layout">'+
          '<div class="cart-items-list" id="cart-items-list">'+
            S.cart.map(function(item){
              return '<div class="cart-item" id="cart-item-'+item.id+'">'+
                '<div class="cart-item-img">'+imgTag(item.image, item.name)+'</div>'+
                '<div class="cart-item-info">'+
                  '<div class="cart-item-name">'+escHtml(item.name)+'</div>'+
                  '<div class="cart-item-up">'+fp(item.price)+' per item</div>'+
                  '<div class="cart-qty-ctrl">'+
                    '<button class="cqb" data-action="dec-qty" data-id="'+item.id+'" aria-label="Decrease quantity">−</button>'+
                    '<span class="cqn" id="cqn-'+item.id+'" aria-label="Quantity">'+item.qty+'</span>'+
                    '<button class="cqb" data-action="inc-qty" data-id="'+item.id+'" aria-label="Increase quantity">+</button>'+
                  '</div>'+
                  '<button class="cart-rmv" data-action="remove-cart" data-id="'+item.id+'" aria-label="Remove '+escHtml(item.name)+' from cart">✕ Remove</button>'+
                '</div>'+
                '<div class="cart-item-right">'+
                  '<div class="cart-item-sub-lbl">Subtotal</div>'+
                  '<div class="cart-item-sub" id="csub-'+item.id+'">'+fp(item.price*item.qty)+'</div>'+
                '</div>'+
              '</div>';
            }).join('')+
          '</div>'+
          '<div class="cart-summary" id="cart-summary">'+
            '<div class="cs-title">Order Summary 📦</div>'+
            '<div class="cs-row"><span class="cs-lbl">Subtotal ('+cartCount()+' items)</span><span class="cs-val" id="cs-sub">'+fp(sub)+'</span></div>'+
            '<div class="cs-row"><span class="cs-lbl">Delivery</span><span class="cs-val">'+fp(delivery)+'</span></div>'+
            '<hr class="cs-divider">'+
            '<div class="cs-total-row">'+
              '<span class="cs-total-lbl">Total</span>'+
              '<span class="cs-total-val" id="cs-total">'+fp(total)+'</span>'+
            '</div>'+
            '<button class="btn btn-primary btn-full btn-lg" data-action="checkout" aria-label="Proceed to checkout">Proceed to Checkout →</button>'+
            '<p class="cs-note">🔒 Safe & secure checkout • Free returns • Handpacked with care</p>'+
          '</div>'+
        '</div>';
    }

    /* =============================================
       PAGE: WISHLIST
    ============================================= */
    function pgWishlist() {
      return '<main class="page-in" id="main-content">'+
        '<div class="wl-page">'+
          '<h1 class="wl-pg-title">Your Wishlist ❤️</h1>'+
          rWishlistContent()+
        '</div>'+
      '</main>';
    }

    function rWishlistContent() {
      if (!S.wishlist.length) {
        return '<div class="empty-state">'+
          '<span class="empty-icon" aria-hidden="true">❤️</span>'+
          '<div class="empty-title">Your wishlist is waiting for something cute! 💕</div>'+
          '<p class="empty-txt">Browse our collection and save your favourites.</p>'+
          '<button class="btn btn-primary" data-nav="shop">Explore Products 🧶</button>'+
        '</div>';
      }
      return '<div class="wl-grid" id="wl-grid">'+
        S.wishlist.map(function(item){
          var p = PRODUCTS.find(function(x){ return x.id===item.id; });
          var r = p ? p.rating : item.rating;
          var rv = p ? p.reviews : item.reviews;
          return '<div class="wl-card">'+
            '<div class="wl-img">'+imgTag(item.image, item.name)+'</div>'+
            '<div class="wl-body">'+
              '<div class="wl-name">'+escHtml(item.name)+'</div>'+
              '<div class="wl-price">'+fp(item.price)+'</div>'+
              '<div class="wl-rating">'+stars(r)+'<span class="rat-val">'+r+'</span><span class="rat-cnt">('+rv+')</span></div>'+
              '<div class="wl-actions">'+
                '<button class="btn btn-primary" style="flex:1" data-action="wl-add-cart" data-id="'+item.id+'" aria-label="Add '+escHtml(item.name)+' to cart">🛒 Add to Cart</button>'+
                '<button class="btn btn-outline" data-action="remove-wl" data-id="'+item.id+'" aria-label="Remove '+escHtml(item.name)+' from wishlist">🗑️</button>'+
              '</div>'+
            '</div>'+
          '</div>';
        }).join('')+
      '</div>';
    }

    /* =============================================
       RENDER APP
    ============================================= */
    function render() {
      var hash = window.location.hash || '#/';
      var app = document.getElementById('app');
      var html = rNavbar();

      if (hash === '#/' || hash === '#' || hash === '') {
        html += pgHome();
      } else if (hash.startsWith('#/product/')) {
        var id = parseInt(hash.split('/')[2], 10);
        html += pgProductDetail(id);
      } else if (hash === '#/cart') {
        html += pgCart();
      } else if (hash === '#/wishlist') {
        html += pgWishlist();
      } else {
        html += '<main class="page-in"><div class="empty-state">'+
          '<span class="empty-icon">🔍</span>'+
          '<div class="empty-title">Page not found</div>'+
          '<button class="btn btn-primary" data-nav="home">Go Home</button>'+
        '</div></main>';
      }

      html += rFooter();
      app.innerHTML = html;
      bindEvents();
      window.scrollTo({ top:0 });
    }

    /* =============================================
       BIND EVENTS
    ============================================= */
    function bindEvents() {
      // hamburger
      var hbg = document.getElementById('hbg');
      var mob = document.getElementById('mob-menu');
      if (hbg && mob) {
        hbg.onclick = function() {
          var open = mob.classList.toggle('open');
          hbg.classList.toggle('open', open);
          hbg.setAttribute('aria-expanded', open?'true':'false');
        };
      }
      // search input
      var si = document.getElementById('search-input');
      var sc = document.getElementById('search-clear');
      if (si) {
        si.addEventListener('input', function() {
          S.search = si.value;
          sc && (sc.className = 'search-clear'+(S.search?' vis':''));
          updateProductGrid();
        });
        si.addEventListener('keydown', function(e) {
          if (e.key==='Escape') { S.search=''; si.value=''; sc&&sc.classList.remove('vis'); updateProductGrid(); }
        });
      }
      if (sc) {
        sc.onclick = function() { S.search=''; if(si) si.value=''; sc.classList.remove('vis'); si&&si.focus(); updateProductGrid(); };
      }
      // sort select
      var ss = document.getElementById('sort-select');
      if (ss) {
        ss.onchange = function() { S.sort = ss.value; updateProductGrid(); };
      }
    }

    function updateProductGrid() {
      var wrap = document.getElementById('products-grid-wrap');
      if (wrap) wrap.innerHTML = rProductGridContent();
    }

    /* =============================================
       NAVIGATE
    ============================================= */
    function navigate(path) {
      window.location.hash = '#'+path;
    }

    function closeMob() {
      var mob = document.getElementById('mob-menu');
      var hbg = document.getElementById('hbg');
      if (mob) mob.classList.remove('open');
      if (hbg) { hbg.classList.remove('open'); hbg.setAttribute('aria-expanded','false'); }
    }

    function scrollTo(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    /* =============================================
       GLOBAL CLICK DELEGATION
    ============================================= */
    document.addEventListener('click', function(e) {
      // nav handler
      var navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        var nav = navBtn.dataset.nav;
        var hash = window.location.hash || '#/';
        closeMob();
        if (nav==='home')     { navigate('/'); }
        else if (nav==='shop') {
          if (hash==='#/' || hash==='#' || hash==='') {
            scrollTo('shop');
          } else { navigate('/'); setTimeout(function(){ scrollTo('shop'); },120); }
        }
        else if (nav==='about') {
          if (hash==='#/' || hash==='#' || hash==='') {
            scrollTo('about');
          } else { navigate('/'); setTimeout(function(){ scrollTo('about'); },120); }
        }
        else if (nav==='wishlist') { navigate('/wishlist'); }
        else if (nav==='cart')     { navigate('/cart'); }
        return;
      }

      // cat-nav in footer
      var catNav = e.target.closest('[data-cat-nav]');
      if (catNav) {
        S.category = catNav.dataset.catNav;
        S.search = '';
        navigate('/');
        setTimeout(function(){ scrollTo('shop'); }, 120);
        return;
      }

      // category pill
      var pill = e.target.closest('[data-cat]');
      if (pill) {
        S.category = pill.dataset.cat;
        document.querySelectorAll('.pill').forEach(function(p){ p.classList.toggle('active', p.dataset.cat===S.category); });
        updateProductGrid();
        return;
      }

      // actions
      var act = e.target.closest('[data-action]');
      if (!act) return;
      var action = act.dataset.action;
      var id = parseInt(act.dataset.id, 10);

      if (action==='add-cart') {
        addToCart(id, 1);
        var p = PRODUCTS.find(function(x){ return x.id===id; });
        if (p) toast(p.name+' added to your cart! 🛒','success');
      }
      else if (action==='toggle-wl') {
        var res = toggleWL(id);
        act.classList.toggle('on', inWL(id));
        act.setAttribute('aria-pressed', inWL(id)?'true':'false');
        act.textContent = inWL(id)?'❤️':'🤍';
        act.classList.add('heart-pop');
        setTimeout(function(){ act.classList.remove('heart-pop'); },320);
        if (res==='added') toast('Added to your wishlist ❤️','ok');
        else toast('Removed from your wishlist.','info');
      }
      else if (action==='view-detail') {
        navigate('/product/'+id);
      }
      else if (action==='detail-add-cart') {
        var qEl = document.getElementById('detail-qty');
        var qty = qEl ? parseInt(qEl.dataset.qty)||1 : 1;
        addToCart(id, qty);
        var pp = PRODUCTS.find(function(x){ return x.id===id; });
        if (pp) toast(pp.name+' added to your cart! 🛒','success');
      }
      else if (action==='inc-detail-qty') {
        S.detailQty = Math.min(10, (S.detailQty||1)+1);
        var dq = document.getElementById('detail-qty');
        if (dq) { dq.textContent=S.detailQty; dq.dataset.qty=S.detailQty; }
      }
      else if (action==='dec-detail-qty') {
        S.detailQty = Math.max(1, (S.detailQty||1)-1);
        var dq2 = document.getElementById('detail-qty');
        if (dq2) { dq2.textContent=S.detailQty; dq2.dataset.qty=S.detailQty; }
      }
      else if (action==='detail-toggle-wl') {
        var res2 = toggleWL(id);
        var wBtn = document.getElementById('pd-wl-btn');
        if (wBtn) {
          var now = inWL(id);
          wBtn.className = 'btn '+(now?'btn-primary':'btn-secondary')+' btn-lg';
          wBtn.textContent = now ? '❤️ Wishlisted' : '🤍 Add to Wishlist';
          wBtn.setAttribute('aria-pressed', now?'true':'false');
          wBtn.classList.add('heart-pop');
          setTimeout(function(){ wBtn.classList.remove('heart-pop'); },320);
        }
        if (res2==='added') toast('Added to your wishlist ❤️','ok');
        else toast('Removed from your wishlist.','info');
      }
      else if (action==='inc-qty') {
        changeCartQty(id, 1);
        refreshCartItem(id);
      }
      else if (action==='dec-qty') {
        changeCartQty(id, -1);
        refreshCartItem(id);
      }
      else if (action==='remove-cart') {
        removeFromCart(id);
        var pg = PRODUCTS.find(function(x){ return x.id===id; });
        var nm = pg ? pg.name : 'Item';
        toast(nm+' removed from cart.','info');
        // Re-render cart content
        var mainArea = document.querySelector('.cart-page');
        if (mainArea) {
          mainArea.innerHTML = S.cart.length || S.checkoutOk ? rCartContent() : rCartContent();
        }
      }
      else if (action==='checkout') {
        S.cart = []; S.checkoutOk = true; saveState(); updateCounters();
        var cartPg = document.querySelector('.cart-page');
        if (cartPg) cartPg.innerHTML = rCheckoutOk();
      }
      else if (action==='continue-shopping') {
        S.checkoutOk = false; navigate('/');
      }
      else if (action==='wl-add-cart') {
        addToCart(id, 1);
        var wp = PRODUCTS.find(function(x){ return x.id===id; });
        if (wp) toast(wp.name+' added to your cart! 🛒','success');
      }
      else if (action==='remove-wl') {
        toggleWL(id);
        var wlG = document.getElementById('wl-grid') || document.querySelector('.wl-page');
        if (wlG) {
          var wlPage = document.querySelector('.wl-page');
          if (wlPage) wlPage.innerHTML = '<h1 class="wl-pg-title">Your Wishlist ❤️</h1>'+rWishlistContent();
        }
        toast('Removed from your wishlist.','info');
      }
      else if (action==='clear-search') {
        S.search=''; S.category='All'; S.sort='featured';
        var siEl = document.getElementById('search-input');
        if (siEl) siEl.value='';
        document.querySelectorAll('.pill').forEach(function(p){ p.classList.toggle('active',p.dataset.cat==='All'); });
        var ssEl = document.getElementById('sort-select');
        if (ssEl) ssEl.value='featured';
        updateProductGrid();
      }
    });

    /* =============================================
       REFRESH CART ITEM (surgical update)
    ============================================= */
    function refreshCartItem(id) {
      var item = S.cart.find(function(i){ return i.id===id; });
      if (!item) return;
      var qEl = document.getElementById('cqn-'+id);
      var sEl = document.getElementById('csub-'+id);
      if (qEl) qEl.textContent = item.qty;
      if (sEl) sEl.textContent = fp(item.price * item.qty);
      // update summary
      var sub = cartTotal(), delivery = 50;
      var subEl = document.getElementById('cs-sub');
      var totEl = document.getElementById('cs-total');
      if (subEl) subEl.textContent = fp(sub);
      if (totEl) totEl.textContent = fp(sub+delivery);
    }

    /* =============================================
       ESCAPE HTML
    ============================================= */
    function escHtml(str) {
      return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
    }

    /* =============================================
       ROUTER
    ============================================= */
    window.addEventListener('hashchange', function() { render(); });

    /* =============================================
       INIT
    ============================================= */
    function init() {
      loadState();
      if (!window.location.hash || window.location.hash==='') {
        window.location.hash = '#/';
      }
      render();
    }

    init();

  })();
  