import { CoverLetter } from "../models/CoverLetter";
import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";
import { coverLetterService } from "../services/coverLetter.service";

export const generateCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { resumeId, jobTitle, companyName, jobDescription } = req.body;
  const userId = req.user._id;

  const generatedContent = await coverLetterService.generate(
    resumeId,
    jobTitle,
    companyName,
    jobDescription,
  );

  const coverLetter = await CoverLetter.create({
    userId,
    resumeId,
    jobTitle,
    companyName,
    content: generatedContent,
  });

  return res
    .status(201)
    .json(formatResponse(coverLetter, "Cover letter generated"));
});

export const getCoverLetters = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const coverLetters = await CoverLetter.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await CoverLetter.countDocuments({ userId });

  return res
    .status(200)
    .json(
      formatResponse(
        { coverLetters, total, pages: Math.ceil(total / limit) },
        "Cover letters retrieved",
      ),
    );
});

export const getCoverLetterById = asyncHandler(async (req: any, res: any) => {
  const { coverLetterId } = req.params;

  const coverLetter = await CoverLetter.findById(coverLetterId);
  if (!coverLetter) {
    return res.status(404).json(formatResponse(null, "Cover letter not found"));
  }

  return res
    .status(200)
    .json(formatResponse(coverLetter, "Cover letter retrieved"));
});

export const updateCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { coverLetterId } = req.params;
  const { content, jobTitle, companyName } = req.body;
  const userId = req.user._id;

  const coverLetter = await CoverLetter.findById(coverLetterId);
  if (!coverLetter || coverLetter.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to update this cover letter"));
  }

  const updatedCoverLetter = await CoverLetter.findByIdAndUpdate(
    coverLetterId,
    { content, jobTitle, companyName, updatedAt: new Date() },
    { new: true },
  );

  return res
    .status(200)
    .json(formatResponse(updatedCoverLetter, "Cover letter updated"));
});

export const deleteCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { coverLetterId } = req.params;
  const userId = req.user._id;

  const coverLetter = await CoverLetter.findById(coverLetterId);
  if (!coverLetter || coverLetter.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to delete this cover letter"));
  }

  await CoverLetter.findByIdAndDelete(coverLetterId);

  return res.status(200).json(formatResponse(null, "Cover letter deleted"));
});

export const improveCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { coverLetterId, section } = req.body;
  const userId = req.user._id;

  const coverLetter = await CoverLetter.findById(coverLetterId);
  if (!coverLetter || coverLetter.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to modify this cover letter"));
  }

  const improvedContent = await coverLetterService.improveSection(
    coverLetter.content,
    section,
  );

  const updatedCoverLetter = await CoverLetter.findByIdAndUpdate(
    coverLetterId,
    { content: improvedContent },
    { new: true },
  );

  return res
    .status(200)
    .json(formatResponse(updatedCoverLetter, "Cover letter improved"));
});

export const downloadCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { coverLetterId } = req.params;

  const coverLetter = await CoverLetter.findById(coverLetterId);
  if (!coverLetter) {
    return res.status(404).json(formatResponse(null, "Cover letter not found"));
  }

  const pdfBuffer = await coverLetterService.generatePdf(coverLetter.content);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="cover-letter-${coverLetter._id}.pdf"`,
  );
  res.send(pdfBuffer);
});

export const duplicateCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { coverLetterId } = req.params;
  const userId = req.user._id;

  const originalCoverLetter = await CoverLetter.findById(coverLetterId);
  if (!originalCoverLetter) {
    return res.status(404).json(formatResponse(null, "Cover letter not found"));
  }

  const duplicatedCoverLetter = await CoverLetter.create({
    userId,
    resumeId: originalCoverLetter.resumeId,
    jobTitle: originalCoverLetter.jobTitle,
    companyName: originalCoverLetter.companyName,
    content: originalCoverLetter.content,
  });

  return res
    .status(201)
    .json(formatResponse(duplicatedCoverLetter, "Cover letter duplicated"));
});

export const searchCoverLetters = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { query, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const coverLetters = await CoverLetter.find({
    userId,
    $or: [
      { jobTitle: { $regex: query, $options: "i" } },
      { company: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ],
  })
    .skip(skip)
    .limit(limit);

  const total = await CoverLetter.countDocuments({
    userId,
    $or: [
      { jobTitle: { $regex: query, $options: "i" } },
      { company: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ],
  });

  return res
    .status(200)
    .json(
      formatResponse(
        { coverLetters, total, pages: Math.ceil(total / limit) },
        "Search results",
      ),
    );
});
