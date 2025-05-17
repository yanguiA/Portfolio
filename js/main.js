document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out'
    });

    const content = document.getElementById('content');
    const sections = {
        game: 'project1.html',
        ui: 'project2.html'
    };

    async function loadSection(section) {
        try {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';

            await new Promise(r => setTimeout(r, 150));

            const response = await fetch(sections[section]);
            const html = await response.text();
            content.innerHTML = html;

            if (section === 'game') {
                initializeViewToggles();
            }

            initializeScrollAnimations();

            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';

            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading section:', error);
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const section = link.dataset.section;

            document.querySelector('.nav-link.active').classList.remove('active');
            link.classList.add('active');

            await loadSection(section);
        });
    });

    const activeSection = document.querySelector('.nav-link.active')?.dataset.section;
    if (activeSection) {
        loadSection(activeSection);
    }


});

function initializeViewToggles() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const toggle = card.querySelector('.view-toggle');
        const views = card.querySelectorAll('.view-content');

        if (toggle && views.length === 2) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();

                views.forEach(view => view.classList.toggle('hidden'));

                const modelViewer = views[1].querySelector('model-viewer');
                if (modelViewer && !views[1].classList.contains('hidden')) {
                    modelViewer.cameraOrbit = '0deg 75deg 105%';

                    modelViewer.addEventListener('load', () => {
                        console.log('Model loaded successfully');
                    });

                    modelViewer.addEventListener('error', (error) => {
                        console.error('Error loading model:', error);
                    });
                }
            });
        }
    });
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '20px'
    });

    const elements = document.querySelectorAll([
        '.project-card',
        'h1, h2, h3, h4, h5, h6',
        'p',
        '.grid',
        'img',
        'model-viewer',
        '.flex',
        'ul',
        'li'
    ].join(','));

    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.005}s`;
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function init3DModelAnimation() {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
        modelViewer.classList.add('animate-float');
        modelViewer.addEventListener('load', () => {
            modelViewer.cameraOrbit = '0deg 75deg 105%';
            modelViewer.autoRotate = true;
            modelViewer.autoRotateDelay = 0;
            modelViewer.rotationPerSecond = '30deg';
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    function generateCSRFToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    const csrfToken = generateCSRFToken();
    document.getElementById('csrf_token').value = csrfToken;
    sessionStorage.setItem('csrf_token', csrfToken);

    const contactBtn = document.getElementById('contactBtn');
    const contactBox = document.getElementById('contactBox');
    const closeContactBox = document.getElementById('closeContactBox');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    const aboutBtnDesktop = document.getElementById('aboutBtnDesktop');
    const aboutBtnMobile = document.getElementById('aboutBtnMobile');
    const aboutPanelDesktop = document.getElementById('aboutPanelDesktop');
    const aboutPanelMobile = document.getElementById('aboutPanelMobile');
    const closeAboutDesktop = document.getElementById('closeAboutDesktop');
    const closeAboutMobile = document.getElementById('closeAboutMobile');

    if (contactBtn) {
        contactBtn.addEventListener('click', function () {
            contactBox.classList.add('active');
            contactBtn.style.opacity = '0';
            contactBtn.style.pointerEvents = 'none';
        });
    }

    if (closeContactBox) {
        closeContactBox.addEventListener('click', function () {
            contactBox.classList.remove('active');
            if (contactBtn) {
                contactBtn.style.opacity = '1';
                contactBtn.style.pointerEvents = 'auto';
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const submittedToken = document.getElementById('csrf_token').value;

            if (submittedToken !== sessionStorage.getItem('csrf_token')) {
                showFormStatus('Erreur de sécurité. Veuillez rafraîchir la page.', 'error');
                return;
            }

            const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/;
            const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

            if (!nameRegex.test(name)) {
                showFormStatus('Nom invalide', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showFormStatus('Email invalide', 'error');
                return;
            }

            if (message.length < 5 || message.length > 1000) {
                showFormStatus('Le message doit contenir entre 5 et 1000 caractères', 'error');
                return;
            }

            const sanitizedName = escapeHTML(name);
            const sanitizedEmail = escapeHTML(email);
            const sanitizedMessage = escapeHTML(message);

            const subject = encodeURIComponent(`Message de ${sanitizedName} via portfolio`);
            const body = encodeURIComponent(`Nom: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`);

            showFormStatus('Message envoyé avec succès!', 'success');

            setTimeout(() => {
                window.location.href = `mailto:amandine.brx10@gmail.com?subject=${subject}&body=${body}`;

                contactForm.reset();
                const newCsrfToken = generateCSRFToken();
                document.getElementById('csrf_token').value = newCsrfToken;
                sessionStorage.setItem('csrf_token', newCsrfToken);

                contactBox.classList.remove('active');
                if (contactBtn) {
                    contactBtn.style.opacity = '1';
                    contactBtn.style.pointerEvents = 'auto';
                }
                formStatus.classList.add('hidden');
            }, 1500);
        });
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.classList.remove('hidden', 'text-green-400', 'text-red-400');

        if (type === 'success') {
            formStatus.classList.add('text-green-400');
        } else if (type === 'error') {
            formStatus.classList.add('text-red-400');
        }
    }

    if (aboutBtnDesktop) {
        aboutBtnDesktop.addEventListener('click', function () {
            if (aboutPanelDesktop) {
                aboutPanelDesktop.classList.toggle('closed-desktop');
                aboutBtnDesktop.classList.toggle('active');
            }
        });
    }

    if (closeAboutDesktop) {
        closeAboutDesktop.addEventListener('click', function () {
            if (aboutPanelDesktop) {
                aboutPanelDesktop.classList.add('closed-desktop');
                if (aboutBtnDesktop) {
                    aboutBtnDesktop.classList.remove('active');
                }
            }
        });
    }

    if (aboutBtnMobile) {
        aboutBtnMobile.addEventListener('click', function () {
            if (aboutPanelMobile) {
                aboutPanelMobile.classList.toggle('closed-mobile');
                aboutBtnMobile.classList.toggle('active');
            }
        });
    }

    if (closeAboutMobile) {
        closeAboutMobile.addEventListener('click', function () {
            if (aboutPanelMobile) {
                aboutPanelMobile.classList.add('closed-mobile');
                if (aboutBtnMobile) {
                    aboutBtnMobile.classList.remove('active');
                }
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (contactBox && contactBtn &&
            !contactBox.contains(e.target) &&
            e.target !== contactBtn &&
            contactBox.classList.contains('active')) {
            contactBox.classList.remove('active');
            contactBtn.style.opacity = '1';
            contactBtn.style.pointerEvents = 'auto';
        }

        if (aboutPanelDesktop && aboutBtnDesktop &&
            !aboutPanelDesktop.contains(e.target) &&
            e.target !== aboutBtnDesktop &&
            !aboutPanelDesktop.classList.contains('closed-desktop')) {
            if (!e.target.closest('#aboutBtnDesktop')) {
                aboutPanelDesktop.classList.add('closed-desktop');
                aboutBtnDesktop.classList.remove('active');
            }
        }

        if (aboutPanelMobile && aboutBtnMobile &&
            !aboutPanelMobile.contains(e.target) &&
            e.target !== aboutBtnMobile &&
            !aboutPanelMobile.classList.contains('closed-mobile')) {
            if (!e.target.closest('#aboutBtnMobile')) {
                aboutPanelMobile.classList.add('closed-mobile');
                aboutBtnMobile.classList.remove('active');
            }
        }
    });

    if (window.self !== window.top) {
        document.body.innerHTML = 'Cette page ne peut pas être affichée dans un iframe.';
    }
});