import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect to GitHub for authentication
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (_req, res) => {
    res.redirect('/');
  }
);

// Return current user or 401
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated. Visit /auth/github to log in.' });
  }
  res.json({ user: req.user });
});

// Log out
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;
