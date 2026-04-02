import express from 'express';
import passport from 'passport';

const router = express.Router();

/**
 * GET /auth/github
 * #swagger.summary = 'Initiate GitHub OAuth login'
 * #swagger.responses[302] = { description: 'Redirects to GitHub for authentication' }
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * GET /auth/github/callback
 * #swagger.summary = 'GitHub OAuth callback'
 * #swagger.responses[302] = { description: 'Redirects to / on success or failure' }
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (_req, res) => {
    res.redirect('/');
  }
);

/**
 * GET /auth/profile
 * #swagger.summary = 'Get the currently authenticated user'
 * #swagger.responses[200] = { description: 'Returns the logged-in user object' }
 * #swagger.responses[401] = { description: 'Not authenticated' }
 */
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated. Visit /auth/github to log in.' });
  }
  res.json({ user: req.user });
});

/**
 * GET /auth/logout
 * #swagger.summary = 'Log out the current user'
 * #swagger.responses[302] = { description: 'Redirects to / after logout' }
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;
