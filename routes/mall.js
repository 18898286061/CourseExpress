const express = require('express')
const router = express.Router()
const CourseModel = require('../models/courses')
var ObjectId = require('mongodb').ObjectID;

// GET /mall 所有用户的商品页
// or GET /mall?user=xxx  或者特定用户的我的课程页面
router.get('/', function (req, res, next) {
  const author = req.query.author
  CourseModel.getCourse(author)
    .then(function (course) {
      res.render('mall', {
        course: course
      })
    })
    .catch(next)
})

// 单独购买课程
router.get('/:courseId', function (req, res, next) {
  const courseId = req.params.courseId

  Promise.all([
    CourseModel.getCourseById(courseId),
  ]).then(function (result) {
      const course = result[0]
      if (!course) {
        throw new Error('该课程不存在')
      }
      res.render('buy', {
        course: course
      })
    })
    .catch(next)
})


// POST /mall/  POST 商品支付
router.post('/:courseId', function (req, res, next) {
  const courseId = req.params.courseId
  let courseUser = ObjectId(req.session.user._id).toString()


  CourseModel.updateCourseUser(courseId, courseUser)
    .then(function () {
      req.flash('success', '添加成功')
      // 购买完成
      res.redirect(`/mall`)
    })
    .catch(next)
})

module.exports = router
