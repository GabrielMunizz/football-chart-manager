const validateLogin = (email: string, password: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !password) {
    return {
      status: 400,
      data: { message: 'All fields must be filled' },
    };
  }
  if (!regex.test(email) || password.length < 6) {
    return {
      status: 401,
      data: { message: 'Invalid email or password' },
    };
  }

  return false;
};

export default validateLogin;
