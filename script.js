document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('confession-form');
    const textArea = document.getElementById('confession-text');
    const charCounter = document.getElementById('char-counter');
    const submitBtn = document.getElementById('submit-btn');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.querySelector('.spinner');
    const successMessage = document.getElementById('success-message');
    const sendAnotherBtn = document.getElementById('send-another-btn');

    // --- Webhook URL (Slightly obfuscated) ---
    // This is NOT a secure method, but it deters simple bots.
    // For real applications, use a backend proxy to hide the webhook URL.
    const part1 = 'https://discord.com/api/webhooks/';
    const part2 = '1408488067177910352/';
    const part3 = 'zx4Md4X1A_D3YCMk--NnyJp2PEwY4_SWg1EhX0Xhlcr9h8I-j8LfQX0IbkukfFnvtH74';
    const webhookUrl = part1 + part2 + part3;

    // Character counter
    textArea.addEventListener('input', () => {
        const count = textArea.value.length;
        charCounter.textContent = `${count}/2000`;
        if (count > 2000) {
            charCounter.style.color = '#f85149';
        } else {
            charCounter.style.color = '#8b949e';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const confession = textArea.value.trim();
        if (confession === '' || confession.length > 2000) {
            alert('Confession cannot be empty or over 2000 characters.');
            return;
        }

        // Show loading state
        buttonText.style.display = 'none';
        spinner.style.display = 'block';
        submitBtn.disabled = true;

        // Create a pretty embed for Discord
        const payload = {
            username: "Deerwalk Confessions",
            avatar_url: "https://i.imgur.com/bSe1S5H.png", // Replace with your logo URL
            embeds: [
                {
                    author: {
                        name: "Deerwalk Confessions",
                        icon_url: "https://i.imgur.com/bSe1S5H.png" // Replace with your logo URL
                    },
                    title: "✨ A new secret has been shared... ✨",
                    color: 15779956, // Gold color
                    fields: [
                        {
                            name: "💌 Confession",
                            value: `>>> ${confession}`,
                            inline: false
                        },
                        {
                            name: "⏰ Timestamp",
                            value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`,
                            inline: true
                        },
                        {
                            name: "✍️ Length",
                            value: `${confession.length} characters`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: "Stay curious. Stay anonymous."
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                form.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                throw new Error(`Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending confession:', error);
            alert('There was an error sending your confession. Please try again later.');
            // Reset button on error
            buttonText.style.display = 'block';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    sendAnotherBtn.addEventListener('click', () => {
        location.reload();
    });
});
