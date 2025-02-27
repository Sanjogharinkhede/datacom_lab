document.addEventListener('DOMContentLoaded', async function () {
    const sidebarMenu = document.getElementById('scriptsSidebar');
    const codeDisplay = document.getElementById('codeDisplay');

    // Fetch list of Python files from my_py.json
    const scriptFiles = await fetch('./my_py.json').then(res => res.json()).catch(() => {
        console.error('Failed to fetch my_py.json, using fallback');
        return ['app.py']; // Fallback if JSON fetch fails
    });

    // Build sidebar
    buildScriptsSidebar(scriptFiles);

    /**
     * Build sidebar with Python script files
     */
    function buildScriptsSidebar(files) {
        sidebarMenu.innerHTML = '';
        files.forEach(file => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'nav-link';
            link.textContent =  file.replaceAll("_", " ");;
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-code me-2';
            link.prepend(icon);

            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await loadScript(file);
                setActiveLink(link);
            });

            sidebarMenu.appendChild(link);
        });

        // Load first script by default
        if (files.length > 0) {
            loadScript(files[0]);
            sidebarMenu.querySelector('.nav-link').classList.add('active');
        }
    }

    /**
     * Load and display a Python script
     */
    async function loadScript(file) {
        try {
            const response = await fetch(`python_script/${file}`);
            
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            const code = await response.text();

            codeDisplay.innerHTML = `
                <h2>${ file.replaceAll("_", " ")}</h2>
                <pre><code class="language-python">${escapeHtml(code)}</code></pre>
            `;
            hljs.highlightAll(); // Use Highlight.js
        } catch (error) {
            codeDisplay.innerHTML = `<p>Error loading ${file}: ${error.message}</p>`;
        }
    }

    /**
     * Set active sidebar link
     */
    function setActiveLink(activeLink) {
        const links = sidebarMenu.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    /**
     * Escape HTML for safe display
     */
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;' 
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});