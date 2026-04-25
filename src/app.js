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

  // Simulate boot sequence then show an XP-like "Starting" screen with xp-logo1.png and the classic loading bar
  const xpStarting = document.getElementById('xp-starting');
  const bootLines = document.getElementById('boot-lines');
  const progress = document.querySelector('.progress');

  // Boot sequence is invoked explicitly via window.startBoot()
  window.startBoot = function(){
    // hide initial boot-lines / progress if present
    if(bootLines) bootLines.classList.add('hidden');
    if(progress) progress.classList.add('hidden');

    if(xpStarting){
      xpStarting.classList.remove('hidden');
      xpStarting.setAttribute('aria-hidden','false');
      // show the bottom-left and bottom-right boot texts with the logo
      const bootLeft = document.querySelector('.boot-copyright');
      const bootRight = document.querySelector('.boot-microsoft');
      if(bootLeft) { bootLeft.classList.remove('hidden'); bootLeft.setAttribute('aria-hidden','false'); }
      if(bootRight) { bootRight.classList.remove('hidden'); bootRight.setAttribute('aria-hidden','false'); }
    }

    // after XP screen finishes (approx 2.6s) show desktop
    setTimeout(()=>{
      if(boot) boot.classList.add('hidden');
      if(desktop) desktop.classList.remove('hidden');
    },2600);
  };

  // Open ER window on single OR double click (browser desktop icon)
  if(erFolder){
    erFolder.addEventListener('click',(e)=>{ openWindow(); });
    erFolder.addEventListener('dblclick',(e)=>{ openWindow(); });
  }

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
    zIndexCounter += 1;
    winEl.style.zIndex = zIndexCounter;
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
      const url = resumePdf ? (resumePdf.getAttribute('data') || resumePdf.getAttribute('src') || 'assets/PDF/resume.pdf') : 'assets/PDF/resume.pdf';
      const cleanUrl = url.split('#')[0];
      const a = document.createElement('a'); a.href = cleanUrl; a.download = 'resume.pdf'; document.body.appendChild(a); a.click(); a.remove();
    });
  }
  if(resumePrintBtn){
    resumePrintBtn.addEventListener('click',()=>{
      // open the PDF in a new tab and call print (best-effort)
      const url = resumePdf ? (resumePdf.getAttribute('data') || resumePdf.getAttribute('src') || 'assets/PDF/resume.pdf') : 'assets/PDF/resume.pdf';
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

  if(wordpadIcon){ wordpadIcon.addEventListener('click', openWordpad); wordpadIcon.addEventListener('dblclick', openWordpad); }
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

  // make WordPad window draggable like the others
  makeDraggable(wordpadWin, '.titlebar');
  makeDraggable(wordpadWin, '.title-bar');

  // Ensure clicks on the icon still open WordPad (delegation fallback)
  document.addEventListener('click', (e) => {
    const ic = e.target.closest('#wordpad');
    if(ic) openWordpad();
  });
  document.addEventListener('dblclick', (e) => {
    const ic = e.target.closest('#wordpad');
    if(ic) openWordpad();
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
      toggleERMaximize();
    });
  }

  // Tabs navigation
  tabs.addEventListener('click',(e)=>{
    const btn = e.target.closest('button[data-page]');
    if(!btn) return;
    [...tabs.querySelectorAll('button')].forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const page = btn.dataset.page;
    [...document.querySelectorAll('.page')].forEach(p=>p.classList.add('hidden'));
    const show = document.getElementById('page-'+page);
    if(show) show.classList.remove('hidden');
  });

  // Projects icon (replaces recycle) - open Projects window on click/dblclick
  const projectIcon = document.getElementById('project');
  const projectWin = document.getElementById('project-window');
  const taskProject = document.getElementById('task-project');
  function openProjectWindow(){
    if(!projectWin) return;
    projectWin.classList.remove('hidden');
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

  // Close on Escape
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ closeERWindow(); } });

  // Taskbar / Start menu interactions
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');
  const clockEl = document.getElementById('taskbar-clock');
  const clockTimeEl = clockEl.querySelector('.clock-time');
  const taskEr = document.getElementById('task-er');
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
  updateClock();setInterval(updateClock,60000);

  startBtn.addEventListener('click',(e)=>{
    // toggle start menu and stop propagation so the document click handler doesn't immediately close it
    e.stopPropagation();
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

  // Start menu navigation buttons reuse existing tab switching
  startMenu.addEventListener('click',(e)=>{
    const btn = e.target.closest('button[data-page]');
    if(!btn) return;
    const page = btn.dataset.page;
    // open ER window and show requested page
    openWindow();
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
    const show = document.getElementById('page-'+page);
    if(show) show.classList.remove('hidden');
    // reflect active tab button in window nav
    document.querySelectorAll('#nav-tabs button').forEach(b=>b.classList.remove('active'));
    const tab = document.querySelector(`#nav-tabs button[data-page="${page}"]`);
    if(tab) tab.classList.add('active');
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
    // ER task
    if(taskEr){
      if(!erWindow.classList.contains('hidden')){
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
    [taskEr, taskProject, taskWordpad, taskMusic].forEach(el=>{ if(el){ el.classList.remove('left','right'); } });
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

  // toggle by clicking WordPad taskbar button
  if(taskWordpad){
    taskWordpad.addEventListener('click',()=>{
      if(!wordpadWin) return;
      if(wordpadWin.classList.contains('hidden')){
        if(wordpadIsMinimized) restoreWordpad();
        else openWordpad();
      }
      else { minimizeWordpad(); }
      reflectTaskbar();
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
  let zIndexCounter = 2000;
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
      zIndexCounter += 1;
      winEl.style.zIndex = zIndexCounter;
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
      zIndexCounter += 1; winEl.style.zIndex = zIndexCounter;
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
});
