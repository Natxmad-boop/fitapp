import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvcjqpgxaddctjnrcgah.supabase.co'
const supabaseAnonKey = 'Sb_publishable_cJeUKjOyCqj_qfQT5IIiiw_ebIzYk12'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
