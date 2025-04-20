"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import  Link from "next/link";

export default function Sidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col shadow-lg">
      {/* Logo ou Título */}
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Dashboard 📊
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 p-4 space-y-4">
        {/* Visão Geral */}
        <div>
          <button
            onClick={() => toggleSection("page")}
            className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-300 hover:text-white transition"
          >
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>Visão Geral</span>
            </div>
            {openSection === "page" ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          {openSection === "page" && (
            <ul className="mt-2 space-y-2 pl-4 border-l border-gray-600">
                <Link
                  href="/"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Relatórios rápidos
                </Link>
            </ul>
          )}
        </div>

        {/* Motoboys */}
        <div>
          <button
            onClick={() => toggleSection("convidar-motoboy")}
            className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-300 hover:text-white transition"
          >
            <div className="flex items-center space-x-2">
              <span>🏍️</span>
              <span>Motoboys</span>
            </div>
            {openSection === "convidar-motoboy" ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          {openSection === "convidar-motoboy" && (
            <ul className="mt-2 space-y-2 pl-4 border-l border-gray-600">
              <li>
                <a
                  href="/usuario/convidar"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Convidar motoboy
                </a>
              </li>
              <li>
                <a
                  href="/usuario"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Gerenciar motoboys
                </a>
              </li>
            </ul>
          )}
        </div>

        {/* Pedidos */}
        <div>
          <button
            onClick={() => toggleSection("pedidos")}
            className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-300 hover:text-white transition"
          >
            <div className="flex items-center space-x-2">
              <span>📦</span>
              <span>Pedidos</span>
            </div>
            {openSection === "pedidos" ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          {openSection === "pedidos" && (
            <ul className="mt-2 space-y-2 pl-4 border-l border-gray-600">
              <li>
                <a
                  href="/pedido/criar"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Criar pedido
                </a>
              </li>
              <li>
                <a
                  href="/pedido"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Visualizar pedidos
                </a>
              </li>
              <li>
                <a
                  href="/pedido/atribuir-motoboy"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Atribuir motoboy
                </a>
              </li>
              <li>
                <a
                  href="/pedido/entrega"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Monitorar entregas
                </a>
              </li>
            </ul>
          )}
        </div>

        {/* Relatórios */}
        <div>
          <button
            onClick={() => toggleSection("relatorios")}
            className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-300 hover:text-white transition"
          >
            <div className="flex items-center space-x-2">
              <span>📈</span>
              <span>Relatórios</span>
            </div>
            {openSection === "relatorios" ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          {openSection === "relatorios" && (
            <ul className="mt-2 space-y-2 pl-4 border-l border-gray-600">
              <li>
                <a
                  href="#relatorio-entregas"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Relatório de entregas
                </a>
              </li>
              <li>
                <a
                  href="#tempo-medio"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Tempo médio de entrega
                </a>
              </li>
              <li>
                <a
                  href="#pedidos-por-periodo"
                  className="block text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-2 py-1 transition"
                >
                  Pedidos por período
                </a>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}