import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";
import { authService } from "../services/auth.service";

export const register = asyncHandler(async (req: any, res: any) => {
  const { email, password, name, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json(formatResponse(null, "Email already registered"));
  }

  const user = await authService.register({
    email,
    password,
    name,
    phoneNumber,
  });

  const token = await authService.generateToken(user._id);
  const refreshToken = await authService.generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    formatResponse(
      {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
        token,
      },
      "User registered successfully",
    ),
  );
});

export const login = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json(formatResponse(null, "Invalid email or password"));
  }

  const isPasswordValid = await authService.comparePassword(
    password,
    user.password,
  );
  if (!isPasswordValid) {
    return res
      .status(401)
      .json(formatResponse(null, "Invalid email or password"));
  }

  const token = await authService.generateToken(user._id);
  const refreshToken = await authService.generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    formatResponse(
      {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
        token,
      },
      "Logged in successfully",
    ),
  );
});

export const logout = asyncHandler(async (req: any, res: any) => {
  res.clearCookie("refreshToken");
  return res.status(200).json(formatResponse(null, "Logged out successfully"));
});

export const refreshToken = asyncHandler(async (req: any, res: any) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json(formatResponse(null, "Refresh token not found"));
  }

  const decoded = await authService.verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json(formatResponse(null, "Invalid refresh token"));
  }

  const newToken = await authService.generateToken(decoded.userId);

  return res
    .status(200)
    .json(formatResponse({ token: newToken }, "Token refreshed successfully"));
});

export const verifyEmail = asyncHandler(async (req: any, res: any) => {
  const { token } = req.body;

  const decoded = await authService.verifyEmailToken(token);
  if (!decoded) {
    return res.status(400).json(formatResponse(null, "Invalid token"));
  }

  await User.findByIdAndUpdate(decoded.userId, { emailVerified: true });

  return res
    .status(200)
    .json(formatResponse(null, "Email verified successfully"));
});

export const forgotPassword = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(
        formatResponse(
          null,
          "If email exists, password reset link will be sent",
        ),
      );
  }

  const resetToken = await authService.generatePasswordResetToken(user._id);

  await authService.sendPasswordResetEmail(email, resetToken);

  return res
    .status(200)
    .json(formatResponse(null, "Password reset link sent to your email"));
});

export const resetPassword = asyncHandler(async (req: any, res: any) => {
  const { token, newPassword } = req.body;

  const decoded = await authService.verifyPasswordResetToken(token);
  if (!decoded) {
    return res.status(400).json(formatResponse(null, "Invalid token"));
  }

  const hashedPassword = await authService.hashPassword(newPassword);
  await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

  return res
    .status(200)
    .json(formatResponse(null, "Password reset successfully"));
});

export const changePassword = asyncHandler(async (req: any, res: any) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(formatResponse(null, "User not found"));
  }

  const isPasswordValid = await authService.comparePassword(
    currentPassword,
    user.password,
  );
  if (!isPasswordValid) {
    return res
      .status(400)
      .json(formatResponse(null, "Current password is incorrect"));
  }

  const hashedPassword = await authService.hashPassword(newPassword);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  return res
    .status(200)
    .json(formatResponse(null, "Password changed successfully"));
});
