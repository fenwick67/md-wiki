//render templates
var models = require('./models');
var _ = require('lodash');
var jade = require('jade');
var _ = require('lodash');

var pageTpl = jade.compileFile('templates/page.jade');

function renderPage(page,callback){
  var locals = {};
  locals.page = page;
  models.Wiki.findOrCreate({},function(er,wiki){

    if (er){ return callback (er); }

    locals.wiki = wiki;
    return callback(null,pageTpl(locals));
  });
}

function renderArticle(page,callback){
  var article = _.extend({},page,{isArticle:true});
  return renderPage(article,callback);
}

function renderSetup(callback){
  //render setup page
  var form = `
  <form method="post">
    <div class="form-group">
      <label for="wikiName">Wiki Name</label>
      <input name="title"  type="text" class="form-control" id="wikiName" placeholder="My Cool Wiki">
    </div>
    <div class="form-group">
      <label for="authentication">Choose Authentication</label>
      <select class="form-control" name="authentication">
        <option>None</option>
        <option>Github org</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  `;
  
  return renderPage({html:form},callback);
}


module.exports = {
  renderArticle:renderArticle,
  renderPage:renderPage,
  renderSetup: renderSetup
}
