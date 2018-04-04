(function() {
  var eventsRef = firebase.database().ref('events');
  var eventsList = [];
  var miniEvents = document.getElementById('mini-events');

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

  // Création d'un événement HTML
  function  createEventHTML(event) {
    var   h3Content = document.createTextNode(event.titre);
    var   events = document.getElementById('mini-events');
    var   newDiv = document.createElement('div');
    var   h3 = document.createElement('h3');
    var   p = document.createElement('p');
    var   picto = document.createElement('img');
    var   remove = document.createElement('img');

    // On affiche "grisés" les événements passés
    var myDate = event.date.split('-');

    myDate = myDate[1] + '/' + myDate[2] + '/' + myDate[0];
    myDate = new Date(myDate).getTime();
    if (myDate < Date.now())
      newDiv.style.opacity = 0.5;

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

    return newDiv;
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
    for (i = 0; i < eventsList.length; i++) {
      document.getElementById('mini-events').appendChild(createEventHTML(eventsList[i]));
    }
    // On ajoute un événement au click pour supprimer les événements
    deleteEvent();
  }, function(error) {
    console.log('Error: ' + error.code);
  });
})();
