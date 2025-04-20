"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Pedido = {
  id: number;
  cliente: string;
  endereco: string;
  valor: number;
  status: "entregue" | "em_andamento" | "nao_iniciada";
};

type Props = {
  pedidos: Pedido[];
  onAtribuir: (pedidoId: number) => void;
  children: React.ReactNode; // Adicionado suporte a children
};

export default function AtribuirPedidosModal({ pedidos, onAtribuir, children }: Props) {
  const [selecionados, setSelecionados] = useState<number[]>([]);

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const atribuirPedidosSelecionados = () => {
    console.log("Pedidos atribuídos:", selecionados);
    selecionados.forEach((id) => onAtribuir(id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Atribuir pedidos para motoboy
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-auto">
          {pedidos.map((pedido) => {
            const selecionado = selecionados.includes(pedido.id);
            return (
              <div
                key={pedido.id}
                onClick={() => toggleSelecionado(pedido.id)}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 rounded-xl ${
                  selecionado
                    ? "border-blue-500 bg-blue-100 scale-105"
                    : "border-muted hover:scale-105 hover:shadow-lg"
                }`}
              >
                <div className="text-lg font-medium text-primary mb-1">
                  Pedido #{pedido.id}
                </div>
                <div className="text-sm font-normal text-gray-700 mb-2">
                  {pedido.cliente}
                </div>
                <div className="text-sm font-light text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium text-gray-800">Endereço:</span>{" "}
                    {pedido.endereco}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Valor:</span> R${" "}
                    {pedido.valor.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline">Fechar</Button>
          <Button
            onClick={atribuirPedidosSelecionados}
            disabled={selecionados.length === 0}
          >
            Atribuir pedidos selecionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}