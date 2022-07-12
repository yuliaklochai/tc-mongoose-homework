const User = require('../models/user');
const Article = require('../models/article');
const errorHelper = require('../config/errorHelper');

module.exports = {createUser, updateUser, getUser, deleteUser, getArticles};

async function createUser(req, res, next) {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      nickname: req.body.nickname
    });
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const existingUser = await User.findById(req.params.userId);
    if (!existingUser) {
      return next(errorHelper.badRequest('User isn`t exist.'));
    }

    const requiredFields = ['firstName', 'lastName', 'role'];

    for (let key in req.body) {
      if (requiredFields.includes(key)) {
        existingUser[key] = req.body[key];
      }
    }

    await existingUser.save();
    return res.status(200).json(existingUser);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const existingUser = await User.findById(req.params.userId).lean();
    if (!existingUser) {
      return next(errorHelper.badRequest('User isn`t exist.'));
    }
    const articles = await Article.find({owner: req.params.userId});
    existingUser.articles = articles;
    return res.status(200).json(existingUser);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHelper.badRequest('User isn`t exist'));
    }
    await Article.deleteMany({owner: user._id});
    await User.deleteOne({_id: user._id});
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function getArticles(req, res, next) {
  try {
    const articles = await Article.find({owner: req.params.userId});
    return res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
}
