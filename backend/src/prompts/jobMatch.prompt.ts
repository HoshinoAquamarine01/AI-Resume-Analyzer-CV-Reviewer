export const getJobMatchPrompt = (
  resumeText: string,
  jobDescriptions: string[]
): string => `
You are a Recruitment AI Matcher.
Compare the candidate's resume against each of the provided job descriptions. Evaluate match percentage, matched skills, missing skills, and recommendations for each job.

Candidate Resume:
"""
${resumeText}
"""

Job Descriptions:
${jobDescriptions.map((desc, i) => `--- Job #${i + 1} ---\n${desc}`).join("\n\n")}

Return ONLY a valid JSON array of objects, one per job description in exact sequence:
[
  {
    "index": 0,
    "matchScore": 85,
    "matchedSkills": ["TypeScript", "Node.js"],
    "missingSkills": ["AWS"],
    "recommendations": ["Add cloud deployment experience to your resume"]
  }
]

Return ONLY pure JSON.`;
