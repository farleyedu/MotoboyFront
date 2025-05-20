// // src/mocks/mockData.ts

 import { Coordinates, Motoboy, MotoboyComPedidosDTO, Order } from '../components/ui/types';


const orders: Order[] = [
  {
    id: 1,
    nomeCliente: 'Ana Costa',
    idIfood: '2524',
    telefoneCliente: '34 99148-0112',
    dataPedido: '19/05/2025',
    statusPedido: 'em_rota',
    enderecoEntrega: 'Av. João Naves de Ávila, 2121 - Santa Mônica, Uberlândia - MG',
    items: 'Pizza Calabresa',
    value: 'R$50.00',
    region: 'Santa Mônica',
    //status: 'em_rota',
    coordinates: [-48.26169504593216, -18.919965923272528],
    horarioPedido: '18:00',
    previsaoEntrega: '18:40',
    horarioSaida: '18:15',
    horarioEntrega: '',
    motoboyResponsalvel: {
      name: 'João Motoboy',
      avatar: '',
      status: 'online'
    }
  }
  // },
  // {
  //   id: 2,
  //   address: 'Rua Tenente Virmondes, 100 - Centro, Uberlândia - MG',
  //   items: 'Esfirra de Carne',
  //   value: 'R$30.00',
  //   region: 'Centro',
  //   status: 'em_rota',
  //   coordinates: [-48.279520175076634, -18.916338931873838],
  //   horarioPedido: '18:05',
  //   previsaoEntrega: '18:45',
  //   horarioSaida: '18:20',
  //   horarioEntrega:'' ,
  //   motoboy: {
  //     name: 'Natanael Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 3,
  //   address: 'Av. Rondon Pacheco, 5000 - Tibery, Uberlândia - MG',
  //   items: 'Hambúrguer Artesanal',
  //   value: 'R$45.00',
  //   region: 'Tibery',
  //   status: 'em_rota',
  //   coordinates: [-48.26059413369974, -18.903979975504328],
  //   horarioPedido: '18:10',
  //   previsaoEntrega: '18:50',
  //   horarioSaida: '18:25',
  //   horarioEntrega:'' ,
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 4,
  //   address: 'Rua Goiás, 200 - Martins, Uberlândia - MG',
  //   items: 'Lasanha de Frango',
  //   value: 'R$35.00',
  //   region: 'Martins',
  //   status: 'em_rota',
  //   coordinates: [-48.280938343387746, -18.921554165034802],
  //   horarioPedido: '18:15',
  //   previsaoEntrega: '18:55',
  //   horarioSaida: '18:30',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'João Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 5,
  //   address: 'R. Pirapora, 410 - Tibery, Uberlândia - MG',
  //   items: 'Sushi Combo',
  //   value: 'R$60.00',
  //   region: 'Brasil',
  //   status: 'em_rota',
  //   coordinates: [-48.237514136828594, -18.904548455707445], //-, -
  //   horarioPedido: '18:20',
  //   previsaoEntrega: '19:00',
  //   horarioSaida: '18:35',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'Natanael Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 6,
  //   address: 'R. Paschoal Bruno, 957 - Santa Luzia, Uberlândia - MG',
  //   items: 'Churrasco Misto',
  //   value: 'R$70.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'em_rota',
  //   coordinates: [-48.22828633993229, -18.941062305885794], //-, -
  //   horarioPedido: '18:25',
  //   previsaoEntrega: '19:05',
  //   horarioSaida: '18:40',
  //   horarioEntrega:'' ,
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 7,
  //   address: 'R. Marceli Manoel Barcelos, 328 - Jardim Ipanema, Uberlândia - MG',
  //   items: 'Feijoada Completa',
  //   value: 'R$55.00',
  //   region: 'Fundinho',
  //   status: 'em_rota',
  //   coordinates: [-48.218259212949086, -18.881982330066943], //-, -
  //   horarioPedido: '18:30',
  //   previsaoEntrega: '19:10',
  //   horarioSaida: '18:45',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'João Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 8,
  //   address: 'Av. Sucupira, 662 - Res. Integração, Uberlândia - MG',
  //   items: 'Macarrão à Bolonhesa',
  //   value: 'R$40.00',
  //   region: 'Aparecida',
  //   status: 'em_rota',
  //   coordinates: [-48.205430493083256, -18.914325872534896], //-, -
  //   horarioPedido: '18:35',
  //   previsaoEntrega: '19:15',
  //   horarioSaida: '18:50',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'Natanael Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 9,
  //   address: 'R. José Rezende dos Santos, 1705 - Brasil, Uberlândia - MG',
  //   items: 'Salada Caesar',
  //   value: 'R$25.00',
  //   region: 'Cazeca',
  //   status: 'em_rota',
  //   coordinates: [-48.26569595560473, -18.886863650723328], //-, -
  //   horarioPedido: '18:40',
  //   previsaoEntrega: '19:20',
  //   horarioSaida: '18:55',
  //   horarioEntrega:'' ,
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 10,
  //   address: 'Rua Machado de Assis, 800 - Bom Jesus, Uberlândia - MG',
  //   items: 'Tacos Mexicanos',
  //   value: 'R$50.00',
  //   region: 'Bom Jesus',
  //   status: 'em_rota',
  //   coordinates: [-48.275371471184826, -18.920471810218874],
  //   horarioPedido: '18:45',
  //   previsaoEntrega: '19:25',
  //   horarioSaida: '19:00',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'João Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  //   {
  //   id: 11,
  //   address: 'Rua Pirapuã, 140 - Jardim Karaíba, Uberlândia - MG',
  //   items: 'Pizza Margherita',
  //   value: 'R$45.00',
  //   region: 'Santa Mônica',
  //   status: 'em_rota',
  //   coordinates: [-48.26160173452336, -18.948079040448224], //-, -
  //   horarioPedido: '18:50',
  //   previsaoEntrega: '19:30',
  //   horarioSaida: '19:05',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'João Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 12,
  //   address: 'R. Reginaldo Sobreira da Silva, 145 - Shopping Park, Uberlândia - MG',
  //   items: 'Esfirra de Frango',
  //   value: 'R$30.00',
  //   region: 'Centro',
  //   status: 'em_rota',
  //   coordinates: [-48.265951019177194, -18.991141724994524], //-, -
  //   horarioPedido: '18:55',
  //   previsaoEntrega: '19:35',
  //   horarioSaida: '19:10',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'Natanael Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 13,
  //   address: 'R. Rosângela Pena Cordeiro, 42 - Shopping Park, Uberlândia - MG',
  //   items: 'Hambúrguer Vegano',
  //   value: 'R$40.00',
  //   region: 'Tibery',
  //   status: 'em_rota',
  //   coordinates: [-48.268710594498955, -18.978219021553063], //-, -
  //   horarioPedido: '19:00',
  //   previsaoEntrega: '19:40',
  //   horarioSaida: '19:15',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 14,
  //   address: 'R. do Feirante, 1222 - Planalto, Uberlândia - MG',
  //   items: 'Lasanha de Legumes',
  //   value: 'R$35.00',
  //   region: 'Martins',
  //   status: 'em_rota',
  //   coordinates: [-48.318062458931905, -18.938010113192647], //-, -
  //   horarioPedido: '19:05',
  //   previsaoEntrega: '19:45',
  //   horarioSaida: '19:20',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'João Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 15,
  //   address: 'Av. Floriano Peixoto, 1300 - Brasil, Uberlândia - MG',
  //   items: 'Sushi Variado',
  //   value: 'R$60.00',
  //   region: 'Brasil',
  //   status: 'em_rota',
  //   coordinates: [-48.27198986332148, -18.912732950270843],
  //   horarioPedido: '19:10',
  //   previsaoEntrega: '19:50',
  //   horarioSaida: '19:25',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'Natanael Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 16,
  //   address: 'Rua Duque de Caxias, 1400 - Osvaldo Rezende, Uberlândia - MG',
  //   items: 'Churrasco Vegetariano',
  //   value: 'R$70.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'em_rota',
  //   coordinates: [-48.26984790148644, -18.925375754036935],
  //   horarioPedido: '19:15',
  //   previsaoEntrega: '19:55',
  //   horarioSaida: '19:30',
  //   horarioEntrega: '',
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 17,
  //   address: 'R. Josephina de Souza Leite, 203 - Nova Uberlândia, Uberlândia - MG',
  //   items: 'Feijoada Light',
  //   value: 'R$55.00',
  //   region: 'Fundinho',
  //   status: 'pendente',
  //   coordinates: [-48.30472288901687, -18.955364557842657], //-, -
  //   horarioPedido: '19:20',
  //   previsaoEntrega: '20:00',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 18,
  //   address: 'R. Maria Antônieta Dantas, 187 - Dona Zulmira, Uberlândia - MG',
  //   items: 'Macarrão Integral',
  //   value: 'R$40.00',
  //   region: 'Aparecida',
  //   status: 'pendente',
  //   coordinates: [-48.31601362218728, -18.915006139956102], //-, -
  //   horarioPedido: '19:25',
  //   previsaoEntrega: '20:05',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 19,
  //   address: 'R. Interplanetária, 722 - Jardim Brasília, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Cazeca',
  //   status: 'pendente',
  //   coordinates: [-48.30365114272393, -18.897078405852827], //-, -
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 20,
  //   address: 'Rua Paulo Frontin, 700 – Custódio Pereira, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Custódio Pereira',
  //   status: 'pendente',
  //   coordinates: [-48.23829319709925, -18.89230206711683],
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  //   {
  //   id: 21,
  //   address: 'Avenida Vasconcelos Costa, 552 – Martins, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Martins',
  //   status: 'pendente',
  //   coordinates: [-48.28173918718118, -18.912952806066738],
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 22,
  //   address: 'R. Manoel Maurício Araújo, 140 - Maravilha, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Martins',
  //   status: 'pendente',
  //   coordinates: [-48.29853980827422, -18.884278815262004], //-, -
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 23,
  //   address: 'Rua Francisco Zumpano, 300 – Martins, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Martins',
  //   status: 'pendente',
  //   coordinates: [-48.26763462313524, -18.915279200965692],
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 24,
  //   address: 'Rua República do Piratini, 204, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Martinésia',
  //   status: 'pendente',
  //   coordinates: [-48.268945460038445, -18.87434448948697], //-, -
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 26,
  //   address: 'Rua José Morais, 250 – Osvaldo Rezende, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'pendente',
  //   coordinates: [-48.26461645447083, -18.91490592643582],
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '',
  //   horarioEntrega: '',
  // },
  // {
  //   id: 27,
  //   address: 'Rua Camilo Braga, 350 – Osvaldo Rezende, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'concluido',
  //   coordinates: [-48.26268649094085, -18.914304777574568],
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '18:15',
  //   horarioEntrega: '18:50',
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 28,
  //   address: 'Rua Segismundo Morais, 400 – Osvaldo Rezende, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'concluido',
  //   coordinates: [-48.26312010856311, -18.914718430095036],
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '18:15',
  //   horarioEntrega: '18:50',
  //   motoboy: {
  //     name: 'João Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 29,
  //   address: 'R. Serra do Tombador, 752 - São Jorge, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'concluido',
  //   coordinates: [-48.22938210435599, -18.96774583949544], //-, -
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '18:15',
  //   horarioEntrega: '18:50',
  //   motoboy: {
  //     name: 'Natanael Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // },
  // {
  //   id: 30,
  //   address: 'R. do Morango, 296 - Pacaembu, Uberlândia - MG',
  //   items: 'Pizza Calabresa',
  //   value: 'R$50.00',
  //   region: 'Osvaldo Rezende',
  //   status: 'concluido',
  //   coordinates: [-48.296010426428815, -18.881096449810958], //-, -
  //   horarioPedido: '18:00',
  //   previsaoEntrega: '18:40',
  //   horarioSaida: '18:15',
  //   horarioEntrega: '18:50',
  //   motoboy: {
  //     name: 'Arthur Motoboy',
  //     avatar: '',
  //     status: 'online'
  //   }
  // }
  

]

export { orders };