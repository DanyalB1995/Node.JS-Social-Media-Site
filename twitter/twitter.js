var Twitter = require('twitter');
var http = require('http');
var port = process.env.PORT || 1337;

var tags = "something";

if (typeof window === 'undefined') {
    global.window = {}
}

//get tags
module.exports.getTags = function(tag){
    window[tags] = tag;
    console.log("here");
}

//Twitter Keys
var client = new Twitter({
    consumer_key: 'W0qmXQ9ZcZ331lRRSOH92vfoo',
    consumer_secret: 'ursoNPsoAPgBfLaAi4UvOqSoDO89fGAXRX2GrjIpOMeXWa4LPg',
    access_token_key: '389398408-Rq0ejKRxZNx1ymPIUXZwBqeBrM5MVvbeZ6RQimVa',
    access_token_secret: '1yAmkT8CDOIr1WcklgDioEYFv5KII9ye506EeCzNFblTH'
});

//Get Posts
http.createServer(function(request, response) {
   
    response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'  });
    
    client.get('search/tweets', {q: window[tags], count: '40'}, function(error, tweets){

        var json = [];
        for (var i =0; i< tweets.statuses.length ; i++)
        {
            json.push({name: tweets.statuses[i].user.name, text: tweets.statuses[i].text, pic: tweets.statuses[i].user.profile_image_url_https});
        }

        response.end(JSON.stringify(json));
    });
}).listen(port);



