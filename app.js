/* Website tĩnh: tương tác chạy trên trình duyệt, tương thích GitHub Pages. */
(() => {
  'use strict';
  const C = window.PK_CONFIG;
  const products = window.PK_CATALOG.products;
  const U = window.PK_UTILS;
  const base = document.documentElement.dataset.base || '';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cartKey = 'pktp-quote-list-v1';
  let cart = [];
  try { cart = U.cleanCart(JSON.parse(localStorage.getItem(cartKey) || '[]'), products); } catch { cart = []; }
  let toastTimer;
  const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const plus = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const money = number => new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND',maximumFractionDigits:0}).format(number);

  function toast(message) {
    const box = $('#toast'); if (!box) return;
    box.textContent = message; box.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove('show'), 3200);
  }
  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    $$('dialog[open]').forEach(d => d.close());
    if (id === 'quote-dialog') renderCart();
    if (id === 'inquiry-dialog') syncInquiryItems();
    dialog.showModal();
    if (id === 'search-dialog') { $('#global-search').focus(); renderSearch(); }
  }
  function saveCart() {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { toast('Danh sách được giữ trong lần truy cập này.'); }
    updateCartCount(); syncInquiryItems();
  }
  function updateCartCount() {
    $$('[data-quote-count]').forEach(el => el.textContent = String(cart.length));
    $$('[data-open="quote-dialog"]').forEach(el => el.setAttribute('aria-label', `Danh sách yêu cầu báo giá, ${cart.length} sản phẩm`));
  }
  function addToCart(id) {
    const product = products.find(p => p.id === id); if (!product) return;
    const item = cart.find(item => item.id === id);
    if (item) item.quantity = U.quantity(item.quantity + 1);
    else cart.push({id, quantity:1});
    saveCart(); toast('Đã thêm vào danh sách yêu cầu báo giá.');
  }
  function renderCart() {
    const container = $('#quote-items'); const actions = $('#quote-actions');
    if (!container) return;
    if (!cart.length) {
      container.innerHTML = '<div class="quote-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M3 8h18v13H3zM2 4h20v4H2zM12 4v17"/><path d="M12 4C7-3 3 3 7 4h5c5-7 9-1 5 0z"/></svg><h3>Chọn món quà bạn quan tâm</h3><p>Thêm sản phẩm vào danh sách, chọn số lượng rồi gửi nhu cầu để được tư vấn.</p><a class="btn primary" href="'+base+'san-pham.html">Khám phá sản phẩm '+arrow+'</a></div>';
      if (actions) actions.hidden = true; return;
    }
    if (actions) actions.hidden = false;
    container.innerHTML = cart.map(item => {
      const p = products.find(p => p.id === item.id);
      return `<div class="quote-item"><img src="${base+U.escape(p.image)}" alt="${U.escape(p.name)}" width="74" height="75"><div class="quote-item-info"><a href="${base+U.escape(p.path)}"><strong>${U.escape(p.name)}</strong></a><small>${U.escape(p.categoryName)}</small><div class="quote-qty"><label for="qty-${p.id}">Số lượng</label><input id="qty-${p.id}" data-cart-qty="${p.id}" type="number" min="1" max="99999" step="1" value="${item.quantity}"></div></div><button type="button" class="remove-item" data-remove="${p.id}" aria-label="Xóa ${U.escape(p.name)}">×</button></div>`;
    }).join('');
  }
  function syncInquiryItems() {
    const names = cart.map(item => `${products.find(p=>p.id===item.id)?.name} (${item.quantity})`).join(' · ');
    $$('.inquiry-list').forEach(el => el.textContent = names ? 'Sản phẩm quan tâm: '+names : '');
  }
  function productCard(p) {
    return `<article class="product-card"><a class="product-photo ${p.fullPhoto?'photo-full':''}" href="${base+U.escape(p.path)}" aria-label="Xem ${U.escape(p.name)}"><span class="tag">${U.escape(p.label || 'Theo yêu cầu')}</span><img src="${base+U.escape(p.image)}" alt="${U.escape(p.name)}" loading="lazy" width="300" height="240"></a><div class="product-body"><small>${U.escape(p.categoryName)}</small><h3><a href="${base+U.escape(p.path)}">${U.escape(p.name)}</a></h3><p>${U.escape(p.description)}</p><div class="product-bottom"><span class="product-price">Liên hệ báo giá</span><button type="button" class="add-btn" data-add="${p.id}" aria-label="Thêm ${U.escape(p.name)} vào yêu cầu báo giá">${plus} Báo giá</button></div></div></article>`;
  }
  function renderSearch() {
    const input = $('#global-search'); const box = $('#global-search-results'); if (!input || !box) return;
    const found = U.filterProducts(products, input.value, 'tat-ca').slice(0,12);
    box.innerHTML = found.length ? found.map(p=>`<a class="search-result" href="${base+U.escape(p.path)}"><img src="${base+U.escape(p.image)}" alt="" width="62" height="60"><span><strong>${U.escape(p.name)}</strong><small>${U.escape(p.categoryName)}</small></span>${arrow}</a>`).join('') : '<div class="empty-state"><p>Chưa tìm thấy sản phẩm phù hợp. Thử “bình”, “sổ”, “túi” hoặc gửi nhu cầu để được tư vấn.</p></div>';
  }
  const catalogGrid = $('#catalog-grid');
  let selectedCategory = 'tat-ca';
  function renderCatalog(updateUrl = true) {
    if (!catalogGrid) return;
    const query = $('#catalog-search').value;
    const sort = $('#catalog-sort').value;
    const found = U.filterProducts(products, query, selectedCategory, sort);
    catalogGrid.innerHTML = found.length ? found.map(productCard).join('') : '<div class="glass empty-state"><h3>Chưa có kết quả phù hợp</h3><p>Thử từ khóa khác hoặc xem tất cả nhóm quà tặng.</p><button type="button" class="btn" data-reset-catalog style="margin-top:22px">Xóa bộ lọc</button></div>';
    $('#catalog-count').textContent = `${found.length} gợi ý sản phẩm`;
    $$('[data-category]').forEach(button=>{
      const active=button.dataset.category===selectedCategory;
      button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
    if (updateUrl && location.protocol !== 'file:') {
      const url = new URL(location.href);
      if (selectedCategory === 'tat-ca') url.searchParams.delete('nhom'); else url.searchParams.set('nhom',selectedCategory);
      if (query.trim()) url.searchParams.set('q',query.trim()); else url.searchParams.delete('q');
      if (sort !== 'featured') url.searchParams.set('sap-xep',sort); else url.searchParams.delete('sap-xep');
      history.replaceState(null,'',url);
    }
  }
  if (catalogGrid) {
    const params = new URLSearchParams(location.search);
    const category = params.get('nhom');
    if (window.PK_CATALOG.categories.some(c=>c.id===category)) selectedCategory=category;
    $('#catalog-search').value = (params.get('q') || '').slice(0,100);
    if (['featured','az','za'].includes(params.get('sap-xep'))) $('#catalog-sort').value=params.get('sap-xep');
    renderCatalog(false);
    $('#catalog-search').addEventListener('input',()=>renderCatalog());
    $('#catalog-sort').addEventListener('change',()=>renderCatalog());
  }

  document.addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    if (open) {
      const form = $('#inquiry-dialog form');
      if (open.dataset.open === 'inquiry-dialog' && open.dataset.subject && form) form.elements.message.value=open.dataset.subject;
      openDialog(open.dataset.open); return;
    }
    const close = event.target.closest('[data-close]'); if (close) {close.closest('dialog').close();return;}
    const add = event.target.closest('[data-add]'); if (add) {addToCart(add.dataset.add);return;}
    const remove = event.target.closest('[data-remove]');
    if (remove) {cart=cart.filter(item=>item.id!==remove.dataset.remove);saveCart();renderCart();return;}
    const category = event.target.closest('[data-category]');
    if (category) {selectedCategory=category.dataset.category;renderCatalog();return;}
    if (event.target.closest('[data-reset-catalog]')) {selectedCategory='tat-ca';$('#catalog-search').value='';$('#catalog-sort').value='featured';renderCatalog();return;}
    if (event.target.closest('[data-copy-quote]')) copyQuote();
  });
  document.addEventListener('change',event=>{
    if (event.target.matches('[data-cart-qty]')) {
      const item=cart.find(i=>i.id===event.target.dataset.cartQty);
      if (item) {item.quantity=U.quantity(event.target.value);event.target.value=item.quantity;saveCart();}
    }
  });
  const globalSearch = $('#global-search'); if (globalSearch) globalSearch.addEventListener('input',renderSearch);
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
    });
    dialog.addEventListener('close',()=>{const video=$('video',dialog);if(video)video.pause();});
  });
  const menu=$('#menu-trigger');if(menu)menu.addEventListener('click',()=>{
    const open=$('#main-nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Đóng menu':'Mở menu');
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openDialog('search-dialog');}
    if(event.key==='Escape'&&menu){$('#main-nav').classList.remove('open');menu.setAttribute('aria-expanded','false');}
  });
  document.addEventListener('click',event=>{
    if(menu&&!event.target.closest('.header')){$('#main-nav').classList.remove('open');menu.setAttribute('aria-expanded','false');}
  });
  window.addEventListener('storage',event=>{
    if(event.key===cartKey){try{cart=U.cleanCart(JSON.parse(event.newValue||'[]'),products);}catch{cart=[];}updateCartCount();syncInquiryItems();if($('#quote-dialog')?.open)renderCart();}
  });

  async function copyText(text) {
    try {await navigator.clipboard.writeText(text);return true;} catch {
      const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';
      const parent=$('dialog[open]')||document.body;parent.append(area);area.select();
      let success=false;try{success=document.execCommand('copy');}catch{}area.remove();return success;
    }
  }
  function quoteText() {return ['DANH SÁCH YÊU CẦU BÁO GIÁ — PHÚC KHANG THỊNH PHÁT','',...cart.map(item=>`${products.find(p=>p.id===item.id).name}: ${item.quantity} sản phẩm`),'','Vui lòng tư vấn giá, phương án in logo, bao bì và tiến độ.'].join('\n');}
  async function copyQuote() {const ok=await copyText(quoteText());toast(ok?'Đã sao chép danh sách sản phẩm.':'Chưa sao chép được. Vui lòng dùng form yêu cầu tư vấn.');}
  function downloadText(text,filename) {
    const blob=new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $$('[data-inquiry-form]').forEach(form=>{
    const date=form.elements.delivery;if(date){const today=new Date();const local=new Date(today.getTime()-today.getTimezoneOffset()*60000);date.min=local.toISOString().slice(0,10);}
    form.addEventListener('submit',async event=>{
      event.preventDefault();if(!form.reportValidity())return;
      const fd=new FormData(form);const data=Object.fromEntries(fd.entries());data.consent=form.elements.consent.checked;
      const status=$('.form-status',form);status.replaceChildren();
      if(data.website){status.textContent='Vui lòng liên hệ trực tiếp qua hotline.';return;}
      const error=U.validateInquiry(data);if(error){status.textContent=error;return;}
      const body=U.composeInquiry(data,cart,products);const subject='Yêu cầu tư vấn quà tặng'+(data.company?' — '+data.company:'');
      const endpoint=C.formEndpoint;
      if(endpoint){
        const button=$('[type="submit"]',form);button.disabled=true;status.textContent='Đang gửi yêu cầu…';
        try {
          if(!/^https:\/\//i.test(endpoint))throw new Error('Endpoint phải dùng HTTPS.');
          const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
          let response;
          try{response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...data,website:undefined,products:cart,message:body}),signal:controller.signal});}
          finally{clearTimeout(timeout);}
          if(!response.ok)throw new Error('Không nhận được xác nhận gửi.');
          status.textContent='Yêu cầu đã được dịch vụ tiếp nhận. Phúc Khang Thịnh Phát sẽ liên hệ theo thông tin bạn cung cấp.';
          form.reset();return;
        } catch {status.textContent='Chưa gửi được yêu cầu. Bạn có thể gửi qua email bên dưới hoặc gọi hotline. ';}
        finally{button.disabled=false;}
      } else {status.textContent='Email yêu cầu đã được soạn. Hãy bấm Gửi trong ứng dụng email để hoàn tất. Nếu ứng dụng email chưa mở, dùng các lựa chọn bên dưới. ';}
      const emailLink=document.createElement('a');emailLink.href=U.mailto(C.email,subject,body);emailLink.textContent='Mở email';emailLink.className='text-link';
      const download=document.createElement('button');download.type='button';download.className='btn small';download.style.margin='12px 10px 0';download.textContent='Tải nội dung yêu cầu';download.addEventListener('click',()=>downloadText(body,'Yeu_cau_qua_tang_PKTP.txt'));
      const copy=document.createElement('button');copy.type='button';copy.className='btn small';copy.textContent='Sao chép';copy.addEventListener('click',async()=>toast(await copyText(body)?'Đã sao chép nội dung yêu cầu.':'Vui lòng tải nội dung yêu cầu.'));
      status.append(document.createElement('br'),emailLink,download,copy);
      if(!endpoint){const link=document.createElement('a');link.href=emailLink.href;document.body.append(link);link.click();link.remove();}
    });
  });
  $$('[data-budget-tool]').forEach(tool=>{
    const total=$('[data-budget-total]',tool),count=$('[data-budget-count]',tool),result=$('[data-budget-result]',tool);
    function calculate(){const n=Number(count.value),t=Number(total.value);result.textContent=Number.isFinite(t)&&t>=0&&Number.isInteger(n)&&n>=1?money(Math.floor(t/n)):'Nhập ngân sách và số lượng';}
    total.addEventListener('input',calculate);count.addEventListener('input',calculate);calculate();
  });
  $$('[data-phone-link]').forEach(el=>{el.href='tel:'+C.phone.replace(/\D/g,'');if(el.hasAttribute('data-phone-text'))el.textContent=C.phone;else if($('span',el))$('span',el).textContent=C.phone;});
  $$('a[href="tel:0905881561"]').forEach(el=>{el.href='tel:'+C.phoneSecondary.replace(/\D/g,'');el.textContent=C.phoneSecondary;});
  $$('[data-email-link]').forEach(el=>{el.href='mailto:'+C.email;if(el.hasAttribute('data-email-text'))el.textContent=C.email;});
  $$('[data-zalo]').forEach(el=>el.href=C.zalo);
  $$('[data-address]').forEach(el=>el.textContent=C.address);
  $$('[data-company]').forEach(el=>el.textContent=C.company);
  $$('[data-map]').forEach(el=>el.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(C.address));
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  function updateScroll(){
    frame=0;const y=window.scrollY;const top=$('.backtop');if(top)top.classList.toggle('visible',y>500);
    $$('.ambient i').forEach((el,i)=>el.style.transform=reducedMotion.matches?'none':`translateY(${Math.max(-80,Math.min(y*(i%2===0 ? .035 : -.025),80))}px)`);
  }
  window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateScroll);},{passive:true});
  reducedMotion.addEventListener?.('change',updateScroll);updateScroll();
  updateCartCount();syncInquiryItems();
})();
