import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShirtIcon } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-slate-800 py-12 px-4 mb-8 shadow-md relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}></div>
        </div>
        
        <div className="container mx-auto flex flex-col items-center text-center relative">
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-full opacity-70 blur-sm animate-pulse"></div>
            <div className="relative  rounded-full p-2 flex items-center justify-center">
              <img src="/bits-3.png" alt="bits" className="w-20 h-auto" />            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 relative">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white pb-1">
                Sistema de Camisas
              </span>
              <div className="absolute h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent bottom-0 left-0"></div>
            </h1>
            
            <div className="flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 animate-pulse">
                BITS JR
              </span>
              <span className="inline-block ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded transform -rotate-3 shadow-lg">
                v2.0
              </span>
            </div>
            
            <div className="mt-3 max-w-lg mx-auto">
              <p className="text-white/90 text-sm md:text-base">
                Camisetas personalizadas com tecnologia e inovação para conectar estudantes à computação
              </p>
            </div>
          </div>
          
          <Link href="/pedido">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 hover:scale-105 transform transition-transform duration-300 shadow-lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Fazer um Pedido
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-100 bg-gradient-to-b from-white to-blue-50 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            <CardHeader className="bg-white border-b border-blue-100 relative">
              <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-500/10 rounded-full"></div>
              <CardTitle className="flex items-center text-blue-700 group-hover:text-blue-600 transition-colors">
                <ShoppingBag className="h-5 w-5 mr-2 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Faça seu Pedido
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </CardTitle>
              <CardDescription className="text-slate-600">Solicite suas camisetas personalizadas da Bits Jr</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <div className="absolute right-0 bottom-0 w-24 h-24 opacity-5">
                <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9 8.55 9 7.73 10.44 8.07 11.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z" fill="#3b82f6" /></svg>
              </div>
              <p className="mb-4 text-slate-700">
                Preencha nosso formulário online para solicitar suas camisetas personalizadas da Bits Jr. Escolha o tamanho, cor,
                e quantidade desejada.
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-center group/item">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                    <ShirtIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 group-hover/item:text-blue-700 transition-colors">Diversos tamanhos disponíveis</span>
                </li>
                <li className="flex items-center group/item">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                    <ShirtIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 group-hover/item:text-blue-700 transition-colors">Várias opções de cores e materiais</span>
                </li>
                <li className="flex items-center group/item">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                    <ShirtIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 group-hover/item:text-blue-700 transition-colors">Design exclusivo Bits Jr</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-gradient-to-b from-transparent to-blue-50 border-t border-blue-100">
              <Link href="/pedido" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Fazer Pedido Agora
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-100 bg-gradient-to-b from-white to-blue-50 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 to-blue-500"></div>
            <CardHeader className="bg-white border-b border-blue-100 relative">
              <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-500/10 rounded-full"></div>
              <CardTitle className="flex items-center text-blue-700 group-hover:text-blue-600 transition-colors">
                <Lock className="h-5 w-5 mr-2 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Área do Administrador
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </CardTitle>
              <CardDescription className="text-slate-600">Acesso restrito para gerenciamento de pedidos</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <div className="absolute right-0 bottom-0 w-24 h-24 opacity-5">
                <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#3b82f6" /></svg>
              </div>
              <p className="mb-4 text-slate-700">
                Área exclusiva para administradores da Bits Jr. Faça login para gerenciar pedidos, estoque e
                clientes.
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-center group/item">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C4.79086 5 3 6.79086 3 9V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V9C21 6.79086 19.2091 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-slate-700 group-hover/item:text-blue-700 transition-colors">Visualize todos os pedidos</span>
                </li>
                <li className="flex items-center group/item">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-slate-700 group-hover/item:text-blue-700 transition-colors">Gerencie o estoque de camisetas</span>
                </li>
                <li className="flex items-center group/item">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.47 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-slate-700 group-hover/item:text-blue-700 transition-colors">Atualize o status de pagamento</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-gradient-to-b from-transparent to-blue-50 border-t border-blue-100">
              <Link href="/admin/login" className="w-full">
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                  <Lock className="h-4 w-4 mr-2" />
                  Área de Administração
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

