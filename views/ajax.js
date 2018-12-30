// $.ajax({
//   type: 'put',
//   headers: {
//       'X-Parse-Application-Id': "Zj9b976AHw3b7SkOgCKzaEjB7bjJoPh2XcyxTcgU",
//       "X-Parse-REST-API-Key": "restkey",
//       'X-Parse-Master-Key': "T5DQ2mT8LNAp0Enn9Y3ERU0iY93sT06PctF6Dt4g"
//   },
//   url: "/parse/classes/Questions/" + "<%= question.id %>",
//   data: JSON.stringify({"upVotes" : <%= question.get('upVotes') %> + voteDelta}),
//   contentType: "application/json; charset=utf-8",
//   dataType: "json",
//   success: function(e) {
//     console.log('success');
//   },error: function (xhr, status, error) {
//     console.log('Error: ' + error);
//   }
// });