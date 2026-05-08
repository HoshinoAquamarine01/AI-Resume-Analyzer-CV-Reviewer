export const resumeService = {
  generatePdf: async (content: string) => {
    return Buffer.from(content);
  },

  generateDocx: async (content: string) => {
    return Buffer.from(content);
  },

  getAvailableTemplates: async () => {
    return [
      { id: 1, name: "Modern" },
      { id: 2, name: "Classic" },
      { id: 3, name: "Creative" },
    ];
  },
};
