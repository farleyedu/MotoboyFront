// src/lib/hooks/useFetchMotoboys.ts
import { useEffect, useState } from 'react';
import { MotoboyComPedidosDTO } from '../../components/ui/types';

export function useFetchMotoboys(): MotoboyComPedidosDTO[] {
    const [motoboys, setMotoboys] = useState<MotoboyComPedidosDTO[]>([]);
  
    useEffect(() => {
      fetch('https://localhost:7137/api/Motoboy/com-pedidos')
        .then((res) => res.json())
        .then((data) => {
          setMotoboys(data); // 👈 agora sem map nem transformação
        })
        .catch((err) => {
          console.error('Erro ao buscar motoboys:', err);
        });
    }, []);
  
    return motoboys;
  }
