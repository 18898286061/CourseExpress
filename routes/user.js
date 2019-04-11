const express = require('express')
const router = express.Router()
const UserModel = require('../models/users')

const checkLogin = require('../middlewares/check').checkLogin

// GET /user/:puserId/changeInfo 更新个人信息页

router.get('/:userId/changeInfo', checkLogin, function (req, res, next) {
  const userId = req.params.userId

  UserModel.getRawUserById(userId)
    .then(function (user) {
      if (!user) {
        throw new Error('该用户不存在')
      }
      if (userId.toString() !== user._id.toString()) {
        throw new Error('权限不足')
      }
      res.render('editUser', {
        user: user
      })
    })
    .catch(next)
})

// POST /user/:userrId/changeInfo 更新一用户信息
router.post('/:userId/changeInfo', checkLogin, function (req, res, next) {
  const userId = req.params.userId
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!gender.length) {
      throw new Error('请填写性别')
    }
    if (!bio.length) {
      throw new Error('请填写个人简介')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  UserModel.getRawUserById(userId)
    .then(function (user) {
      if (!user) {
        throw new Error('用户不存在')
      }
      UserModel.updateUserById(userId, { name: name, gender: gender, bio: bio })
        .then(function () {
          req.flash('success', '编辑个人信息成功')
          // 编辑成功后跳转到主页
          res.redirect(`/home`)
        })
        .catch(next)
    })
})

module.exports = router
