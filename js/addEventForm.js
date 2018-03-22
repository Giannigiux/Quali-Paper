var     form = (function() {
  let   input = document.getElementsByTagName('input');
  let   select = document.getElementById('type');
  let   sub = document.getElementById('sub');

  // Affichage du champ complété
  function    complete(element) {
    element.classList.add('completeInput');
    element.nextElementSibling.innerHTML = '';
  }

  // Affichage du champ incomplet + message d'erreur
  function    incomplete(element, error) {
    element.classList.remove('completeInput');
    element.classList.add('incompleteInput');
    element.nextElementSibling.innerHTML = error;
  }

  function    eventToFirebase() {
    var   eventsRef = firebase.database().ref('events');
    var   number = 0;

    eventsRef.once('value').then(function(snapshot) {
      number = snapshot.val().length;
      firebase.database().ref('events/' + number.toString()).set({
        date: input[3].value,
        descriptif: input[5].value,
        duree: input[2].value,
        heure: input[4].value,
        lieu: input[1].value,
        pictogramme: select.value,
        titre: input[0].value
      }), window.location = 'events.html';
    });
  }

  // Boucle sur les champs input
  for (let currentInput of input)
  {
    currentInput.addEventListener('focus', function() {
      this.classList.add('focusInput');
      this.classList.remove('incompleteInput');
    });

    // Quand on déselectionne un champ, on le vérifie
    currentInput.addEventListener('blur', function() {
      this.classList.remove('focusInput');
      switch (this.id) {
        case 'titre':
        (this.value.length < 2 || this.value.length > 16) ? incomplete(this, 'Doit comprendre 2 à 16 caractères') : complete(this);
        break;
        case 'lieu':
        (this.value.length < 2 || this.value.length > 20) ? incomplete(this, 'Doit comprendre 2 à 20 caractères') : complete(this);
        break;
        case 'duree':
        (!parseInt(this.value) || this.value < 1 || this.value > 24) ? incomplete(this, 'Nombre compris entre 1 et 24') : complete(this);
        break;
        case 'heure':
        (!parseInt(this.value) || this.value < 0 || this.value > 23) ? incomplete(this, 'Heure comprise entre 0 et 23') : complete(this);
        break;
        case 'descriptif':
        (this.value.length < 1 || this.value.length > 125) ? incomplete(this, 'Doit comprendre 1 à 125 caractères') : complete(this);
        break;
        case 'date':
        (!this.value) ? incomplete(this, 'Aucune date n\'est sélectionnée') : complete(this);
        break;
      }
    });
  }

  // Vérification du select
  select.addEventListener('blur', function() {
    if (this.value === 'none')
      incomplete(this, 'Vous devez choisir un type.')
    else
      complete(this);
  });

  // Validation du formulaire
  sub.addEventListener('click', function(e) {
    var   check = true;
    var   data = [];

    for (let currentInput of input)
    {
      switch (currentInput.id)  {
        case 'titre':
        (currentInput.value.length < 2 || currentInput.value.length > 16) ? (check = false) : (data.push(currentInput.value));
        break;
        case 'lieu':
        (currentInput.value.length < 2 || currentInput.value.length > 20) ? (check = false) : (data.push(currentInput.value));
        break;
        case 'duree':
        (!parseInt(currentInput.value) || currentInput.value < 1 || currentInput.value > 24) ? (check = false) : (data.push(currentInput.value));
        break;
        case 'heure':
        (!parseInt(currentInput.value) || currentInput.value < 0 || currentInput.value > 23) ? (check = false) : (data.push(currentInput.value));
        break;
        case 'descriptif':
        (currentInput.value.length < 1 || currentInput.value.length > 125) ? (check = false) : (data.push(currentInput.value));
        break;
        case 'date':
        (!currentInput.value) ? (check = false) : (data.push(currentInput.value));
        break;
      }
    }

    // Vérification du select
    (select.value === 'none') ? (check = false) : (data.push(select.value));

    // Si tout est bon, on ajoute à la base de données
    (check === true) ? (eventToFirebase()) : (data = []);
  });

})();
