import re

# Sections to add
CSS_SECTIONS = """
        /* Navigation */
        nav {
            position: fixed;
            top: 0; left: 0; width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 4rem;
            backdrop-filter: blur(12px);
            background: rgba(8,8,8,0.85);
            z-index: 1000;
            transition: border-bottom 0.3s;
        }
        nav.scrolled {
            border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .logo {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: var(--primary-color);
            letter-spacing: 0.4em;
            text-decoration: none;
            position: relative;
        }
        .logo sup {
            font-size: 0.8rem;
            color: rgba(240, 235, 224, 0.5); /* faded white */
            position: absolute;
            top: 0.2rem;
            right: -1rem;
            letter-spacing: normal;
        }
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        .nav-links a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            position: relative;
            padding-bottom: 4px;
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0;
            width: 100%; height: 1px;
            background-color: var(--primary-color);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
        }
        .nav-links a:hover::after {
            transform: scaleX(1);
        }

        /* Hero */
        #hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            text-align: center;
            overflow: hidden;
        }
        #hero::after { /* Grid lines overlay */
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image:
                linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
            background-size: 80px 80px;
            pointer-events: none;
            z-index: 1;
        }
        #particle-canvas {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 0;
        }
        .hero-ring {
            position: absolute;
            border: 1px solid rgba(201,168,76,0.08);
            border-radius: 50%;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 0;
        }
        .ring-1 {
            width: 600px; height: 600px;
            animation: pulse-ring 6s ease-in-out infinite alternate;
        }
        .ring-2 {
            width: 900px; height: 900px;
            animation: pulse-ring-reverse 8s ease-in-out infinite alternate;
        }
        @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.95); }
            100% { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes pulse-ring-reverse {
            0% { transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(0.95); }
        }
        .hero-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .eyebrow {
            font-size: 0.65rem;
            letter-spacing: 0.5em;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        .hero-title {
            font-family: var(--font-heading);
            font-size: 18vw;
            font-weight: 300;
            color: var(--primary-color);
            line-height: 0.9;
            margin: 0;
            display: block;
        }
        .hero-subtitle {
            font-family: var(--font-heading);
            font-size: 6vw;
            color: var(--text-color);
            letter-spacing: 0.5em;
            font-style: italic;
            font-weight: 300;
            margin-top: -1vw;
            margin-bottom: 2rem;
        }
        .descriptor {
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            color: rgba(240, 235, 224, 0.6);
            margin-bottom: 3rem;
        }
        .btn-cta {
            position: relative;
            padding: 1rem 3rem;
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            background: transparent;
            font-family: var(--font-body);
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            cursor: none; /* Let custom cursor handle it */
            overflow: hidden;
            transition: color 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        .btn-cta::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--primary-color);
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
            z-index: -1;
        }
        .btn-cta:hover {
            color: #000;
        }
        .btn-cta:hover::before {
            transform: translateX(0);
        }
        .scroll-hint {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            z-index: 2;
        }
        .scroll-line {
            width: 1px;
            height: 60px;
            background: linear-gradient(to bottom, var(--primary-color), transparent);
            animation: pulse-scroll 2s infinite;
        }
        .scroll-hint span {
            font-size: 0.6rem;
            letter-spacing: 0.2em;
            color: rgba(240, 235, 224, 0.5);
        }
        @keyframes pulse-scroll {
            0% { transform: scaleY(0); transform-origin: top; }
            50% { transform: scaleY(1); transform-origin: top; }
            50.1% { transform: scaleY(1); transform-origin: bottom; }
            100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* Services - Pizza Wheel */
        #services {
            padding: 8rem 2rem;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .wheel-container {
            position: relative;
            width: 640px;
            height: 640px;
        }
        .wheel-svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg); /* Start from top */
        }
        .slice-path {
            fill: var(--primary-color);
            fill-opacity: 0.08;
            stroke: var(--primary-color);
            stroke-width: 1px;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-origin: 320px 320px;
            cursor: none;
        }
        .slice-group:hover .slice-path {
            fill-opacity: 0.25;
            stroke-width: 2px;
            /* In JS we'll apply translate to move it out slightly */
        }
        .slice-group.active .slice-path {
            fill-opacity: 0.4;
            stroke-width: 2px;
        }
        .slice-text {
            font-family: var(--font-body);
            font-size: 14px;
            fill: var(--text-color);
            pointer-events: none;
            letter-spacing: 0.1em;
            text-anchor: middle;
        }
        .center-circle {
            fill: var(--primary-color);
            cursor: none;
        }
        .center-text {
            font-family: var(--font-heading);
            font-size: 2rem;
            fill: #000;
            pointer-events: none;
            text-anchor: middle;
            dominant-baseline: central;
        }

        .service-detail-card {
            position: absolute;
            right: -300px;
            top: 50%;
            transform: translateY(-50%);
            width: 400px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease, transform 0.4s ease;
            background: rgba(17, 17, 17, 0.8);
            backdrop-filter: blur(8px);
            padding: 2rem;
            border: 1px solid rgba(201,168,76,0.2);
            z-index: 10;
        }
        .service-detail-card.active {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(-50%) translateX(-20px);
        }
        .service-detail-title {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        .service-detail-desc {
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 1.5rem;
            color: rgba(240, 235, 224, 0.8);
        }
        .service-detail-features {
            list-style: none;
            margin-bottom: 2rem;
        }
        .service-detail-features li {
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
            padding-left: 1.2rem;
            position: relative;
        }
        .service-detail-features li::before {
            content: '✦';
            position: absolute;
            left: 0;
            color: var(--primary-color);
        }

        /* Works Grid */
        #works {
            padding: 5rem 2rem;
            background: var(--surface-color);
        }
        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }
        .section-title {
            font-family: var(--font-heading);
            font-size: 4rem;
            color: var(--primary-color);
            font-weight: 300;
        }
        .works-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            background: var(--bg-color); /* Acts as border color for the gaps */
            border: 2px solid var(--bg-color);
            margin-bottom: 4rem;
        }
        .project-card {
            aspect-ratio: 4/5;
            position: relative;
            overflow: hidden;
            cursor: none;
        }
        .project-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-size: cover;
            background-position: center;
            transition: transform 1s ease;
        }
        .project-bg-pattern {
            position: absolute;
            top: 50%; left: 50%; width: 150%; height: 150%;
            transform: translate(-50%, -50%);
            background-image: radial-gradient(circle at center, rgba(201,168,76,0.1) 0%, transparent 70%);
            transition: transform 10s linear;
        }
        .project-card:hover .project-bg {
            transform: scale(1.05);
        }
        .project-card:hover .project-bg-pattern {
            transform: translate(-50%, -50%) rotate(15deg);
        }
        .project-number {
            position: absolute;
            top: 1rem; right: 1.5rem;
            font-family: var(--font-heading);
            font-size: 5rem;
            color: rgba(255, 255, 255, 0.1);
            line-height: 1;
        }
        .project-overlay {
            position: absolute;
            bottom: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 2rem;
        }
        .project-card:hover .project-overlay {
            opacity: 1;
        }
        .project-title {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: var(--text-color);
            transform: translateY(20px);
            transition: transform 0.4s ease;
        }
        .project-category {
            font-size: 0.8rem;
            color: var(--primary-color);
            letter-spacing: 0.1em;
            margin-top: 0.5rem;
            transform: translateY(20px);
            transition: transform 0.4s ease;
            transition-delay: 0.05s;
        }
        .project-link {
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            color: var(--text-color);
            text-decoration: none;
            margin-top: 1.5rem;
            display: inline-block;
            transform: translateY(20px);
            transition: transform 0.4s ease;
            transition-delay: 0.1s;
        }
        .project-card:hover .project-title,
        .project-card:hover .project-category,
        .project-card:hover .project-link {
            transform: translateY(0);
        }
        .btn-center {
            display: flex;
            justify-content: center;
        }

        /* Stats */
        #stats {
            position: relative;
            padding: 6rem 2rem;
            background: #000;
            overflow: hidden;
        }
        .bg-text {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            font-family: var(--font-heading);
            font-size: 25vw;
            color: rgba(255, 255, 255, 0.025);
            pointer-events: none;
            white-space: nowrap;
        }
        .stats-container {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-around;
            max-width: 1200px;
            margin: 0 auto;
        }
        .stat-item {
            position: relative;
            text-align: center;
            flex: 1;
            padding: 2rem 1rem;
        }
        .stat-item:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 10%; right: 0;
            width: 1px; height: 80%;
            background: rgba(201,168,76,0.3);
        }
        .stat-top-border {
            position: absolute;
            top: 0; left: 0; height: 1px;
            background: var(--primary-color);
            width: 0%;
            transition: width 1.5s ease;
        }
        .stat-item.visible .stat-top-border {
            width: 100%;
        }
        .stat-number-wrapper {
            font-family: var(--font-heading);
            font-size: 6rem;
            color: var(--primary-color);
            line-height: 1;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: baseline;
        }
        .stat-suffix {
            font-size: 3rem;
        }
        .stat-label {
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            color: rgba(240, 235, 224, 0.7);
        }

        /* Process */
        #process {
            padding: 8rem 2rem;
        }
        .process-timeline {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            max-width: 1000px;
            margin: 0 auto;
            position: relative;
        }
        .timeline-line {
            position: absolute;
            top: 100px; /* Aligned with dots */
            left: 5%; width: 90%; height: 1px;
            background: rgba(201,168,76,0.3);
            z-index: 0;
        }
        .process-step {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            flex: 1;
            padding: 1rem;
            transition: background 0.3s ease;
        }
        .process-step:hover {
            background: rgba(201,168,76,0.02);
            border-radius: 8px;
        }
        .step-number {
            font-family: var(--font-heading);
            font-size: 5rem;
            color: rgba(201,168,76,0.05);
            line-height: 1;
            margin-bottom: 1rem;
        }
        .step-dot {
            width: 12px; height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
            margin-bottom: 2rem;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .process-step:hover .step-dot {
            transform: scale(2);
            box-shadow: 0 0 15px var(--primary-color);
        }
        .step-name {
            font-family: var(--font-heading);
            font-size: 1.4rem;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }
        .step-desc {
            font-size: 0.8rem;
            color: rgba(240, 235, 224, 0.6);
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 150px;
        }
        .process-step:hover .step-desc {
            opacity: 1;
            transform: translateY(0);
        }

        /* Hosting Banner */
        #hosting {
            padding: 6rem 4rem;
            background: rgba(201,168,76,0.04);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
            border-top: 1px solid rgba(201,168,76,0.1);
            border-bottom: 1px solid rgba(201,168,76,0.1);
            overflow: hidden;
        }
        .badge-container {
            width: 160px; height: 160px;
            flex-shrink: 0;
            position: relative;
        }
        .rotating-badge {
            width: 100%; height: 100%;
            border: 1px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 10s linear infinite;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .badge-content {
            animation: spin-reverse 10s linear infinite; /* Counter-rotate to keep text upright */
            text-align: center;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }

        .badge-content .six { font-family: var(--font-heading); font-size: 3rem; color: var(--primary-color); line-height: 1; }
        .badge-content .months { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.2rem; }
        .badge-content .free { font-family: var(--font-heading); font-style: italic; color: var(--text-color); }

        .hosting-text {
            flex: 1;
            padding: 0 2rem;
        }
        .hosting-text h2 {
            font-family: var(--font-heading);
            font-size: 3.5rem;
            font-weight: 300;
            margin-bottom: 1rem;
            line-height: 1.1;
        }
        .hosting-text h2 em {
            color: var(--primary-color);
            font-style: italic;
        }
        .hosting-sub {
            font-size: 0.9rem;
            color: rgba(240, 235, 224, 0.8);
            letter-spacing: 0.1em;
            margin-bottom: 2rem;
        }

        .orbit-diagram {
            width: 200px; height: 200px;
            flex-shrink: 0;
            position: relative;
        }
        .orbit {
            position: absolute;
            top: 50%; left: 50%;
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 50%;
            transform-style: preserve-3d;
        }
        .orbit-1 { width: 100%; height: 100%; transform: translate(-50%, -50%) rotateX(60deg) rotateY(20deg); animation: orbit-spin 12s linear infinite; }
        .orbit-2 { width: 80%; height: 80%; transform: translate(-50%, -50%) rotateX(60deg) rotateY(-40deg); animation: orbit-spin 8s linear infinite reverse; }
        .orbit-3 { width: 60%; height: 60%; transform: translate(-50%, -50%) rotateX(60deg) rotateY(80deg); animation: orbit-spin 15s linear infinite; }
        @keyframes orbit-spin { 100% { transform: translate(-50%, -50%) rotateX(60deg) rotateY(20deg) rotateZ(360deg); } } /* Approximate, CSS 3D is tricky */
        .orbit-dot {
            position: absolute;
            top: -3px; left: 50%;
            width: 6px; height: 6px;
            background: var(--primary-color);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--primary-color);
        }

        /* Contact & Footer */
        #contact {
            padding: 8rem 2rem 4rem;
            text-align: center;
        }
        .contact-title {
            font-family: var(--font-heading);
            font-size: 5rem;
            font-weight: 300;
            margin-bottom: 4rem;
        }
        .contact-title em {
            color: var(--primary-color);
            font-style: italic;
        }
        .contact-blocks {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 6rem;
            flex-wrap: wrap;
        }
        .contact-block {
            padding: 2rem 3rem;
            border: 1px solid rgba(201,168,76,0.1);
            background: rgba(17,17,17,0.5);
            transition: border-color 0.3s;
            cursor: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
        }
        .contact-block:hover {
            border-color: var(--primary-color);
        }
        .contact-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .contact-label {
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            color: rgba(240, 235, 224, 0.6);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }
        .contact-val {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            color: var(--text-color);
        }

        footer {
            background: #050505;
            padding: 2rem 4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(201,168,76,0.1);
            position: relative;
        }
        footer::before {
            content: '';
            position: absolute;
            top: -1px; left: 0; width: 100%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite linear;
        }
        .footer-logo { font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary-color); letter-spacing: 0.2em; }
        .footer-copy { font-size: 0.8rem; color: rgba(240, 235, 224, 0.5); }
        .footer-tag { font-size: 0.8rem; color: rgba(240, 235, 224, 0.5); font-style: italic; font-family: var(--font-heading); }

        @media (max-width: 1024px) {
            .wheel-container { transform: scale(0.8); }
            .service-detail-card { right: -150px; }
            .hosting-text h2 { font-size: 2.5rem; }
        }
        @media (max-width: 768px) {
            .nav-links { display: none; } /* Simple mobile hide for now */
            .hero-title { font-size: 22vw; }
            .works-grid { grid-template-columns: 1fr; }
            .stats-container { flex-direction: column; gap: 2rem; }
            .stat-item:not(:last-child)::after { display: none; }
            .process-timeline { flex-direction: column; align-items: center; gap: 2rem; }
            .timeline-line { display: none; }
            #hosting { flex-direction: column; text-align: center; }
            .orbit-diagram { display: none; }
            .wheel-container { transform: scale(0.5); margin-bottom: 250px; }
            .service-detail-card {
                right: auto; left: 50%; top: 100%;
                transform: translateX(-50%) translateY(0);
                width: 90vw;
            }
            .service-detail-card.active { transform: translateX(-50%) translateY(20px); }
        }
"""

