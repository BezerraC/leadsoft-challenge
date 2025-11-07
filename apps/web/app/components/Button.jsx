"use client";

export function Button({
  children,
  type = "submit",
  isLoading = false,
  loadingText = "Processando...",
  variant = "primary",
  className = "",
  ...props
}) {
  
  // Estilos de Base
  const baseStyles = `
    flex justify-center
    font-orbitron uppercase tracking-wider
    text-sm font-bold text-white
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-gray-900 focus:ring-cyan-400
  `;

  // Estilos de Variantes
  const variantStyles = {
    primary: "py-3 px-4 rounded-full", // Para o botão de Registro
    secondary: "py-2 px-4 rounded-md", // Para o botão de Comentário
  };

  // Estilos de Estado
  const stateStyles = (isLoading || props.disabled)
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-cyan-400 hover:to-blue-600";

  const allStyles = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${stateStyles} 
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={isLoading || props.disabled}
      className={allStyles}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}