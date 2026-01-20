const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// --- Theme Logic ---
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
});

// --- Mobile Menu ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Smooth Scroll for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// --- Active Link Highlighting ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// --- Scroll Reveal Animation ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .archive-card, .link-card, .info-item, .project-showcase, .section-title, .section-subtitle').forEach(el => {
    el.classList.add('reveal-element');
    revealObserver.observe(el);
});

// Staggered animation for grids
document.querySelectorAll('.skills-row, .archive-grid, .links-grid').forEach(container => {
    const cards = container.querySelectorAll('.skill-card, .archive-card, .link-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// --- 3D Terminal Tilt Effect ---
const terminal = document.querySelector('.terminal-window');
if (terminal) {
    document.addEventListener('mousemove', (e) => {
        // Only run if screen is wide enough (desktop)
        if (window.innerWidth > 768) {
            const rect = terminal.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const moveX = (e.clientX - centerX) / 50;
            const moveY = (e.clientY - centerY) / 50;

            terminal.style.transform = `translateY(${-10 + moveY}px) rotateX(${-moveY * 0.5}deg) rotateY(${moveX * 0.5}deg)`;
        }
    });

    document.querySelector('.home-visual').addEventListener('mouseleave', () => {
        terminal.style.transform = '';
    });
}

// --- NEW: Interactive Terminal Logic ---
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

// Define the commands
const commands = {
    help: "Available commands: <span class='t-keyword'>about</span>, <span class='t-keyword'>skills</span>, <span class='t-keyword'>projects</span>, <span class='t-keyword'>contact</span>, <span class='t-keyword'>clear</span>",
    
    about: "Final year CSE student. Passionate about <span class='t-string'>Deep Learning</span>, Data Analysis, and building intelligent systems.",
    
    skills: "['Python', 'TensorFlow', 'Java', 'MySQL', 'MongoDB', 'Data Analysis']",
    
    projects: "Featured: <span class='t-function'>Deepfake Detection Model</span> (91% Accuracy). Check the Projects section for more!",
    
    contact: "Email: <span class='t-string'>2022100000084@seu.edu.bd</span>",
    
    sudo: "<span class='t-error'>Permission denied: user is not in the sudoers file. This incident will be reported.</span>",
    
    whoami: "visitor"
};

if (terminalInput) {
    terminalInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const input = this.value.trim().toLowerCase();
            
            // 1. Create the user's command line in history
            const historyLine = document.createElement('div');
            historyLine.className = 'terminal-line';
            historyLine.innerHTML = `<span class="t-path">visitor@nadim:~$</span> ${this.value}`;
            terminalOutput.appendChild(historyLine);

            // 2. Process the command
            if (input === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (commands[input]) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line indent';
                responseLine.innerHTML = commands[input];
                terminalOutput.appendChild(responseLine);
            } else if (input !== '') {
                const errorLine = document.createElement('div');
                errorLine.className = 'terminal-line';
                errorLine.innerHTML = `<span class="t-error">Command not found: ${input}. Type 'help' for list.</span>`;
                terminalOutput.appendChild(errorLine);
            }

            // 3. Clear input and scroll to bottom
            this.value = '';
            // Small timeout to ensure DOM update before scrolling
            setTimeout(() => {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 10);
        }
    });

    // Keep focus on input when clicking the terminal body
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });
}