HTML_SECTIONS = """
        <nav id="navbar">
            <a href="#" class="logo clickable">SKS<sup>™</sup></a>
            <ul class="nav-links">
                <li><a href="#works" class="clickable">Works</a></li>
                <li><a href="#services" class="clickable">Services</a></li>
                <li><a href="#process" class="clickable">Process</a></li>
                <li><a href="#hosting" class="clickable">Hosting</a></li>
                <li><a href="#contact" class="clickable">Contact</a></li>
            </ul>
        </nav>

        <section id="hero">
            <canvas id="particle-canvas"></canvas>
            <div class="hero-ring ring-1"></div>
            <div class="hero-ring ring-2"></div>

            <div class="hero-content">
                <span class="eyebrow fade-up">ESTABLISHED · 2020 · INDIA</span>
                <h1 class="hero-title fade-up" style="transition-delay: 0.2s">SKS</h1>
                <h2 class="hero-subtitle fade-up" style="transition-delay: 0.4s">AGENCY</h2>
                <p class="descriptor fade-up" style="transition-delay: 0.6s">Software · Websites · Booking · Billing · Hosting</p>
                <a href="#works" class="btn-cta clickable fade-up" style="transition-delay: 0.8s">EXPLORE OUR WORK ↓</a>
            </div>

            <div class="scroll-hint fade-up" style="transition-delay: 1s">
                <div class="scroll-line"></div>
                <span>SCROLL</span>
            </div>
        </section>

        <section id="services">
            <div class="section-header" style="position: absolute; top: 4rem; left: 50%; transform: translateX(-50%);">
                <h2 class="section-title fade-up">Our Services</h2>
            </div>
            <div class="wheel-container fade-up">
                <svg class="wheel-svg" viewBox="0 0 640 640" id="pizza-wheel">
                    <!-- Slices will be generated by JS -->
                </svg>
                <div class="service-detail-card" id="service-card">
                    <h3 class="service-detail-title" id="sd-title">Service Name</h3>
                    <p class="service-detail-desc" id="sd-desc">Description</p>
                    <ul class="service-detail-features" id="sd-features">
                        <!-- Features -->
                    </ul>
                    <a href="#contact" class="btn-cta clickable" style="padding: 0.5rem 1.5rem; font-size: 0.7rem;">GET A QUOTE &rarr;</a>
                </div>
            </div>
        </section>

        <section id="works">
            <div class="section-header fade-up">
                <h2 class="section-title">Selected Works</h2>
            </div>
            <div class="works-grid">
                <!-- Card 1 -->
                <div class="project-card clickable fade-up">
                    <div class="project-bg" style="background-color: #1A1208;"></div>
                    <div class="project-bg-pattern"></div>
                    <div class="project-number">01</div>
                    <div class="project-overlay">
                        <h3 class="project-title">LuxeDine</h3>
                        <span class="project-category">Restaurant Booking App</span>
                        <span class="project-link">VIEW PROJECT &rarr;</span>
                    </div>
                </div>
                <!-- Card 2 -->
                <div class="project-card clickable fade-up" style="transition-delay: 0.1s">
                    <div class="project-bg" style="background-color: #0A0F1A;"></div>
                    <div class="project-bg-pattern"></div>
                    <div class="project-number">02</div>
                    <div class="project-overlay">
                        <h3 class="project-title">BillFlow Pro</h3>
                        <span class="project-category">Invoice & Billing Suite</span>
                        <span class="project-link">VIEW PROJECT &rarr;</span>
                    </div>
                </div>
                <!-- Card 3 -->
                <div class="project-card clickable fade-up" style="transition-delay: 0.2s">
                    <div class="project-bg" style="background-color: #0F1A0F;"></div>
                    <div class="project-bg-pattern"></div>
                    <div class="project-number">03</div>
                    <div class="project-overlay">
                        <h3 class="project-title">EstateEdge</h3>
                        <span class="project-category">Real Estate Landing Page</span>
                        <span class="project-link">VIEW PROJECT &rarr;</span>
                    </div>
                </div>
                <!-- Card 4 -->
                <div class="project-card clickable fade-up">
                    <div class="project-bg" style="background-color: #1A0A0A;"></div>
                    <div class="project-bg-pattern"></div>
                    <div class="project-number">04</div>
                    <div class="project-overlay">
                        <h3 class="project-title">MediCore</h3>
                        <span class="project-category">Hospital Management</span>
                        <span class="project-link">VIEW PROJECT &rarr;</span>
                    </div>
                </div>
                <!-- Card 5 -->
                <div class="project-card clickable fade-up" style="transition-delay: 0.1s">
                    <div class="project-bg" style="background-color: #0F0A1A;"></div>
                    <div class="project-bg-pattern"></div>
                    <div class="project-number">05</div>
                    <div class="project-overlay">
                        <h3 class="project-title">ShopForge</h3>
                        <span class="project-category">E-commerce Platform</span>
                        <span class="project-link">VIEW PROJECT &rarr;</span>
                    </div>
                </div>
                <!-- Card 6 -->
                <div class="project-card clickable fade-up" style="transition-delay: 0.2s">
                    <div class="project-bg" style="background-color: #1A1505;"></div>
                    <div class="project-bg-pattern"></div>
                    <div class="project-number">06</div>
                    <div class="project-overlay">
                        <h3 class="project-title">TicketVault</h3>
                        <span class="project-category">Event Ticketing System</span>
                        <span class="project-link">VIEW PROJECT &rarr;</span>
                    </div>
                </div>
            </div>
            <div class="btn-center fade-up">
                <a href="#" class="btn-cta clickable">VIEW ALL PROJECTS &rarr;</a>
            </div>
        </section>

        <section id="stats">
            <div class="bg-text">EXCELLENCE</div>
            <div class="stats-container">
                <div class="stat-item fade-up">
                    <div class="stat-top-border"></div>
                    <div class="stat-number-wrapper">
                        <span class="counter" data-target="120">0</span>
                        <span class="stat-suffix">+</span>
                    </div>
                    <div class="stat-label">Projects Delivered</div>
                </div>
                <div class="stat-item fade-up">
                    <div class="stat-top-border"></div>
                    <div class="stat-number-wrapper">
                        <span class="counter" data-target="98">0</span>
                        <span class="stat-suffix">%</span>
                    </div>
                    <div class="stat-label">Client Satisfaction</div>
                </div>
                <div class="stat-item fade-up">
                    <div class="stat-top-border"></div>
                    <div class="stat-number-wrapper">
                        <span class="counter" data-target="6">0</span>
                    </div>
                    <div class="stat-label">Months Free Hosting</div>
                </div>
                <div class="stat-item fade-up">
                    <div class="stat-top-border"></div>
                    <div class="stat-number-wrapper">
                        <span class="counter" data-target="24">0</span>
                        <span class="stat-suffix">/7</span>
                    </div>
                    <div class="stat-label">Support Available</div>
                </div>
            </div>
        </section>

        <section id="process">
            <div class="section-header fade-up">
                <h2 class="section-title">Our Process</h2>
            </div>
            <div class="process-timeline fade-up">
                <div class="timeline-line"></div>
                <div class="process-step">
                    <div class="step-number">01</div>
                    <div class="step-dot"></div>
                    <h4 class="step-name">Discover</h4>
                    <p class="step-desc">We analyze your requirements and goals deeply.</p>
                </div>
                <div class="process-step">
                    <div class="step-number">02</div>
                    <div class="step-dot"></div>
                    <h4 class="step-name">Design</h4>
                    <p class="step-desc">Crafting pixel-perfect, luxury interfaces.</p>
                </div>
                <div class="process-step">
                    <div class="step-number">03</div>
                    <div class="step-dot"></div>
                    <h4 class="step-name">Develop</h4>
                    <p class="step-desc">Writing clean, scalable, high-performance code.</p>
                </div>
                <div class="process-step">
                    <div class="step-number">04</div>
                    <div class="step-dot"></div>
                    <h4 class="step-name">Deploy</h4>
                    <p class="step-desc">Launching your product to the world flawlessly.</p>
                </div>
                <div class="process-step">
                    <div class="step-number">05</div>
                    <div class="step-dot"></div>
                    <h4 class="step-name">Support</h4>
                    <p class="step-desc">24/7 maintenance and hosting included.</p>
                </div>
            </div>
        </section>

        <section id="hosting" class="fade-up">
            <div class="badge-container">
                <div class="rotating-badge">
                    <div class="badge-content">
                        <div class="six">6</div>
                        <div class="months">MONTHS</div>
                        <div class="free">FREE</div>
                    </div>
                </div>
            </div>
            <div class="hosting-text">
                <h2>Every Project Ships With <br><em>6 Months Free Hosting</em></h2>
                <div class="hosting-sub">SSL · Daily Backups · 99.9% Uptime · Zero Setup Fees</div>
                <a href="#contact" class="btn-cta clickable">CLAIM YOUR FREE HOSTING &rarr;</a>
            </div>
            <div class="orbit-diagram">
                <div class="orbit orbit-1"><div class="orbit-dot"></div></div>
                <div class="orbit orbit-2"><div class="orbit-dot"></div></div>
                <div class="orbit orbit-3"><div class="orbit-dot"></div></div>
            </div>
        </section>

        <section id="contact">
            <h2 class="contact-title fade-up">Let's Build Something <br><em>Extraordinary</em></h2>
            <div class="contact-blocks fade-up">
                <a href="mailto:hello@sksagency.in" class="contact-block clickable">
                    <div class="contact-icon">📧</div>
                    <div class="contact-label">Email</div>
                    <div class="contact-val">hello@sksagency.in</div>
                </a>
                <a href="#" class="contact-block clickable">
                    <div class="contact-icon">💬</div>
                    <div class="contact-label">WhatsApp</div>
                    <div class="contact-val">+91 98765 43210</div>
                </a>
                <a href="#" class="contact-block clickable">
                    <div class="contact-icon">📸</div>
                    <div class="contact-label">Instagram</div>
                    <div class="contact-val">@sksagency</div>
                </a>
            </div>
        </section>

        <footer>
            <div class="footer-logo">SKS</div>
            <div class="footer-copy">&copy; 2025 SKS Agency. All rights reserved.</div>
            <div class="footer-tag">Crafted with obsession.</div>
        </footer>
"""

