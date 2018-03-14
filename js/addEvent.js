var form = (function() {
  var   eventsRef = firebase.database().ref('events');
  var   i = 0;

  eventsRef.once('value').then(function(snapshot) {
    i = snapshot.val().length;
    firebase.database().ref('events/' + i.toString()).set({
      date: "14-09-2018",
      descriptif: "L'anniversaire du plus beau de tous : Gotgot",
      duree: "3h",
      heure: "20",
      lieu: "Lille",
      pictogramme: "soirée",
      titre: "Anniversaire Got"
    });
  });
})();
