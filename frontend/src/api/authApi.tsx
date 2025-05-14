// Exemplo de função para logar no frontend (pode ser em um arquivo separado como authApi.ts)
export const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }
  
    const data = await response.json();
  
    // Salvar token e user ID
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id.toString());
  
    return data.user; // Você pode devolver o usuário se quiser usar depois
  };
  