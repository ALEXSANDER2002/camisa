export function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
        <div className="absolute inset-0 h-16 w-16 rounded-full border-r-4 border-transparent animate-pulse"></div>
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse">Carregando...</p>
    </div>
  )
}

