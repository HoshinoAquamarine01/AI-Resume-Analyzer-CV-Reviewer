export const coverLetterService = {
  generate: async (
    resumeId: string,
    jobTitle: string,
    company: string,
    jobDescription: string,
  ) => {
    return "Generated cover letter";
  },

  improveSection: async (content: string, section: string) => {
    return content;
  },

  generatePdf: async (content: string) => {
    return Buffer.from(content);
  },
};
