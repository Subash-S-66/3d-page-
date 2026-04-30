import os

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SKS Agency | We Engineer the Future</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Space+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #080808;
            --surface-color: #111111;
            --text-color: #F0EBE0;
            --primary-color: #C9A84C;
            --accent-color: #E8C96A;
            --font-heading: 'Cormorant Garamond', serif;
            --font-body: 'Space Grotesk', sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: var(--font-body);
        }

        body {
            overflow-x: hidden;
            position: relative;
            cursor: none; /* For custom cursor */
        }

        /* Noise Grain */
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.025;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* Gold Shimmer Bar */
        .shimmer-bar {
            position: fixed; /* Fixed to very top of screen */
            top: 0; left: 0; width: 100%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite linear;
            z-index: 9999;
        }
        @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
        }

        /* Custom Cursor */
        .cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 12px; height: 12px;
            background-color: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
        }
        .cursor-ring {
            position: fixed;
            top: 0; left: 0;
            width: 40px; height: 40px;
            border: 1px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, margin-left 0.3s, margin-top 0.3s;
        }
        body.cursor-hover .cursor-ring {
            width: 80px; height: 80px;
        }

        /* Scroll-triggered fade-up */
        .fade-up {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Utility classes */
        .heading {
            font-family: var(--font-heading);
        }
        .gold {
            color: var(--primary-color);
        }
    </style>
</head>
<body>
    <div class="shimmer-bar"></div>

    <!-- Layout Container -->
    <div id="app">
    </div>

    <!-- Custom Cursor Elements -->
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>

    <script>
        // Custom Cursor Logic
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
        });

        function animateCursor() {
            // roughly 80ms lag using lerp
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            // Adjust ring position so it remains centered
            // The ring's default dimension is 40px, or 80px on hover.
            // We use transform translate (-50%, -50%) which needs base coordinates.
            // Oh wait, in CSS it's better to just translate by the raw mouse position,
            // since transform: translate(-50%, -50%) would apply to the top/left if we set top/left.
            // Let's adjust JS to set transform.
            // Wait, standard way with transform translate is just setting the translate X and Y.
            // But we need the translate to include -50%, -50%.
            // So translate(ringX - width/2, ringY - height/2) instead of using top/left.
            cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
            cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        function attachCursorHover() {
            const interactiveElements = document.querySelectorAll('a, button, .clickable');
            interactiveElements.forEach(el => {
                // remove old listeners if we re-attach
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
        }

        function onEnter() { document.body.classList.add('cursor-hover'); }
        function onLeave() { document.body.classList.remove('cursor-hover'); }

        // Intersection Observer for Fade-Up
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        const fadeUpObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible if we want it to stay
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        function observeFadeUps() {
            document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
                fadeUpObserver.observe(el);
            });
        }
    </script>
</body>
</html>
"""

with open('index.html', 'w') as f:
    f.write(HTML_CONTENT)

print("index.html successfully created with Global Effects.")
