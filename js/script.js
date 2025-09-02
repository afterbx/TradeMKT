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


    /* Scrol tag a */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1300; // tempo em ms -> 1500 = 1.5s
    let start = null;

    function animationScroll(currentTime) {
      if (start === null) start = currentTime;
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startPosition + distance * progress);
      if (elapsed < duration) requestAnimationFrame(animationScroll);
    }

    requestAnimationFrame(animationScroll);
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


    /* Scroll botão voltar para o topo */

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
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            // Atualiza o gradiente do progresso
            scrollProgress.style.background = `conic-gradient(from 0deg, #667eea ${scrollPercent * 3.6}deg, transparent ${scrollPercent * 3.6}deg)`;
        }

        // Função para scroll suave até o topo
        function scrollToTop() {
            const scrollStep = -window.scrollY / 15;
            const scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        }

        // Função alternativa usando scrollTo (mais moderna)
        function smoothScrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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

            // Rola para o topo
            smoothScrollToTop();
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