/* ============================================================
   BRUXINHA — Tarot, Magia & Terapias Holísticas
   script.js
   ------------------------------------------------------------
   Interações do site:
   • Atmosfera: estrelas, constelação, estrela cadente, neblina
   • Cursor customizado (✦ / ☾)
   • Carta de tarot com inclinação 3D seguindo o mouse
   • Ano automático no rodapé
   • Navegação suave (smooth scroll)
   • Navbar com sombra ao rolar + scrollspy
   • Menu mobile (hambúrguer)
   • Animações de entrada (scroll reveal com blur)
   • Contadores animados das redes sociais
   • Accordion de serviços (um aberto por vez)
   • Agendamento com data mínima + horários
   • Cadastro rápido com validação + máscara de telefone
   • Modal de vídeo (YouTube / Instagram) — "vela apagada"
   • Botão "voltar ao topo"
   ============================================================ */

(function () {
  'use strict';

  /* ---------- UTILITÁRIOS ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var podeAnimar = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches === false;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
  var isMobile = window.matchMedia &&
    (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(hover: none)').matches);

  /* ==========================================================
     LOOP DE ANIMAÇÃO COMPARTILHADO
     ----------------------------------------------------------
     Um único requestAnimationFrame para todas as animações
     contínuas (canvas, chama, brilho, luz global).
     • Desktop: ~60fps
     • Mobile:  ~25fps (intervalo de 40ms)
     • Pausa quando a aba não está visível (document.hidden)
     Isso elimina o travamento causado por múltiplos rAF
     rodando em paralelo no mobile.
     ========================================================== */
  var animadores = [];
  var ultimoTick = 0;
  var intervaloQuadro = isMobile ? 40 : 16;

  function registrarAnimador(fn) {
    if (animadores.indexOf(fn) === -1) animadores.push(fn);
  }

  function tickAnimacoes(agora) {
    if (!document.hidden && agora - ultimoTick >= intervaloQuadro) {
      ultimoTick = agora;
      for (var i = 0; i < animadores.length; i++) {
        try { animadores[i](agora); } catch (e) { /* ignora falha isolada de frame */ }
      }
    }
    requestAnimationFrame(tickAnimacoes);
  }
  requestAnimationFrame(tickAnimacoes);

  /* ==========================================================
     ATMOSFERA — camada de fundo (estrelas + constelação)
     ========================================================== */
  function criarAtmosfera() {
    if (!podeAnimar) return;

    // Fundo fixo com vinheta + névoa
    var fundo = $('.atmosfera-fundo');
    if (!fundo) {
      fundo = document.createElement('div');
      fundo.className = 'atmosfera-fundo';
      document.body.insertBefore(fundo, document.body.firstChild);
    }

    var neblina = $('.neblina', fundo);
    if (!neblina) {
      neblina = document.createElement('div');
      neblina.className = 'neblina';
      fundo.appendChild(neblina);
    }

    // Canvas de estrelas — muito apagado, econômico
    var canvas = $('.canvas-estrelas', fundo);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'canvas-estrelas';
      fundo.appendChild(canvas);
    }

    var ctx = canvas.getContext('2d');
    var estrelas = [];
    var poeira = [];
    var largura, altura;

    // No mobile reduz a resolução do canvas e a quantidade de partículas
    var escala = isMobile ? 0.5 : 1;

    function redimensionar() {
      largura = canvas.width = Math.max(1, Math.floor(window.innerWidth * escala));
      altura = canvas.height = Math.max(1, Math.floor(window.innerHeight * escala));
      estrelas = [];
      var n = Math.min(isMobile ? 28 : 70, Math.floor(largura * altura / (isMobile ? 42000 : 26000)));
      for (var i = 0; i < n; i++) {
        estrelas.push({
          x: Math.random() * largura,
          y: Math.random() * altura,
          r: Math.random() * 0.9 + 0.2,
          base: Math.random() * 0.5 + 0.14,
          fase: Math.random() * Math.PI * 2,
          vel: 0.0006 + Math.random() * 0.0012,
          dx: 0, dy: 0,
          per: 30 + Math.random() * 20,
          amp: 0.6 + Math.random() * 1.2,
          pFase: Math.random() * Math.PI * 2
        });
      }

      poeira = [];
      var np = Math.min(isMobile ? 8 : 24, Math.floor(largura * altura / (isMobile ? 110000 : 90000)));
      for (var j = 0; j < np; j++) {
        poeira.push({
          x: Math.random() * largura,
          y: Math.random() * altura,
          r: Math.random() * 1.1 + 0.3,
          vy: (Math.random() - 0.5) * 0.06,
          vx: (Math.random() - 0.5) * 0.045,
          base: Math.random() * 0.22 + 0.06,
          fase: Math.random() * Math.PI * 2,
          vel: 0.0003 + Math.random() * 0.0008,
          dirY: Math.random() < 0.5 ? -1 : 1,
          px: 0, py: 0
        });
      }
    }

    function desenhar(agora) {
      ctx.clearRect(0, 0, largura, altura);

      for (var i = 0; i < estrelas.length; i++) {
        var e = estrelas[i];
        var t = agora / 1000;
        var wob = Math.sin(t * (Math.PI * 2 / e.per) + e.pFase) * e.amp;
        var dx = Math.sin(t * (Math.PI * 2 / e.per) * 0.7 + e.pFase) * e.amp * 0.5;
        var a = e.base * (0.7 + 0.3 * Math.sin(agora * e.vel + e.fase));
        ctx.beginPath();
        ctx.arc(e.x + dx, e.y + wob, e.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 236, 228,' + a.toFixed(3) + ')';
        ctx.fill();
      }

      for (var k = 0; k < poeira.length; k++) {
        var p = poeira[k];
        p.y += p.vy * p.dirY;
        p.x += p.vx;
        if (p.y < -10) { p.y = altura + 10; p.x = Math.random() * largura; }
        if (p.y > altura + 10) { p.y = -10; p.x = Math.random() * largura; }
        if (p.x < -10) p.x = largura + 10;
        if (p.x > largura + 10) p.x = -10;
        var pa = p.base * (0.8 + 0.2 * Math.sin(agora * p.vel + p.fase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(215, 185, 140,' + pa.toFixed(3) + ')';
        ctx.fill();
      }
    }

    registrarAnimador(desenhar);

    window.addEventListener('resize', function () {
      redimensionar();
    }, { passive: true });

    redimensionar();
  }

  /* ==========================================================
     CONSTELAÇÃO — aparece discretamente após alguns segundos
     ========================================================== */
  function revelarConstelacao() {
    var constel = $('.constelacao');
    if (!constel || !podeAnimar) return;
    setTimeout(function () {
      constel.classList.add('visivel');
    }, 2600);
  }

  /* ==========================================================
     ESTRELA CADENTE — cruza lentamente ao entrar
     ========================================================== */
  function lancarEstrelaCadente() {
    var estrela = $('.estrela-cadente');
    if (!estrela) return;
    document.body.classList.add('carregado');
  }

  /* ==========================================================
     ABERTURA CINEMATOGRÁFICA DO HERO
     ------------------------------------------------------------
     A cena não "aparece" — ela se revela, como se uma vela
     estivesse sendo acesa num cômodo escuro. A ordem segue a
     lógica da luz, não a ordem do HTML: primeiro a luz ambiente,
     depois os objetos que refletem luz (lua, cristal), depois o
     objeto de maior significado (a carta), e só por último o
     texto — como se as palavras só pudessem ser lidas depois que
     os olhos se acostumam ao ambiente.

     Todo o estado inicial é aplicado via JS (não via CSS default).
     Isso é proposital: se o JS falhar ou demorar, os elementos
     nunca ficam presos em opacidade zero — o CSS não sabe que
     essa animação existe. Falha segura por padrão.
     ========================================================== */
  function abrirCena() {
    var ritual = $('.hero-ritual');
    if (!ritual) return; // só existe na home

    // Sem preferência por movimento: mostra tudo, sem véu, sem espera.
    if (!podeAnimar) return;

    var limiar = document.createElement('div');
    limiar.className = 'limiar';
    limiar.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(limiar, document.body.firstChild);

    var elementos = [
      { el: $('.lua', ritual),                 atraso: 650,  duracao: 1800, deslocY: -10 },
      { el: $('.cristal', ritual),              atraso: 950,  duracao: 1700, deslocY: 10 },
      { el: $('.carta-tarot', ritual),          atraso: 1200, duracao: 1900, deslocY: 16 },
      { el: $('.hero-text .badge'),             atraso: 1550, duracao: 1100, deslocY: 8  },
      { el: $('.hero-text h1'),                 atraso: 1750, duracao: 1400, deslocY: 12 },
      { el: $('.hero-text p'),                  atraso: 2050, duracao: 1300, deslocY: 10 },
      { el: $('.hero-text .hero-cta'),          atraso: 2280, duracao: 1200, deslocY: 8  }
    ];

    elementos.forEach(function (item) {
      if (!item.el) return;
      item.el.style.opacity = '0';
      item.el.style.filter = 'blur(8px)';
      item.el.style.transform = 'translateY(' + item.deslocY + 'px)';
    });

    elementos.forEach(function (item) {
      if (!item.el) return;
      setTimeout(function () {
        item.el.style.transition =
          'opacity ' + item.duracao + 'ms var(--ease-slow), ' +
          'transform ' + item.duracao + 'ms var(--ease-slow), ' +
          'filter ' + item.duracao + 'ms var(--ease-slow)';
        item.el.style.opacity = '';
        item.el.style.filter = '';
        item.el.style.transform = '';
      }, item.atraso);
    });

    // O véu se dissolve enquanto a chama acende — a "porta" se abre
    // no mesmo instante em que a luz nasce, não antes nem depois.
    setTimeout(function () {
      limiar.classList.add('dissolvido');
      setTimeout(function () { limiar.remove(); }, 1750);
    }, 180);

    setTimeout(function () {
      document.body.classList.add('cena-acesa');
    }, 2600);
  }

  /* ==========================================================
     LUZ POR CAPÍTULO — cada seção é uma cena com luz própria
     ------------------------------------------------------------
     Em vez de uma atmosfera única do início ao fim, a temperatura
     e a posição da luz ambiente mudam conforme o usuário entra em
     cada seção — sutil, lento (2.8s de transição), nunca abrupto.
     Comunidade recebe um calor mais humano (bordô); Serviços, um
     dourado contido; Agendamento, mais luz (é o convite); o
     encerramento esfria de volta ao silêncio do início.
     ========================================================== */
  function ativarLuzPorCapitulo() {
    if (!podeAnimar || isMobile || !('IntersectionObserver' in window)) return;

    var fundo = $('.atmosfera-fundo');
    if (!fundo) return;

    var luzCap = $('.luz-capitulo', fundo);
    if (!luzCap) {
      luzCap = document.createElement('div');
      luzCap.className = 'luz-capitulo';
      fundo.appendChild(luzCap);
    }

    var capitulos = [
      { id: 'sobre',       cor: 'rgba(165, 63, 72, 0.11)' },  // comunidade — calor humano
      { id: 'servicos',    cor: 'rgba(199, 169, 107, 0.07)' }, // rituais — ouro contido
      { id: 'agendamento', cor: 'rgba(199, 169, 107, 0.15)' }, // o convite — mais luz
      { id: 'cadastro',    cor: 'rgba(198, 101, 90, 0.08)' },
      { id: 'pagamento',   cor: 'rgba(9, 5, 10, 0.5)' }        // encerramento — esfria
    ];

    var alvos = [];
    capitulos.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (el) alvos.push({ el: el, cor: c.cor });
    });
    if (!alvos.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        for (var i = 0; i < alvos.length; i++) {
          if (alvos[i].el === entry.target) {
            luzCap.style.background =
              'radial-gradient(ellipse 75% 55% at 50% 18%, ' + alvos[i].cor + ', transparent 68%)';
            break;
          }
        }
      });
    }, { threshold: 0.35 });

    alvos.forEach(function (a) { io.observe(a.el); });
  }

  /* ==========================================================
     PROFUNDIDADE DO HERO AO ROLAR
     ------------------------------------------------------------
     Sem isso, o Hero simplesmente sai da tela quando o usuário
     rola — um corte seco de banner para conteúdo. Aqui a cena
     recua para dentro do quadro: a composição ritual (mais "longe"
     da câmera) se afasta, perde nitidez e luz mais rápido que o
     texto (mais "perto"), como profundidade de campo real, não
     um único elemento sumindo por igual. Só atua dentro da altura
     do próprio Hero — fora dela, os estilos voltam ao neutro.
     ========================================================== */
  function ativarProfundidadeHero() {
    if (!podeAnimar || isMobile) return;

    var hero = $('.hero');
    var ritual = $('.hero-ritual');
    var texto = $('.hero-text');
    if (!hero || !ritual) return;

    var alturaHero = hero.offsetHeight || window.innerHeight;
    window.addEventListener('resize', function () {
      alturaHero = hero.offsetHeight || window.innerHeight;
    }, { passive: true });

    function aplicar() {
      var p = window.scrollY / (alturaHero * 0.9);
      if (p <= 0) {
        ritual.style.transform = '';
        ritual.style.filter = '';
        ritual.style.opacity = '';
        if (texto) { texto.style.transform = ''; texto.style.opacity = ''; }
        return;
      }
      if (p >= 1) p = 1;

      var reculoRitual = p * 46;
      var escalaRitual = 1 - p * 0.05;
      var desfoqueRitual = p * 5;
      ritual.style.transform = 'translateY(' + reculoRitual.toFixed(1) + 'px) scale(' + escalaRitual.toFixed(3) + ')';
      ritual.style.filter = desfoqueRitual > 0.15 ? 'blur(' + desfoqueRitual.toFixed(1) + 'px)' : '';
      ritual.style.opacity = (1 - p * 0.7).toFixed(3);

      if (texto) {
        var reculoTexto = p * 24;
        texto.style.transform = 'translateY(' + reculoTexto.toFixed(1) + 'px)';
        texto.style.opacity = (1 - p * 0.85).toFixed(3);
      }
    }
    registrarAnimador(aplicar);
  }

  /* ==========================================================
     LUZ GLOBAL — temperatura muda ao longo de ~2 minutos
     (vinho profundo ⇄ âmbar muito discreto)
     ========================================================== */
  function ativarLuzGlobal() {
    var fundo = $('.atmosfera-fundo');
    if (!fundo) return;

    // No mobile a luz global fica estática — economia de pintura
    if (isMobile || !podeAnimar) {
      fundo.style.background =
        'radial-gradient(ellipse 80% 60% at 50% 12%, rgba(182,60,70,0.14), transparent 62%),' +
        'linear-gradient(180deg, #09050A, #180913 52%, #09050A)';
      return;
    }

    var inicio = performance.now();
    var ciclo = 124000; // ~2 minutos

    function aplicar(agora) {
      var t = (performance.now() - inicio) / ciclo;
      var s = (Math.sin(t * Math.PI * 2) + 1) / 2; // 0..1
      var r = Math.round(165 + s * 28);            // vinho → âmbar
      var g = Math.round(55 + s * 24);
      var b = Math.round(72 + s * 20);
      fundo.style.background =
        'radial-gradient(ellipse 80% 60% at 50% 12%, rgba(' + r + ',' + g + ',' + b + ',0.16), transparent 62%),' +
        'linear-gradient(180deg, #09050A, #180913 52%, #09050A)';
    }
    registrarAnimador(aplicar);
  }

  /* ==========================================================
     BRILHO DA LUA — varia lentamente, nunca no mesmo ritmo
     ========================================================== */
  function ativarBrilhoLua() {
    var simbolo = $('.carta-simbolo');
    if (!simbolo || !podeAnimar) return;

    var raiz = Math.random() * Math.PI * 2;
    function mover(agora) {
      var t = agora / 1000;
      var a = 0.14 + 0.07 * Math.sin(t * 0.55 + raiz) + 0.035 * Math.sin(t * 0.19 + raiz * 2.3);
      simbolo.style.textShadow = '0 0 ' + (10 + a * 34).toFixed(1) + 'px rgba(199,169,107,' + a.toFixed(3) + ')';
    }
    registrarAnimador(mover);
  }

  /* ==========================================================
     PARALLAX SUTIL — cada elemento com velocidade própria
     (responde ao mouse; movimento < 20px)
     ========================================================== */
  function ativarParallax() {
    if (!podeAnimar || isTouch) return;
    var alvo = $('.hero-ritual');
    if (!alvo) return;

    var carta = $('.carta-tarot', alvo);
    var cristal = $('.cristal', alvo);
    var lua = $('.lua', alvo);
    var constel = $('.constelacao', alvo);

    var mx = 0, my = 0;
    var sx = 0, sy = 0;

    document.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function mover() {
      sx += (mx - sx) * 0.045;
      sy += (my - sy) * 0.045;

      if (carta) {
        carta.style.marginLeft = (sx * -5).toFixed(2) + 'px';
        carta.style.marginBottom = (sy * -4).toFixed(2) + 'px';
      }
      if (cristal) {
        cristal.style.marginRight = (sx * -7).toFixed(2) + 'px';
        cristal.style.marginBottom = (sy * -6).toFixed(2) + 'px';
      }
      if (lua) {
        lua.style.marginRight = (sx * -3).toFixed(2) + 'px';
        lua.style.marginTop = (sy * -3).toFixed(2) + 'px';
      }
      if (constel) {
        constel.style.marginLeft = (sx * 9).toFixed(2) + 'px';
        constel.style.marginTop = (sy * 7).toFixed(2) + 'px';
      }
    }
    registrarAnimador(mover);
  }

  /* ==========================================================
     CARTA 3D — inclinação seguindo o mouse (máx 5°)
     ========================================================== */
  function ativarCarta3D() {
    var carta = $('.carta-tarot');
    if (!carta || isTouch) return;

    carta.addEventListener('mousemove', function (e) {
      var rect = carta.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotY = x * 5;
      var rotX = -y * 5;
      carta.style.transform =
        'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateZ(0)';
    });

    carta.addEventListener('mouseleave', function () {
      carta.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
      carta.style.transform = 'rotateX(0deg) rotateY(0deg)';
      setTimeout(function () { carta.style.transition = ''; }, 850);
    });
  }

  /* ==========================================================
     CURSOR CUSTOMIZADO — círculo fino → ✦ / ☾
     ========================================================== */
  function ativarCursor() {
    if (isTouch) return;

    // Wrapper (posicionado pelo mouse) + anel visual interno
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<span class="cursor-anel"></span>';
    document.body.appendChild(cursor);

    document.body.classList.add('cursor-customizado');

    var pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var alvo = { x: pos.x, y: pos.y };
    var oculto = false;
    var rafCursor;

    document.addEventListener('mousemove', function (e) {
      alvo.x = e.clientX;
      alvo.y = e.clientY;
      // Ao reaparecer, posiciona imediatamente para não "voar" de longe
      if (cursor.style.opacity !== '1') {
        pos.x = alvo.x;
        pos.y = alvo.y;
        cursor.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });

    function mover() {
      if (!oculto) {
        pos.x += (alvo.x - pos.x) * 0.18;
        pos.y += (alvo.y - pos.y) * 0.18;
        cursor.style.transform =
          'translate(' + pos.x.toFixed(2) + 'px,' + pos.y.toFixed(2) + 'px)';
      }
      rafCursor = requestAnimationFrame(mover);
    }
    rafCursor = requestAnimationFrame(mover);

    // Mudança de forma sobre elementos interativos
    var seletoresLink = 'a, button, .video-placeholder, .card-servico-header, .relacionado-card, [data-toggle], [data-video], .card-servico';

    document.addEventListener('mouseover', function (e) {
      var alvoEl = e.target && e.target.closest ? e.target.closest(seletoresLink) : null;
      if (alvoEl) {
        cursor.classList.add('sobre');
      }
    });

    document.addEventListener('mouseout', function (e) {
      var saiuDeLink = e.target && e.target.closest ? e.target.closest(seletoresLink) : null;
      var foiParaLink = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(seletoresLink) : null;
      if (saiuDeLink && !foiParaLink) {
        cursor.classList.remove('sobre');
      }
    });

    // Esconde o cursor customizado sobre campos de formulário
    // (o cursor nativo é restaurado via CSS)
    $$('input, textarea, select').forEach(function (campo) {
      campo.addEventListener('mouseenter', function () {
        oculto = true;
        cursor.style.display = 'none';
      });
      campo.addEventListener('mouseleave', function () {
        oculto = false;
        cursor.style.display = '';
      });
    });
  }

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
        ? '0 10px 30px rgba(0, 0, 0, 0.5)'
        : 'none';
    }

    var pos = window.scrollY + 140;
    var atual = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) atual = sec.id;
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var ativo = href === '#' + atual;
      link.style.color = ativo ? 'var(--gold)' : '';
      link.classList.toggle('ativo', ativo);
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
    $$('.navbar nav a').forEach(function (l) { l.addEventListener('click', fecharMenu); });
  }

  /* ==========================================================
     5. SCROLL REVEAL — animações de entrada com blur
     ========================================================== */
  function prepararReveal() {
    $$('.social-grid, .video-grid, .cards-grid, .payment-grid, .depoimentos-grid, .relacionados-grid, .processo-grid')
      .forEach(function (grid) {
        $$(':scope > *', grid).forEach(function (el, i) {
          el.classList.add('reveal');
          el.style.transitionDelay = (i * 120) + 'ms';
        });
      });
    $$('.sobre h2, .servicos h2, .agendamento h2, .cadastro h2, #pagamento h2, .secao-intro, .hero-text, .ritual-intro-copy, .presence-intro, .ritual-step')
      .forEach(function (el) { el.classList.add('reveal'); });

    /* Páginas internas de serviço (tarot, magia, cursos...) eram
       lidas de uma vez, como um artigo estático — quebrando o
       "scroll como narrativa" do resto do site assim que alguém
       clicava em "Saiba mais". Cada bloco de conteúdo agora chega
       em seu próprio tempo, como capítulos, não como um texto que
       já estava todo ali. */
    $$('.page-hero .eyebrow, .page-hero h1, .page-hero p, .secao-titulo, .artigo-lead, .bloco, .info-box, .faq-wrap, .tabela-precos, .glossario')
      .forEach(function (el) { el.classList.add('reveal'); });

    /* O rodapé é o encerramento da cena, não um bloco que só
       "está lá" ao fim do HTML — ele deve chegar com o mesmo
       silêncio contemplativo do resto da página. */
    $$('footer').forEach(function (rodape) {
      $$(':scope > *', rodape).forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 140) + 'ms';
      });
    });
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
      var eased = 1 - Math.pow(1 - p, 3);
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
      ? (isMobile ? 'none' : sub.scrollHeight + 'px')
      : '0px';
  }

  function toggleServico(card) {
    var jaAberto = card.classList.contains('aberto');

    $$('.card-servico.aberto').forEach(function (c) {
      c.classList.remove('aberto');
      ajustarAltura(c);
    });

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

  var destaque = $('.card-servico.destaque');
  if (destaque) {
    destaque.classList.add('aberto');
    ajustarAltura(destaque);
  }

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
  var reflexoAgenda = $('#reflexo-agenda');
  var horarioSelecionado = null;

  if (inputData) {
    var hoje = new Date();
    var ajuste = hoje.getTimezoneOffset();
    var dataLocal = new Date(hoje.getTime() - ajuste * 60000);
    inputData.min = dataLocal.toISOString().split('T')[0];
  }

  var DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function atualizarReflexo() {
    if (!reflexoAgenda) return;
    var data = inputData ? inputData.value : '';

    if (!data && !horarioSelecionado) {
      reflexoAgenda.classList.remove('visivel');
      return;
    }

    var frase;
    if (data && horarioSelecionado) {
      var partes = data.split('-').map(Number);
      var dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
      frase = 'Você escolheu ' + DIAS_SEMANA[dataObj.getDay()] + ', ' + partes[2] + ' de ' +
        MESES[partes[1] - 1] + ', às ' + horarioSelecionado + '.';
    } else if (data) {
      var partes2 = data.split('-').map(Number);
      var dataObj2 = new Date(partes2[0], partes2[1] - 1, partes2[2]);
      frase = 'Uma data já reservada — ' + DIAS_SEMANA[dataObj2.getDay()] + ', ' + partes2[2] + ' de ' + MESES[partes2[1] - 1] + '. Falta escolher o horário.';
    } else {
      frase = 'Um horário já reservado — falta escolher o dia.';
    }

    reflexoAgenda.textContent = frase;
    reflexoAgenda.classList.add('visivel');
  }

  if (inputData) {
    inputData.addEventListener('change', atualizarReflexo);
  }

  if (horariosGrid) {
    horariosGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-horario');
      if (!btn) return;
      var jaSelecionado = btn.classList.contains('selecionado');
      $$('.btn-horario', horariosGrid).forEach(function (b) {
        b.classList.remove('selecionado');
      });
      if (jaSelecionado) {
        horarioSelecionado = null;
      } else {
        btn.classList.add('selecionado');
        horarioSelecionado = btn.textContent.trim();
      }
      atualizarReflexo();
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
      if (reflexoAgenda) reflexoAgenda.classList.remove('visivel');
    });
  }

  /* ==========================================================
     9. CADASTRO RÁPIDO — validação + máscara de telefone
     ========================================================== */
  var formCadastro = $('#form-cadastro');
  var inputNomeCadastro = $('#nome');
  var reflexoCadastro = $('#reflexo-cadastro');

  /* O cadastro é a abertura do canal, não uma fila. Enquanto a
     pessoa escreve o nome, uma linha de presença a reconhece —
     a mesma linguagem do reflexo-agenda, que acolhe o momento
     escolhido antes da confirmação. Aqui, quem escreve é acolhido
     antes de qualquer envio. */
  if (inputNomeCadastro && reflexoCadastro) {
    inputNomeCadastro.addEventListener('input', function () {
      var nome = inputNomeCadastro.value.trim();
      if (nome.length >= 2) {
        reflexoCadastro.textContent = 'À sua espera, ' + nome + ' ✦';
        reflexoCadastro.classList.add('visivel');
      } else {
        reflexoCadastro.textContent = '';
        reflexoCadastro.classList.remove('visivel');
      }
    });
  }

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
      if (reflexoCadastro) {
        reflexoCadastro.textContent = '';
        reflexoCadastro.classList.remove('visivel');
      }
      formCadastro.reset();
      var tel = $('#telefone');
      if (tel) tel.value = '';
    });
  }

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
     9b. FORMULÁRIO DE CONTATO — validação
     ========================================================== */
  var formContato = $('#form-contato');

  if (formContato) {
    formContato.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#msg-contato');
      var nome = $('#contato-nome').value.trim();
      var email = $('#contato-email').value.trim();
      var mensagem = $('#contato-mensagem').value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nome || !emailRegex.test(email) || !mensagem) {
        msg.textContent = '✦ Preencha nome, e-mail válido e mensagem para enviar.';
        return;
      }
      msg.textContent = '☾ Mensagem enviada! Retornarei o mais breve possível. ✦';
      formContato.reset();
    });
  }

  /* ==========================================================
     9c. DATA DE ATUALIZAÇÃO — páginas legais
     ========================================================== */
  $$('.data-atualizacao').forEach(function (el) {
    el.textContent = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  });

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

  function montarEmbed(url) {
    if (!url) return '<p class="modal-video-error">Nenhum vídeo vinculado ainda.</p>';
    var u = url.trim();

    var ytVid = u.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (ytVid) {
      return '<iframe src="https://www.youtube.com/embed/' + ytVid[1] +
        '" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }

    if (u.indexOf('youtube.com/@') !== -1 || u.indexOf('youtube.com/channel/') !== -1) {
      window.open(u, '_blank', 'noopener');
      return null;
    }

    var igReel = u.match(/instagram\.com\/reel\/([\w-]+)/);
    if (igReel) {
      return '<iframe src="https://www.instagram.com/reel/' + igReel[1] +
        '/embed" title="Instagram" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen></iframe>';
    }

    var igPost = u.match(/instagram\.com\/p\/([\w-]+)/);
    if (igPost) {
      return '<iframe src="https://www.instagram.com/p/' + igPost[1] +
        '/embed" title="Instagram" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen></iframe>';
    }

    if (u.indexOf('instagram.com/') !== -1) {
      window.open(u, '_blank', 'noopener');
      return null;
    }

    return '<p class="modal-video-error">Formato de link não reconhecido.</p>';
  }

  function abrirVideo(url) {
    var embed = montarEmbed(url);
    if (embed === null) return;
    if (embed) {
      modalEmbed.innerHTML = embed;
      modal.classList.add('aberto');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-aberto');
    }
  }

  function fecharVideo() {
    modal.classList.remove('aberto');
    modal.setAttribute('aria-hidden', 'true');
    modalEmbed.innerHTML = '';
    document.body.style.overflow = '';
    document.body.classList.remove('modal-aberto');
  }

  $$('[data-video]').forEach(function (el) {
    el.addEventListener('click', function () {
      abrirVideo(el.getAttribute('data-video'));
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirVideo(el.getAttribute('data-video'));
      }
    });
  });

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

  /* ==========================================================
     INICIALIZAÇÃO DA ATMOSFERA
     ========================================================== */
  criarAtmosfera();
  abrirCena();
  ativarLuzPorCapitulo();
  ativarProfundidadeHero();
  revelarConstelacao();
  lancarEstrelaCadente();
  ativarCarta3D();
  ativarCursor();
  ativarBrilhoLua();
  ativarLuzGlobal();
  ativarParallax();

})();

