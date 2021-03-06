var Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Server running on ${ port }`);

});
const io = require('socket.io')(server);
var fs = require('fs');

app.use(express.static('public'));





io.on('connection', function(socket) {
  var word = "Vacuna";
  
    T.get('search/tweets', { q: word, count: 1 }, function(err, data, response) {
      var tweetArray=[];
        for (let index = 0; index < data.statuses.length; index++) {
            const tweet = data.statuses[index];
            var tweetbody = {
              'text': tweet.text,
              'userScreenName': "@" + tweet.user.screen_name,
              'userImage': tweet.user.profile_image_url_https,
              'userDescription': tweet.user.description,
              'idTweet' : tweet.id_str,
            }
            try {
              if(tweet.entities.media[0].media_url_https) {
                tweetbody['image'] = tweet.entities.media[0].media_url_https;
              }
            } catch(err) { }
            tweetArray.push(tweetbody);
        }     
        io.emit('allTweet',tweetArray)
    })
    
    socket.on('new-word', function(data){
      word = data;
    });
    
    io.emit('messages' , "Buscando tweets sobre " + word);
    var stream = T.stream('statuses/filter', { track: word, language: 'es' })

    stream.on('tweet', function (tweet) {
        io.emit('tweet',{ 'tweet': tweet });
    })
});












var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
});
  
