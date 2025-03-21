import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Usar as novas credenciais do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ppsbexzaqtxoadtrcquu.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2JleHphcXR4b2FkdHJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTcyMDAsImV4cCI6MjA1Nzc5MzIwMH0.3qvL5aZuzGXP394Dj6IQDaLWmhFNJPC_KL-vBAwzy_8"

// Criar um cliente mock para quando as credenciais não estiverem disponíveis
const createMockClient = () => {
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: new Error("Supabase não configurado") }),
      insert: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }),
      update: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }),
      delete: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }),
      eq: () => ({ select: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }) }),
      order: () => ({ select: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }) }),
      limit: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }),
    }),
    rpc: () => Promise.resolve({ data: null, error: new Error("Supabase não configurado") }),
  } as any
}

// Função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl.length > 0 && supabaseAnonKey.length > 0
}

// Criar o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

