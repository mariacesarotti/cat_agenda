const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
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

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user.id.toString());

  return data.user;
};
