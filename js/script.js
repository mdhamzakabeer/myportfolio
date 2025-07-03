(function () {
  // Cached DOM elements
  const elements = {
    themeToggleDesktop: document.getElementById('theme-toggle-desktop'),
    themeToggleMobile: document.getElementById('theme-toggle-mobile'),
    themeIconDesktop: document.getElementById('theme-icon-desktop'),
    themeIconMobile: document.getElementById('theme-icon-mobile'),
    signature: document.querySelector('.signature'),
    menuToggle: document.getElementById('menu-toggle'),
    mobileMenu: document.getElementById('mobile-menu'),
    scrollProgressBar: document.querySelector('.scroll-progress-bar'),
    backToTop: document.getElementById('back-to-top'),
    desktopHeader: document.getElementById('desktop-header'),
    mobileTopHeader: document.getElementById('mobile-top-header'),
    mobileBottomNav: document.getElementById('mobile-bottom-nav'),
    headerTextElements: document.querySelectorAll(
      '#desktop-header .signature, #mobile-top-header .signature, #mobile-bottom-nav .signature'
    ),
    skillBars: document.querySelectorAll('.skill-progress-bar'),
    skillsSection: document.getElementById('skills'),
    timelineItems: document.querySelectorAll('.timeline-item'),
    timelineSection: document.getElementById('timeline'),
    resumeLink: document.getElementById('download-resume'),
    loaderContainer: document.querySelector('.loader-container') // Add loader container
  };

  // Theme management
  function setTheme(isDarkMode) {
    try {
      const { signature, themeIconDesktop, themeIconMobile } = elements;
      document.documentElement.classList.toggle('dark', isDarkMode);
      if (themeIconDesktop) themeIconDesktop.classList.toggle('fa-moon', !isDarkMode);
      if (themeIconDesktop) themeIconDesktop.classList.toggle('fa-sun', isDarkMode);
      if (themeIconMobile) themeIconMobile.classList.toggle('fa-moon', !isDarkMode);
      if (themeIconMobile) themeIconMobile.classList.toggle('fa-sun', isDarkMode);
      signature.style.color = '#2563eb'; // Default blue
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Theme toggle error:', error);
    }
  }

  // Initialize theme
  function initializeTheme() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark' || (!savedTheme && prefersDarkMode));
  }

  // Mobile menu management
  function toggleMobileMenu(event) {
    event?.stopPropagation();
    const { menuToggle, mobileMenu } = elements;
    if (!menuToggle || !mobileMenu) return;
    const isOpen = mobileMenu.classList.contains('opacity-100');
    menuToggle.classList.toggle('open', !isOpen);
    mobileMenu.classList.toggle('opacity-100', !isOpen);
    mobileMenu.classList.toggle('scale-100', !isOpen);
    mobileMenu.classList.toggle('pointer-events-auto', !isOpen);
    mobileMenu.classList.toggle('opacity-0', isOpen);
    mobileMenu.classList.toggle('scale-95', isOpen);
    mobileMenu.classList.toggle('pointer-events-none', isOpen);
  }

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Loader function
  function hideLoader() {
    const { loaderContainer } = elements;
    if (loaderContainer) {
      document.body.classList.add('loading'); 
      setTimeout(() => {
        loaderContainer.classList.add('hidden'); 
        document.body.classList.remove('loading'); 
      }, 2000); 
    }
  }

  // Scroll handling
  const scrollThreshold = 50;
  let animatedSkills = false;
  let animatedTimeline = false;

  function handleScroll() {
    requestAnimationFrame(() => {
      const { scrollProgressBar, backToTop, desktopHeader, mobileTopHeader, mobileBottomNav, headerTextElements } = elements;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;

      const isDarkMode = document.documentElement.classList.contains('dark');
      const isScrolled = scrollTop > scrollThreshold;

      backToTop.classList.toggle('visible', isScrolled);
      desktopHeader?.classList.toggle('header-scrolled', isScrolled);
      mobileTopHeader?.classList.toggle('header-scrolled', isScrolled);
      mobileBottomNav?.classList.toggle('header-scrolled', isScrolled);

      headerTextElements.forEach((element) => {
        element.style.color = isScrolled ? (isDarkMode ? '#ffffff' : '#000000') : '#2563eb';
      });

      // Skills animation
      if (!animatedSkills && elements.skillsSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
        elements.skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width') || bar.style.width;
          bar.style.width = '0';
          setTimeout(() => bar.style.width = width, 100);
        });
        animatedSkills = true;
      }

      // Timeline animation
      if (!animatedTimeline && elements.timelineSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
        elements.timelineItems.forEach((item, index) => {
          setTimeout(() => item.classList.add('visible'), index * 300);
        });
        animatedTimeline = true;
      }
    });
  }

  // Resume download
  function handleResumeDownload(event) {
    event.preventDefault();
    const resumeUrl = 'assets/images/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'MuhammadHamzakabeer-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    fetch(resumeUrl)
      .then(response => {
        if (!response.ok) throw new Error('Resume not found');
      })
      .catch(() => {
        alert('Error downloading resume. Please try again later.');
      });
  }

  // Signature hover effects
  function setupSignatureHover() {
    const { signature } = elements;
    if (!signature) return;
    signature.addEventListener('mouseover', () => {
      signature.style.color = '#2563eb';
    });
    signature.addEventListener('mouseout', () => {
      signature.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#2c3e50';
    });
    signature.style.color = '#2563eb'; // Initial color
  }

  // Lazy-load Typed.js
  function loadTypedJs() {
    if (!document.getElementById('typed-name')) return;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js';
    script.onload = () => {
      new Typed('#typed-name', {
        strings: ["Hamza.", "A Frontend Developer.", "An Associate Engineer."],
        typeSpeed: 70,
        backSpeed: 30,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    };
    script.onerror = () => console.error('Failed to load Typed.js');
    document.head.appendChild(script);
  }

  // Event listeners
  function setupEventListeners() {
    const { themeToggleDesktop, themeToggleMobile, menuToggle, mobileMenu, resumeLink } = elements;
    if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', toggleMobileMenu));
      document.body.addEventListener('click', (event) => {
        if (!menuToggle?.contains(event.target) && !mobileMenu.contains(event.target) && mobileMenu.classList.contains('opacity-100')) {
          toggleMobileMenu();
        }
      });
    }
    if (resumeLink) resumeLink.addEventListener('click', handleResumeDownload);
    window.addEventListener('scroll', debounce(handleScroll, 10));
    window.addEventListener('load', () => {
      initializeTheme();
      setupSignatureHover();
      loadTypedJs();
      handleScroll(); // Initial call for animations
      hideLoader(); // Call loader function on page load
    });
  }

  // Initialize
  setupEventListeners();
})();

