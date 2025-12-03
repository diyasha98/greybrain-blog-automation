import express, { type Request, type Response } from 'express';
import { env } from '../../config/envConfig';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    username === env.AUTH_USERNAME &&
    password === env.AUTH_PASSWORD
  ) {
    return res.json({
      success: true,
      message: 'Login successful',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password',
  });
});

export default router;