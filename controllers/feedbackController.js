const feedbacks = [];

// GET / — Show the main page with all feedbacks
exports.getIndex = (req, res) => {
  res.render('index', {
    feedbacks: feedbacks,
    title: 'Developer Feedback Board'
  });
};

// POST /submit — Handle form submission
exports.postFeedback = (req, res) => {
  const { name, category, message } = req.body;

  // Basic server-side validation
  if (!name || !category || !message) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/');
  }

  if (message.trim().length < 10) {
    req.flash('error', 'Message must be at least 10 characters.');
    return res.redirect('/');
  }

  const newFeedback = {
    name: name.trim(),
    category,
    message: message.trim(),
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  };

  feedbacks.unshift(newFeedback);

  req.flash('success', 'Your feedback was submitted successfully!');
  res.redirect('/');
};