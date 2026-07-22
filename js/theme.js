/* ============================================================
   KS SOFTWARE — THEME TOGGLE
   ============================================================ */
(function(){
  'use strict';

  var STORAGE_KEY = 'ks-software-theme';

  function applyTheme(theme){
    document.body.classList.toggle('light-mode', theme === 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch(e){}
  if(saved) applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var isLight = document.body.classList.contains('light-mode');
        var next = isLight ? 'dark' : 'light';
        applyTheme(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch(e){}
      });
    });
  });
})();
