import { Resume } from "../models/Resume";
import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";
import { resumeService } from "../services/resume.service";

export const createResume = asyncHandler(async (req: any, res: any) => {
  const { title, fileUrl, fileType } = req.body;
  const userId = req.user._id;

  const resume = await Resume.create({
    userId,
    title,
    fileUrl,
    fileType,
  });

  return res.status(201).json(formatResponse(resume, "Resume created"));
});

export const getResumes = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const resumes = await Resume.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Resume.countDocuments({ userId });

  return res
    .status(200)
    .json(
      formatResponse(
        { resumes, total, pages: Math.ceil(total / limit) },
        "Resumes retrieved",
      ),
    );
});

export const getResumeById = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  return res.status(200).json(formatResponse(resume, "Resume retrieved"));
});

export const updateResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;
  const { title, fileUrl, fileType } = req.body;
  const userId = req.user._id;

  const resume = await Resume.findById(resumeId);
  if (!resume || resume.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to update this resume"));
  }

  const updatedResume = await Resume.findByIdAndUpdate(
    resumeId,
    { title, fileUrl, fileType, updatedAt: new Date() },
    { new: true },
  );

  return res.status(200).json(formatResponse(updatedResume, "Resume updated"));
});

export const deleteResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;
  const userId = req.user._id;

  const resume = await Resume.findById(resumeId);
  if (!resume || resume.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to delete this resume"));
  }

  await Resume.findByIdAndDelete(resumeId);

  return res.status(200).json(formatResponse(null, "Resume deleted"));
});

export const duplicateResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;
  const userId = req.user._id;

  const originalResume = await Resume.findById(resumeId);
  if (!originalResume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const duplicatedResume = await Resume.create({
    userId,
    title: `${originalResume.title} (Copy)`,
    fileUrl: originalResume.fileUrl,
    fileType: originalResume.fileType,
    extractedText: originalResume.extractedText,
  });

  return res
    .status(201)
    .json(formatResponse(duplicatedResume, "Resume duplicated"));
});

export const shareResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;
  const userId = req.user._id;

  const resume = await Resume.findById(resumeId);
  if (!resume || resume.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to share this resume"));
  }

  return res
    .status(200)
    .json(formatResponse(resume, "Resume can be shared via URL"));
});

export const downloadResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const pdfBuffer = await resumeService.generatePdf(resume.extractedText);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${resume.title}.pdf"`,
  );
  res.send(pdfBuffer);
});

export const exportResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.params;
  const { format = "pdf" } = req.query;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  let exported: any;
  if (format === "pdf") {
    exported = await resumeService.generatePdf(resume.extractedText);
    res.setHeader("Content-Type", "application/pdf");
  } else if (format === "docx") {
    exported = await resumeService.generateDocx(resume.extractedText);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  } else {
    exported = resume.extractedText;
    res.setHeader("Content-Type", "application/json");
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${resume.title}.${format}"`,
  );
  res.send(exported);
});

export const getTemplates = asyncHandler(async (req: any, res: any) => {
  const templates = await resumeService.getAvailableTemplates();

  return res.status(200).json(formatResponse(templates, "Templates retrieved"));
});

export const searchResumes = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { query = "", page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const resumes = await Resume.find({
    userId,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { extractedText: { $regex: query, $options: "i" } },
    ],
  })
    .skip(skip)
    .limit(limit);

  const total = await Resume.countDocuments({
    userId,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { extractedText: { $regex: query, $options: "i" } },
    ],
  });

  return res
    .status(200)
    .json(
      formatResponse(
        { resumes, total, pages: Math.ceil(total / limit) },
        "Search results",
      ),
    );
});
