import { IsEmail, IsOptional, IsString, IsUrl, Matches, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "name must be a non-empty string" })
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\-\s()]{7,20}$/, { message: "phoneNumber has invalid format" })
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: "avatarUrl must be a valid URL" })
  avatar?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "name must be a non-empty string" })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "email must be valid" })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\-\s()]{7,20}$/, { message: "phoneNumber has invalid format" })
  phoneNumber?: string;

  @IsOptional()
  @IsUrl({}, { message: "avatarUrl must be a valid URL" })
  avatarUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: "linkedInUrl must be a valid URL" })
  linkedInUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: "githubUrl must be a valid URL" })
  githubUrl?: string;
}
