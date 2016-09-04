

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

// iOS push testing
Parse.Cloud.define("iosPushTest", function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user                                                                                                                               
  var params = request.params;
  var user = request.user;

  // Our "Message" class has a "text" key with the body of the message itself                                                                                                                                    
  var messageText = params.text;

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo('deviceType', 'ios'); // targeting iOS devices only                                                                                                                                          

  Parse.Push.send({
    where: pushQuery, // Set our Installation query                                                                                                                                                              
    data: {
      alert: "Message: " + messageText
    }
  }, { success: function() {
      console.log("#### PUSH OK");
  }, error: function(error) {
      console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});

//like action
Parse.Cloud.define("likePost", function(request, response){
    var author  = request.params.author;
    var message = request.params.message;
    
    var query = new Parse.Query(Parse.User);
    query.equalTo('username', author);
    
    var pushQuery = new Parse.Query(Parse.Installation);
    pushQuery.matchesQuery("user", query);
    
    Parse.Push.send({
        where: pushQuery,
        data: {
            alert: message
        }
    },{ success: function() {
            console.log("#### PUSH OK");
        }, error: function(error) {
            console.log("#### PUSH ERROR" + error.message);
        }, useMasterKey: true});

        response.success('success');
    });