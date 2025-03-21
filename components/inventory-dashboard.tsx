"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  ExternalLink,
  Tag,
  Package,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Heart,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import InventoryTable from "@/components/inventory-table"
import ShirtFormDialog from "@/components/shirt-form-dialog"
import FilterDialog from "@/components/filter-dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Shirt } from "@/lib/types"
import { getShirts, checkTableExists } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured } from "@/lib/supabase"
import { GeneratePdfButton } from "@/components/generate-pdf-button"

export default function InventoryDashboard() {
  const [shirts, setShirts] = useState<Shirt[]>([])
  const [filteredShirts, setFilteredShirts] = useState<Shirt[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editingShirt, setEditingShirt] = useState<Shirt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tableExists, setTableExists] = useState(true)
  const [filters, setFilters] = useState({
    size: "",
    color: "",
    material: "",
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
    paid: "",
  })

  // Verificar se o Supabase está configurado
  const supabaseConfigured = isSupabaseConfigured()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Verificar primeiro se o Supabase está configurado
        if (!supabaseConfigured) {
          console.error(
            "Supabase não está configurado. URL:",
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            "Key length:",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
          )
          setTableExists(false)
          return
        }

        console.log("Tentando verificar se a tabela existe...")
        // Verificar se a tabela existe
        const exists = await checkTableExists()
        console.log("Resultado da verificação da tabela:", exists)
        setTableExists(exists)

        if (exists) {
          console.log("Tentando buscar camisetas...")
          const data = await getShirts()
          console.log("Camisetas encontradas:", data.length)
          setShirts(data)
          setFilteredShirts(data)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setTableExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [supabaseConfigured])

  useEffect(() => {
    let result = [...shirts]

    // Aplicar busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (shirt) =>
          shirt.name.toLowerCase().includes(query) ||
          shirt.color.toLowerCase().includes(query) ||
          shirt.material.toLowerCase().includes(query) ||
          shirt.description?.toLowerCase().includes(query),
      )
    }

    // Aplicar filtros
    if (filters.size) {
      result = result.filter((shirt) => shirt.size === filters.size)
    }

    if (filters.color) {
      result = result.filter((shirt) => shirt.color.toLowerCase().includes(filters.color.toLowerCase()))
    }

    if (filters.material) {
      result = result.filter((shirt) => shirt.material.toLowerCase().includes(filters.material.toLowerCase()))
    }

    if (filters.minPrice) {
      result = result.filter((shirt) => shirt.price >= Number.parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      result = result.filter((shirt) => shirt.price <= Number.parseFloat(filters.maxPrice))
    }

    if (filters.minQuantity) {
      result = result.filter((shirt) => shirt.quantity >= Number.parseInt(filters.minQuantity))
    }

    if (filters.maxQuantity) {
      result = result.filter((shirt) => shirt.quantity <= Number.parseInt(filters.maxQuantity))
    }

    if (filters.paid === "paid") {
      result = result.filter((shirt) => shirt.paid === true)
    } else if (filters.paid === "unpaid") {
      result = result.filter((shirt) => shirt.paid === false)
    }

    // Aplicar ordenação
    result.sort((a, b) => {
      if (sortField === "paid") {
        // Ordenação especial para o campo paid (booleano)
        const aValue = a.paid === undefined ? false : a.paid
        const bValue = b.paid === undefined ? false : b.paid
        return sortDirection === "asc"
          ? aValue === bValue
            ? 0
            : aValue
              ? 1
              : -1
          : aValue === bValue
            ? 0
            : aValue
              ? -1
              : 1
      }

      const fieldA = a[sortField as keyof Shirt]
      const fieldB = b[sortField as keyof Shirt]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      } else {
        return sortDirection === "asc" ? Number(fieldA) - Number(fieldB) : Number(fieldB) - Number(fieldA)
      }
    })

    setFilteredShirts(result)
  }, [shirts, searchQuery, filters, sortField, sortDirection])

  const handleAddShirt = (newShirt: Shirt) => {
    setShirts((prev) => [...prev, newShirt])
    setIsFormOpen(false)
  }

  const handleUpdateShirt = (updatedShirt: Shirt) => {
    setShirts((prev) => prev.map((shirt) => (shirt.id === updatedShirt.id ? updatedShirt : shirt)))
    setEditingShirt(null)
    setIsFormOpen(false)
  }

  const handleDeleteShirt = (id: string) => {
    setShirts((prev) => prev.filter((shirt) => shirt.id !== id))
  }

  const handleEdit = (shirt: Shirt) => {
    setEditingShirt(shirt)
    setIsFormOpen(true)
  }

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleFilterApply = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setIsFilterOpen(false)
  }

  const handleFilterReset = () => {
    setFilters({
      size: "",
      color: "",
      material: "",
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
      paid: "",
    })
    setIsFilterOpen(false)
  }

  // Calcular estatísticas
  const totalShirts = shirts.reduce((sum, shirt) => sum + shirt.quantity, 0)
  const totalValue = shirts.reduce((sum, shirt) => sum + shirt.price * shirt.quantity, 0)
  const uniqueColors = new Set(shirts.map((shirt) => shirt.color)).size

  // Estatísticas de pagamento
  const paidShirts = shirts.filter((shirt) => shirt.paid === true).length
  const unpaidShirts = shirts.filter((shirt) => shirt.paid === false).length
  const paidValue = shirts
    .filter((shirt) => shirt.paid === true)
    .reduce((sum, shirt) => sum + shirt.price * shirt.quantity, 0)
  const unpaidValue = shirts
    .filter((shirt) => shirt.paid === false)
    .reduce((sum, shirt) => sum + shirt.price * shirt.quantity, 0)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!supabaseConfigured) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-pink-100 feminine-shadow">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <CardTitle className="flex items-center text-pink-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Configuração do Supabase ausente
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4">
            As variáveis de ambiente do Supabase não estão configuradas. Você precisa configurar as seguintes variáveis
            de ambiente:
          </p>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <code className="block mb-2">NEXT_PUBLIC_SUPABASE_URL</code>
            <code className="block">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </div>

          <div className="mt-6 p-4 bg-pink-50 rounded-md">
            <h4 className="font-medium text-pink-800">Como configurar:</h4>
            <ol className="mt-2 space-y-2 list-decimal pl-5">
              <li>
                Crie um projeto no{" "}
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  Supabase
                </a>
              </li>
              <li>Obtenha a URL e a chave anônima nas configurações do projeto</li>
              <li>Adicione essas variáveis ao seu arquivo .env.local na raiz do projeto:</li>
            </ol>
            <pre className="mt-4 p-3 bg-white rounded-md border border-pink-100 text-sm">
              {`NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase`}
            </pre>
            <p className="mt-4 text-sm">
              Depois de configurar essas variáveis, reinicie o servidor de desenvolvimento.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-pink-50/50 border-t border-pink-100 flex justify-between">
          <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-pink-200">
              <ExternalLink className="h-4 w-4 mr-2" />
              Acessar Supabase
            </Button>
          </a>
          <Link href="/setup">
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Heart className="h-4 w-4 mr-2" />
              Ir para Configuração
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (!tableExists) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-pink-100 feminine-shadow">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <CardTitle className="flex items-center text-pink-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Banco de dados não configurado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4">
            A tabela de camisetas ainda não foi criada no banco de dados Supabase. Você precisa configurar o banco de
            dados antes de usar o sistema.
          </p>

          <div className="mt-6">
            <p className="font-medium">Você tem duas opções:</p>

            <div className="mt-4 space-y-6">
              <div className="p-6 border rounded-lg shadow-sm bg-pink-50 border-pink-100">
                <h3 className="font-medium text-lg text-pink-800 mb-2">Opção 1: Usar a página de configuração</h3>
                <p className="text-sm text-pink-700 mb-4">
                  Acesse a página de configuração para tentar criar a tabela automaticamente.
                </p>
                <Link href="/setup">
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Ir para a página de configuração
                  </Button>
                </Link>
              </div>

              <div className="p-6 border rounded-lg shadow-sm border-pink-100">
                <h3 className="font-medium text-lg mb-2">Opção 2: Criar a tabela manualmente</h3>
                <p className="text-sm text-muted-foreground mb-3">Siga estas etapas para criar a tabela manualmente:</p>
                <ol className="text-sm space-y-2 list-decimal pl-5 mb-4">
                  <li>
                    Acesse o{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline inline-flex items-center"
                    >
                      painel do Supabase <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  </li>
                  <li>Selecione seu projeto</li>
                  <li>Vá para a seção "SQL Editor" no menu lateral</li>
                  <li>Clique em "New Query"</li>
                  <li>Cole o seguinte SQL e execute:</li>
                </ol>
                <pre className="p-4 bg-pink-50/50 rounded-lg text-xs overflow-auto border border-pink-100">
                  {`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE shirts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  material TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir um exemplo inicial
INSERT INTO shirts (name, size, color, material, quantity, price, description, paid)
VALUES (
  'Ana Silva',
  'M',
  'Rosa',
  '100% Algodão',
  1,
  39.90,
  'Camiseta básica rosa.',
  false
);`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-pink-50/50 border-t border-pink-100">
          <p className="text-sm text-muted-foreground">
            Após criar a tabela, atualize esta página para começar a usar o sistema.
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Estatísticas */}
      {shirts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="dashboard-card">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full bg-pink-100 p-3 mr-4">
                  <Package className="h-6 w-6 text-pink-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Camisetas</p>
                  <h3 className="text-2xl font-bold">{totalShirts}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <h3 className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full bg-pink-100 p-3 mr-4">
                  <Tag className="h-6 w-6 text-pink-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cores Diferentes</p>
                  <h3 className="text-2xl font-bold">{uniqueColors}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Sparkles className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <h3 className="text-2xl font-bold">{shirts.length}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas de pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="dashboard-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Status de Pagamento
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pagos</p>
                      <p className="text-xl font-bold">{paidShirts}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-2 mr-3">
                      <XCircle className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Não Pagos</p>
                      <p className="text-xl font-bold">{unpaidShirts}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-pink-500" />
                  Valores por Status
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <CreditCard className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Pago</p>
                      <p className="text-xl font-bold">R$ {paidValue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-2 mr-3">
                      <CreditCard className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor a Receber</p>
                      <p className="text-xl font-bold">R$ {unpaidValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-pink-500" />
                Comprovantes de Pagamento
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Com Comprovante</p>
                    <p className="text-xl font-bold">{shirts.filter((shirt) => shirt.payment_proof_url).length}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-amber-100 p-2 mr-3">
                    <AlertTriangle className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sem Comprovante</p>
                    <p className="text-xl font-bold">{shirts.filter((shirt) => !shirt.payment_proof_url).length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão para gerar PDF */}
          <div className="flex justify-end mb-6">
            <GeneratePdfButton shirts={shirts} />
          </div>
        </>
      )}

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 mb-6 feminine-shadow">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, cor ou material..."
              className="pl-9 border-pink-200 focus:border-pink-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 sm:flex-none border-dashed border-pink-200"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {Object.values(filters).some((v) => v !== "") && (
                <Badge variant="secondary" className="ml-2 bg-pink-100 text-pink-800">
                  {Object.values(filters).filter((v) => v !== "").length}
                </Badge>
              )}
            </Button>

            <div className="flex-1 sm:flex-none">
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="min-w-[140px] border-pink-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="size">Tamanho</SelectItem>
                  <SelectItem value="color">Cor</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="quantity">Quantidade</SelectItem>
                  <SelectItem value="paid">Pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="px-3 border-pink-200"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>

            <Button onClick={() => setIsFormOpen(true)} className="flex-1 sm:flex-none bg-pink-500 hover:bg-pink-600">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/*  />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela de inventário */}
      <InventoryTable
        shirts={filteredShirts}
        onEdit={handleEdit}
        onDelete={handleDeleteShirt}
        onSort={handleSortChange}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* Diálogos */}
      <ShirtFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onAdd={handleAddShirt}
        onUpdate={handleUpdateShirt}
        editingShirt={editingShirt}
      />

      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
    </div>
  )
}

