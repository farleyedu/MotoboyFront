"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import MapaMotoboys, { MotoboyStatus } from "@/components/ui/motoboy-map";
import MapComponent from "@/components/ui/motoboy-map";
import { Coordinates, Motoboy } from "@/components/ui/types";

//export type MotoboyStatus = 'online' | 'offline' | 'delivering';

export default function Home() {
  const pizzeriaLocation: [number, number] = [-48.256364, -18.916427];

  const orders = [
    {
      id: 1,
      address: "Rua Exemplo, 123",
      items: "Pizza, Refrigerante" as string | string[],
      value: "R$50,00",
      region: "Centro",
      assigned_driver: null,
      coordinates: [-48.214971, -18.905784]
    },
    {
      id: 2,
      address: "Av. Teste, 456",
      items: "Pizza Grande" as string | string[],
      value: "R$70,00",
      region: "Zona Sul",
      assigned_driver: null,
      coordinates: [-48.256362, -18.916437]
    }
  ];

  // Dados fictícios para os períodos
  const pedidos = {
    dia: { total: 10, entrega: 5, concluido: 5 },
    semana: { total: 70, entrega: 30, concluido: 40 },
    mes: { total: 300, entrega: 120, concluido: 180 },
  };

  // Estados separados para cada card
  const [periodoTotal, setPeriodoTotal] = useState<"dia" | "semana" | "mes">("dia");
  const [periodoEntrega, setPeriodoEntrega] = useState<"dia" | "semana" | "mes">("dia");
  const [periodoConcluido, setPeriodoConcluido] = useState<"dia" | "semana" | "mes">("dia");

  const opcoes: Array<"dia" | "semana" | "mes"> = ["dia", "semana", "mes"]; // Array de opções

  // Dados fictícios para motoboys e pedidos recentes
  // const [motoboys, setMotoboys] = useState([
  //   { id: 1, name: "Carlos Silva", status: "Disponível", entregas: 5 },
  //   { id: 2, name: "Ana Souza", status: "Em entrega", entregas: 3 },
  //   { id: 3, name: "Marcos Lima", status: "Disponível", entregas: 7 },
  // ]);


  const motoboys = [
    {
      id: 1,
      name: "Motoboy A",
      avatar: "https://via.placeholder.com/50",
      phone: "123456789",
      vehicle: "Moto",
      status: "online" as MotoboyStatus, // agora "online" é reconhecido como literal
      location: [-48.214972, -18.905934] as Coordinates,
      deliveries: []
    },
    {
      id: 2,
      name: "Motoboy B",
      avatar: "https://via.placeholder.com/50",
      phone: "987654321",
      vehicle: "Scooter",
      status: "offline" as MotoboyStatus, // literal permitido
      location: [-48.279946, -18.943977] as Coordinates,
      deliveries: []
    }
  ];






  const [pedidosRecentes, setPedidosRecentes] = useState([
    { id: 101, cliente: "João Pereira", status: "Entregue", total: "R$45,00", motoboy: null },
    { id: 102, cliente: "Maria Fernandes", status: "Em entrega", total: "R$32,50", motoboy: "Ana Souza" },
    { id: 103, cliente: "Lucas Oliveira", status: "Pendente", total: "R$27,90", motoboy: null },
  ]);

  const [pedidoSelecionado, setPedidoSelecionado] = useState<number | null>(null);

  const [inviteId, setInviteId] = useState(""); // Estado para o ID do motoboy

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
        setInviteId(""); // Limpa o campo de entrada
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
<div className="w-full max-w-screen-2xl mx-auto px-5 pr-60 space-y-8">
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
              {/* Período em cima do card (minimalista) */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-gray-300">
                {periodoTotal.toUpperCase()}
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                {opcoes.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => setPeriodoTotal(opcao)}
                    className={`w-3 h-3 rounded-full ${
                      periodoTotal === opcao ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></button>
                ))}
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Total de Pedidos</h2>
              <p className="text-lg font-bold text-gray-900">{pedidos[periodoTotal].total}</p>
            </Card>

            {/* Pedidos em Entrega */}
            <Card className="p-3 bg-gray-50 border border-gray-200 relative">
              {/* Período em cima do card (minimalista) */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-gray-300">
                {periodoEntrega.toUpperCase()}
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                {opcoes.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => setPeriodoEntrega(opcao)}
                    className={`w-3 h-3 rounded-full ${
                      periodoEntrega === opcao ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></button>
                ))}
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Pedidos em Entrega</h2>
              <p className="text-lg font-bold text-gray-900">{pedidos[periodoEntrega].entrega}</p>
            </Card>

            {/* Pedidos Concluídos */}
            <Card className="p-3 bg-gray-50 border border-gray-200 relative">
              {/* Período em cima do card (minimalista) */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-gray-300">
                {periodoConcluido.toUpperCase()}
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                {opcoes.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => setPeriodoConcluido(opcao)}
                    className={`w-3 h-3 rounded-full ${
                      periodoConcluido === opcao ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></button>
                ))}
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Pedidos Concluídos</h2>
              <p className="text-lg font-bold text-gray-900">{pedidos[periodoConcluido].concluido}</p>
            </Card>
          </div>
        </CardContent>
      </Card>
      <MapComponent
        pizzeriaLocation={pizzeriaLocation}
        motoboys={motoboys}
        orders={orders}
      />
      {/* Motoboys Ativos */}
      <div className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Motoboys Ativos</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {motoboys.map((motoboy) => (
            <Card key={motoboy.id} className="p-3 border border-gray-200 bg-gray-50">
              <h3 className="text-base font-bold text-gray-800">{motoboy.name}</h3>
              <p className="text-sm text-gray-600">Status: {motoboy.status}</p>
              <p className="mt-1 text-sm text-gray-700">Entregas feitas: {motoboy.deliveries[1]}</p>
              <Progress value={(motoboy.deliveries[1] / 10) * 100} className="mt-2" />
            </Card>
          ))}
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Pedidos Recentes</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {pedidosRecentes.map((pedido) => (
            <Card key={pedido.id} className="p-3 border border-gray-200 bg-gray-50 relative">
              <h3 className="text-base font-bold text-gray-800">Pedido #{pedido.id}</h3>
              <p className="text-sm text-gray-600">Cliente: {pedido.cliente}</p>
              <p className="mt-1 text-sm text-gray-700">Total: {pedido.total}</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">Status: {pedido.status}</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                Motoboy: {pedido.motoboy || "Nenhum"}
              </p>
              <Button
                onClick={() => setPedidoSelecionado(pedido.id)}
                className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600 text-sm"
              >
                {pedido.motoboy ? "Alterar Motoboy" : "Atribuir Motoboy"}
              </Button>
              {pedidoSelecionado === pedido.id && (
                <div className="absolute top-0 left-0 right-0 bg-white p-3 shadow-md rounded-lg">
                  <h4 className="text-base font-semibold text-gray-800">Selecione um Motoboy</h4>
                  {motoboys.map((motoboy) => (
                    <Button
                      key={motoboy.id}
                      onClick={() => atribuirMotoboy(pedido.id, motoboy)}
                      className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                    >
                      {motoboy.name}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setPedidoSelecionado(null)}
                    variant="destructive"
                    className="mt-2 w-full bg-red-500 text-white hover:bg-red-600 text-sm"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Convite para Motoboy */}
      <div className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Convidar Motoboy</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite o ID do Motoboy para enviar o convite"
            value={inviteId}
            onChange={(e) => setInviteId(e.target.value)}
            className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <Button
            onClick={sendInvite}
            className="bg-blue-500 text-white hover:bg-blue-600 text-sm"
          >
            Enviar Convite
          </Button>
        </div>
      </div>
    </div>
  );
}