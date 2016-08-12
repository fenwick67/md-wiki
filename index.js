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

app.listen(process.env.port || 3000);

app.get(':pagename',function(req,res){
  if (!pagename){
    return fourOhFour(res);
  }
  Models.Page.findOne({title:req.params.pagename},function(er,page){
    if (er){return genericError(res);}
    if (!page){return fourOhFour(res);}
    templates.renderPage(page,function(er,html){
      if(er){return genericError(res);}
      res.status(200);
      return res.send(html);
    })
  });
});

function fourOhFour(res){
  res.status(404);
  res.send('not found ;(');
}

function genericError(res){
  res.status(500);
  res.send('internal server error ;)');
}

console.log('listening on '+(process.env.PORT || 3000));
