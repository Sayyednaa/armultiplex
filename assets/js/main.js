/**
 * AR MULTIPLEX ENTERPRISES - 3D INTERACTIVE & PWA CONTROLLER
 * Precision Metal Fabrication & Engineering
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. PWA SERVICE WORKER REGISTRATION ---
  const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);

            // Handle updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[PWA] New content is available; please refresh.');
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  };

  // --- 2. PWA INSTALL PROMPT CONTROLLER ---
  const initPwaInstallPrompt = () => {
    let deferredPrompt = null;
    const installBanner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const closeBtn = document.getElementById('pwaInstallClose');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Show banner if not previously dismissed
      const dismissed = localStorage.getItem('ar_pwa_dismissed');
      if (!dismissed && installBanner) {
        installBanner.style.display = 'flex';
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        installBanner.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (installBanner) installBanner.style.display = 'none';
        localStorage.setItem('ar_pwa_dismissed', 'true');
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      if (installBanner) installBanner.style.display = 'none';
    });
  };

  // --- 3. HERO SPARK PARTICLES GENERATOR ---
  const initHeroSparks = () => {
    const sparkContainer = document.querySelector('.spark-container');
    if (!sparkContainer) return;

    const sparkCount = window.innerWidth < 768 ? 10 : 22;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      
      const left = Math.random() * 100;
      const size = Math.random() * 3 + 1.5;
      const duration = Math.random() * 5 + 4;
      const delay = Math.random() * 6;
      const isGold = Math.random() > 0.6;

      spark.style.left = `${left}%`;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.animationDuration = `${duration}s`;
      spark.style.animationDelay = `${delay}s`;

      if (isGold) {
        spark.style.background = '#f59e0b';
        spark.style.boxShadow = '0 0 10px 2px #f59e0b, 0 0 18px 4px #d97706';
      }

      sparkContainer.appendChild(spark);
    }
  };

  // --- 4. 3D SCROLL REVEAL (IntersectionObserver) ---
  const init3DScrollObserver = () => {
    const revealElements = document.querySelectorAll('.reveal-3d, .reveal-from-left, .reveal-from-right');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  };

  // --- 5. MOUSE-TRACKING 3D TILT EFFECT ---
  const init3DTilt = () => {
    // Only enable full mouse tracking on desktop
    if (window.innerWidth < 992) return;

    const tiltCards = document.querySelectorAll('[data-tilt="3d"]');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxAngle = 12;
        const rotateX = ((centerY - y) / centerY) * maxAngle;
        const rotateY = ((x - centerX) / centerX) * maxAngle;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });
    });
  };

  // --- 6. 3D FLIP CARD INTERACTION ---
  const initFlipCards = () => {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        // Prevent flip if clicking a direct action button
        if (e.target.closest('a') || e.target.closest('button')) return;
        card.classList.toggle('is-flipped');
      });
    });
  };

  // --- 7. GALLERY CATEGORY FILTER ---
  const initGalleryFilter = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-card');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        galleryItems.forEach((item) => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.classList.remove('hide');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.classList.add('hide');
            }, 300);
          }
        });
      });
    });
  };

  // --- 8. FULLSCREEN 3D LIGHTBOX MODAL WITH TOUCH SWIPE ---
  const initLightbox = () => {
    const lightbox = document.getElementById('lightboxModal');
    if (!lightbox) return;

    const cards = document.querySelectorAll('.gallery-card');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav-btn--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav-btn--next');

    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbTitle = lightbox.querySelector('.lightbox__title');
    const lbDesc = lightbox.querySelector('.lightbox__desc');
    const lbMaterial = lightbox.querySelector('.lightbox__spec-material');
    const lbGrade = lightbox.querySelector('.lightbox__spec-grade');
    const lbInquireBtn = lightbox.querySelector('.lightbox__inquire-btn');

    let currentIndex = 0;
    const galleryData = [];

    cards.forEach((card, index) => {
      const img = card.querySelector('.gallery-card__img');
      const title = card.querySelector('.gallery-card__title');
      const caption = card.querySelector('.gallery-card__caption');
      const material = card.getAttribute('data-material') || 'Stainless Steel';
      const grade = card.getAttribute('data-grade') || 'SS 304 / SS 202';

      galleryData.push({
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        title: title ? title.textContent.trim() : 'Fabrication Project',
        desc: caption ? caption.textContent.trim() : '',
        material: material,
        grade: grade,
      });

      card.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    const updateLightboxContent = (index) => {
      currentIndex = index;
      const data = galleryData[index];
      if (!data) return;

      lbImg.src = data.src;
      lbImg.alt = data.alt;
      lbTitle.textContent = data.title;
      lbDesc.textContent = data.desc;
      if (lbMaterial) lbMaterial.textContent = data.material;
      if (lbGrade) lbGrade.textContent = data.grade;

      if (lbInquireBtn) {
        const text = encodeURIComponent(`Hello Abdul Rahman, I am interested in getting a quote for: ${data.title} (${data.material}, Grade: ${data.grade}).`);
        lbInquireBtn.href = `https://wa.me/916387846610?text=${text}`;
      }
    };

    const openLightbox = (index) => {
      updateLightboxContent(index);
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    const showPrev = () => {
      const newIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
      updateLightboxContent(newIndex);
    };

    const showNext = () => {
      const newIndex = (currentIndex + 1) % galleryData.length;
      updateLightboxContent(newIndex);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Touch Swipe Support for Mobile Lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          showNext(); // Swipe left -> Next
        } else {
          showPrev(); // Swipe right -> Prev
        }
      } else if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
        closeLightbox(); // Swipe down -> Close
      }
    };
  };

  // --- 9. WHATSAPP QUOTE BUILDER FORM ---
  const initQuoteBuilder = () => {
    const quoteForm = document.getElementById('whatsappQuoteForm');
    if (!quoteForm) return;

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = quoteForm.querySelector('#clientName')?.value.trim() || 'Client';
      const phone = quoteForm.querySelector('#clientPhone')?.value.trim() || 'Not specified';
      const service = quoteForm.querySelector('#serviceType')?.value || 'General Fabrication';
      const material = quoteForm.querySelector('#materialGrade')?.value || 'Standard';
      const dimensions = quoteForm.querySelector('#dimensions')?.value.trim() || 'Standard / Custom';
      const message = quoteForm.querySelector('#projectDetails')?.value.trim() || 'Please share catalog and estimation.';

      const whatsappText = `*New Fabrication Inquiry - AR Multiplex Enterprises*
━━━━━━━━━━━━━━━━━━━━
*Client Name:* ${name}
*Contact Number:* ${phone}
*Required Service:* ${service}
*Material Preference:* ${material}
*Estimated Dimensions:* ${dimensions}
*Project Requirements:*
${message}
━━━━━━━━━━━━━━━━━━━━
Sent via AR Multiplex Website`;

      const encodedURL = `https://wa.me/916387846610?text=${encodeURIComponent(whatsappText)}`;
      window.open(encodedURL, '_blank');
    });
  };

  // --- 10. MOBILE NAVIGATION DRAWER & STICKY HEADER ---
  const initNavigation = () => {
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('primaryNavMenu');
    const header = document.querySelector('.header');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        const isOpen = navMenu.classList.contains('is-open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when clicking nav links
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('is-open');
        }
      });
    }

    // Sticky Header Scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    });

    // Active Link Highlighter
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Mobile Dock Active Link
    const dockLinks = document.querySelectorAll('.mobile-dock__item');
    dockLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };

  // --- 11. CONTRACTOR PROFILE MODAL CONTROLLER ---
  const initContractorModal = () => {
    const modal = document.getElementById('contractorProfileModal');
    const trigger = document.getElementById('contractorCardTrigger');
    const closeBtn = document.getElementById('contractorModalClose');

    if (!modal || !trigger) return;

    const openModal = () => {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('is-active') && e.key === 'Escape') {
        closeModal();
      }
    });
  };

  // Execute all modules
  initServiceWorker();
  initPwaInstallPrompt();
  initHeroSparks();
  init3DScrollObserver();
  init3DTilt();
  initFlipCards();
  initGalleryFilter();
  initLightbox();
  initQuoteBuilder();
  initNavigation();
  initContractorModal();
});
