"use server";

import { Resend } from "resend";

import { SelfMailTemplate } from "@/components/EmailTemplates/selfMail";
import { UserMailTemplate } from "@/components/EmailTemplates/userMail";
import { RESEND_FROM_EMAIL, RESEND_TO_EMAIL, RESEND_API, RESEND_USER_MAIL_SENDER_MAIL } from "@/lib/constants";

export async function sendEmail(data: { from_name: string; message: string; sender_email: string }) {
  if (!RESEND_API || !RESEND_TO_EMAIL || !RESEND_FROM_EMAIL) {
    return { error: "Failed to send email", status: 500 };
  }

  const resend = new Resend(RESEND_API);

  try {
    const resp = await Promise.all([
      resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: RESEND_TO_EMAIL,
        subject: `📧 New Portfolio Contact form submission from ${data.sender_email}`,
        react: SelfMailTemplate(data)
      }),
      resend.emails.send({
        from: RESEND_USER_MAIL_SENDER_MAIL,
        to: data.sender_email,
        subject: "✨ Thanks for Connecting | Pulkit",
        react: UserMailTemplate({
          from_name: data.from_name,
          user_message: data.message
        })
      })
    ]);

    console.log(resp);

    if (resp.some((r) => r.error)) {
      console.log(resp.map((r) => r.error));
      return { error: "Failed to send email", status: 500 };
    }

    return { message: "Email sent successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to send email", status: 500 };
  }
}
