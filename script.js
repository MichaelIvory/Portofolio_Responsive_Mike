document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INTERACTIVE MOUSE GLOW EFFECT
       ========================================================================== */
    const mouseGlow = document.getElementById('mouse-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY; // Include scroll offset
    });

    // Smooth animation loop using requestAnimationFrame
    function updateGlowPosition() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        if (mouseGlow) {
            mouseGlow.style.setProperty('--x', `${currentX}px`);
            mouseGlow.style.setProperty('--y', `${currentY - window.scrollY}px`);
        }
        requestAnimationFrame(updateGlowPosition);
    }
    updateGlowPosition();

    /* ==========================================================================
       2. STICKY HEADER & NAVBAR EFFECTS
       ========================================================================== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       3. MOBILE NAVIGATION TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
        });
    });

    if (window.innerWidth <= 768 && navMenu) {
        navMenu.classList.add('active');
    }

    /* ==========================================================================
       4. TAB ROUTING / SPA SYSTEM
       ========================================================================== */
    const pages = document.querySelectorAll('.page');
    
    function switchTab(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });

        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            window.scrollTo(0, 0);

            if (pageId === 'about-page') {
                animateSkillBars();
            } else {
                resetSkillBars();
            }
        }

        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            switchTab(targetPage);
            window.location.hash = targetPage;
        });
    });

    const logoBtn = document.getElementById('logo-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('home-page');
            window.location.hash = 'home-page';
        });
    }

    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const validPages = ['home-page', 'about-page', 'projects-page'];
        if (validPages.includes(hash)) {
            switchTab(hash);
        }
    }

    const viewProjectsBtn = document.getElementById('view-projects-btn');
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', () => {
            switchTab('projects-page');
            window.location.hash = 'projects-page';
        });
    }

    const contactNavBtn = document.getElementById('contact-nav-btn');
    if (contactNavBtn) {
        contactNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('home-page');
            window.location.hash = 'home-page';
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);
        });
    }

    /* ==========================================================================
       5. SKILL BARS PROGRESSIVE LOADING
       ========================================================================== */
    function animateSkillBars() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            const level = card.getAttribute('data-level');
            const fill = card.querySelector('.skill-bar-fill');
            if (fill) {
                fill.style.width = `${level}%`;
            }
        });
    }

    function resetSkillBars() {
        const fills = document.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
            fill.style.width = '0';
        });
    }

    /* ==========================================================================
       6. HERO TYPING EFFECT
       ========================================================================== */
    const phrases = ["UI/UX Developer", "Front-End Engineer", "Coding Instructor", "Computer Science Student"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typing-text');
    const typeSpeed = 90;
    const eraseSpeed = 45;
    const delayBetween = 2000;

    function typeEffect() {
        if (!typingElement) return;

        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let sleepTime = isDeleting ? eraseSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            sleepTime = delayBetween;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            sleepTime = 500;
        }

        setTimeout(typeEffect, sleepTime);
    }
    typeEffect();

    /* ==========================================================================
       7. PROJECTS FILTER LOGIC
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue || (filterValue === 'web' && (category === 'web' || category === 'other'))) {
                        card.style.display = 'flex';
                        void card.offsetWidth;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    /* ==========================================================================
       8. PROJECT DETAIL MODAL SYSTEM
       ========================================================================== */
    const projectDetails = {
        1: {
            title: "Museum Art Apps",
            category: "UI/UX Design",
            tags: ["Figma", "Database LAB", "UI/UX Design"],
            description: "Museum Art Apps merupakan perancangan antarmuka dan wireframe aplikasi reservasi tiket museum serta galeri pameran karya seni interaktif. Proyek ini dikembangkan dalam rangka memenuhi tugas mata kuliah Database LAB di BINUS University.",
            features: "Eksplorasi galeri seni digital, jadwal pameran museum terdekat, pemesanan tiket masuk dengan pilihan jam kunjungan, serta sistem integrasi ulasan pengunjung.",
            client: "BINUS University (Database LAB Course)",
            role: "UI/UX Designer",
            tech: ["fa-brands fa-figma", "fa-solid fa-database", "fa-brands fa-html5"],
            demo: "https://www.figma.com/design/SvAoKj2JGqwClh6O35oGPR/Database-LAB?node-id=3-9&p=f",
            image: "assets/project1.png",
            fallbackIcon: "fa-solid fa-landmark"
        },
        2: {
            title: "Lung Prediction Cancer App",
            category: "Web & Healthcare App",
            tags: ["Figma", "Healthcare", "UI/UX Design"],
            description: "Aplikasi medis berbasis UI/UX interaktif yang dirancang untuk membantu masyarakat dalam melakukan skrining awal dan deteksi risiko kanker paru-paru berbasis kuesioner medis dan data gejala klinis.",
            features: "Kuisioner mandiri interaktif, skor kalkulasi tingkat risiko kesehatan paru-paru, rekomendasi dokter spesialis terdekat, serta artikel edukasi pola hidup sehat.",
            client: "Healthcare Tech Innovation",
            role: "UI/UX Designer & Researcher",
            tech: ["fa-brands fa-figma", "fa-solid fa-heart-pulse", "fa-brands fa-js"],
            demo: "https://www.figma.com/design/Z3aCrOd9aJUnsxLcelPCli/Lung-Cancer-Prediction?node-id=0-1&t=9OYwgnuveLeTlMJd-1",
            image: "assets/project2.png",
            fallbackIcon: "fa-solid fa-heart-pulse"
        },
        3: {
            title: "HIMSTOP Event Interface",
            category: "UI/UX & Event Design",
            tags: ["Figma", "HIMTI BINUS", "Event Design"],
            description: "Antarmuka platform pendaftaran dan informasi event tahunan HIMSTOP yang diselenggarakan oleh Himpunan Mahasiswa Teknik Informatika (HIMTI) BINUS University.",
            features: "Jadwal acara seminar & workshop, pendaftaran tiket peserta online, halaman pembicara (keynote speakers), dan integrasi pembayaran QRIS.",
            client: "HIMTI BINUS University",
            role: "UI/UX Designer",
            tech: ["fa-brands fa-figma", "fa-solid fa-ticket", "fa-brands fa-css3-alt"],
            demo: "https://www.figma.com/design/MDUMHuQ5uNbsPitxlztvvy/HIMSTOP?node-id=0-1&t=mYypGLGcavJMXmJg-1",
            image: "assets/project3.png",
            fallbackIcon: "fa-solid fa-ticket"
        },
        4: {
            title: "Panacea - Mental Health App",
            category: "UI/UX Design",
            tags: ["Figma", "Mental Health", "Designpreneur"],
            description: "Panacea adalah desain aplikasi seluler kesehatan mental yang berfokus pada penyediaan ruang aman bagi pengguna untuk melakukan mood tracking, meditasi terpandu, serta sesi konseling dengan psikolog profesional.",
            features: "Pencatatan jurnal suasana hati harian (Mood Tracker), ruang meditasi audio, jadwal janji temu psikolog, serta forum komunitas suportif.",
            client: "Designpreneur Project",
            role: "Lead UI/UX Designer",
            tech: ["fa-brands fa-figma", "fa-solid fa-brain", "fa-solid fa-leaf"],
            demo: "https://www.figma.com/design/N9rSGyiUVWCKYVcXDZpZqQ/Designpreneur---mental-health?node-id=0-1&t=MIhhEhMYb8VdNBXx-1",
            image: "assets/project4.png",
            fallbackIcon: "fa-solid fa-brain"
        },
        5: {
            title: "Ticketing Travel App",
            category: "Web & Mobile App",
            tags: ["Figma", "Software Engineering", "Interactive Prototype"],
            description: "Ticketing Travel adalah proyek antarmuka aplikasi pemesanan tiket perjalanan interaktif (pesawat, kereta, dan bus) yang berfungsi sebagai tugas akhir mata kuliah Rekayasa Perangkat Lunak (Software Engineering) di BINUS University.",
            features: "Pencarian rute dan jadwal transportasi real-time, mekanisme pemeliharaan kursi interaktif, perbandingan harga, dan integrasi metode pembayaran instan.",
            client: "BINUS Software Engineering Course",
            role: "UI/UX & Systems Designer",
            tech: ["fa-brands fa-figma", "fa-solid fa-plane", "fa-brands fa-bootstrap"],
            demo: "https://www.figma.com/design/vX3cnBy6uCSG14E2LszYSd/Mock-up-Ticketing-Travel?node-id=2-2&p=f&t=W2TRBiwOM4fgWNBt-0",
            image: "assets/project5.png",
            fallbackIcon: "fa-solid fa-plane"
        },
        6: {
            title: "TETA - Task & Work Organizer",
            category: "Productivity App",
            tags: ["Figma", "Wireframe", "Productivity"],
            description: "TETA adalah aplikasi manajemen tugas dan pengorganisasian kerja berbasis UI/UX interaktif yang dirancang untuk membantu pelajar maupun profesional dalam mengelola waktu dan proyek secara terstruktur.",
            features: "Papan tugas harian (To-Do & Kanban), kalender integrasi tenggat waktu, pengingat otomatis, dan statistik tingkat penyelesaian proyek harian.",
            client: "Productivity Tools Project",
            role: "UI/UX Designer",
            tech: ["fa-brands fa-figma", "fa-solid fa-list-check", "fa-brands fa-tailwind"],
            demo: "https://www.figma.com/proto/cTlWhFj3i5EmvCFQ6LHOds/UI_UX-WIREFRAME?page-id=117%3A87&team_id=1112952433683839234&node-id=131-436&starting-point-node-id=131%3A242&t=dAWb1vKePFBgBmAZ-1",
            image: "assets/project6.png",
            fallbackIcon: "fa-solid fa-list-check"
        }
    };

    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data) return;

        const modalImg = document.getElementById('modal-project-img');
        const modalFallback = document.getElementById('modal-project-fallback');
        
        if (data.image) {
            modalImg.style.display = 'block';
            modalImg.src = data.image;
            modalImg.alt = data.title;
            modalFallback.style.display = 'none';
        } else {
            modalImg.style.display = 'none';
            modalFallback.style.display = 'flex';
            modalFallback.innerHTML = `<i class="${data.fallbackIcon}"></i><span>${data.title}</span>`;
        }

        document.getElementById('modal-project-title').textContent = data.title;
        document.getElementById('modal-project-category').textContent = data.category;
        document.getElementById('modal-project-description').textContent = data.description;
        document.getElementById('modal-project-features').textContent = data.features;
        document.getElementById('modal-project-client').textContent = data.client;
        document.getElementById('modal-project-role').textContent = data.role;

        const tagsContainer = document.getElementById('modal-project-tags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'project-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        const techContainer = document.getElementById('modal-project-tech');
        techContainer.innerHTML = '';
        data.tech.forEach(iconClass => {
            const icon = document.createElement('i');
            icon.className = `${iconClass} skill-icon`;
            icon.style.fontSize = '1.8rem';
            icon.style.marginRight = '0.5rem';
            techContainer.appendChild(icon);
        });

        const demoLink = document.getElementById('modal-demo-link');
        if (demoLink) {
            demoLink.href = data.demo;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-link-btn')) {
                return;
            }
            const projectId = card.getAttribute('data-project-id');
            openModal(projectId);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       9. TOAST NOTIFICATION
       ========================================================================== */
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message, type = 'success') {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        
        const icon = toast.querySelector('i');
        if (type === 'success') {
            icon.className = 'fa-solid fa-circle-check';
            toast.style.borderColor = 'var(--color-accent-cyan)';
            toast.style.boxShadow = 'var(--shadow-cyan-glow)';
        } else {
            icon.className = 'fa-solid fa-circle-exclamation';
            toast.style.borderColor = 'var(--color-accent-pink)';
            toast.style.boxShadow = '0 0 25px rgba(236, 72, 153, 0.25)';
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            showToast('Membuka aplikasi email ke michael07ivory@gmail.com...');
        });
    }
});
