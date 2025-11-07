"use client";

export function FormInput({
  label,
  name,
  type = "text",
  as,
  labelClassName,
  ...props
}) {
  // Estilos padrão para inputs de texto
  let inputClasses = `
    mt-1 appearance-none relative block w-full px-3 py-2 
    bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 
    rounded-md focus:outline-none focus:ring-2 focus:ring-[#10D9E8] 
    focus:border-[#10D9E8] sm:text-sm font-roboto-mono
  `;

  // Estilos para input de arquivo
  if (type === "file") {
    inputClasses = `
      mt-1 block w-full text-sm text-gray-400 font-roboto-mono
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-900 file:text-cyan-300
      hover:file:bg-blue-800 transition-colors
    `;
  }

  // Componente a ser renderizado
  let InputComponent = "input";
  if (as === "textarea") {
    InputComponent = "textarea";
  }

  return (
    <div>
      <label
        className={`block text-sm font-medium text-blue-200 font-roboto ${
          labelClassName || ""
        }`}
      >
        {label}
      </label>
      <InputComponent
        name={name}
        type={type}
        className={inputClasses}
        {...props}
      />
    </div>
  );
}
