"use client"

import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ShirtCardProps {
  id: string
  name: string
  image: string
  description: string
  isSelected: boolean
  onSelect: (id: string) => void
}

export function ShirtCard({ id, name, image, description, isSelected, onSelect }: ShirtCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Usando diretamente o arquivo atras.jpg
  const images = [image, "/atras.jpg"];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-600 border-blue-600" : "border-gray-200 hover:border-slate-200"
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className="w-full flex-shrink-0 mb-5 flex justify-center relative">
            <div className="border border-gray-200 rounded-lg p-3 bg-white relative">
              <div className="relative">
                <Image 
                  src={images[currentImageIndex]} 
                  alt={currentImageIndex === 0 ? `${name} - Frente` : `${name} - Costas`}
                  width={350}
                  height={350}
                  className="object-contain mx-auto"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                
                {/* Controles de navegação */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }} 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }} 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                {/* Indicadores de slides */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`h-1.5 w-1.5 rounded-full ${idx === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 text-center w-full">
            <h3 className="font-medium text-base sm:text-lg mb-2">{name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

