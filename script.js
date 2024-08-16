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
            this.dx = (Math.random() - 0.5) * 2;
            this.dy = (Math.random() - 0.5) * 2;
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

    // Elementos do DOM
    const ageVerification = document.getElementById('age-verification');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const mainPage = document.getElementById('main-page');
    const loginForm = document.getElementById('login-form');

    // Armazenar a escolha do usuário
    yesButton.addEventListener('click', function() {
        localStorage.setItem('ageGroup', 'adult');
        ageVerification.style.display = 'none';
        mainPage.classList.add('show');
        mainPage.classList.remove('hidden');
    });

    noButton.addEventListener('click', function() {
        localStorage.setItem('ageGroup', 'minor');
        ageVerification.style.display = 'none';
        mainPage.classList.add('show');
        mainPage.classList.remove('hidden');
    });

    // Lógica de Login
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        const category = document.getElementById('category').value.trim();
        const ageGroup = localStorage.getItem('ageGroup'); // Recupera a escolha do usuário

        // Redireciona para chat.html com parâmetros de categoria e idade
        window.location.href = `chat.html?category=${encodeURIComponent(category)}&ageGroup=${encodeURIComponent(ageGroup)}`;
    });
});
