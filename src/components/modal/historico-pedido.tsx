"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Bell, Pause, Eye, Trash2, PlusCircle, History, Info, DollarSign } from "lucide-react";

// Tipos

type Historico = {
  id: number;
  data: string;
  endereco: string;
  valor: string;
  status: "entregue" | "em_andamento" | "nao_iniciada";
};

type Props = {
  nomeMotoboy: string;
  historico: Historico[];
  children: ReactNode;
};

const statusLabels: Record<Historico["status"], string> = {
  entregue: "Entregue",
  em_andamento: "Em andamento",
  nao_iniciada: "Não iniciada",
};

const statusColors: Record<Historico["status"], string> = {
  entregue: "bg-green-100 text-green-700",
  em_andamento: "bg-yellow-100 text-yellow-700",
  nao_iniciada: "bg-red-100 text-red-700",
};

const filtros = [
  { value: "todos", label: "Todos" },
  { value: "entregue", label: "Entregue" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "nao_iniciada", label: "Não iniciada" },
];

export default function HistoricoDialog({ nomeMotoboy, historico, children }: Props) {
  const [statusSelecionado, setStatusSelecionado] = useState<string>("todos");

  const pedidosFiltrados = statusSelecionado === "todos"
    ? historico
    : historico.filter((h) => h.status === statusSelecionado);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[60vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Histórico de Pedidos - {nomeMotoboy}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filtros.map((filtro) => (
              <button
                key={filtro.value}
                onClick={() => setStatusSelecionado(filtro.value)}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                  statusSelecionado === filtro.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>

          <ScrollArea className="pr-2">
            {pedidosFiltrados.length === 0 ? (
              <p className="text-sm text-gray-500 mt-4">Nenhum pedido encontrado para o status selecionado.</p>
            ) : (
              <div className="space-y-3">
                {pedidosFiltrados.map((pedido) => (
                  <div key={pedido.id} className="border rounded-md p-3 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-800">{pedido.data}</p>
                      <Badge className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[pedido.status]}`}>
                        {statusLabels[pedido.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700"><strong>Endereço:</strong> {pedido.endereco}</p>
                    <p className="text-sm text-gray-700"><strong>Valor:</strong> {pedido.valor}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
