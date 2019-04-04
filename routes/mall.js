const express = require('express')
const router = express.Router()
const CourseModel = require('../models/courses')

// GET /mall 所有用户或者特定用户的首页
//   eg: GET /mall?author=xxx
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

module.exports = router
