const express = require('express')
const path = require('path')
const router = express.Router()


const PostModel = require('../models/posts')
const CourseModel = require('../models/courses')
const UserModel = require('../models/users')

const checkAdminLogin = require('../middlewares/check').checkAdminLogin

// GET /admin 管理论坛
router.get('/', checkAdminLogin, function (req, res, next) {
  PostModel.getPosts()
    .then(function (posts) {
      res.render('admin', {
        posts: posts
      })
    })
    .catch(next)
})

// GET /admin/course 管理课程表
router.get('/course', checkAdminLogin, function (req, res, next) {
  CourseModel.getCourse()
    .then(function (course) {
      res.render('adminCourse', {
        course: course
      })
    })
    .catch(next)
})

// GET /admin/user 管理用户表
router.get('/user', checkAdminLogin, function (req, res, next) {
  UserModel.getUsers()
    .then(function (user) {
      res.render('adminUser', {
        user: user
      })
    })
    .catch(next)
})



// GET /admin/:postId/edit 管理员更新文章页
router.get('/:postId/edit', checkAdminLogin, function (req, res, next) {
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
router.get('/:courseId/courseEdit', checkAdminLogin, function (req, res, next) {
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
router.post('/:postId/edit', checkAdminLogin, function (req, res, next) {
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
router.post('/:courseId/courseEdit', checkAdminLogin, function (req, res, next) {
  const courseId = req.params.courseId
  const courseName = req.fields.courseName
  const author = req.fields.author
  const description = req.fields.description
  const price = parseInt(req.fields.price)

  const quetion1 = req.fields.question
  const quetion2 = req.fields.question2
  const quetion3 = req.fields.question3
  const quetion4 = req.fields.question4
  const questionRadioArray = [quetion1, quetion2, quetion3, quetion4]
  const questionRadioStr = questionRadioArray.toString()

  const answer1 = req.fields.answer1
  const answer2 = req.fields.answer2
  const answer3 = req.fields.answer3
  const answer4 = req.fields.answer4
  const answer5 = req.fields.answer5
  const answer6 = req.fields.answer6
  const answer7 = req.fields.answer7
  const answer8 = req.fields.answer8
  const answer9 = req.fields.answer9
  const answer10 = req.fields.answer10
  const answer11 = req.fields.answer11
  const answer12 = req.fields.answer12
  const answer13 = req.fields.answer13
  const answer14 = req.fields.answer14
  const answer15 = req.fields.answer15
  const answer16 = req.fields.answer16

  // 答案处理逻辑代码
  const answersArray = []
  answersArray.push(answer1, answer2, answer3, answer4, answer5,  answer6, answer7,  answer8,  answer9,  answer10,  answer11,  answer12,  answer13,  answer14,  answer15, answer16,)
  const answers = answersArray.toString()

  answerRadio1 = req.fields.answerRadio
  answerRadio2 = req.fields.answerRadio2
  answerRadio3 = req.fields.answerRadio3
  answerRadio4 = req.fields.answerRadio4
  const answerRadioArray = [answerRadio1, answerRadio2, answerRadio3, answerRadio4]
  const answerRadioStr = answerRadioArray.toString()


  const cover = req.files.editCover.path.split(path.sep).pop()

  const vedio1 = req.files.editVedio.path.split(path.sep).pop()
  const vedio2 = req.files.editVedio2.path.split(path.sep).pop()
  const vedio3 = req.files.editVedio3.path.split(path.sep).pop()
  const vedio4 = req.files.editVedio4.path.split(path.sep).pop()
  const vedioArray = [vedio1, vedio2, vedio3, vedio4]
  const vedioStr = vedioArray.toString()

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
      CourseModel.updateCourseById(courseId,
        { courseName: courseName,
          description: description,
          author: author,
          price: price,
          cover: cover,
          vedio: vedioStr,
          taskQuetion: questionRadioStr,
          taskAnswer: answers,
          answerRadio: answerRadioStr
        })
        .then(function () {
          req.flash('success', '编辑课程成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/admin/course`)
        })
        .catch(next)
    })
})

// GET /admin/:postId/remove 删除一篇文章  /admin/<%= post._id %>/remove
router.get('/:postId/remove', checkAdminLogin, function (req, res, next) {
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

// GET /admin/:postId/remove 删除一个课程  /admin/<%= post._id %>/remove
router.get('/:courseId/courseRemove', checkAdminLogin, function (req, res, next) {
  const courseId = req.params.courseId

  CourseModel.getRawCourseById(courseId)
    .then(function (course) {
      console.log(course + '111')
      if (!course) {
        throw new Error('该课程不存在')
      }
      CourseModel.delCourseById(courseId)
        .then(function () {
          req.flash('success', '删除课程成功')
          // 删除成功后跳转到主页
          res.redirect('/admin')
        })
        .catch(next)
    })
})


// GET /admin/:postId/edit 管理员更新文章页
router.get('/:postId/edit', checkAdminLogin, function (req, res, next) {
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
