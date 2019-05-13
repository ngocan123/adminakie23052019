var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StyleProductSchema = new Schema({
    name: { type: String },
    description: { type: String },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StyleProduct'
    },
    alias: { type: String },
    imageNumber: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery'
    },
    imagePath: { type: String },
    galleryNumber: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gallery',
        }
    ],
    title_seo: { type: String },
    description_seo: { type: String },
    keyword_seo: { type: String },
});
module.exports = mongoose.model('StyleProduct', StyleProductSchema);