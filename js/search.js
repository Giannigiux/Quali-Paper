(function() {
  var eventsRef = firebase.database().ref('events');
  var eventsList = [];
  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var form = document.getElementById('formulaireadv');
  var advanced = document.getElementById('advanced_ok');

  // Ne plus cacher l'événement

  function eventBlock(eventID) {
    var   eventsHTML = document.getElementsByClassName('col-lg-4');

    for (ev = 0; ev < eventsHTML.length; ev++) {
      if (eventsHTML[ev].children[0].children[1].id === eventID.toString()) {
        eventsHTML[ev].style.display = 'block';
      }
    }
  }

  // Cacher l'événement

  function hideEvent(eventID) {
    var   eventsHTML = document.getElementsByClassName('col-lg-4');

    for (ev = 0; ev < eventsHTML.length; ev++) {
      if (eventsHTML[ev].children[0].children[1].id === eventID.toString()) {
        eventsHTML[ev].style.display = 'none';
      }
    }
  }

  function advancedForm() {
    var    inputTab = form.getElementsByClassName('inputadv');
    var    pictos = document.getElementsByClassName('checkadv');
    var    error = form.getElementsByClassName('error');
    var    compteur = 0;

    // On coute les champs remplis
    for (i = 0; i < inputTab.length; i++)
      (inputTab[i].value) ? (compteur++) : (compteur = compteur);
    for (i = 0; i < pictos.length; i++)
      (pictos[i].checked === true) ? (compteur++) : (compteur = compteur);

    if (compteur > 0) {
      // Si au moins un champ est rempli, on ferme le modal et on supprime tous les événements affichés
      $('#advancedModal').modal('hide');

      // On boucle sur tous les événements de la bdd
      for (e = 0; e < eventsList.length; e++) {
        var   display = true;

        // On boucle sur nos champs
        for (i = 0; i < inputTab.length; i++) {
          if (inputTab[i]) {
            // On récupère le nom du champ correspondant exactement aux propriétés des évenements de firebase
            var champ = inputTab[i].id.substr(0, inputTab[i].id.length - 3);

            // Si on ne trouve pas une des recherches dans un événement, on ne l'affichera pas
            if (eventsList[e][champ].toUpperCase().search(inputTab[i].value.toUpperCase()) <= -1)
              display = false;
          }
        }
        var tmp = true, nbCheck = 0;

        // On vérifie chaque bouton checkbox.
        for (p = 0; p < pictos.length; p++) {
          if (pictos[p].value === eventsList[e].pictogramme && pictos[p].checked === false)
            tmp = false;
          if (pictos[p].checked === true)
            nbCheck++;
        }

        // Si au moins un checkbox est coché mais pas celui de l'événement, on n'affichera pas l'événement
        if (tmp === false && display === true && nbCheck !== 0)
          display = false;

        // Affichage de l'événement
        (display === true) ? eventBlock(eventsList[e].id) : hideEvent(eventsList[e].id);
      }
    }
    else {
      // Affichage d'erreur
      error[0].innerHTML = 'Veuillez remplir au moins un champ.';
    }
  }

  // Recherche simple
  function simpleSearch() {
    if (searchInput.value.length >= 1) {
      for (i = 0; i < eventsList.length; i++) {
        if (eventsList[i].titre.toUpperCase().search(searchInput.value.toUpperCase()) < 0)
          hideEvent(eventsList[i].id);
        else
          eventBlock(eventsList[i].id);
      }
    }
    else {
      for (i = 0; i < eventsList.length; i++)
        eventBlock(eventsList[i].id)
    }
  }

  eventsRef.once('value').then(function(snapshot) {
    // On parcoure chaque événement
    snapshot.val().forEach(function(element) {
      // On ajoute chaque événement dans un tableau
      eventsList.push(element);
    });
  }, function(error) {
    console.log('Error: ' + error.code);
  });

  // Click sur bouton de recherche
  searchBtn.addEventListener('click', function(e) {
    simpleSearch();
  });

  // Appuyer sur Enter
  document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter')
      simpleSearch();
  });

  // Click sur bouton de recherche avancée
  advanced.addEventListener('click', function(e) {
    advancedForm();
  });
})();
