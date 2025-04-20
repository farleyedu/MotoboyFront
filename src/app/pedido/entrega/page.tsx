export default function EntregaPedido() {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Título da Página */}
        <h1 className="text-3xl font-bold text-gray-800">EntregaPedido</h1>
  
        {/* Descrição ou Introdução */}
        <p className="text-gray-600 text-lg">
          Esta é uma página genérica. Use este modelo como base para criar novas páginas no seu projeto.
        </p>
  
        {/* Conteúdo Principal */}
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Seção de Conteúdo</h2>
          <p className="text-gray-600 mt-2">
            Adicione aqui o conteúdo principal da sua página. Você pode incluir componentes, tabelas, gráficos ou qualquer outro elemento necessário.
          </p>
        </div>
  
        {/* Botão de Ação */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Clique Aqui
        </button>
      </div>
    );
  }