import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://YOUR-PROJECT-ID.supabase.co'
const supabaseAnonKey = 'YOUR-ANON-KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
