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
