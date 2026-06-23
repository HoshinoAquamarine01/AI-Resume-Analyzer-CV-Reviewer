export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
): Promise<boolean> => {
  console.log(`[Email Service] Simulated Email Sent:`);
  console.log(`  To: ${to}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Content Preview: ${body.replace(/\n/g, " | ").substring(0, 100)}...`);
  return true;
};
