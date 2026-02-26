/**
 * content-loader.js
 * Fetches content.json and populates all visible text on the page
 * using Themify module CSS classes as selectors.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */

  /** Set plain-text content of every matching element. */
  function setText(sel, val) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.textContent = val;
    });
  }

  /** Set innerHTML of every matching element. */
  function setHTML(sel, val) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.innerHTML = val;
    });
  }

  /**
   * Replace the inner <ul> of a matching element with <li> items
   * built from a plain string array.
   */
  function setList(sel, items) {
    document.querySelectorAll(sel).forEach(function (el) {
      var ul = el.querySelector('ul') || el;
      ul.innerHTML = items.map(function (i) { return '<li>' + i + '</li>'; }).join('');
    });
  }

  /**
   * Rebuild a pricing table inside a matching element.
   * rows: [{ participants, price }, ...]
   */
  function setPricingTable(sel, rows) {
    document.querySelectorAll(sel).forEach(function (el) {
      var tbody = el.querySelector('tbody') || el;
      tbody.innerHTML = rows.map(function (r) {
        return '<tr><td>' + r.participants + ' Orang</td><td>' + r.price + '</td></tr>';
      }).join('');
    });
  }

  /**
   * Set text for a specific icon list item by its 1-based position.
   * The Themify icon list markup uses .module-icon-item children.
   */
  function setIconItem(parentSel, index, val) {
    document.querySelectorAll(parentSel).forEach(function (parent) {
      var items = parent.querySelectorAll('.module-icon-item');
      if (items[index - 1]) items[index - 1].querySelector('span') && (items[index - 1].querySelector('span').textContent = val);
    });
  }

  /**
   * Set the label text inside the first <span> of each icon item.
   * Used for vehicle name labels that sit inside a styled span.
   */
  function setSpanInIcon(sel, val) {
    document.querySelectorAll(sel).forEach(function (el) {
      var span = el.querySelector('.module-figure-caption') || el.querySelector('span:not([class])') || el.querySelector('span');
      if (span) span.textContent = val;
    });
  }

  /** Detect current page by its unique body ID. */
  function getPageId() {
    if (document.querySelector('#page-103')) return 'index';
    if (document.querySelector('#page-121')) return 'packet';
    if (document.querySelector('#page-122')) return 'rent';
    if (document.querySelector('#page-125')) return 'about';
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Shared: header + footer (postid-144 / postid-146)                   */
  /* ------------------------------------------------------------------ */

  /**
   * Update the href of social icon links inside a container.
   * Matches by the SVG symbol reference so order doesn't matter.
   */
  function setSocialLinks(containerSel, links) {
    document.querySelectorAll(containerSel + ' .module-icon-item').forEach(function (item) {
      ['facebook', 'instagram', 'tiktok', 'youtube'].forEach(function (platform) {
        if (item.querySelector('use[href="#tf-fab-' + platform + '"]')) {
          var a = item.querySelector('a');
          if (a) a.href = links[platform];
        }
      });
    });
  }

  function applyShared(data) {
    // ── Topbar (tb_uyc4649) ──────────────────────────────────────────
    var topbarItems = document.querySelectorAll('.tb_uyc4649 .module-icon-item');
    if (topbarItems[0]) { var s = topbarItems[0].querySelector('span'); if (s) s.textContent = data.topbar.promo; }
    if (topbarItems[1]) { var s = topbarItems[1].querySelector('span'); if (s) s.textContent = data.topbar.phone1; }
    if (topbarItems[2]) { var s = topbarItems[2].querySelector('span'); if (s) s.textContent = data.topbar.phone2; }

    // ── Navigation ───────────────────────────────────────────────────
    setText('#menu-item-133 a', data.nav.home);
    setText('#menu-item-137 a', data.nav.packages);
    setText('#menu-item-140 a', data.nav.rental);
    setText('#menu-item-139 a', data.nav.about);

    // ── Footer: brand name (tb_hsfv980) ─────────────────────────────
    setHTML('.tb_hsfv980 .tb_text_wrap', data.footer.brandName);

    // ── Footer: company description (tb_3v9i788) ────────────────────
    setHTML('.tb_3v9i788 .tb_text_wrap', data.footer.description);

    // ── Footer: "Hubungi Kami" heading (tb_gdha572) ──────────────────
    setHTML('.tb_gdha572 .tb_text_wrap', data.footer.contactTitle);

    // ── Footer: contact icon list (tb_nzer380) ───────────────────────
    var contactItems = document.querySelectorAll('.tb_nzer380 .module-icon-item');
    if (contactItems[0]) { var s = contactItems[0].querySelector('span'); if (s) s.textContent = data.footer.admin1; }
    if (contactItems[1]) { var s = contactItems[1].querySelector('span'); if (s) s.textContent = data.footer.admin2; }
    // item[2] is a Cloudflare-obfuscated email — leave it alone
    // address is at index 3 on index.html (which has email at [2]), index 2 on others
    var addrIdx = contactItems.length >= 4 ? 3 : 2;
    if (contactItems[addrIdx]) {
      var s = contactItems[addrIdx].querySelector('span');
      if (s) s.textContent = data.footer.address;
    }

    // ── Footer: copyright (tb_xsbc432) ──────────────────────────────
    setHTML('.tb_xsbc432 .tb_text_wrap', data.footer.copyright);
    // ── Social links (header tb_lsju223 + footer tb_l9ob998) ────────
    if (data.socialLinks) {
      setSocialLinks('.tb_lsju223', data.socialLinks);
      setSocialLinks('.tb_l9ob998', data.socialLinks);

      // Floating buttons (.floatwa) — Instagram and YouTube only
      var floatLinks = document.querySelectorAll('.floatwa a');
      floatLinks.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (href.indexOf('instagram') !== -1) a.href = data.socialLinks.instagram;
        if (href.indexOf('youtube')   !== -1) a.href = data.socialLinks.youtube;
      });
    }  }

  /* ------------------------------------------------------------------ */
  /* index.html (page-103)                                               */
  /* ------------------------------------------------------------------ */

  function applyIndex(data) {
    // Hero / welcome
    setHTML('.tb_tvq693 .tb_text_wrap', data.welcome);

    // About section
    setHTML('.tb_mg12967 .tb_text_wrap', data.aboutTitle);
    setHTML('.tb_0m8b134 .tb_text_wrap', data.aboutPara1);
    setHTML('.tb_n6pm113 .tb_text_wrap', data.aboutPara2);
    var aboutBtn = document.querySelector('.tb_695h152 a');
    if (aboutBtn) aboutBtn.textContent = data.aboutButton;

    // Features (4 items)
    setHTML('.tb_0k23313 .tb_text_wrap', data.features[0]);
    setHTML('.tb_ku0y114 .tb_text_wrap', data.features[1]);
    setHTML('.tb_wrf2114 .tb_text_wrap', data.features[2]);
    setHTML('.tb_szut114 .tb_text_wrap', data.features[3]);

    // Package section header
    setHTML('.tb_kt0c9 .tb_text_wrap', data.packageSectionLabel);
    setHTML('.tb_w3889 .tb_text_wrap', data.packageBreadcrumb);
    setHTML('.tb_ozfs467 .tb_text_wrap', data.packageTagline);

    // Package cards — 3 cards with unique class names
    var cardSelectors = [
      { title: '.tb_4kt7553', tags: '.tb_eon8553', desc: '.tb_fhob140', btn: '.tb_1p33422 a' },
      { title: '.tb_mvqt554', tags: '.tb_6zqn554', desc: '.tb_46b0891', btn: '.tb_cfzy67 a'  },
      { title: '.tb_ev8u554', tags: '.tb_u660554', desc: '.tb_4lik516', btn: '.tb_c26q554 a' }
    ];
    data.packageCards.forEach(function (card, i) {
      var sel = cardSelectors[i];
      setHTML(sel.title + ' .tb_text_wrap', card.title);
      var tagItems = document.querySelectorAll(sel.tags + ' .module-icon-item');
      card.tags.forEach(function (tag, j) {
        if (tagItems[j]) { var s = tagItems[j].querySelector('span'); if (s) s.textContent = tag; }
      });
      setHTML(sel.desc + ' .tb_text_wrap', card.description);
      var btn = document.querySelector(sel.btn);
      if (btn) btn.textContent = card.button;
    });

    // Hashtag
    var htSpan = document.querySelector('.tb_x1q91 .module-icon-item span');
    if (htSpan) htSpan.textContent = data.hashtag;

    // Rental section
    setHTML('.tb_07eh59 .tb_text_wrap', data.rentalTitle + data.rentalDescription);

    // Vehicles  row 1 (classes differ from rent.html)
    var idxVehicleSelectors = [
      { name: '.tb_vzbp154', price: '.tb_fz1w842', btn: '.tb_za54154 a' },
      { name: '.tb_q6xb154', price: '.tb_fto1992', btn: null },
      { name: '.tb_xao0154', price: '.tb_gf5x959', btn: null },
      { name: '.tb_slsa155', price: '.tb_tm7s155', btn: null },
      { name: '.tb_vmwt155', price: '.tb_0620155', btn: null },
      { name: '.tb_686y155', price: '.tb_0cv5155', btn: null }
    ];
    data.vehicles.forEach(function (v, i) {
      var sel = idxVehicleSelectors[i];
      if (!sel) return;
      var nameSpan = document.querySelector(sel.name + ' .module-figure-caption');
      if (!nameSpan) nameSpan = document.querySelector(sel.name + ' span');
      if (nameSpan) nameSpan.textContent = v.name;
      setHTML(sel.price + ' .tb_text_wrap', v.price);
      if (sel.btn) { var b = document.querySelector(sel.btn); if (b) b.textContent = v.button; }
    });

    // CTA section
    setHTML('.tb_zsef697 .tb_text_wrap', data.ctaHeading);
    setHTML('.tb_nvj6697 .tb_text_wrap', '<p>' + data.ctaDescription + '</p>');
    var ctaBtn = document.querySelector('.tb_81x8155 a');
    if (ctaBtn) ctaBtn.textContent = data.ctaButton;
  }

  /* ------------------------------------------------------------------ */
  /* about.html (page-125)                                               */
  /* ------------------------------------------------------------------ */

  function applyAbout(data) {
    setHTML('.tb_g7fu381 .tb_text_wrap', data.pageTitle);
    setHTML('.tb_fl1g165 .tb_text_wrap', data.breadcrumb);
    setHTML('.tb_wt6i727 .tb_text_wrap', data.tagline);

    setHTML('.tb_7otf600 .tb_text_wrap', data.companyDescription);

    // Legality title (icon span)
    var legalSpan = document.querySelector('.tb_g6yw880 .module-icon-item span');
    if (legalSpan) legalSpan.textContent = data.legalityTitle;

    // Legality intro + list (tb_do2v594)
    var legalEl = document.querySelector('.tb_do2v594 .tb_text_wrap');
    if (legalEl) {
      legalEl.innerHTML = data.legalityIntro +
        '<ul>' + data.legalityDocs.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>';
    }

    // Bank title (icon span)
    var bankSpan = document.querySelector('.tb_xr91725 .module-icon-item span');
    if (bankSpan) bankSpan.textContent = data.bankTitle;

    setHTML('.tb_0edh984 .tb_text_wrap', data.bankDetails);
    setHTML('.tb_ratw656 .tb_text_wrap', data.locationDescription);

    // Features
    setHTML('.tb_gw4p307 .tb_text_wrap', data.features[0]);
    setHTML('.tb_u7h7144 .tb_text_wrap', data.features[1]);
    setHTML('.tb_kk8c307 .tb_text_wrap', data.features[2]);
    setHTML('.tb_s4ky307 .tb_text_wrap', data.features[3]);
  }

  /* ------------------------------------------------------------------ */
  /* packet.html (page-121)                                              */
  /* ------------------------------------------------------------------ */

  function applyPacket(data) {
    setHTML('.tb_2864802 .tb_text_wrap', data.pageLabel);
    setHTML('.tb_ac25802 .tb_text_wrap', data.breadcrumb);
    setHTML('.tb_w73y678 .tb_text_wrap', data.tagline);
    setHTML('.tb_pz1i838 .tb_text_wrap', data.intro);

    // Section headings
    setHTML('.tb_u5xc530 .tb_text_wrap', data.sections[0].title);
    setHTML('.tb_o0q2499 .tb_text_wrap', data.sections[1].title);
    setHTML('.tb_ynx1382 .tb_text_wrap', data.sections[2].title);
    setHTML('.tb_0xap951 .tb_text_wrap', data.sections[3].title);
    setHTML('.tb_hqz9310 .tb_text_wrap', data.religiIntro);

    // Religi vehicles (3 items)
    var religiSelectors = [
      { name: '.tb_xp6a168', price: '.tb_8bjp168' },
      { name: '.tb_y4e7727', price: '.tb_jh88727' },
      { name: '.tb_r8ip855', price: '.tb_fika855' }
    ];
    data.religiVehicles.forEach(function (v, i) {
      var sel = religiSelectors[i];
      var nameSpan = document.querySelector(sel.name + ' .module-figure-caption') ||
                     document.querySelector(sel.name + ' span');
      if (nameSpan) nameSpan.textContent = v.name;
      setHTML(sel.price + ' .tb_text_wrap', v.price);
    });

    // Map each package to its module class names (same order as content.json)
    var packageModules = [
      { titleSel: '.tb_jgn7613', priceSel: '.tb_mi46772', itin: '.tb_p95w772', inc: '.tb_heri772', exc: '.tb_zqw2773', tabSel: '.tb_ic2q670' },
      { titleSel: '.tb_awju422', priceSel: '.tb_5jm5774', itin: '.tb_hy80774', inc: '.tb_ot3i775', exc: '.tb_q6ec775', tabSel: '.tb_2e5g739' },
      { titleSel: '.tb_2a8p151', priceSel: '.tb_wwcf776', itin: '.tb_hk7n776', inc: '.tb_3bm1776', exc: '.tb_3mkg777', tabSel: '.tb_scc6106' },
      { titleSel: '.tb_rmhp161', priceSel: '.tb_j136778', itin: '.tb_fukt778', inc: '.tb_5wij778', exc: '.tb_o63i778', tabSel: '.tb_704m161' },
      // pkg5 and pkg6 share titleSel tb_9wbz162 — we differentiate by their tab module
      { titleSel: null,          priceSel: '.tb_me7m779', itin: '.tb_p4r0779', inc: '.tb_01sb779', exc: '.tb_wcow779', tabSel: '.tb_u8m1161' },
      { titleSel: null,          priceSel: '.tb_zpdz784', itin: '.tb_daq7784', inc: '.tb_rmha785', exc: '.tb_3bnk785', tabSel: '.tb_k6i2162' },
      { titleSel: '.tb_gh04415', priceSel: '.tb_tjpo787', itin: '.tb_dwvd787', inc: '.tb_dwny787', exc: '.tb_k0ce787', tabSel: '.tb_i70m104' },
      { titleSel: '.tb_pjjx653', priceSel: '.tb_sivi788', itin: '.tb_2qqc788', inc: '.tb_dg0e788', exc: '.tb_8mpt788', tabSel: '.tb_yxxu991' },
      { titleSel: '.tb_5059835', priceSel: '.tb_fyvq789', itin: '.tb_c9be789', inc: '.tb_q4fw789', exc: '.tb_j33n789', tabSel: '.tb_gw5g415' },
      { titleSel: '.tb_o8ek584', priceSel: '.tb_xb9f789', itin: '.tb_j9bh790', inc: '.tb_n659791', exc: '.tb_jsd7791', tabSel: '.tb_lyat788' },
      { titleSel: '.tb_wcob585', priceSel: '.tb_v2tc791', itin: '.tb_6zpf792', inc: '.tb_d92q792', exc: '.tb_lf47792', tabSel: '.tb_farv13'  },
      { titleSel: '.tb_8zba731', priceSel: '.tb_rjgb793', itin: '.tb_o9xh793', inc: '.tb_q8wn793', exc: '.tb_4plx793', tabSel: '.tb_kf8x216' },
      { titleSel: '.tb_2x95732', priceSel: '.tb_qm3d794', itin: '.tb_qojk794', inc: '.tb_l4ag794', exc: '.tb_edml794', tabSel: '.tb_qyoj33'  }
    ];

    // Set titles for pkg5/pkg6 via the duplicate class — look up by tab context
    var dual9wbz = document.querySelectorAll('.tb_9wbz162');
    if (dual9wbz[0]) setHTML_el(dual9wbz[0].querySelector('.tb_text_wrap'), data.packages[4].title);
    if (dual9wbz[1]) setHTML_el(dual9wbz[1].querySelector('.tb_text_wrap'), data.packages[5].title);

    data.packages.forEach(function (pkg, i) {
      var m = packageModules[i];

      // Title (skip for pkg5/6 — handled above)
      if (m.titleSel) setHTML(m.titleSel + ' .tb_text_wrap', pkg.title);

      // Tags
      var tabEl = document.querySelector(m.tabSel);
      if (tabEl) {
        var tagItems = tabEl.querySelectorAll('.module-icon-item');
        if (tagItems.length === 0 && tabEl.parentElement) {
          // tags may be a sibling icon module — search the column wrapper
          var col = tabEl.closest('[class*="tb_col"]') || tabEl.parentElement;
          tagItems = col.querySelectorAll('.module-icon-item');
        }
        pkg.tags.forEach(function (tag, j) {
          if (tagItems[j]) { var s = tagItems[j].querySelector('span'); if (s) s.textContent = tag; }
        });
      }

      // Pricing
      var pricingEl = document.querySelector(m.priceSel);
      if (pricingEl) {
        var tbody = pricingEl.querySelector('tbody');
        if (tbody) {
          // Table-style pricing
          tbody.innerHTML = pkg.pricing.map(function (r) {
            return '<tr><td>' + r.participants + '</td><td>' + r.price + '</td></tr>';
          }).join('');
        } else {
          // List-style pricing (pkg2 has a single <ul>)
          var ul = pricingEl.querySelector('ul');
          if (ul) {
            ul.innerHTML = pkg.pricing.map(function (r) {
              return '<li>' + r.participants + ' — ' + r.price + '</li>';
            }).join('');
          }
        }
      }

      // Itinerary
      setHTML(m.itin + ' .tb_text_wrap', pkg.itinerary);

      // Include
      if (pkg.includeIsHTML) {
        setHTML(m.inc + ' .tb_text_wrap', pkg.include);
      } else {
        var incEl = document.querySelector(m.inc + ' ul');
        if (incEl) incEl.innerHTML = pkg.include.map(function (s) { return '<li>' + s + '</li>'; }).join('');
      }

      // Exclude
      var excEl = document.querySelector(m.exc + ' ul');
      if (excEl) excEl.innerHTML = pkg.exclude.map(function (s) { return '<li>' + s + '</li>'; }).join('');
    });
  }

  /** Helper: set innerHTML of a single element (not selector). */
  function setHTML_el(el, val) {
    if (el) el.innerHTML = val;
  }

  /* ------------------------------------------------------------------ */
  /* rent.html (page-122)                                                */
  /* ------------------------------------------------------------------ */

  function applyRent(data) {
    setHTML('.tb_2864802 .tb_text_wrap', data.pageLabel);
    setHTML('.tb_ac25802 .tb_text_wrap', data.breadcrumb);
    setHTML('.tb_wcdq318 .tb_text_wrap', data.tagline);
    setHTML('.tb_uzo1580 .tb_text_wrap', data.intro);

    var rentVehicleSelectors = [
      { name: '.tb_47nv879', price: '.tb_e67o879' },
      { name: '.tb_cxfg802', price: '.tb_hg69802' },
      { name: '.tb_7t8h845', price: '.tb_jvqj845' },
      { name: '.tb_cy5e532', price: '.tb_hzb8532' },
      { name: '.tb_houa443', price: '.tb_4562443' },
      { name: '.tb_0pef975', price: '.tb_y6o3975' }
    ];

    data.vehicles.forEach(function (v, i) {
      var sel = rentVehicleSelectors[i];
      var nameSpan = document.querySelector(sel.name + ' .module-figure-caption') ||
                     document.querySelector(sel.name + ' span');
      if (nameSpan) nameSpan.textContent = v.name;
      setHTML(sel.price + ' .tb_text_wrap', v.price);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Main entry point                                                     */
  /* ------------------------------------------------------------------ */

  function applyContent(data) {
    applyShared(data);
    var page = getPageId();
    if (page === 'index')  applyIndex(data.index);
    if (page === 'about')  applyAbout(data.about);
    if (page === 'packet') applyPacket(data.packet);
    if (page === 'rent')   applyRent(data.rent);
  }

  // Data is provided by js/content-data.js loaded before this script.
  if (typeof SITE_CONTENT !== 'undefined') {
    applyContent(SITE_CONTENT);
  } else {
    console.warn('[content-loader] SITE_CONTENT not found. Make sure content-data.js is loaded before content-loader.js.');
  }

})();
