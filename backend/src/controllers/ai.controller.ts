import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";
import { aiService } from "../services/ai.service";
import { Resume } from "../models/Resume";
import { ResumeAnalysis } from "../models/ResumeAnalysis";

export const analyzeResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.body;
  const userId = req.user._id;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const analysis = await aiService.analyzeResume(resume.extractedText);

  const savedAnalysis = await ResumeAnalysis.create({
    resumeId,
    userId,
    overallScore: analysis.score,
  });

  return res
    .status(200)
    .json(formatResponse(savedAnalysis, "Resume analysis completed"));
});

export const generateAtsOptimization = asyncHandler(
  async (req: any, res: any) => {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json(formatResponse(null, "Resume not found"));
    }

    const optimizedContent = await aiService.optimizeForAts(
      resume.extractedText,
      jobDescription,
    );

    await Resume.findByIdAndUpdate(resumeId, {
      extractedText: optimizedContent,
    });

    return res
      .status(200)
      .json(
        formatResponse(
          { extractedText: optimizedContent },
          "ATS optimization completed",
        ),
      );
  },
);

export const generateCoverLetter = asyncHandler(async (req: any, res: any) => {
  const { resumeId, jobTitle, companyName, jobDescription } = req.body;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const coverLetter = await aiService.generateCoverLetter(
    resume.extractedText,
    jobTitle,
    companyName,
    jobDescription,
  );

  return res
    .status(200)
    .json(formatResponse({ coverLetter }, "Cover letter generated"));
});

export const matchJobDescriptions = asyncHandler(async (req: any, res: any) => {
  const { resumeId, jobDescriptions } = req.body;
  const userId = req.user._id;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const matches = await aiService.matchJobs(
    resume.extractedText,
    jobDescriptions,
  );

  return res
    .status(200)
    .json(formatResponse(matches, "Job matching completed"));
});

export const generateInterviewQuestions = asyncHandler(
  async (req: any, res: any) => {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json(formatResponse(null, "Resume not found"));
    }

    const questions = await aiService.generateInterviewQuestions(
      resume.extractedText,
      jobDescription,
    );

    return res
      .status(200)
      .json(formatResponse(questions, "Interview questions generated"));
  },
);

export const improveResume = asyncHandler(async (req: any, res: any) => {
  const { resumeId, section } = req.body;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const improvedText = await aiService.improveResumeSection(
    resume.extractedText,
    section,
  );

  await Resume.findByIdAndUpdate(resumeId, { extractedText: improvedText });

  return res
    .status(200)
    .json(formatResponse({ extractedText: improvedText }, "Resume improved"));
});

export const extractSkills = asyncHandler(async (req: any, res: any) => {
  const { resumeId } = req.body;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return res.status(404).json(formatResponse(null, "Resume not found"));
  }

  const skills = await aiService.extractSkills(resume.extractedText);

  return res.status(200).json(formatResponse({ skills }, "Skills extracted"));
});
