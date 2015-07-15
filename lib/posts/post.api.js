'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var postApi = {
  all: function all(params, take, skip, cb) {
    var _this = this;

    this.safeConnect(function (error) {
      if (error) throw error;

      /*      this.collections.term
       .find()
       .populate('taxonomyCollection')
       .exec((err, terms)=> {*/

      _this.collections.post.find().populate('author').populate('relationshipCollection').populate('metaCollection').exec(function (e, posts) {

        //if (!posts) {
        _this.safeKill(function () {
          cb(e, posts);
        });
      });
    });
  },
  one: function one(params, cb) {
    var _this2 = this;

    this.safeConnect(function (error) {
      if (error) throw error;

      /*        this.collections.term
       .find()
       .populate('taxonomyCollection')
       .exec((err, terms)=> {*/

      _this2.collections.post.findOne().where(params).populate('authorId').populate('relationshipCollection').populate('metaCollection').exec(function (e, post) {

        //if (!post) {
        _this2.safeKill(function () {
          cb(e, post, terms);
        });
      });
    });
  },
  next: function next() {},
  previous: function previous() {},
  byTerm: function byTerm() {},
  byAuthor: function byAuthor() {}
};

exports['default'] = postApi;
module.exports = exports['default'];
/*} else {
 posts = posts.map(post=> {
 if (_.has(post, 'relationshipCollection')) {
 post.categoryCollection = []
 post.tagCollection = []
  let cat = null
 post.relationshipCollection.map((rel)=> {
 cat = _.find(terms, (term)=> {
 return term.taxonomyCollection[0].id == rel.termTaxonomyId
 })
 if (cat) {
 cat.taxonomy = cat.taxonomyCollection[0].taxonomy
 if (cat.taxonomy.toLowerCase() === 'category') {
 post.categoryCollection.push(cat)
 } else {
 post.categoryCollection.push(cat)
 }
  }
 })
 }
 return post
 })
   this.safeKill(()=> {
 cb(e, posts, terms)
 })
  }*/
//end exec
//        })
//end exec
//end connect
/*
 } else {
  if (_.has(post, 'relationshipCollection')) {
 post.categoryCollection = []
 post.tagCollection = []
  let cat = null
 post.relationshipCollection.map((rel)=> {
 cat = _.find(terms, (term)=> {
 return term.taxonomyCollection[0].id == rel.termTaxonomyId
 })
 if (cat) {
 cat.taxonomy = cat.taxonomyCollection[0].taxonomy
 if (cat.taxonomy.toLowerCase() === 'category') {
 post.categoryCollection.push(cat)
 } else {
 post.categoryCollection.push(cat)
 }
  }
 })
 }
  this.safeKill(()=> {
 cb(e, post, terms)
 })
  }*/
//end exec
//          })
//end exec
//end connect