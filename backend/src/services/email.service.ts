import {Resend} from 'resend'
const resendApiKey = process.env.RESEND_API_KEY as string
const resend = resendApiKey ? new Resend(resendApiKey) : null
export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
): Promise<boolean> => {
  if (!resend) {
    return false
  }
  try{
      const {data, error} = await resend.emails.send({
        from: '<noreply@yourdomain.com>',
        to,
        subject,
        html:body
      })
      if(error) return false
      return true
  }catch(error){

    return false
  }
};
