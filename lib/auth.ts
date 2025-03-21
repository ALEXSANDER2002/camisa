import { supabase } from "./supabase"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export type User = {
  id: string
  email: string
}

// Verificar se o usuário está autenticado
export async function getUser(): Promise<User | null> {
  const cookieStore = cookies()
  const supabaseToken = cookieStore.get("supabase-auth-token")?.value

  if (!supabaseToken) {
    return null
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(supabaseToken)

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || "",
    }
  } catch (error) {
    console.error("Erro ao obter usuário:", error)
    return null
  }
}

// Middleware para verificar autenticação
export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return user
}

// Login
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Função revisada para criar o administrador padrão
export async function createDefaultAdmin() {
  // Armazenar em localStorage se já tentamos criar o admin para evitar tentativas repetidas
  if (typeof window !== "undefined") {
    const hasAttempted = localStorage.getItem("admin_creation_attempted")
    if (hasAttempted === "true") {
      console.log("Já tentamos criar o administrador anteriormente, pulando...")
      return false
    }
  }

  const defaultEmail = "admin@boutique.com"
  const defaultPassword = "Admin@123"

  try {
    console.log("Tentando criar administrador padrão...")

    // Tentar criar o usuário diretamente, sem verificar antes
    const { data, error } = await supabase.auth.signUp({
      email: defaultEmail,
      password: defaultPassword,
    })

    if (error) {
      // Se o erro for que o usuário já existe, isso é bom
      if (error.message.includes("already registered")) {
        console.log("Administrador já existe, não é necessário criar")
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_creation_attempted", "true")
        }
        return true
      }

      console.error("Erro ao criar administrador padrão:", error)
      return false
    }

    console.log("Administrador padrão criado com sucesso")
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_creation_attempted", "true")
    }
    return true
  } catch (error) {
    console.error("Erro ao criar administrador padrão:", error)
    return false
  }
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  redirect("/admin/login")
}