// (function () {
//   // Cached DOM elements
//   const elements = {
//     themeToggleDesktop: document.getElementById('theme-toggle-desktop'),
//     themeToggleMobile: document.getElementById('theme-toggle-mobile'),
//     themeIconDesktop: document.getElementById('theme-icon-desktop'),
//     themeIconMobile: document.getElementById('theme-icon-mobile'),
//     signature: document.querySelector('.signature'),
//     menuToggle: document.getElementById('menu-toggle'),
//     mobileMenu: document.getElementById('mobile-menu'),
//     scrollProgressBar: document.querySelector('.scroll-progress-bar'),
//     backToTop: document.getElementById('back-to-top'),
//     desktopHeader: document.getElementById('desktop-header'),
//     mobileTopHeader: document.getElementById('mobile-top-header'),
//     mobileBottomNav: document.getElementById('mobile-bottom-nav'),
//     headerTextElements: document.querySelectorAll(
//       '#desktop-header .signature, #mobile-top-header .signature, #mobile-bottom-nav .signature'
//     ),
//     skillBars: document.querySelectorAll('.skill-progress-bar'),
//     skillsSection: document.getElementById('skills'),
//     timelineItems: document.querySelectorAll('.timeline-item'),
//     timelineSection: document.getElementById('timeline'),
//     resumeLink: document.getElementById('download-resume')
//   };

