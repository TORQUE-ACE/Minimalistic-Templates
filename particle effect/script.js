// script.js

// Particle Effect Initialization
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numParticles = 500; // Original particle count
let typing = false;

// Create particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Original size
        this.speedX = Math.random() * 0.5 - 0.25; // Original speed
        this.speedY = Math.random() * 0.5 - 0.25; // Original speed
        this.color = 'rgba(50, 50, 50, 0.5)'; // Dark color, unchanged
    }

    update() {
        if (typing) {
            this.speedX = this.speedX * 1; // Increase speed when typing
            this.speedY = this.speedY * 0.2; // Increase speed when typing
        } else {
            this.speedX = this.speedX; // Default speed
            this.speedY = this.speedY; // Default speed
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas.width - this.size || this.x < this.size) {
            this.speedX *= -1;
            this.x = Math.max(this.size, Math.min(this.x, canvas.width - this.size)); // Constrain within canvas
        }
        if (this.y > canvas.height - this.size || this.y < this.size) {
            this.speedY *= -1;
            this.y = Math.max(this.size, Math.min(this.y, canvas.height - this.size)); // Constrain within canvas
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.5; // Thinner lines for minimalistic look
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

// Create particles
for (let i = 0; i < numParticles; i++) {
    particlesArray.push(new Particle());
}

// Handle mouse interaction
const mouse = { x: null, y: null };
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Connect particles
function connectParticles() {
    const opacity = 0.1;
    ctx.lineWidth = 0.5; // Thinner lines for minimalistic look
    ctx.strokeStyle = `rgba(50, 50, 50, ${opacity})`; // Dark color

    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Draw lines between particles when they come close
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connectParticles();

    particlesArray.forEach(particle => {
        // Adjust particle positions based on mouse
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = 1 - distance / 100;
                particle.x -= Math.cos(angle) * force * 3; // Force adjusted for movement
                particle.y -= Math.sin(angle) * force * 3; // Force adjusted for movement
            }
        }

        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

// Initialize
animateParticles();

// Handle resizing of the canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray.forEach(particle => {
        // Reset positions to stay within new canvas size
        particle.x = Math.max(particle.size, Math.min(particle.x, canvas.width - particle.size));
        particle.y = Math.max(particle.size, Math.min(particle.y, canvas.height - particle.size));
    });
});

// Emoji Interaction
const emoji = document.getElementById('emoji');
const passwordInput = document.getElementById('password');
const usernameInput = document.querySelector('input[type="text"]');

// Default emoji
const defaultEmoji = '👀';
const typingEmoji = '🙈';
const particleEmoji = '✨'; // Emoji when interacting with particle effect

// Update emoji position
function updateEmojiPosition() {
    const containerRect = document.querySelector('.login-container').getBoundingClientRect();
    const emojiRect = emoji.getBoundingClientRect();

    emoji.style.top = `${containerRect.top + window.scrollY + 50}px`; // Adjust based on desired position
    emoji.style.left = `${containerRect.left + window.scrollX + (containerRect.width / 2) - (emojiRect.width / 2)}px`;
}

// Toggle password visibility
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    emoji.textContent = type === 'password' ? defaultEmoji : typingEmoji; // Change emoji based on visibility
}

// Update emoji when typing in password
passwordInput.addEventListener('input', () => {
    emoji.textContent = typingEmoji; // Change emoji to eyes closed
    typing = true; // Increase particle speed
});

// Update emoji when typing in username
usernameInput.addEventListener('input', () => {
    emoji.textContent = typingEmoji; // Change emoji to eyes closed
    typing = true; // Increase particle speed
});

// Revert emoji and particle speed when not typing
const inputs = [usernameInput, passwordInput];
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        emoji.textContent = defaultEmoji; // Revert emoji
        typing = false; // Slow down particles
    });
});

// Change emoji when interacting with particles
canvas.addEventListener('mousemove', () => {
    emoji.textContent = particleEmoji; // Change emoji when interacting with the particle effect
});

// Revert emoji when not interacting with particles
canvas.addEventListener('mouseleave', () => {
    emoji.textContent = typing ? typingEmoji : defaultEmoji;
});

// Update emoji position on window resize or scroll
window.addEventListener('resize', updateEmojiPosition);
window.addEventListener('scroll', updateEmojiPosition);

// Update emoji position initially
updateEmojiPosition();
