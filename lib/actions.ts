"use server"

import { v4 as uuidv4 } from "uuid"
import type { Shirt } from "./types"
import { supabase, isSupabaseConfigured } from "./supabase"
import { revalidatePath } from "next/cache"

export async function getShirts(): Promise<Shirt[]> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    console.error("Supabase não está configurado. Verifique as variáveis de ambiente.")
    return []
  }

  try {
    const { data, error } = await supabase.from("shirts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar camisetas:", error)
      // Se a tabela não existir, retornamos um array vazio em vez de lançar um erro
      return []
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      color: item.color,
      material: item.material,
      quantity: item.quantity,
      price: item.price,
      description: item.description || "",
      paid: item.paid !== undefined ? item.paid : false,
      model_number: item.model_number,
      order_group: item.order_group,
      image_url: item.image_url,
      payment_method: item.payment_method,
      payment_proof_url: item.payment_proof_url,
      ticket_type: item.ticket_type || undefined,
      ticket_price: typeof item.ticket_price === 'number' ? item.ticket_price : undefined
    }))
  } catch (error) {
    console.error("Erro ao buscar camisetas:", error)
    return []
  }
}

export async function uploadImage(file: File): Promise<string | null> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  try {
    // Gerar um nome único para o arquivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `shirt-images/${fileName}`

    // Fazer upload do arquivo para o Supabase Storage
    const { data, error } = await supabase.storage.from("shirts").upload(filePath, file)

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      throw new Error("Falha ao fazer upload da imagem")
    }

    // Obter a URL pública da imagem
    const { data: urlData } = supabase.storage.from("shirts").getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error)
    return null
  }
}

// Adicionar função para upload do comprovante de pagamento
export async function uploadPaymentProof(file: File): Promise<string | undefined> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  try {
    // Verificar e garantir que o bucket existe
    const bucketExists = await ensureSupabaseBucket()
    if (!bucketExists) {
      throw new Error("Não foi possível garantir que o bucket de armazenamento exista")
    }

    // Gerar um nome único para o arquivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `payment-proofs/${fileName}`

    // Fazer upload do arquivo para o Supabase Storage
    const { data, error } = await supabase.storage.from("shirts").upload(filePath, file)

    if (error) {
      console.error("Erro ao fazer upload do comprovante:", error)
      throw new Error("Falha ao fazer upload do comprovante")
    }

    // Obter a URL pública da imagem
    const { data: urlData } = supabase.storage.from("shirts").getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Erro ao fazer upload do comprovante:", error)
    return undefined
  }
}

// Modificar a função addShirt para incluir o comprovante de pagamento
export async function addShirt(
  shirtData: Shirt,
  imageFile?: File | null,
  paymentProofFile?: File | null,
): Promise<Shirt> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  // Fazer upload da imagem, se fornecida
  let imageUrl = shirtData.image_url
  if (imageFile) {
    imageUrl = await uploadImage(imageFile)
  }

  // Fazer upload do comprovante de pagamento, se fornecido
  let paymentProofUrl = shirtData.payment_proof_url
  if (paymentProofFile) {
    paymentProofUrl = await uploadPaymentProof(paymentProofFile)
    // Se o comprovante foi enviado, marcar como pago
    if (paymentProofUrl) {
      shirtData.paid = true
    }
  }

  const newShirt = {
    id: uuidv4(),
    name: shirtData.name,
    size: shirtData.size,
    color: shirtData.color,
    material: shirtData.material,
    quantity: shirtData.quantity,
    price: shirtData.price,
    description: shirtData.description || null,
    paid: shirtData.paid !== undefined ? shirtData.paid : false,
    created_at: new Date().toISOString(),
    model_number: shirtData.model_number,
    order_group: shirtData.order_group,
    image_url: imageUrl,
    payment_method: shirtData.payment_method || null,
    payment_proof_url: paymentProofUrl || null,
    ticket_type: shirtData.ticket_type ? String(shirtData.ticket_type) : null,
    ticket_price: typeof shirtData.ticket_price === 'number' ? shirtData.ticket_price : null
  }

  const { data, error } = await supabase.from("shirts").insert([newShirt]).select()

  if (error) {
    console.error("Erro ao adicionar camiseta:", error)
    throw new Error("Falha ao adicionar camiseta")
  }

  revalidatePath("/")

  return {
    id: newShirt.id,
    name: newShirt.name,
    size: newShirt.size,
    color: newShirt.color,
    material: newShirt.material,
    quantity: newShirt.quantity,
    price: newShirt.price,
    description: newShirt.description || "",
    paid: newShirt.paid,
    model_number: newShirt.model_number,
    order_group: newShirt.order_group,
    image_url: newShirt.image_url,
    payment_method: newShirt.payment_method || undefined,
    payment_proof_url: newShirt.payment_proof_url || undefined,
    ticket_type: newShirt.ticket_type || undefined,
    ticket_price: typeof newShirt.ticket_price === 'number' ? newShirt.ticket_price : undefined
  }
}

