var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PositionmenuSchema = new Schema({
    name: { type: String },
    keyname: { type: String },
    child: { type: Array },
    description: { type: String }
});
module.exports = mongoose.model('Positionmenu', PositionmenuSchema);