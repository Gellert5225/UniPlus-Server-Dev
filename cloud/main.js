Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("testPush", function(request, response) {
    var user = request.parame.user;

    var query = new Parse.Query(Parse.User);
    query.equalTo('username', user);

    var pushQuery = new Parse.Query(Parse.Installation);
    pushQuery.matchesQuery("user", query);

    Parse.Push.send({
        where: pushQuery,
        data: {
            alert: "This is a test push"
        }
    }, {
        success: function() {
            // Push was successful
        },
        error: function(error) {
            // Handle error
        }
    });
});

//comment action
Parse.Cloud.define("commentPost", function(request, response){
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

//follow action
Parse.Cloud.define("followUser", function(request, response){
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

//increment user reputation
Parse.Cloud.define("changeReputation", function(request, response) {
    var userId = request.params.userId;
    var repChange = request.params.repChange;

    var User = Parse.Object.extend("_User");
    var user = new User({ objectId: userId });

    user.increment("reputation", repChange);

    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        console.log("Hooray");
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});