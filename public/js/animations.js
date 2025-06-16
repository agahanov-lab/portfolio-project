// Animation and visual effects for the portfolio website

// Fade in animation on scroll
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Geometric background animation for homepage hero
function initGeometricBackground() {
    const canvas = document.getElementById('geometricCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Geometric shapes array
    const shapes = [];
    const shapeCount = 8;

    // Create shapes
    for (let i = 0; i < shapeCount; i++) {
        shapes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 100 + 50,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.1 + 0.05,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            type: Math.floor(Math.random() * 3) // 0: circle, 1: triangle, 2: square
        });
    }

    // Draw shape function
    function drawShape(shape) {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.globalAlpha = shape.opacity;
        ctx.strokeStyle = '#3B82F6';
        ctx.fillStyle = '#3B82F6';
        ctx.lineWidth = 2;

        switch (shape.type) {
            case 0: // Circle
                ctx.beginPath();
                ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 1: // Triangle
                ctx.beginPath();
                ctx.moveTo(0, -shape.size / 2);
                ctx.lineTo(-shape.size / 2, shape.size / 2);
                ctx.lineTo(shape.size / 2, shape.size / 2);
                ctx.closePath();
                ctx.stroke();
                break;
            case 2: // Square
                ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                break;
        }
        ctx.restore();
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        shapes.forEach(shape => {
            // Update position
            shape.x += shape.dx;
            shape.y += shape.dy;
            shape.rotation += shape.rotationSpeed;

            // Wrap around screen
            if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
            if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
            if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
            if (shape.y < -shape.size) shape.y = canvas.height + shape.size;

            drawShape(shape);
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Typing effect for homepage hero text
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const text = 'Mekan';
    let index = 0;
    let isDeleting = false;
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;

    function type() {
        const currentText = text.substring(0, index);
        typingElement.textContent = currentText;

        if (!isDeleting && index === text.length) {
            // Pause at end
            setTimeout(() => {
                isDeleting = true;
                type();
            }, pauseTime);
        } else if (isDeleting && index === 0) {
            // Start typing again
            isDeleting = false;
            setTimeout(type, typeSpeed);
        } else if (isDeleting) {
            // Continue deleting
            index--;
            setTimeout(type, deleteSpeed);
        } else {
            // Continue typing
            index++;
            setTimeout(type, typeSpeed);
        }
    }

    // Start the effect after a short delay
    setTimeout(type, 1000);
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    observeElements();
    
    // Only initialize homepage-specific animations on the homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        initGeometricBackground();
        initTypingEffect();
    }
});

// Re-observe elements when new content is dynamically added
function reobserveElements() {
    observeElements();
}

// Export for use in other modules
window.reobserveElements = reobserveElements;