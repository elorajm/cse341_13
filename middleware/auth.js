export default function auth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Login required. Visit /auth/github to authenticate.' });
}
