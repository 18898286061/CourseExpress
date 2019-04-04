const express = require('express')
const router = express.Router()

// GET /home 所有用户或者特定用户的首页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  res.render('home')
})

module.exports = router
