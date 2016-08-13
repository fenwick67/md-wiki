//run build

var serveStatic = require('serve-static');
var express = require('express')
var passport = require('passport');
var Models = require('./lib/models');
var templates = require('./lib/templates');
var bodyParser = require('body-parser');

var app = express();

//serve public and pages folders first
app.use(serveStatic('public'));
app.use(serveStatic('pages'));

app.listen(process.env.PORT || 3000);

app.get('/wiki/:pagename',function(req,res){
  if (!req.params.pagename){
    return fourOhFour(res);
  }
  Models.Article.findOne({title:req.params.pagename},function(er,article){
    if (er){return genericError(er,res);}
    if (!article){return fourOhFour(res);}
    templates.renderArticle(article,function(er,html){
      if(er){return genericError(er,res);}
      res.status(200);
      return res.send(html);
    })
  });
});

app.get('/',function(req,res){
  templates.renderPage({},function(er,html){
    if(er){return genericError(er,res);}
    res.status(200);
    return res.send(html);
  });
});

app.get('/setup',function(req,res){
  templates.renderSetup(function(er,html){
    if(er){return genericError(er,res);}
    res.status(200);
    return res.send(html);
  });
});

var bpm = bodyParser.urlencoded({ extended: false });

app.post('/setup',bpm,function(req,res){
  //do something
  Models.Wiki.findOne({},function(er,wiki){
    if (er || !wiki) return genericError(er,res);
    wiki.title = req.body.title;
    wiki.auth = false;
    wiki.setUp = true;
    wiki.save(function(er){
      if (er) return genericError(er,res);
      return res.redirect('/');
    });
  });
});

function fourOhFour(res){
  res.status(404);
  res.send('not found ;(');
}

function genericError(er,res){
  res.status(500);
  res.send(er?er.toString():'internal server error');
  if(er){console.error('handled error: ',er)}
}

console.log('listening on '+(process.env.PORT || 3000));
