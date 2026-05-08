import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";

export const getProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json(formatResponse(null, "User not found"));
  }

  return res.status(200).json(formatResponse(user, "Profile retrieved"));
});

export const updateProfile = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { name, phone, bio, avatar, location } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, phone, bio, avatar, location, updatedAt: new Date() },
    { new: true },
  ).select("-password");

  return res.status(200).json(formatResponse(updatedUser, "Profile updated"));
});

export const updateAvatar = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { avatarUrl } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true },
  ).select("-password");

  return res.status(200).json(formatResponse(updatedUser, "Avatar updated"));
});

export const deleteAccount = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  await User.findByIdAndDelete(userId);

  return res.status(200).json(formatResponse(null, "Account deleted"));
});

export const getSettings = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select(
    "name email phoneNumber avatarUrl linkedInUrl",
  );

  return res.status(200).json(formatResponse(user, "Settings retrieved"));
});

export const updateSettings = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { name, phoneNumber, avatarUrl, linkedInUrl, githubUrl } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, phoneNumber, avatarUrl, linkedInUrl, githubUrl },
    { new: true },
  ).select("-password");

  return res.status(200).json(formatResponse(updatedUser, "Settings updated"));
});

export const getActivityLog = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  return res
    .status(200)
    .json(formatResponse({ activity: [] }, "Activity log retrieved"));
});

export const getSubscription = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("subscriptionId");

  return res
    .status(200)
    .json(formatResponse(user?.subscriptionId, "Subscription retrieved"));
});

export const getReferrals = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const referrals = await User.find({ referredBy: userId }).select(
    "name email createdAt",
  );

  return res
    .status(200)
    .json(
      formatResponse(
        { referrals, count: referrals.length },
        "Referrals retrieved",
      ),
    );
});

export const generateReferralLink = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const referralCode = Buffer.from(userId.toString()).toString("base64");
  const referralLink = `${process.env.FRONTEND_URL}/auth/register?ref=${referralCode}`;

  return res
    .status(200)
    .json(
      formatResponse({ referralCode, referralLink }, "Referral link generated"),
    );
});
