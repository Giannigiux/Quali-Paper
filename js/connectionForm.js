var     form = (function() {
  let   connexion = document.getElementById('connexion');
  let   main = document.getElementById('main');
  let   pseudof = document.getElementById('pseudo');
  let   passwordf = document.getElementById('password');
  let   sub = document.getElementById('sub');

  main.style.display = 'none';

  function  checkId() {
    var database = firebase.database();
    var usersRef = database.ref('users');

    usersRef.on('value', function(snapshot) {
      if (snapshot.val()[pseudof.value] && snapshot.val()[pseudof.value]['password'] === passwordf.value) {
        connexion.style.display = 'none';
        main.style.display = 'block';
      }
      else {
        pseudof.value = '';
        passwordf.value = '';
      }
    }, function(error) {
      console.log('Error: ' + error.code);
    });
  }

  document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      checkId();
    }
  });

  sub.addEventListener('click', function(e) {
    checkId();
  });
})();
