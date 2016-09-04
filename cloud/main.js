
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("alertAuthor", function(request,response){
  var query = new Parse.Query(Parse.Installation);
  var message = request.params.message;
  var author = request.params.author;
  query.equalTo('user', author);

  Parse.Push.send({
    where: query,
    data : { 
      alert: message,
      badge: "Increment",
      sound: "",
    }
    }, {
    success: function() {
        consol.log("success");
    },
    error: function(error) {
        console.log(error);
    }
  });
});