JS_SECTIONS = """
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Hero Particle Canvas
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(201,168,76,0.6)';
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(201,168,76,${0.2 * (1 - dist/150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Add subtle parallax based on scroll
            canvas.style.transform = `translateY(${window.scrollY * 0.3}px)`;

            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Pizza Wheel SVG Generation
        const servicesData = [
            { icon: '🌐', title: 'Web Development', desc: 'Full-stack websites built for performance, beauty, and conversions. React, Node, databases — complete solutions.', features: ['Custom design, zero templates', 'Mobile-first responsive', 'SEO optimized from day 1'] },
            { icon: '🚀', title: 'Landing Pages', desc: 'High-converting landing pages that turn visitors into clients. Pixel-perfect, blazing fast.', features: ['Conversion-focused layouts', 'A/B test ready', 'Delivered in 72 hours'] },
            { icon: '📅', title: 'Booking Systems', desc: 'Online booking platforms for restaurants, clinics, salons, and more. Real-time availability.', features: ['Calendar sync', 'SMS/Email reminders', 'Payment integration'] },
            { icon: '💳', title: 'Billing Software', desc: 'Custom invoicing and billing dashboards. Track revenue, generate invoices, manage clients.', features: ['Automated invoice generation', 'GST/tax ready', 'Client payment portal'] },
            { icon: '⚙️', title: 'Custom Software', desc: 'Whatever you need built — we build it. Web apps, dashboards, internal tools, automations.', features: ['Requirement analysis included', 'Scalable architecture', 'Full source code handover'] },
            { icon: '🛡️', title: 'Free Hosting', desc: 'Every project ships with 6 months of free hosting. Zero compromise on speed.', features: ['SSL certificate included', '99.9% uptime guarantee', 'Daily backups'] }
        ];

        const wheelSvg = document.getElementById('pizza-wheel');
        const cx = 320, cy = 320;
        const radius = 280;
        const innerRadius = 110;
        const numSlices = 6;
        const angleStep = (Math.PI * 2) / numSlices;
        const gapOffset = 0.02; // Small gap between slices

        function polarToCartesian(centerX, centerY, radius, angleInRadians) {
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        }

        // We'll generate paths
        let activeSlice = null;

        servicesData.forEach((service, index) => {
            const startAngle = index * angleStep + gapOffset;
            const endAngle = (index + 1) * angleStep - gapOffset;

            // Calculate points for the arc
            const startOuter = polarToCartesian(cx, cy, radius, startAngle);
            const endOuter = polarToCartesian(cx, cy, radius, endAngle);
            const startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
            const endInner = polarToCartesian(cx, cy, innerRadius, endAngle);

            // Large arc flag is always 0 since angle < 180 (it's 60 deg)
            const largeArcFlag = 0;

            // Path definition
            const d = [
                `M ${startInner.x} ${startInner.y}`,
                `L ${startOuter.x} ${startOuter.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                `L ${endInner.x} ${endInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
                'Z'
            ].join(' ');

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('slice-group', 'clickable');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.classList.add('slice-path');

            // Add Text/Icon
            const midAngle = (startAngle + endAngle) / 2;
            const textRadius = innerRadius + (radius - innerRadius) / 2;
            const textPos = polarToCartesian(cx, cy, textRadius, midAngle);

            // Calculate rotation for text so it faces outwards nicely
            // We started by rotating the whole SVG -90deg.
            // Angle is 0 to 2PI. Mid angle in degrees:
            let textRot = (midAngle * 180 / Math.PI);
            // Flip text if it's upside down
            if (textRot > 90 && textRot < 270) {
                textRot += 180;
            }

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textPos.x);
            text.setAttribute('y', textPos.y);
            text.setAttribute('transform', `rotate(${textRot}, ${textPos.x}, ${textPos.y})`);
            text.classList.add('slice-text');

            // Add icon and text
            text.innerHTML = `<tspan x="${textPos.x}" dy="-10" style="font-size: 24px">${service.icon}</tspan>
                              <tspan x="${textPos.x}" dy="25">${service.title.split(' ')[0]}</tspan>
                              <tspan x="${textPos.x}" dy="15">${service.title.split(' ')[1] || ''}</tspan>`;

            group.appendChild(path);
            group.appendChild(text);
            wheelSvg.appendChild(group);

            // Interaction
            const moveOutDist = 20;
            const moveOutClickDist = 35;
            // Direction to move (away from center)
            const dx = Math.cos(midAngle);
            const dy = Math.sin(midAngle);

            group.addEventListener('mouseenter', () => {
                if(activeSlice !== index) {
                    path.style.transform = `translate(${dx * moveOutDist}px, ${dy * moveOutDist}px)`;
                }
            });
            group.addEventListener('mouseleave', () => {
                if(activeSlice !== index) {
                    path.style.transform = `translate(0, 0)`;
                }
            });
            group.addEventListener('click', () => {
                // Reset all
                document.querySelectorAll('.slice-path').forEach(p => p.style.transform = 'translate(0,0)');
                document.querySelectorAll('.slice-group').forEach(g => g.classList.remove('active'));

                activeSlice = index;
                group.classList.add('active');
                path.style.transform = `translate(${dx * moveOutClickDist}px, ${dy * moveOutClickDist}px)`;

                showServiceDetail(service);
            });
        });

        // Add Center Circle Over the slices
        const centerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        centerGroup.classList.add('clickable');

        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', cx);
        centerCircle.setAttribute('cy', cy);
        centerCircle.setAttribute('r', innerRadius - 5);
        centerCircle.classList.add('center-circle');

        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', cx);
        centerText.setAttribute('y', cy);
        // We have to counter-rotate the text because the SVG is rotated -90deg
        centerText.setAttribute('transform', `rotate(90, ${cx}, ${cy})`);
        centerText.textContent = 'SKS';
        centerText.classList.add('center-text');

        centerGroup.appendChild(centerCircle);
        centerGroup.appendChild(centerText);
        wheelSvg.appendChild(centerGroup);

        centerGroup.addEventListener('click', () => {
            // Close detail
            activeSlice = null;
            document.querySelectorAll('.slice-path').forEach(p => p.style.transform = 'translate(0,0)');
            document.querySelectorAll('.slice-group').forEach(g => g.classList.remove('active'));
            document.getElementById('service-card').classList.remove('active');
        });

        function showServiceDetail(service) {
            const card = document.getElementById('service-card');
            document.getElementById('sd-title').textContent = service.title;
            document.getElementById('sd-desc').textContent = service.desc;

            const ul = document.getElementById('sd-features');
            ul.innerHTML = '';
            service.features.forEach(f => {
                const li = document.createElement('li');
                li.textContent = f;
                ul.appendChild(li);
            });

            card.classList.add('active');
        }

        // Stats Counter Animation
        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector('.counter');
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // ease out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);

                        counter.innerText = Math.floor(easeProgress * target);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));

        // Re-attach cursor hover events since we added new DOM elements
        attachCursorHover();
        observeFadeUps();
"""

with open('index.html', 'r') as f:
    content = f.read()

# Insert CSS
content = content.replace('</style>', CSS_SECTIONS + '\n    </style>')

# Insert HTML
content = content.replace('<div id="app">\n    </div>', '<div id="app">\n' + HTML_SECTIONS + '\n    </div>')

# Insert JS
content = content.replace('</script>\n</body>', JS_SECTIONS + '\n    </script>\n</body>')

with open('index.html', 'w') as f:
    f.write(content)

print("index.html updated with Sections.")
