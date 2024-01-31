import validateLogin from '../../utils/validateLogin';
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

    const invalidLogin = await validateLogin(email as string, password);

    if (invalidLogin) return { status: invalidLogin.status, data: invalidLogin.data };

    this.user = await UserModel.findOne({ where: { email } });

    if (!this.user) return { status: 401, data: { message: 'Invalid email or password' } };

    const match = await comparePasswords(password, this.user?.password as string);

    if (!match) return { status: 401, data: { message: 'Invalid email or password' } };

    const token = jwtValidate.sign({ id: this.user.id, email: this.user.email });
    return { status: 200, data: { token } };
  }
}

export default UserService;
