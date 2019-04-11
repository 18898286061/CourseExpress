module.exports = {
  checkLogin: function checkLogin (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录')
      return res.redirect('/signin')
    }
    next()
  },

  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录')
      return res.redirect('/home')// 返回之前的页面
    }
    next()
  },
// 管理员权限
  checkAdminLogin: function checkAdminLogin (req, res, next) {
    console.log(req.session.user._id)
    if (req.session.user._id !== '5ca5a530af5deda13a2ec89c') {
      req.flash('error', '您未拥有管理员权限')
      return res.redirect('/home')// 返回之前的页面
    }
    next()
  }
}

// 权限代码
