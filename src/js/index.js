document.querySelector('#section-tours').addEventListener('click', (e) => {
  let btn = e.target;
  if (btn.className.includes('btn-card')) {
   document.querySelector('body').classList.add('modal-open');

  }
});


document.querySelector('#section-popups').addEventListener('click', (e) => {
  let btn = e.target;

  if (btn.className.includes('popup__close')) {
     let body = document.querySelector('body');
    body.classList.remove('modal-open')
  }
});













let closeBtns = document.querySelectorAll('.popup__close');
console.log(closeBtns);
closeBtns.addEventListener('click', (e) => {
  let body = document.querySelector('body');
  console.log(e.target);
  body.classList.remove('modal-open')
})