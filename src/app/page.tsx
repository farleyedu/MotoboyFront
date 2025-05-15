"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import MapComponent from "@/components/ui/motoboy-map";
import { Coordinates } from "@/components/ui/types";

// Definição do tipo de status do motoboy
type MotoboyStatus = "online" | "offline";

// Definição da interface para Motoboy
interface Motoboy {
  id: number;
  name: string;
  avatar: string;
  status: MotoboyStatus;
  location: Coordinates;
}

// Definição da interface para Order
interface Order {
  id: number;
  address: string;
  items: string;
  value: string;
  region: string;
  status: string;
  coordinates: Coordinates;
  horarioPedido: string;
  previsaoEntrega: string;
  horarioSaida: string;
  horarioEntrega: string;
  motoboy?: Motoboy; // Tornar opcional para pedidos sem motoboy
}

export default function Home() {
  const pizzeriaLocation: [number, number] = [-48.2772, -18.9146];

  // Os pedidos agora estão de acordo com a tipagem correta
  const orders: Order[] = [
    {
      id: 1,
      address: 'Av. Rondon Pacheco, 5000 - Tibery, Uberlândia - MG',
      items: 'Hambúrguer Artesanal',
      value: 'R$45.00',
      region: 'Tibery',
      status: 'pendente',
      coordinates: [-48.2772, -18.9146],
      horarioPedido: '18:00',
      previsaoEntrega: '18:40',
      horarioSaida: '18:15',
      horarioEntrega: '18:50',
    },
    {
      id: 2,
      address: 'Rua Santos Dumont, 320 - Centro, Uberlândia - MG',
      items: 'Esfirra de Carne',
      value: 'R$30.00',
      region: 'Centro',
      status: 'em_rota',
      coordinates: [-48.2772, -18.9146],
      horarioPedido: '18:05',
      previsaoEntrega: '18:45',
      horarioSaida: '18:20',
      horarioEntrega: '18:55',
    }
  ];
  

  // Continuar com definição dos motoboys
  const motoboys = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Motoboy ${String.fromCharCode(65 + i)}`,
    avatar: `/img/motoMark.png`,
    phone: `12345678${i}`,
    vehicle: 'Moto',
    status: (i % 2 === 0 ? 'online' : 'offline') as MotoboyStatus,
    location: [-48.2772, -18.9146] as Coordinates,
    deliveries: []
  }));

  // Estados separados para cada card
  const [periodoTotal, setPeriodoTotal] = useState<"dia" | "semana" | "mes">("dia");
  const [periodoEntrega, setPeriodoEntrega] = useState<"dia" | "semana" | "mes">("dia");
  const [periodoConcluido, setPeriodoConcluido] = useState<"dia" | "semana" | "mes">("dia");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const opcoes: Array<"dia" | "semana" | "mes"> = ["dia", "semana", "mes"]; 

  const [pedidosRecentes, setPedidosRecentes] = useState([
    { id: 101, cliente: "João Pereira", status: "Entregue", total: "R$45,00", motoboy: null },
    { id: 102, cliente: "Maria Fernandes", status: "Em entrega", total: "R$32,50", motoboy: "Ana Souza" },
    { id: 103, cliente: "Lucas Oliveira", status: "Pendente", total: "R$27,90", motoboy: null },
  ]);

  const [pedidoSelecionado, setPedidoSelecionado] = useState<number | null>(null);
  const [inviteId, setInviteId] = useState(""); 

  const sendInvite = async () => {
    if (!inviteId) {
      alert("Por favor, insira um ID válido.");
      return;
    }

    try {
      const response = await fetch("/api/invite-motoboy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motoboyId: inviteId }),
      });

      if (response.ok) {
        alert(`Convite enviado para o motoboy ID: ${inviteId}`);
        setInviteId(""); 
      } else {
        alert("Erro ao enviar convite. Verifique o ID.");
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert("Erro na conexão com o servidor.");
    }
  };

  const atribuirMotoboy = (pedidoId: number, motoboy: any) => {
    setPedidosRecentes((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, motoboy: motoboy.name } : pedido
      )
    );
    setPedidoSelecionado(null);
  };

  return (
    <main className={`w-full h-full overflow-auto space-y-8 ${isChatOpen ? 'pr-[5rem]' : ''}`}>
      {/* Painel Administrativo */}
      <Card className="border border-gray-300 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Painel Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total de Pedidos */}
            <Card className="p-3 bg-gray-50 border border-gray-200 relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-gray-300">
                {periodoTotal.toUpperCase()}
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                {opcoes.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => setPeriodoTotal(opcao)}
                    className={`w-3 h-3 rounded-full ${periodoTotal === opcao ? "bg-blue-500" : "bg-gray-300"}`}
                  ></button>
                ))}
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Total de Pedidos</h2>
              <p className="text-lg font-bold text-gray-900">25</p>
            </Card>
            {/* Continue para os outros cards e componentes aqui */}
          </div>
        </CardContent>
      </Card>

      {/* O botão para abrir o chat quando fechado */}
      {!isChatOpen && (
        <button
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            padding: '8px 12px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 1000
          }}
          onClick={() => setIsChatOpen(true)}
        >
          Abrir Chat
        </button>
      )}
      <MapComponent
        pizzeriaLocation={pizzeriaLocation}
        motoboys={motoboys}
        orders={orders}
        isChatOpen={isChatOpen}
      />
    </main>
  );
}