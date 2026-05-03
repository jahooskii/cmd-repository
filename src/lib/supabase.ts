import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://thaozrigyzhlnfuqwbtf.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYW96cmlneXpobG5mdXF3YnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mjk2MzQsImV4cCI6MjA5MzQwNTYzNH0._6VgbNk5LROBUnhkJscIvV75Za_IaEbyGsxFIzCtT9U'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key loaded:', !!supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey)
