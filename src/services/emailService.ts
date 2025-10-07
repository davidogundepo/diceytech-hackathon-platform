const RESEND_API_KEY = 're_9zw7iYrc_7cZx3yGFDKAJjaawQWStxJy3';
const ADMIN_EMAILS = [
  'olu@redtechafrica.com',
  'wilson@redtechafrica.com',
  'dapo@redtechafrica.com',
  'david@redtechafrica.com'
];

export const sendWelcomeEmails = async (userEmail: string, userName: string) => {
  try {
    console.log('📧 Sending welcome emails for:', userEmail);
    console.log('🔑 Using API key:', RESEND_API_KEY ? 'Key present' : 'Key missing');

    // Send email to new user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DiceyTech <onboarding@resend.dev>',
        to: [userEmail],
        subject: 'Welcome to DiceyTech! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to DiceyTech! 🚀</h1>
                </div>
                <div class="content">
                  <h2>Hey ${userName}! 👋</h2>
                  <p>We're thrilled to have you join the DiceyTech community! You're now part of Nigeria's most innovative hackathon platform.</p>
                  
                  <p><strong>What's next?</strong></p>
                  <ul>
                    <li>🎯 Complete your profile to stand out</li>
                    <li>🏆 Browse upcoming hackathons</li>
                    <li>💡 Showcase your projects</li>
                    <li>🤝 Connect with fellow innovators</li>
                  </ul>
                  
                  <div style="text-align: center;">
                    <a href="${window.location.origin}/dashboard" class="button">Get Started</a>
                  </div>
                  
                  <p>Need help? Feel free to reach out to our team anytime. We're here to support your innovation journey!</p>
                  
                  <p>Happy building! 💻</p>
                  <p><strong>The DiceyTech Team</strong></p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} DiceyTech. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    const userEmailData = await userEmailResponse.json();
    console.log('✅ User email response:', userEmailData);

    if (!userEmailResponse.ok) {
      console.error('❌ User email failed:', userEmailData);
    }

    // Send notification to admins
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DiceyTech <onboarding@resend.dev>',
        to: ADMIN_EMAILS,
        subject: '🎉 New User Registration - DiceyTech',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #667eea; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>New User Registration Alert</h2>
                </div>
                <div class="content">
                  <p>A new user has registered on DiceyTech platform!</p>
                  
                  <div class="info-box">
                    <p><strong>Name:</strong> ${userName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
                  </div>
                  
                  <p>Please ensure to monitor user activity and provide support if needed.</p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    const adminEmailData = await adminEmailResponse.json();
    console.log('✅ Admin email response:', adminEmailData);

    if (!adminEmailResponse.ok) {
      console.error('❌ Admin email failed:', adminEmailData);
    }

    console.log('✅ Welcome emails sent successfully');
  } catch (error) {
    console.error('⚠️ Failed to send welcome emails:', error);
    // Don't throw - email failure shouldn't block registration
  }
};

export const sendApplicationConfirmation = async (
  userEmail: string,
  userName: string,
  hackathonTitle: string,
  teamName: string
) => {
  try {
    console.log('📧 Sending application confirmation for:', hackathonTitle);
    console.log('🔑 Using API key:', RESEND_API_KEY ? 'Key present' : 'Key missing');

    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DiceyTech Hackathons <onboarding@resend.dev>',
        to: [userEmail],
        subject: `Application Received: ${hackathonTitle} ✅`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
                .status-badge { display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Application Confirmed!</h1>
                </div>
                <div class="content">
                  <p>Hi <strong>${userName}</strong>,</p>
                  
                  <p>Great news! We've received your hackathon application.</p>
                  
                  <div class="info-box">
                    <p><strong>Hackathon:</strong> ${hackathonTitle}</p>
                    <p><strong>Team Name:</strong> ${teamName}</p>
                    <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge">PENDING REVIEW</span></p>
                  </div>
                  
                  <h3>What happens next?</h3>
                  <ul>
                    <li>📋 Our team will review your application carefully</li>
                    <li>📧 You'll receive an email notification about your application status</li>
                    <li>✅ If accepted, you'll get further instructions and event details</li>
                    <li>🤝 Stay active on the platform to increase your chances</li>
                  </ul>
                  
                  <p><strong>Review Timeline:</strong> Applications are typically reviewed within 3-5 business days. We appreciate your patience!</p>
                  
                  <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>💡 Pro Tip:</strong> While you wait, complete your profile and showcase your projects to stand out!</p>
                  </div>
                  
                  <p>We're excited about your participation and look forward to seeing what you'll create!</p>
                  
                  <p>Best of luck! 🚀</p>
                  <p><strong>The DiceyTech Team</strong></p>
                </div>
                <div class="footer">
                  <p>Questions? Reach out to us anytime!</p>
                  <p>© ${new Date().getFullYear()} DiceyTech. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    const confirmationData = await confirmationResponse.json();
    console.log('✅ Application confirmation response:', confirmationData);

    if (!confirmationResponse.ok) {
      console.error('❌ Application confirmation failed:', confirmationData);
    }

    console.log('✅ Application confirmation email sent successfully');
  } catch (error) {
    console.error('⚠️ Failed to send application confirmation:', error);
    // Don't throw - email failure shouldn't block application
  }
};
