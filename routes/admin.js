const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')
const CourseModel = require('../models/courses')

// GET /admin 管理论坛
router.get('/', function (req, res, next) {
  PostModel.getPosts()
    .then(function (posts) {
      res.render('admin', {
        posts: posts
      })
    })
    .catch(next)
})

// GET /admin 管理课程表
router.get('/course', function (req, res, next) {
  CourseModel.getCourse()
    .then(function (course) {
      res.render('adminCourse', {
        course: course
      })
    })
    .catch(next)
})


// GET /admin/:postId/edit 管理员更新文章页
router.get('/:postId/edit', function (req, res, next) {
  const postId = req.params.postId

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在')
      }
      res.render('adminEdit', {
        post: post
      })
    })
    .catch(next)
})

// GET /admin/:courseId/courseEdit 管理员更新课程页
router.get('/:courseId/courseEdit', function (req, res, next) {
  const courseId = req.params.courseId

  CourseModel.getRawCourseById(courseId)
    .then(function (course) {
      if (!course) {
        throw new Error('该课程不存在')
      }
      res.render('adminCourseEdit', {
        course: course
      })
    })
    .catch(next)
})

// POST /admin/:postId/edit 更新一篇文章
router.post('/:postId/edit', function (req, res, next) {
  const postId = req.params.postId
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/admin`)
        })
        .catch(next)
    })
})
// POST /admin/:postId/Courseedit 更新一个课程
router.post('/:courseId/courseEdit', function (req, res, next) {
  const courseId = req.params.courseId
  const courseName = req.fields.courseName
  const author = req.fields.author
  const description = req.fields.description

  // 校验参数
  try {
    if (!courseName.length) {
      throw new Error('请填写标题')
    }
    if (!description.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  CourseModel.getRawCourseById(courseId)
    .then(function (course) {
      if (!course) {
        throw new Error('该课程不存在')
      }
      CourseModel.updateCourseById(courseId, { courseName: courseName, description: description, author: author })
        .then(function () {
          req.flash('success', '编辑课程成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/admin/course`)
        })
        .catch(next)
    })
})

// GET /admin/:postId/remove 删除一篇文章  /admin/<%= post._id %>/remove
router.get('/:postId/remove', function (req, res, next) {
  const postId = req.params.postId

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      PostModel.delPostById(postId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/admin')
        })
        .catch(next)
    })
})


// GET /admin/:postId/edit 管理员更新文章页
router.get('/:postId/edit', function (req, res, next) {
  const postId = req.params.postId

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在')
      }
      res.render('adminEdit', {
        post: post
      })
    })
    .catch(next)
})

module.exports = router