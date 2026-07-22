/* ============================================================
   KS SOFTWARE — FORM VALIDATION
   ============================================================ */
(function(){
  'use strict';

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var form = document.querySelector('[data-newsletter-form]');
    if(!form) return;
    var input = form.querySelector('input[type="email"]');
    var msg = form.parentElement.querySelector('.form-msg');
    var btn = form.querySelector('button');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var value = input.value.trim();

      if(!value){
        showMsg('Enter your email address to subscribe.', false);
        input.focus();
        return;
      }
      if(!isValidEmail(value)){
        showMsg('That email doesn\u2019t look right — double-check and try again.', false);
        input.focus();
        return;
      }

      var originalLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';

      var formData = new FormData();
      formData.append('access_key', '4a6a5640-e2a3-4531-a486-997607383b6c');
      formData.append('subject', 'New Notify-Me Signup \u2013 KS Software Website');
      formData.append('from_name', 'KS Software Website');
      formData.append('email', value);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(function(response){ return response.json(); })
      .then(function(data){
        btn.disabled = false;
        btn.textContent = originalLabel;
        if(data.success){
          input.value = '';
          showMsg('You\u2019re subscribed \u2014 look out for updates from KS Software.', true);
        } else {
          showMsg('Something went wrong \u2014 please try again.', false);
        }
      })
      .catch(function(){
        btn.disabled = false;
        btn.textContent = originalLabel;
        showMsg('Network error \u2014 please try again.', false);
      });
    });

    function showMsg(text, success){
      if(!msg) return;
      msg.textContent = text;
      msg.style.color = success ? 'var(--success)' : '#F87171';
    }
  });
})();
