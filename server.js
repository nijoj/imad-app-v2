var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
  host: 'db.imad.hasura-app.io',
  user: 'nijoj',
  database: 'nijoj',
  port:'5432',
  password:'db-nijoj-88077'
};

var app = express();
app.use(morgan('combined'));

var articles={
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
}
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
                    ${date}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>`;
    return htmlTemplate;
}
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
app.get('articles/:articleName', function (req, res) {
    pool.query("SELECT * FROM article WHERE title= '"+req.params.articleName+ "'", function(err,result){
        if (err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.status(404).send('Article not found');
            }
            else{
                var articleData= result.rows[0];
                res.send(createTemplate(articles[articleName]));
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
