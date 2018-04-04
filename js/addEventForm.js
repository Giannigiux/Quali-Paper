(function() {
  let   eventsRef = firebase.database().ref('events');
  let   input = document.getElementsByTagName('input');
  let   select = document.getElementById('type');
  let   sub = document.getElementById('sub');
  let   eventsList = [];
  let   myData = [];

  // On récupère les événements dans une liste
  eventsRef.once('value').then(function(snapshot) {
    snapshot.val().forEach(function(element) {
      eventsList.push(element);
    });
  });

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

  // Ajout du nouvel élément à la base de données
  function    eventToFirebase(myData) {
    var   number = 0;
    var   lastId = eventsList[eventsList.length - 1].id;

    eventsRef.once('value').then(function(snapshot) {
      number = snapshot.val().length;
      firebase.database().ref('events/' + (lastId + 1).toString()).set({
        date: myData[3],
        descriptif: myData[5],
        duree: myData[2],
        heure: myData[4],
        lieu: myData[1],
        pictogramme: myData[6],
        titre: myData[0],
        id: lastId + 1
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
        (!parseInt(this.value) || this.value < 1 || this.value > 24) ? incomplete(this, 'Heure comprise entre 0 et 23') : complete(this);
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
    (this.value === 'none') ? incomplete(this, 'Vous devez choisir un type.') : complete(this);
  });

  // Validation du formulaire
  sub.addEventListener('click', function(e) {
    var   check = true;

    for (let currentInput of input)
    {
      switch (currentInput.id)  {
        case 'titre':
        (currentInput.value.length < 2 || currentInput.value.length > 16) ? (check = false) : (myData.push(currentInput.value));
        break;
        case 'lieu':
        (currentInput.value.length < 2 || currentInput.value.length > 20) ? (check = false) : (myData.push(currentInput.value));
        break;
        case 'duree':
        (!parseInt(currentInput.value) || currentInput.value < 1 || currentInput.value > 24) ? (check = false) : (myData.push(currentInput.value));
        break;
        case 'heure':
        (!parseInt(currentInput.value) || currentInput.value < 1 || currentInput.value > 24) ? (check = false) : (myData.push(currentInput.value));
        break;
        case 'descriptif':
        (currentInput.value.length < 1 || currentInput.value.length > 125) ? (check = false) : (myData.push(currentInput.value));
        break;
        case 'date':
        (!currentInput.value) ? (check = false) : (myData.push(currentInput.value));
        break;
      }
    }

    // Vérification du select
    (select.value === 'none') ? (check = false) : (myData.push(select.value));

    // Si tout est bon, on ajoute à la base de données
    (check === true) ? (eventToFirebase(myData)) : (myData = []);
  });

})();
