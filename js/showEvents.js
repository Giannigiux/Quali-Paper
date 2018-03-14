var   showEvents = (function() {
  var content = document.getElementById('content');
  var eventsRef = firebase.database().ref('events');

  eventsRef.on('value', function(snapshot) {
    snapshot.val().forEach(function(element) {
      content.innerHTML += element['titre'];
    });
  }, function(error) {
    console.log('Error: ' + error.code);
  });
})();
