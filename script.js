document.addEventListener("DOMContentLoaded", async function () {
  const gallery = document.getElementById("imageGallery");
  const sidebarMenu = document.getElementById("sidebarMenu");

  const networkIcons = [
    "fa-network-wired",
    "fa-server",
    "fa-laptop",
    "fa-satellite-dish",
    "fa-cloud",
    "fa-ethernet",
    "fa-route",
    "fa-wifi",
    "fa-globe",
    "fa-hdd",
    "fa-database",
    "fa-link",
  ];

  // Topics as per named
  const topicNames = {
    static: "Static Route",
    dual_stack: "Dual stack & IPv6 Address Configuration",
    default: "Default Route",
    ripv2: "RIPv2",
    eigrp: "EIGRP",
    ospf: "OSPF Single Area",
    ospf_mul: "OSPF Multi Area",
    ping_tracert: "Ping, Tracert, Traceroute",
    dhcp: "DHCP",
    static_nat: "Static NAT",
    dynamic_nat: "Dynamic NAT",
    ppp_chap: "PPP CHAP",
    ppp_pap: "PPP PAP",
    mlppp: "MLPPP",
    gre: "GRE",
    ebgp: "eBGP & Network Statement",
    ibgp: "Internal BGP",
    hsrp: "HSRP",
    password_banner: "Enable Password, Secret, Banner",
    telnet: "Telnet",
    ssh: "SSH",
    ipv6: "IPv6 AutoConfiguration (SLAAC), IPv6 Address Allocation",
    cdp: "CDP",
    floating_route: "Floating Static Route",
    syslog: "Syslog",
    dhcp_relay: "DHCP Relay Agent",
  };

  // Fetch json created with python for images
  const data = await fetch("images/generated_images.json").then((res) =>
    res.json()
  );
  console.log(data);

  //build sidebar
  sidebarMenu.innerHTML = "";
  await buildDynamicSidebar(data);

  // Fetch json created with python for content
  const topicInfo = await fetch("content/main.json").then((res) => res.json());

  // load first topic when enter to page
  const firstTopic = Object.keys(data.NMS)[0];
  if (firstTopic) loadContent(data, topicInfo, "NMS", firstTopic);
  /**
   * A collapsible sidebar build for multiple lab topics
   * @param {Object} data - Folder structure from JSON
   */
  async function buildDynamicSidebar(data) {
    // Ensure NMS comes first then Datacom
    ["NMS", "Datacom"].forEach((category, index) => {
      if (data[category]) {
        // Call to create collapsible section
        createCollapsibleSection(
          category.toUpperCase(),
          data[category],
          category === "NMS",
          category
        );
      }
    });
  }

  /**
   * ChatGpt generated
   *
   * Create a collapsible section in the sidebar
   * @param {string} title - Section title say NMS
   * @param {Object} topics - Topics under this section
   * @param {boolean} openByDefault - Whether section should be open initially
   * @param {string} category - Category like nms
   */
  function createCollapsibleSection(title, topics, openByDefault, category) {
    const section = document.createElement("div");
    section.className = "sidebar-section";

    const sectionHeader = document.createElement("div");
    sectionHeader.className = "sidebar-title";
    sectionHeader.innerHTML = `${title} <i class="fas fa-chevron-${
      openByDefault ? "down" : "right"
    } ms-2"></i>`;

    const sectionContent = document.createElement("div");
    sectionContent.className = "sidebar-content";
    if (!openByDefault) sectionContent.style.display = "none";

    // Create topic links
    Object.keys(topics).forEach((topic, index) => {
      const link = document.createElement("a");
      link.href = "#";
      link.className = "nav-link";
      link.textContent = topicNames[topic] || topic.replace("_", " ");

      const icon = document.createElement("i");
      icon.className = `fas ${
        networkIcons[Math.floor(Math.random() * networkIcons.length)]
      } me-2`;
      link.prepend(icon);

      link.addEventListener("click", (e) => {
        e.preventDefault();
        loadContent(data, topicInfo, category, topic); // Pass topicInfo
        setActiveLink(link);
      });

      // Default: Set first NMS topic as active
      if (openByDefault && index === 0) link.classList.add("active");

      sectionContent.appendChild(link);
    });

    sectionHeader.addEventListener("click", () => {
      const isVisible = sectionContent.style.display === "block";
      sectionContent.style.display = isVisible ? "none" : "block";
      sectionHeader.querySelector("i").className = `fas fa-chevron-${
        isVisible ? "right" : "down"
      } ms-2`;
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
  // function loadImages(data, category, topic) {
  //     gallery.innerHTML = '';

  //     if (!data[category] || !data[category][topic]) {
  //         gallery.innerHTML = `<p>No images found for ${topic}</p>`;
  //         return;
  //     }

  //     data[category][topic].forEach(({ filename, caption }) => {
  //         const card = document.createElement('div');
  //         card.className = 'col';
  //         card.innerHTML = `
  //             <div class="card shadow-lg border-2">
  //                 <a href="images/${category}/${topic}/${filename}" data-fancybox="gallery" data-caption="${caption}">
  //                     <img src="images/${category}/${topic}/${filename}" class="card-img-top" alt="${caption}">
  //                 </a>
  //                 <div class="card-body"><p class="card-text">${caption}</p></div>
  //             </div>
  //         `;
  //         gallery.appendChild(card);
  //     });

  //     $('[data-fancybox="gallery"]').fancybox({
  //         loop: true,
  //     });
  // }
  function loadContent(data, topicInfo, category, topic) {
    const content = document.querySelector('.content');
    content.innerHTML = ''; // Clear previous content

    // Create header section
    const header = document.createElement('div');
    header.className = 'topic-header';
    const info = topicInfo[category][topic] || {};

    // Add title
    const title = document.createElement('h2');
    title.textContent = info.full_form || topicNames[topic] || topic.replace('_', ' ');
    header.appendChild(title);

    // Add description if present, using innerHTML for HTML support
    if (info.description) {
        const desc = document.createElement('p');
        desc.className = 'description';
        desc.innerHTML = info.description; // Changed from textContent to innerHTML
        header.appendChild(desc);
    }
    if (info.features) {
      const fea = document.createElement('span');
      fea.className = 'feature';
      fea.innerHTML = `<h5>Features</h5> ${info.features}`; // Changed from textContent to innerHTML
      header.appendChild(fea);
  }

    // Container for additional sections
    const sections = document.createElement('div');
    sections.className = 'topic-sections';

    if (info.benefits || info.disadvantages) {
        const prosCons = document.createElement('div');
        prosCons.className = 'pros-cons';

        if (info.benefits) {
            const benefits = document.createElement('div');
            benefits.className = 'benefits';
            benefits.innerHTML = `
                <h5>Benefits</h5>
                <ul>${info.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
            `;
            prosCons.appendChild(benefits);
        }

        if (info.disadvantages) {
            const disadvantages = document.createElement('div');
            disadvantages.className = 'disadvantages';
            disadvantages.innerHTML = `
                <h5>Disadvantages</h5>
                <ul>${info.disadvantages.map(d => `<li>${d}</li>`).join('')}</ul>
            `;
            prosCons.appendChild(disadvantages);
        }

        sections.appendChild(prosCons);
    }

    if (info.commands) {
        const commands = document.createElement('div');
        commands.className = 'commands';
        commands.innerHTML = `
            <h5>Key Commands</h5>
            <pre>${info.commands.join('\n')}</pre>
        `;
        sections.appendChild(commands);
    }

    if (sections.children.length > 0) {
        header.appendChild(sections);
    }

    content.appendChild(header);

    // Add gallery below
    const gallery = document.createElement('div');
    gallery.className = 'row row-cols-1 row-cols-md-2 g-4';
    gallery.id = 'imageGallery';
    content.appendChild(gallery);

    if (!data[category] || !data[category][topic]) {
        gallery.innerHTML = `<p>No images found for ${topic}</p>`;
        return;
    }

    // Add cards with animation delay
    data[category][topic].forEach(({ filename, caption }, index) => {
        const card = document.createElement('div');
        card.className = 'col';
        card.style.setProperty('--card-index', index); // Set custom property for delay
        card.innerHTML = `
            <div class="card">
                <a href="images/${category}/${topic}/${filename}" data-fancybox="gallery" data-caption="${caption}">
                    <img src="images/${category}/${topic}/${filename}" class="card-img-top" alt="${caption}">
                </a>
                <div class="card-body"><p class="card-text">${caption}</p></div>
            </div>
        `;
        gallery.appendChild(card);
    });

    $('[data-fancybox="gallery"]').fancybox({ loop: true });
}
  /**
   * Set the active state for the clicked link
   * @param {HTMLElement} activeLink - The active sidebar link
   */
  function setActiveLink(activeLink) {
    const links = sidebarMenu.querySelectorAll(".nav-link");
    links.forEach((link) => link.classList.remove("active"));
    activeLink.classList.add("active");
  }
});
