import os

CSS_JULES = """
        /* Jules AI Chat Widget */
        #jules-widget {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9000;
        }
        .jules-trigger {
            width: 60px; height: 60px;
            background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: var(--font-heading);
            font-size: 1.6rem;
            color: #000;
            cursor: none;
            box-shadow: 0 0 20px rgba(201,168,76,0.2);
            animation: pulse-shadow 2s infinite alternate;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .jules-trigger:hover {
            transform: scale(1.1);
        }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 10px rgba(201,168,76,0.2); }
            100% { box-shadow: 0 0 30px rgba(201,168,76,0.6); }
        }

        .jules-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 360px;
            height: 520px;
            background: rgba(17, 17, 17, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform-origin: bottom right;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .jules-panel.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        .jules-header {
            padding: 1rem;
            background: rgba(8, 8, 8, 0.9);
            border-bottom: 1px solid rgba(201,168,76,0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .jules-avatar {
            width: 40px; height: 40px;
            background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: var(--font-heading);
            color: #000;
            font-size: 1.2rem;
            position: relative;
        }
        .jules-status-dot {
            position: absolute;
            bottom: 0; right: 0;
            width: 10px; height: 10px;
            background: #4ade80;
            border-radius: 50%;
            border: 2px solid #080808;
            animation: blink 2s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .jules-info { flex: 1; }
        .jules-name { font-family: var(--font-heading); font-size: 1.2rem; color: var(--primary-color); line-height: 1.2; }
        .jules-sub { font-size: 0.6rem; color: rgba(240, 235, 224, 0.6); letter-spacing: 0.1em; }
        .jules-close {
            background: none; border: none; color: rgba(240, 235, 224, 0.6);
            font-size: 1.2rem; cursor: none; padding: 0.5rem; transition: color 0.3s;
        }
        .jules-close:hover { color: var(--primary-color); }

        .jules-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .jules-messages::-webkit-scrollbar { width: 4px; }
        .jules-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 4px; }

        .msg {
            max-width: 85%;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            line-height: 1.4;
            animation: msg-in 0.3s ease-out;
        }
        @keyframes msg-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .msg.jules {
            align-self: flex-start;
            background: rgba(8, 8, 8, 0.6);
            border-left: 2px solid var(--primary-color);
            color: var(--text-color);
        }
        .msg.user {
            align-self: flex-end;
            background: rgba(201,168,76,0.1);
            color: var(--primary-color);
        }

        .typing-indicator {
            display: none;
            align-self: flex-start;
            background: rgba(8, 8, 8, 0.6);
            border-left: 2px solid var(--primary-color);
            padding: 0.8rem 1rem;
            border-radius: 8px;
            gap: 4px;
        }
        .typing-indicator.active { display: flex; }
        .typing-dot {
            width: 6px; height: 6px;
            background: var(--primary-color);
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        .jules-input-area {
            padding: 1rem;
            background: rgba(8, 8, 8, 0.9);
            border-top: 1px solid rgba(201,168,76,0.1);
            display: flex;
            gap: 0.5rem;
        }
        .jules-input {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 20px;
            padding: 0.5rem 1rem;
            color: var(--text-color);
            font-family: var(--font-body);
            font-size: 0.8rem;
            outline: none;
            transition: border-color 0.3s;
        }
        .jules-input:focus { border-color: var(--primary-color); }
        .jules-send {
            background: none; border: none;
            color: var(--primary-color);
            font-size: 1.2rem; cursor: none;
            padding: 0 0.5rem;
            transition: transform 0.3s;
        }
        .jules-send:hover { transform: translateX(3px) scale(1.1); }

        @media (max-width: 480px) {
            .jules-panel {
                width: calc(100vw - 2rem);
                right: -1rem; /* center relative to trigger padding */
            }
        }
"""

HTML_JULES = """
        <!-- Jules AI Chat Widget -->
        <div id="jules-widget">
            <div class="jules-panel" id="jules-panel">
                <div class="jules-header">
                    <div class="jules-avatar">J<div class="jules-status-dot"></div></div>
                    <div class="jules-info">
                        <div class="jules-name">Jules</div>
                        <div class="jules-sub">SKS Digital Concierge · Online</div>
                    </div>
                    <button class="jules-close clickable" id="jules-close">&times;</button>
                </div>
                <div class="jules-messages" id="jules-messages">
                    <!-- Messages go here -->
                    <div class="typing-indicator" id="jules-typing">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
                <div class="jules-input-area">
                    <input type="text" class="jules-input" id="jules-input" placeholder="Ask me anything..." autocomplete="off">
                    <button class="jules-send clickable" id="jules-send">&#10148;</button>
                </div>
            </div>
            <div class="jules-trigger clickable" id="jules-trigger">J</div>
        </div>
"""

