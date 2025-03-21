import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware desativado completamente
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: [], // Nenhuma rota corresponderá a este middleware
}

