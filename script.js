/* ============================================================
   BRUXINHA — Tarot, Magia & Terapias Holísticas
   script.js
   ------------------------------------------------------------
   Interações do site:
   • Ano automático no rodapé
   • Navegação suave (smooth scroll)
   • Navbar com sombra ao rolar + scrollspy
   • Menu mobile (hambúrguer)
   • Animações de entrada (scroll reveal)
   • Contadores animados das redes sociais
   • Accordion de serviços (um aberto por vez)
   • Agendamento com data mínima + horários
   • Cadastro rápido com validação + máscara de telefone
   • Modal de vídeo (YouTube / Instagram)
   • Botão "voltar ao topo"
   ============================================================ */

(function () {
  'use strict';

  /* ---------- UTILITÁRIOS ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ==========================================================
     1. ANO NO RODAPÉ
     ========================================================== */
  var anoEl = $('#ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ==========================================================
     2. SMOOTH SCROLL — links internos (#)
     ========================================================== */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id && id.length > 1) {
        var alvo = $(id);
        if (alvo) {
          e.preventDefault();
          alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ==========================================================
     3. NAVBAR — sombra ao rolar + scrollspy
     ========================================================== */
  var navbar = $('.navbar');
  var sections = $$('section[id]');
  var navLinks = $$('.navbar nav a[href^="#"]');

  function onScrollNavbar() {
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 6px 24px rgba(0, 0, 0, 0.55)'
        : 'none';
    }

    // Scrollspy: destaca a seção ativa no menu
    var pos = window.scrollY + 140;
    var atual = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) atual = sec.id;
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      link.style.color = href === '#' + atual ? 'var(--gold)' : '';
    });
  }

  window.addEventListener('scroll', onScrollNavbar, { passive: true });
  onScrollNavbar();

  /* ==========================================================
     4. MENU MOBILE — hambúrguer
     ========================================================== */
  var menuBtn = $('#menu-toggle');

  if (!menuBtn && navbar) {
    var containerNav = $('.container', navbar);
    if (containerNav) {
      menuBtn = document.createElement('button');
      menuBtn.id = 'menu-toggle';
      menuBtn.className = 'menu-toggle';
      menuBtn.setAttribute('aria-label', 'Abrir menu');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<span></span><span></span><span></span>';
      containerNav.appendChild(menuBtn);
    }
  }

  function fecharMenu() {
    document.body.classList.remove('menu-aberto');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var aberto = document.body.classList.toggle('menu-aberto');
      menuBtn.setAttribute('aria-expanded', String(aberto));
    });
    // Fecha o menu ao clicar em qualquer link da navegação
    $$('.navbar nav a').forEach(function (l) { l.addEventListener('click', fecharMenu); });
  }

  /* ==========================================================
     5. SCROLL REVEAL — animações de entrada
     ========================================================== */
  var podeAnimar = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches === false;

  function prepararReveal() {
    // Grupos de cartões recebem atraso escalonado (efeito cascata)
    $$('.social-grid, .video-grid, .cards-grid, .payment-grid').forEach(function (grid) {
      $$(':scope > *', grid).forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 90) + 'ms';
      });
    });
    // Títulos de seção também entram com suavidade
    $$('.sobre h2, .servicos h2, .agendamento h2, .cadastro h2, #pagamento h2, .secao-intro')
      .forEach(function (el) { el.classList.add('reveal'); });
  }

  if (podeAnimar && 'IntersectionObserver' in window) {
    prepararReveal();

    var ioReveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visivel');
          ioReveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(function (el) {
      // Se já está visível na carga, mostra imediatamente (evita flash)
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('reveal-visivel');
      } else {
        ioReveal.observe(el);
      }
    });
  }

  /* ==========================================================
     6. CONTADORES ANIMADOS — redes sociais
     ========================================================== */
  var contadores = $$('[data-contador]');

  function animarContador(el) {
    var alvo = parseFloat(el.getAttribute('data-contador'));
    if (isNaN(alvo)) return;
    var sufixo = el.getAttribute('data-contador-sufixo') || '';
    var duracao = 1400;
    var inicio = null;

    function passo(agora) {
      if (!inicio) inicio = agora;
      var p = Math.min((agora - inicio) / duracao, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(alvo * eased).toLocaleString('pt-BR') + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  if (podeAnimar && 'IntersectionObserver' in window && contadores.length) {
    var ioContador = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animarContador(entry.target);
          ioContador.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    contadores.forEach(function (el) { ioContador.observe(el); });
  } else {
    contadores.forEach(animarContador);
  }

  /* ==========================================================
     7. ACCORDION DE SERVIÇOS — um aberto por vez
     ========================================================== */
  var cardsServico = $$('.card-servico');

  function ajustarAltura(card) {
    var sub = $('.sub-servicos', card);
    if (!sub) return;
    sub.style.maxHeight = card.classList.contains('aberto')
      ? sub.scrollHeight + 'px'
      : '0px';
  }

  function toggleServico(card) {
    var jaAberto = card.classList.contains('aberto');

    // Fecha todos
    $$('.card-servico.aberto').forEach(function (c) {
      c.classList.remove('aberto');
      ajustarAltura(c);
    });

    // Abre o clicado (se não estava aberto)
    if (!jaAberto) {
      card.classList.add('aberto');
      ajustarAltura(card);
    }
  }

  $$('[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleServico(btn.closest('.card-servico'));
    });
  });

  // Tarot (destaque) aberto por padrão
  var destaque = $('.card-servico.destaque');
  if (destaque) {
    destaque.classList.add('aberto');
    ajustarAltura(destaque);
  }

  // Recalcula alturas no resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cardsServico.forEach(ajustarAltura);
    }, 150);
  });

  /* ==========================================================
     8. AGENDAMENTO — data mínima + horários
     ========================================================== */
  var inputData = $('#data-consulta');
  var horariosGrid = $('#horarios');
  var btnConfirmar = $('#btn-confirmar-agenda');
  var msgAgenda = $('#msg-agenda');
  var horarioSelecionado = null;

  // Impede selecionar datas passadas
  if (inputData) {
    var hoje = new Date();
    var ajuste = hoje.getTimezoneOffset();
    var dataLocal = new Date(hoje.getTime() - ajuste * 60000);
    inputData.min = dataLocal.toISOString().split('T')[0];
  }

  if (horariosGrid) {
    horariosGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-horario');
      if (!btn) return;
      $$('.btn-horario', horariosGrid).forEach(function (b) {
        b.classList.remove('selecionado');
      });
      btn.classList.add('selecionado');
      horarioSelecionado = btn.textContent.trim();
    });
  }

  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function () {
      if (!inputData || !msgAgenda) return;
      var data = inputData.value;

      if (!data || !horarioSelecionado) {
        msgAgenda.textContent = '✦ Escolha uma data e um horário para confirmar.';
        return;
      }

      var partes = data.split('-');
      msgAgenda.textContent =
        '☾ Consulta solicitada para ' + partes[2] + '/' + partes[1] + '/' + partes[0] +
        ' às ' + horarioSelecionado + '. Em breve entraremos em contato.';
    });
  }

  /* ==========================================================
     9. CADASTRO RÁPIDO — validação + máscara de telefone
     ========================================================== */
  var formCadastro = $('#form-cadastro');

  if (formCadastro) {
    formCadastro.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#nome').value.trim();
      var email = $('#email').value.trim();
      var msg = $('#msg-cadastro');
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nome) {
        msg.textContent = '✦ Por favor, informe seu nome.';
        $('#nome').focus();
        return;
      }
      if (!emailRegex.test(email)) {
        msg.textContent = '✦ Por favor, informe um e-mail válido.';
        $('#email').focus();
        return;
      }

      msg.textContent = '☾ Cadastro recebido! Em breve entraremos em contato. ✦';
      formCadastro.reset();
      var tel = $('#telefone');
      if (tel) tel.value = '';
    });
  }

  // Máscara simples de telefone (opcional, não precisa estar completo)
  var inputTel = $('#telefone');
  if (inputTel) {
    inputTel.addEventListener('input', function () {
      var v = inputTel.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
      } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      } else if (v.length > 0) {
        v = '(' + v;
      }
      inputTel.value = v;
    });
  }

  /* ==========================================================
     10. MODAL DE VÍDEO — YouTube & Instagram
     ========================================================== */
  var modal = $('#modal-video');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-video';
    modal.className = 'modal-video';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="modal-video-content">' +
        '<button class="modal-video-close" aria-label="Fechar">×</button>' +
        '<div class="modal-video-embed" id="modal-video-embed"></div>' +
      '</div>';
    document.body.appendChild(modal);
  }

  var modalEmbed = $('#modal-video-embed');

  // Converte link do YouTube / Instagram em iframe de embed
  function montarEmbed(url) {
    if (!url) return '<p class="modal-video-error">Nenhum vídeo vinculado ainda.</p>';
    var u = url.trim();

    // YouTube — vídeo (watch, shorts, youtu.be, embed)
    var ytVid = u.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (ytVid) {
      return '<iframe src="https://www.youtube.com/embed/' + ytVid[1] +
        '" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }

    // YouTube — canal (@nome) → abre o canal em nova aba
    if (u.indexOf('youtube.com/@') !== -1 || u.indexOf('youtube.com/channel/') !== -1) {
      window.open(u, '_blank', 'noopener');
      return null;
    }

    // Instagram — Reel
    var igReel = u.match(/instagram\.com\/reel\/([\w-]+)/);
    if (igReel) {
      return '<iframe src="https://www.instagram.com/reel/' + igReel[1] +
        '/embed" title="Instagram" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen></iframe>';
    }

    // Instagram — Post
    var igPost = u.match(/instagram\.com\/p\/([\w-]+)/);
    if (igPost) {
      return '<iframe src="https://www.instagram.com/p/' + igPost[1] +
        '/embed" title="Instagram" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen></iframe>';
    }

    // Instagram — perfil → abre o perfil em nova aba
    if (u.indexOf('instagram.com/') !== -1) {
      window.open(u, '_blank', 'noopener');
      return null;
    }

    return '<p class="modal-video-error">Formato de link não reconhecido.</p>';
  }

  function abrirVideo(url) {
    var embed = montarEmbed(url);
    if (embed === null) return; // já abriu em nova aba
    if (embed) {
      modalEmbed.innerHTML = embed;
      modal.classList.add('aberto');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function fecharVideo() {
    modal.classList.remove('aberto');
    modal.setAttribute('aria-hidden', 'true');
    modalEmbed.innerHTML = '';
    document.body.style.overflow = '';
  }

  // Vincula os cards de vídeo (data-video)
  $$('[data-video]').forEach(function (el) {
    el.addEventListener('click', function () {
      abrirVideo(el.getAttribute('data-video'));
    });
    // Acessibilidade: Enter / Espaço ativam o card
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirVideo(el.getAttribute('data-video'));
      }
    });
  });

  // Fechar: botão ×, clique fora e tecla ESC
  var btnFecharModal = $('.modal-video-close', modal);
  if (btnFecharModal) btnFecharModal.addEventListener('click', fecharVideo);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) fecharVideo();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharVideo();
  });

  /* ==========================================================
     11. BOTÃO VOLTAR AO TOPO
     ========================================================== */
  var btnTopo = $('#btn-topo');
  if (!btnTopo) {
    btnTopo = document.createElement('button');
    btnTopo.id = 'btn-topo';
    btnTopo.className = 'btn-topo';
    btnTopo.setAttribute('aria-label', 'Voltar ao topo');
    btnTopo.title = 'Voltar ao topo';
    btnTopo.innerHTML = '↑';
    document.body.appendChild(btnTopo);
  }

  window.addEventListener('scroll', function () {
    var visivel = window.scrollY > 400;
    btnTopo.classList.toggle('visivel', visivel);
  }, { passive: true });

  btnTopo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();

