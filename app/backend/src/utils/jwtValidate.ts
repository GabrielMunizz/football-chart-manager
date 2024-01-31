import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

interface TokenPayload {
  id: number,
  email: string,
}

const sign = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, secret);

  return token;
};

const verify = (token: string): TokenPayload => {
  const data = jwt.verify(token, secret) as TokenPayload;

  return data;
};

export default {
  sign,
  verify,
};