//   // Theme management
//   function setTheme(isDarkMode) {
//     try {
//       const { signature, themeIconDesktop, themeIconMobile } = elements;
//       document.documentElement.classList.toggle('dark', isDarkMode);
//       if (themeIconDesktop) themeIconDesktop.classList.toggle('fa-moon', !isDarkMode);
//       if (themeIconDesktop) themeIconDesktop.classList.toggle('fa-sun', isDarkMode);
//       if (themeIconMobile) themeIconMobile.classList.toggle('fa-moon', !isDarkMode);
//       if (themeIconMobile) themeIconMobile.classList.toggle('fa-sun', isDarkMode);
//       signature.style.color = '#2563eb'; // Default blue
//       localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
//     } catch (error) {
//       console.error('Theme toggle error:', error);
//     }
//   }

//   // Initialize theme
//   function initializeTheme() {
//     const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     const savedTheme = localStorage.getItem('theme');
//     setTheme(savedTheme === 'dark' || (!savedTheme && prefersDarkMode));
//   }

//   // Mobile menu management
//   function toggleMobileMenu(event) {
//     event?.stopPropagation();
//     const { menuToggle, mobileMenu } = elements;
//     if (!menuToggle || !mobileMenu) return;
//     const isOpen = mobileMenu.classList.contains('opacity-100');
//     menuToggle.classList.toggle('open', !isOpen);
//     mobileMenu.classList.toggle('opacity-100', !isOpen);
//     mobileMenu.classList.toggle('scale-100', !isOpen);
//     mobileMenu.classList.toggle('pointer-events-auto', !isOpen);
//     mobileMenu.classList.toggle('opacity-0', isOpen);
//     mobileMenu.classList.toggle('scale-95', isOpen);
//     mobileMenu.classList.toggle('pointer-events-none', isOpen);
//   }

//   // Debounce utility
//   function debounce(func, wait) {
//     let timeout;
//     return function (...args) {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func.apply(this, args), wait);
//     };
//   }

//   // Scroll handling
//   const scrollThreshold = 50;
//   let animatedSkills = false;
//   let animatedTimeline = false;

//   function handleScroll() {
//     requestAnimationFrame(() => {
//       const { scrollProgressBar, backToTop, desktopHeader, mobileTopHeader, mobileBottomNav, headerTextElements } = elements;
//       const scrollTop = window.scrollY;
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const scrollPercent = (scrollTop / docHeight) * 100;
//       scrollProgressBar.style.width = `${scrollPercent}%`;

//       const isDarkMode = document.documentElement.classList.contains('dark');
//       const isScrolled = scrollTop > scrollThreshold;

//       backToTop.classList.toggle('visible', isScrolled);
//       desktopHeader?.classList.toggle('header-scrolled', isScrolled);
//       mobileTopHeader?.classList.toggle('header-scrolled', isScrolled);
//       mobileBottomNav?.classList.toggle('header-scrolled', isScrolled);

//       headerTextElements.forEach((element) => {
//         element.style.color = isScrolled ? (isDarkMode ? '#ffffff' : '#000000') : '#2563eb';
//       });

//       // Skills animation
//       if (!animatedSkills && elements.skillsSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
//         elements.skillBars.forEach(bar => {
//           const width = bar.getAttribute('data-width') || bar.style.width;
//           bar.style.width = '0';
//           setTimeout(() => bar.style.width = width, 100);
//         });
//         animatedSkills = true;
//       }

//       // Timeline animation
//       if (!animatedTimeline && elements.timelineSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
//         elements.timelineItems.forEach((item, index) => {
//           setTimeout(() => item.classList.add('visible'), index * 300);
//         });
//         animatedTimeline = true;
//       }
//     });
//   }

