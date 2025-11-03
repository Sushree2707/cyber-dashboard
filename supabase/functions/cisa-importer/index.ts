// supabase/functions/cisa-importer/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // This is needed for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Fetch data from CISA
    const response = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json')
    if (!response.ok) {
      throw new Error(`CISA API request failed: ${response.statusText}`)
    }
    const data = await response.json()

    // 2. Format the data for our table
    const vulnerabilitiesToInsert = data.vulnerabilities.map((vuln) => ({
      name: vuln.vulnerabilityName,
      risk: 'Critical',
    }))

    // 3. Create a Supabase client to talk to our database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 4. Insert the data into our table
    const { error } = await supabase.from('Vulnerabilities').insert(vulnerabilitiesToInsert)

    if (error) {
      throw error
    }

    // 5. Send a success message back
    return new Response(
      JSON.stringify({ message: `Successfully imported ${vulnerabilitiesToInsert.length} vulnerabilities!` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})