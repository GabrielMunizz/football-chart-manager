import { Request, Response, NextFunction } from 'express';
import jwtValidate from '../utils/jwtValidate';

interface ResponseStatus {
  status: number,
  data: { message: string }
}

class ValidateToken {
  static validate(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const missingToken = ValidateToken.statusResponseBuilder('missing');
    const invalidToken = ValidateToken.statusResponseBuilder('invalid');

    if (!authorization) return res.status(missingToken.status).json(missingToken.data);
    if (!authorization.includes(' ')) {
      return res.status(invalidToken.status).json(invalidToken.data);
    }

    const token = authorization.split(' ')[1];

    if (!token) return res.status(missingToken.status).json(missingToken.data);

    try {
      const decodedToken = jwtValidate.verify(token);

      if (typeof decodedToken !== 'object') {
        return res.status(invalidToken.status).json(invalidToken.data);
      }

      next();
    } catch (error) {
      return res.status(invalidToken.status).json(invalidToken.data);
    }
  }

  private static statusResponseBuilder(command: 'missing' | 'invalid'): ResponseStatus {
    if (command === 'missing') {
      return {
        status: 401,
        data: { message: 'Token not found' },
      };
    }

    return {
      status: 401,
      data: { message: 'Token must be a valid token' },
    };
  }
}

export default ValidateToken;
