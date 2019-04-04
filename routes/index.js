module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/home')
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
  app.use('/home', require('./home'))
  app.use('/blog', require('./blog'))
  app.use('/mall', require('./mall'))
  app.use('/createCourse', require('./createCourse'))
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).send('404')
    }
  })
}
