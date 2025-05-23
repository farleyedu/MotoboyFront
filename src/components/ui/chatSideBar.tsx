import { useState, useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageCircle, ArrowLeft, MessageSquare } from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "João Motoboy",
    avatar: `/assets/img/perfil-motoboy.jpg`,
    lastMessage: "Cheguei no local!",
    isGroup: false,
    messages: [
      { from: "them", content: "Oi, já saiu para entrega?" },
      { from: "me", content: "Cheguei no local!" }
    ]
  },
  {
    id: 2,
    name: "Equipe Noturna",
    avatar: `/assets/img/perfil-motoboy.jpg`,
    lastMessage: "Pedido 102 entregue.",
    isGroup: true,
    messages: [
      { from: "me", content: "Boa noite, equipe!" },
      { from: "them", content: "Pedido 102 entregue." }
    ]
  },
  {
    id: 3,
    name: "Maria Entregas",
    avatar: `/assets/img/perfil-motoboy.jpg`,
    lastMessage: "Sai agora da pizzaria!",
    isGroup: false,
    messages: [
      { from: "them", content: "Sai agora da pizzaria!" },
      { from: "me", content: "Beleza, valeu!" }
    ]
  },
];


interface ChatSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ChatSidebar({ isOpen, setIsOpen }: ChatSidebarProps) {  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  // const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layoutMain = document.querySelector("main");
    if (layoutMain) {
      layoutMain.classList.toggle("pr-64", isOpen);
      layoutMain.classList.toggle("pr-0", !isOpen);
    }
  }, [isOpen]);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedContact = contacts.find((c) => c.id === selected);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    selectedContact?.messages.push({ from: "me", content: newMessage });
    setNewMessage("");
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedContact]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-5 py-4 rounded-[2rem] shadow-lg hover:bg-green-700 z-50 flex items-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-medium">Conversas</span>
      </button>
    );
  }

  return (
<div className="w-[20rem] border-l border-gray-200 h-full flex flex-col bg-white shadow-md transition-all fixed right-0 top-0 bottom-0 z-40 rounded-l-3xl overflow-hidden">      <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-green-600 text-white rounded-tl-3xl">
        <h2 className="text-sm font-semibold">Conversas</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-100 text-sm"
        >
          Fechar
        </button>
      </div>

      {selectedContact ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center gap-2 p-4 border-b border-gray-100">
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar src={selectedContact.avatar} alt={selectedContact.name} size="sm" />
            <div className="ml-2">
              <div className="font-medium text-sm text-gray-800">{selectedContact.name}</div>
              <div className="text-xs text-gray-500">{selectedContact.isGroup ? "Grupo" : "Motoboy"}</div>
            </div>
          </div>
          <ScrollArea className="flex-1 px-4 py-2 space-y-2">
            <div ref={scrollRef} className="flex flex-col gap-2 pb-4">
              {selectedContact.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "max-w-[75%] px-4 py-2 rounded-3xl text-sm transition-all",
                    msg.from === "me"
                      ? "bg-green-100 self-end ml-auto"
                      : "bg-gray-100 self-start"
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Input
                placeholder="Digite uma mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 rounded-full"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col bg-green-50 h-full">
          <div className="p-4">
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white rounded-full shadow-sm"
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 space-y-1">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-2xl cursor-pointer transition-all",
                    selected === contact.id
                      ? "bg-white shadow-md"
                      : "hover:bg-white/70"
                  )}
                  onClick={() => setSelected(contact.id)}
                >
                  <Avatar src={contact.avatar} alt={contact.name} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {contact.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">
                      {contact.messages[contact.messages.length - 1]?.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full text-sm text-gray-600 flex items-center gap-2 hover:text-black"
              onClick={() => setSelected(null)}
            >
              <MessageCircle className="w-4 h-4" />
              Nova conversa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
