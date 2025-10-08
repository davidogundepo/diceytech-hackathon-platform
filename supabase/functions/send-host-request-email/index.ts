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

interface HostRequestEmailData {
  contactEmail: string;
  companyName: string;
  contactName?: string;
  eventTitle: string;
  location?: string;
  date: string;
  participants?: number;
  budget?: number;
  description?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: HostRequestEmailData = await req.json();

    console.log('📧 Sending host request emails for:', data.companyName);

    // Send confirmation to requester
    const clientEmailResponse = await resend.emails.send({
      from: "DiceyTech <onboarding@resend.dev>",
      to: [data.contactEmail],
      subject: `We received your hosting request, ${data.companyName}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Host request received 🎉</h2>
              </div>
              <div class="content">
                <p>Hi ${data.contactName || 'there'},</p>
                <p>Thanks for your interest in hosting a hackathon with DiceyTech. We received your request for <strong>${data.companyName}</strong> and our team will be in touch shortly.</p>
                <p>We'll review your details and reach out to coordinate next steps.</p>
                <p>— The DiceyTech Team</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} DiceyTech. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Client email sent:', clientEmailResponse);

    // Send notification to admins
    const adminEmailResponse = await resend.emails.send({
      from: "DiceyTech <onboarding@resend.dev>",
      to: ADMIN_EMAILS,
      subject: "🎯 New Hackathon Hosting Request - DiceyTech",
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
                <h2>New Hosting Request</h2>
              </div>
              <div class="content">
                <p>A company wants to host a hackathon!</p>
                
                <div class="info-box">
                  <p><strong>Company:</strong> ${data.companyName}</p>
                  <p><strong>Contact:</strong> ${data.contactName || 'N/A'}</p>
                  <p><strong>Email:</strong> ${data.contactEmail}</p>
                  <p><strong>Event Title:</strong> ${data.eventTitle}</p>
                  <p><strong>Date:</strong> ${new Date(data.date).toLocaleString()}</p>
                  <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                  <p><strong>Participants:</strong> ${data.participants || 'N/A'}</p>
                  <p><strong>Budget:</strong> ₦${data.budget?.toLocaleString() || 'N/A'}</p>
                  ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
                </div>
                
                <p>Follow up with the requester soon!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Admin emails sent:', adminEmailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("❌ Error sending host request emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
