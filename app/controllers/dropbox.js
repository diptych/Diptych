var fs = require('fs')
,	dbox  = require("dbox")
,	http = require("http")
,	config = require('../../config/config.js')

/*
Dropbox uses OAuth for a 3-step flow:
	1. Obtaining a temporary request token
	2. Directing the user to dropbox.com to authorize your app
	3. Acquiring a permanent access token
*/

// Step 1
// Read Dropbox keys into the configuration protocol.
var APP_KEY = fs.readFileSync('./dropbox_app_key.txt').toString();
var APP_SECRET = fs.readFileSync('./dropbox_app_secret.txt').toString();
// populate dropbox helper app with secret keys
var dropbox = dbox.app({ "app_key" : APP_KEY, "app_secret" : APP_SECRET });


// Step 2 
function requestToken(responce, request){
	dropbox.requesttoken(function(status, request_token){
		// storing the returned request token in a session cookie for use in the next step
		responce.send(200, {
			"Set-Cookie" : ["oat=" + request_token.oauth_token,
							"oats=" + request_token.oauth_token_secret]
		});
		//redirection happens by writing a piece of javascript to our http responce
		responce.write(	"<script>window.location='https://www.dropbox.com/1/oauth/authorize"+
					"?oauth_token=" + request_token.oauth_token + 
					"&oauth_callback=" + callbackHost + "/authorized" + ";</script>");
		responce.end();
	});
}

function accessToken(req, res) {
    var req_token = {oauth_token : req.cookies.oat, oauth_token_secret : req.cookies.oats};
    dropbox.accesstoken(req_token, function(status, access_token) {
        if (status == 401) {
            res.write("Sorry, Dropbox reported an error: " + JSON.stringify(access_token));
        }
        else {
            var expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
            res.writeHead(302, {
                "Set-Cookie" : "uid=" + access_token.uid + "; Expires=" + expiry.toUTCString(),
                "Location" : "/"
            });
            db.collection("user", function(err, collection) {
                var entry = {};
                entry.uid = access_token.uid;
                entry.oauth_token = access_token.oauth_token;
                entry.oauth_token_secret = access_token.oauth_token_secret;
                collection.update({"uid": access_token.uid}, {$set: entry}, {upsert:true});
            });
        }
        res.end();
    });
}

exports.requestToken = requestToken;
exports.accessToken = accessToken;