export async function updateShirt(shirtData: Shirt, imageFile?: File | null): Promise<Shirt> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  // Fazer upload da imagem, se fornecida
  let imageUrl = shirtData.image_url
  if (imageFile) {
    imageUrl = await uploadImage(imageFile)
  }

  const { data, error } = await supabase
    .from("shirts")
    .update({
      name: shirtData.name,
      size: shirtData.size,
      color: shirtData.color,
      material: shirtData.material,
      quantity: shirtData.quantity,
      price: shirtData.price,
      description: shirtData.description || null,
      paid: shirtData.paid !== undefined ? shirtData.paid : false,
      image_url: imageUrl,
    })
    .eq("id", shirtData.id)
    .select()

  if (error) {
    console.error("Erro ao atualizar camiseta:", error)
    throw new Error("Falha ao atualizar camiseta")
  }

  revalidatePath("/")

  return {
    ...shirtData,
    image_url: imageUrl,
  }
}

// Modificar a função deleteShirt para lidar com a ausência da coluna image_url

export async function deleteShirt(id: string): Promise<void> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não está configurado. Verifique as variáveis de ambiente.")
  }

  try {
    // Primeiro, obter a camiseta para verificar se há uma imagem para excluir
    const { data, error: fetchError } = await supabase.from("shirts").select("*").eq("id", id).single()

    if (fetchError) {
      console.error("Erro ao buscar camiseta para exclusão:", fetchError)
    } else if (data && "image_url" in data && data.image_url) {
      // Verificar se a propriedade image_url existe no objeto data
      // Extrair o caminho do arquivo da URL
      const fileUrl = data.image_url
      const filePath = fileUrl.split("/").slice(-2).join("/")

      // Excluir a imagem do Storage
      const { error: storageError } = await supabase.storage.from("shirts").remove([filePath])

      if (storageError) {
        console.error("Erro ao excluir imagem:", storageError)
      }
    }

    // Excluir a camiseta
    const { error } = await supabase.from("shirts").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir camiseta:", error)
      throw new Error("Falha ao excluir camiseta")
    }

    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao excluir camiseta:", error)
    throw error
  }
}

// Função simplificada para verificar se a tabela existe
export async function checkTableExists(): Promise<boolean> {
  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    console.error("Supabase não está configurado. Verifique as variáveis de ambiente.")
    return false
  }

  try {
    // Tentar selecionar da tabela e ver se funciona
    const { data, error } = await supabase.from("shirts").select("id").limit(1)

    // Se não houver erro, a tabela existe
    if (error) {
      console.error("Erro ao verificar tabela:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao verificar tabela:", error)
    return false
  }
}

export async function updatePaymentStatus(id: string, paid: boolean) {
  try {
    const { error } = await supabase
      .from("shirts")
      .update({ paid })
      .eq("id", id)

    if (error) {
      console.error("Erro ao atualizar status de pagamento:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status de pagamento:", error)
    throw error
  }
}

// Verificar se o bucket de armazenamento existe e criar se necessário
export async function ensureSupabaseBucket(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error("Supabase não está configurado. Verifique as variáveis de ambiente.")
    return false
  }

  try {
    // Verificar se o bucket 'shirts' existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      return false
    }
    
    const shirtsBucketExists = buckets.some(bucket => bucket.name === 'shirts')
    
    if (!shirtsBucketExists) {
      console.log("Bucket 'shirts' não encontrado. Tentando criar...")
      
      // Criar o bucket com acesso público
      const { error: createError } = await supabase.storage.createBucket('shirts', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      })
      
      if (createError) {
        console.error("Erro ao criar bucket:", createError)
        return false
      }
      
      console.log("Bucket 'shirts' criado com sucesso!")
    }
    
    return true
  } catch (error) {
    console.error("Erro ao verificar/criar bucket:", error)
    return false
  }
}

