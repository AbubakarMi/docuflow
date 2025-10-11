import { Resend } from 'resend'

const resend = new Resend('re_X22GgK6r_LV8dW6yS54e8Pz6bS6Ah3RDv')

export async function sendRegistrationPendingEmail(to: string, businessName: string, adminName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DocuFlow <onboarding@resend.dev>',
      to: [to],
      subject: 'Registration Pending - DocuFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Pending</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">DocuFlow</h1>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #4f46e5; margin-top: 0;">Registration Received!</h2>

              <p style="font-size: 16px;">Dear ${adminName},</p>

              <p style="font-size: 16px;">Thank you for registering <strong>${businessName}</strong> with DocuFlow.</p>

              <div style="background: white; border-left: 4px solid #4f46e5; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px;">
                  <strong>Your registration is currently pending approval.</strong>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                  Our SuperAdmin team will review your registration and you will receive a notification once your account has been approved.
                </p>
              </div>

              <p style="font-size: 16px;">This process usually takes 24-48 hours. You'll receive an email notification once your account is approved and ready to use.</p>

              <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The DocuFlow Team</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} DocuFlow. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Email sending error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending exception:', error)
    return { success: false, error }
  }
}

export async function sendApprovalEmail(to: string, businessName: string, adminName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DocuFlow <onboarding@resend.dev>',
      to: [to],
      subject: 'Account Approved - Welcome to DocuFlow!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Approved</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">DocuFlow</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Account Approved! 🎉</p>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #10b981; margin-top: 0;">Welcome to DocuFlow!</h2>

              <p style="font-size: 16px;">Dear ${adminName},</p>

              <p style="font-size: 16px;">Great news! Your business account <strong>${businessName}</strong> has been approved and is now active.</p>

              <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px;">
                  <strong>You can now sign in and start using DocuFlow!</strong>
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/login"
                   style="display: inline-block; background: #4f46e5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Sign In Now
                </a>
              </div>

              <h3 style="color: #4f46e5; font-size: 18px;">Get Started:</h3>
              <ul style="font-size: 16px; line-height: 1.8;">
                <li>Generate your first invoice</li>
                <li>Set up your inventory items</li>
                <li>Invite team members</li>
                <li>Customize your invoice templates</li>
              </ul>

              <p style="font-size: 16px; margin-top: 30px;">
                If you have any questions, our support team is here to help 24/7.
              </p>

              <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The DocuFlow Team</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} DocuFlow. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Email sending error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending exception:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetOTP(to: string, otp: string, userName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DocuFlow <security@resend.dev>',
      to: [to],
      subject: 'Password Reset OTP - DocuFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">DocuFlow</h1>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #4f46e5; margin-top: 0;">Password Reset Request</h2>

              <p style="font-size: 16px;">Dear ${userName},</p>

              <p style="font-size: 16px;">We received a request to reset your password. Use the OTP code below to proceed:</p>

              <div style="background: white; border: 2px dashed #4f46e5; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                <p style="margin: 10px 0 0 0; font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 8px; font-family: monospace;">
                  ${otp}
                </p>
              </div>

              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  <strong>⚠️ Security Notice:</strong> This OTP will expire in 10 minutes. If you didn't request this, please ignore this email and your password will remain unchanged.
                </p>
              </div>

              <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The DocuFlow Team</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} DocuFlow. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Email sending error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending exception:', error)
    return { success: false, error }
  }
}
