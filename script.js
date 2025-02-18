document.addEventListener('DOMContentLoaded', function () {
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
    
    const topics = {
        'static': 'Static Route',
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
        'bgp': 'iBGP',
        'hsrp': 'HSRP',
        'password_banner': 'Enable Password, Secret, Banner',
        'telnet': 'Telnet',
        'ssh': 'SSH',
        'ipv6': 'IPv6 Address Configuration, IPv6 AutoConfiguration (SLAAC), IPv6 Address Allocation',
        'cdp': 'CDP',
        'floating_route': 'Floating Static Route',
        'syslog': 'Syslog',
        'dhcp_relay': 'DHCP Relay Agent'
    };

    fetch('images/generated_images.json')
        .then(response => response.json())
        .then(data => {
            // Populate Sidebar with pills
            const navPills = document.createElement('ul');
            navPills.className = 'nav nav-pills flex-column';

            Object.keys(data).forEach((topic, index) => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'nav-link';
                link.textContent = topics[topic] || topic.replace('_', ' ');
            
                // Assign random icon
                const icon = document.createElement('i');
                icon.className = `fas ${networkIcons[Math.floor(Math.random() * networkIcons.length)]} me-2`;
            
                // Clear text content and prepend icon
                link.textContent = '';
                link.appendChild(icon);
                link.appendChild(document.createTextNode(topics[topic] || topic.replace('_', ' ')));
            
                link.addEventListener('click', () => loadImages(data, topic));
                sidebarMenu.appendChild(link);
              // Add click event for active state
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadImages(data, topic);
                    setActiveLink(link);
                });
    
                if (index === 0) {
                    link.classList.add('active'); // Set first topic as active by default
                }
            });
            sidebarMenu.appendChild(navPills);

            // Load first topic by default
            const firstTopic = Object.keys(data)[0];
            if (firstTopic) loadImages(data, firstTopic);
        });
    
        

    function loadImages(data, topic) {
        gallery.innerHTML = '';

        if (!data[topic]) {
            gallery.innerHTML = `<p>No images found for ${topic}</p>`;
            return;
        }

        data[topic].forEach(({ filename, caption }) => {
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
                <div class="card shadow-lg border-2">
                    <a href="images/${topic}/${filename}" data-fancybox="gallery" data-caption="${caption}">
                        <img src="images/${topic}/${filename}" class="card-img-top" alt="${caption}">
                    </a>
                    <div class="card-body"><p class="card-text">${caption}</p></div>
                </div>
            `;
            gallery.appendChild(card);
        });

        // Refresh Fancybox
        $('[data-fancybox="gallery"]').fancybox({
            loop: true,
            buttons: ["zoom", "close"],
        });
    }

    // Function to set the active class on the clicked link
    function setActiveLink(activeLink) {
        const links = sidebarMenu.querySelectorAll('.nav-link');
        links.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
});
