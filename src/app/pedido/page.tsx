'use client';
import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const pedidosMock = [
  {
    id: 1,
    nomeCliente: "Ana Costa",
    telefone: "(31) 98888-1111",
    endereco: "Rua das Flores, 123",
    idIfood: "IFOOD123456",
    horarioEntrega: "18:30",
    status: "Em trânsito",
    motoboy: "",
    dataPedido: "2025-04-08 17:20"
  },
  {
    id: 2,
    nomeCliente: "Lucas Pereira",
    telefone: "(31) 97777-2222",
    endereco: "Av. Brasil, 456",
    idIfood: "IFOOD654321",
    horarioEntrega: "19:00",
    status: "Aguardando",
    motoboy: "",
    dataPedido: "2025-04-08 17:45"
  }
];

const motoboysMock = [
  "Carlos Silva",
  "João Oliveira",
  "Marcos Lima",
  "Fernanda Souza"
];

type Pedido = {
  id: number;
  nomeCliente: string;
  telefone: string;
  endereco: string;
  idIfood: string;
  horarioEntrega: string;
  status: string;
  motoboy: string;
  dataPedido: string;
};

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const [motoboySelecionado, setMotoboySelecionado] = React.useState(pedido.motoboy);
  const [mostrarOpcoes, setMostrarOpcoes] = React.useState(false);
  const [expandido, setExpandido] = React.useState(false);
  const opcoesRef = useRef<HTMLDivElement>(null);

  const atribuirMotoboy = (nome: string) => {
    setMotoboySelecionado(nome);
    setMostrarOpcoes(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (opcoesRef.current && !opcoesRef.current.contains(event.target as Node)) {
        setMostrarOpcoes(false);
      }
    }
    if (mostrarOpcoes) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarOpcoes]);

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-300"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className="text-lg font-bold cursor-pointer text-gray-800 hover:text-blue-600 transition-colors"
          onClick={() => setExpandido(!expandido)}
        >
          {pedido.nomeCliente}
        </h3>
        <span className={`text-sm px-2 py-1 rounded-full font-semibold transition-all duration-200 ${
          pedido.status === "Entregue"
            ? "bg-green-200 text-green-800"
            : pedido.status === "Em trânsito"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-gray-300 text-gray-800"
        }`}>
          {pedido.status}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-2">Entrega às {pedido.horarioEntrega}</p>

      <AnimatePresence>
        {expandido && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="text-sm text-gray-800 space-y-1 mb-3">
              <p><strong>Telefone:</strong> {pedido.telefone}</p>
              <p><strong>Endereço:</strong> {pedido.endereco}</p>
              <p><strong>ID iFood:</strong> {pedido.idIfood}</p>
              <p><strong>Data do Pedido:</strong> {new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(pedido.dataPedido))}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-gray-900">
        <strong>Motoboy:</strong>
        {motoboySelecionado
          ? <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{motoboySelecionado}</span>
          : <span className="ml-2 text-red-600">Não atribuído</span>}
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {!motoboySelecionado && (
          <button
            onClick={() => setMostrarOpcoes(!mostrarOpcoes)}
            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200"
          >
            Escolher Motoboy
          </button>
        )}
        {motoboySelecionado && (
          <button
            onClick={() => setMotoboySelecionado("")}
            className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors duration-200"
          >
            Remover
          </button>
        )}
      </div>

      <AnimatePresence>
        {mostrarOpcoes && (
          <motion.div
            ref={opcoesRef}
            className="absolute right-4 top-4 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-20 w-56"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Motoboys disponíveis</h4>
            <div className="flex flex-col gap-2">
              {motoboysMock.map((nome) => (
                <button
                  key={nome}
                  onClick={() => atribuirMotoboy(nome)}
                  className="text-sm text-gray-700 hover:text-white hover:bg-blue-600 transition px-3 py-1 rounded-md text-left"
                >
                  {nome}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VisualizarPedidos() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Pedidos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidosMock.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      </main>
    </div>
  );
}
