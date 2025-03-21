import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShirtIcon } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-slate-800 py-12 px-4 mb-8 shadow-md">
        <div className="container mx-auto flex flex-col items-center text-center">
          <ShirtIcon className="h-16 w-16 text-white mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Sistema De Camisas</h1>
          <p className="text-white/90 max-w-lg mb-8">
            Camisetas personalizadas com estilo e qualidade para você expressar sua personalidade
          </p>
          <Link href="/pedido">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Fazer um Pedido
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-slate-100">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-blue-700">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Faça seu Pedido
              </CardTitle>
              <CardDescription>Solicite suas camisetas personalizadas de forma rápida e fácil</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Preencha nosso formulário online para solicitar suas camisetas personalizadas. Escolha o tamanho, cor,
                material e quantidade desejada.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <ShirtIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Diversos tamanhos disponíveis
                </li>
                <li className="flex items-center">
                  <ShirtIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Várias opções de cores e materiais
                </li>
                <li className="flex items-center">
                  <ShirtIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Pedidos personalizados
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100">
              <Link href="/pedido" className="w-full">
                <Button className="w-full bg-slate-500 hover:bg-blue-600">Fazer Pedido Agora</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-slate-100">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-blue-700">
                <Lock className="h-5 w-5 mr-2" />
                Área do Administrador
              </CardTitle>
              <CardDescription>Acesso restrito para gerenciamento de pedidos</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Área exclusiva para administradores da Sistema De Camisas. Faça login para gerenciar pedidos, estoque e
                clientes.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <ShirtIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Visualize todos os pedidos
                </li>
                <li className="flex items-center">
                  <ShirtIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Gerencie o estoque de camisetas
                </li>
                <li className="flex items-center">
                  <ShirtIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Atualize o status de pagamento
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100">
              <Link href="/admin/login" className="w-full">
                <Button variant="outline" className="w-full border-slate-200">
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

