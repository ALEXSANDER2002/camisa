"use client"

import { useEffect } from "react"
import type React from "react"
import { useState, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  User,
  Ruler,
  Palette,
  ShirtIcon,
  Package,
  DollarSign,
  FileText,
  CheckCircle,
  Upload,
  ArrowLeft,
  CreditCard,
  PartyPopper,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { ShirtCard } from "@/components/shirt-card"

const sizeOptions = ["P", "M", "G", "GG", "XGG", "P BL", "M BL", "G BL"]
const colorOptions = ["Azul", "Preto"]

// Modelos de camisetas disponíveis
const shirtModels = [
  {
    id: "polo-azul",
    name: "Camisa Polo Azul PSICOLOGIA",
    image: "/images/polo_azul.jpeg",
    description: "Camisa polo azul com emblema de Psicologia e logo UNAMA.",
    price: 56.00,
  },
  {
    id: "polo-preto",
    name: "Camisa Polo Preta PSICOLOGIA",
    image: "/images/poloazul.jpeg",
    description: "Camisa polo preta com emblema de Psicologia e logo UNAMA.",
    price: 56.00,
  },
  {
    id: "camiseta-azul",
    name: "Camiseta Azul PSICOLOGIA UNAMA",
    image: "/images/azul.png",
    description: "Camiseta azul com estampa PSICOLOGIA UNAMA.",
    price: 50.00,
  },
  {
    id: "camiseta-preta",
    name: "Camiseta Preta PSICOLOGIA UNAMA",
    image: "/images/preta.png",
    description: "Camiseta preta com estampa PSICOLOGIA UNAMA.",
    price: 50.00,
  },
]

export default function PedidoPage() {
  const [formData, setFormData] = useState({
    name: "",
    size: "M",
    color: "",
    quantity: 1,
    description: "",
  })

  // Estado para armazenar o modelo selecionado
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  // Estado para controlar a opção de pagamento via PIX
  const [payWithPix, setPayWithPix] = useState(false)

  // Estado para armazenar o arquivo de comprovante
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)

  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Estado para controlar o diálogo de sucesso
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // Atualizar a cor automaticamente com base no modelo selecionado
  useEffect(() => {
    if (selectedModel === "polo-azul" || selectedModel === "camiseta-azul") {
      handleChange("color", "Azul")
    } else if (selectedModel === "polo-preto" || selectedModel === "camiseta-preta") {
      handleChange("color", "Preto")
    }
  }, [selectedModel])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!selectedModel) {
      newErrors.model = "Selecione um modelo de camiseta"
    }

    if (!formData.color) {
      newErrors.color = "Cor é obrigatória"
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantidade deve ser pelo menos 1"
    }

    if (payWithPix && !paymentProofFile) {
      newErrors.paymentProof = "Anexe o comprovante de pagamento"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpar erro quando o campo é editado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Função para selecionar um modelo
  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId)

    // Limpar erro de modelo quando um é selecionado
    if (errors.model) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.model
        return newErrors
      })
    }

    // Atualizar a cor automaticamente com base no modelo
    if (modelId === "polo-azul" || modelId === "camiseta-azul") {
      handleChange("color", "Azul")
    } else if (modelId === "polo-preto" || modelId === "camiseta-preta") {
      handleChange("color", "Preto")
    }
  }

  // Função para lidar com o upload do comprovante
  const handlePaymentProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setPaymentProofFile(file)

      // Criar preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Limpar erro
      if (errors.paymentProof) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.paymentProof
          return newErrors
        })
      }
    }
  }

  // Função para remover o comprovante
  const handleRemovePaymentProof = () => {
    setPaymentProofFile(null)
    setPaymentProofPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Função para obter o preço do modelo selecionado
  const getSelectedModelPrice = () => {
    if (!selectedModel) return 0
    const model = shirtModels.find(m => m.id === selectedModel)
    return model?.price || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSuccess(false)

    try {
      // Obter o modelo selecionado
      const model = shirtModels.find((m) => m.id === selectedModel)

      if (!model) {
        throw new Error("Modelo de camiseta não encontrado")
      }

      // Criar pedido
      const orderGroup = uuidv4()

      // Determinar o número do modelo com base no ID selecionado
      let modelNumber = 1 // Valor padrão
      if (selectedModel === "polo-azul") {
        modelNumber = 1
      } else if (selectedModel === "polo-preto") {
        modelNumber = 2
      } else if (selectedModel === "camiseta-azul") {
        modelNumber = 3
      } else if (selectedModel === "camiseta-preta") {
        modelNumber = 4
      }

      const order = {
        id: uuidv4(),
        name: formData.name,
        size: formData.size,
        color: formData.color,
        material: "100% Algodão",
        quantity: formData.quantity,
        price: getSelectedModelPrice(),
        description: formData.description || null,
        paid: false,
        created_at: new Date().toISOString(),
        model_number: modelNumber,
        order_group: orderGroup,
        image_url: model.image,
      }

      // Fazer upload do comprovante se existir
      let paymentProofUrl = null
      if (paymentProofFile) {
        try {
          const fileExt = paymentProofFile.name.split(".").pop()
          const fileName = `${uuidv4()}.${fileExt}`
          const filePath = `${fileName}`

          // Verificar se o arquivo é uma imagem ou PDF
          if (!paymentProofFile.type.match(/(image\/.*|application\/pdf)/)) {
            throw new Error("Por favor, anexe apenas imagens ou arquivos PDF")
          }

          // Verificar tamanho do arquivo (máximo 5MB)
          if (paymentProofFile.size > 5 * 1024 * 1024) {
            throw new Error("O arquivo deve ter no máximo 5MB")
          }

          const { data, error: uploadError } = await supabase.storage
            .from("shirts")
            .upload(filePath, paymentProofFile, {
              cacheControl: "3600",
              upsert: false
            })

          if (uploadError) {
            console.error("Erro detalhado do upload:", uploadError)
            if (uploadError.message.includes("duplicate")) {
              throw new Error("Este arquivo já foi enviado anteriormente. Por favor, tente outro arquivo.")
            } else if (uploadError.message.includes("permission")) {
              throw new Error("Erro de permissão ao fazer upload. Por favor, tente novamente.")
            } else {
              throw new Error("Não foi possível fazer o upload do comprovante: " + uploadError.message)
            }
          }

          const { data: urlData } = supabase.storage
            .from("shirts")
            .getPublicUrl(filePath)

          if (!urlData.publicUrl) {
            throw new Error("Não foi possível obter a URL do comprovante")
          }

          paymentProofUrl = urlData.publicUrl
          order.paid = true
        } catch (error) {
          console.error("Erro ao processar comprovante:", error)
          throw new Error(error instanceof Error ? error.message : "Erro ao processar o comprovante")
        }
      }

      // Inserir pedido com comprovante
      const { error: insertError } = await supabase.from("shirts").insert([
        {
          ...order,
          payment_proof_url: paymentProofUrl,
        },
      ])

      if (insertError) {
        console.error("Erro ao inserir pedido:", insertError)
        throw new Error("Falha ao salvar o pedido. Por favor, tente novamente.")
      }

      // Limpar formulário e mostrar diálogo de sucesso
      setFormData({
        name: "",
        size: "M",
        color: "",
        quantity: 1,
        description: "",
      })
      setSelectedModel(null)
      setPaymentProofFile(null)
      setPaymentProofPreview(null)
      setSuccess(true)
      setShowSuccessDialog(true) // Mostrar diálogo apenas após sucesso do envio
    } catch (error) {
      console.error("Erro ao enviar pedido:", error)
      setErrors({
        form: error instanceof Error ? error.message : "Erro ao enviar pedido. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para copiar PIX
  const handleCopyPix = () => {
    navigator.clipboard.writeText("94984507070")
    alert("Número do PIX copiado!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-6 px-3 sm:py-10 sm:px-4">
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <PartyPopper className="h-5 w-5" />
              Pedido Enviado com Sucesso!
            </DialogTitle>
            <DialogDescription className="pt-4 pb-2">
              Seu pedido foi recebido.
              {paymentProofFile && (
                <p className="mt-2 text-green-600 font-medium">
                  Seu comprovante de pagamento foi anexado ao pedido.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              OK, entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center bg-slate-50 border-b border-slate-200">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <ShirtIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-slate-800">Sistema De Camisas</CardTitle>
            <CardDescription>
              Escolha um modelo de camiseta e preencha o formulário para fazer seu pedido
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 px-4 sm:px-6">
            {errors.form && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleção de modelo de camiseta */}
              <div className="space-y-2">
                <Label className="required flex items-center">
                  <ShirtIcon className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
                  Clique em um modelo de camiseta
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shirtModels.map((model) => (
                    <div key={model.id} className="relative">
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full z-10">
                        Clique para selecionar
                      </div>
                      <ShirtCard
                        id={model.id}
                        name={model.name}
                        image={model.image}
                        description={model.description}
                        isSelected={selectedModel === model.id}
                        onSelect={handleSelectModel}
                      />
                    </div>
                  ))}
                </div>

                {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="required flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  Seu Nome Completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Digite seu nome completo"
                  className={errors.name ? "border-destructive" : "border-slate-200"}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                  <ShirtIcon className="h-5 w-5 mr-2" />
                  Detalhes da Camiseta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="size" className="required flex items-center">
                      <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                      Tamanho
                    </Label>
                    <Select value={formData.size} onValueChange={(value) => handleChange("size", value)}>
                      <SelectTrigger id="size" className="border-slate-200">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color" className="required flex items-center">
                      <Palette className="h-4 w-4 mr-1 text-muted-foreground" />
                      Cor
                    </Label>
                    <Input id="color" value={formData.color} readOnly disabled className="bg-gray-100" />
                    <p className="text-xs text-muted-foreground">A cor é determinada pelo modelo selecionado</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="quantity" className="required flex items-center">
                    <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                    Quantidade
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value) || 1)}
                    min="1"
                    className={errors.quantity ? "border-destructive" : "border-slate-200"}
                  />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="description" className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                    Detalhes Adicionais (opcional)
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Descreva detalhes adicionais sobre sua camiseta, como estampas, bordados, etc."
                    rows={3}
                    className="border-slate-200"
                  />
                </div>
              </div>

              {/* Área de pagamento */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="font-medium">Preço unitário:</span>
                  </div>
                  <span className="font-bold text-lg">
                    R$ {getSelectedModelPrice().toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="font-medium">Total ({formData.quantity} {formData.quantity > 1 ? 'unidades' : 'unidade'}):</span>
                  </div>
                  <span className="font-bold text-lg text-green-600">
                    R$ {(getSelectedModelPrice() * formData.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </form>

            {/* Área do PIX - Fora do formulário */}
            <div className="mt-6">
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <div className="flex flex-col items-center">
                  <p className="text-base font-medium text-blue-600 mb-3">
                    Pagamento via PIX (Opcional)
                  </p>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Você pode pagar agora via PIX ou combinar o pagamento depois da confirmação do pedido
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg w-full text-center mb-4 border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2">Chave PIX:</p>
                    <code className="text-xl font-bold text-blue-700 block mb-1">94 98450-7070</code>
                    <p className="text-sm font-medium text-gray-600">(Nubank) Leticia Ellen</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 w-full sm:w-auto"
                    onClick={handleCopyPix}
                  >
                    Copiar número do PIX
                  </Button>
                </div>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200 mt-4">
                <Label htmlFor="payment-proof" className="flex items-center text-base font-medium">
                  <Upload className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  Anexar Comprovante de Pagamento (Opcional)
                </Label>

                <div className="grid gap-2">
                  <Input
                    id="payment-proof"
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePaymentProofChange}
                    accept="image/*,.pdf"
                    className="border-slate-200 text-sm"
                  />

                  {paymentProofPreview && (
                    <div className="relative mt-2 border rounded-md overflow-hidden">
                      <img
                        src={paymentProofPreview || "/placeholder.svg"}
                        alt="Comprovante de pagamento"
                        className="max-h-40 w-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        onClick={handleRemovePaymentProof}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-blue-600 mt-2">
                  Se você escolher pagar agora via PIX, anexe o comprovante aqui. Caso contrário, você poderá combinar o pagamento após a confirmação do pedido.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:justify-between p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto border-slate-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Início
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e)}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 relative"
            >
              {isSubmitting && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              )}
              <span className={isSubmitting ? "opacity-0" : ""}>Enviar Pedido</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

