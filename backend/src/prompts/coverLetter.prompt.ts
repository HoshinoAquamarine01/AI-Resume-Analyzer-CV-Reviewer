export const getCoverLetterPrompt = (
  resumeText: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string
): string => `
You are a Professional Career Coach and Executive Resume Writer.
Generate a high-converting, professional cover letter tailored for the target role and company based on the candidate's resume.

Candidate Resume:
"""
${resumeText}
"""

Target Role: ${jobTitle}
Company Name: ${companyName}
Job Description:
"""
${jobDescription}
"""

Return ONLY a valid JSON object matching this schema:
{
  "coverLetter": "Dear Hiring Manager at ${companyName}...",
  "keyHighlights": ["Highlight 1", "Highlight 2"]
}

Return ONLY pure JSON.`;
