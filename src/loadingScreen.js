(function(){
  // Simple loading overlay controller (non-React)
  function detectWebGL(){
    try{
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!(gl && (typeof WebGLRenderingContext !== 'undefined') && gl instanceof WebGLRenderingContext);
    }catch(e){return false}
  }

  function createOverlay(){
    var overlay = document.getElementById('loading-overlay');
    if(!overlay) return null;
    return overlay;
  }

  function showStartPopup(){
    var popup = document.querySelector('#loading-overlay .start-popup');
    if(popup) popup.classList.add('show');
  }

  function showWebGLError(){
    var err = document.getElementById('webgl-error');
    if(err){ err.classList.remove('hidden'); err.classList.add('show'); }
  }

  function updateMobileWarning(){
    var m = window.innerWidth < 768;
    var el = document.querySelector('#loading-overlay .mobile-warning');
    if(!el) return;
    el.style.display = m ? 'block' : 'none';
  }

  function start(){
    var overlay = createOverlay();
    if(!overlay) return;
    // hide the overlay and show the XP boot screen
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
    var bootEl = document.getElementById('boot');
    if(bootEl){ bootEl.classList.remove('hidden'); bootEl.setAttribute('aria-hidden','false'); }
    // call the app boot sequence (if provided by src/app.js)
    if(typeof window.startBoot === 'function'){
      window.startBoot();
    } else {
      // fallback: dispatch done immediately
      window.dispatchEvent(new CustomEvent('loadingScreenDone', {}));
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var overlay = createOverlay();
    if(!overlay) return;

    updateMobileWarning();
    window.addEventListener('resize', updateMobileWarning);

    var startBtn = overlay.querySelector('.bios-start-button');
    if(startBtn) startBtn.addEventListener('click', start);

    var urlParams = new URLSearchParams(window.location.search);
    var bootEl = document.getElementById('boot');

    if(urlParams.has('debug')){
      // debug: skip boot, show overlay immediately
      if(bootEl) bootEl.classList.add('hidden');
      overlay.classList.remove('hidden');
      overlay.setAttribute('aria-hidden','false');
      if(!detectWebGL()) showWebGLError(); else showStartPopup();
      return;
    }

    // Standard flow: show the overlay and Start popup, await user click.
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');
    if(!detectWebGL()){
      showWebGLError();
    } else {
      showStartPopup();
    }
  });
})();
