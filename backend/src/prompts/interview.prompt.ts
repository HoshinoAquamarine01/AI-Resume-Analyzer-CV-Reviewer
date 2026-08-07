export const getInterviewQuestionsPrompt = (
  resumeText: string,
  jobDescription: string
): string => `
You are a Hiring Manager and Technical Interviewer.
Based on the candidate's resume and target job description, generate top interview questions along with key points the candidate should address in their answers.

Candidate Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return ONLY a valid JSON object:
{
  "questions": [
    {
      "question": "Can you describe a challenging backend problem you solved with NestJS?",
      "category": "technical",
      "purpose": "Evaluate backend depth and framework mastery",
      "answerOutline": "Mention architecture, caching, MongoDB indexing, and performance results."
    }
  ],
  "generalTips": ["Focus on quantifiable achievements during technical questions"]
}

Return ONLY pure JSON.`;
