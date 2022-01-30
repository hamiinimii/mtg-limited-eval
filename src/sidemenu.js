const btn = document.querySelector('.btn_menu');
const side = document.querySelector('.side');

btn.addEventListener('click', () => {
  side.classList.toggle('open-menu')
});
