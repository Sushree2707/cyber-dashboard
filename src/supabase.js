// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Get the keys from Vercel's Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)