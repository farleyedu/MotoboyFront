export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

const API_URL = "https://zippy-api.onrender.com/api/Usuario";

const UsuarioService = {
  async getUsuarios(): Promise<Usuario[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }
    return response.json();
  },
};

export default UsuarioService;