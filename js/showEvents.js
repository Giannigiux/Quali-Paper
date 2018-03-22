var   showEvents = (function() {
  var eventsRef = firebase.database().ref('events');

  function  dispEvent(element) {
    var   events = document.getElementById('mini-events');
    var   newDiv = document.createElement('div');
    var   h3 = document.createElement('h3');
    var   h3Content = document.createTextNode(element.titre);
    var   p = document.createElement('p');
    var   picto = document.createElement('img');
    var   remove = document.createElement('img');

    newDiv.classList.add('col-sm-3');
    h3.appendChild(picto);
    h3.appendChild(h3Content);
    h3.appendChild(remove);
    p.innerHTML = '<h5>Date : <b>' + element.date + '</b></h5>' + element.descriptif;
    picto.classList.add('picto');
    picto.src = 'pictures/pictos/' + element.pictogramme + '.svg';
    remove.classList.add('remove');
    remove.src = 'pictures/delete.svg';
    newDiv.appendChild(h3);
    newDiv.appendChild(p);
    events.appendChild(newDiv);
  }

  eventsRef.on('value', function(snapshot) {
    snapshot.val().forEach(function(element) {
      dispEvent(element);
    });
  }, function(error) {
    console.log('Error: ' + error.code);
  });
})();
