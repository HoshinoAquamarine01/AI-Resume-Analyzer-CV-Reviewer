export const getAtsOptimizationPrompt = (
  resumeText: string,
  jobDescription: string
): string => `
You are an expert ATS (Applicant Tracking System) Specialist and Executive Resume Writer.
Analyze this resume against the target job description. Optimize the text to maximize ATS match score and highlight relevant skills.

Candidate Resume Text:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Return ONLY a valid JSON object matching this schema:
{
  "atsScore": 88,
  "matchingKeywords": ["TypeScript", "NestJS", "REST API"],
  "missingKeywords": ["GraphQL", "Docker"],
  "optimizedResumeText": "Full rewritten and ATS-optimized resume content here...",
  "optimizationSuggestions": ["Emphasize experience with REST APIs in the summary section"]
}

Return ONLY pure JSON.`;
