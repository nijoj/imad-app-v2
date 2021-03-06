var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');
var config = {
  host: 'db.imad.hasura-app.io',
  user: 'nijoj',
  database: 'nijoj',
  port:'5432',
  password:'db-nijoj-88077'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'random value',
    cookie:{maxAge:1000*60*60*24*30}
}));

/*var articles={
     'pageone':{
        title:'My page 1',
        heading:'page one',
        date:'19-02-2017',
        content:`<p>This is my content for page one.This is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page one</p>
            <p>This is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page one</p>`
    },
     'pagetwo':{ 
        title:'My page 2',
        heading:'page two',
        date:'19-02-2017',
        content:`<p>This is my content for page two.This is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page one</p>
            <p>This is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page one</p>`},
     'pagethree':{ 
        title:'My page 3',
        heading:'page three',
        date:'19-02-2017',
        content:`<p>This is my content for page three.This is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page one</p>
            <p>This is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page oneThis is my content for page one</p>`}
}*/ //Deleted and taken from database
function createTemplate(data){
    var heading=data.heading;
    var date=data.date;
    var content=data.content;
var htmlTemplate=`
    <!DOCTYPE html>
    <html>
        <head
            <link href="/ui/style.css" rel="stylesheet" type="text/css"/>
            <title>My first page</title>
            <meta name="viewport" content="width=device-width, initial-scaled=1"/>
        </head>
        <body>
            <div class="container>
                <div>
                     <a href="/">Home</a>
                </div>
                </hr>
                <h3>    
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>`;
    return htmlTemplate;
}
//hashing
function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
    var hashedString=hash(req.params.input,'salt');
    res.send(hashedString);
});
//user create(p11)
app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send("user successfully created:"+username);
        }
    });
});
//usr login(p11)
app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.send(403).send('username/password is invalid');
            }
            else{
                var dbString=result.rows[0].password;
                var salt=dbString.split('$')[2];
                var hashedPassword=hash(password,salt);
                if(hashedPassword===dbString){
                    req.session.auth={userId:result.rows[0].id};
                    res.send('credentials correct');
                }
                else{
                    res.send(403).send('username/password is invalid');
                }
            }
        }
    });
});
//check login
app.get('/check-login',function(req,res){
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in:'+ req.session.auth.userId.toString());
   } else{
       res.send('You are not logged in');
   }
});
//logout
app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send('logged out');
});
//database
var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('select * from test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result));
        }
    })    
});
//counter endpoint
var counter=0;
app.get('/counter',function(req,res){
    counter++;
    res.send(counter.toString());
});
//names submit
var names=[];
app.get('/submit_name',function(req,res){
    var name=req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});
app.get('/articles/:articleName', function (req, res) {
    pool.query("SELECT * FROM article WHERE title= $1",[req.params.articleName], function(err,result){
        if (err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.status(404).send('Article not found');
            }
            else{
                var articleData= result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    })
});   


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/article1', function (req, res) {
  res.send('Article one requested and will be serverd here');
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
