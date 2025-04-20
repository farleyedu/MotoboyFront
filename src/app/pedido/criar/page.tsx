import React from "react";

export default function PedidoCriar() {
  return (
    <div className="flex min-h-screen bg-gray-50 pr-60">
      {/* Conteúdo principal */}
      <main className="flex-1 flex justify-center items-center px-4">
        <form className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Novo Pedido</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome do Cliente</label>
              <input type="text" placeholder="Ex: Ana Costa" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Telefone</label>
              <input type="tel" placeholder="(31) 98888-1111" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Endereço de Entrega</label>
              <input type="text" placeholder="Rua das Flores, 123" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">ID iFood</label>
              <input type="text" placeholder="IFOOD123456" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Horário de Entrega</label>
              <input type="time" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Motoboy Responsável</label>
              <select className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Selecione</option>
                <option value="1">Carlos Silva</option>
                <option value="2">João Oliveira</option>
                <option value="3">Marcos Souza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1">Aguardando</option>
                <option value="2">Em trânsito</option>
                <option value="3">Entregue</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition duration-200">
              Criar Pedido
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}