import jwtValidate from '../../utils/jwtValidate';
import comparePasswords from '../../utils/comparePasswords';
import { IUser } from '../../Interfaces/IUsers';
import { Token } from '../../Interfaces/Token';
import UserModel from '../models/UserModel';

interface ServiceResponse {
  status: number;
  data: { message: string } | Token;
}

class UserService {
  private user: IUser | null = null;

  async logUser(
    user: Omit<IUser, 'role' | 'id' | 'username'>,
  ): Promise<ServiceResponse> {
    const { password, email } = user;

    if (!email || !password) return { status: 400, data: { message: 'All fields must be filled' } };

    this.user = await UserModel.findOne({ where: { email } });
    const match = await comparePasswords(password, this.user?.password as string);
    if (!this.user || !match) {
      return {
        status: 401,
        data: { message: 'Username or password invalid' },
      };
    }

    const token = jwtValidate.sign({ id: this.user.id, email: this.user.email });
    return { status: 200, data: { token } };
  }
}

export default UserService;
