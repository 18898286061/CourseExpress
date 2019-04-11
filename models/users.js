const User = require('../lib/mongo').User

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return User.create(user).exec()
  },

  // 按创建时间降序获取所有用户
  getUsers: function getPosts () {
    return User
      .find()
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .exec()
  },


  // 通过用户名获取用户信息
  getUserByName: function getUserByName (name) {
    return User
      .findOne({ name: name })
      .addCreatedAt() // 自定义插件（通过 _id 生成时间戳）
      .exec()
  },

  // 获取个人信息以修改
  getRawUserById: function getRawUserById (userId) {
    return User
      .findOne({ _id: userId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },

  // 通过用户 id 更新个人信息
  updateUserById: function updateUserById (userId, data) {
    return User.update({ _id: userId }, { $set: data }).exec()
  }
}
