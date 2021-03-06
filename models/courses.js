const Course = require('../lib/mongo').Course

module.exports = {
  // 创建一个课程
  create: function create (course) {
    return Course.create(course).exec()
  },
  // 按创建时间降序获取所有课程或者某个特定用户的特定课程
  // eg: GET /posts?author=xxx
  getCourse: function getCourse (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Course
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .exec()
  },
  // 通过ID获取课程
  getCourseById: function getCourseById (CourseId) {
    return Course
      .findOne({ _id: CourseId })
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .exec()
  },
  // 添加课程用户
  updateCourseUser: function updateCourseUser (courseId, user) {
    return Course.update({ _id: courseId }, { $push: { courseUser: user }}).exec()
  },
  // 通过id获取课程 以修改
  getRawCourseById: function getRawCourseById (courseId) {
    return Course
      .findOne({ _id: courseId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },
  updateCourseById: function updateCourseById (courseId, data) {
    return Course.update({ _id: courseId }, { $set: data }).exec()
  },

  // 通过用户 id 和文章 id 删除一篇文章
  delCourseById: function delPostById (courseId) {
    // return Post.deleteOne({  _id: postId, author: author })
    return Course
      .deleteOne({  _id: courseId })
      .exec()
  }
}
