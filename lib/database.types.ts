export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      shirts: {
        Row: {
          id: string
          name: string
          size: string
          color: string
          material: string
          quantity: number
          price: number
          description: string | null
          paid: boolean | null
          created_at: string
          model_number: number | null
          order_group: string | null
          image_url: string | null
          payment_proof_url: string | null
          payment_method: string | null
        }
        Insert: {
          id?: string
          name: string
          size: string
          color: string
          material: string
          quantity: number
          price: number
          description?: string | null
          paid?: boolean | null
          created_at?: string
          model_number?: number | null
          order_group?: string | null
          image_url?: string | null
          payment_proof_url?: string | null
          payment_method?: string | null
        }
        Update: {
          id?: string
          name?: string
          size?: string
          color?: string
          material?: string
          quantity?: number
          price?: number
          description?: string | null
          paid?: boolean | null
          created_at?: string
          model_number?: number | null
          order_group?: string | null
          image_url?: string | null
          payment_proof_url?: string | null
          payment_method?: string | null
        }
      }
    }
  }
}

