var express     = require('express');
var ParseServer = require('parse-server').ParseServer;
var path        = require('path');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride   = require("method-override");

//var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
//
//if (!databaseUri) {
//  console.log('DATABASE_URI not specified, falling back to localhost.');
//}

var api = new ParseServer({
  databaseURI : 'mongodb://gellert:5917738ljh@ds029446.mlab.com:29446/uniplusdev',
  cloud       : process.env.CLOUD_CODE_MAIN || './cloud/main.js',
  appId       : process.env.APP_ID || 'Zj9b976AHw3b7SkOgCKzaEjB7bjJoPh2XcyxTcgU',
  masterKey   : process.env.MASTER_KEY || 'T5DQ2mT8LNAp0Enn9Y3ERU0iY93sT06PctF6Dt4g', //Add your master key here. Keep it secret!
  fileKey     : process.env.FILE_KEY || '4c095515-1d61-492f-80ae-d4a299e69327', // Add the file key to provide access to files already hosted on Parse
  serverURL   : process.env.SERVER_URL || 'http://uniplusdevserver.herokuapp.com/parse',  // Don't forget to change to https if needed
  // liveQuery   : {
  //       classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  //   },
  push        : {
                ios: [{
                    pfx        : './Cert/UniPlusPush.p12', // Dev PFX or P12
                    bundleId   : 'com.JiaheLi.UniPlus',
                    production : false
                    //adaptor    : ParsePushAdapter
                  },{
                    pfx        : './Cert/UniPlusPushProduction.p12', // Prod PFX or P12
                    bundleId   : 'com.JiaheLi.UniPlus',  
                    production : true // Prod
                    //adaptor    : ParsePushAdapter
                  }]
                }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

Parse.initialize("Zj9b976AHw3b7SkOgCKzaEjB7bjJoPh2XcyxTcgU");
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

var app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public')));

var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.use(cookieSession({
  name: 'form-cookie',
  secret: 'form-key',
  maxAge: 15724800000
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
  res.status(200).send('Hello world');
});

app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
//ParseServer.createLiveQueryServer(httpServer);
