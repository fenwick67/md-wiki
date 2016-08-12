//run build

var serveStatic = require('serve-static');
var express = require('express')
var passport = require('passport');
var Models = require('./lib/models');
var templates = require('./lib/templates');

var app = express();

//serve public and pages folders first
app.use(serveStatic('public'));
app.use(serveStatic('pages'));

app.listen(process.env.PORT || 3000);

app.get('/:pagename',function(req,res){
  if (!req.params.pagename){
    return fourOhFour(res);
  }
  Models.Page.findOne({title:req.params.pagename},function(er,page){
    if (er){return genericError(er,res);}
    if (!page){return fourOhFour(res);}
    templates.renderPage(page,function(er,html){
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

function fourOhFour(res){
  res.status(404);
  res.send('not found ;(');
}

function genericError(er,res){
  res.status(500);
  res.send(er||'internal server error');
}

console.log('listening on '+(process.env.PORT || 3000));
