const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const CourseModel = require('../models/courses')
const checkLogin = require('../middlewares/check').checkLogin

// GET /createCourse 创建课程页
router.get('/', checkLogin, function (req, res, next) {
  res.render('createCourse')
})

// POST /signup 用户创建课程
router.post('/', checkLogin, function (req, res, next) {
  const courseName = req.fields.courseName
  const description = req.fields.description
  const price = parseInt(req.fields.price)
  const author = req.fields.author
  const quetion = req.fields.question

  const answer1 = req.fields.answer1
  const answer2 = req.fields.answer2
  const answer3 = req.fields.answer3
  const answer4 = req.fields.answer4

  const answersArray = []
  answersArray.push(answer1, answer2, answer3, answer4)
  const answers = answersArray.toString()

  const answerRadio = req.fields.answerRadio

  const cover = req.files.cover.path.split(path.sep).pop()

  // 视频
  const vedio1 = req.files.vedio1.path.split(path.sep).pop()
  const vedio2 = req.files.vedio2.path.split(path.sep).pop()
  const vedio3 = req.files.vedio3.path.split(path.sep).pop()
  const vedio4 = req.files.vedio4.path.split(path.sep).pop()

  const vedioArray = [vedio1, vedio2, vedio3, vedio4]
  const vedio = vedioArray.toString()

  // 校验参数
  try {
    if (!(courseName.length >= 1 && courseName.length <= 30)) {
      throw new Error('名字请限制在 1-30 个字符')
    }
    if (!(description.length >= 1 && description.length <= 100)) {
      throw new Error('个人简介请限制在 1-50 个字符')
    }
    if (!req.files.cover.name) {
      throw new Error('缺少封面')
    }
    if (!author) {
      throw new Error('请填写作者')
    }
    if (!price) {
      throw new Error('请填写价格')
    }
  } catch (e) {
    // 创建失败，异步删除上传的封面
    fs.unlink(req.files.cover.path, (err) => {
      if (err) throw err;
      console.log('文件已删除');
    })
    fs.unlink(req.files.vedio.path, (err) => {
      if (err) throw err;
      console.log('文件已删除');
    })
    req.flash('error', e.message)
    return res.redirect('/createCourse')
  }

  // 待写入数据库的课程信息
  let course = {
    courseName: courseName,
    description: description,
    price: price,
    author: author,
    cover: cover,
    taskQuetion: quetion,
    taskAnswer: answers,
    answerRadio: answerRadio,
    vedio: vedio
  }
  // 课程信息写入数据库
  CourseModel.create(course)
    .then(function (result) {
      // 此 course 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]
      // 写入 flash
      req.flash('success', '发布课程成功')
      // 跳转到首页
      res.redirect('/mall')
    })
    .catch(function (e) {
      // 注册失败，异步删除上传的封面
      fs.unlink(req.files.cover.path, function(err) {
        if (err) throw err;
        console.log('文件删除成功');
    })
      // 课程名被占用则跳回创建页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '课程名已被占用')
        return res.redirect('/createCourse')
      }
      next(e)
    })
})

module.exports = router
