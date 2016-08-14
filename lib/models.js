// mongoose models: Paage and Wiki

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');
var findOrCreate = require('mongoose-findorcreate');
var slugify = require('./slug');

////////////////////////////////////////////////////////////
// Article is a mongoose model
var ArticleSchema = new Schema({
  title:        { type:String , default:"Empty Article" },
  category:     { type:String , default:"default"},
  categorySlug: { type:String , default:"default"},
  slug:         { type:String , default: slugify("Empty Article")},
  html:         { type:String , default:"<p>This is an empty Article.</p>" },
  markdown:     { type:String , default:"" },
  metadata:     { type: {}    , default: {} }
});
ArticleSchema.plugin(findOrCreate);
ArticleSchema.pre('save',function(next){
  this.categorySlug = slugify(this.category||'');
  this.slug = slugify(this.title||'');
  next();
});

var Article = mongoose.model('Article', ArticleSchema);

////////////////////////////////////////////////////////////
// Wiki is a mongoose model too
var WikiSchema = new Schema({
  title: { type:String , default:"My Wiki!" },
  setUp: {type:Boolean,default:false}
});
WikiSchema.plugin(findOrCreate);

var Wiki = mongoose.model('Wiki', WikiSchema);

//////////////////////////////////////////////////////////
// initialize


//////////////////////////////////////////////////////////
module.exports = {
  Article:Article,
  Wiki:Wiki
};