JS_JULES = """
        // Jules AI Logic
        const julesTrigger = document.getElementById('jules-trigger');
        const julesPanel = document.getElementById('jules-panel');
        const julesClose = document.getElementById('jules-close');
        const julesMessages = document.getElementById('jules-messages');
        const julesInput = document.getElementById('jules-input');
        const julesSend = document.getElementById('jules-send');
        const typingIndicator = document.getElementById('jules-typing');

        // PASTE YOUR ANTHROPIC API KEY HERE
        const ANTHROPIC_API_KEY = ''; // Leave blank for the user to fill

        const systemPrompt = "You are Jules, the AI concierge for SKS Agency — a premium freelance software and web development studio based in India. You are elegant, intelligent, warm, and concise. SKS Agency offers: Custom Web Development, High-Converting Landing Pages, Booking Systems (restaurants, clinics, salons), Billing & Invoice Software, Custom Software of all kinds, and 6 Months of FREE Hosting with every project. Your job: help visitors understand SKS's services, guide them toward booking a consultation, answer questions about what SKS builds, suggest which service fits their needs, and generate creative project briefs on demand. Pricing: always say pricing is custom-quoted based on project scope, and invite them to share their idea. Never give specific numbers. Tone: luxury hotel concierge meets brilliant tech advisor. Never robotic. Never too long. Always leave the door open for the next message. Use occasional elegant phrasing. Max 4 sentences per reply unless asked for more detail. If asked to generate a creative brief for their project idea, do it — write a short, inspiring brief that makes them excited about building with SKS. Contact: invite them to share their email or WhatsApp number to connect with the SKS team directly.";

        let messageHistory = [];
        let hasOpenedBefore = false;

        julesTrigger.addEventListener('click', () => {
            julesPanel.classList.toggle('open');
            if (julesPanel.classList.contains('open') && !hasOpenedBefore) {
                hasOpenedBefore = true;
                addMessage("Hello. I'm Jules, SKS Agency's digital concierge. Whether you're looking to build a website, a booking system, or custom software — I'm here to guide you. What can I help you with today?", 'jules');
            }
        });

        julesClose.addEventListener('click', () => {
            julesPanel.classList.remove('open');
        });

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('msg', sender);
            msgDiv.textContent = text;
            julesMessages.insertBefore(msgDiv, typingIndicator);
            julesMessages.scrollTop = julesMessages.scrollHeight;
        }

        async function sendMessage() {
            const text = julesInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            julesInput.value = '';
            messageHistory.push({ role: 'user', content: text });

            if (!ANTHROPIC_API_KEY) {
                typingIndicator.classList.add('active');
                julesMessages.scrollTop = julesMessages.scrollHeight;
                setTimeout(() => {
                    typingIndicator.classList.remove('active');
                    addMessage("[API Key Missing] Jules needs an Anthropic API key to function. Please add it to the code.", 'jules');
                }, 1000);
                return;
            }

            typingIndicator.classList.add('active');
            julesMessages.scrollTop = julesMessages.scrollHeight;

            try {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': ANTHROPIC_API_KEY,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true'
                    },
                    body: JSON.stringify({
                        model: 'claude-sonnet-4-20250514', // Assuming user wants this model name based on prompt
                        max_tokens: 800,
                        system: systemPrompt,
                        messages: messageHistory
                    })
                });

                const data = await response.json();
                typingIndicator.classList.remove('active');

                if (data.error) {
                    console.error("Anthropic API Error:", data.error);
                    addMessage("I'm sorry, I'm having trouble connecting to my cognitive core right now.", 'jules');
                } else {
                    const reply = data.content[0].text;
                    addMessage(reply, 'jules');
                    messageHistory.push({ role: 'assistant', content: reply });
                }
            } catch (error) {
                console.error("Network Error:", error);
                typingIndicator.classList.remove('active');
                addMessage("I'm sorry, there was a network error. Please try again.", 'jules');
            }
        }

        julesSend.addEventListener('click', sendMessage);
        julesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Ensure new clickables get cursor logic
        attachCursorHover();
"""

with open('index.html', 'r') as f:
    content = f.read()

# Insert CSS
content = content.replace('/* Utility classes */', CSS_JULES + '\n        /* Utility classes */')

# Insert HTML before script tags
content = content.replace('    <!-- Custom Cursor Elements -->', HTML_JULES + '\n    <!-- Custom Cursor Elements -->')

# Insert JS before final </script>
content = content.replace('observeFadeUps();\n    </script>', 'observeFadeUps();\n' + JS_JULES + '\n    </script>')

with open('index.html', 'w') as f:
    f.write(content)

print("index.html updated with Jules Widget.")
