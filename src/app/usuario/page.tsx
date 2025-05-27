"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MotoboyComPedidosDTO, Order } from "@/components/ui/types";
import Image from "next/image";

export default function MotoboyList() {
  const [motoboys, setMotoboys] = useState<MotoboyComPedidosDTO[]>([]);
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"geral" | "historico">("geral");

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

        const data: MotoboyComPedidosDTO[] = await response.json();
        setMotoboys(data);
      } catch (error) {
        console.error("Erro ao buscar os dados dos motoboys:", error);
      }
    };

    fetchMotoboys();
  }, []);

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

        const data: Order[] = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados dos pedidos:", error);
      }
    };

    fetchPedidos();
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
                <Image
                  src={motoboy.avatar || "https://via.placeholder.com/150"}
                  alt={motoboy.nome}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{motoboy.nome}</h3>
                  <p className="text-sm text-gray-500">Pedidos atribuídos: {motoboy.pedidos.length}</p>
                </div>
              </div>
              <div>
                {expandido === index ? (
                  <ChevronUp className="text-gray-400" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandido === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="flex justify-start gap-8 border-b border-gray-300 mb-4">
                    <div
                      className={`cursor-pointer text-sm font-medium ${abaAtiva === "geral"
                          ? "text-blue-400 border-b-2 border-blue-400"
                          : "text-gray-600"
                        } p-2`}
                      onClick={() => setAbaAtiva("geral")}
                    >
                      Dados Gerais
                    </div>
                    <div
                      className={`cursor-pointer text-sm font-medium ${abaAtiva === "historico"
                          ? "text-blue-400 border-b-2 border-blue-400"
                          : "text-gray-600"
                        } p-2`}
                      onClick={() => setAbaAtiva("historico")}
                    >
                      Histórico
                    </div>
                  </div>

                  {abaAtiva === "geral" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-gray-700 space-y-2"
                    >
                      {/* Campos adicionais de dados gerais podem ser adicionados aqui */}
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
                        .filter((pedido) => pedido.motoboyResponsalvel?.id === motoboy.id)
                        .map((pedido) => (
                          <div key={pedido.id} className="border-b border-gray-200 pb-2 mb-2">
                            <p>
                              <strong>Cliente:</strong> {pedido.nomeCliente || "Não informado"}
                            </p>
                            <p>
                              <strong>Endereço:</strong> {pedido.enderecoEntrega || "Não informado"}
                            </p>
                            <p>
                              <strong>Data:</strong>{" "}
                              {new Date(pedido.dataPedido).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Status:</strong> {pedido.statusPedido || "Não informado"}
                            </p>
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
