import SetupDatabase from "@/scripts/setup-database"
import CreateAdmin from "@/scripts/create-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="gradient-header py-6 px-4 mb-8 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center text-white">Configuração do Sistema</h1>
        </div>
      </div>
      <div className="container mx-auto py-10 px-4 animate-fade-in">
        <div className="mb-6 flex justify-start">
          <Link href="/">
            <Button variant="outline" className="border-pink-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Início
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="database" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
            <TabsTrigger value="admin">Administradores</TabsTrigger>
          </TabsList>
          <TabsContent value="database">
            <SetupDatabase />
          </TabsContent>
          <TabsContent value="admin">
            <Card className="p-6 border-pink-100">
              <CreateAdmin />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

