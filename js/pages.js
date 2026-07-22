/* ============================================================
   KS SOFTWARE — INNER PAGE JS
   ============================================================ */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    /* ---------- Portfolio filters ---------- */
    var tabs = document.querySelectorAll('.filter-tab');
    var items = document.querySelectorAll('.portfolio-item');
    if(tabs.length && items.length){
      function applyFilter(cat){
        items.forEach(function(item){
          var match = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.classList.toggle('is-visible', match);
        });
      }
      applyFilter('all');
      tabs.forEach(function(tab){
        tab.addEventListener('click', function(){
          tabs.forEach(function(t){ t.classList.remove('is-active'); });
          tab.classList.add('is-active');
          applyFilter(tab.getAttribute('data-filter'));
        });
      });
    }

    /* ---------- Pricing monthly/yearly toggle ---------- */
    var priceSwitch = document.querySelector('.switch[data-pricing-switch]');
    if(priceSwitch){
      var amounts = document.querySelectorAll('[data-monthly]');
      priceSwitch.addEventListener('click', function(){
        var isYearly = priceSwitch.classList.toggle('is-on');
        amounts.forEach(function(el){
          el.textContent = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        });
        document.querySelectorAll('[data-period-label]').forEach(function(el){
          el.textContent = isYearly ? '/mo, billed yearly' : '/month';
        });
      });
    }

    /* ---------- Contact form: real submission via Web3Forms ---------- */
    var contactForm = document.querySelector('[data-contact-form]');
    if(contactForm){
      contactForm.addEventListener('submit', function(e){
        e.preventDefault();

        // Honeypot — if a bot filled this hidden field, silently drop the submission
        var honeypot = contactForm.querySelector('[name="botcheck"]');
        if(honeypot && honeypot.checked) return;

        var valid = true;
        contactForm.querySelectorAll('[required]').forEach(function(field){
          var wrap = field.closest('.form-field');
          var errorEl = wrap ? wrap.querySelector('.field-error') : null;
          var value = field.value.trim();
          var fieldValid = true;
          if(!value) fieldValid = false;
          if(field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fieldValid = false;
          if(errorEl) errorEl.textContent = fieldValid ? '' : 'This field needs your attention.';
          if(!fieldValid) valid = false;
        });

        var statusEl = contactForm.querySelector('.form-status');
        if(!valid){
          if(statusEl){ statusEl.textContent = 'Please check the highlighted fields.'; statusEl.style.color = '#F87171'; }
          return;
        }

        var btn = contactForm.querySelector('button[type="submit"]');
        var original = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending…';
        if(statusEl){ statusEl.textContent = ''; }

        var formData = new FormData(contactForm);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        })
        .then(function(response){ return response.json(); })
        .then(function(data){
          btn.disabled = false;
          btn.textContent = original;
          if(data.success){
            contactForm.reset();
            if(statusEl){ statusEl.textContent = 'Thanks — your message has been sent. We\u2019ll reply within 24 hours.'; statusEl.style.color = 'var(--success)'; }
          } else {
            if(statusEl){ statusEl.textContent = 'Something went wrong sending your message — please try WhatsApp instead.'; statusEl.style.color = '#F87171'; }
          }
        })
        .catch(function(){
          btn.disabled = false;
          btn.textContent = original;
          if(statusEl){ statusEl.textContent = 'Network error — please try again, or reach us on WhatsApp.'; statusEl.style.color = '#F87171'; }
        });
      });
    }

  });
})();
