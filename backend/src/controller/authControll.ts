import { Request, Response, NextFunction } from 'express';
import User from '../model/userModel';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { compare, hashSync } from 'bcryptjs';

const jwtkey: string = '123456';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

// Login Controller
const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const checkemail = await User.findOne({ email });

    if (!checkemail || !(await compare(password, checkemail.password))) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const user = {
      id: checkemail._id.toString(),
      email: checkemail.email,
      username: checkemail.username,
      role: checkemail.role,
    };

    const token = sign(user, jwtkey, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Successfully logged in',
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Signup Controller
const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username } = req.body;

  try {
    const checkemail = await User.findOne({ email });

    if (checkemail) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const hashedPassword = hashSync(password, 10);

    const user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'Successfully registered', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// JWT Verification Middleware
const jwtVerify = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  console.log("hii")
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ isValid: false, message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];


  verify(token, jwtkey, (err, user) => {
    if (err || !user) {
      res.status(403).json({ isValid: false, message: 'Invalid token' });
      return;
    }

    const payload = user as JwtPayload;
    req.user = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };

    next();
  });
};

// Check Authenticated User
const checkUser = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ isValid: false, message: 'Invalid token' });
    return;
  }
  res.status(200).json({ isValid: true, user: `${req.user.email}`, role: `${req.user.role}` });
};

export { login, signup, jwtVerify, checkUser };