//   // Resume download
//   function handleResumeDownload(event) {
//     event.preventDefault();
//     const resumeUrl = '/images/resume.pdf';
//     const link = document.createElement('a');
//     link.href = resumeUrl;
//     link.download = 'Hamza_Resume.pdf';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     fetch(resumeUrl)
//       .then(response => {
//         if (!response.ok) throw new Error('Resume not found');
//       })
//       .catch(() => {
//         alert('Error downloading resume. Please try again later.');
//       });
//   }

//   // Signature hover effects
//   function setupSignatureHover() {
//     const { signature } = elements;
//     if (!signature) return;
//     signature.addEventListener('mouseover', () => {
//       signature.style.color = '#2563eb';
//     });
//     signature.addEventListener('mouseout', () => {
//       signature.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#2c3e50';
//     });
//     signature.style.color = '#2563eb'; // Initial color
//   }

//   // Lazy-load Typed.js
//   function loadTypedJs() {
//     if (!document.getElementById('typed-name')) return;
//     const script = document.createElement('script');
//     script.src = 'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js';
//     script.onload = () => {
//       new Typed('#typed-name', {
//         strings: ["Hamza.", "A Frontend Developer.", "An Associate Engineer."],
//         typeSpeed: 70,
//         backSpeed: 30,
//         loop: true,
//         showCursor: true,
//         cursorChar: '|'
//       });
//     };
//     script.onerror = () => console.error('Failed to load Typed.js');
//     document.head.appendChild(script);
//   }

//   // Event listeners
//   function setupEventListeners() {
//     const { themeToggleDesktop, themeToggleMobile, menuToggle, mobileMenu, resumeLink } = elements;
//     if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
//     if (themeToggleMobile) themeToggleMobile.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
//     if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
//     if (mobileMenu) {
//       mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', toggleMobileMenu));
//       document.body.addEventListener('click', (event) => {
//         if (!menuToggle?.contains(event.target) && !mobileMenu.contains(event.target) && mobileMenu.classList.contains('opacity-100')) {
//           toggleMobileMenu();
//         }
//       });
//     }
//     if (resumeLink) resumeLink.addEventListener('click', handleResumeDownload);
//     window.addEventListener('scroll', debounce(handleScroll, 10));
//     window.addEventListener('load', () => {
//       initializeTheme();
//       setupSignatureHover();
//       loadTypedJs();
//       handleScroll(); // Initial call for animations
//     });
//   }

//   // Initialize
//   setupEventListeners();
// })();




// // Theme toggle functionality
// const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
// const themeToggleMobile = document.getElementById('theme-toggle-mobile');
// const themeIconDesktop = document.getElementById('theme-icon-desktop');
// const themeIconMobile = document.getElementById('theme-icon-mobile');

// // Theme toggle functionality
// function setTheme(isDarkMode) {
//     const signature = document.querySelector('.signature');
//     if (isDarkMode) {
//         document.documentElement.classList.add('dark');
//         if (themeIconDesktop) themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
//         if (themeIconMobile) themeIconMobile.classList.replace('fa-moon', 'fa-sun');
//         signature.style.color = '#2563eb'; // Default blue in dark mode
//         localStorage.setItem('theme', 'dark');
//     } else {
//         document.documentElement.classList.remove('dark');
//         if (themeIconDesktop) themeIconDesktop.classList.replace('fa-sun', 'fa-moon');
//         if (themeIconMobile) themeIconMobile.classList.replace('fa-sun', 'fa-moon');
//         signature.style.color = '#2563eb'; // Default blue in light mode
//         localStorage.setItem('theme', 'light');
//     }
// }
// const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
// const savedTheme = localStorage.getItem('theme');
// if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
//     setTheme(true);
// } else {
//     setTheme(false);
// }

// if (themeToggleDesktop) {
//     themeToggleDesktop.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
// }
// if (themeToggleMobile) {
//     themeToggleMobile.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
// }

