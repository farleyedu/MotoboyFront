// // src/mocks/mockData.ts

// import { Coordinates, Motoboy, Order } from '../components/ui/types';

// export const motoboys: Motoboy[] = [
//   {
//     id: 1,
//     name: "Motoboy A",
//     //avatar: "https://via.placeholder.com/50",
//     phone: "123456789",
//     vehicle: "Moto",
//     status: "online",
//     location: [-48.2791, -18.9143] as Coordinates,
//     deliveries: []
//   },
//   {
//     id: 2,
//     name: "Motoboy B",
//     //avatar: "https://via.placeholder.com/50",
//     phone: "987654321",
//     vehicle: "Scooter",
//     status: "offline",
//     location: [-48.279946, -18.943977] as Coordinates,
//     deliveries: []
//   }
// ];

// export const orders: Order[] = [
//   {
//     id: 1,
//     address: 'Av. João Naves',
//     items: 'Pizza Calabresa',
//     value: 'R$45',
//     region: 'Centro',
//     status: 'pendente',
//     coordinates: [-48.2791, -18.9143],
//     horarioPedido: '18:00',
//     previsaoEntrega: '18:30',
//     horarioSaida: null,
//     horarioEntrega: null,
//     motoboy: {
//       name: 'Motoboy A',
//       avatar: '/img/motoboy-a.jpg',
//       status: 'online'
//     }
//   },
//   {
//     id: 2,
//     address: 'Rua da Pizzaria',
//     items: 'Pizza Portuguesa',
//     value: 'R$50',
//     region: 'Fundinho',
//     status: 'em_rota',
//     coordinates: [-48.2778, -18.9112],
//     horarioPedido: '17:40',
//     previsaoEntrega: '18:10',
//     horarioSaida: '17:50',
//     horarioEntrega: null,
//     motoboy: {
//       name: 'Motoboy B',
//       avatar: '/img/motoboy-b.jpg',
//       status: 'offline'
//     }
//   },
//   {
//     id: 3,
//     address: 'Av. Afonso Pena',
//     items: 'Refrigerante',
//     value: 'R$10',
//     region: 'Martins',
//     status: 'concluida',
//     coordinates: [-48.2700, -18.9175],
//     horarioPedido: '16:30',
//     previsaoEntrega: '17:00',
//     horarioSaida: '16:40',
//     horarioEntrega: '16:55',
//     motoboy: {
//       name: 'Motoboy C',
//       avatar: '/img/motoboy-c.jpg',
//       status: 'offline'
//     }
//   },
//   // Continue transferindo os outros pedidos...
// ];