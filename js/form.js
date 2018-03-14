var     form = (function() {
  let   connexion = document.getElementById('connexion');
  let   main = document.getElementById('main');
  let   pseudo = document.getElementById('pseudo');
  let   password = document.getElementById('password');
  let   sub = document.getElementById('sub');

  main.style.display = 'none';

  sub.addEventListener('click', function(e) {
    if (pseudo.value === 'Gianni' && password.value === 'password') {
      connexion.style.display = 'none';
      main.style.display = 'block';
    }
    else {
      pseudo.value = '';
      password.value = '';
    }
  });
})();