// // Mobile menu toggle
// const menuToggle = document.getElementById('menu-toggle');
// const mobileMenu = document.getElementById('mobile-menu');
// const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

// function closeMobileMenu() {
//     if (menuToggle) menuToggle.classList.remove('open');
//     if (mobileMenu) {
//         mobileMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
//         mobileMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
//     }
// }

// if (menuToggle) {
//     menuToggle.addEventListener('click', (event) => {
//         event.stopPropagation();
//         menuToggle.classList.toggle('open');
//         if (mobileMenu) {
//             if (mobileMenu.classList.contains('opacity-0')) {
//                 mobileMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
//                 mobileMenu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
//             } else {
//                 closeMobileMenu();
//             }
//         }
//     });
// }

// document.body.addEventListener('click', (event) => {
//     if (menuToggle && mobileMenu && !menuToggle.contains(event.target) && !mobileMenu.contains(event.target) && mobileMenu.classList.contains('opacity-100')) {
//         closeMobileMenu();
//     }
// });

// mobileMenuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// // Scroll progress and back-to-top
// const scrollProgressBar = document.querySelector('.scroll-progress-bar');
// const backToTop = document.getElementById('back-to-top');
// const scrollThreshold = 50;

// // Header text elements (excluding nav links)
// const headerTextElements = document.querySelectorAll(
//     '#desktop-header .signature, #mobile-top-header .signature, #mobile-bottom-nav .signature'
// );

// window.addEventListener('scroll', () => {
//     const scrollTop = window.scrollY;
//     const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//     const scrollPercent = (scrollTop / docHeight) * 100;
//     scrollProgressBar.style.width = `${scrollPercent}%`;

//     const isDarkMode = document.documentElement.classList.contains('dark');

//     if (scrollTop > scrollThreshold) {
//         backToTop.classList.add('visible');
//         document.getElementById('desktop-header')?.classList.add('header-scrolled');
//         document.getElementById('mobile-top-header')?.classList.add('header-scrolled');
//         document.getElementById('mobile-bottom-nav')?.classList.add('header-scrolled');

//         // Change header text color (excluding nav links) based on theme when scrolled
//         headerTextElements.forEach((element) => {
//             element.style.color = isDarkMode ? '#ffffff' : '#000000';
//         });
//     } else {
//         backToTop.classList.remove('visible');
//         document.getElementById('desktop-header')?.classList.remove('header-scrolled');
//         document.getElementById('mobile-top-header')?.classList.remove('header-scrolled');
//         document.getElementById('mobile-bottom-nav')?.classList.remove('header-scrolled');

//         // Reset header text color when not scrolled
//         headerTextElements.forEach((element) => {
//             element.style.color = '#2563eb'; // Default blue color
//         });
//     }
// });

// // Skill progress animation
// const skillBars = document.querySelectorAll('.skill-progress-bar');
// const skillsSection = document.getElementById('skills');
// let animated = false;

// function animateSkills() {
//     if (animated) return;
//     const sectionTop = skillsSection.getBoundingClientRect().top;
//     if (sectionTop < window.innerHeight * 0.8) {
//         skillBars.forEach(bar => {
//             const width = bar.style.width;
//             bar.style.width = '0';
//             setTimeout(() => bar.style.width = width, 100);
//         });
//         animated = true;
//     }
// }

// // Timeline animation
// const timelineItems = document.querySelectorAll('.timeline-item');
// const timelineSection = document.getElementById('timeline');
// let timelineAnimated = false;

// function animateTimeline() {
//     if (timelineAnimated) return;
//     const sectionTop = timelineSection.getBoundingClientRect().top;
//     if (sectionTop < window.innerHeight * 0.8) {
//         timelineItems.forEach((item, index) => {
//             setTimeout(() => {
//                 item.classList.add('visible');
//             }, index * 300);
//         });
//         timelineAnimated = true;
//     }
// }

