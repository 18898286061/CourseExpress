const express = require('express')
const router = express.Router()
const CourseModel = require('../models/courses')
var ObjectId = require('mongodb').ObjectID;

// GET /mall 所有用户或者特定用户的首页
//   eg: GET /mall?author=xxx
router.get('/', function (req, res, next) {
  const author = req.query.author
  const userId = req.session.user._id
  CourseModel.getCourse(author)
    .then(function (course) {
      res.render('mall', {
        course: course,
        userId: userId
      })
    })
    .catch(next)
})

// 单独购买课程
router.get('/:courseId', function (req, res, next) {
  const courseId = req.params.courseId

  Promise.all([
    CourseModel.getCourseById(courseId),
    // PostModel.incPv(postId)// pv 加 1 (购买数量)
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


// POST /mall/ 商品支付页面
router.post('/:courseId', function (req, res, next) {
  const courseId = req.params.courseId
  let courseUser = ObjectId(req.session.user._id).toString()


  CourseModel.updateCourseUser(courseId, courseUser)
    .then(function (result) {
      req.flash('success', '购买成功')
      // 购买完成
      res.redirect(`/mall`)
    })
    .catch(next)
})

module.exports = router
