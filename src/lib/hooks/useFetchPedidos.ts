// src/lib/hooks/useFetchPedidos.ts
import { useEffect, useState } from 'react';
import { Order } from '../../components/ui/types';

export function useFetchPedidos(): Order[] {
  const [pedidos, setPedidos] = useState<Order[]>([]);

  useEffect(() => {
    fetch('https://localhost:7137/api/Pedido/pedidosMaps') // ajusta se necessário
      .then((res) => res.json())
      .then((data) => {
        const converted = data.map((p: Order) => ({ // Defina o tipo correto aqui
          ...p,
          coordinates: [p.longitude, p.latitude],
          status: (p.statusPedido ? Number(p.statusPedido) : 0) === 1
            ? 'pendente'
            : (p.statusPedido ? Number(p.statusPedido) : 0) === 2
            ? 'em_rota'
            : (p.statusPedido ? Number(p.statusPedido) : 0) === 3
            ? 'concluido'
            : 'desconhecido'
        }));
        setPedidos(converted);
      })
      .catch((err) => {
        console.error('Erro ao buscar pedidos:', err);
      });
  }, []);

  return pedidos;
}
