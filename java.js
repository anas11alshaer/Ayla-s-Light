/* Ayla’s Light – day/night + message paper logic */
window.onload = () => {
  /* — initial fade-in — */
  document.body.classList.remove('not-loaded');

  /* — day / night toggle — */
  const modeBtn = document.getElementById('modeToggle');
  modeBtn.textContent = '🌙';
  document.body.classList.remove('day-mode');
  modeBtn.addEventListener('click', () => {
    const isDay = document.body.classList.toggle('day-mode');
    modeBtn.textContent = isDay ? '🌞' : '🌙';
  });

  /* — comfort note — */
  const msgBtn   = document.getElementById('messageToggle');
  const note     = document.getElementById('note');
  const closeBtn = document.getElementById('noteClose');
  const noteTxt  = note.querySelector('.note__text');
  const rawText  = noteTxt.textContent.trim();

  /* typewriter helper */
  function typeMessage(text){
    noteTxt.innerHTML = '';
    [...text].forEach((ch,i)=>{
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.animationDelay = `${i*40}ms`;
      noteTxt.appendChild(span);
    });
  }

  function showNote(){
    note.classList.add('note--visible');
    /* wait for flip (0.6 s) before writing */
    setTimeout(()=>typeMessage(rawText), 600);
  }
  function hideNote(){
    note.classList.remove('note--visible');
  }
  function toggleNote(){
    note.classList.contains('note--visible') ? hideNote() : showNote();
  }

  msgBtn .addEventListener('click', toggleNote);
  closeBtn.addEventListener('click', hideNote);
};
