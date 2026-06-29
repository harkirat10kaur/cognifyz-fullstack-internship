const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// GET GitHub user repos
router.get('/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    
    const headers = process.env.GITHUB_TOKEN 
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {};

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers })
    ]);

    res.json({
      user: {
        name: userRes.data.name,
        avatar: userRes.data.avatar_url,
        bio: userRes.data.bio,
        followers: userRes.data.followers,
        public_repos: userRes.data.public_repos
      },
      repos: reposRes.data.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updated: repo.updated_at
      }))
    });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    res.status(500).json({ message: 'Error fetching GitHub data' });
  }
});

module.exports = router;