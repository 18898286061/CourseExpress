const Course = require('../lib/mongo').Course

module.exports = {
  // 创建一个课程
  create: function create (course) {
    return Course.create(course).exec()
  },

  // 按创建时间降序获取所有课程或者某个特定用户的特定课程
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
}
