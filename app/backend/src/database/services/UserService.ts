import jwtValidate from '../../utils/jwtValidate';
import comparePasswords from '../../utils/comparePasswords';
import { IUser } from '../../Interfaces/IUsers';
import { Token } from '../../Interfaces/Token';
import UserModel from '../models/UserModel';

interface ServiceResponse {
  status: number;
  data: { message: string } | Token ;
}

class UserService {
  private user: IUser | null = null;
  private role = '';
  async logUser(
    user: Omit<IUser, 'role' | 'id' | 'username'>,
  ): Promise<ServiceResponse> {
    const { password, email } = user;

    const invalidLogin = UserService.validate(email, password);

    if (invalidLogin) return invalidLogin;

    this.user = await UserModel.findOne({ where: { email } });

    if (!this.user) return UserService.serviceResponseBuilder(401) as ServiceResponse;

    const invalidPassword = await this.checkPassword(password);

    if (invalidPassword) return invalidPassword;

    const token = jwtValidate.sign(
      { id: this.user.id, email: this.user.email, role: this.user.role },
    );
    return { status: 200, data: { token } };
  }

  getRole(token: string) {
    const { role } = jwtValidate.verify(token);
    this.role = role;
    return {
      status: 200,
      data: this.role,
    };
  }

  private static validate(email: string, password: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !password) return UserService.serviceResponseBuilder(400);

    if (!regex.test(email)) return UserService.serviceResponseBuilder(401);

    if (password.length < 6) return UserService.serviceResponseBuilder(401);

    return false;
  }

  private async checkPassword(password: string) {
    if (!this.user) return UserService.serviceResponseBuilder(401) as ServiceResponse;

    const match = await comparePasswords(password, this.user.password as string);

    if (!match) return UserService.serviceResponseBuilder(401) as ServiceResponse;

    return false;
  }

  private static serviceResponseBuilder(status: number) {
    if (status === 400) return { status, data: { message: 'All fields must be filled' } };

    if (status === 401) return { status, data: { message: 'Invalid email or password' } };
  }
}

export default UserService;
