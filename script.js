document.addEventListener('DOMContentLoaded', async function () {
    const gallery = document.getElementById('imageGallery');
    const sidebarMenu = document.getElementById('sidebarMenu');

    const networkIcons = [
        'fa-network-wired',
        'fa-server',
        'fa-laptop',
        'fa-satellite-dish',
        'fa-cloud',
        'fa-ethernet',
        'fa-route',
        'fa-wifi',
        'fa-globe',
        'fa-hdd',
        'fa-database',
        'fa-link'
    ];

    // Human-friendly names for topics
    const topicNames = {
        'static': 'Static Route',
        'dual_stack': 'Dual stack & IPv6 Address Configuration',
        'default': 'Default Route',
        'ripv2': 'RIPv2',
        'eigrp': 'EIGRP',
        'ospf': 'OSPF Single Area',
        'ospf_mul': 'OSPF Multi Area',
        'ping_tracert': 'Ping, Tracert, Traceroute',
        'dhcp': 'DHCP',
        'static_nat': 'Static NAT',
        'dynamic_nat': 'Dynamic NAT',
        'ppp_chap': 'PPP CHAP',
        'ppp_pap': 'PPP PAP',
        'mlppp': 'MLPPP',
        'gre': 'GRE',
        'ebgp': 'eBGP & Network Statement',
        'bgp': 'IBGP',
        'hsrp': 'HSRP',
        'password_banner': 'Enable Password, Secret, Banner',
        'telnet': 'Telnet',
        'ssh': 'SSH',
        'ipv6': 'IPv6 AutoConfiguration (SLAAC), IPv6 Address Allocation',
        'cdp': 'CDP',
        'floating_route': 'Floating Static Route',
        'syslog': 'Syslog',
        'dhcp_relay': 'DHCP Relay Agent'
    };

    // Fetch Image Data (dynamic structure)
    const data = await fetch('images/generated_images.json').then(res => res.json());
    console.log(data);
    
    // Dynamically build sidebar
    sidebarMenu.innerHTML = '';
    await buildDynamicSidebar(data);

    // Automatically load the first NMS topic by default
    const firstTopic = Object.keys(data.NMS)[0];
    if (firstTopic) loadImages(data, 'NMS', firstTopic);

    /**
     * Dynamically create collapsible sidebar sections
     * @param {Object} data - Folder structure from JSON
     */
    function buildDynamicSidebar(data) {
        // Ensure NMS comes first
        ['NMS', 'Datacom'].forEach((category, index) => {
            if (data[category]) {
                createCollapsibleSection(
                    category.toUpperCase(),
                    data[category],
                    category === 'NMS',
                    category
                );
            }
        });
    }

    /**
     * Create a collapsible section in the sidebar
     * @param {string} title - Section title (e.g., "NMS")
     * @param {Object} topics - Topics under this section
     * @param {boolean} openByDefault - Whether section should be open initially
     * @param {string} category - Category (e.g., "nms" or "datacom")
     */
    function createCollapsibleSection(title, topics, openByDefault, category) {
        const section = document.createElement('div');
        section.className = 'sidebar-section';

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'sidebar-title';
        sectionHeader.innerHTML = `${title} <i class="fas fa-chevron-${openByDefault ? 'down' : 'right'} ms-2"></i>`;

        const sectionContent = document.createElement('div');
        sectionContent.className = 'sidebar-content';
        if (!openByDefault) sectionContent.style.display = 'none';

        // Create topic links
        Object.keys(topics).forEach((topic, index) => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'nav-link';
            link.textContent = topicNames[topic] || topic.replace('_', ' ');

            const icon = document.createElement('i');
            icon.className = `fas ${networkIcons[Math.floor(Math.random() * networkIcons.length)]} me-2`;
            link.prepend(icon);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadImages(data, category, topic);
                setActiveLink(link);
            });

            // Default: Set first NMS topic as active
            if (openByDefault && index === 0) link.classList.add('active');

            sectionContent.appendChild(link);
        });

        sectionHeader.addEventListener('click', () => {
            const isVisible = sectionContent.style.display === 'block';
            sectionContent.style.display = isVisible ? 'none' : 'block';
            sectionHeader.querySelector('i').className = `fas fa-chevron-${isVisible ? 'right' : 'down'} ms-2`;
        });

        section.appendChild(sectionHeader);
        section.appendChild(sectionContent);
        sidebarMenu.appendChild(section);
    }

    /**
     * Load images dynamically into the gallery
     * @param {Object} data - Image data structure
     * @param {string} category - Parent folder (e.g., "nms")
     * @param {string} topic - Topic folder (e.g., "ospf")
     */
    function loadImages(data, category, topic) {
        gallery.innerHTML = '';

        if (!data[category] || !data[category][topic]) {
            gallery.innerHTML = `<p>No images found for ${topic}</p>`;
            return;
        }

        data[category][topic].forEach(({ filename, caption }) => {
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
                <div class="card shadow-lg border-2">
                    <a href="images/${category}/${topic}/${filename}" data-fancybox="gallery" data-caption="${caption}">
                        <img src="images/${category}/${topic}/${filename}" class="card-img-top" alt="${caption}">
                    </a>
                    <div class="card-body"><p class="card-text">${caption}</p></div>
                </div>
            `;
            gallery.appendChild(card);
        });

        Fancybox.bind('[data-fancybox]', {});
    }

    /**
     * Set the active state for the clicked link
     * @param {HTMLElement} activeLink - The active sidebar link
     */
    function setActiveLink(activeLink) {
        const links = sidebarMenu.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
});
