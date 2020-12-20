var Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const listener = server.listen(3002, function() {
  console.log('Port number: ' + listener.address().port);
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
  consumer_key:         'JWWAmmUuC32uzalf5nTDHEXFf',
  consumer_secret:      'bcNhC4kzNr5EMD7xtoAyjs8Wl0EpqaYDjMr2hDKD4x4RGHIF5Q',
  access_token:         '1330200043895263234-ri5oHvW6bQ1BYCbxdSTeKX6HEIf9eI',
  access_token_secret:  'uN0rqQqdo5QSTZYKYhD32nyq8oYtqXeaFf33B250Fxgqy',
});
  