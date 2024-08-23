document.addEventListener('DOMContentLoaded', () => {
    // Canvas de bolhas
    const canvas = document.getElementById('bubbles');
    const ctx = canvas.getContext('2d');
    let bubbles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas(); // Inicializa o tamanho do canvas

    class Bubble {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.dx = (Math.random() - 0.5) * 2; // Velocidade horizontal
            this.dy = (Math.random() - 0.5) * 2; // Velocidade vertical
            this.alpha = Math.random() * 0.5 + 0.3;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    function createBubbles(numBubbles) {
        for (let i = 0; i < numBubbles; i++) {
            const radius = Math.random() * 30 + 10;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            bubbles.push(new Bubble(x, y, radius));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach(bubble => bubble.update());
        requestAnimationFrame(animate);
    }

    createBubbles(50);
    animate();

    window.addEventListener('resize', resizeCanvas);

    // Adicionar evento de clique aos botões de idioma
    document.querySelectorAll('#language-buttons .language-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('#language-buttons .language-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Variáveis para elementos da verificação de idade
    const ageVerification = document.getElementById('age-verification');
    const rectanglesContainer = document.getElementById('rectangles-container');
    const mainPage = document.getElementById('main-page');
    const yesButton = document.getElementById('verify-age-yes');
    const noButton = document.getElementById('verify-age-no');

    // Exibir a tela de verificação de idade
    ageVerification.style.display = 'flex';

    // Adicionar evento de clique ao botão "Sim" para esconder a tela de verificação e mostrar os retângulos
    yesButton.addEventListener('click', () => {
        ageVerification.style.display = 'none';
        rectanglesContainer.style.display = 'flex';
        mainPage.classList.add('show');
    });

    // Adicionar evento de clique ao botão "Não" para sair da página
    noButton.addEventListener('click', () => {
        window.location.href = 'https://www.google.com'; // Redirecionar para outro site ou página de saída
    });

    // Adicionar evento de envio ao formulário de login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir o envio padrão do formulário
        const username = document.getElementById('username').value;
        const category = document.getElementById('category').value;

        if (!username) {
            alert('Por favor, insira um nome de usuário.');
            return; // Interrompe a execução se o nome de usuário não for fornecido
        }

        // Redirecionar para chat.html com os parâmetros de usuário e categoria
        window.location.href = `chat.html?username=${encodeURIComponent(username)}&category=${encodeURIComponent(category)}`;
    });
});
