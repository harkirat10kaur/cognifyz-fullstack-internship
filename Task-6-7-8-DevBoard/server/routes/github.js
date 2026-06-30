const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

router.get('/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    const cacheKey = `github_${username}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info(`Cache HIT for GitHub user: ${username}`);
      return res.json({ ...cached, fromCache: true });
    }

    logger.info(`Cache MISS for GitHub user: ${username} - fetching from API`);

    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {};

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers })
    ]);

    const data = {
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
    };

    // Store in cache
    cache.set(cacheKey, data);
    logger.info(`Cached GitHub data for: ${username}`);

    res.json({ ...data, fromCache: false });
  } catch (err) {
    logger.error(`GitHub API error: ${err.message}`);
    if (err.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    res.status(500).json({ message: 'Error fetching GitHub data' });
  }
});

module.exports = router;