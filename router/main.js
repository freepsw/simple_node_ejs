module.exports = function(app, fs, redis)
{
  app.get('/',function(req,res){
    redis_conn = redis.createClient(6379, '10.250.44.239');
    var args1 = [ 'ip_list',  '+inf', '-inf'];
    var max = 100, min = 1, offset = 0, count = 10;
    var args2 = [ 'ip_list', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
    redis_conn.zrevrangebyscore(args2, function (err, response) {
      if (err) throw err;
      console.log('example1', response);
      console.log('len ' + response.length);
      console.log('1 % 2 ' + 2 % 2);
      var json = [];
      var name;
      for(var i=0, len = response.length; i < len; i++){
        //console.log(response[i]);
        if(i % 2 != 0) {
          json.push({name: name, value: response[i]});
          console.log("d : " + response[i] + " i: " + i);
        }
        else name = response[i];
      }

      console.log(json);
    });

    res.render('index', {
      title: "MY HOMEPAGE",
      length: 5
    })
  });

  app.get('/chart', function(req, res){
    res.render('chart', {
      jdata: "[0, 1, 2, 3]"
    })
  });

  app.get('/barchart', function(req, res){
    res.render('barchart', {
      jdata: "[0, 1, 2, 3]"
    })
  });

  app.get('/barchart3', function(req, res){
    res.render('barchart3', {
      jdata: "[0, 1, 2, 3]"
    })
  });

  app.get('/barchart4', function(req, res){
    res.render('barchart4', {
      jdata: "[0, 1, 2, 3]"
    })
  });

  var json = [];
  /*
  json.push({name: '102.111.111.666', value: .07167, title: 'B'});
  json.push({name: '102.111.111.111', value: .06167, title: 'C'});
  json.push({name: '102.111.111.888', value: .05167, title: 'D'});
  json.push({name: '102.111.111.999', value: .04167, title: 'E'});
  json.push({name: '102.111.111.000', value: .03167, title: 'F'});
  json.push({name: '102.111.111.222', value: .02167, title: 'G'});
  json.push({name: '102.111.111.555', value: .08167, title: 'A'});
  */
  app.get('/getbarchart', function(req, res){
    redis_conn = redis.createClient(6379, '10.250.44.239');

    var max = 100, min = 1, offset = 0, count = 10;
    var args = [ 'ip_list', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
    json = [];
    var j = redis_conn.zrevrangebyscore(args, function (err, response) {
      if (err) throw err;
      //var n0 me;
      for(var i=0, len = response.length; i < len; i++){
        if(i % 2 != 0) {
          json.push({name: name, value: response[i]});
          console.log("d : " + response[i] + " i: " + i);
        }
        else name = response[i];
      }
      res.json(json);
    });
  });

  app.get('/list', function(req, res){
    fs.readFile( __dirname + '/../data/' + 'user.json',
    'utf8',
    function (err, data) {
      console.log(data);
      res.end(data);
    });
  });

  app.get('/getUser/:username', function(req, res){
    fs.readFile( __dirname + '/../data/user.json',
    'utf8',
    function(err, data){
      var users = JSON.parse(data);
      //console('name = ' + req.params.username);
      res.json(users[req.params.username]);
    });
  });

  app.post('/addUser/:username', function(req, res) {
    var result = { };
    var username = req.params.username;

    if(!req.body['password'] || !req.body['name']) {
      result['success'] = 0;
      result['error'] = 'invalid request';
      res.json(result);
      return;
    }

    fs.readFile( __dirname + '/../data/user.json', 'utf8', function(err, data) {
      var users = JSON.parse(data);
      if(users[username]) {
        result['success'] = 0;
        result['error'] = 'duplicated';
        res.json(result);
        return;
      }

      users[username] = req.body;

      fs.writeFile( __dirname + '/../data/user.json',
      JSON.stringify(users, null, '\t'), 'utf8', function(err, data) {
        result = {'success':1};
        res.json(result);
      })
    })
  });


  app.put('/updateUser/:username', function(req, res){

    var result = {  };
    var username = req.params.username;

    // CHECK REQ VALIDITY
    if(!req.body["password"] || !req.body["name"]){
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // LOAD DATA
    fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
      var users = JSON.parse(data);
      // ADD/MODIFY DATA
      users[username] = req.body;

      // SAVE DATA
      fs.writeFile(__dirname + "/../data/user.json",
      JSON.stringify(users, null, '\t'), "utf8", function(err, data){
        result = {"success": 1};
        res.json(result);
      })
    })
  });


  app.delete('/deleteUser/:username', function(req, res){
    var result = { };
    //LOAD DATA
    fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
      var users = JSON.parse(data);

      // IF NOT FOUND
      if(!users[req.params.username]){
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }

      // DELETE FROM DATA
      delete users[req.params.username];

      // SAVE FILE
      fs.writeFile(__dirname + "/../data/user.json",
      JSON.stringify(users, null, '\t'), "utf8", function(err, data){
        result["success"] = 1;
        res.json(result);
        return;
      })
    })

  })


}
