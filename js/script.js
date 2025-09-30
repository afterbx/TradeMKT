/* SmoothScroll corrigido e melhorado */
class SmoothScroll {
  constructor(options = {}) {
    // Configurações
    this.ease = typeof options.ease === 'number' ? options.ease : 0.03; // quanto do delta é interpolado
    this.speed = typeof options.speed === 'number' ? options.speed : 1; // multiplicador de entrada (wheel/touch/keys)
    this.enabled = options.enabled !== false;

    // Estado
    this.current = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.target = this.current;
    this.isScrolling = false;
    this.rafId = null;
    this.scrollTimeout = null;

    // Bind dos handlers para podermos remover depois
    this.onWheel = this.onWheel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onNativeScroll = this.onNativeScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    // touch state
    this._touchStartY = 0;

    this.init();
  }

  init() {
    this.setupSmoothing();
    this.bindEvents();
    this.startRAF();
    console.log('🚀 SmoothScroll inicializado!');
  }

  setupSmoothing() {
    // Evita conflito com CSS native smooth
    try { document.documentElement.style.scrollBehavior = 'auto'; } catch (e) {}
    document.body.style.willChange = 'scroll-position';
  }

  bindEvents() {
    // NOTE: usamos passive: false para poder e.preventDefault() e evitar que o browser faça
    // o scroll nativo *além* do nosso controle (isso evita "double scroll").
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('scroll', this.onNativeScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('keydown', this.onKeyDown, { passive: false }); // para PageUp/PageDown/Home/End
  }

  onWheel(e) {
    if (!this.enabled) return;
    // previne scroll nativo; nós vamos controlar com window.scrollTo
    e.preventDefault();
    // deltaY positivo = scroll pra baixo
    this.target += e.deltaY * this.speed;
    this.clampTarget();
    this.isScrolling = true;
    this._resetScrollTimeout();
  }

  onTouchStart(e) {
    this._touchStartY = e.touches && e.touches[0] ? e.touches[0].clientY : 0;
  }

  onTouchMove(e) {
    if (!this.enabled) return;
    if (!e.touches || !e.touches[0]) return;
    e.preventDefault(); // evitar o scroll nativo
    const touchY = e.touches[0].clientY;
    const deltaY = this._touchStartY - touchY; // positivo => rolar para baixo
    this.target += deltaY * this.speed * 1.5; // fator extra pra touch
    this._touchStartY = touchY;
    this.clampTarget();
    this.isScrolling = true;
    this._resetScrollTimeout();
  }

  onNativeScroll() {
    // Se o usuário interage com a barra/scroll programático externo, sincronizamos
    if (!this.isScrolling) {
      this.current = window.pageYOffset || document.documentElement.scrollTop || 0;
      this.target = this.current;
    }
    this._resetScrollTimeout();
  }

  onResize() {
    this.clampTarget();
  }

  onKeyDown(e) {
    if (!this.enabled) return;

    // tratamos teclas que mexem no scroll e previnimos comportamento nativo
    const key = e.key;
    const viewport = window.innerHeight;
    let handled = false;

    switch (key) {
      case 'PageDown':
        this.target += viewport * 0.9 * this.speed;
        handled = true;
        break;
      case 'PageUp':
        this.target -= viewport * 0.9 * this.speed;
        handled = true;
        break;
      case 'ArrowDown':
        this.target += 40 * this.speed;
        handled = true;
        break;
      case 'ArrowUp':
        this.target -= 40 * this.speed;
        handled = true;
        break;
      case 'Home':
        this.target = 0;
        handled = true;
        break;
      case 'End':
        this.target = this.getMaxScroll();
        handled = true;
        break;
      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      this.clampTarget();
      this.isScrolling = true;
      this._resetScrollTimeout();
    }
  }

  getMaxScroll() {
    return Math.max(
      document.body.scrollHeight || 0,
      document.documentElement.scrollHeight || 0
    ) - window.innerHeight;
  }

  clampTarget() {
    const max = this.getMaxScroll();
    if (!Number.isFinite(this.target)) this.target = 0;
    this.target = Math.max(0, Math.min(this.target, Math.max(0, max)));
  }

  update() {
    if (this.enabled && (this.isScrolling || Math.abs(this.target - this.current) > 0.5)) {
      const delta = (this.target - this.current) * this.ease;
      this.current += delta;

      // se estiver muito perto, "encaixa" para evitar sub-pixels infinitos
      if (Math.abs(this.target - this.current) < 0.5) {
        this.current = this.target;
        this.isScrolling = false;
      }

      // aplicamos o scroll
      window.scrollTo(0, Math.round(this.current));
    }

    // loop RAF
    this.rafId = requestAnimationFrame(() => this.update());
  }

  startRAF() {
    if (!this.rafId) this.rafId = requestAnimationFrame(() => this.update());
  }

  _resetScrollTimeout() {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 120);
  }

