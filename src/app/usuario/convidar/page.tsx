"use client"
import React, { useState } from "react";
import Head from "next/head";

export default function InviteMotoboy() {
  const [motoboyId, setMotoboyId] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    if (!motoboyId) {
      setMessage("Por favor, insira um ID válido.");
      return;
    }

    // Simula um envio para API
    try {
      const response = await fetch("/api/invite-motoboy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motoboyId }),
      });

      if (response.ok) {
        setMessage("Convite enviado com sucesso!");
      } else {
        setMessage("Erro ao enviar convite. Verifique o ID.");
      }
    } catch (e) {
      console.error("Erro na conexão com o servidor:", e); // Registra o erro no console
      setMessage("Erro na conexão com o servidor.");
    }
  };

  return (
    <>
      <Head>
        <title>Convidar Motoboy</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center pr-60 bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg  p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Convidar Motoboy
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Insira o ID do motoboy para adicioná-lo ao seu grupo.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              value={motoboyId}
              onChange={(e) => setMotoboyId(e.target.value)}
              placeholder="Digite o ID do motoboy"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleInvite}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Enviar Convite
            </button>
            {message && (
              <p className="text-center text-gray-700 mt-4">{message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}