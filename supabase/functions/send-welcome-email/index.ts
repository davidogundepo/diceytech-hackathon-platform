import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const ADMIN_EMAILS = [
  'olu@redtechafrica.com',
  'wilson@redtechafrica.com',
  'dapo@redtechafrica.com',
  'david@redtechafrica.com'
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userEmail: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName }: WelcomeEmailRequest = await req.json();

    console.log('📧 Sending welcome email to:', userEmail);

    // Send email to new user
    const userEmailResponse = await resend.emails.send({
      from: "DiceyTech <onboarding@resend.dev>",
      to: [userEmail],
      subject: "Welcome to DiceyTech! 🎉",
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
      `,
    });

    console.log('✅ User email sent:', userEmailResponse);

    // Send notification to admins
    const adminEmailResponse = await resend.emails.send({
      from: "DiceyTech <onboarding@resend.dev>",
      to: ADMIN_EMAILS,
      subject: "🎉 New User Registration - DiceyTech",
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
      `,
    });

    console.log('✅ Admin email sent:', adminEmailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("❌ Error sending welcome emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
