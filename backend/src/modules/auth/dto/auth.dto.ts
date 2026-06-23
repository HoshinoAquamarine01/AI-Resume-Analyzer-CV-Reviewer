import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Valid email is required" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @Length(8, 100, { message: "Password is required (min length 8)" })
  password: string;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsOptional()
  @IsString({ message: "phoneNumber must be a string" })
  @Matches(/^\+?[0-9\-\s()]{7,20}$/, { message: "phoneNumber has invalid format" })
  phoneNumber?: string;
}

export class LoginDto {
  @IsEmail({}, { message: "Valid email is required" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: "Valid email is required" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}

export class ResetPasswordDto {
  @IsString({ message: "Reset token must be a string" })
  @IsNotEmpty({ message: "Reset token is required" })
  token: string;

  @IsString({ message: "New password must be a string" })
  @Length(8, 100, { message: "New password is required (min length 8)" })
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString({ message: "Current password must be a string" })
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword: string;

  @IsString({ message: "New password must be a string" })
  @Length(8, 100, { message: "New password is required (min length 8)" })
  newPassword: string;
}
