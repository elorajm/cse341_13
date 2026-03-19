// // middleware/auth.js
// //import jwt from 'jsonwebtoken';
// //import User from '../models/user.js';

// //export default async function auth(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });

//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(payload.sub).select('_id username email');
//     if (!user) return res.status(401).json({ message: 'Invalid token' });
//     req.user = { id: user._id.toString(), username: user.username, email: user.email };
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token', error: err.message });
//   }
// }