// window.addEventListener('scroll', () => {
//     animateSkills();
//     animateTimeline();
// });
// window.addEventListener('load', () => {
//     animateSkills();
//     animateTimeline();
// });

// // Typed.js
// document.addEventListener('DOMContentLoaded', () => {
//     new Typed('#typed-name', {
//         strings: ["Hamza.", "A Frontend Developer.", "An Associate Engineer."],
//         typeSpeed: 70,
//         backSpeed: 30,
//         loop: true,
//         showCursor: true,
//         cursorChar: '|',
//     });
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const signature = document.querySelector('.signature');
//     signature.addEventListener('mouseover', () => {
//         signature.style.color = '#2563eb'; // Blue on hover
//     });
//     signature.addEventListener('mouseout', () => {
//         if (document.documentElement.classList.contains('dark')) {
//             signature.style.color = '#ffffff'; // White in dark theme
//         } else {
//             signature.style.color = '#2c3e50'; // Black in light theme
//         }
//     });

//     // Set initial color to blue on page load
//     signature.style.color = '#2563eb';
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const resumeLink = document.getElementById('download-resume');
//     if (resumeLink) {
//         resumeLink.addEventListener('click', function (event) {
//             event.preventDefault();
//             const resumeUrl = '/images/resume.pdf'; // Update this path if your resume is located elsewhere
//             const link = document.createElement('a');
//             link.href = resumeUrl;
//             link.download = 'Hamza_Resume.pdf'; // Name of the downloaded file
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             // Optional: Check if file exists (basic validation)
//             fetch(urlresume)
//                 .then(response => {
//                     if (!response.ok) {
//                         alert('Sorry, the resume file could not be found. Please contact me directly.');
//                     }
//                 })
//                 .catch(() => {
//                     alert('Error downloading resume. Please try again later.');
//                 });
//         });
//     }
// });



// // Cache DOM elements
// const elements = {
//   themeToggleDesktop: document.getElementById('theme-toggle-desktop'),
//   themeToggleMobile: document.getElementById('theme-toggle-mobile'),
//   themeIconDesktop: document.getElementById('theme-icon-desktop'),
//   themeIconMobile: document.getElementById('theme-icon-mobile'),
//   menuToggle: document.getElementById('menu-toggle'),
//   mobileMenu: document.getElementById('mobile-menu'),
//   scrollProgressBar: document.querySelector('.scroll-progress-bar'),
//   backToTop: document.getElementById('back-to-top'),
//   desktopHeader: document.getElementById('desktop-header'),
//   mobileTopHeader: document.getElementById('mobile-top-header'),
//   mobileBottomNav: document.getElementById('mobile-bottom-nav'),
//   skillsSection: document.getElementById('skills'),
//   timelineSection: document.getElementById('timeline'),
//   resumeLink: document.getElementById('download-resume'),
//   signature: document.querySelector('.signature'),
// };

// // Cache static queries
// const mobileMenuLinks = elements.mobileMenu?.querySelectorAll('a') || [];
// const skillBars = document.querySelectorAll('.skill-progress-bar');
// const timelineItems = document.querySelectorAll('.timeline-item');
// const scrollThreshold = 50;

// // Theme handling
// const setTheme = (isDarkMode) => {
//   const root = document.documentElement;
//   if (root.classList.contains('dark') === isDarkMode) return;

//   root.classList.toggle('dark', isDarkMode);
//   elements.themeIconDesktop?.classList.replace(isDarkMode ? 'fa-moon' : 'fa-sun', isDarkMode ? 'fa-sun' : 'fa-moon');
//   elements.themeIconMobile?.classList.replace(isDarkMode ? 'fa-moon' : 'fa-sun', isDarkMode ? 'fa-sun' : 'fa-moon');
//   localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
// };

// // Initialize theme
// const savedTheme = localStorage.getItem('theme');
// const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
// setTheme(savedTheme === 'dark' || (!savedTheme && prefersDarkMode));

// // Theme toggle listeners
// [elements.themeToggleDesktop, elements.themeToggleMobile].forEach(toggle => {
//   toggle?.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
// });

