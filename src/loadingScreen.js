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
    overlay.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('loadingScreenDone', {}));
    var ui = document.getElementById('ui');
    if(ui) ui.style.pointerEvents = 'none';
    setTimeout(function(){ if(overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 500);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var overlay = createOverlay();
    if(!overlay) return;

    updateMobileWarning();
    window.addEventListener('resize', updateMobileWarning);

    var startBtn = overlay.querySelector('.bios-start-button');
    if(startBtn) startBtn.addEventListener('click', start);

    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('debug')){
      // auto-start
      start();
      return;
    }

    if(!detectWebGL()){
      showWebGLError();
    }else{
      showStartPopup();
    }
  });
})();
