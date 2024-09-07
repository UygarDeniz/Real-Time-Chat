import jwt from 'jsonwebtoken';
import prisma from '../db.js';

export const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      next();
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        message: 'Not authorized',
      });
    }
  } else {
    return res.status(401).json({
      message: 'Not authorized / no token',
    });
  }
};
