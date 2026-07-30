(function(){
  function makeParticles(root){
    const count = Number(root.dataset.particles || 24);
    for(let i=0;i<count;i++){
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 2 + Math.random() * 5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.setProperty('--dx', (Math.random() * 100 - 50) + 'vw');
      p.style.setProperty('--dy', (Math.random() * 100 - 50) + 'vh');
      p.style.setProperty('--dur', (18 + Math.random() * 20) + 's');
      p.style.animationDelay = (-Math.random() * 18) + 's';
      p.style.opacity = (.15 + Math.random() * .65).toFixed(2);
      root.appendChild(p);
    }
  }
  document.querySelectorAll('[data-particles]').forEach(makeParticles);
  // Personalized guest name from URL:
  // Example: https://domain.com/?to=Jessica
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameElement = document.getElementById('guestName');
  const wishNameInput = document.getElementById('wishName');
  const guestParam = urlParams.get('to');

  const guestName = guestParam
    ? guestParam.trim().replace(/\s+/g, ' ').slice(0, 80)
    : 'Bapak/Ibu/Saudara/i';

  if(guestNameElement){
    guestNameElement.textContent = guestName;
  }

  // Automatically fill the guest name in the wishes form
  if(wishNameInput && guestParam){
    wishNameInput.value = guestName;
  }
  if(document.body.classList.contains('cover-locked')){
    if(window.location.hash && window.location.hash !== '#cover'){
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
    window.addEventListener('load', () => window.scrollTo(0, 0));
  }

  const openButton = document.getElementById('openInvitation');
  const quoteSection = document.getElementById('quote');
  let invitationOpened = !document.body.classList.contains('cover-locked');

  function openInvitation(){
    invitationOpened = true;
    document.body.classList.remove('cover-locked');
    document.body.classList.add('invitation-opened');
    setTimeout(() => {
      if(quoteSection){
        quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }

  if(openButton){
  openButton.addEventListener('click', async () => {
    openInvitation();
    await playMusic();
  });
}
  document.querySelectorAll('#bottomNav a').forEach(anchor => {
    anchor.addEventListener('click', event => {
      if(!invitationOpened && anchor.getAttribute('href') !== '#cover'){
        event.preventDefault();
        openInvitation();
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: .18 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const links = Array.from(document.querySelectorAll('#bottomNav a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { threshold: .54 });
  sections.forEach(section => activeObserver.observe(section));

  const audio = document.getElementById('audio');
const musicToggle = document.getElementById('musicToggle');

async function playMusic(){
  if(!audio || !musicToggle) return;

  try{
    audio.volume = 0.7;
    await audio.play();

    musicToggle.classList.remove('off');
    musicToggle.setAttribute('aria-label', 'Pause music');
  }catch(err){
    musicToggle.classList.add('off');
    musicToggle.setAttribute('aria-label', 'Play music');
    console.warn('Audio could not be played:', err);
  }
}

function pauseMusic(){
  if(!audio || !musicToggle) return;

  audio.pause();
  musicToggle.classList.add('off');
  musicToggle.setAttribute('aria-label', 'Play music');
}

if(audio && musicToggle){
  musicToggle.classList.add('off');
  musicToggle.setAttribute('aria-label', 'Play music');

  musicToggle.addEventListener('click', async () => {
    if(audio.paused){
      await playMusic();
    }else{
      pauseMusic();
    }
  });
}

  const video = document.querySelector('.cover-video');
  if(video){ video.addEventListener('error', () => { video.style.display = 'none'; }); }

  const target = new Date('2026-10-23T15:30:00+07:00').getTime();
  const fill = (id, value) => { const el = document.getElementById(id); if(el) el.textContent = String(value).padStart(2, '0'); };
  function tick(){
    const diff = Math.max(0, target - Date.now());
    fill('days', Math.floor(diff / 86400000));
    fill('hours', Math.floor(diff / 3600000) % 24);
    fill('minutes', Math.floor(diff / 60000) % 60);
    fill('seconds', Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

function addWish(){
  const name = document.getElementById('wishName');
  const text = document.getElementById('wishText');
  const list = document.getElementById('wishList');
  if(!name || !text || !list || !name.value.trim() || !text.value.trim()) return;
  const item = document.createElement('article');
  item.className = 'wish-item';
  item.innerHTML = '<b></b><span>Just now</span><p></p>';
  item.querySelector('b').textContent = name.value.trim();
  item.querySelector('p').textContent = text.value.trim();
  list.prepend(item);
  name.value = '';
  text.value = '';
}

function copyText(value, button){
  if(navigator.clipboard){
    navigator.clipboard.writeText(value).then(() => {
      if(button){ const old = button.textContent; button.textContent = 'Copied'; setTimeout(() => button.textContent = old, 1300); }
    }).catch(() => { if(button) button.textContent = value; });
  }else if(button){ button.textContent = value; }
}
