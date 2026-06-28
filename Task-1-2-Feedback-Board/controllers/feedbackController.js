const feedbacks = [];
let idCounter = 1;

// GET / — Show the main page
exports.getIndex = (req, res) => {
  res.render('index', {
    feedbacks: feedbacks,
    title: 'Developer Feedback Board'
  });
};

// POST /submit — Handle form submission
exports.postFeedback = (req, res) => {
  const { name, email, category, priority, message } = req.body;

  // ===== SERVER-SIDE VALIDATION =====

  // Check all fields exist
  if (!name || !email || !category || !priority || !message) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/');
  }

  // Name length check
  if (name.trim().length < 2) {
    req.flash('error', 'Name must be at least 2 characters.');
    return res.redirect('/');
  }

  // Email format check (regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    req.flash('error', 'Please enter a valid email address.');
    return res.redirect('/');
  }

  // Message length check
  if (message.trim().length < 10) {
    req.flash('error', 'Message must be at least 10 characters.');
    return res.redirect('/');
  }

  if (message.trim().length > 500) {
    req.flash('error', 'Message cannot exceed 500 characters.');
    return res.redirect('/');
  }

  // ===== STORE DATA =====
  const newFeedback = {
    id: idCounter++,
    name: name.trim(),
    email: email.trim(),
    category,
    priority,
    message: message.trim(),
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }),
    timestamp: new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    })
  };

  feedbacks.unshift(newFeedback);

  req.flash('success', `Feedback #${newFeedback.id} submitted successfully!`);
  res.redirect('/');
};