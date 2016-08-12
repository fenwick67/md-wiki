// mongoose models: Paage and Wiki

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');
var findOrCreate = require('mongoose-findorcreate');

////////////////////////////////////////////////////////////
// Page is a mongoose model
var PageSchema = new Schema({
  title:    { type:String , default:"Empty Page" },
  html:     { type:String , default:"<p>This is an empty page.</p>" },
  markdown: { type:String , default:"\n\n\n"  },
  metadata: { type: {}    , default:null      }
});
PageSchema.plugin(findOrCreate);

var Page = mongoose.model('Page', PageSchema);

////////////////////////////////////////////////////////////
// Wiki is a mongoose model too
var WikiSchema = new Schema({
  title: { type:String , default:"My Wiki" },
  setUp: {type:Boolean,default:false}
});
WikiSchema.plugin(findOrCreate);

var Wiki = mongoose.model('Wiki', WikiSchema);

//////////////////////////////////////////////////////////
// initialize




//////////////////////////////////////////////////////////
module.exports = {
  Page:Page,
  Wiki:Wiki
};