  // Método para scroll programático
  scrollTo(position, smooth = true) {
    if (typeof position === 'string') {
      const el = document.querySelector(position);
      if (el) {
        const rect = el.getBoundingClientRect();
        position = window.pageYOffset + rect.top;
      } else {
        position = 0;
      }
    }

    // número esperado
    position = Math.max(0, Math.min(position, this.getMaxScroll()));
    this.target = position;

    if (!smooth) {
      // pula a animação
      this.current = this.target;
      window.scrollTo(0, this.current);
      this.isScrolling = false;
    } else {
      this.isScrolling = true;
    }
  }

  scrollToElement(element, offset = 0) {
    this.scrollTo(typeof element === 'string' ? element : (() => {
      if (!element) return 0;
      const rect = element.getBoundingClientRect();
      return window.pageYOffset + rect.top + offset;
    })());
  }

  toggle() {
    this.enabled = !this.enabled;
    console.log('Scroll suave', this.enabled ? 'ativado' : 'desativado');
  }

  destroy() {
    this.enabled = false;

    // remover listeners
    window.removeEventListener('wheel', this.onWheel, { passive: false });
    window.removeEventListener('touchstart', this.onTouchStart, { passive: true });
    window.removeEventListener('touchmove', this.onTouchMove, { passive: false });
    window.removeEventListener('scroll', this.onNativeScroll, { passive: true });
    window.removeEventListener('resize', this.onResize, { passive: true });
    window.removeEventListener('keydown', this.onKeyDown, { passive: false });

    // cancelar RAF
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;

    // restaurar estilos
    try { document.documentElement.style.scrollBehavior = ''; } catch (e) {}
    document.body.style.willChange = '';

    // limpar timeout
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    console.log('SmoothScroll destruído.');
  }
}

// Inicializar com valores padrão
const smoothScroll = new SmoothScroll({
  ease: 0.03, // quanto do gap é aplicado por frame (0.03 é suave)
  speed: 1    // multiplica os eventos (aumente para scroll mais "rápido")
});

// Exemplo: controlar via console
// smoothScroll.scrollTo(0); // topo
// smoothScroll.scrollTo('#minhaSecao'); // scroll até elemento
// smoothScroll.toggle(); // ativa/desativa
// smoothScroll.destroy(); // remove tudo

/* fim scroll */

/* Reviews */

const reviews = [
            {
                name: "Anna Luisa",
                role: "Gym Street",
                avatar: "A",
                rating: 5,
                content: "Excelente escolha! Superou minhas expectativas. A qualidade que tudo é feito é excepcional e o atendimento foi impecável. Recomendo fortemente para todos que buscam qualidade e eficiência.",
                date: "15 de Agosto, 2024"
            },
            {
                name: "João Santos",
                role: "Restaurante Sabor & Cia",
                avatar: "J",
                rating: 5,
                content: "Muito bom! O meu produto foi impulsionado rapidamente e fui muito bem tratado. O suporte ao cliente é muito atencioso. Voltaria a fazer négocios sempre.",
                date: "12 de Agosto, 2024"
            },
            {
                name: "Ana Costa",
                role: "Burguer House",
                avatar: "A",
                rating: 5,
                content: "Impressionante! A Trade é incrível e qualidade de captação e produção é mágnifico. Parabéns pela excelência no serviço prestado.",
                date: "10 de Agosto, 2024"
            },
            {
                name: "Pedro Lima",
                role: "Loja Tech",
                avatar: "P",
                rating: 5,
                content: "Empresa de qualidade e entrega rápida. Fiquei satisfeito com a prestação de serviço e o atendimento pós-venda. Recomendo para quem busca confiabilidade.",
                date: "8 de Agosto, 2024"
            },
            {
                name: "Carla Mendes",
                role: "Trattoria Mendes",
                avatar: "C",
                rating: 5,
                content: "Perfeito! Já é a terceira vez que renovo o contrato e sempre fico impressionada com a qualidade que tudo é feito. Sem dúvida a melhor opção do mercado.",
                date: "5 de Agosto, 2024"
            }
        ];

        let currentReviewIndex = 0;

        // Elementos do DOM
        const reviewCard = document.getElementById('reviewCard');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const starsContainer = document.getElementById('starsContainer');
        const ratingText = document.getElementById('ratingText');
        const reviewContent = document.getElementById('reviewContent');
        const reviewDate = document.getElementById('reviewDate');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicatorsContainer = document.getElementById('indicators');

        // Função para renderizar as estrelas
        function renderStars(rating) {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                const filled = i <= rating ? 'filled' : '';
                stars.push(`<span class="star ${filled}">★</span>`);
            }
            return stars.join('');
        }

        // Função para criar os indicadores
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            reviews.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = `indicator ${index === currentReviewIndex ? 'active' : ''}`;
                indicator.addEventListener('click', () => goToReview(index));
                indicatorsContainer.appendChild(indicator);
            });
        }

        // Função para atualizar o card com a avaliação atual
        function updateReviewCard() {
            const review = reviews[currentReviewIndex];
            
            // Adiciona animação
            reviewCard.classList.add('animate');
            setTimeout(() => reviewCard.classList.remove('animate'), 500);

            // Atualiza conteúdo
            userAvatar.textContent = review.avatar;
            userName.textContent = review.name;
            userRole.textContent = review.role;
            starsContainer.innerHTML = renderStars(review.rating);
            ratingText.textContent = review.rating.toFixed(1);
            reviewContent.textContent = review.content;
            reviewDate.textContent = review.date;

            // Atualiza botões
            prevBtn.disabled = currentReviewIndex === 0;
            nextBtn.disabled = currentReviewIndex === reviews.length - 1;

            // Atualiza indicadores
            updateIndicators();
        }

        // Função para atualizar indicadores
        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentReviewIndex);
            });
        }

        // Função para ir para uma avaliação específica
        function goToReview(index) {
            if (index >= 0 && index < reviews.length) {
                currentReviewIndex = index;
                updateReviewCard();
            }
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            if (currentReviewIndex > 0) {
                currentReviewIndex--;
                updateReviewCard();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentReviewIndex < reviews.length - 1) {
                currentReviewIndex++;
                updateReviewCard();
            }
        });

        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });

        // Auto-play (opcional)
        let autoPlay = true;
        let autoPlayInterval;

        function startAutoPlay() {
            if (autoPlay) {
                autoPlayInterval = setInterval(() => {
                    if (currentReviewIndex < reviews.length - 1) {
                        currentReviewIndex++;
                    } else {
                        currentReviewIndex = 0;
                    }
                    updateReviewCard();
                }, 5000);
            }
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Pausar auto-play ao hover
        reviewCard.addEventListener('mouseenter', stopAutoPlay);
        reviewCard.addEventListener('mouseleave', startAutoPlay);

        // Inicialização
        createIndicators();
        updateReviewCard();
        startAutoPlay();

// Configuração do EmailJS
   (function(){
        emailjs.init("uebYJTF3MwXyfp66i"); // ⚠️ substitua pelo seu User ID
    })();

    const form = document.getElementById("formulariozin");
    const toast = document.getElementById("toast");

    function showToast(message, type) {
        toast.innerText = message;
        toast.className = "show " + type;

        setTimeout(() => {
            toast.className = toast.className.replace("show " + type, "");
        }, 6000); // some após 6 segundos
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        emailjs.sendForm("service_naw8mnh", "template_caxbhoa", this)
        .then(() => {
            showToast("✅ Mensagem enviada com sucesso!", "success");
            form.reset();
        }, () => {
            showToast("❌ Erro ao enviar, tente novamente.", "error");
        });
    });


