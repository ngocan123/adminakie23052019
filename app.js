var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
const cors = require('cors')
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })
const bodyParser = require('body-parser');
// these are require packages that we need
var hbs = require('express-hbs')
var tools = require('./modules/tools');
//hbs.registerPartials(__dirname + '/views/partials')
var passport = require('passport')
var session = require('express-session')
var flash = require('connect-flash')
var validator = require('express-validator')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
// Admin
var backendDashboardRouter = require('./routes/admin/dashboard');
var backendAdminRouter = require('./routes/admin/admin');
var backendUserRouter = require('./routes/admin/users');
var backendProductRouter = require('./routes/admin/product');
var backendCatProductRouter = require('./routes/admin/catproduct');
var backendTagRouter = require('./routes/admin/tag');
var backendGalleryRouter = require('./routes/admin/gallery');
var backendAuthRouter = require('./routes/admin/auth');
// Api
var apialiasRouter = require('./routes/api/alias');
var adminsRouter = require('./routes/api/admin');
var apiRoleRouter = require('./routes/api/role');
var apiMenuRouter = require('./routes/api/menu');
var apiPositionmenuRouter = require('./routes/api/positionmenu');
var apiPermissionRouter = require('./routes/api/permission');
var apiUserRouter = require('./routes/api/users');
var apiProductRouter = require('./routes/api/product');
var apiCatProductRouter = require('./routes/api/catproduct');
var apiStyleProductRouter = require('./routes/api/styleproduct');
var apiSupplierRouter = require('./routes/api/supplier');
var apiTagRouter = require('./routes/api/tag');
var apiSettingRouter = require('./routes/api/setting');
var apiGalleryRouter = require('./routes/api/gallery');
var apiStylegalleryRouter = require('./routes/api/stylegallery');
var apiPhotoRouter = require('./routes/api/photo');
var apiAuthRouter = require('./routes/auth');

var app = express();
const router = express.Router()   // this is create router
// add this line because intend to accept only json para and only return json
router.use(bodyParser.urlencoded({ extended: false })); // for json return
router.use(bodyParser.json());  // for json return 

//var uri = 'mongodb://shop2019:shop2019@cluster0-shard-00-00-uwpjt.mongodb.net:27017,cluster0-shard-00-01-uwpjt.mongodb.net:27017,cluster0-shard-00-02-uwpjt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

var uri = 'mongodb://shop123:12345678@163.44.206.217:27017/test'
// Connecting local mongodb database named test
mongoose.connect(uri, { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)
const conn = mongoose.connection

require('./config/passports')
app.engine('hbs', hbs.express4({
  defaultLayout: 'views/layouts/layout',
  layoutsDir: __dirname + '/views/partials', 
  partialsDir: __dirname + '/views'
}));

// // partials will be stored in /views/partials
// hbs.registerPartials(__dirname + '/views/partials');
// // expose response locals and app locals to the templating system
//hbs.localsAsTemplateData(app);


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// right here we need to allow domain
const corsOptions = {
	origin: [ 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000', 'http://demo.akie.vn', 'http://admin2.akie.vn' ],
	credentials:true,
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(validator());
app.use(cookieParser());
app.use(session({ secret: 'supersecret', resave: true, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(tools.onRequestStart);
app.use(async function(req, res, next){
  const Setting = await require('./models/setting')
  const Menu = await require('./models/menu')
  res.locals.setting1 = await Setting.findOne({lang:'vi'}).populate('favicon').populate('logo')
  res.locals.menuTop = await Menu.find({keyname:"menu_top",parent_id: null})
  if(res.locals.menuTop.length>0){
    for(i=0; i<res.locals.menuTop.length; i++){
      res.locals.menuTop[i].children = await Menu.find({parent_id:res.locals.menuTop[i]._id})
      // if(res.locals.menuTop[i].children.length>0){
      //   for(j=0; j<res.locals.menuTop[i].children.length; j++){
      //     res.locals.menuTop[i].children[j].children = await Menu.find({parent_id:res.locals.menuTop[i].children[j]._id})
      //   }
      // }
    }
  }
  next()
})

app.use('/users', usersRouter);
app.use('/backend', backendDashboardRouter);
app.use('/backend/admin/', backendAdminRouter);
app.use('/backend/user', backendUserRouter);
app.use('/backend/product', backendProductRouter);
app.use('/backend/catproduct', backendCatProductRouter);
app.use('/backend/tag', backendTagRouter);
app.use('/backend/gallery', backendGalleryRouter);
app.use('/backend/auth', backendAuthRouter);
//apialiasRouter
app.use('/api/alias', apialiasRouter);
app.use('/api/admin', adminsRouter);
app.use('/api/role', apiRoleRouter);
app.use('/api/menu', apiMenuRouter);
app.use('/api/positionmenu', apiPositionmenuRouter);
app.use('/api/permission', apiPermissionRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/product', apiProductRouter);
app.use('/api/catproduct', apiCatProductRouter);
app.use('/api/styleproduct', apiStyleProductRouter);
app.use('/api/supplier', apiSupplierRouter);
app.use('/api/tag', apiTagRouter);
app.use('/api/setting', apiSettingRouter);
app.use('/api/gallery', apiGalleryRouter);
app.use('/api/stylegallery', apiStylegalleryRouter);
app.use('/api/photo', apiPhotoRouter);
app.use('/api/auth', apiAuthRouter);
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
