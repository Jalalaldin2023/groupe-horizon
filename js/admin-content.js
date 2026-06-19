/* ===== HORIZON ADMIN CONTENT OVERRIDE ===== */
(function () {
  'use strict';

  const DATA_KEY = 'horizonContent';
  const THEME_KEY = 'horizonTheme';
  const IMG_PFX = 'horizonImg_';

  const d = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
  const t = JSON.parse(localStorage.getItem(THEME_KEY) || '{}');

  /* Theme (instant — no flash) */
  if (t.bleu) { css('--bleu', t.bleu); css('--bleu-fonce', dark(t.bleu, 30)); }
  if (t.or) { css('--or', t.or); css('--or-fonce', dark(t.or, 25)); }

  const page = (location.pathname.split('/').pop() || 'index').replace('.html','') || 'index';

  const waNum = (d.global_whatsapp || '').replace(/\D/g, '');
  const waBase = waNum ? 'https://wa.me/' + waNum : '';

  document.addEventListener('DOMContentLoaded', () =>{
    if (page === 'index') applyAccueil();
    else applyPage(page);
    applyImages(page);
    applyPresPhotos(page);
    applyContact();
    applyLogo();
    if (waBase) applyWhatsApp();
  });

  /* ─── ACCUEIL ─── */
  function applyAccueil() {
    setText('.hero h1', d.accueil_hero_title);
    setText('.hero-sub', d.accueil_hero_sub);
    const s = qa('.hero-stats >div');
    setIn(s[0],'strong', d.accueil_stat1_n); setIn(s[0],'span', d.accueil_stat1_l);
    setIn(s[1],'strong', d.accueil_stat2_n); setIn(s[1],'span', d.accueil_stat2_l);
    setIn(s[2],'strong', d.accueil_stat3_n); setIn(s[2],'span', d.accueil_stat3_l);
  }

  /* ─── SECTEUR ─── */
  function applyPage(p) {
    /* Hero */
    setText('.page-hero .hero-tag', d[p+'_hero_tag']);
    setText('.page-hero h1', d[p+'_hero_title']);
    setNth ('.page-hero .container >p',0, d[p+'_hero_desc']);

    /* Intro */
    setText('.sector-text .section-tag', d[p+'_intro_tag']);
    setText('.sector-text h2', d[p+'_intro_h2']);
    setNth ('.sector-text >p:not(.section-tag)',0, d[p+'_intro_p']);
    setText('.sector-text .btn', d[p+'_intro_cta']);
    for (let i=1;i<=6;i++) setNth('.checklist li',i-1,d[p+'_check'+i]);

    /* Boutique */
    setText('.shop-section .section-tag', d[p+'_shop_tag']);
    setText('.shop-section .section-title',d[p+'_shop_h2']);
    const shopCount = parseInt(d[p+'_shop_count'] || '0');
    if (shopCount >0) {
      const grid = document.querySelector('.shop-grid');
      if (grid) {
        grid.innerHTML = '';
        for (let n = 1; n <= shopCount; n++) {
          const name  = d[p+'_c'+n+'_name']  || '';
          const desc  = d[p+'_c'+n+'_desc']  || '';
          const price = d[p+'_c'+n+'_price'] || '';
          const btn   = d[p+'_c'+n+'_btn']   || 'Demander un devis';
          if (!name) continue;
          const imgSrc = localStorage.getItem(IMG_PFX + p + '_shop_' + n);
          const card = document.createElement('div');
          card.className = 'shop-card reveal';
          const waLink = waBase ? waBase+'?text='+encodeURIComponent('Bonjour, je suis intéressé par : '+name) : '#contact';
          card.innerHTML = (imgSrc ? '<div class="shop-card-img"><img src="'+imgSrc+'" alt="'+name+'"></div>' : '')
            + '<div class="shop-card-name">'+name+'</div>'
            + '<div class="shop-card-desc">'+desc+'</div>'
            + '<span class="shop-card-price'+(price?'':' devis')+'">'+(price||'Sur devis')+'</span>'
            + '<a href="'+waLink+'" class="btn-sm"'+(waBase?' target="_blank" rel="noopener"':'')+'>'+btn+'</a>';
          grid.appendChild(card);
        }
      }
    } else {
      qa('.shop-card').forEach((c,i) =>{
        const n=i+1;
        setIn(c,'.shop-card-icon', d[p+'_c'+n+'_icon']);
        setIn(c,'.shop-card-name', d[p+'_c'+n+'_name']);
        setIn(c,'.shop-card-desc', d[p+'_c'+n+'_desc']);
        setIn(c,'.shop-card-price',d[p+'_c'+n+'_price']);
        const b=c.querySelector('.btn-sm'); if(b&&d[p+'_c'+n+'_btn']) b.textContent=d[p+'_c'+n+'_btn'];
      });
    }

    /* Presentation */
    setText('.presentation-section .section-tag', d[p+'_pres_tag']);
    setText('.presentation-section h2', d[p+'_pres_h2']);
    const pp = qa('.pres-text >p');
    if (pp[0]&&d[p+'_pres_p1']) pp[0].textContent=d[p+'_pres_p1'];
    if (pp[1]&&d[p+'_pres_p2']) pp[1].textContent=d[p+'_pres_p2'];
    qa('.pres-card').forEach((c,i) =>{
      const n=i+1;
      setIn(c,'.pres-card-icon',d[p+'_ph'+n+'_icon']);
      setIn(c,'h4', d[p+'_ph'+n+'_title']);
      setIn(c,'p', d[p+'_ph'+n+'_text']);
    });

    /* Galerie */
    setText('.galerie-section .section-tag', d[p+'_gal_tag']);
    setText('.galerie-section .section-title',d[p+'_gal_h2']);
    qa('.galerie-item').forEach((item,i) =>{
      const cap=item.querySelector('.galerie-caption');
      if(cap&&d[p+'_gal'+(i+1)+'_caption']) cap.textContent=d[p+'_gal'+(i+1)+'_caption'];
    });

    /* Actualites */
    setText('.actu-section .section-tag', d[p+'_news_tag']);
    setText('.actu-section .section-title',d[p+'_news_h2']);
    qa('.actu-card').forEach((c,i) =>{
      const n=i+1;
      setIn(c,'.actu-date', d[p+'_a'+n+'_date']);
      setIn(c,'.actu-title',d[p+'_a'+n+'_title']);
      setIn(c,'.actu-desc', d[p+'_a'+n+'_desc']);
    });

    /* Catalogue */
    applyCatalogue(p);

    /* Visite 3D */
    applyVisite3D(p);

    /* CTA */
    setText('.contact-cta h2', d[p+'_cta_h2']);
    setNth ('.contact-cta p',0, d[p+'_cta_p']);
    setText('.contact-cta .btn',d[p+'_cta_btn']);
  }

  /* ─── CATALOGUE ─── */
  function applyCatalogue(p) {
    const count = parseInt(d[p+'_cat_count'] || '0');
    const section = document.querySelector('.catalogue-section');
    if (!section || count === 0) return;

    section.style.display = '';
    if (d[p+'_cat_tag']) { const el=section.querySelector('.catalogue-tag');   if(el) el.textContent=d[p+'_cat_tag']; }
    if (d[p+'_cat_h2'])  { const el=section.querySelector('.catalogue-title'); if(el) el.textContent=d[p+'_cat_h2']; }

    const grid = section.querySelector('.catalogue-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let n = 1; n <= count; n++) {
      const name  = d[p+'_cat_'+n+'_name']  || '';
      const desc  = d[p+'_cat_'+n+'_desc']  || '';
      const price = d[p+'_cat_'+n+'_price'] || '';
      const btn   = d[p+'_cat_'+n+'_btn']   || 'Commander';
      if (!name) continue;
      const imgSrc = localStorage.getItem(IMG_PFX + p + '_cat_' + n);
      const item = document.createElement('div');
      item.className = 'cat-item';
      item.innerHTML = '<div class="cat-img-wrap">'
        + (imgSrc ? '<img src="'+imgSrc+'" alt="'+name+'">'
                  : '<div class="cat-img-placeholder">Photo</div>')
        + '</div><div class="cat-body">'
        + '<div class="cat-name">'+name+'</div>'
        + '<div class="cat-desc">'+desc+'</div>'
        + (price ? '<div class="cat-price">'+price+'</div>' : '')
        + '<a href="'+(waBase ? waBase+'?text='+encodeURIComponent('Bonjour, je suis intéressé par : '+name) : '#contact')+'" class="btn-sm"'+(waBase?' target="_blank" rel="noopener"':'')+'>'+btn+'</a>'
        + '</div>';
      grid.appendChild(item);
    }
  }

  /* ─── VISITE 3D ─── */
  function applyVisite3D(p) {
    const url = d[p+'_v3d_url'];
    const section = document.querySelector('.visite3d-section');
    if (!section || !url) return;
    section.style.display = '';
    const tag = section.querySelector('.visite3d-tag');
    const title = section.querySelector('.visite3d-title');
    const desc  = section.querySelector('.visite3d-desc');
    const iframe = section.querySelector('.visite3d-iframe');
    if (tag   && d[p+'_v3d_tag'])  tag.textContent   = d[p+'_v3d_tag'];
    if (title && d[p+'_v3d_h2'])   title.textContent  = d[p+'_v3d_h2'];
    if (desc  && d[p+'_v3d_desc']) desc.textContent   = d[p+'_v3d_desc'];
    if (iframe) iframe.src = url;
  }

  /* ─── IMAGES GALERIE ─── */
  function applyImages(p) {
    qa('.galerie-item').forEach((item,i) =>{
      const src = localStorage.getItem(IMG_PFX + p + '_' + (i+1));
      if (!src) return;
      const ph = item.querySelector('.galerie-placeholder');
      if (ph) injectPhoto(ph, src);
    });
  }

  /* ─── IMAGES PRESENTATION (equipe & etablissement) ─── */
  function applyPresPhotos(p) {
    for (let i = 1; i <= 3; i++) {
      const ts = localStorage.getItem(IMG_PFX + p + '_team_' + i);
      const es = localStorage.getItem(IMG_PFX + p + '_estab_' + i);
      if (ts) { const el = document.querySelector(`[data-pres-team="${i}"]`); if (el) injectPhoto(el, ts); }
      if (es) { const el = document.querySelector(`[data-pres-estab="${i}"]`); if (el) injectPhoto(el, es); }
      if (d[p+'_team'+i+'_caption']) { const el = document.querySelector(`[data-pres-team-cap="${i}"]`); if (el) el.textContent = d[p+'_team'+i+'_caption']; }
      if (d[p+'_estab'+i+'_caption']) { const el = document.querySelector(`[data-pres-estab-cap="${i}"]`); if (el) el.textContent = d[p+'_estab'+i+'_caption']; }
    }
  }

  function injectPhoto(ph, src) {
    ph.innerHTML = '';
    ph.style.cssText += ';font-size:0;padding:0';
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    ph.appendChild(img);
  }

  /* ─── WHATSAPP ─── */
  function applyWhatsApp() {
    document.querySelectorAll('[data-wa-btn]').forEach(btn => {
      const card = btn.closest('.shop-card, .cat-item');
      const name = card?.querySelector('.shop-card-name, .cat-name')?.textContent || '';
      btn.href = waBase + '?text=' + encodeURIComponent('Bonjour, je suis intéressé par : ' + name);
      btn.target = '_blank';
      btn.rel = 'noopener';
    });
  }

  /* ─── CONTACT ─── */
  function applyContact() {
    if (d.global_phone)   qa('[data-admin-phone]').forEach(el=>el.textContent=d.global_phone);
    if (d.global_email)   qa('[data-admin-email]').forEach(el=>el.textContent=d.global_email);
    if (d.global_address) qa('[data-admin-address]').forEach(el=>el.textContent=d.global_address);
    if (d.global_hours)   qa('[data-admin-hours]').forEach(el=>el.textContent=d.global_hours);
  }

  /* ─── LOGO ─── */
  function applyLogo() {
    const src = localStorage.getItem(IMG_PFX + page + '_logo')
             || localStorage.getItem(IMG_PFX + 'global_logo');
    if (!src) return;
    qa('.logo-img').forEach(img => { img.src = src; img.style.display = 'block'; });
    qa('.logo-text').forEach(el  => { el.style.display = 'none'; });
  }

  /* ─── HELPERS ─── */
  function qa(s) { return Array.from(document.querySelectorAll(s)); }
  function css(k,v) { document.documentElement.style.setProperty(k,v); }
  function setText(s,v) { if(!v)return; const e=document.querySelector(s); if(e)e.textContent=v; }
  function setNth(s,i,v) { if(!v)return; const e=qa(s); if(e[i])e[i].textContent=v; }
  function setIn(p,s,v) { if(!p||!v)return; const e=p.querySelector(s); if(e)e.textContent=v; }
  function dark(hex,amt) {
    const n=parseInt(hex.replace('#',''),16);
    const c=v=>Math.max(0,Math.min(255,v-amt));
    return '#'+[c(n>>16),c((n>>8)&0xFF),c(n&0xFF)].map(v=>v.toString(16).padStart(2,'0')).join('');
  }
})();
