// Bcrypt utilities
import bcrypt from "bcrypt";

export const hashPassword = async (
  password: string
) => {
  return await bcrypt.hash(
    password,
    Number(
      process.env.BCRYPT_SALT_ROUNDS
    )
  );
};

export const comparePassword =
  async (
    plainPassword: string,
    hashedPassword: string
  ) => {
    return await bcrypt.compare(
      plainPassword,
      hashedPassword
    );
  };