import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ermhpudigwhrwahngfhy.supabase.co'
const supabaseAnonKey = 'sb_publishable_DvRJKHnh7OgNXLT2MfWFaA_MjU2HBF-'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)