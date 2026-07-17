// Simple interactions for the 90s portfolio desktop
document.addEventListener('DOMContentLoaded',()=>{
  const boot = document.getElementById('boot');
  const desktop = document.getElementById('desktop');
  const erFolder = document.getElementById('er-folder');
  const erWindow = document.getElementById('er-window');
  const winClose = document.getElementById('win-close');
  const erMinBtn = document.getElementById('er-minimize');
  const erMaxBtn = document.getElementById('er-maximize');
  const erCloseBtnById = document.getElementById('er-close');
  const tabs = document.getElementById('nav-tabs');
  let erIsMinimized = false;
  let erIsMaximized = false;
  let erRestoreRect = null;

  // Shared front/back layer counter for all desktop windows.
  let zIndexCounter = 5000;

  // Simulate boot sequence then show an XP-like "Starting" screen with xp-logo1.png and the classic loading bar
  const xpStarting = document.getElementById('xp-starting');
  const bootLines = document.getElementById('boot-lines');
  const progress = document.querySelector('.progress');

  function forceShowTaskbar(){
    try{ document.body.classList.remove('loading-fullscreen'); }catch(e){}

    const taskbar = document.querySelector('.taskbar');
    const startButton = document.querySelector('.start-button, #start-btn');
    const taskbarItems = document.querySelector('.taskbar-items, #taskbar-items');
    const systemTray = document.querySelector('.system-tray');
    const clock = document.querySelector('.clock, #taskbar-clock');

    [taskbar, startButton, taskbarItems, systemTray, clock].forEach((el)=>{
      if(!el) return;
      el.classList.remove('hidden');
      el.removeAttribute('hidden');
      el.setAttribute('aria-hidden', 'false');
      el.style.removeProperty('visibility');
      el.style.removeProperty('opacity');
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });

    if(taskbar){
      taskbar.style.setProperty('display', 'flex', 'important');
      taskbar.style.setProperty('position', 'fixed', 'important');
      taskbar.style.setProperty('bottom', '0', 'important');
      taskbar.style.setProperty('left', '0', 'important');
      taskbar.style.setProperty('right', '0', 'important');
      taskbar.style.setProperty('height', '40px', 'important');
      taskbar.style.setProperty('z-index', '999999', 'important');
    }

    if(startButton) startButton.style.setProperty('display', 'flex', 'important');
    if(taskbarItems) taskbarItems.style.setProperty('display', 'flex', 'important');
    if(systemTray) systemTray.style.setProperty('display', 'flex', 'important');
    if(clock) clock.style.setProperty('display', 'inline-flex', 'important');
  }

  let activeProjectId = 'studio360-mobile';
  let activeProjectIndex = 0;
  let renderProjectContent = null;

  // Initialize the Projects window so sidebar clicks render the matching project detail layout.
  function initProjectTabs(){
    const projectWin = document.getElementById('project-window');
    if(!projectWin) return;

    const sidebarButtons = Array.from(projectWin.querySelectorAll('.sidebar-btn[data-project]'));
    const titleEl = projectWin.querySelector('#project-detail-title');
    const summaryEl = projectWin.querySelector('#project-detail-summary');
    const overviewEl = projectWin.querySelector('#project-overview');
    const roleEl = projectWin.querySelector('#project-role');
    const roleSectionEl = roleEl ? roleEl.closest('section') : null;
    const githubLinkEl = projectWin.querySelector('#project-github-link');
    const githubSectionEl = githubLinkEl ? githubLinkEl.closest('section') : null;
    const techstackEl = projectWin.querySelector('#project-techstack');
    const galleryImageEl = projectWin.querySelector('#project-gallery-image');
    const galleryDotsEl = projectWin.querySelector('#project-gallery-dots');
    const prevButton = projectWin.querySelector('#project-gallery-prev');
    const nextButton = projectWin.querySelector('#project-gallery-next');
    const galleryFrameEl = projectWin.querySelector('.project-gallery-frame');

    const graphicDesignImages = [
      '/assets/socmedposter/BACK TO FRIENDS.png',
      '/assets/socmedposter/CHERRY VAPE.png',
      '/assets/socmedposter/DEANS LIST PONY.png',
      '/assets/socmedposter/DUBAI COOKIE.png',
      '/assets/socmedposter/HAPPY BIRTHDAY.png',
      '/assets/socmedposter/iRISE.png',
      '/assets/socmedposter/iRISE2.png',
      '/assets/socmedposter/iRISE3.png',
      '/assets/socmedposter/iRISE4.png',
      '/assets/socmedposter/JISULIFE.png',
      '/assets/socmedposter/MAXAI1.png',
      '/assets/socmedposter/MAXAI10.png',
      '/assets/socmedposter/MAXAI11.png',
      '/assets/socmedposter/MAXAI2.png',
      '/assets/socmedposter/MAXAI3.png',
      '/assets/socmedposter/MAXAI4.png',
      '/assets/socmedposter/MAXAI5.png',
      '/assets/socmedposter/MAXAI6.png',
      '/assets/socmedposter/MAXAI7.png',
      '/assets/socmedposter/MAXAI8.png',
      '/assets/socmedposter/MAXAI9.png',
      '/assets/socmedposter/MAXAISA1.png',
      '/assets/socmedposter/MAXAISA2.png',
      '/assets/socmedposter/MAXAISA3.png',
      '/assets/socmedposter/MAXAISA4.png',
      '/assets/socmedposter/MAXAISA5.png',
      '/assets/socmedposter/MAXAISA6.png',
      '/assets/socmedposter/MIQUESI ERAS TOUR.png',
      '/assets/socmedposter/MIQUESI FACEBOOK INSIRED.png',
      '/assets/socmedposter/MIQUESI TIKTOK INSPIRED 2.png',
      '/assets/socmedposter/MIQUESI TIKTOK INSPIRED 3.png',
      '/assets/socmedposter/MIQUESI TIKTOK INSPIRED.png',
      '/assets/socmedposter/NEW BALANCE X STRAVA.png',
      '/assets/socmedposter/PIKACHU.png',
      '/assets/socmedposter/PINK BACK TO SCHOOL.png',
      '/assets/socmedposter/SATESERY1.png',
      '/assets/socmedposter/SATESERY2.png',
      '/assets/socmedposter/SATESERY3.png',
      '/assets/socmedposter/SATESERY4.png',
      '/assets/socmedposter/SATESERY5.png',
      '/assets/socmedposter/SATESERY6.png',
      '/assets/socmedposter/SMTESERY1.png',
      '/assets/socmedposter/SMTESERY2.png',
      '/assets/socmedposter/SMTESERY3.png',
      '/assets/socmedposter/SMTESERY4.png',
      '/assets/socmedposter/SMTESERY5.png',
      '/assets/socmedposter/SUMMER SUNSCREEN.png',
      '/assets/socmedposter/TRUSTED PET CORNER.png',
      '/assets/socmedposter/PARISA WANG.png',
      '/assets/socmedposter/SJDH - DOCTORS.png',
      '/assets/socmedposter/SJDH - DOCTORS2.png',
      '/assets/socmedposter/SJDH - DOCTORS3.png',
      '/assets/socmedposter/SJDH - DOCTORS4.png',
      '/assets/socmedposter/SJDH SERVICES 1.png',
      '/assets/socmedposter/SJDH - SERVICES 2.png',
      '/assets/socmedposter/SJDH - SERVICES 3.png',
      '/assets/socmedposter/SJDH - SERVICES4.png',
      '/assets/socmedposter/SJDH BE PATIENT.png',
      '/assets/socmedposter/SJDH YAKAP.png',
    ];

    const thumbnailImages = [
      '/assets/thumbnail/a day in my life.png',
      '/assets/thumbnail/explore batangas.png',
      '/assets/thumbnail/graduated podcast.png',
      '/assets/thumbnail/laiya batangas.png',
      '/assets/thumbnail/lomi review.png',
      '/assets/thumbnail/stop using canva.png',
      '/assets/thumbnail/unlimited meta hack.png'
    ];

    function escapeHtml(value){
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function getImageLabel(imagePath){
      const fileName = imagePath.split('/').pop() || imagePath;
      return fileName.replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
    }

    const projectData = {
      'jessa-portfolio': {
        title: 'Jessa - Windows XP Inspired Portfolio',
        summary: 'A simple and interactive website presenting projects, credentials, and profile information.',
        overview: 'My Windows XP-inspired portfolio is a simple and interactive website that presents my work and background. It includes my application development projects, creative designs, certifications, experience, and personal information in a familiar desktop-style layout.',
        images: [
          '/assets/web-app-screenshots/portfolio0.jpg',
          '/assets/web-app-screenshots/portfolio1.jpg',
          '/assets/web-app-screenshots/portfolio2.jpg',
          '/assets/web-app-screenshots/portfolio3.jpg',
          '/assets/web-app-screenshots/portfolio4.jpg'
        ],
        techstack: ['HTML', 'CSS', 'JavaScript'],
        github: 'https://github.com/jessaslg/my-portfolio'
      },
      'studio360-web': {
        title: 'Studio360: A Web Management Platform for Kitch using Artificial Intelligence',
        summary: 'An AI-powered web-based business management system for creative micro-enterprises.',
        overview: 'Studio360 is an AI-powered web-based business management system designed for creative micro-enterprises, with its core focus on automating the bookkeeping process and providing intelligent business insights. The system utilizes artificial intelligence to read and process invoice data, automatically classify transactions, and transfer them to the appropriate books of accounts, including the General Journal, General Ledger, Cash Receipts Journal, and Cash Disbursements Journal, based on the transaction type. By eliminating manual bookkeeping, Studio360 reduces human error, saves time, and improves the accuracy of financial records. In addition to financial automation, the system analyzes historical sales data to identify seasonal trends and generate sales forecasts, providing business owners with an interactive dashboard that visualizes sales performance, including periods of low, consistent, and high sales. These AI-driven features enable data-informed decision-making, improve financial management, and help small businesses optimize inventory planning, monitor business performance, and support sustainable growth through intelligent automation.',
        images: [
          '/assets/web-app-screenshots/studio1.png',
          '/assets/web-app-screenshots/studio2.png',
          '/assets/web-app-screenshots/studio3.png',
          '/assets/web-app-screenshots/studio4.png',
          '/assets/web-app-screenshots/studio5.png',
          '/assets/web-app-screenshots/studio6.png',
          '/assets/web-app-screenshots/studio7.png',
          '/assets/web-app-screenshots/studio8.png',
          '/assets/web-app-screenshots/studio9.png',
          '/assets/web-app-screenshots/studio10.png',
          '/assets/web-app-screenshots/studio11.png',
          '/assets/web-app-screenshots/studio12.png',
          '/assets/web-app-screenshots/studio13.png'
        ],
        techstack: ['Python', 'Tesseract', 'JavaScript','C','C++', 'Supabase'],
        role: 'Backend and AI Developer, Assistant Team Lead, Documentation/Tester',
        github: 'https://github.com/jessaslg/JESSA-STUDIO360'
      },
      'studio360-mobile': {
        title: 'Studio360: Mobile Commerce Application',
        summary: 'A front-end mobile commerce prototype built to showcase a complete retail user journey.',
        overview: 'Studio360 Mobile Application is a front-end mobile application designed to showcase the core features of an online retail platform. Built without a backend or database integration, the application demonstrates a complete user interface and user experience flow, including user authentication, product browsing, coupon claiming, shopping cart management, checkout process, and user profile management. It serves as a functional prototype that highlights the design and navigation of a modern e-commerce mobile application.',
        images: [
          '/assets/web-app-screenshots/mobile1.png',
          '/assets/web-app-screenshots/mobile2.png',
          '/assets/web-app-screenshots/mobile3.png',
          '/assets/web-app-screenshots/mobile4.png'
        ],
        techstack: ['Flutter', 'Dart'],
        role: 'Team lead and Developer'
      },
      'san-juan-payroll': {
        title: 'San Juan District Hospital Payroll Management',
        summary: 'A payroll management work focused on streamlining salary and attendance processing.',
        overview: "Employee Management and Payroll System is a web-based application developed as part of my internship at San Juan District Hospital. The project was intended to support employee management and payroll processing and was designed to be interoperable with the hospital's existing systems. However, the integration was not completed because payroll operations were later centralized under the Batangas Provincial Government. Despite this, the project served as a valuable training ground where I gained hands-on experience in web development, database management, and building real-world administrative systems.",
        images: [
          '/assets/web-app-screenshots/sjdh1.jpg',
          '/assets/web-app-screenshots/sjdh2.jpg',
          '/assets/web-app-screenshots/sjdh3.jpg',
          '/assets/web-app-screenshots/sjdh4.jpg',
          '/assets/web-app-screenshots/sjdh5.jpg'
        ],
        techstack: ['HTML', 'CSS', 'JavaScript']
      },
      'ventspace': {
        title: 'VentSpace: Integrated Health Management',
        summary: 'An integrated health management system for organizing healthcare workflows and records.',
        overview: 'VentSpace: The main goal is to create a safe space where people can talk about their mental health openly. The platform will help reduce the stigma by encouraging users to share their feelings. It will allow people to connect with others who face similar struggles. Users will be able to post anonymously to feel more comfortable. The platform will also provide resources to help people manage their mental health. Overall, it aims to raise awareness and support emotional well-being. It also inlude Physical Health support such as BMI Calculator, Meal Planning, and Exercise Suggetions to support overall health and well-being.',
        images: [
          '/assets/web-app-screenshots/ventspace1.png',
          '/assets/web-app-screenshots/ventspace2.png',
          '/assets/web-app-screenshots/ventspace3.png'
        ],
        techstack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
        role: ['Developer', 'Team Lead'],
        github: 'https://github.com/jessaslg/VentSpace-Integrated-Health---Mental-Clarity-Physical-Vitality'
      },
      'boss-mix-payroll': {
        title: 'Boss Mix Payroll Managament',
        summary: 'A payroll management application work for organizing employee and compensation data.',
        overview: 'Boss Mix Payroll Managament is an application development project that organizes payroll records, computes employee pay details, and supports payroll documentation. The work is aimed at improving payroll data consistency and providing a more efficient process for payroll administration.',
        images: ['/assets/web-app-screenshots/bossmix1.JPEG'],
        techstack: ['C#', '.Net framework', 'Microsoft Access'],
        role: 'Team lead and Full-Stack Developer'
      },
      productive: {
        title: 'Pro/ductive: Personal Diary Application',
        summary: 'A C# Windows Forms desktop application for managing personal notes and tasks with MS Access database.',
        overview: 'PRO/DUCTIVE is a simple productivity application developed using C# Windows Forms with an MS Access database as part of a second-year college project. It enables users to create, store, update, and delete personal notes through basic CRUD operations, providing a straightforward desktop solution for organizing daily tasks and reminders.',
        images: [
          '/assets/web-app-screenshots/productive1.JPEG',
          '/assets/web-app-screenshots/productive2.JPEG',
          '/assets/web-app-screenshots/productive3.JPEG',
          '/assets/web-app-screenshots/productive4.JPEG'
        ],
        techstack: ['C#', 'Windows Forms', 'MS Access'],
        role: 'Team lead and Developer',
        github: 'https://github.com/jessaligao11/FINAL-PROJECT-DMS/tree/visual-studio-productive/MY%20APP'
      },
      guidance: {
        title: 'Guidance E-Counselling System',
        summary: 'A console-based C++ system for scheduling counseling appointments and managing student records.',
        overview: 'The Guidance E-Counselling System is a console-based application developed using C++ that streamlines basic guidance office operations. It allows students to schedule counseling appointments, while administrators can create counseling notes and manage student records through basic CRUD (Create, Read, Update, and Delete) functionalities. Although the system does not use a database, it temporarily stores and manages student information using C++ vectors, demonstrating core data management concepts and fundamental software development principles.',
        images: [
          '/assets/web-app-screenshots/ecounselling6.JPEG',
          '/assets/web-app-screenshots/ecounselling1.jpg',
          '/assets/web-app-screenshots/ecounselling2.jpg',
          '/assets/web-app-screenshots/ecounselling3.jpg',
          '/assets/web-app-screenshots/ecounselling4.jpg',
          '/assets/web-app-screenshots/ecounselling5.jpg'
        ],
        techstack: ['C++'],
        role: 'Team lead and Developer'
      },
      'social-media': {
        title: 'Graphic Design Portfolio',
        summary: 'A complete gallery of my graphic design works.',
        overview: 'This graphic design portfolio presents a complete collection of my social media posters and creative visual works. The gallery highlights a range of promotional, celebratory, and concept-driven designs arranged in a familiar desktop-style viewer.',
        images: graphicDesignImages,
        techstack: ['Canva', 'Photoshop'],
        role: 'Designer',
        github: 'https://github.com/jessaslg',
        hideDetails: true
      },
      'email-newsletter': {
        title: 'Email Newsletter',
        summary: 'A creative email newsletter design collection.',
        overview: 'This email newsletter design entry showcases a polished set of promotional email visuals used for digital marketing and audience engagement. The layout focuses on clear hierarchy, readable typography, and visually engaging content blocks.',
        images: [
          '/assets/email-newsletter/beach products.png',
          '/assets/email-newsletter/crickle.png',
          '/assets/email-newsletter/goodie hoodie.png',
          '/assets/email-newsletter/goodie hoodie2.png',
          '/assets/email-newsletter/siren glow.png',
          '/assets/email-newsletter/soaphisticated.png',
          '/assets/email-newsletter/ube drinks.png'
        ],
        techstack: ['Canva', 'Photoshop'],
        role: 'Designer',
        github: 'https://github.com/jessaslg',
        hideDetails: true
      },
      'video-editing': {
        title: 'Video Editing',
        summary: 'A creative video editing portfolio item.',
        overview: 'This video editing entry presents edited visual content created to support online promotion and storytelling. It highlights sequencing, pacing, and visual polish across short-form and campaign-style video work.',
        images: [],
        techstack: ['Canva', 'Photoshop'],
        role: 'Designer',
        github: 'https://github.com/jessaslg',
        hideDetails: true,
        videoLink: 'https://drive.google.com/drive/folders/1iwRimiU8sraEBKqSVPywwUEs4CmDYKgd?usp=sharing'
      },
      thumbnails: {
        title: 'Thumbnails',
        summary: 'A complete gallery of my thumbnail designs.',
        overview: 'This thumbnail portfolio presents a complete collection of my video and content thumbnail works. The gallery highlights strong visual hierarchy, bold subjects, and readable compositions arranged in a familiar desktop-style viewer.',
        images: thumbnailImages,
        techstack: ['Photoshop', 'Canva'],
        role: 'Designer',
        github: 'https://github.com/jessaslg',
        hideDetails: true
      },
      posters: {
        title: 'Graphic Design Portfolio',
        summary: 'A complete gallery of my graphic design works.',
        overview: 'This graphic design portfolio presents a complete collection of my social media posters and creative visual works. The gallery highlights a range of promotional, celebratory, and concept-driven designs arranged in a familiar desktop-style viewer.',
        images: [
          '/assets/poster/500-days.jpg',
          '/assets/poster/DESERTER.jpg',
          '/assets/poster/LIWANAG SA DILIM.jpg',
          '/assets/poster/PINNACLE.jpg',
          '/assets/poster/STREET-SIGN.jpg',
          '/assets/poster/THE-LOVED-ONE.jpg'
        ],
        techstack: ['Photoshop', 'Canva'],
        role: 'Designer',
        github: 'https://github.com/jessaslg',
        hideDetails: true
      }
    };

    function getProject(projectId){
      return projectData[projectId] || projectData['studio360-mobile'];
    }

    function setActiveSidebar(projectId){
      sidebarButtons.forEach((button)=>{
        button.classList.toggle('is-active', button.dataset.project === projectId);
      });
    }

    function renderGallery(project){
      const images = project.images && project.images.length ? project.images : ['/assets/img/project-logo.jpg'];
      if(activeProjectIndex < 0 || activeProjectIndex >= images.length){
        activeProjectIndex = 0;
      }

      if(galleryFrameEl){
        const existingLinkCard = galleryFrameEl.querySelector('.project-video-link-card');
        if(existingLinkCard){ existingLinkCard.remove(); }
      }

      if(project.videoLink){
        if(galleryImageEl){
          try{ galleryImageEl.removeEventListener('click', galleryImageEl._openHandler); }catch(e){}
          try{ galleryImageEl.removeEventListener('pointerdown', galleryImageEl._captureHandler, true); }catch(e){}
          try{ galleryImageEl.removeEventListener('mousedown', galleryImageEl._captureHandler, true); }catch(e){}
          galleryImageEl.style.display = 'none';
        }
        if(prevButton){ prevButton.style.display = 'none'; }
        if(nextButton){ nextButton.style.display = 'none'; }
        if(galleryDotsEl){
          galleryDotsEl.style.display = 'none';
          galleryDotsEl.innerHTML = '';
        }
        if(galleryFrameEl){
          const safeLink = escapeHtml(project.videoLink);
          const linkCard = document.createElement('a');
          linkCard.className = 'project-video-link-card';
          linkCard.href = safeLink;
          linkCard.target = '_blank';
          linkCard.rel = 'noreferrer noopener';
          linkCard.innerHTML = '<span class="project-video-link-kicker">Google Drive</span><span class="project-video-link-title">Open Video Editing File</span><span class="project-video-link-subtitle">View the full video in a new tab</span>';
          galleryFrameEl.appendChild(linkCard);
        }
        return;
      }
      if(galleryDotsEl){ galleryDotsEl.style.display = ''; }
      if(prevButton && !prevButton.dataset.iconReady){
        prevButton.style.display = '';
        prevButton.innerHTML = '<img src="/assets/img/slider_left.png" alt="Previous">';
        prevButton.dataset.iconReady = 'true';
      }
      if(nextButton && !nextButton.dataset.iconReady){
        nextButton.style.display = '';
        nextButton.innerHTML = '<img src="/assets/img/slider_right.png" alt="Next">';
        nextButton.dataset.iconReady = 'true';
      }
      if(galleryImageEl){
        galleryImageEl.style.display = '';
        galleryImageEl.src = images[activeProjectIndex];
        galleryImageEl.alt = `${project.title} preview ${activeProjectIndex + 1}`;
        // clicking the project gallery image opens it in the cert modal for a zoomed view
        galleryImageEl.style.cursor = 'zoom-in';
        try{ galleryImageEl.removeEventListener('click', galleryImageEl._openHandler); }catch(e){}
        try{ galleryImageEl.removeEventListener('pointerdown', galleryImageEl._captureHandler, true); }catch(e){}
        try{ galleryImageEl.removeEventListener('mousedown', galleryImageEl._captureHandler, true); }catch(e){}
        // Prevent pointer/mouse events from reaching global window handlers so
        // clicking the image only opens the modal and does NOT bring the
        // Projects window to the front. Use capture-phase listeners to stop
        // the event before document-level capture handlers run.
        galleryImageEl._captureHandler = function(e){ try{ e.stopPropagation(); }catch(err){} };
        galleryImageEl.addEventListener('pointerdown', galleryImageEl._captureHandler, true);
        galleryImageEl.addEventListener('mousedown', galleryImageEl._captureHandler, true);
        galleryImageEl._openHandler = function(e){ try{ e && e.stopPropagation(); }catch(err){} if(window.openCertModal) window.openCertModal(galleryImageEl.src, project.title || ''); };
        galleryImageEl.addEventListener('click', galleryImageEl._openHandler);
      }
      if(galleryDotsEl){
        galleryDotsEl.innerHTML = images.map((imagePath, index)=>{
          const label = escapeHtml(getImageLabel(imagePath));
          const safePath = escapeHtml(imagePath);
          return `<button type="button" class="project-gallery-dot${index === activeProjectIndex ? ' is-active' : ''}" data-index="${index}" aria-label="Show image ${index + 1}: ${label}"><img src="${safePath}" alt="${label}"><span class="project-gallery-thumb-label">${label}</span></button>`;
        }).join('');
      }
    }

    function renderProject(projectId, preferredIndex){
      const project = getProject(projectId);
      activeProjectId = projectData[projectId] ? projectId : 'studio360-mobile';
      activeProjectIndex = typeof preferredIndex === 'number' && !Number.isNaN(preferredIndex) ? preferredIndex : 0;

      setActiveSidebar(activeProjectId);

      if(titleEl) titleEl.textContent = project.title;
      if(summaryEl) summaryEl.textContent = project.summary;
      if(overviewEl) overviewEl.textContent = project.overview || '';
      if(roleEl) roleEl.textContent = project.role || '';
      if(overviewEl && overviewEl.closest('section')){
        overviewEl.closest('section').style.display = project.hideDetails ? 'none' : '';
      }
      if(techstackEl && techstackEl.closest('section')){
        techstackEl.closest('section').style.display = project.hideDetails ? 'none' : '';
      }
      if(roleSectionEl){
        roleSectionEl.style.display = project.hideDetails || !project.role ? 'none' : '';
      }
      const projectLink = project.github || project.prototypeLink || '';
      if(githubLinkEl){
        githubLinkEl.href = projectLink || '#';
        githubLinkEl.textContent = project.linkLabel || (project.prototypeLink ? 'View Prototype' : 'View On GitHub');
        githubLinkEl.style.display = projectLink && !project.hideDetails ? '' : 'none';
      }
      if(githubSectionEl){
        githubSectionEl.style.display = projectLink && !project.hideDetails ? '' : 'none';
      }
      if(techstackEl) techstackEl.innerHTML = project.techstack.map((tech)=>`<span class="project-tech-pill">${tech}</span>`).join('');

      renderGallery(project);
    }

    function stepGallery(step){
      const project = getProject(activeProjectId);
      const images = project.images && project.images.length ? project.images : ['/assets/img/project-logo.jpg'];
      activeProjectIndex = (activeProjectIndex + step + images.length) % images.length;
      renderProject(activeProjectId, activeProjectIndex);
    }

    sidebarButtons.forEach((button)=>{
      button.addEventListener('click', ()=>{
        renderProject(button.dataset.project);
      });
    });

    if(prevButton){ prevButton.addEventListener('click', ()=>stepGallery(-1)); }
    if(nextButton){ nextButton.addEventListener('click', ()=>stepGallery(1)); }
    if(galleryDotsEl){
      galleryDotsEl.addEventListener('click', (event)=>{
        const dot = event.target.closest('[data-index]');
        if(!dot) return;
        renderProject(activeProjectId, Number(dot.dataset.index));
      });
    }

    renderProjectContent = renderProject;
    renderProject(activeProjectId);
  }


  // Keep the Projects content visible after About Me or other global page switches.
  function resetProjectContent(){
    const projectWin = document.getElementById('project-window');
    if(projectWin){
      projectWin.classList.remove('hidden');
      projectWin.style.visibility = 'visible';
      projectWin.style.opacity = '1';
      projectWin.setAttribute('aria-hidden', 'false');
    }

    if(typeof renderProjectContent === 'function'){
      renderProjectContent(activeProjectId || 'studio360-mobile', activeProjectIndex || 0);
      return;
    }

    initProjectTabs();
  }

  // Projects now render directly in the main panel, so there is no separate detail panel to manage here.


  function finishLoadingScreen(){
    const loadingOverlay = document.querySelector('.loading-overlay');

    if(boot){
      boot.classList.add('hidden');
      boot.setAttribute('aria-hidden', 'true');
    }

    if(loadingOverlay){
      loadingOverlay.classList.add('hidden');
      loadingOverlay.setAttribute('aria-hidden', 'true');
      loadingOverlay.style.pointerEvents = 'none';
    }

    if(desktop){
      desktop.classList.remove('hidden');
      desktop.setAttribute('aria-hidden', 'false');
    }

    forceShowTaskbar();

    // Repeat because some click/open handlers and boot transitions can re-apply .hidden.
    try{ requestAnimationFrame(()=>forceShowTaskbar()); }catch(e){}
    setTimeout(forceShowTaskbar, 100);
    setTimeout(forceShowTaskbar, 500);
    setTimeout(forceShowTaskbar, 1000);
    setTimeout(forceShowTaskbar, 2000);
  }

  window.finishLoadingScreen = finishLoadingScreen;

  // Last-resort CSS override created by JS so the taskbar stays visible after loading.
  const taskbarFixStyle = document.createElement('style');
  taskbarFixStyle.textContent = `
    body:not(.loading-fullscreen) .taskbar {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 40px !important;
      z-index: 999999 !important;
    }
    body:not(.loading-fullscreen) .start-button,
    body:not(.loading-fullscreen) #start-btn,
    body:not(.loading-fullscreen) .taskbar-items,
    body:not(.loading-fullscreen) #taskbar-items,
    body:not(.loading-fullscreen) .system-tray {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    body:not(.loading-fullscreen) .clock,
    body:not(.loading-fullscreen) #taskbar-clock {
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(taskbarFixStyle);

  // Highest-priority window stacking CSS.
  // Inline JS still controls the state, but these rules prevent stylesheet conflicts.
  const windowStackFixStyle = document.createElement('style');
  windowStackFixStyle.textContent = `
    #er-window.active-window,
    #project-window.active-window,
    #wordpad-window.active-window,
    #music-player-window.active-window,
    #mail-window.active-window {
      z-index: 2147483000 !important;
      position: absolute !important;
    }

    #er-window.inactive-window,
    #project-window.inactive-window,
    #wordpad-window.inactive-window,
    #music-player-window.inactive-window,
    #mail-window.inactive-window {
      z-index: 2000 !important;
    }
  `;
  document.head.appendChild(windowStackFixStyle);




  // Boot sequence is invoked explicitly via window.startBoot()
  window.startBoot = function(){
    // hide initial boot-lines / progress if present
    if(bootLines) bootLines.classList.add('hidden');
    if(progress) progress.classList.add('hidden');

    // Show the boot screen container
    if(boot){
      boot.classList.remove('hidden');
      boot.setAttribute('aria-hidden','false');
    }

    if(xpStarting){
      xpStarting.classList.remove('hidden');
      xpStarting.setAttribute('aria-hidden','false');
      try{ document.body.classList.add('loading-fullscreen'); }catch(e){}
      // show the bottom-left and bottom-right boot texts with the logo
      const bootLeft = document.querySelector('.boot-copyright');
      const bootRight = document.querySelector('.boot-microsoft');
      if(bootLeft) { bootLeft.classList.remove('hidden'); bootLeft.setAttribute('aria-hidden','false'); }
      if(bootRight) { bootRight.classList.remove('hidden'); bootRight.setAttribute('aria-hidden','false'); }
    }

    // after XP screen finishes, show desktop and restore taskbar immediately
    setTimeout(finishLoadingScreen, 2600);
  };

  // Listen for the loadingScreenDone event dispatched by loadingScreen.js
  // This triggers the Windows XP boot sequence when the START button is clicked
  window.addEventListener('loadingScreenDone', () => {
    if(window.startBoot) window.startBoot();
  });

  // Fallback: if the loading screen is removed by another script or by CSS,
  // still make the website taskbar visible after the page settles.
  setTimeout(()=>{
    if(!document.body.classList.contains('loading-fullscreen')){
      forceShowTaskbar();
    }
  }, 3200);

  // Open ER window on single OR double click (browser desktop icon)
  function showPage(pageId){
    const scope = erWindow ? erWindow.querySelector('.browser-content') : document.querySelector('.browser-content');
    const pageRoot = scope || document;
    const pages = pageRoot.querySelectorAll('.page');
    pages.forEach(p=>{
      p.classList.add('hidden');
      p.style.display = 'none';
      p.style.visibility = 'hidden';
      p.style.opacity = '0';
    });

    const show = pageRoot.querySelector('#' + pageId) || document.getElementById(pageId);
    if(show){
      show.classList.remove('hidden');
      show.style.display = 'block';
      show.style.visibility = 'visible';
      show.style.opacity = '1';
    }

    if(pageId === 'page-about'){
      const tabsEl = document.getElementById('about-tabs');
      if(tabsEl){
        const defaultBtn = tabsEl.querySelector('button[data-tab="general"].is-active') || tabsEl.querySelector('button[data-tab="general"]') || tabsEl.querySelector('button[data-tab]');
        if(defaultBtn){
          tabsEl.querySelectorAll('button[data-tab]').forEach(btn=>btn.classList.remove('is-active'));
          defaultBtn.classList.add('is-active');
        }
      }
      syncAboutPane('general');
    }

    try{
      const browserContent = scope || document.querySelector('.browser-content');
      if(browserContent){
        browserContent.classList.remove('no-outer-scroll');
      }
    }catch(e){/* non-blocking */}
  }

  function syncAboutPane(tabName){
    const tabsEl = document.getElementById('about-tabs');
    const panes = document.querySelectorAll('#about-panes > [data-pane]');
    if(!tabsEl) return;

    tabsEl.querySelectorAll('button[data-tab]').forEach((btn)=>{
      btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tabName);
    });

    panes.forEach((p)=>{
      const isActive = p.getAttribute('data-pane') === tabName;
      p.classList.toggle('active', isActive);
      p.classList.toggle('hidden', !isActive);
      p.style.display = isActive ? 'block' : 'none';
      p.style.visibility = isActive ? 'visible' : 'hidden';
      p.style.opacity = isActive ? '1' : '0';
    });

    try{ const activePane = document.querySelector('#about-panes > [data-pane].active'); if(activePane) revealPaneElements(activePane); }catch(e){}
  }

  // Initialize About tabs (General / Experience / Mindset)
  function initAboutTabs(){
    const tabsEl = document.getElementById('about-tabs');
    if(!tabsEl) return;

    if(tabsEl.dataset.aboutInitialized === 'true'){
      const activeBtn = tabsEl.querySelector('button[data-tab].is-active') || tabsEl.querySelector('button[data-tab]');
      if(activeBtn) syncAboutPane(activeBtn.getAttribute('data-tab'));
      return;
    }

    tabsEl.dataset.aboutInitialized = 'true';

    tabsEl.querySelectorAll('button[data-tab]').forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        const t = btn.getAttribute('data-tab');
        syncAboutPane(t);

        const browserContent = document.querySelector('.browser-content');
        const aboutBlock = document.querySelector('#page-about .xp-about-system');

        try{
          if(browserContent && aboutBlock){
            const bcRect = browserContent.getBoundingClientRect();
            const aboutRect = aboutBlock.getBoundingClientRect();
            const scrollDelta = (aboutRect.top - bcRect.top);
            browserContent.scrollTop += Math.max(0, Math.round(scrollDelta));
          }
        }catch(e){}

        try{ syncAboutPaneHeights(); }catch(e){}
        try{
          requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
              try{ copyExperienceSizeToGeneral(); }catch(e){}
              try{ copyExperienceStylesToGeneral(); }catch(e){}
              try{ const exp = document.querySelector('#about-panes > [data-pane="experience"]'); const gen = document.querySelector('#about-panes > [data-pane="general"]'); if(exp && gen) copyComputedStyles(exp, gen); }catch(e){}
              try{ ensureExperienceHasContent(); }catch(e){}
              try{ fitErWindowToExperience(); }catch(e){}
              try{ normalizeAboutScrolling(); }catch(e){}
              try{ scheduleUpdateAboutHeights(); }catch(e){}
            });
          });
        }catch(e){}
      });
    });

    const openHomeBtn = document.getElementById('about-open-home');
    if(openHomeBtn){ openHomeBtn.addEventListener('click', (e)=>{ showPage('page-home'); }); }
    const openResumeBtn = document.getElementById('about-open-resume');
    if(openResumeBtn){ openResumeBtn.addEventListener('click', (e)=>{ openResumeInNewTab(); }); }

    const activeBtn = tabsEl.querySelector('button[data-tab].is-active') || tabsEl.querySelector('button[data-tab]');
    if(activeBtn){
      syncAboutPane(activeBtn.getAttribute('data-tab'));
    }
  }

  // Measure all about panes and set a uniform min-height equal to the tallest pane
  function syncAboutPaneHeights(){
    const panes = document.querySelectorAll('#about-panes > [data-pane]');
    if(!panes || panes.length===0) return;
    let max = 0;
    panes.forEach(p=>{
      const isHidden = p.classList.contains('hidden') || getComputedStyle(p).display === 'none';
      let height;
      if(isHidden){
        const prev = { display: p.style.display, visibility: p.style.visibility, position: p.style.position };
        p.style.position = 'absolute'; p.style.visibility = 'hidden'; p.style.display = 'block';
        height = p.scrollHeight;
        p.style.display = prev.display; p.style.visibility = prev.visibility; p.style.position = prev.position;
      } else {
        height = p.scrollHeight;
      }
      if(height > max) max = height;
    });
    // apply a little padding so content fits comfortably
    const pad = 12;
    panes.forEach(p=>{ p.style.minHeight = (max + pad) + 'px'; });
  }

  // Copy the Experience pane's computed height and apply it to the General pane
  function copyExperienceSizeToGeneral(){
    const exp = document.querySelector('#about-panes > [data-pane="experience"]');
    const panel = document.querySelector('#about-panes');
    const gen = document.querySelector('#about-panes > [data-pane="general"]');
    if(!exp || !gen || !panel) return;
    // measure full height of the experience pane even if hidden
    const wasHidden = exp.classList.contains('hidden') || getComputedStyle(exp).display === 'none';
    let measuredHeight;
    if(wasHidden){
      const prev = { display: exp.style.display, visibility: exp.style.visibility, position: exp.style.position };
      exp.style.position = 'absolute'; exp.style.visibility = 'hidden'; exp.style.display = 'block';
      measuredHeight = exp.getBoundingClientRect().height;
      exp.style.display = prev.display; exp.style.visibility = prev.visibility; exp.style.position = prev.position;
    } else {
      measuredHeight = exp.getBoundingClientRect().height;
    }
    // Do not set any inner scrolling; let the outer `.browser-content` handle overflow.
  }

  // Normalize About scrolling: remove any inline height/minHeight on container and panes
  // and ensure inner panes handle overflow. Call this after tab switches.
  function normalizeAboutScrolling(){
    try{
      const panel = document.querySelector('#about-panes');
      if(panel){
        // remove any inline height set previously
        panel.style.removeProperty('height');
        panel.style.removeProperty('min-height');
      }
      const panes = document.querySelectorAll('#about-panes > [data-pane]');
      panes.forEach(p=>{
        // preserve min-height when explicitly marked (copied from Experience)
        if(!p.classList.contains('preserve-min')) p.style.removeProperty('min-height');
        // ensure inner panes do NOT create their own scrollbars
        p.style.removeProperty('overflow');
        p.style.removeProperty('overflow-y');
        p.style.removeProperty('height');
      });
      // after DOM changes, force a reflow so scrollbars update reliably
      void document.body.offsetHeight;
    }catch(e){/* non-blocking */}
  }

  // Calculate and set the xp-system-panel height so the inner panes can scroll
  // while the outer window remains fixed. This computes available space inside
  // the `.browser-content` area and sizes the panel to fit exactly.
  function updateAboutHeights(){
    try{
      const erWindow = document.getElementById('er-window');
      const browserContent = erWindow ? erWindow.querySelector('.browser-content') : document.querySelector('.browser-content');
      const xpAbout = document.querySelector('#page-about .xp-about-system');
      const panel = document.querySelector('#page-about .xp-system-panel');
      if(!browserContent || !xpAbout || !panel) return;
      const bcRect = browserContent.getBoundingClientRect();
      const aboutRect = xpAbout.getBoundingClientRect();
      // offset from top of browserContent to top of about block
      const offsetTop = Math.max(0, aboutRect.top - bcRect.top);
      // leave a small bottom gap so shadows/padding don't clip
      const bottomGap = 12;
      const available = Math.max(180, Math.floor(bcRect.height - offsetTop - bottomGap));
      // Do not set fixed heights on the panel or panes; allow the content to flow
      // so the outer `.browser-content` scrollbar controls the About section.
      panel.style.removeProperty('height');
      panel.style.removeProperty('max-height');
      const panes = document.querySelectorAll('#about-panes > [data-pane]');
      panes.forEach(p=>{
        p.style.removeProperty('height');
        p.style.removeProperty('overflow');
        p.style.removeProperty('overflow-y');
      });
      // ensure the outer browser-content shows scrollbars for About
      const bc = document.querySelector('.browser-content'); if(bc) bc.classList.remove('no-outer-scroll');
    }catch(e){/* non-blocking */}
  }

  // Debounced resize handler for window changes
  function debounce(fn, wait){ let t; return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); }; }
  window.addEventListener('resize', debounce(()=>{ try{ updateAboutHeights(); normalizeAboutScrolling(); }catch(e){} }, 120));

  // Schedule an about height update after the next paint(s) so layout changes settle
  function scheduleUpdateAboutHeights(){
    try{
      requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ try{ updateAboutHeights(); }catch(e){} }); });
    }catch(e){ try{ setTimeout(updateAboutHeights, 50); }catch(e){} }
  }

  // Copy selected computed styles from Experience pane to General pane so design/spacing match
  function copyExperienceStylesToGeneral(){
    const exp = document.querySelector('#about-panes > [data-pane="experience"]');
    const gen = document.querySelector('#about-panes > [data-pane="general"]');
    if(!exp || !gen) return;
    const cs = getComputedStyle(exp);
    const props = ['padding','background','border','box-shadow','border-radius','background-color','background-image','background-size'];
    props.forEach(p=>{
      try{ const v = cs.getPropertyValue(p); if(v) gen.style.setProperty(p, v); }catch(e){}
    });
    // measure experience full height (even if hidden) and apply as min-height to general
    try{
      const wasHidden = exp.classList.contains('hidden') || getComputedStyle(exp).display === 'none';
      let measured = 0;
      if(wasHidden){
        const prev = { display: exp.style.display, visibility: exp.style.visibility, position: exp.style.position };
        exp.style.position = 'absolute'; exp.style.visibility = 'hidden'; exp.style.display = 'block';
        measured = Math.ceil(exp.scrollHeight);
        exp.style.display = prev.display; exp.style.visibility = prev.visibility; exp.style.position = prev.position;
      } else {
        measured = Math.ceil(exp.scrollHeight);
      }
      if(measured > 0) gen.style.minHeight = measured + 'px';
    }catch(e){}
    try{ gen.style.minWidth = cs.getPropertyValue('min-width') || gen.style.minWidth; }catch(e){}
    // mark general pane so its computed min-height is preserved by normalization
    try{ gen.classList.add('preserve-min'); }catch(e){}
  }

  // Copy most computed styles from source to target for a closer visual match
  function copyComputedStyles(source, target){
    if(!source || !target) return;
    const cs = getComputedStyle(source);
    const allowed = [
      'padding','padding-top','padding-bottom','padding-left','padding-right',
      'border','border-top','border-bottom','border-left','border-right',
      'border-width','border-style','border-color',
      'box-shadow','background','background-color','background-image','background-size',
      'min-height','min-width','max-width','max-height','box-sizing','border-radius',
      'gap','grid-template-columns','grid-template-rows','align-items','justify-content',
      'font-size','line-height','color'
    ];
    allowed.forEach(prop=>{
      try{ const val = cs.getPropertyValue(prop); const pri = cs.getPropertyPriority(prop); if(val) target.style.setProperty(prop, val, pri); }catch(e){}
    });
  }

  // Ensure Experience pane has visible profile/specs content; if empty, clone from General
  function ensureExperienceHasContent(){
    try{
      const exp = document.querySelector('#about-panes > [data-pane="experience"]');
      const gen = document.querySelector('#about-panes > [data-pane="general"]');
      if(!exp || !gen) return;
      const text = (exp.innerText || '').trim();
      if(text && text.length > 10) return; // already has content
      // Only insert if missing
      if(!exp.querySelector('.xp-system-top')){
        const genTop = gen.querySelector('.xp-system-top');
        if(genTop) exp.insertBefore(genTop.cloneNode(true), exp.firstChild);
      }
      if(!exp.querySelector('.xp-system-specs')){
        const genSpecs = gen.querySelector('.xp-system-specs');
        if(genSpecs) exp.appendChild(genSpecs.cloneNode(true));
      }
      // If still empty (some CSS may hide nodes), try stronger populate
      try{ populateExperienceFallback(exp, gen); }catch(e){}
    }catch(e){/* non-blocking */}
  }

  // Strong fallback: build Experience content from General clones or template and insert as innerHTML
  function populateExperienceFallback(exp, gen){
    if(!exp) return;
    const currentText = (exp.innerText || '').trim();
    if(currentText && currentText.length > 10) return;
    let pieces = [];
    try{
      // prefer cloning from General to keep source of truth
      if(gen){
        const top = gen.querySelector('.xp-system-top');
        const specs = gen.querySelector('.xp-system-specs');
        if(top) pieces.push(top.outerHTML);
        if(specs) pieces.push(specs.outerHTML);
      }
    }catch(e){}
    // include additional Experience-only sections if present in DOM (background, experience list)
    try{
      const bg = document.querySelector('.xp-background-details'); if(bg) pieces.push(bg.outerHTML);
      const expList = document.querySelector('.xp-system-experience'); if(expList) pieces.push(expList.outerHTML);
    }catch(e){}
    // fallback template (minimal) if nothing found
    if(pieces.length === 0){
      pieces.push('<div class="xp-system-note"><strong>Experience</strong><p>AI Research Engineer Intern @ Asan Medical Center</p><p>Sergeant - 8th U.S. Army (2ID KATUSA)</p></div>');
    }
    // inject into pane
    exp.innerHTML = pieces.join('\n');
    // ensure pane styles make it visible
    exp.classList.remove('hidden'); exp.style.display = 'block'; exp.style.visibility = 'visible'; exp.style.opacity = '1';
  }

  // Measure the Experience pane and adjust the outer ER window size so the chrome (titlebar) doesn't overlap content
  function fitErWindowToExperience(){
    if(!erWindow) return;
    const exp = document.querySelector('#about-panes > [data-pane="experience"]');
    if(!exp) return;
    const prev = { display: exp.style.display, visibility: exp.style.visibility, position: exp.style.position };
    // ensure we can measure even if hidden
    if(getComputedStyle(exp).display === 'none'){
      exp.style.position = 'absolute'; exp.style.visibility = 'hidden'; exp.style.display = 'block';
    }
    const expRect = exp.getBoundingClientRect();
    // measure chrome heights
    const titlebar = document.querySelector('#er-window .titlebar');
    const menuBar = document.querySelector('#er-window .menu-bar');
    const tabBar = document.querySelector('#er-window .tab-bar');
    const navbar = document.querySelector('#er-window .navbar');
    let chromeH = 0;
    [titlebar, menuBar, tabBar, navbar].forEach(el=>{ if(el) chromeH += el.getBoundingClientRect().height; });
    // add some padding/border allowances
    const extra = 36;
    const targetHeight = Math.ceil(expRect.height + chromeH + extra);
    // Do NOT change the outer ER window size; instead, update the internal panel heights
    // so the content scrolls inside the fixed window. This prevents outer scrollbars.
    try{ updateAboutHeights(); }catch(e){}
    // restore exp styles
    exp.style.display = prev.display; exp.style.visibility = prev.visibility; exp.style.position = prev.position;
  }

    if(erFolder){
    const openAbout = ()=>{
      try{
        if(erWindow){
          // If visible, bring to front and restore if minimized
          if(!erWindow.classList.contains('hidden')){
            if(erIsMinimized) restoreERWindow();
            bringWindowToFront(erWindow);
            setTimeout(()=>bringWindowToFront(erWindow), 0);
            setTimeout(()=>bringWindowToFront(erWindow), 80);
            erWindow.focus && erWindow.focus();
            return;
          }
        }
      }catch(e){}
      openWindow();
      showPage('page-about');
      initAboutTabs();
      try{ requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ try{ copyExperienceSizeToGeneral(); }catch(e){} try{ copyExperienceStylesToGeneral(); }catch(e){} try{ const exp = document.querySelector('#about-panes > [data-pane="experience"]'); const gen = document.querySelector('#about-panes > [data-pane="general"]'); if(exp && gen) copyComputedStyles(exp, gen); }catch(e){} try{ ensureExperienceHasContent(); }catch(e){} try{ fitErWindowToExperience(); }catch(e){} try{ normalizeAboutScrolling(); }catch(e){} try{ scheduleUpdateAboutHeights(); }catch(e){} }); }); }catch(e){}
    };
    erFolder.addEventListener('click', openAbout);
    erFolder.addEventListener('dblclick', openAbout);
  }

  // Ensure about tabs are wired on load so clicking Experience works even
  // if the About page was not opened via the desktop icon first.
  try{ initAboutTabs(); scheduleUpdateAboutHeights(); }catch(e){}
  try{ initProjectTabs(); }catch(e){}
  // Ensure the project detail panel is hidden on initial load. Some reveal helpers
  // iterate descendants and may have exposed the panel unintentionally.
  try{
    const projectWin = document.getElementById('project-window');
    const _panel = projectWin ? projectWin.querySelector('#project-detail-panel') : document.getElementById('project-detail-panel');
    if(_panel){
      _panel.setAttribute('aria-hidden','true');
      _panel.style.maxHeight = '0px';
      _panel.style.visibility = 'hidden';
      _panel.style.transition = 'none';
    }
  }catch(e){}
  // Also proactively apply Experience -> General styles on load so General matches immediately
  try{
    requestAnimationFrame(()=>{ requestAnimationFrame(()=>{
      try{ copyExperienceSizeToGeneral(); }catch(e){}
      try{ copyExperienceStylesToGeneral(); }catch(e){}
      try{ const exp = document.querySelector('#about-panes > [data-pane="experience"]'); const gen = document.querySelector('#about-panes > [data-pane="general"]'); if(exp && gen) copyComputedStyles(exp, gen); }catch(e){}
      try{ normalizeAboutScrolling(); }catch(e){}
    }); });
  }catch(e){}

  // Minesweeper window icon/controls
  const minesweeperIcon = document.getElementById('minesweeper-desktop');
  const minesweeperWin = document.getElementById('minesweeper-window');
  const minesweeperMinBtn = document.getElementById('minesweeper-minimize');
  const minesweeperMaxBtn = document.getElementById('minesweeper-maximize');
  const minesweeperCloseBtn = document.getElementById('minesweeper-close');
  let minesweeperIsMinimized = false;
  let minesweeperIsMaximized = false;
  let minesweeperRestoreRect = null;
  let minesweeperPrankLock = false;

  function setMinesweeperPrankLock(locked){
    minesweeperPrankLock = Boolean(locked);
    if(!minesweeperWin) return;

    minesweeperWin.classList.toggle('prank-locked', minesweeperPrankLock);

    [minesweeperMinBtn, minesweeperMaxBtn, minesweeperCloseBtn].forEach((btn)=>{
      if(!btn) return;
      btn.setAttribute('aria-disabled', String(minesweeperPrankLock));
      btn.style.setProperty('pointer-events', minesweeperPrankLock ? 'none' : 'auto', 'important');
      btn.style.setProperty('cursor', minesweeperPrankLock ? 'not-allowed' : 'pointer', 'important');
      btn.style.setProperty('opacity', minesweeperPrankLock ? '0.55' : '1', 'important');
      btn.style.setProperty('filter', minesweeperPrankLock ? 'grayscale(0.4) brightness(0.8)' : 'none', 'important');
    });
  }

  function syncMinesweeperMaxButton(){
    if(!minesweeperMaxBtn) return;
    minesweeperMaxBtn.innerHTML = minesweeperIsMaximized ? '&#9638;' : '&#9633;';
  }

  function setMinesweeperRect(rect){
    if(!minesweeperWin || !rect) return;
    if(rect.left != null) minesweeperWin.style.setProperty('left', `${Math.round(rect.left)}px`, 'important');
    if(rect.top != null) minesweeperWin.style.setProperty('top', `${Math.round(rect.top)}px`, 'important');
    if(rect.width != null) minesweeperWin.style.setProperty('width', `${Math.round(rect.width)}px`, 'important');
    if(rect.height != null) minesweeperWin.style.setProperty('height', `${Math.round(rect.height)}px`, 'important');
  }

  function clearMinesweeperRect(){
    if(!minesweeperWin) return;
    minesweeperWin.style.removeProperty('left');
    minesweeperWin.style.removeProperty('top');
    minesweeperWin.style.removeProperty('width');
    minesweeperWin.style.removeProperty('height');
  }

  function openMinesweeperWindow(){
    if(!minesweeperWin) return;
    minesweeperIsMinimized = false;
    minesweeperWin.classList.remove('hidden');
    bringWindowToFront(minesweeperWin);
    syncMinesweeperMaxButton();
  }

  function closeMinesweeperWindow(){
    if(!minesweeperWin || minesweeperPrankLock) return;
    minesweeperIsMinimized = false;
    minesweeperIsMaximized = false;
    minesweeperWin.classList.remove('maximized');
    minesweeperWin.classList.add('hidden');
    clearMinesweeperRect();
    minesweeperRestoreRect = null;
    syncMinesweeperMaxButton();
  }

  function minimizeMinesweeperWindow(){
    if(!minesweeperWin || minesweeperWin.classList.contains('hidden') || minesweeperPrankLock) return;
    minesweeperIsMinimized = true;
    minesweeperWin.classList.add('hidden');
    syncMinesweeperMaxButton();
  }

  function restoreMinesweeperWindow(){
    if(!minesweeperWin) return;
    minesweeperIsMinimized = false;
    minesweeperWin.classList.remove('hidden');
    bringWindowToFront(minesweeperWin);
    syncMinesweeperMaxButton();
  }

  function toggleMinesweeperMaximize(){
    if(!minesweeperWin || minesweeperPrankLock) return;
    if(minesweeperWin.classList.contains('hidden')){
      if(minesweeperIsMinimized) restoreMinesweeperWindow();
      else openMinesweeperWindow();
    }

    if(!minesweeperIsMaximized){
      const rect = minesweeperWin.getBoundingClientRect();
      minesweeperRestoreRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      minesweeperWin.classList.add('maximized');
      minesweeperWin.style.setProperty('left', '8px', 'important');
      minesweeperWin.style.setProperty('top', '8px', 'important');
      minesweeperWin.style.setProperty('width', 'calc(100% - 16px)', 'important');
      minesweeperWin.style.setProperty('height', 'calc(100% - 56px)', 'important');
      minesweeperIsMaximized = true;
    } else {
      minesweeperWin.classList.remove('maximized');
      if(minesweeperRestoreRect){
        minesweeperWin.style.setProperty('left', `${Math.round(minesweeperRestoreRect.left)}px`, 'important');
        minesweeperWin.style.setProperty('top', `${Math.round(minesweeperRestoreRect.top)}px`, 'important');
        minesweeperWin.style.setProperty('width', `${Math.round(minesweeperRestoreRect.width)}px`, 'important');
        minesweeperWin.style.setProperty('height', `${Math.round(minesweeperRestoreRect.height)}px`, 'important');
      }
      minesweeperIsMaximized = false;
    }
    syncMinesweeperMaxButton();
  }

  window.addEventListener('message', (event)=>{
    if(event.data && event.data.type === 'minesweeper-prank-state'){
      setMinesweeperPrankLock(Boolean(event.data.locked));
    }
  });

  setMinesweeperPrankLock(false);

  // Music player icon open/close handling
  const musicIcon = document.getElementById('music-player');
  const musicWin = document.getElementById('music-player-window');
  const wmpAudio = document.getElementById('wmp-audio');
  const wmpVideo = document.getElementById('wmpVideo');
  const wmpPlay = document.getElementById('wmp-play');
  const wmpPlayIcon = document.getElementById('wmp-play-icon');
  const wmpStop = document.getElementById('wmp-stop');
  const wmpRewind = document.getElementById('wmp-rewind');
  const wmpForward = document.getElementById('wmp-forward');
  const wmpVol = document.getElementById('wmp-volume-slider');
  const wmpSeek = document.getElementById('wmp-seek-bar');

  // WordPad icon/window/taskbar wiring
  const wordpadIcon = document.getElementById('wordpad');
  const wordpadWin = document.getElementById('wordpad-window');
  const taskWordpad = document.getElementById('task-wordpad');
  const wordpadMinBtn = document.getElementById('wordpad-minimize');
  const wordpadMaxBtn = document.getElementById('wordpad-maximize');
  const wordpadCloseBtn = document.getElementById('wordpad-close');
  let wordpadIsMinimized = false;
  let wordpadIsMaximized = false;
  let wordpadRestoreRect = null;

  function setWordpadRect(rect){
    if(!wordpadWin || !rect) return;
    if(rect.left != null) wordpadWin.style.setProperty('left', `${Math.round(rect.left)}px`, 'important');
    if(rect.top != null) wordpadWin.style.setProperty('top', `${Math.round(rect.top)}px`, 'important');
    if(rect.width != null) wordpadWin.style.setProperty('width', `${Math.round(rect.width)}px`, 'important');
    if(rect.height != null) wordpadWin.style.setProperty('height', `${Math.round(rect.height)}px`, 'important');
  }

  function clearWordpadRect(){
    if(!wordpadWin) return;
    wordpadWin.style.removeProperty('left');
    wordpadWin.style.removeProperty('top');
    wordpadWin.style.removeProperty('width');
    wordpadWin.style.removeProperty('height');
  }

  function bringWindowToFront(winEl){
    if(!winEl) return;

    // HARD FRONT FIX:
    // The selected window gets a maximum z-index and every other window is lowered.
    // This makes About Me and My Projects switch front/back correctly when clicked.
    const allWindows = document.querySelectorAll('#er-window, #project-window, #wordpad-window, #music-player-window, .window');

    allWindows.forEach(w=>{
      try{
        if(!w || w.classList.contains('hidden')) return;

        if(w === winEl){
          w.classList.add('active-window');
          w.classList.remove('inactive-window');
          w.style.setProperty('z-index', '2147483000', 'important');
          w.style.setProperty('position', 'absolute', 'important');
        } else {
          w.classList.remove('active-window');
          w.classList.add('inactive-window');
          w.style.setProperty('z-index', '2000', 'important');
        }
      }catch(e){}
    });

    zIndexCounter = 2147483000;
  }

  function syncWordpadMaxButton(){
    if(!wordpadMaxBtn) return;
    // XP-like: square when restorable state is available, overlapping boxes when maximized
    wordpadMaxBtn.innerHTML = wordpadIsMaximized ? '&#9638;' : '&#9633;';
  }

  function syncWordpadFrameToER(){
    if(!wordpadWin || !erWindow) return;
    const erRect = erWindow.getBoundingClientRect();
    const erStyle = getComputedStyle(erWindow);
    const erIsVisible = !erWindow.classList.contains('hidden') && erRect.width > 0 && erRect.height > 0;

    // Copy About Me window frame and dimensions to WordPad.
    if(erIsVisible){
      setWordpadRect({ width: erRect.width, height: erRect.height });
      wordpadWin.style.border = erStyle.border;
      wordpadWin.style.borderRadius = erStyle.borderRadius;
      wordpadWin.style.boxShadow = erStyle.boxShadow;
    } else {
      // Fallback to a sensible standalone popup size when ER is closed.
      setWordpadRect({ left: 140, top: 100, width: 900, height: 600 });
    }

    if(!wordpadIsMaximized){
      if(erIsVisible){
        const erLeft = parseFloat(erWindow.style.left) || erRect.left;
        const erTop = parseFloat(erWindow.style.top) || erRect.top;
        setWordpadRect({ left: erLeft, top: erTop });
      }
    }
  }

  // Resume / WordPad viewer controls
  const resumeZoomBtn = document.getElementById('resume-zoom');
  const resumeSaveBtn = document.getElementById('resume-save');
  const resumePrintBtn = document.getElementById('resume-print');
  const resumePdf = document.getElementById('resume-pdf');
  const resumeViewer = document.getElementById('resume-viewer');
  let resumeZoomed = false;
  // Scaling behavior: fit-to-view by default; toggle manual zoom when clicking the Zoom button.
  const RESUME_PX = { w: 794, h: 1123 };
  let manualZoom = false;
  let manualScale = 1.6; // scale when manual zoom is toggled

  function updateResumeScale(){
    if(!resumeViewer) return;
    const paper = resumeViewer.querySelector('.resume-page');
    if(!paper) return;
    // available viewport inside the viewer (account for padding)
    const availableW = Math.max(0, resumeViewer.clientWidth);
    const availableH = Math.max(0, resumeViewer.clientHeight);
    const fitScale = Math.min(1, availableW / RESUME_PX.w, availableH / RESUME_PX.h) || 1;
    if(manualZoom){
      // Keep manual zoom capped so the page still fits in the popup with no scrollbars.
      paper.style.setProperty('--resume-scale', Math.min(manualScale, fitScale));
      resumeViewer.classList.add('resume-viewer--manual-zoom');
      return;
    }
    // Fit-to-view scale (don't exceed 1 to preserve natural size)
    paper.style.setProperty('--resume-scale', fitScale);
    resumeViewer.classList.remove('resume-viewer--manual-zoom');
  }

  if(resumeZoomBtn){
    resumeZoomBtn.addEventListener('click', ()=>{
      manualZoom = !manualZoom;
      // When toggling manual zoom off, recalc fit scale
      updateResumeScale();
    });
  }

  // Recalculate on resize and when WordPad window is opened
  window.addEventListener('resize', ()=>{ updateResumeScale(); });
  if(resumeSaveBtn){
    resumeSaveBtn.addEventListener('click',()=>{
      // trigger download of resume PDF (read from data or src)
      const url = resumePdf ? (resumePdf.getAttribute('data') || resumePdf.getAttribute('src') || '/assets/PDF/saligao-jessa-resume.pdf ') : '/assets/PDF/saligao-jessa-resume.pdf';
      const cleanUrl = url.split('#')[0];
      const a = document.createElement('a'); a.href = cleanUrl; a.download = 'saligao-jessa-resume.pdf'; document.body.appendChild(a); a.click(); a.remove();
    });
  }
  if(resumePrintBtn){
    resumePrintBtn.addEventListener('click',()=>{
      // open the PDF in a new tab and call print (best-effort)
      const url = resumePdf ? (resumePdf.getAttribute('data') || resumePdf.getAttribute('src') || '/assets/PDF/saligao-jessa-resume.pdf') : '/assets/PDF/saligao-jessa-resume.pdf';
      const w = window.open(url.split('#')[0], '_blank');
      if(w){ w.focus(); try{ w.print(); }catch(e){} }
    });
  }

  // When the WordPad window opens, ensure scale is recalculated (if openWordpad exists it'll call this)
  // Try an initial call to set the viewer scale on load
  setTimeout(()=>{ updateResumeScale(); }, 120);

  function openMusicPlayer(){
    if(!musicWin) return;
    musicWin.classList.remove('hidden');
    // start audio paused until user presses play
    if(wmpAudio) wmpAudio.pause();
    if(wmpVideo) wmpVideo.pause();
    // update taskbar state to show music task and record ordering
    addToTaskOrder('task-music');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }

  function syncErMaxButton(){
    if(!erMaxBtn) return;
    erMaxBtn.innerHTML = erIsMaximized ? '&#9638;' : '&#9633;';
  }

  function closeERWindow(){
    if(!erWindow) return;
    erIsMinimized = false;
    erIsMaximized = false;
    erWindow.classList.remove('maximized');
    erWindow.classList.add('hidden');
    erWindow.style.removeProperty('left');
    erWindow.style.removeProperty('top');
    erWindow.style.removeProperty('width');
    erWindow.style.removeProperty('height');
    erRestoreRect = null;
    syncErMaxButton();
    removeFromTaskOrder('task-er');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
    function revealPaneElements(pane){
      try{
        console.log('revealPaneElements:', pane.getAttribute('data-pane'), 'children=', pane.children.length);
        pane.classList.remove('hidden');
        pane.style.display = 'block';
        pane.style.visibility = 'visible';
        pane.style.opacity = '1';
        pane.style.transform = 'none';
        // Force-reveal any descendants that might be hidden via classes or CSS
        const descendants = pane.querySelectorAll('*');
        descendants.forEach(el=>{
          try{
            // clear hiding styles and force visible if computed style says hidden
            el.classList.remove('hidden');
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.transform = 'none';
            // ensure element participates in layout
            el.style.removeProperty('clip');
            el.style.removeProperty('clip-path');
            // fix display if computed is none
            const cs = getComputedStyle(el);
            if(cs.display === 'none') el.style.display = 'block';
          }catch(e){}
        });
        // scroll pane to top
        try{ pane.scrollTop = 0; }catch(e){}
        // log resulting computed style for diagnosis
        const csPane = getComputedStyle(pane);
        console.log('pane computed:', { display: csPane.display, visibility: csPane.visibility, opacity: csPane.opacity, height: pane.getBoundingClientRect().height, scrollHeight: pane.scrollHeight });
      }catch(e){ console.error(e); }
    }
  }

  function minimizeERWindow(){
    if(!erWindow || erWindow.classList.contains('hidden')) return;
    erIsMinimized = true;
    erWindow.classList.add('hidden');
    addToTaskOrder('task-er');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }

  function restoreERWindow(){
    if(!erWindow) return;
    erIsMinimized = false;
    erWindow.classList.remove('hidden');
    bringWindowToFront(erWindow);
    syncErMaxButton();
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }

  function toggleERMaximize(){
    if(!erWindow) return;
    if(erWindow.classList.contains('hidden')){
      if(erIsMinimized) restoreERWindow();
      else openWindow();
    }

    if(!erIsMaximized){
      const rect = erWindow.getBoundingClientRect();
      erRestoreRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      erWindow.classList.add('maximized');
      erWindow.style.setProperty('left', '8px', 'important');
      erWindow.style.setProperty('top', '8px', 'important');
      erWindow.style.setProperty('width', 'calc(100% - 16px)', 'important');
      erWindow.style.setProperty('height', 'calc(100% - 56px)', 'important');
      erIsMaximized = true;
    } else {
      erWindow.classList.remove('maximized');
      if(erRestoreRect){
        erWindow.style.setProperty('left', `${Math.round(erRestoreRect.left)}px`, 'important');
        erWindow.style.setProperty('top', `${Math.round(erRestoreRect.top)}px`, 'important');
        erWindow.style.setProperty('width', `${Math.round(erRestoreRect.width)}px`, 'important');
        erWindow.style.setProperty('height', `${Math.round(erRestoreRect.height)}px`, 'important');
      }
      erIsMaximized = false;
    }
    syncErMaxButton();
  }

  function closeMusicPlayer(){
    if(!musicWin) return;
    musicWin.classList.add('hidden');
    if(wmpAudio){ wmpAudio.pause(); wmpAudio.currentTime = 0; }
    if(wmpVideo){ wmpVideo.pause(); wmpVideo.currentTime = 0; }
    if(wmpPlayIcon) wmpPlayIcon.innerText = '▶';
    removeFromTaskOrder('task-music');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }

  if(musicIcon){
    // Open music player on single OR double click
    musicIcon.addEventListener('click', openMusicPlayer);
    musicIcon.addEventListener('dblclick', openMusicPlayer);
  }

  // WordPad open/close handling
  function openWordpad(){
    if(!wordpadWin) return;
    const isFirstOpen = wordpadWin.dataset.initialized !== 'true';
    wordpadIsMinimized = false;
    wordpadWin.classList.remove('hidden');
    try{
      wordpadWin.classList.add('wordpad-firefox-window');
      wordpadWin.style.position = 'absolute';
      if(isFirstOpen){
        document.body.appendChild(wordpadWin);
        syncWordpadFrameToER();
        wordpadWin.dataset.initialized = 'true';
      }
    }catch(e){}
    bringWindowToFront(wordpadWin);
    // do not auto-maximize; keep window size consistent with other app windows
    addToTaskOrder('task-wordpad');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
    syncWordpadMaxButton();
    // ensure resume scale recalculates after opening
    try{ setTimeout(()=>{ if(typeof updateResumeScale === 'function') updateResumeScale(); }, 80); }catch(e){}
  }
  function closeWordpad(){
    if(!wordpadWin) return;
    wordpadIsMinimized = false;
    wordpadIsMaximized = false;
    wordpadWin.classList.remove('maximized');
    wordpadWin.classList.add('hidden');
    clearWordpadRect();
    wordpadWin.dataset.initialized = '';
    wordpadRestoreRect = null;
    syncWordpadMaxButton();
    removeFromTaskOrder('task-wordpad');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }

  function restoreWordpad(){
    if(!wordpadWin) return;
    wordpadIsMinimized = false;
    wordpadWin.classList.remove('hidden');
    bringWindowToFront(wordpadWin);
    syncWordpadMaxButton();
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
    try{ setTimeout(()=>{ if(typeof updateResumeScale === 'function') updateResumeScale(); }, 80); }catch(e){}
  }

  function minimizeWordpad(){
    if(!wordpadWin || wordpadWin.classList.contains('hidden')) return;
    wordpadIsMinimized = true;
    wordpadWin.classList.add('hidden');
    addToTaskOrder('task-wordpad');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }

  function toggleWordpadMaximize(){
    if(!wordpadWin) return;
    if(wordpadWin.classList.contains('hidden')){
      if(wordpadIsMinimized) restoreWordpad();
      else openWordpad();
    }

    if(!wordpadIsMaximized){
      const rect = wordpadWin.getBoundingClientRect();
      wordpadRestoreRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      wordpadWin.classList.add('maximized');
      wordpadIsMaximized = true;
    } else {
      wordpadWin.classList.remove('maximized');
      if(wordpadRestoreRect){
        setWordpadRect(wordpadRestoreRect);
      }
      wordpadIsMaximized = false;
    }

    syncWordpadMaxButton();

    try{ setTimeout(()=>{ if(typeof updateResumeScale === 'function') updateResumeScale(); }, 80); }catch(e){}
  }

  function openResumeInNewTab(){
    // Backwards-compatible: open resume in a new tab if requested.
    const url = (resumePdf && (resumePdf.getAttribute('data') || resumePdf.getAttribute('src'))) || '/assets/PDF/saligao-jessa-resume.pdf';
    try{ const w = window.open(url.split('#')[0], '_blank'); if(w) w.focus(); }catch(e){ window.location.href = url.split('#')[0]; }
  }

  // Show the resume inside the ER browser window (no separate WordPad window)
  function showResumePage(){
    try{ openWindow(); }catch(e){}
    // hide ER browser pages then reveal the resume page
    const erBrowserContent = erWindow ? erWindow.querySelector('.browser-content') : document;
    erBrowserContent.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
    const show = erBrowserContent.querySelector('#page-resume') || document.getElementById('page-resume');
    if(show) show.classList.remove('hidden');
    // reflect active nav tab state
    try{ tabs.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active')); const rt = document.querySelector('#nav-tabs [data-tab="resume"]'); if(rt) rt.classList.add('active'); }catch(e){}
  }

  if(wordpadIcon){ wordpadIcon.addEventListener('click', openResumeInNewTab); wordpadIcon.addEventListener('dblclick', openResumeInNewTab); }
  if(wordpadCloseBtn) wordpadCloseBtn.addEventListener('click', closeWordpad);
  if(wordpadMinBtn) wordpadMinBtn.addEventListener('click', minimizeWordpad);
  if(wordpadMaxBtn) wordpadMaxBtn.addEventListener('click', toggleWordpadMaximize);
  const wordpadTitlebar = document.querySelector('#wordpad-window .titlebar');
  if(wordpadTitlebar){
    wordpadTitlebar.addEventListener('dblclick', (e)=>{
      if(e.target.closest('.win-btn')) return;
      toggleWordpadMaximize();
    });
  }

  // Sound button toggle (on/off)
  const soundBtn = document.getElementById('sound-btn');
  if(soundBtn){
    // initialize from localStorage
    const saved = window.localStorage.getItem('soundEnabled');
    const enabled = saved === null ? true : saved === 'true';
    setSoundState(enabled, false);

    soundBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const isOn = soundBtn.classList.contains('active');
      setSoundState(!isOn, true);
    });
  }

  // Minesweeper desktop shortcut opens a native XP-style window
  if(minesweeperIcon){
    minesweeperIcon.addEventListener('click', openMinesweeperWindow);
    minesweeperIcon.addEventListener('dblclick', openMinesweeperWindow);
  }
  if(minesweeperMinBtn) minesweeperMinBtn.addEventListener('click', minimizeMinesweeperWindow);
  if(minesweeperMaxBtn) minesweeperMaxBtn.addEventListener('click', toggleMinesweeperMaximize);
  if(minesweeperCloseBtn) minesweeperCloseBtn.addEventListener('click', closeMinesweeperWindow);
  const minesweeperTitlebar = document.querySelector('#minesweeper-window .titlebar');
  if(minesweeperTitlebar){
    minesweeperTitlebar.addEventListener('dblclick', (e)=>{
      if(e.target.closest('.win-btn')) return;
      bringWindowToFront(minesweeperWin);
      toggleMinesweeperMaximize();
    });
  }

  function setSoundState(on, persist){
    const btn = document.getElementById('sound-btn');
    if(!btn) return;
    const icon = btn.querySelector('.tray-icon');
    const label = btn.querySelector('.tray-label');
    if(on){
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      if(label) label.textContent = 'SoundOn';
      if(icon) icon.style.filter = 'none';
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed','false');
      if(label) label.textContent = 'SoundOff';
      if(icon) icon.style.filter = 'grayscale(100%) brightness(.8)';
    }
    // Control the ambient sound audio element if present
    try{
      const soundAudio = document.getElementById('sound-audio');
      if(soundAudio){
        if(on){
          soundAudio.loop = true;
          const playPromise = soundAudio.play();
          if(playPromise && typeof playPromise.catch === 'function') playPromise.catch(()=>{});
        } else {
          soundAudio.pause();
          try{ soundAudio.currentTime = 0; }catch(e){}
        }
      }
    }catch(e){}

    if(persist) try{ window.localStorage.setItem('soundEnabled', on ? 'true' : 'false'); }catch(e){}
  }

  // make WordPad window draggable like the others
  makeDraggable(wordpadWin, '.titlebar');
  makeDraggable(wordpadWin, '.title-bar');
  makeDraggable(minesweeperWin, '.titlebar');

  // Ensure clicks on the Resume icon open the resume in a new browser tab (delegation fallback)
  document.addEventListener('click', (e) => {
    const ic = e.target.closest('#wordpad');
    if(ic) openResumeInNewTab();
  });
  document.addEventListener('dblclick', (e) => {
    const ic = e.target.closest('#wordpad');
    if(ic) openResumeInNewTab();
  });

  // Wire player controls if present
  if(wmpPlay){
    wmpPlay.addEventListener('click',()=>{
      if(!wmpAudio) return;
      if(wmpAudio.paused){ wmpAudio.play(); if(wmpVideo) wmpVideo.play(); wmpPlayIcon.innerText='⏸'; }
      else { wmpAudio.pause(); if(wmpVideo) wmpVideo.pause(); wmpPlayIcon.innerText='▶'; }
    });
  }
  if(wmpStop){ wmpStop.addEventListener('click',()=>{ if(wmpAudio){ wmpAudio.pause(); wmpAudio.currentTime=0;} if(wmpVideo){ wmpVideo.pause(); wmpVideo.currentTime=0;} if(wmpPlayIcon) wmpPlayIcon.innerText='▶'; }); }
  if(wmpRewind){ wmpRewind.addEventListener('click',()=>{ if(wmpAudio) wmpAudio.currentTime = Math.max(0, wmpAudio.currentTime - 10); }); }
  if(wmpForward){ wmpForward.addEventListener('click',()=>{ if(wmpAudio) wmpAudio.currentTime = Math.min(wmpAudio.duration || 0, wmpAudio.currentTime + 10); }); }
  if(wmpVol){ wmpVol.addEventListener('input',(e)=>{ if(wmpAudio) wmpAudio.volume = e.target.value; wmpVol.style.setProperty('--vol-progress',(e.target.value*100)+'%'); }); }
  if(wmpAudio){
    wmpAudio.addEventListener('timeupdate',()=>{
      const progress = (wmpAudio.currentTime / (wmpAudio.duration || 1)) * 100;
      if(wmpSeek){ wmpSeek.value = progress || 0; wmpSeek.style.setProperty('--range-progress',(progress||0)+'%'); }
      const mins = Math.floor(wmpAudio.currentTime/60); const secs = Math.floor(wmpAudio.currentTime%60);
      const curr = document.getElementById('wmp-current-time'); if(curr) curr.innerText = `${mins}:${secs<10? '0':''}${secs}`;
    });
    wmpAudio.addEventListener('loadedmetadata',()=>{ const d = Math.floor(wmpAudio.duration); const mins=Math.floor(d/60); const secs=d%60; const el=document.getElementById('wmp-duration-time'); if(el) el.innerText=`${mins}:${secs<10?'0':''}${secs}`; });
  }
  if(wmpSeek){ wmpSeek.addEventListener('input',(e)=>{ if(wmpAudio && wmpAudio.duration){ wmpAudio.currentTime = wmpAudio.duration * (e.target.value/100); if(wmpVideo) wmpVideo.currentTime = wmpAudio.currentTime % (wmpVideo.duration||1); } }); }

  // close button inside music player
  const musicClose = document.querySelector('#music-player-window .win-btn.close');
  if(musicClose) musicClose.addEventListener('click', closeMusicPlayer);

  function openWindow(){
    erIsMinimized = false;
    erWindow.classList.remove('hidden');
    erWindow.focus();
    bringWindowToFront(erWindow);
    setTimeout(()=>bringWindowToFront(erWindow), 0);
    setTimeout(()=>bringWindowToFront(erWindow), 80);
    showPage('page-about');
    initAboutTabs();
    // update taskbar state
    addToTaskOrder('task-er');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
    syncErMaxButton();
  }

  // wired close button changed to .win-btn.close inside the titlebar
  const erCloseBtn = erCloseBtnById || document.querySelector('#er-window .win-btn.close');
  if(erCloseBtn){
    erCloseBtn.addEventListener('click', closeERWindow);
  } else if(winClose){
    // fallback to existing id if present
    winClose.addEventListener('click', closeERWindow);
  }
  if(erMinBtn) erMinBtn.addEventListener('click', minimizeERWindow);
  if(erMaxBtn) erMaxBtn.addEventListener('click', toggleERMaximize);
  const erTitlebar = document.querySelector('#er-window .titlebar');
  if(erTitlebar){
    erTitlebar.addEventListener('dblclick', (e)=>{
      if(e.target.closest('.win-btn')) return;
      bringWindowToFront(erWindow);
      toggleERMaximize();
    });
  }

  // Tabs navigation (top nav tabs use data-tab attributes on .tab elements)
  if(tabs){
    tabs.addEventListener('click', (e) => {
      const el = e.target.closest('[data-tab]');
      if(!el) return;
      const tabName = el.getAttribute('data-tab');
      // reflect active state
      tabs.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
      el.classList.add('active');
      // Resume opens the resume PDF in a new browser tab
      if(tabName === 'resume'){
        openResumeInNewTab();
        return;
      }
      // Portfolio tab should open the Projects window (match desktop icon behavior)
      if(tabName === 'portfolio'){
        openProjectWindow();
        return;
      }
      // For other tabs (home, about, contact), open the ER window and show the matching page
      openWindow();
      const erBrowserContent = erWindow ? erWindow.querySelector('.browser-content') : document;
      erBrowserContent.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
      const show = erBrowserContent.querySelector('#page-' + tabName) || document.getElementById('page-' + tabName);
      if(show) show.classList.remove('hidden');
    });

    // Keyboard accessibility for ER nav tabs
    tabs.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        const el = e.target.closest('[data-tab]'); if(!el) return; el.click(); e.preventDefault();
      }
    });
  }

  // Projects icon (replaces recycle) - open Projects window on click/dblclick
  const projectIcon = document.getElementById('project');
  const projectWin = document.getElementById('project-window');
  const taskProject = document.getElementById('task-project');

  // Mail icon/window wiring
  const mailIcon = document.getElementById('xp-mail');
  const mailWin = document.getElementById('mail-window');

  // Direct titlebar/window click front handler.
  // This makes the clicked window front immediately, even if both windows overlap.
  function installDirectWindowFrontHandlers(){
    const targetSelectors = '#er-window, #project-window, #wordpad-window, #music-player-window, #mail-window, #minesweeper-window';

    function activateFromEvent(e){
      const clickedWindow = e.target.closest && e.target.closest(targetSelectors);
      if(!clickedWindow || clickedWindow.classList.contains('hidden')) return;
      bringWindowToFront(clickedWindow);
    }

    document.addEventListener('pointerdown', activateFromEvent, true);
    document.addEventListener('mousedown', activateFromEvent, true);
    document.addEventListener('click', activateFromEvent, true);

    ['#er-window', '#project-window', '#wordpad-window', '#music-player-window', '#mail-window', '#minesweeper-window'].forEach(selector=>{
      const win = document.querySelector(selector);
      if(!win || win.dataset.directFrontHandler === 'true') return;
      win.dataset.directFrontHandler = 'true';

      const activate = ()=>{
        if(!win.classList.contains('hidden')) bringWindowToFront(win);
      };

      win.addEventListener('pointerdown', activate, true);
      win.addEventListener('mousedown', activate, true);
      win.addEventListener('click', activate, true);

      const titlebar = win.querySelector('.titlebar, .title-bar');
      if(titlebar){
        titlebar.addEventListener('pointerdown', activate, true);
        titlebar.addEventListener('mousedown', activate, true);
        titlebar.addEventListener('click', activate, true);
      }
    });
  }


  function openProjectWindow(){
    if(!projectWin) return;
    try{
      if(projectWin){
        if(!projectWin.classList.contains('hidden')){
          if(projectIsMinimized) restoreProjectWindow();
          resetProjectContent();
          bringWindowToFront(projectWin);
          setTimeout(()=>bringWindowToFront(projectWin), 0);
          setTimeout(()=>bringWindowToFront(projectWin), 80);
          projectWin.focus && projectWin.focus();
          return;
        }
      }
    }catch(e){}
    const erRect = erWindow ? erWindow.getBoundingClientRect() : null;
    const erStyle = erWindow ? getComputedStyle(erWindow) : null;
    // If ER is visible, copy its frame and chrome for exact parity
    if(erWindow && !erWindow.classList.contains('hidden') && erRect && erRect.width > 0){
      setProjectRect({ width: erRect.width, height: erRect.height });
      try{ projectWin.style.border = erStyle.border; projectWin.style.borderRadius = erStyle.borderRadius; projectWin.style.boxShadow = erStyle.boxShadow; }catch(e){}
    }
    projectWin.classList.remove('hidden');
    resetProjectContent();
    bringWindowToFront(projectWin);
    setTimeout(()=>bringWindowToFront(projectWin), 0);
    setTimeout(()=>bringWindowToFront(projectWin), 80);
    projectWin.focus && projectWin.focus();
    addToTaskOrder('task-project');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }
  function closeProjectWindow(){
    if(!projectWin) return;
    projectWin.classList.add('hidden');
    removeFromTaskOrder('task-project');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }
  if(projectIcon){ projectIcon.addEventListener('click', openProjectWindow); projectIcon.addEventListener('dblclick', openProjectWindow); }
  const projectClose = document.querySelector('#project-window .win-btn.close');
  if(projectClose) projectClose.addEventListener('click', closeProjectWindow);

  // Mail icon behavior: open mail window (bring to front) and wire close/cancel
  function openMailWindow(){
    if(!mailWin) return;
    if(!mailWin.classList.contains('hidden')){ bringWindowToFront(mailWin); mailWin.focus && mailWin.focus(); return; }
    mailWin.classList.remove('hidden');
    bringWindowToFront(mailWin);
    mailWin.focus && mailWin.focus();
    // reflect in taskbar and ordering
    addToTaskOrder('task-mail');
    if(typeof reflectTaskbar === 'function') reflectTaskbar();
  }
  function closeMailWindow(){ if(!mailWin) return; mailWin.classList.add('hidden'); removeFromTaskOrder('task-mail'); if(typeof reflectTaskbar === 'function') reflectTaskbar(); }
  if(mailIcon){ mailIcon.addEventListener('click', openMailWindow); mailIcon.addEventListener('dblclick', openMailWindow); }
  const mailClose = document.querySelector('#mail-window .win-btn.close');
  if(mailClose) mailClose.addEventListener('click', closeMailWindow);
  const mailCancel = document.getElementById('mail-cancel'); if(mailCancel) mailCancel.addEventListener('click', closeMailWindow);
  
  // Mail form submit: open default mail client with prefilled fields (mailto)
  try{
    const contactFormEl = document.getElementById('contact-form');
    const mailStatusEl = document.getElementById('mail-status');

    // EmailJS configuration - replace these with your EmailJS account values
    const EMAILJS_CONFIG = {
      userId: 'kceBnZMauOBTBoCVU',
      serviceId: 'service_r159rrt',
      templateId: 'template_3wmp8ni'
    };

    // Initialize EmailJS if SDK is loaded
    try{ if(window.emailjs){ emailjs.init(EMAILJS_CONFIG.userId); } }catch(e){ console.warn('EmailJS init failed', e); }

    if(contactFormEl){
      // show/hide custom subject input when user selects "Other"
      const subjectSelectEl = contactFormEl.querySelector('.mail-subject-select');
      const subjectCustomEl = contactFormEl.querySelector('.mail-subject-custom');
      if(subjectSelectEl && subjectCustomEl){
        subjectSelectEl.addEventListener('change', ()=>{
          try{
            if(subjectSelectEl.value === 'Other'){
              subjectCustomEl.style.display = '';
              subjectCustomEl.focus && subjectCustomEl.focus();
            } else {
              subjectCustomEl.style.display = 'none';
            }
          }catch(e){}
        });
      }

      contactFormEl.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const to = 'santiago.saligaojessa@gmail.com';
        const from = (contactFormEl.querySelector('.mail-from') || {}).value || '';
        // Determine subject: prefer the dropdown selection, use custom input when 'Other' is chosen, fallback to any legacy subject input
        let subjectRaw = '';
        const sel = (contactFormEl.querySelector('.mail-subject-select') || {}).value || '';
        if(sel){
          if(sel === 'Other'){
            subjectRaw = (contactFormEl.querySelector('.mail-subject-custom') || {}).value || '';
          } else {
            subjectRaw = sel;
          }
        } else {
          subjectRaw = (contactFormEl.querySelector('.mail-subject') || {}).value || '';
        }
        const bodyRaw = (contactFormEl.querySelector('.mail-body') || {}).value || '';
        const subject = encodeURIComponent(subjectRaw || '');
        const body = encodeURIComponent((from?('From: ' + from + '\n\n') : '') + bodyRaw);
        const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

        // If EmailJS is configured, attempt to send via EmailJS first
        if(window.emailjs && EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.userId && EMAILJS_CONFIG.userId !== 'YOUR_EMAILJS_USER_ID'){
          try{
            if(mailStatusEl) mailStatusEl.textContent = 'Sending via EmailJS...';
            const templateParams = {
              to_email: to,
              from_email: from,
              subject: subjectRaw,
              message: bodyRaw
            };
            await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
            if(mailStatusEl) mailStatusEl.textContent = 'Message sent — thank you!';
            contactFormEl.reset();
            return;
          }catch(err){
            console.error('EmailJS send error:', err);
            if(mailStatusEl) mailStatusEl.textContent = 'EmailJS failed — opening mail client as fallback...';
            // fallthrough to open mail client fallback
          }
        }

        // Fallback: open default mail client with mailto
        try{ if(mailStatusEl) mailStatusEl.textContent = 'Opening mail client...'; }catch(e){}
        window.location.href = mailto;
      });
    }
  }catch(e){}

  // Toolbar buttons: Send triggers submit, New clears form and resets status
  try{
    const mailSendBtn = document.getElementById('mail-send-btn');
    const mailNewBtn = document.getElementById('mail-new-btn');
    if(mailSendBtn){ mailSendBtn.addEventListener('click', ()=>{ const form = document.getElementById('contact-form'); if(form) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit',{cancelable:true, bubbles:true})); }); }
    if(mailNewBtn){ mailNewBtn.addEventListener('click', ()=>{
      const form = document.getElementById('contact-form'); if(!form) return;
      form.reset();
      const status = document.getElementById('mail-status'); if(status) status.textContent = 'Compose a new message';
      // focus the From field
      const fromInput = form.querySelector('.mail-from'); if(fromInput) fromInput.focus();
    }); }
  }catch(e){}

  // Project window controls and scoped tab handling (namespaced with proj-)
  const projMinBtn = document.getElementById('proj-minimize');
  const projMaxBtn = document.getElementById('proj-maximize');
  const projCloseBtn = document.getElementById('proj-close');
  let projectIsMinimized = false;
  let projectIsMaximized = false;
  let projectRestoreRect = null;

  function setProjectRect(rect){
    if(!projectWin || !rect) return;
    if(rect.left != null) projectWin.style.setProperty('left', `${Math.round(rect.left)}px`, 'important');
    if(rect.top != null) projectWin.style.setProperty('top', `${Math.round(rect.top)}px`, 'important');
    if(rect.width != null) projectWin.style.setProperty('width', `${Math.round(rect.width)}px`, 'important');
    if(rect.height != null) projectWin.style.setProperty('height', `${Math.round(rect.height)}px`, 'important');
  }

  function clearProjectRect(){ if(!projectWin) return; projectWin.style.removeProperty('left'); projectWin.style.removeProperty('top'); projectWin.style.removeProperty('width'); projectWin.style.removeProperty('height'); }

  function syncProjectMaxButton(){ if(!projMaxBtn) return; projMaxBtn.innerHTML = projectIsMaximized ? '&#9638;' : '&#9633;'; }

  function minimizeProjectWindow(){ if(!projectWin || projectWin.classList.contains('hidden')) return; projectIsMinimized = true; projectWin.classList.add('hidden'); addToTaskOrder('task-project'); if(typeof reflectTaskbar === 'function') reflectTaskbar(); }

  function restoreProjectWindow(){ if(!projectWin) return; projectIsMinimized = false; projectWin.classList.remove('hidden'); resetProjectContent(); bringWindowToFront(projectWin); syncProjectMaxButton(); if(typeof reflectTaskbar === 'function') reflectTaskbar(); }

  function toggleProjectMaximize(){
    if(!projectWin) return;
    if(projectWin.classList.contains('hidden')){ if(projectIsMinimized) restoreProjectWindow(); else openProjectWindow(); }
    if(!projectIsMaximized){
      const rect = projectWin.getBoundingClientRect();
      projectRestoreRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      projectWin.classList.add('maximized');
      projectWin.style.setProperty('left', '8px', 'important');
      projectWin.style.setProperty('top', '8px', 'important');
      projectWin.style.setProperty('width', 'calc(100% - 16px)', 'important');
      projectWin.style.setProperty('height', 'calc(100% - 56px)', 'important');
      projectIsMaximized = true;
    } else {
      projectWin.classList.remove('maximized');
      if(projectRestoreRect){ projectWin.style.setProperty('left', `${Math.round(projectRestoreRect.left)}px`, 'important'); projectWin.style.setProperty('top', `${Math.round(projectRestoreRect.top)}px`, 'important'); projectWin.style.setProperty('width', `${Math.round(projectRestoreRect.width)}px`, 'important'); projectWin.style.setProperty('height', `${Math.round(projectRestoreRect.height)}px`, 'important'); }
      projectIsMaximized = false;
    }
    syncProjectMaxButton();
  }

  if(projCloseBtn) projCloseBtn.addEventListener('click', closeProjectWindow);
  if(projMinBtn) projMinBtn.addEventListener('click', minimizeProjectWindow);
  if(projMaxBtn) projMaxBtn.addEventListener('click', toggleProjectMaximize);

  const projTabs = document.getElementById('proj-nav-tabs');
  if(projTabs){
    // Click handler for project window tabs
    projTabs.addEventListener('click', (e)=>{
      const el = e.target.closest('[data-tab]');
      if(!el) return;
      const tabName = el.getAttribute('data-tab');
      projTabs.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
      el.classList.add('active');
      // If the user clicked Resume on the Projects tab, open resume in a new browser tab
      if(tabName === 'resume'){ openResumeInNewTab(); return; }
      // If the user clicked Jessa Portfolio (home) from Projects, open the ER/About window
      if(tabName === 'home'){
        try{ openWindow(); }catch(e){}
        try{ showPage('page-about'); }catch(e){}
        return;
      }
      // Otherwise attempt to show pages scoped to the project window (if present)
      try{ projectWin.querySelectorAll('.page').forEach(p=>p.classList.add('hidden')); }catch(e){}
      const show = projectWin ? projectWin.querySelector('#proj-page-' + tabName) : null;
      if(show) show.classList.remove('hidden');
    });
    // Keyboard accessibility: activate tab with Enter or Space
    projTabs.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        const el = e.target.closest('[data-tab]'); if(!el) return; el.click(); e.preventDefault();
      }
    });
  }

  // allow dragging the Projects window like ER/WordPad
  makeDraggable(projectWin, '.titlebar');
  makeDraggable(projectWin, '.title-bar');
  // make mail window draggable
  makeDraggable(mailWin, '.titlebar');
  makeDraggable(mailWin, '.title-bar');
  const projTitlebar = document.querySelector('#project-window .titlebar');
  if(projTitlebar){ projTitlebar.addEventListener('dblclick', (e)=>{ if(e.target.closest('.win-btn')) return; bringWindowToFront(projectWin); toggleProjectMaximize(); }); }

  try{ installDirectWindowFrontHandlers(); }catch(e){}

  // Close on Escape
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ closeERWindow(); } });

  // Taskbar / Start menu interactions
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');
  const clockEl = document.getElementById('taskbar-clock');
  const clockTimeEl = clockEl ? clockEl.querySelector('.clock-time') : null;
  const taskEr = document.getElementById('task-er');
  const taskMail = document.getElementById('task-mail');
  const taskMusic = document.getElementById('task-music');
  const taskbarItems = document.getElementById('taskbar-items');

  function updateClock(){
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    if(clockTimeEl){
      clockTimeEl.textContent = `${h}:${m}`;
    } else {
      clockEl.textContent = `${h}:${m}`;
    }
  }

  // Sync scrolling: show single scrollbar on the right (project-browser-content)
  try{
    const projectBrowser = document.querySelector('#project-window .project-browser-content');
    const projectSidebar = document.querySelector('#project-window .project-sidebar');
    if(projectBrowser && projectSidebar){
      // hide sidebar native scrollbar while preserving scroll behavior
      projectSidebar.classList.add('hide-scrollbar');

      // Sync scroll positions between container and sidebar
      let syncing = false;
      projectBrowser.addEventListener('scroll', ()=>{
        if(syncing) return;
        syncing = true;
        projectSidebar.scrollTop = projectBrowser.scrollTop;
        requestAnimationFrame(()=>{ syncing = false; });
      });
      projectSidebar.addEventListener('scroll', ()=>{
        if(syncing) return;
        syncing = true;
        projectBrowser.scrollTop = projectSidebar.scrollTop;
        requestAnimationFrame(()=>{ syncing = false; });
      });
    }
  }catch(e){/* ignore */}
  updateClock();setInterval(updateClock,60000);

  startBtn.addEventListener('click',(e)=>{
    // toggle start menu and stop propagation so the document click handler doesn't immediately close it
    e.stopPropagation();
    const menuRect = startMenu.getBoundingClientRect();
    const btnRect = startBtn.getBoundingClientRect();
    const nextLeft = Math.max(0, Math.min(btnRect.left, window.innerWidth - Math.max(260, menuRect.width)));
    startMenu.style.left = `${nextLeft}px`;
    startMenu.classList.toggle('hidden');
    startMenu.setAttribute('aria-hidden', startMenu.classList.contains('hidden'));
  });

  // Close start menu when clicking outside
  document.addEventListener('click',(e)=>{
    if(!e.target.closest('#start-menu') && !e.target.closest('#start-btn')){
      startMenu.classList.add('hidden');
      startMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Start menu navigation buttons reuse the app windows and pages
  startMenu.addEventListener('click',(e)=>{
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    e.stopPropagation();
    const action = btn.dataset.action;

    if(action === 'about'){
      openWindow();
      showPage('page-about');
      try{ initAboutTabs(); }catch(e){}
      try{ scheduleUpdateAboutHeights(); }catch(e){}
      try{ copyExperienceSizeToGeneral(); }catch(e){}
      try{ copyExperienceStylesToGeneral(); }catch(e){}
      try{ fitErWindowToExperience(); }catch(e){}
      try{ normalizeAboutScrolling(); }catch(e){}
    }

    if(action === 'projects'){
      openProjectWindow();
      if(typeof reflectTaskbar === 'function') reflectTaskbar();
    }

    if(action === 'resume'){
      openResumeInNewTab();
    }

    if(action === 'mail'){
      openMailWindow();
    }

    startMenu.classList.add('hidden');
    startMenu.setAttribute('aria-hidden', 'true');
  });

  // Quick-launch browser button should open the ER window on click
  const quickBrowser = document.querySelector('.quick-launch[title="Browser"]');
  if(quickBrowser){
    quickBrowser.addEventListener('click',(e)=>{
      e.preventDefault();
      openWindow();
      reflectTaskbar();
    });
  }

  // Reflect ER window in taskbar
  function reflectTaskbar(){
    const erVisible = Boolean(erWindow && !erWindow.classList.contains('hidden'));

    // ER task
    if(taskEr){
      if(erVisible){
        taskEr.classList.remove('hidden');
        taskEr.classList.add('active');
      } else if(erIsMinimized){
        taskEr.classList.remove('hidden');
        taskEr.classList.remove('active');
      } else {
        taskEr.classList.add('hidden');
        taskEr.classList.remove('active');
      }
    }
    // Mail task
    if(taskMail){
      if(mailWin && !mailWin.classList.contains('hidden')){ taskMail.classList.remove('hidden'); taskMail.classList.add('active'); }
      else { taskMail.classList.add('hidden'); taskMail.classList.remove('active'); }
    }
    // Music task
    if(taskWordpad){
      if(wordpadWin && !wordpadWin.classList.contains('hidden')){
        taskWordpad.classList.remove('hidden');
        taskWordpad.classList.add('active');
      } else if(wordpadIsMinimized){
        taskWordpad.classList.remove('hidden');
        taskWordpad.classList.remove('active');
      } else {
        taskWordpad.classList.add('hidden');
        taskWordpad.classList.remove('active');
      }
    }
    if(taskMusic){
      if(musicWin && !musicWin.classList.contains('hidden')){ taskMusic.classList.remove('hidden'); taskMusic.classList.add('active'); }
      else { taskMusic.classList.add('hidden'); taskMusic.classList.remove('active'); }
    }
    // Projects task
    if(taskProject){
      if(projectWin && !projectWin.classList.contains('hidden')){ taskProject.classList.remove('hidden'); taskProject.classList.add('active'); }
      else { taskProject.classList.add('hidden'); taskProject.classList.remove('active'); }
    }
  }
  reflectTaskbar();
  if(!document.body.classList.contains('loading-fullscreen')){
    try{ forceShowTaskbar(); }catch(e){}
  }
  // Ensure About pane tabs are wired even if About is opened from the Start menu
  try{ initAboutTabs(); }catch(e){}
  try{ syncAboutPaneHeights(); }catch(e){}
  try{ copyExperienceSizeToGeneral(); }catch(e){}
  try{ copyExperienceStylesToGeneral(); }catch(e){}
  try{ fitErWindowToExperience(); }catch(e){}
  try{ copyComputedStyles(document.querySelector('#about-panes > [data-pane="experience"]'), document.querySelector('#about-panes > [data-pane="general"]')); }catch(e){}

  // Recalculate sizes on window resize (debounced)
  let _resizeTimer = null;
  window.addEventListener('resize', ()=>{
    if(_resizeTimer) clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(()=>{
      try{ syncAboutPaneHeights(); }catch(e){}
      try{ copyExperienceSizeToGeneral(); }catch(e){}
      try{ copyExperienceStylesToGeneral(); }catch(e){}
      try{ fitErWindowToExperience(); }catch(e){}
        try{ copyComputedStyles(document.querySelector('#about-panes > [data-pane="experience"]'), document.querySelector('#about-panes > [data-pane="general"]')); }catch(e){}
    }, 120);
  });
  // Add click/press feedback classes to interactive elements for instant tactile response
  document.querySelectorAll('button, .win-btn, .nav-btn, .task-item, .btn-main, .btn-small, .start-button, .quick-launch, .tab, .menu-bar span, .icon').forEach(el=>{ el.classList.add('press-feedback'); });

  // Click animation handling: apply XP-style float or zoom animations on click
  const CLICK_SELECTORS = 'button, .icon, .win-btn, .start-button, .menu-bar span, .tab, .nav-btn, .task-item, .btn-main, .btn-small, .quick-launch';
  function triggerClickAnim(e){
    const el = e.target.closest(CLICK_SELECTORS);
    if(!el) return;
    const variant = el.dataset.clickAnim || (el.classList.contains('icon') || el.classList.contains('tab') ? 'float' : 'zoom');
    const base = 'xp-click';
    const floatClass = 'xp-click--float';
    const zoomClass = 'xp-click--zoom';
    el.classList.remove(base, floatClass, zoomClass);
    void el.offsetWidth;
    el.classList.add(base, variant === 'float' ? floatClass : zoomClass);
    function cleanup(){ el.classList.remove(base, floatClass, zoomClass); el.removeEventListener('animationend', cleanup); }
    el.addEventListener('animationend', cleanup);
  }
  document.addEventListener('click', triggerClickAnim, true);
  // Task ordering: keep first-open left, second-open right
  let taskOrder = [];
  function addToTaskOrder(id){
    if(!taskOrder.includes(id)) taskOrder.push(id);
    updateTaskPositions();
  }
  function removeFromTaskOrder(id){
    const i = taskOrder.indexOf(id);
    if(i!==-1) taskOrder.splice(i,1);
    updateTaskPositions();
  }
  function updateTaskPositions(){
    // clear classes first
    [taskEr, taskProject, taskWordpad, taskMusic, taskMail].forEach(el=>{ if(el){ el.classList.remove('left','right'); } });
    if(taskOrder.length>=1){ const first = document.getElementById(taskOrder[0]); if(first) first.classList.add('left'); }
    if(taskOrder.length>=2){ const second = document.getElementById(taskOrder[1]); if(second) second.classList.add('right'); }
  }

  // ensure clicking the close (×) updates taskbar (erCloseBtn wired earlier)
  if(winClose) winClose.addEventListener('click',()=>{ removeFromTaskOrder('task-er'); reflectTaskbar(); });
  // toggle by clicking ER taskbar button
  if(taskEr){
    taskEr.addEventListener('click',()=>{
      if(erWindow.classList.contains('hidden')){
        if(erIsMinimized) restoreERWindow();
        else openWindow();
      }
      else { minimizeERWindow(); }
      reflectTaskbar();
    });
  }
  // toggle by clicking Music taskbar button
  if(taskMusic){
    taskMusic.addEventListener('click',()=>{
      if(!musicWin) return;
      if(musicWin.classList.contains('hidden')){ openMusicPlayer(); }
      else { closeMusicPlayer(); removeFromTaskOrder('task-music'); }
      reflectTaskbar();
    });
  }

  // toggle by clicking Mail taskbar button
  if(taskMail){
    taskMail.addEventListener('click',()=>{
      if(!mailWin) return;
      if(mailWin.classList.contains('hidden')){ openMailWindow(); }
      else { closeMailWindow(); }
      reflectTaskbar();
    });
  }

  // clicking the Resume taskbar button should open the resume in a new browser tab
  if(taskWordpad){
    taskWordpad.addEventListener('click',()=>{
      openResumeInNewTab();
    });
  }

  // toggle by clicking Projects taskbar button
  if(taskProject){
    taskProject.addEventListener('click',()=>{
      if(!projectWin) return;
      if(projectWin.classList.contains('hidden')){ openProjectWindow(); }
      else { projectWin.classList.add('hidden'); removeFromTaskOrder('task-project'); }
      reflectTaskbar();
    });
  }

  // Draggable windows: allow dragging by title bar for ER and Music windows
  function makeDraggable(winEl, handleSelector){
    if(!winEl) return;
    const handle = winEl.querySelector(handleSelector);
    if(!handle) return;
    handle.style.cursor = 'move';
    let dragging = false;
    let startX=0, startY=0, startLeft=0, startTop=0;
    const cs = getComputedStyle(winEl);
    // ensure positioned
    if(cs.position === 'static') winEl.style.position = 'absolute';

    handle.addEventListener('mousedown',(e)=>{
      if(e.target.closest('.win-btn')) return;
      if(winEl === erWindow && erIsMaximized){
        erWindow.classList.remove('maximized');
        if(erRestoreRect){
          erWindow.style.setProperty('left', `${Math.round(erRestoreRect.left)}px`, 'important');
          erWindow.style.setProperty('top', `${Math.round(erRestoreRect.top)}px`, 'important');
          erWindow.style.setProperty('width', `${Math.round(erRestoreRect.width)}px`, 'important');
          erWindow.style.setProperty('height', `${Math.round(erRestoreRect.height)}px`, 'important');
        }
        erIsMaximized = false;
        syncErMaxButton();
      }
      if(winEl === wordpadWin && wordpadIsMaximized){
        wordpadWin.classList.remove('maximized');
        if(wordpadRestoreRect){
          wordpadWin.style.left = `${Math.round(wordpadRestoreRect.left)}px`;
          wordpadWin.style.top = `${Math.round(wordpadRestoreRect.top)}px`;
          wordpadWin.style.width = `${Math.round(wordpadRestoreRect.width)}px`;
          wordpadWin.style.height = `${Math.round(wordpadRestoreRect.height)}px`;
        }
        wordpadIsMaximized = false;
        syncWordpadMaxButton();
      }
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      // compute startLeft/Top from style or bounding rect
      const rect = winEl.getBoundingClientRect();
      const style = getComputedStyle(winEl);
      startLeft = parseFloat(style.left) || rect.left || 0;
      startTop = parseFloat(style.top) || rect.top || 0;
      // ensure explicit left/top so moves work
      if(winEl === wordpadWin){
        winEl.style.setProperty('left', startLeft + 'px', 'important');
        winEl.style.setProperty('top', startTop + 'px', 'important');
      } else {
        winEl.style.left = startLeft + 'px';
        winEl.style.top = startTop + 'px';
      }
      // bring to front
      bringWindowToFront(winEl);
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove',(e)=>{
      if(!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if(winEl === wordpadWin){
        winEl.style.setProperty('left', (startLeft + dx) + 'px', 'important');
        winEl.style.setProperty('top', (startTop + dy) + 'px', 'important');
      } else {
        winEl.style.left = (startLeft + dx) + 'px';
        winEl.style.top = (startTop + dy) + 'px';
      }
    });

    document.addEventListener('mouseup',()=>{
      if(dragging){ dragging = false; document.body.style.userSelect = ''; }
    });

    // touch support
    handle.addEventListener('touchstart',(e)=>{
      const touchTarget = e.target;
      if(touchTarget && touchTarget.closest && touchTarget.closest('.win-btn')) return;
      if(winEl === erWindow && erIsMaximized){
        erWindow.classList.remove('maximized');
        if(erRestoreRect){
          erWindow.style.setProperty('left', `${Math.round(erRestoreRect.left)}px`, 'important');
          erWindow.style.setProperty('top', `${Math.round(erRestoreRect.top)}px`, 'important');
          erWindow.style.setProperty('width', `${Math.round(erRestoreRect.width)}px`, 'important');
          erWindow.style.setProperty('height', `${Math.round(erRestoreRect.height)}px`, 'important');
        }
        erIsMaximized = false;
        syncErMaxButton();
      }
      const t = e.touches[0];
      dragging = true;
      startX = t.clientX; startY = t.clientY;
      const rect = winEl.getBoundingClientRect();
      const style = getComputedStyle(winEl);
      startLeft = parseFloat(style.left) || rect.left || 0;
      startTop = parseFloat(style.top) || rect.top || 0;
      if(winEl === wordpadWin){
        winEl.style.setProperty('left', startLeft + 'px', 'important');
        winEl.style.setProperty('top', startTop + 'px', 'important');
      } else {
        winEl.style.left = startLeft + 'px';
        winEl.style.top = startTop + 'px';
      }
      bringWindowToFront(winEl);
      e.preventDefault();
    },{passive:false});
    document.addEventListener('touchmove',(e)=>{
      if(!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - startX; const dy = t.clientY - startY;
      if(winEl === wordpadWin){
        winEl.style.setProperty('left', (startLeft + dx) + 'px', 'important');
        winEl.style.setProperty('top', (startTop + dy) + 'px', 'important');
      } else {
        winEl.style.left = (startLeft + dx) + 'px';
        winEl.style.top = (startTop + dy) + 'px';
      }
    },{passive:false});
    document.addEventListener('touchend',()=>{ if(dragging) dragging=false; });
  }

  // attach draggable handlers
  makeDraggable(erWindow, '.titlebar');
  makeDraggable(erWindow, '.title-bar');
  makeDraggable(musicWin, '.titlebar');
  makeDraggable(musicWin, '.title-bar');
  syncErMaxButton();
  syncWordpadMaxButton();
  
  /* Certificate preview handler: open assets/certifications files inside a modal */
  (function(){
    const modal = document.getElementById('cert-modal');
    const modalBody = document.getElementById('cert-body');
    if(!modal) return;

    function openCert(url, title){
      if(!modalBody) return;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden','false');
      modalBody.innerHTML = '<div class="cert-loading">Loading certificate…</div>';
      const cleanUrl = (url||'').split('#')[0];
      // Check resource exists before embedding to avoid empty modal
      fetch(cleanUrl, { method: 'HEAD' }).then(res => {
        if(!res.ok) throw new Error('Not found');
        const lower = cleanUrl.split('?')[0].toLowerCase();
        // PDFs: use <object> with fallback link
        if(lower.endsWith('.pdf')){
          const obj = document.createElement('object');
          obj.className = 'cert-object';
          obj.type = 'application/pdf';
          obj.data = cleanUrl;
          obj.innerHTML = `<div style="padding:18px;text-align:center;color:#062a4a;font-weight:600;">Unable to display the PDF here.<br><a href="${cleanUrl}" target="_blank" rel="noopener">Open or download the certificate</a></div>`;
          modalBody.innerHTML = '';
          modalBody.appendChild(obj);
        } else if(lower.match(/\.(png|jpe?g|webp|gif)$/)){
          const img = document.createElement('img');
          img.src = cleanUrl;
          img.alt = title || 'Certificate image';
          img.onload = ()=>{};
          img.onerror = ()=>{
            modalBody.innerHTML = `<div style="padding:18px;text-align:center;color:#062a4a;font-weight:600;">Unable to load image.<br><a href="${cleanUrl}" target="_blank" rel="noopener">Open or download</a></div>`;
          };
          modalBody.innerHTML = '';
          modalBody.appendChild(img);
        } else {
          const obj = document.createElement('object');
          obj.className = 'cert-object';
          obj.data = cleanUrl;
          obj.innerHTML = `<div style="padding:18px;text-align:center;color:#062a4a;font-weight:600;">Unable to display this file.<br><a href="${cleanUrl}" target="_blank" rel="noopener">Open or download</a></div>`;
          modalBody.innerHTML = '';
          modalBody.appendChild(obj);
        }
        try{ modal.style.zIndex = '2147484001'; }catch(e){}
      }).catch(err=>{
        modalBody.innerHTML = `<div style="padding:18px;text-align:center;color:#fff;font-weight:600;">Certificate not found or unavailable.<br><a href="${cleanUrl}" target="_blank" rel="noopener">Open or download file</a></div>`;
      });
    }

    // expose helper so other UI (project gallery) can reuse the same modal
    try{ window.openCertModal = openCert; }catch(e){}

    // Clicking any visible part of a window should bring it to the front
    document.querySelectorAll('.window').forEach(w=>{
      w.addEventListener('mousedown', (e)=>{
        // ignore clicks on window controls that already handle focus
        if(e.target.closest('.win-btn')) return;
        try{ bringWindowToFront(w); }catch(e){}
        try{ w.focus && w.focus(); }catch(e){}
      });
    });

    function closeModal(){
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden','true');
      if(modalBody) modalBody.innerHTML = '';
    }

    document.addEventListener('click', function(e){
      const link = e.target.closest && e.target.closest('.cert-link a');
      if(link){
        // If the link doesn't point to a real certificate (href="#" or empty),
        // do not open the cert modal. This prevents project detail anchors
        // (which reuse .cert-link markup) from triggering the cert modal.
        const rawUrl = link.getAttribute('data-cert') || link.getAttribute('href') || '';
        const url = (rawUrl||'').split('#')[0];
        if(!url || url.trim() === '' ){
          // Let other handlers (e.g. project detail dropdown) handle this click
          return;
        }
        e.preventDefault();
        const title = link.closest && link.closest('.cert-item') ? (link.closest('.cert-item').querySelector('.cert-title')?.textContent || '') : '';
        if(url) openCert(url, title);
        return;
      }
      const closeTrigger = e.target.closest && e.target.closest('[data-action="close"]');
      if(closeTrigger) closeModal();
    }, false);

    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
  })();

  /* =========================================================
     WINDOW CLICK-TO-FRONT FIX
     When About Me or My Projects is clicked, that window moves
     above the other open window, and vice versa.
     ========================================================= */
  function activateDesktopWindow(winEl){
    if(!winEl || winEl.classList.contains('hidden')) return;
    try{
      bringWindowToFront(winEl);
      if(typeof winEl.focus === 'function') winEl.focus();
    }catch(e){}
  }

  // Click anywhere inside a window to put that exact window in front.
  document.addEventListener('mousedown', (e)=>{
    const clickedWindow = e.target.closest && e.target.closest('.window');
    if(!clickedWindow) return;

    activateDesktopWindow(clickedWindow);
    setTimeout(()=>activateDesktopWindow(clickedWindow), 0);
  }, true);

  // Desktop icons: after opening the window, force it to the front.
  document.addEventListener('click', (e)=>{
    const clickedAboutIcon = e.target.closest && e.target.closest('#er-folder');
    const clickedProjectIcon = e.target.closest && e.target.closest('#project');

    if(clickedAboutIcon){
      setTimeout(()=>activateDesktopWindow(erWindow), 0);
      setTimeout(()=>activateDesktopWindow(erWindow), 50);
    }

    if(clickedProjectIcon){
      setTimeout(()=>activateDesktopWindow(projectWin), 0);
      setTimeout(()=>activateDesktopWindow(projectWin), 50);
    }
  }, true);

  // Browser tabs that switch between About and Projects should also bring the target window forward.
  if(tabs){
    tabs.addEventListener('click', (e)=>{
      const tab = e.target.closest && e.target.closest('[data-tab]');
      if(tab && tab.getAttribute('data-tab') === 'portfolio'){
        setTimeout(()=>activateDesktopWindow(projectWin), 0);
        setTimeout(()=>activateDesktopWindow(projectWin), 50);
      }
    }, true);
  }

  if(projTabs){
    projTabs.addEventListener('click', (e)=>{
      const tab = e.target.closest && e.target.closest('[data-tab]');
      if(tab && tab.getAttribute('data-tab') === 'home'){
        setTimeout(()=>activateDesktopWindow(erWindow), 0);
        setTimeout(()=>activateDesktopWindow(erWindow), 50);
      }
    }, true);
  }

  /* =========================================================
     RESPONSIVE DESKTOP ICON POSITIONING
     Automatically arranges desktop icons based on available space
     ========================================================= */
  
  const TASKBAR_HEIGHT = 40;
  const ICON_GAP = 28;
  const ICON_CONTAINER_WIDTH = 120;
  const ICON_HEIGHT = 120;
  
  function getAvailableDesktopHeight(){
    return window.innerHeight - TASKBAR_HEIGHT;
  }
  
  function getAvailableDesktopWidth(){
    return window.innerWidth;
  }
  
  function positionDesktopIcons(){
    const iconsContainer = document.querySelector('.icons');
    const rightShortcuts = document.querySelector('.desktop-right-shortcuts');
    const minesweeperIcon = document.querySelector('.minesweeper-desktop-icon');
    
    if(!iconsContainer) return;
    
    const leftIcons = Array.from(iconsContainer.querySelectorAll('.icon:not(.minesweeper-desktop-icon)'));
    if(leftIcons.length === 0) return;
    
    const availableHeight = getAvailableDesktopHeight();
    const availableWidth = getAvailableDesktopWidth();
    
    const iconHeight = ICON_HEIGHT + ICON_GAP;
    const iconsPerColumn = Math.floor((availableHeight - 60) / iconHeight);
    const maxColumns = Math.ceil(leftIcons.length / iconsPerColumn);
    
    const startX = 20;
    const startY = 20;
    
    leftIcons.forEach((icon, index) => {
      const column = Math.floor(index / iconsPerColumn);
      const row = index % iconsPerColumn;
      
      const left = startX + (column * (ICON_CONTAINER_WIDTH + ICON_GAP));
      const top = startY + (row * iconHeight);
      
      icon.style.position = 'absolute';
      icon.style.left = `${left}px`;
      icon.style.top = `${top}px`;
      icon.style.transform = 'none';
    });
    
    if(rightShortcuts && minesweeperIcon){
      const minesweeperWidth = minesweeperIcon.offsetWidth || 100;
      const minesweeperRightMargin = 20;
      const minesweeperTopMargin = 20;
      
      const maxLeftIconRight = leftIcons.length > 0 
        ? startX + ((maxColumns - 1) * (ICON_CONTAINER_WIDTH + ICON_GAP)) + ICON_CONTAINER_WIDTH + ICON_GAP
        : 0;
      
      const minesweeperLeft = Math.max(
        maxLeftIconRight + minesweeperRightMargin,
        availableWidth - minesweeperWidth - minesweeperRightMargin
      );
      
      rightShortcuts.style.position = 'absolute';
      rightShortcuts.style.right = `${minesweeperRightMargin}px`;
      rightShortcuts.style.top = `${minesweeperTopMargin}px`;
      
      minesweeperIcon.style.position = 'relative';
      minesweeperIcon.style.left = 'auto';
      minesweeperIcon.style.right = 'auto';
      minesweeperIcon.style.top = 'auto';
    }
    
    iconsContainer.style.position = 'relative';
    iconsContainer.style.width = '100%';
    iconsContainer.style.height = '100%';
    iconsContainer.style.display = 'block';
  }
  
  function initResponsiveIcons(){
    positionDesktopIcons();
    
    const debouncedPosition = debounce(() => {
      positionDesktopIcons();
    }, 100);
    
    window.addEventListener('resize', debouncedPosition);
    window.addEventListener('zoom', debouncedPosition);
    
    setTimeout(positionDesktopIcons, 50);
    setTimeout(positionDesktopIcons, 200);
  }
  
  try{ initResponsiveIcons(); }catch(e){}

});