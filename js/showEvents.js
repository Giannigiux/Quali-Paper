var   showEvents = (function() {
  var eventsRef = firebase.database().ref('events');
  var number = 0;

  function  deleteEvent() {
    var   events = document.getElementsByClassName('remove');

    for (i = 0; i < events.length; i++) {
      events[i].addEventListener('click', function(e) {
        if (confirm('Supprimer définitivement l\'événement ?')) {
          firebase.database().ref('events/' + this.id.toString()).remove();
          window.location = 'events.html';
        }
      });
    }
  }

  function  dispEvent(element) {
    var   events = document.getElementById('mini-events');
    var   newDiv = document.createElement('div');
    var   h3 = document.createElement('h3');
    var   h3Content = document.createTextNode(element.titre);
    var   p = document.createElement('p');
    var   picto = document.createElement('img');
    var   remove = document.createElement('img');

    newDiv.classList.add('col-md-6');
    newDiv.classList.add('col-lg-4');
    h3.appendChild(picto);
    h3.appendChild(h3Content);
    h3.appendChild(remove);
    p.innerHTML = '<h5><b>Date : </b>' + element.date + ' à ' + element.heure + 'h</h5><h5><b>Durée : </b>' + element.duree + 'h</h5></h5><h5><b>Lieu : </b>' + element.lieu + '</h5>' + element.descriptif;
    picto.classList.add('picto');
    picto.src = 'pictures/pictos/' + element.pictogramme + '.svg';
    remove.classList.add('remove');
    remove.title = 'Supprimer';
    remove.src = 'pictures/delete.svg';
    remove.id = number;
    remove.setAttribute('data-toggle', "modal");
    remove.setAttribute('data-target', "#modalDeleteEvent");
    newDiv.appendChild(h3);
    newDiv.appendChild(p);
    events.appendChild(newDiv);
  }

  eventsRef.once('value').then(function(snapshot) {
    snapshot.val().forEach(function(element) {
      dispEvent(element);
      number++;
    });
    deleteEvent();
  }, function(error) {
    console.log('Error: ' + error.code);
  });
})();
