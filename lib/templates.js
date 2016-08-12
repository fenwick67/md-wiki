//render templates
var models = require('./models');
var _ = require('lodash');
var jade = require('jade');
var fs = require('fs');

// todo: better templating
var pageTpl = jade.compileFile('templates/page.jade');

function renderPage(page,callback){

  var locals = {};
  locals.page = page;
  models.Wiki.findOrCreate(function(er,wiki){

    if (er || !wiki){ return callback (er||new Error('could not retreive')); }

    locals.wiki = wiki;
    return callback(null,pageTpl(locals));
  });
}

module.exports = {
  renderPage:renderPage
}
