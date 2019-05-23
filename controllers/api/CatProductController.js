const express = require('express');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const CatProduct = require("../../models/catproduct");
const Alias = require("../../models/alias");
const url = require('url');
const catproductController = {}
catproductController.list = function(req, res, next) {
    const filter = {};
    const query = url.parse(req.url,true).query;
    var perPage = query.perPage || 10
    var page = query.page || 1
    //===================end pagination
    //res.send(query);
    if(query){
        // NodeJs Mongoose find like Reference from
        // https://stackoverflow.com/questions/9824010/mongoose-js-find-user-by-username-like-value
        const keyword = new RegExp(query.keyword, 'i'); // it return /keyword/i            

        // NodeJs Mongoose query find OR Reference From
        // https://stackoverflow.com/questions/33898159/mongoose-where-query-with-or
        filter.$or = [{name: keyword}, {description:keyword}]
        //filter.page = page;
        CatProduct.find(filter).populate('parent_id')
        .skip((perPage * page) - perPage)
        .limit(perPage).populate('imageNumber').exec((err, posts) => {
            CatProduct.find(filter).countDocuments().exec(function(err, count) {
                res.send({
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                })
            })
        });
    }else{
        CatProduct.populate('imageNumber').populate('parent_id').exec((err, post) => {
            res.send(post)
        });
    }
};
catproductController.getAll = function(req, res, next) {
    CatProduct.find({}).exec((err, post) => {
        res.send(post)
    });
}
catproductController.store = async (req, res) => {
    var datas = await {
        "name": req.body.name,
        "alias": slugify(req.body.name,'-'),
        "slug": slugify(req.body.name,'-'),
        "imagePath": req.body.imagePath,
        "imageNumber": req.body.imageNumber,
        "description": req.body.description,
        "parent_id": req.body.parent_id,
        "title_seo": req.body.title_seo,
        "description_seo": req.body.description_seo,
        "keyword_seo": req.body.keyword_seo
    }
    var post = await new CatProduct(datas)
    let datapost = await post.save()
    if(datapost.parent_id!=null){
        var paths = await postdataparentid(datapost,datapost._id)+'/'+datapost.alias
        var dataposts = await CatProduct.findByIdAndUpdate(datapost._id, { $set: {slug:paths}}, { new: true })
    }else{
        var paths = await datapost.alias
    }
    if(datapost){
        let data_alias = await {
            "name": datapost.name,
            "title": datapost.name,
            "path": paths,
            "alias": datapost.alias,
            "slug": paths,
            "name_table": "catproduct",
            "id_table": datapost._id,
        }
        var postalias = await new Alias(data_alias)
        var datapostalias = await postalias.save()
    }
    if(datapost.parent_id!=null){
        var idCd = await datapost._id;
        let dataitem = await CatProduct.findOne({'_id': datapost.parent_id})
        if(dataitem){
            var datas1 = {};
            datas1.childs = await dataitem.childs
            datas1.childs[dataitem.childs.length] = await idCd;
            var datapost1 = await CatProduct.findByIdAndUpdate(dataitem._id, { $set: datas1}, { new: true })
            //res.send(datapost1)
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    }else{
        //res.send(datapost)
    }
    res.send({paths:paths,datapostalias:datapostalias})
}
async function postdataparentid(data_category,id){
    let ids = id
    let data_categorys = await CatProduct.findById(data_category.parent_id)
    if(data_categorys.parent_id!=null){
        return await postdataparentid(data_categorys,'00')+'/'+data_categorys.alias
    }else{
        return await data_categorys.alias
    }
    
}
catproductController.show = function(req, res) {
    const postId = req.params.id;
    CatProduct.findById(postId).populate('imageNumber').populate('parent_id').exec(function (err, admins) {
      res.send(admins);
    });
}

catproductController.update = function(req, res) {
    var data = {
        name: req.body.name,
        description: req.body.description,
        parent_id: req.body.parent_id,
        imageNumber: req.body.imageNumber,
        imagePath: req.body.imagePath,
        title_seo: req.body.title_seo,
        description_seo: req.body.description_seo,
        keyword_seo: req.body.keyword_seo,
    }
    CatProduct.findOne({'_id': req.params.id}, function(err, result){
        if(result){
            CatProduct.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.send(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
}

catproductController.delete = function(req, res) {
    CatProduct.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
  };
catproductController.remove = function(req, res){
    const request = req.body;
    CatProduct.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
    });
}
module.exports = catproductController;