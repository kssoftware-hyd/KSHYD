/* ============================================================
   KS SOFTWARE — GSAP / SCROLL / CURSOR ANIMATIONS
   ============================================================ */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGSAP = typeof gsap !== 'undefined';

    /* ---------- AOS init ---------- */
    if(typeof AOS !== 'undefined'){
      AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60, disable: reduceMotion });
    }

    /* ---------- Hero load sequence ---------- */
    if(hasGSAP && !reduceMotion){
      var tl = gsap.timeline({defaults:{ease:'power3.out'}});
      tl.from('.hero-copy .eyebrow', {opacity:0, y:16, duration:.6})
        .from('.hero-title', {opacity:0, y:26, duration:.8}, '-=.35')
        .from('.hero-desc', {opacity:0, y:20, duration:.7}, '-=.5')
        .from('.hero-cta', {opacity:0, y:20, duration:.7}, '-=.5')
        .from('.hero-trust', {opacity:0, y:16, duration:.6}, '-=.45')
        .from('.orbit-stage', {opacity:0, scale:.88, duration:1}, '-=.9')
        .from('.orbit-node', {opacity:0, scale:.5, stagger:.12, duration:.6}, '-=.5');
    }

    /* ---------- Mouse parallax on hero orbit ---------- */
    var stage = document.querySelector('.orbit-stage');
    var hero = document.querySelector('.hero');
    if(stage && hero && !reduceMotion){
      hero.addEventListener('mousemove', function(e){
        var rect = hero.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - .5;
        var relY = (e.clientY - rect.top) / rect.height - .5;
        var moveX = relX * 22;
        var moveY = relY * 22;
        if(hasGSAP){
          gsap.to(stage, {x:moveX, y:moveY, duration:.6, ease:'power2.out'});
        } else {
          stage.style.transform = 'translate(' + moveX + 'px,' + moveY + 'px)';
        }
      });
      hero.addEventListener('mouseleave', function(){
        if(hasGSAP) gsap.to(stage, {x:0, y:0, duration:.8, ease:'power3.out'});
      });
    }

    /* ---------- Magnetic buttons ---------- */
    if(!reduceMotion){
      document.querySelectorAll('.btn').forEach(function(btn){
        btn.addEventListener('mousemove', function(e){
          var r = btn.getBoundingClientRect();
          var mx = (e.clientX - r.left - r.width/2) * .25;
          var my = (e.clientY - r.top - r.height/2) * .35;
          btn.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
        });
        btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
      });
    }

    /* ---------- Custom cursor ---------- */
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if(dot && ring && window.matchMedia('(pointer: fine)').matches){
      var rx=0, ry=0, dx=0, dy=0;
      document.addEventListener('mousemove', function(e){
        dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
        rx = e.clientX; ry = e.clientY;
      });
      (function loop(){
        dx += (rx-dx)*.16; dy += (ry-dy)*.16;
        ring.style.left = dx + 'px'; ring.style.top = dy + 'px';
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll('a, button, .glass-card').forEach(function(el){
        el.addEventListener('mouseenter', function(){ ring.classList.add('is-active'); });
        el.addEventListener('mouseleave', function(){ ring.classList.remove('is-active'); });
      });
    }

    /* ---------- Section scroll reveals for section heads (GSAP ScrollTrigger optional) ---------- */
    if(hasGSAP && typeof ScrollTrigger !== 'undefined' && !reduceMotion){
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.arc-divider path').forEach(function(path){
        var len = path.getTotalLength();
        gsap.set(path, {strokeDasharray: len, strokeDashoffset: len});
        gsap.to(path, {
          strokeDashoffset:0, duration:1.4, ease:'power2.out',
          scrollTrigger:{ trigger: path, start:'top 85%' }
        });
      });
    }

    /* ---------- Swiper (case studies / testimonials) if present ---------- */
    if(typeof Swiper !== 'undefined' && document.querySelector('.case-swiper')){
      new Swiper('.case-swiper', {
        slidesPerView: 1.15,
        spaceBetween: 22,
        breakpoints:{ 768:{slidesPerView:2.2}, 1100:{slidesPerView:3} }
      });
    }
  });
})();
