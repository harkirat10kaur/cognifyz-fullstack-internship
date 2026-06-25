const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Tell Express: "use EJS as the template engine"
app.set('view engine', 'ejs');
// Tell Express: "look for view files in the /views folder"
app.set('views', path.join(__dirname, 'views'));

// Middleware: parse form data sent via POST
app.use(express.urlencoded({ extended: true }));

// Middleware: serve static files (CSS, images) from /public
app.use(express.static(path.join(__dirname, 'public')));

// Session setup (required for flash messages)
app.use(session({
  secret: 'feedbackboard_secret',
  resave: false,
  saveUninitialized: false
}));

// Flash message setup
app.use(flash());

// Make flash messages available in ALL views automatically
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const feedbackRoutes = require('./routes/feedback');
app.use('/', feedbackRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});