const clear = document.getElementById('clear-distance');

clear.addEventListener('click', (clickEvent) => {
       clickEvent.preventDefault();
       document.getElementById('location').value = '';
       document.querySelector('input[type=radio]:checked').checked = false;
});