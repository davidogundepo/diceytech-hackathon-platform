import { supabase } from '@/integrations/supabase/client';

export const sendWelcomeEmails = async (userEmail: string, userName: string) => {
  try {
    console.log('📧 Calling edge function to send welcome emails for:', userEmail);
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: { userEmail, userName }
    });
    
    if (error) {
      console.error('❌ Welcome email edge function error:', error);
    } else {
      console.log('✅ Welcome emails sent successfully:', data);
    }
  } catch (error) {
    console.error('⚠️ Failed to call welcome email function:', error);
  }
};

export const sendApplicationConfirmation = async (
  userEmail: string,
  userName: string,
  hackathonTitle: string,
  teamName: string
) => {
  try {
    console.log('📧 Calling edge function to send application confirmation for:', hackathonTitle);
    const { data, error } = await supabase.functions.invoke('send-application-confirmation', {
      body: { userEmail, userName, hackathonTitle, teamName }
    });
    
    if (error) {
      console.error('❌ Application confirmation edge function error:', error);
    } else {
      console.log('✅ Application confirmation sent successfully:', data);
    }
  } catch (error) {
    console.error('⚠️ Failed to call application confirmation function:', error);
  }
};

export const sendHostRequestEmail = async (
  contactEmail: string,
  companyName: string,
  contactName: string,
  eventTitle: string,
  location: string,
  date: string,
  participants: number,
  budget: number,
  description: string
) => {
  try {
    console.log('📧 Calling edge function to send host request emails for:', companyName);
    const { data, error } = await supabase.functions.invoke('send-host-request-email', {
      body: { 
        contactEmail, 
        companyName, 
        contactName,
        eventTitle,
        location,
        date,
        participants,
        budget,
        description
      }
    });
    
    if (error) {
      console.error('❌ Host request email edge function error:', error);
    } else {
      console.log('✅ Host request emails sent successfully:', data);
    }
  } catch (error) {
    console.error('⚠️ Failed to call host request email function:', error);
  }
};
