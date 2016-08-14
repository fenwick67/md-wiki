var slugify = require("slugify");

module.exports = function(s){
    return slugify(s);
}