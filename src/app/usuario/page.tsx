"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOrders, fetchMotoboys } from '../../service/dataService';

export default function MotoboyList() {
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"geral" | "historico">("geral");

  // Status e cores para exibição
  const statusLabels: { [key: number]: string } = {
    0: "Disponível",
    1: "Em entrega",
    2: "Indisponível",
  };
  

  // Função para buscar os motoboys da API
  useEffect(() => {
    const fetchMotoboys = async () => {
      try {
        const response = await fetch("https://localhost:7137/api/Motoboy", {
          method: "GET",
          headers: {
            Accept: "text/plain",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos motoboys");
        }

        const data: Motoboy[] = await response.json();
        setMotoboys(data);
      } catch (error) {
        console.error("Erro ao buscar os dados dos motoboys:", error);
      }
    };

    fetchMotoboys();
  }, []);
  

  // Função para buscar os pedidos da API
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("https://localhost:7137/api/Pedido", {
          method: "GET",
          headers: {
            Accept: "text/plain",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos pedidos");
        }

        const data: Pedido[] = await response.json();
        console.log("Pedidos retornados pela API:", data); // Log para verificar os dados
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados dos pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [ordersData, motoboysData] = await Promise.all([
        fetchOrders(),
        fetchMotoboys(),
      ]);
      setPedidos(ordersData);
      setMotoboys(motoboysData);
    };
  
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-4xl w-full mx-auto py-6">
      {motoboys.map((motoboy, index) => (
        <Card key={motoboy.id} className="shadow-sm rounded-lg border-0">
          <CardContent className="p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandido(expandido === index ? null : index)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={motoboy.avatar || "https://via.placeholder.com/150"}
                  alt={motoboy.nome}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{motoboy.nome}</h3>
                  <p className="text-sm text-gray-500">Status: {statusLabels[motoboy.status]}</p>
                  <p className="text-sm text-gray-500">Pedidos atribuídos: {motoboy.qtdPedidosAtivos}</p>
                </div>
              </div>
              <div>{expandido === index ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}</div>
            </div>

            <AnimatePresence>
              {expandido === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-4"
                >
                  {/* Abas de Dados Gerais e Histórico */}
                  <div className="flex justify-start gap-8 border-b border-gray-300 mb-4">
                    <div
                      className={`cursor-pointer text-sm font-medium ${
                        abaAtiva === "geral" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-600"
                      } p-2`}
                      onClick={() => setAbaAtiva("geral")}
                    >
                      Dados Gerais
                    </div>
                    <div
                      className={`cursor-pointer text-sm font-medium ${
                        abaAtiva === "historico" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-600"
                      } p-2`}
                      onClick={() => setAbaAtiva("historico")}
                    >
                      Histórico
                    </div>
                  </div>

                  {/* Conteúdo da aba ativa */}
                  {abaAtiva === "geral" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-gray-700 space-y-2"
                    >
                      <p><strong>CNH:</strong> {motoboy.cnh || "Não informado"}</p>
                      <p><strong>Telefone:</strong> {motoboy.telefone || "Não informado"}</p>
                      <p><strong>Placa da Moto:</strong> {motoboy.placaMoto || "Não informado"}</p>
                      <p><strong>Marca:</strong> {motoboy.marcaMoto || "Não informado"}</p>
                      <p><strong>Modelo:</strong> {motoboy.modeloMoto || "Não informado"}</p>
                      <p><strong>Renavam:</strong> {motoboy.renavamMoto || "Não informado"}</p>
                    </motion.div>
                  )}

                  {abaAtiva === "historico" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-gray-700 space-y-2"
                    >
                      {pedidos
                        .filter((pedido) => {
                          console.log(
                            `Comparando pedido.motoboyResponsavel (${pedido.motoboyResponsavel}) com motoboy.id (${motoboy.id})`
                          );
                          return pedido.motoboyResponsavel === motoboy.id;
                        })
                        .map((pedido) => (
                          <div key={pedido.id} className="border-b border-gray-200 pb-2 mb-2">
                            <p><strong>Cliente:</strong> {pedido.nomeCliente || "Não informado"}</p>
                            <p><strong>Endereço:</strong> {pedido.enderecoEntrega || "Não informado"}</p>
                            <p><strong>Data:</strong> {new Date(pedido.dataPedido).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {pedido.statusPedido || "Não informado"}</p>
                          </div>
                        ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Tipos para os dados da API
interface Motoboy {
  id: number;
  nome: string;
  avatar: string | null;
  cnh: string | null;
  telefone: string | null;
  placaMoto: string | null;
  marcaMoto: string | null;
  modeloMoto: string | null;
  renavamMoto: string | null;
  status: number;
  qtdPedidosAtivos: number;
}

interface Pedido {
  id: number;
  nomeCliente: string | null;
  enderecoEntrega: string | null;
  idIfood: string | null;
  telefoneCliente: string | null;
  dataPedido: string;
  statusPedido: string | null;
  motoboyResponsavel: number | null;
}