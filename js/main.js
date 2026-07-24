 // STACKLY main JS
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Hero: split title into animated words ----
  document.querySelectorAll('[data-split]').forEach(el => {
    const walker = (node) => {
      Array.from(node.childNodes).forEach(child => {
        if(child.nodeType === 3){ // text node
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(chunk => {
            if(chunk.trim() === ''){ frag.appendChild(document.createTextNode(chunk)); return; }
            const w = document.createElement('span');
            w.className = 'word';
            const inner = document.createElement('span');
            inner.textContent = chunk;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if(child.nodeType === 1){
          walker(child);
        }
      });
    };
    walker(el);
    let i = 0;
    el.querySelectorAll('.word > span').forEach(span => { span.parentElement.style.setProperty('--w', i++); });
  });

  // ---- Hero: rotating headline text ----
  const heroRotator = document.getElementById('heroRotator');
  if(heroRotator && !reduceMotion){
    const headlines = [
      'Grow Wealth.',
      'Build Resilience.',
      'Protect Capital.',
      'Plan with Confidence.',
      'Invest Smarter.'
    ];
    let rotatorIndex = 0;
    setInterval(() => {
      heroRotator.classList.add('rotator-fade-out');
      setTimeout(() => {
        rotatorIndex = (rotatorIndex + 1) % headlines.length;
        heroRotator.textContent = headlines[rotatorIndex];
        heroRotator.classList.remove('rotator-fade-out');
      }, 400);
    }, 2000);
  }

  // ---- Hero: animated market network canvas ----
  const heroCanvas = document.getElementById('heroCanvas');
  if(heroCanvas && !reduceMotion){
    const ctx = heroCanvas.getContext('2d');
    const heroSection = heroCanvas.closest('.hero');
    let w, h, dots = [];
    const DOT_COUNT = 46;

    function resize(){
      w = heroCanvas.width = heroSection.offsetWidth;
      h = heroCanvas.height = heroSection.offsetHeight;
    }
    function init(){
      resize();
      dots = Array.from({length: DOT_COUNT}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25 - .05,
        r: Math.random()*1.6+.6
      }));
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if(d.x < 0) d.x = w; if(d.x > w) d.x = 0;
        if(d.y < -20) d.y = h+20; if(d.y > h+20) d.y = -20;
      });
      for(let i=0;i<dots.length;i++){
        for(let j=i+1;j<dots.length;j++){
          const a = dots[i], b = dots[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < 130){
            ctx.strokeStyle = `rgba(10,37,64,${(1-dist/130)*.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(212,175,55,.55)';
        ctx.fill();
      });
      requestAnimationFrame(step);
    }
    init();
    requestAnimationFrame(step);
    window.addEventListener('resize', () => { resize(); });
  }

  // ---- Hero: mouse parallax on visual + badges ----
  const heroVisual = document.getElementById('heroVisual');
  if(heroVisual && !reduceMotion && window.matchMedia('(min-width:961px)').matches){
    const heroSection = heroVisual.closest('.hero');
    const badges = heroVisual.querySelectorAll('.hero-badge');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left)/rect.width - .5;
      const py = (e.clientY - rect.top)/rect.height - .5;
      heroVisual.style.transform = `rotateY(${px*4}deg) rotateX(${-py*4}deg)`;
      badges.forEach((b,i) => { b.style.transform = `translate(${px*(14+i*6)}px, ${py*(14+i*6)}px)`; });
    });
    heroSection.addEventListener('mouseleave', () => {
      heroVisual.style.transform = '';
      badges.forEach(b => b.style.transform = '');
    });
    heroVisual.style.transformStyle = 'preserve-3d';
    heroSection.style.perspective = '1200px';
  }

  // ---- Magnetic buttons ----
  document.querySelectorAll('.magnetic').forEach(btn => {
    if(reduceMotion) return;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*.18}px, ${y*.35}px)`;
      const txt = btn.querySelector('.btn-txt');
      if(txt) txt.style.transform = `translate(${x*.08}px, ${y*.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      const txt = btn.querySelector('.btn-txt');
      if(txt) txt.style.transform = '';
    });
  });

  // ---- Hero badge count-up (YTD Return, Assets Managed) ----
  document.querySelectorAll('[data-count-badge]').forEach(el => {
    const target = parseFloat(el.dataset.countBadge);
    const suffix = el.dataset.badgeSuffix || '';
    const prefix = el.dataset.badgePrefix || '';
    const decimals = (el.dataset.countBadge.split('.')[1] || '').length;
    let cur = 0;
    const step = Math.max(target/50, .01);
    const tick = () => {
      cur += step;
      if(cur >= target){ el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
      el.textContent = prefix + cur.toFixed(decimals) + suffix;
      requestAnimationFrame(tick);
    };
    setTimeout(tick, 500);
  });

  // ---- Live ticker value micro-fluctuation ----
  const ticker = document.getElementById('tickerVal');
  if(ticker && !reduceMotion){
    let val = 128.42;
    setInterval(() => {
      const delta = (Math.random()-.48) * 0.6;
      val = Math.max(120, val + delta);
      ticker.textContent = '$' + val.toFixed(2);
      ticker.classList.remove('tick-up','tick-down');
      ticker.classList.add(delta >= 0 ? 'tick-up' : 'tick-down');
      clearTimeout(ticker._t);
      ticker._t = setTimeout(() => ticker.classList.remove('tick-up','tick-down'), 600);
    }, 2200);
  }

  // Nav scroll
  const nav = document.querySelector('.nav');
  if(nav){
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll); onScroll();
  }
  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const lockScroll = (shouldLock) => {
    document.body.classList.toggle('no-scroll', shouldLock);
    document.documentElement.classList.toggle('no-scroll', shouldLock);
  };
  if(toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      lockScroll(isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    window.addEventListener('resize', () => {
      if(window.innerWidth > 960 && links.classList.contains('open')) {
        links.classList.remove('open');
        lockScroll(false);
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold: .12});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s').forEach((el, i) => {
    el.style.setProperty('--i', el.dataset.stag || (i%6));
    io.observe(el);
  });

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const co = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target; const target = +el.dataset.count; let cur = 0;
      const step = Math.max(1, target/60);
      const tick = () => { cur += step; if(cur >= target){ el.textContent = target.toLocaleString() + (el.dataset.suffix||''); } else { el.textContent = Math.floor(cur).toLocaleString() + (el.dataset.suffix||''); requestAnimationFrame(tick); } };
      tick(); co.unobserve(el);
    });
  }, {threshold:.4});
  counters.forEach(c => co.observe(c));

  // FAQ
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => item.classList.toggle('open'));
  });

  // Social icons -> 404
  document.querySelectorAll('[data-social]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); location.href = './404error.html'; });
  });

  // Newsletter validation
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  if(newsletterForm && newsletterEmail){
    const newsletterError = newsletterForm.querySelector('.form-error');
    const subscribeButton = newsletterForm.querySelector('button');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = newsletterEmail.value.trim();

      if(!emailPattern.test(value)){
        newsletterError.textContent = 'Please enter a valid email like jane@example.com.';
        newsletterEmail.focus();
        return;
      }

      newsletterError.textContent = '';
      subscribeButton.textContent = 'Subscribed ✓';
      subscribeButton.disabled = true;

      window.setTimeout(() => {
        subscribeButton.textContent = 'Subscribe';
        subscribeButton.disabled = false;
        newsletterForm.reset();
      }, 2000);
    });

    newsletterEmail.addEventListener('input', () => {
      if(newsletterError.textContent) newsletterError.textContent = '';
    });
  }

  // ---- Contact form validation (single source of truth — do not duplicate this in contact.html) ----
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');
    const contactError = contactForm.querySelector('.form-error');
    const contactSuccess = contactForm.querySelector('.form-success');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const btnLabel = submitButton ? submitButton.querySelector('.btn-label') : null;
    const btnIcon = submitButton ? submitButton.querySelector('i') : null;

    // Letters (incl. accents), spaces, hyphens, apostrophes only — no digits/symbols.
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ'\-]+)*$/;
    // Practical local@domain.tld email validation.
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    let resetTimer = null;

    const showError = (field, message) => {
      if(contactError) contactError.textContent = message;
      if(field){ field.setAttribute('aria-invalid', 'true'); field.focus(); }
    };

    const clearErrors = () => {
      if(contactError) contactError.textContent = '';
      [contactName, contactEmail, contactSubject, contactMessage].forEach(f => {
        if(f) f.setAttribute('aria-invalid', 'false');
      });
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const nameValue = contactName ? contactName.value.trim() : '';
      const emailValue = contactEmail ? contactEmail.value.trim() : '';
      const subjectValue = contactSubject ? contactSubject.value.trim() : '';
      const messageValue = contactMessage ? contactMessage.value.trim() : '';

      if(!nameValue || !namePattern.test(nameValue)){
        showError(contactName, 'Full name must contain letters only (no numbers or symbols).');
        return;
      }
      if(!emailValue || !emailPattern.test(emailValue)){
        showError(contactEmail, 'Please enter a valid email address, e.g. jane@example.com.');
        return;
      }
      if(!subjectValue){
        showError(contactSubject, 'Subject is required.');
        return;
      }
      if(!messageValue){
        showError(contactMessage, 'Message is required.');
        return;
      }

      if(contactSuccess){
        contactSuccess.textContent = 'Message sent ✓';
        contactSuccess.style.display = 'block';
      }

      if(submitButton){
        submitButton.disabled = true;
        if(btnLabel) btnLabel.textContent = 'Sent';
        if(btnIcon) btnIcon.className = 'fa-solid fa-check';
      }

      if(resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        if(submitButton){
          submitButton.disabled = false;
          if(btnLabel) btnLabel.textContent = 'Send Message';
          if(btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';
        }
        if(contactSuccess){
          contactSuccess.textContent = '';
          contactSuccess.style.display = 'none';
        }
        contactForm.reset();
        resetTimer = null;
      }, 2000);
    });

    [contactName, contactEmail, contactSubject, contactMessage].forEach(field => {
      if(!field) return;
      field.addEventListener('input', () => {
        field.setAttribute('aria-invalid', 'false');
        if(contactError) contactError.textContent = '';
      });
    });
  }

  // Login role show
  const roleBtns = document.querySelectorAll('.role-btn');
  const roleSel = document.getElementById('role');
  if(roleBtns.length && roleSel){
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        roleSel.value = btn.dataset.role || 'user';
      });
    });
  }
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('email');
  const loginPassword = document.getElementById('password');
  if(loginForm && loginEmail && loginPassword){
    const loginError = loginForm.querySelector('.form-error');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = loginEmail.value.trim();
      const passwordValue = loginPassword.value;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      loginError.textContent = '';

      if(!emailPattern.test(emailValue)){
        loginError.textContent = 'Please enter a valid email like jane@example.com.';
        loginEmail.focus();
        return;
      }
      if(passwordValue.length < 8){
        loginError.textContent = 'Password must be at least 8 characters.';
        loginPassword.focus();
        return;
      }

      const role = roleSel ? roleSel.value : 'user';
      localStorage.setItem('stackly_role', role);
      localStorage.setItem('stackly_email', emailValue);
      location.href = role === 'admin' ? './admin-dashboard.html' : './user-dashboard.html';
    });

    [loginEmail, loginPassword].forEach(field => {
      field.addEventListener('input', () => {
        if(loginError.textContent) loginError.textContent = '';
      });
    });
  }

  // Registration form handling
  const registerForm = document.getElementById('registerForm');
  const regName = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regPassword = document.getElementById('regPassword');
  const regPasswordConfirm = document.getElementById('regPasswordConfirm');
  const regRoleInput = document.getElementById('regRole');
  if(registerForm){
    // role buttons for register
    const regRoleBtns = document.querySelectorAll('#roleButtonsReg .role-btn');
    if(regRoleBtns.length && regRoleInput){
      regRoleBtns.forEach(btn => btn.addEventListener('click', () => {
        regRoleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        regRoleInput.value = btn.dataset.role || 'user';
      }));
    }
    // password toggles handled globally below
    const regError = registerForm.querySelector('.form-error');
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ '\-]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if(!regName.value.trim() || !namePattern.test(regName.value.trim())){
        regError.textContent = 'Please enter a valid full name.'; regName.focus(); return;
      }
      if(!emailPattern.test(regEmail.value.trim())){
        regError.textContent = 'Please enter a valid email like jane@example.com.'; regEmail.focus(); return;
      }
      if(!regPassword.value || regPassword.value.length < 8){
        regError.textContent = 'Password must be at least 8 characters.'; regPassword.focus(); return;
      }
      if(regPassword.value !== regPasswordConfirm.value){
        regError.textContent = 'Passwords do not match.'; regPasswordConfirm.focus(); return;
      }
      // Simulate account creation (demo)
      localStorage.setItem('stackly_role', regRoleInput?.value || 'user');
      localStorage.setItem('stackly_email', regEmail.value.trim());
      registerForm.reset();
      registerForm.querySelector('button').textContent = 'Created ✓';
      setTimeout(() => location.href = './login.html', 800);
    });
  }

  // Global password show/hide toggles (works for login and register)
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if(!input) return;
    if(!btn.querySelector('i') && !btn.textContent.trim()) btn.textContent = 'Show';
    btn.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      const icon = btn.querySelector('i');
      if(icon){
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      } else {
        btn.textContent = showing ? 'Show' : 'Hide';
      }
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });
  // Dashboard: logout, sidebar toggle, section switching
  const logout = document.getElementById('logoutBtn');
  if(logout) logout.addEventListener('click', (e)=>{e.preventDefault(); localStorage.clear(); location.href='./login.html';});
  const mobToggle = document.querySelector('.mob-toggle');
  const side = document.querySelector('.side');
  if(mobToggle && side) mobToggle.addEventListener('click', () => side.classList.toggle('open'));

  document.querySelectorAll('.side-nav a[data-sec]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = a.dataset.sec;
      document.querySelectorAll('.side-nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('[data-panel]').forEach(p => p.style.display = p.dataset.panel === sec ? '' : 'none');
      if(window.innerWidth<960) side.classList.remove('open');
    });
  });

  // Fill user email in dashboard
  const userEmail = document.getElementById('userEmail');
  if(userEmail) userEmail.textContent = localStorage.getItem('stackly_email') || 'user@stackly.com';

  // Current year
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();