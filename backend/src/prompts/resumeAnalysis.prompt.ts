export const getResumeAnalysisPrompt = (resumeText: string): string => `
You are an expert AI resume reviewer and ATS (Applicant Tracking System) specialist.
Please analyze the provided resume text and provide a detailed evaluation.

Here is the resume text to analyze:
"""
${resumeText}
"""

Evaluate the resume based on the following criteria:
1. Overall impact and clarity.
2. ATS readability and keyword optimization.
3. Experience and achievements quantification.
4. Formatting and structure (inferred from the text).
5. Grammar, spelling, and professional tone.

Provide your response STRICTLY as a JSON object with the following structure:
{
  "score": <number between 0 and 100 representing the overall quality>,
  "summary": "<a brief overall assessment of the resume>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "suggestions": [
    {
      "section": "<e.g., Experience, Education, Skills, Summary, General>",
      "advice": "<specific and actionable advice for improvement>"
    }
  ],
  "keywords": ["<detected keyword 1>", "<detected keyword 2>", ...]
}

IMPORTANT:
- Ensure the output is valid JSON.
- Do not include any markdown formatting like \`\`\`json.
- Return ONLY the JSON object.
`;
