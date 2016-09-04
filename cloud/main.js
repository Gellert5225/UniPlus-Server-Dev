Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
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