export interface Shirt {
  id: string
  name: string
  size: string
  color: string
  material: string
  quantity: number
  price: number
  description: string
  paid: boolean
  status?: "pendente" | "confirmado" | "produção" | "concluído" | "cancelado"
  model_number?: number // 1 ou 2, para identificar qual modelo é
  order_group?: string // ID para agrupar modelos do mesmo pedido
  image_url?: string // URL da imagem do modelo
  payment_method?: "pix" | "outro" | null // Método de pagamento
  payment_proof_url?: string // URL do comprovante de pagamento
}