// // Mobile menu handling
// const closeMobileMenu = () => {
//   elements.menuToggle?.classList.remove('open');
//   elements.mobileMenu?.classList.replace('opacity-100', 'opacity-0')
//     .replace('scale-100', 'scale-95')
//     .replace('pointer-events-auto', 'pointer-events-none');
// };

// elements.menuToggle?.addEventListener('click', (e) => {
//   e.stopPropagation();
//   elements.menuToggle.classList.toggle('open');
//   elements.mobileMenu?.classList.toggle('opacity-0')
//     .toggle('scale-95')
//     .toggle('opacity-100')
//     .toggle('scale-100')
//     .toggle('pointer-events-none')
//     .toggle('pointer-events-auto');
// });

// document.body.addEventListener('click', (e) => {
//   if (
//     elements.menuToggle &&
//     elements.mobileMenu &&
//     !elements.menuToggle.contains(e.target) &&
//     !elements.mobileMenu.contains(e.target) &&
//     elements.mobileMenu.classList.contains('opacity-100')
//   ) {
//     closeMobileMenu();
//   }
// });

// mobileMenuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// // Scroll handling
// let animated = false;
// let timelineAnimated = false;

// const animateSkills = () => {
//   if (animated || !elements.skillsSection) return;
//   if (elements.skillsSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
//     skillBars.forEach(bar => {
//       const width = bar.dataset.width || bar.style.width;
//       bar.style.width = '0';
//       bar.style.transition = 'width 0.5s ease';
//       requestAnimationFrame(() => bar.style.width = width);
//     });
//     animated = true;
//   }
// };

// const animateTimeline = () => {
//   if (timelineAnimated || !elements.timelineSection) return;
//   if (elements.timelineSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
//     timelineItems.forEach((item, index) => {
//       setTimeout(() => item.classList.add('visible'), index * 300);
//     });
//     timelineAnimated = true;
//   }
// };

// const handleScroll = () => {
//   const scrollTop = window.scrollY;
//   const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//   elements.scrollProgressBar.style.width = `${(scrollTop / docHeight) * 100}%`;

//   const isScrolled = scrollTop > scrollThreshold;
//   elements.backToTop.classList.toggle('visible', isScrolled);
//   elements.desktopHeader?.classList.toggle('header-scrolled', isScrolled);
//   elements.mobileTopHeader?.classList.toggle('header-scrolled', isScrolled);
//   elements.mobileBottomNav?.classList.toggle('header-scrolled', isScrolled);

//   animateSkills();
//   animateTimeline();
// };

// // Unified scroll and load handler
// window.addEventListener('scroll', handleScroll);
// window.addEventListener('load', handleScroll);

// // DOMContentLoaded handlers
// document.addEventListener('DOMContentLoaded', () => {
//   // Typed.js
//   new Typed('#typed-name', {
//     strings: ["Hamza.", "A Frontend Developer.", "An Associate Engineer."],
//     typeSpeed: 70,
//     backSpeed: 30,
//     loop: true,
//     showCursor: true,
//     cursorChar: '|',
//   });

//   // Signature hover
//   elements.signature?.addEventListener('mouseover', () => {
//     elements.signature.style.color = '#2563eb';
//   });
//   elements.signature?.addEventListener('mouseout', () => {
//     elements.signature.style.color = '#2c3e50';
//   });

//   // Resume download
//   elements.resumeLink?.addEventListener('click', (e) => {
//     e.preventDefault();
//     const resumeUrl = 'images/resume.pdf';
//     const link = document.createElement('a');
//     link.href = resumeUrl;
//     link.download = 'Hamza_Resume.pdf';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     // Validate file existence
//     fetch(resumeUrl)
//       .then(response => {
//         if (!response.ok) alert('Sorry, the resume file could not be found. Please contact me directly.');
//       })
//       .catch(() => alert('Error downloading resume. Please try again later.'));
//   });
// });
