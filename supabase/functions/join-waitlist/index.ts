import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, stats } = await req.json()
    
    console.log('Received request with email:', email);
    console.log('Received stats:', JSON.stringify(stats));

    // Validate email format and length
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !email.trim() || email.length > 255 || !emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required (max 255 characters)' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get client IP address from headers
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                      req.headers.get('x-real-ip') || 
                      'unknown'

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check for duplicate email
    const { data: existingEmail, error: emailCheckError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .limit(1)

    if (emailCheckError) {
      console.error('Email check error:', emailCheckError.message)
    }

    if (existingEmail && existingEmail.length > 0) {
      return new Response(
        JSON.stringify({ error: 'This email is already registered on the waitlist' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Rate limiting by IP: Max 5 submissions per hour from same IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count, error: rateLimitError } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo)

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError.message)
    }

    if (count && count >= 5) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions from your IP address. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insert into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: email.trim().toLowerCase(),
        ip_address: ipAddress,
        session_start: stats?.sessionStart || null,
        clicks_saved: stats?.clicksSaved || 0,
        untraveled_pixels: stats?.untraveledPixels || 0,
        discarded_suggestions: stats?.discardedSuggestions || 0,
        total_clicks: stats?.totalClicks || 0,
        space_bar_presses: stats?.spaceBarPresses || 0,
        physically_traveled_pixels: stats?.physicallyTraveledPixels || 0,
        savings_travel_percent: stats?.savingsTravelPercent || 0,
        savings_clicks_percent: stats?.savingsClicksPercent || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error.message)
      return new Response(
        JSON.stringify({ error: 'Failed to join waitlist' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully added to waitlist - ID:', data.id)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in join-waitlist function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})