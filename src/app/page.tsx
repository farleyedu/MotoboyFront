"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import MapComponent from "@/components/ui/motoboy-map";
import { useFetchPedidos } from '@/lib/hooks/useFetchPedidos';




// interface Order {
//   id: number;
//   address: string;
//   items: string;
//   value: string;
//   region: string;
//   StatusPedido: StatusPedido;
//   coordinates: Coordinates;
//   horarioPedido: string;
//   previsaoEntrega: string;
//   horarioSaida: string;
//   horarioEntrega: string;
//   motoboy?: Motoboy;
// }

export default function Home() {
  const pizzeriaLocation: [number, number] = [-48.25639646191665, -18.91608521811941]; 
  const fetchedOrders = useFetchPedidos();

  const [periodoTotal, setPeriodoTotal] = useState<"dia" | "semana" | "mes">("dia");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const opcoes: Array<"dia" | "semana" | "mes"> = ["dia", "semana", "mes"];

  return (
    <main className={`w-full h-full overflow-auto space-y-8 ${isChatOpen ? 'pr-[5rem]' : ''}`}>
      <Card className="border border-gray-300 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Painel Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

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
          orders={fetchedOrders}
          isChatOpen={isChatOpen}
        />
    </main>
  );
}
