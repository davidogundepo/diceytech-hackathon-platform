import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationConfirmationRequest {
  userEmail: string;
  userName: string;
  hackathonTitle: string;
  teamName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, hackathonTitle, teamName }: ApplicationConfirmationRequest = await req.json();

    console.log('📧 Sending application confirmation for:', hackathonTitle);

    const confirmationResponse = await resend.emails.send({
      from: "DiceyTech Hackathons <onboarding@resend.dev>",
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
      `,
    });

    console.log('✅ Application confirmation sent:', confirmationResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("❌ Error sending confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
