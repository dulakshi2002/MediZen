import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import Doctor from '../models/doctor.model.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Using cookies to store token

  if (!token) {
    return next(errorHandler(401, 'You are not authenticated!'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Invalid token!'));
    req.user = user;
    next(); // Continue to the next middleware or route handler
  });
};

export const verifyDoctor = async (req, res, next) => {
  try {
      const doctor = await Doctor.findById(req.user.id);
      if (!doctor) return next(errorHandler(403, 'Doctor access required!'));
      next();
  } catch (error) {
      next(error);
  }
};