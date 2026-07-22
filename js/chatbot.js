/* ============================================================
   KS SOFTWARE — AI ASSISTANT (lightweight, on-page)
   ============================================================ */
(function(){
  'use strict';

  var WHATSAPP_NUMBER = '919177558811';
  var WHATSAPP_MSG = 'Hello KS Software Team,\nI need information about your IT Services.';

  var REPLIES = [
    { match: /price|cost|quote|budget/i, text: "Pricing depends on scope — see our Pricing page for starting ranges, or share a few details and we'll send a firm quote over WhatsApp." },
    { match: /mobile|app|android|ios|flutter/i, text: "We build native and cross-platform apps with Flutter and native Android. Want a look at recent app projects, or shall I connect you with a mobile specialist?" },
    { match: /web|website/i, text: "We design and develop business websites, portfolios, and e-commerce sites. What kind of website are you looking to build?" },
    { match: /college|exam|student|mcq|academic/i, text: "We build college and exam projects — MCQ platforms, student portals, and academic websites with full documentation. Want to see examples?" },
    { match: /pharma|medical|hospital|clinic/i, text: "We've built pharma and medical agency sites and apps — product catalogues, rep portals, and distributor management. Want to see recent examples?" },
    { match: /hire|job|career/i, text: "Glad you're interested! Check the Careers page for open roles, or send your resume over WhatsApp." },
    { match: /contact|talk|call|reach|whatsapp/i, text: "Easiest way is WhatsApp — tap below and our team will reply shortly." },
    { match: /hello|hi|hey/i, text: "Hey! I'm the KS Software assistant. Ask me about our services, pricing, or timelines — or tap a suggestion below." }
  ];
  var DEFAULT_REPLY = "Good question — that's best answered by the team directly. Want me to open WhatsApp so you can chat with someone from KS Software right now?";

  document.addEventListener('DOMContentLoaded', function(){
    var fab = document.querySelector('.chatbot-fab');
    var win = document.querySelector('.chat-window');
    var closeBtn = document.querySelector('.chat-close');
    var body = document.querySelector('.chat-body');
    var form = document.querySelector('.chat-input-row');
    var input = form ? form.querySelector('input') : null;
    var chips = document.querySelectorAll('.chat-chip');

    if(!fab || !win) return;

    function waLink(customMsg){
      return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(customMsg || WHATSAPP_MSG);
    }

    function scrollBottom(){ body.scrollTop = body.scrollHeight; }

    function addBubble(text, who){
      var b = document.createElement('div');
      b.className = 'chat-bubble ' + who;
      b.textContent = text;
      body.appendChild(b);
      scrollBottom();
    }

    function addWhatsappCTA(){
      var wrap = document.createElement('div');
      wrap.className = 'chat-bubble bot';
      var link = document.createElement('a');
      link.href = waLink();
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = 'btn btn-primary btn-sm';
      link.style.marginTop = '4px';
      link.textContent = 'Continue on WhatsApp';
      wrap.appendChild(document.createTextNode('Tap below whenever you\u2019re ready:'));
      wrap.appendChild(document.createElement('br'));
      wrap.appendChild(link);
      body.appendChild(wrap);
      scrollBottom();
    }

    function botReply(userText){
      var typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      scrollBottom();

      var found = REPLIES.find(function(r){ return r.match.test(userText); });
      var reply = found ? found.text : DEFAULT_REPLY;

      setTimeout(function(){
        typing.remove();
        addBubble(reply, 'bot');
        if(!found || /whatsapp|contact|talk|call|reach/i.test(userText)){
          addWhatsappCTA();
        }
      }, 700 + Math.random()*500);
    }

    function openChat(){
      win.classList.add('is-open');
      win.setAttribute('aria-hidden', 'false');
      input && input.focus();
    }
    function closeChat(){
      win.classList.remove('is-open');
      win.setAttribute('aria-hidden', 'true');
    }

    fab.addEventListener('click', function(){
      win.classList.contains('is-open') ? closeChat() : openChat();
    });
    closeBtn && closeBtn.addEventListener('click', closeChat);

    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        var q = chip.textContent.trim();
        addBubble(q, 'user');
        botReply(q);
      });
    });

    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var val = input.value.trim();
        if(!val) return;
        addBubble(val, 'user');
        input.value = '';
        botReply(val);
      });
    }
  });
})();
