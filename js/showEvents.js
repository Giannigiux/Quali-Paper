var   showEvents = (function() {
  var eventsRef = firebase.database().ref('events');
  var eventsList = [];
  var miniEvents = document.getElementById('mini-events');
  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var form = document.getElementById('formulaireadv');
  var advanced = document.getElementById('advanced_ok');

  function removeChildren() {
    while (miniEvents.firstChild)
      miniEvents.removeChild(miniEvents.firstChild);
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
      removeChildren();

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
        if (display === true)
          dispEvent(eventsList[e]);
      }
    }
    else {
      // Affichage d'erreur
      error[0].innerHTML = 'Veuillez remplir au moins un champ.';
    }
  }


  // Recherche simple
  function simpleSearch() {
    if (searchInput.value.length < 1) {
      alert('Vous devez spécifier au moins un caractère.');
    }
    else {
      removeChildren();
      for (i = 0; i < eventsList.length; i++) {
        if (eventsList[i].titre.toUpperCase().search(searchInput.value.toUpperCase()) > -1)
          dispEvent(eventsList[i]);
      }
    }
  }

  // On ordonne les événements par date
  function  orderEventsByDate() {
    eventsList.sort(function(event1, event2) {
      return new Date(event2.date) - new Date(event1.date);
    });
  }

  // Suppression d'un événement
  function  deleteEvent() {
    // On récupère tous les remove
    var   events = document.getElementsByClassName('remove');

    for (i = 0; i < events.length; i++) {
      events[i].addEventListener('click', function(e) {
        if (prompt('Entrer le mot de passe pour confirmer la suppression :') === 'password') {
          firebase.database().ref('events/' + this.id.toString()).remove();
          window.location = 'events.html';
        }
      });
    }
  }

  // Affichage d'un événement
  function  dispEvent(event) {
    var   h3Content = document.createTextNode(event.titre);
    var   events = document.getElementById('mini-events');
    var   newDiv = document.createElement('div');
    var   h3 = document.createElement('h3');
    var   p = document.createElement('p');
    var   picto = document.createElement('img');
    var   remove = document.createElement('img');

    newDiv.classList.add('col-md-6');
    newDiv.classList.add('col-lg-4');
    h3.appendChild(picto);
    h3.appendChild(h3Content);
    h3.appendChild(remove);
    p.innerHTML = '<h5><b>Date : </b>' + event.date + ' à ' + event.heure + 'h</h5><h5><b>Durée : </b>' + event.duree + 'h</h5></h5><h5><b>Lieu : </b>' + event.lieu + '</h5>' + event.descriptif;
    picto.classList.add('picto');
    picto.src = 'pictures/pictos/' + event.pictogramme + '.svg';
    picto.title = event.pictogramme;
    remove.classList.add('remove');
    remove.title = 'Supprimer';
    remove.src = 'pictures/delete.svg';
    remove.id = event.id;
    newDiv.appendChild(h3);
    newDiv.appendChild(p);
    events.appendChild(newDiv);

    // On affiche "grisés" les événements passés
    var myDate = event.date.split('-');

    myDate = myDate[1] + '/' + myDate[2] + '/' + myDate[0];
    myDate = new Date(myDate).getTime();
    if (myDate < Date.now())
      newDiv.style.opacity = 0.5;
  }

  eventsRef.once('value').then(function(snapshot) {
    // On parcoure chaque événement
    snapshot.val().forEach(function(element) {
      // On ajoute chaque événement dans un tableau
      eventsList.push(element);
    });
    // On met les événements dans l'ordre décroissant
    orderEventsByDate();
    // On affiche les événements
    for (i = 0; i < eventsList.length; i++)
      dispEvent(eventsList[i]);
    // On ajoute un événement au click pour supprimer les événements
    deleteEvent();
  }, function(error) {
    console.log('Error: ' + error.code);
  });

  // Click sur bouton de recherche
  searchBtn.addEventListener('click', function(e) {
    simpleSearch();
    deleteEvent();
  });

  // Appuyer sur Enter
  document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      simpleSearch();
      deleteEvent();
    }
  });

  // Click sur bouton de recherche avancée
  advanced.addEventListener('click', function(e) {
    advancedForm();
    deleteEvent();
  });
})();