/* Scroll tag a - INTEGRADO COM SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        
        if (target) {
            // Usar o smooth scroll personalizado
            smoothScroll.scrollToElement(target);
        }
    });
});

/* Parte de voltar pra cima e aparecer a nav */
let lastScrollTop = 0; // posição inicial do scroll
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // rolando pra baixo -> esconde nav
    navbar.style.top = "-180px"; // ajusta conforme a altura da sua nav
  } else {
    // rolando pra cima -> mostra nav
    navbar.style.top = "0";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // evita valores negativos
});


/* Scroll tag a fim */


/* Scroll botão voltar para o topo - INTEGRADO COM SMOOTH SCROLL */

const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        
        // Variáveis de controle
        let isScrolling = false;
        let scrollTimer = null;

        // Função para mostrar/ocultar o botão baseado no scroll
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const showThreshold = 300; // Mostra o botão após 300px de scroll

            if (scrollTop > showThreshold) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }

            // Atualiza o progresso do scroll (opcional)
            updateScrollProgress();
        }

        // Função para atualizar o progresso do scroll
        function updateScrollProgress() {
            const scrollProgress = document.querySelector('.scroll-progress');
            if (scrollProgress) {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                // Atualiza o gradiente do progresso
                scrollProgress.style.background = `conic-gradient(from 0deg, #667eea ${scrollPercent * 3.6}deg, transparent ${scrollPercent * 3.6}deg)`;
            }
        }

        // Função para scroll suave até o topo usando nosso smooth scroll
        function scrollToTopSmooth() {
            smoothScroll.scrollTo(0);
        }

        // Event listeners
        window.addEventListener('scroll', handleScroll);

        // Clique no botão
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Adiciona efeito visual de clique
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);

            // Rola para o topo usando nosso smooth scroll
            scrollToTopSmooth();
        });

        // Suporte para teclado (acessibilidade)
        scrollToTopBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Throttle para melhor performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
                setTimeout(() => {
                    ticking = false;
                }, 10);
            }
        }

        // Substitui o event listener original
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', requestTick);

        // Inicialização
        handleScroll(); // Verifica posição inicial

        /* Reponsividade js */


document.addEventListener('DOMContentLoaded', function() {
    // Criar o menu hamburger
    const nav = document.getElementById('navbar');
    const menu = document.getElementById('menu');
    
    // Criar o botão hamburger
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Inserir o hamburger na nav
    nav.appendChild(hamburger);
    
    // Função para toggle do menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    // Event listener para o hamburger
    hamburger.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar nos links
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Prevenir propagação de cliques no menu
    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});