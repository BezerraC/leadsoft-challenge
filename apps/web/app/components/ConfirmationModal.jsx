"use client";

export function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-20 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full border border-red-700/50">
        <div className="p-6 text-center">
          <h3 className="text-lg text-gray-200 font-roboto mb-6">{message}</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="font-roboto-mono bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="font-roboto-mono bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-md transition-colors"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}