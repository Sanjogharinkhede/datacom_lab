document.addEventListener('DOMContentLoaded', async function () {
    const generateJsonBtn = document.getElementById('generateJsonBtn');
    const generatedContent = document.getElementById('generatedContent');
    const sidebarMenu = document.getElementById('sidebarMenu');

    generateJsonBtn.addEventListener('click', async () => {
        const activeLink = sidebarMenu.querySelector('.nav-link.active');
        if (activeLink) {
            const topicText = activeLink.textContent.trim();
            const [category, topic] = getCategoryAndTopic(activeLink);
            await generateAndDisplayContent(category, topic, topicText);
        } else {
            alert('Please select a topic first!');
        }
    });

    /**
     * Get category and topic from sidebar link context
     */
    function getCategoryAndTopic(activeLink) {
        const section = activeLink.closest('.sidebar-section');
        const category = section.querySelector('.sidebar-title').textContent.replace('NMS', 'NMS').replace('DATACOM', 'Datacom');
        const topic = activeLink.textContent.replace('_', ' ');
        return [category, topic];
    }

    /**
     * Generate JSON with Gemini for the active topic and display it
     */
    async function generateAndDisplayContent(category, topic, topicText) {
        try {
            const envResponse = await fetch('.env');
            const envText = await envResponse.text();
            const apiKeyMatch = envText.match(/GEMINI_API_KEY=(.+)/);
            if (!apiKeyMatch) throw new Error('API key not found in .env');
            const apiKey = apiKeyMatch[1].trim();

            // Enhanced prompt with strict structure and examples
            const prompt = `
                Generate a single JSON object with a strict structure for a networking lab topic.
                The topic is "${topicText}", categorized under "${category}".
                Return only the topic data under the specified category and topic key, with no extra nesting.
                Include "full_form", "description", "features", "benefits", "disadvantages", and "commands" fields.
                - "full_form": A string with the full name (e.g., "${topicText} (example full form)"), even for non-abbreviated topics.
                - "description": A detailed string (2-3 sentences) with <br> for line breaks.
                - "features": A single string with <br> separators.
                - "benefits" and "disadvantages": Arrays of 2-3 items each.
                - "commands": An array of 2-3 relevant examples.
                Example for abbreviated topic (NETCONF):
                {
                    "full_form": "NETCONF (Network Configuration Protocol)",
                    "description": "It is a network monitoring protocol which configures devices programmatically.<br>It enhances efficiency by reducing complexity.<br>Data: XML",
                    "features": "Device management<br>Transactional support<br>YANG standardization",
                    "benefits": ["Automation", "Standardization"],
                    "disadvantages": ["Complexity", "Scalability"],
                    "commands": ["get", "edit-config", "commit"]
                }
                Example for non-abbreviated topic (Static Route):
                {
                    "full_form": "Static Route (Manually Configured Route)",
                    "description": "A static route is a fixed path in a routing table.<br>It ensures predictable traffic flow.<br>Setup is manual.",
                    "features": "Manual configuration<br>Fixed paths<br>No updates",
                    "benefits": ["Simplicity", "Control"],
                    "disadvantages": ["No adaptability", "Limited scale"],
                    "commands": ["ip route", "show route"]
                }
            `;

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('x-goog-api-key', apiKey);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { response_mime_type: 'application/json' }
                })
            };
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', requestOptions);
            if (!response.ok) throw new Error('Gemini API request failed');
            const result = await response.json();
            const jsonResponse = result.candidates[0].content.parts[0].text;
            console.log('Raw response:', jsonResponse); // Debug raw response
            const jsonContent = JSON.parse(jsonResponse);
            console.log('Parsed JSON:', jsonContent);
            console.log('Category:', category);
            console.log('Topic Key:', topic.replace(' ', '_'));

            // Clear previous content and display only for the active topic
            generatedContent.innerHTML = '';
            displayGeneratedContent(jsonContent, topic);
            console.log('Generated content:', JSON.stringify(jsonContent, null, 2));
            alert('Content generated for ' + topicText + '! Check console for JSON.');
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content: ' + error.message);
        }
    }

    /**
     * Display generated content in the same format as loadContent
     */
    function displayGeneratedContent(info, topic) {
        console.log('Displaying info:', info, 'for topic:', topic);
        generatedContent.style.display = 'block';
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${info.full_form || topic}</h5>
                    <p class="card-text">${info.description || ''}</p>
                    ${info.features ? `<span class="feature"><h6>Features</h6> ${info.features}</span>` : ''}
                    ${info.benefits ? `<h6>Benefits</h6><ul>${info.benefits.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
                    ${info.disadvantages ? `<h6>Disadvantages</h6><ul>${info.disadvantages.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
                    ${info.commands ? `<h6>Key Commands</h6><pre>${info.commands.join('\n')}</pre>` : ''}
                </div>
            </div>
        `;
        generatedContent.appendChild(card);
    }
});

// Button animation (assuming you want this)
document.querySelector('.ai-button')?.addEventListener('click', function() {
    this.classList.add('clicked');
    setTimeout(() => this.classList.remove('clicked'), 8000); // Match animation duration
});