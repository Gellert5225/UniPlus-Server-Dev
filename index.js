var express        = require('express');
var ParseServer    = require('parse-server').ParseServer;
var path           = require('path');
var cookieSession  = require('cookie-session');
var bodyParser     = require('body-parser');
var methodOverride = require("method-override");
var indexRoute     = require('./routes/index.js');
var testRoute      = require('./routes/test.js');
var flash          = require("connect-flash");

var mountPath = process.env.PARSE_MOUNT || '/parse';

var api = new ParseServer({
  databaseURI : 'mongodb://gellert:5917738ljh@ds029446.mlab.com:29446/uniplusdev',
  cloud       : process.env.CLOUD_CODE_MAIN || './cloud/main.js',
  appId       : process.env.APP_ID || 'Zj9b976AHw3b7SkOgCKzaEjB7bjJoPh2XcyxTcgU',
  masterKey   : process.env.MASTER_KEY || 'T5DQ2mT8LNAp0Enn9Y3ERU0iY93sT06PctF6Dt4g', //Add your master key here. Keep it secret!
  fileKey     : process.env.FILE_KEY || '4c095515-1d61-492f-80ae-d4a299e69327', // Add the file key to provide access to files already hosted on Parse
  serverURL   : process.env.SERVER_URL || 'http://uniplusdevserver.herokuapp.com/parse',  // Don't forget to change to https if needed
  push: {
    ios: [{
      pfx        : './Cert/UniPlus.p12', // Dev PFX or P12
      topic   : 'com.JiaheLi.UniPlus',
      production : false
      //adaptor    : ParsePushAdapter
    },{
      pfx        : './Cert/UniPlus.p12', // Prod PFX or P12
      topic   : 'com.JiaheLi.UniPlus',
      production : true // Prod
      //adaptor    : ParsePushAdapter
    }]
  }
});

// initialize Parse API
Parse.initialize("Zj9b976AHw3b7SkOgCKzaEjB7bjJoPh2XcyxTcgU");
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

var app = express();

// setup front-end views
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(mountPath, api);
app.use(flash());

app.use(cookieSession({
  name: 'form-cookie',
  secret: 'form-key',
  maxAge: 15724800000
}));

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user;
  res.locals.loginErrorFlash = req.flash("loginError");
  res.locals.signupErrorFlash = req.flash("signupError");
  res.locals.successFlash = req.flash("success");
  next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(indexRoute);
app.use(testRoute);

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
  console.log('UniPlus development server running on port ' + port + '.');
});

// This will enable the Live Query real-time server
//ParseServer.createLiveQueryServer(httpServer);
