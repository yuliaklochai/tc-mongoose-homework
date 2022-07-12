const Article = require('../models/article');
const User = require('../models/user');
const errorHelper = require('../config/errorHelper');

const mongoose = require('mongoose');

module.exports = {createArticle, updateArticle, findArticles, deleteArticle};

async function createArticle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.body.owner)) {
      return next(errorHelper.badRequest('article.owner_not_objectId'));
    }

    const owner = await User.findById(req.body.owner);
    if (!owner) {
      return next(errorHelper.badRequest('article.owner_not_objectId'));
    }

    const article = new Article({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      owner: req.body.owner,
      category: req.body.category
    });
    
    await User.updateOne({_id: article.owner}, {$inc: {numberOfArticles: 1}});

    await article.save();
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
}

async function updateArticle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.articleId)) {
      return next(errorHelper.badRequest('article.id_not_objectId'));
    }

    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return next(errorHelper.badRequest('Article isn`t exist'));
    }
    if (req.body.owner) {
      const owner = await User.findById(req.body.owner);
      if (!owner) {
        return next(errorHelper.badRequest('Owner isn`t exist'));
      }
      article.owner = req.body.owner;
    }
    if (req.body.title) {
      article.title = req.body.title;
    }
    if (req.body.subtitle) {
      article.subtitle = req.body.subtitle;
    }
    if (req.body.description) {
      article.description = req.body.description;
    }
    if (req.body.category) {
      article.category = req.body.category;
    }

    await article.save();
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
}

async function findArticles(req, res, next) {
  try {
    const result = await Article.find(req.query).populate('owner');

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteArticle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.articleId)) {
      return next(errorHelper.badRequest('article.id_not_objectId'));
    }
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return next(errorHelper.badRequest('Article isn`t exist'));
    }

    await User.updateOne({_id: article.owner}, {$inc: {numberOfArticles: -1}});
    await Article.deleteOne({_id: article._id});
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
}
