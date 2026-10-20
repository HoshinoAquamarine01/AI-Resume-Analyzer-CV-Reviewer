export const getResumeAnalysisPrompt = (resumeText: string): string => `
You are a world-class HR Director, Resume Auditor, and Senior Recruiter.
Analyze the following candidate resume thoroughly and evaluate its overall score, ATS compatibility, strengths, weaknesses, missing skills, keyword suggestions, grammar/phrasing issues, formatting recommendations, suitable roles, and actionable improvement steps.

Candidate Resume Text:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this exact schema:
{
  "overallScore": 85,
  "atsCompatibility": 80,
  "strengths": ["Strong TypeScript background", "Good experience with microservices"],
  "weaknesses": ["Lacks quantitative metrics in bullet points", "Summary section is brief"],
  "missingSkills": ["Docker", "Kubernetes", "CI/CD"],
  "keywordSuggestions": ["Scalability", "Unit Testing", "System Architecture"],
  "grammarIssues": ["Consider changing 'responsible for' to active verbs like 'spearheaded'"],
  "formattingIssues": ["Add clear section dividers"],
  "recommendedRoles": ["Fullstack Engineer", "Backend Developer", "Node.js Developer"],
  "improvementTips": ["Quantify experience achievements with percentage increases or revenue impact"]
}

All scores must be integers between 0 and 100.
All arrays should contain clear, actionable strings.
Return ONLY pure JSON.`;
