"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, ReactNode } from "react";

interface AjusteValorModalProps {
  children: ReactNode; // Permite passar elementos como filhos
}

export default function AjusteValorModal({ children }: AjusteValorModalProps) {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("acrescimo");
  const [observacao, setObservacao] = useState("");

  const handleSalvar = () => {
    console.log({
      valor,
      tipo,
      observacao,
    });
    // Aqui você pode mandar pra sua API, por exemplo
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuste de Valor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 10.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de ajuste</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="acrescimo"
                  checked={tipo === "acrescimo"}
                  onChange={() => setTipo("acrescimo")}
                />
                Acréscimo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="desconto"
                  checked={tipo === "desconto"}
                  onChange={() => setTipo("desconto")}
                />
                Desconto
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Input
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Fez entrega extra"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSalvar}>Salvar ajuste</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}