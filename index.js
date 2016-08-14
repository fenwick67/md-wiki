//run build

var ecstatic = require('ecstatic');
var express = require('express')
var passport = require('passport');
var Models = require('./lib/models');
var templates = require('./lib/templates');
var bodyParser = require('body-parser');
var slugify = require('./lib/slug');
var parseMd = require('./lib/markdown');



var app = express();

///////////////////////////////////////////////////////////////////////////
// middlewares

// look up wiki for every request
function addWiki(req,res,next){
  Models.Wiki.findOrCreate({},function(er,wiki){
    if (er){ return next (er); }
    req.wiki = wiki;
    return next(null);
  });  
}
app.use(addWiki);
//look up categories for each request
function addCategories(req,res,next){
  Models.Article.distinct('category',function(er,categories){
    if (er){ return next (er); }
    req.categories = categories;
    return next(null);
  });  
}
app.use(addCategories);

var bpm = bodyParser.urlencoded({ extended: false });

///////////////////////////////////////////////////////////////////////////
// routes

////////////////// articles
app.get('/wiki/:slug',function(req,res){
  if (!req.params.slug){
    return fourOhFour(res);
  }
  Models.Article.findOne({slug:req.params.slug},function(er,article){
    if (er){return genericError(er,res);}
    if (!article){return fourOhFour(res);}
    
    return res.status(200).send(templates.renderArticle(article,req));
  });
});

//API for retreiving article
app.get('/api/article/:slug',function(req,res){
  if (!req.params.slug){
    return fourOhFour(res);
  }
  Models.Article.findOne({slug:req.params.slug},function(er,article){
    if (er){return genericError(er,res);}
    if (!article){return fourOhFour(res);}
    return res.status(200).send(article);
  });
});

//API for setting article
app.post('/api/article/:slug',bpm,function(req,res){
  
  //console.log('got edit for '+req.params.slug);
  
  if (!req.params.slug){
    return fourOhFour(res);
  }
  Models.Article.findOne({slug:req.params.slug},function(er,article){
    var r = req.body;
    
    article.markdown = r.markdown || article.markdown;
    try{
      article.html = parseMd(r.markdown);
    }catch(e){
      article.html ='Failed to parse markdown: <pre>'+ r.markdown+'</pre>';
      console.log(article.html);
    }
    
    article.category = r.category||article.category;
    article.title = r.title || article.title;
    
    article.save(function(er){
      if(er) return genericError(er,res);
      //send it back
      return res.status(200).send(article);
    });
  });
});

app.get('/wiki/:slug/edit',function(req,res){
  if (!req.params.slug){
    return fourOhFour(res);
  }
  Models.Article.findOne({slug:req.params.slug},function(er,article){
    if (er){return genericError(er,res);}
    if (!article){return fourOhFour(res);}
    
    return res.status(200).send(templates.renderArticleEditor(article,req));
  });
});

app.post('/wiki/:slug',bpm,function(req,res){
  var slug = req.params.slug;
  if(!slug) return fourOhFour(res);
  
  var md = req.body.markdown;
  if (!md){
    return genericError(new Error('no markdown'),res);
  }
  var html = parseMd(md);
  
  Models.Article.findOne({slug:slug},function(er,article){
    if(er) return genericError(er,res);
    article.markdown = md;
    article.html = html;
    article.save(function(er){
      if(er) return genericError(er,res);
      return res.redirect(req.url);
    });
  });
});

app.get('/new',function(req,res){
  return res.status(200).send(templates.renderNewArticle(req));
});

app.post('/new',bpm,function(req,res){
  var title = req.body.title;
  var category = req.body.category;
  
  if (!title) return genericError(new Error('Title parameter required'),res);

  var q = {title:title};
  if (category){
    q.category=category;
  }
  
  //see if one exists already (eek)
  Models.Article.find(q,function(er,article){
    if (er) return genericError(er,res);
    if (article) return genericError(new Error('Article already exist with name "'+ title +'"'),res);
    
    // create article now
    Models.Article.create(q,function(er){
      if (er) return genericError(er,res);
      res.redirect('/wiki/'+slugify(title));
    });
  });
  
});
////////////////// categories
app.get('/category/:slug',function(req,res){
  var slug = req.params.slug;
  if (!slug) return genericError(new Error('slug param required'),res);
  
  Models.Article.find({categorySlug:slug},function(er,articles){
    if (er) return genericError(er,res);
    return res.status(200).send(templates.renderCategory(articles,req));
  });
});


////////////////// root and setup
app.get('/',function(req,res){
  return res.status(200).send(templates.renderPage({},req));
});

app.get('/setup',function(req,res){
  //TODO refuse if already set up
  res.status(200).send(templates.renderSetup(req))
});

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


// serve static folder lastly
app.use(ecstatic({root:__dirname + '/static'}));

function fourOhFour(res){
  res.status(404);
  res.send('not found ;(');
}
function genericError(er,res){
  res.status(500);
  res.send(er?er.toString():'internal server error');
  if(er){console.error('handled error: ',er)}
}
var port = (process.env.PORT || 3000);
app.listen(port,function(er){
  console.log('listening on '+port);
});
