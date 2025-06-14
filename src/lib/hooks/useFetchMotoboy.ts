// src/lib/hooks/useFetchMotoboys.ts
import { useEffect, useState } from 'react';
import { Motoboy } from '../../components/ui/types';

export function useFetchMotoboys(): Motoboy[] {
    const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  
    useEffect(() => {
      fetch('https://zippy-api.onrender.com/api/Motoboy/com-pedidos')
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
