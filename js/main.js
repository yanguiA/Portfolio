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
        'h1, h2, h3',
        'p',
        '.grid',
        'img',
        'model-viewer',
        '.flex'
    ].join(','));

    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.025}s`;
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
