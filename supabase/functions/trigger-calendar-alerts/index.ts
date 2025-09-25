
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not found");
    }

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get all users with active email alerts for creative agenda
    const { data: alertConfigs, error: alertError } = await supabase
      .from('alertas_email')
      .select(`
        id,
        usuario_id,
        config,
        ultima_execucao
      `)
      .eq('tipo', 'agenda_criativa')
      .eq('ativo', true);
      
    if (alertError) {
      throw new Error(`Error fetching alert configs: ${alertError.message}`);
    }
    
    if (!alertConfigs || alertConfigs.length === 0) {
      console.log("No active calendar alerts found.");
      return new Response(
        JSON.stringify({ message: "No active calendar alerts found" }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${alertConfigs.length} active calendar alerts`);
    
    const now = new Date();
    const todayDay = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const processedAlerts = [];
    
    // Process each alert configuration
    for (const config of alertConfigs) {
      try {
        const userId = config.usuario_id;
        const frequency = config.config?.frequency || "weekly";
        const lastExecution = config.ultima_execucao ? new Date(config.ultima_execucao) : null;
        
        // Check if we should send this alert today
        let shouldSend = false;
        
        if (frequency === "daily") {
          // For daily frequency, check if it's been at least 24 hours
          shouldSend = !lastExecution || ((now.getTime() - lastExecution.getTime()) >= 24 * 60 * 60 * 1000);
        } else if (frequency === "weekly") {
          // For weekly frequency, send on Mondays
          shouldSend = (todayDay === 1) && (!lastExecution || 
            (lastExecution.getDay() !== 1 || 
             (now.getTime() - lastExecution.getTime()) >= 7 * 24 * 60 * 60 * 1000));
        } else if (frequency === "intelligent") {
          // For intelligent frequency, check if it's been at least 3 days
          shouldSend = !lastExecution || ((now.getTime() - lastExecution.getTime()) >= 3 * 24 * 60 * 60 * 1000);
        }
        
        if (shouldSend) {
          // Get week suggestions for this user
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 7); // One week ahead
          
          const { data: weekSuggestions, error: suggestionsError } = await supabase
            .from('agenda')
            .select('*')
            .eq('usuario_id', userId)
            .gte('data', startDate.toISOString().split('T')[0])
            .lte('data', endDate.toISOString().split('T')[0]);
            
          if (suggestionsError) {
            console.error(`Error fetching suggestions for user ${userId}:`, suggestionsError);
          }
          
          // If no suggestions in database, generate them from the edge function
          let weekData = weekSuggestions || [];
          
          if (weekData.length === 0) {
            // We'd need to get calendar suggestions from the calendar function
            // For now, we'll just send an empty array
            console.log(`No suggestions found for user ${userId}, sending generic email`);
          }
          
          // Call the send-calendar-alert function to send the email
          const callResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-calendar-alert`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              userId,
              frequency,
              weekData
            })
          });
          
          if (callResponse.ok) {
            processedAlerts.push({
              userId,
              status: "success",
              message: "Email sent successfully"
            });
          } else {
            const errorText = await callResponse.text();
            throw new Error(`Failed to send alert for user ${userId}: ${errorText}`);
          }
        } else {
          console.log(`No need to send alert for user ${userId} today`);
        }
      } catch (userError: any) {
        console.error(`Error processing alert for user ${config.usuario_id}:`, userError);
        processedAlerts.push({
          userId: config.usuario_id,
          status: "error",
          message: userError.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        processed: processedAlerts.length,
        results: processedAlerts
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in trigger-calendar-alerts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
