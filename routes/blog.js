const express = require('express')
const router = express.Router()

// GET /home 所有用户或者特定用户的首页
//   eg: GET /posts?author=xxx
router.get('/blog', function (req, res, next) {
  res.render('blog')
})

module.exports = router
