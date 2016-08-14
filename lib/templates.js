//render templates
var _ = require('lodash');
var jade = require('jade');
var _ = require('lodash');

var pageTpl = jade.compileFile('templates/page.jade');

function renderPage(page,params){
  var locals = _.clone(params);
  locals.page = page;
  return pageTpl(locals);
}

function renderArticle(page,params){
  var article = _.extend({},page,{isArticle:true});
  return renderPage(article,params);
}

function renderNewArticle(params){
  var html = `
  <form method="post">
    <div class="form-group">
      <label for="articleName">Article Name</label>
      <input name="title"  type="text" class="form-control" id="articleName" placeholder="Neato Article">
    </div>
    <div class="form-group">
      <label for="category">Category</label>
      <input name="category"  type="text" class="form-control" id="category" placeholder="Neato Article">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  `;
  return renderPage({html:html},params);
}

function renderSetup(params){
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
  
  return renderPage({html:form},params);
}


function renderArticleEditor(article,params){
  var html = `
  <div class="container-fluid">
    <a class="btn btn-default" href="/wiki/${article.slug}">Back to Article</a>
    <button id="submit" class="btn btn-success">Update</button>
    
    <div class="editor-contain">
      <textarea id="editor">${article.markdown||''}</textarea>
    </div>
    <script src="/js/editor.js"></script>
    <script type="text/javascript">edit("${article.slug}")</script>
  </div>
  `;
  var page = {html:html};
  
  return renderPage(page,params);
}

function renderCategory(articles,params){
  params.articles = articles;
  return renderPage({},params);
}

module.exports = {
  renderArticle:renderArticle,
  renderPage:renderPage,
  renderNewArticle:renderNewArticle,
  renderSetup: renderSetup,
  renderArticleEditor:renderArticleEditor,
  renderCategory:renderCategory
}
