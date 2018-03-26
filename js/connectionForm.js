var     form = (function() {
  let   connexion = document.getElementById('connexion');
  let   main = document.getElementById('main');
  let   footer = document.getElementById('footer');
  let   pseudof = document.getElementById('pseudo');
  let   passwordf = document.getElementById('password');
  let   sub = document.getElementById('sub');

  main.style.display = 'none';
  footer.style.display = 'none';

  function  checkId() {
    var database = firebase.database();
    var usersRef = database.ref('users');

    usersRef.once('value').then(function(snapshot) {
      if (snapshot.val()[pseudof.value] && snapshot.val()[pseudof.value]['password'] === passwordf.value) {
        firebase.database().ref('users/' + pseudof.value).update({last_connection: Date.now()});
        connexion.style.display = 'none';
        main.style.display = 'block';
        footer.style.display = 'block';
      }
      else {
        pseudof.value = '';
        passwordf.value = '';
      }
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
