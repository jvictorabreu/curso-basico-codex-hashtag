/**
 * FLUXO - SaaS B2B Landing Page
 * Interatividades e Lógica Frontend Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos principais
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-actions-mobile .btn');
  const faqQuestions = document.querySelectorAll('.faq-question');
  const revealElements = document.querySelectorAll('.reveal');

  // ==========================================================================
  // 2. HEADER: Adiciona sombra e background sólido ao rolar
  // ==========================================================================
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Execução inicial

  // ==========================================================================
  // 3. MENU MOBILE (HAMBÚRGUER)
  // ==========================================================================
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.contains('open');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      navMenu.classList.add('open');
      hamburgerBtn.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Evita rolagem com menu aberto no mobile
    }
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Fecha o menu ao clicar em qualquer link de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      });
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Fecha com tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================================================
  // 4. FAQ ACCORDION (INTERAÇÃO FLUIDA)
  // ==========================================================================
  faqQuestions.forEach(questionBtn => {
    questionBtn.addEventListener('click', () => {
      const parentItem = questionBtn.closest('.faq-item');
      const answerElement = parentItem.querySelector('.faq-answer');
      const isAlreadyActive = parentItem.classList.contains('active');

      // Fecha todos os outros itens para um visual limpo
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parentItem && item.classList.contains('active')) {
          item.classList.remove('active');
          const otherQuestion = item.querySelector('.faq-question');
          const otherAnswer = item.querySelector('.faq-answer');
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = null;
        }
      });

      // Alterna o item atual
      if (isAlreadyActive) {
        parentItem.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerElement.style.maxHeight = null;
      } else {
        parentItem.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerElement.style.maxHeight = answerElement.scrollHeight + 'px';
      }
    });
  });

  // ==========================================================================
  // 5. ANIMAÇÃO DE ENTRADA SUAVE (FADE-IN COM INTERSECTION OBSERVER)
  // ==========================================================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Anima apenas uma vez
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback caso o navegador não suporte IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================================================
  // 6. ROLAGEM SUAVE COM OFFSET DO HEADER FIXO
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = header.offsetHeight + 16;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
