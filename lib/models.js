// mongoose models: Paage and Wiki

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');
var findOrCreate = require('mongoose-findorcreate');

////////////////////////////////////////////////////////////
// Article is a mongoose model
var ArticleSchema = new Schema({
  title:    { type:String , default:"Empty Article" },
  html:     { type:String , default:"<p>This is an empty Article.</p>" },
  markdown: { type:String , default:"\n\n\n"  },
  metadata: { type: {}    , default:null      }
});
ArticleSchema.plugin(findOrCreate);

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
