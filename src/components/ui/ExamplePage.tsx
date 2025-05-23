// 'use client';

// import React, { FC } from 'react';
// import { MapComponentProps } from './types';
// import MapComponent from './motoboy-map';

// // Dados de exemplo para demonstração
// const ExamplePage: FC = () => {
//   // Localização da pizzaria (exemplo: São Paulo)
//   const pizzeriaLocation: [number, number] = [-46.6395, -23.5558];
  
//   // Dados de exemplo para motoboys
//   const motoboys = [
//     {
//       id: 1,
//       name: 'Carlos Silva',
//       avatar: 'https://via.placeholder.com/50',
//       phone: '(11) 98765-4321',
//       vehicle: 'Honda CG 160',
//       status: 'online' as const,
//       location: [-46.6388, -23.5489] as [number, number], // Coordenadas de exemplo em São Paulo
//       deliveries: [
//         {
//           id: 1234,
//           status: 'em_rota' as const,
//           address: 'Rua das Flores, 123 - Apto 45',
//           items: '2 Pizzas',
//           value: 'R$ 85,90',
//           departureTime: '19:45',
//           eta: '20:05',
//           etaMinutes: 5,
//           coordinates: [-46.6420, -23.5500] as [number, number]
//         },
//         {
//           id: 1235,
//           status: 'proxima' as const,
//           address: 'Av. Paulista, 1000 - Bloco B',
//           items: '1 Pizza',
//           value: 'R$ 49,90',
//           departureTime: '19:45',
//           eta: '20:20',
//           etaMinutes: 20,
//           coordinates: [-46.6550, -23.5650] as [number, number]
//         }
//       ]
//     },
//     {
//       id: 2,
//       name: 'Ana Oliveira',
//       avatar: 'https://via.placeholder.com/50',
//       phone: '(11) 97654-3210',
//       vehicle: 'Yamaha Factor 125',
//       status: 'online' as const,
//       location: [-46.6450, -23.5520] as [number, number],
//       deliveries: [
//         {
//           id: 1240,
//           status: 'em_rota' as const,
//           address: 'Rua Augusta, 789',
//           items: '1 Pizza + 1 Refrigerante',
//           value: 'R$ 65,90',
//           departureTime: '19:50',
//           eta: '20:10',
//           etaMinutes: 10,
//           coordinates: [-46.6480, -23.5550] as [number, number]
//         }
//       ]
//     },
//     {
//       id: 3,
//       name: 'Pedro Santos',
//       avatar: 'https://via.placeholder.com/50',
//       phone: '(11) 96543-2109',
//       vehicle: 'Honda PCX 150',
//       status: 'online' as const,
//       location: [-46.6500, -23.5600] as [number, number],
//       deliveries: [
//         {
//           id: 1245,
//           status: 'em_rota' as const,
//           address: 'Rua Oscar Freire, 500',
//           items: '2 Pizzas + 2 Refrigerantes',
//           value: 'R$ 120,80',
//           departureTime: '19:40',
//           eta: '20:00',
//           etaMinutes: 0,
//           coordinates: [-46.6520, -23.5620] as [number, number]
//         },
//         {
//           id: 1246,
//           status: 'proxima' as const,
//           address: 'Alameda Santos, 800',
//           items: '1 Pizza',
//           value: 'R$ 55,90',
//           departureTime: '19:40',
//           eta: '20:15',
//           etaMinutes: 15,
//           coordinates: [-46.6540, -23.5640] as [number, number]
//         },
//         {
//           id: 1247,
//           status: 'proxima' as const,
//           address: 'Rua Haddock Lobo, 300',
//           items: '1 Pizza + 1 Sobremesa',
//           value: 'R$ 75,80',
//           departureTime: '19:40',
//           eta: '20:30',
//           etaMinutes: 30,
//           coordinates: [-46.6560, -23.5660] as [number, number]
//         }
//       ]
//     },
//     {
//       id: 4,
//       name: 'Mariana Costa',
//       avatar: 'https://via.placeholder.com/50',
//       phone: '(11) 95432-1098',
//       vehicle: 'Honda Biz 125',
//       status: 'online' as const,
//       location: [-46.6550, -23.5550] as [number, number],
//       deliveries: [
//         {
//           id: 1250,
//           status: 'em_rota' as const,
//           address: 'Rua Consolação, 1500',
//           items: '1 Pizza Família + 2 Refrigerantes',
//           value: 'R$ 95,70',
//           departureTime: '19:55',
//           eta: '20:15',
//           etaMinutes: 15,
//           coordinates: [-46.6570, -23.5570] as [number, number]
//         },
//         {
//           id: 1251,
//           status: 'proxima' as const,
//           address: 'Av. Rebouças, 1200',
//           items: '2 Pizzas Médias',
//           value: 'R$ 79,80',
//           departureTime: '19:55',
//           eta: '20:25',
//           etaMinutes: 25,
//           coordinates: [-46.6590, -23.5590] as [number, number]
//         }
//       ]
//     }
//   ];
  
//   // Pedidos pendentes para exemplo
//   const pendingOrders = [
//     {
//       id: 1236,
//       address: 'Rua Augusta, 500',
//       items: '2 Pizzas + 1 Refrigerante',
//       value: 'R$ 95,80',
//       region: 'Zona Oeste'
//     },
//     {
//       id: 1237,
//       address: 'Rua Oscar Freire, 200',
//       items: '1 Pizza + 2 Refrigerantes',
//       value: 'R$ 75,70',
//       region: 'Zona Oeste'
//     },
//     {
//       id: 1238,
//       address: 'Av. Paulista, 1500',
//       items: '3 Pizzas + 2 Refrigerantes',
//       value: 'R$ 145,90',
//       region: 'Zona Sul'
//     }
//   ];

//   return (
//     <div className="container mx-auto p-4">
//       <header className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Painel de Controle - Pizzaria Exemplo</h1>
//       </header>
      
//       <main>
//         <MapComponent 
//           pizzeriaLocation={pizzeriaLocation}
//           motoboys={motoboys}
//           orders={pendingOrders}
//         />
//       </main>
      
//       <footer className="mt-8 text-center text-gray-500 text-sm">
//         <p>© 2025 Sistema de Gerenciamento de Motoboys</p>
//       </footer>
//     </div>
//   );
// };

// export default ExamplePage;
