/* ============================================================
   KS SOFTWARE — MAIN JS
   ============================================================ */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    /* ---------- Loading screen ---------- */
    var loader = document.querySelector('.loader');
    window.addEventListener('load', function(){
      setTimeout(function(){ loader && loader.classList.add('is-hidden'); }, 400);
    });

    /* ---------- Sticky header ---------- */
    var header = document.querySelector('.site-header');
    var lastY = window.scrollY;
    function onScroll(){
      var y = window.scrollY;
      if(header){
        header.classList.toggle('is-scrolled', y > 20);
      }
      var toTop = document.querySelector('.to-top');
      if(toTop) toTop.classList.toggle('is-visible', y > 700);
      lastY = y;
    }
    document.addEventListener('scroll', onScroll, {passive:true});
    onScroll();

    /* ---------- Mega menu (hover + keyboard) ---------- */
    document.querySelectorAll('.nav-item').forEach(function(item){
      var link = item.querySelector('.nav-link');
      if(!item.querySelector('.mega-menu')) return;
      function open(){ item.classList.add('is-open'); }
      function close(){ item.classList.remove('is-open'); }
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      link.addEventListener('click', function(e){
        e.preventDefault();
        item.classList.toggle('is-open');
      });
      link.addEventListener('keydown', function(e){
        if(e.key === 'Escape') close();
      });
    });
    document.addEventListener('click', function(e){
      if(!e.target.closest('.nav-item')){
        document.querySelectorAll('.nav-item.is-open').forEach(function(i){ i.classList.remove('is-open'); });
      }
    });

    /* ---------- Mobile nav ---------- */
    var navToggle = document.querySelector('.nav-toggle');
    var navShell = document.querySelector('.nav-shell');
    if(navToggle){
      navToggle.addEventListener('click', function(){
        navShell.classList.toggle('nav-open');
        document.body.classList.toggle('nav-locked');
      });
      document.querySelectorAll('.nav-links > .nav-item > a.nav-link:not([aria-haspopup])').forEach(function(link){
        link.addEventListener('click', function(){
          navShell.classList.remove('nav-open');
          document.body.classList.remove('nav-locked');
        });
      });
      document.querySelectorAll('.mega-menu a').forEach(function(link){
        link.addEventListener('click', function(){
          navShell.classList.remove('nav-open');
          document.body.classList.remove('nav-locked');
        });
      });
    }

    /* ---------- Search panel ---------- */
    var searchBtn = document.querySelector('[data-search-open]');
    var searchPanel = document.querySelector('.search-panel');
    if(searchBtn && searchPanel){
      searchBtn.addEventListener('click', function(){
        searchPanel.classList.add('is-open');
        var input = searchPanel.querySelector('input');
        input && input.focus();
      });
      searchPanel.addEventListener('click', function(e){
        if(e.target === searchPanel) searchPanel.classList.remove('is-open');
      });
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape') searchPanel.classList.remove('is-open');
      });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach(function(other){
          other.classList.remove('is-open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        });
        if(!isOpen){
          item.classList.add('is-open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded','true');
        }
      });
    });

    /* ---------- Animated stat counters ---------- */
    var counters = document.querySelectorAll('[data-count]');
    if(counters.length){
      var counterObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute('data-count'));
          var suffix = el.getAttribute('data-suffix') || '';
          var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'),10) : 0;
          var duration = 1600;
          var start = null;
          function step(ts){
            if(!start) start = ts;
            var progress = Math.min((ts-start)/duration, 1);
            var eased = 1 - Math.pow(1-progress, 3);
            var val = target * eased;
            el.textContent = decimals ? val.toFixed(decimals) + suffix : Math.round(val) + suffix;
            if(progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      }, {threshold:.5});
      counters.forEach(function(c){ counterObserver.observe(c); });
    }

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if(revealEls.length){
      var revealObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry, i){
          if(entry.isIntersecting){
            var el = entry.target;
            var delay = el.getAttribute('data-delay') || 0;
            setTimeout(function(){ el.classList.add('is-visible'); }, parseInt(delay,10));
            revealObserver.unobserve(el);
          }
        });
      }, {threshold:.15});
      revealEls.forEach(function(el){ revealObserver.observe(el); });
    }

    /* ---------- Back to top ---------- */
    var toTop = document.querySelector('.to-top');
    if(toTop){
      toTop.addEventListener('click', function(){
        window.scrollTo({top:0, behavior:'smooth'});
      });
    }

    /* ---------- Testimonial rail drag-scroll ---------- */
    var rail = document.querySelector('.testi-track-wrap');
    if(rail){
      var isDown = false, startX, scrollLeft;
      rail.addEventListener('mousedown', function(e){
        isDown = true; startX = e.pageX - rail.offsetLeft; scrollLeft = rail.scrollLeft; rail.style.cursor='grabbing';
      });
      ['mouseleave','mouseup'].forEach(function(evt){
        rail.addEventListener(evt, function(){ isDown = false; rail.style.cursor='grab'; });
      });
      rail.addEventListener('mousemove', function(e){
        if(!isDown) return;
        e.preventDefault();
        var x = e.pageX - rail.offsetLeft;
        rail.scrollLeft = scrollLeft - (x - startX) * 1.4;
      });
    }

    /* ---------- Current year ---------- */
    var yearEl = document.querySelector('[data-year]');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

  });
})();
