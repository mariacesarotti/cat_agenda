const API_URL = import.meta.env.VITE_API_URL;
const getUserId = () => localStorage.getItem("userId");


export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token não encontrado no localStorage");
  }
  return token;
};

export const createCat = async (
  name: string,
  age_category: string,
  userId: number
) => {
  const response = await fetch(`${API_URL}/cats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, age_category, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar gato");
  }
  return response.json();
};

export const getCats = async (userId: number) => {
  console.log("Pegando token do localStorage:", getToken());

  const response = await fetch(`${API_URL}/cats/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar gatos");
  }
  return response.json();
};
export const getLitterConfig = async (userId: number) => {
  const response = await fetch(`${API_URL}/litter/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar configuração de areia");
  }
  return response.json();
};
export const getFoodConfig = async (userId: number) => {
  const response = await fetch(`${API_URL}/food/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar configuração de comida");
  }
  return response.json();
};
export const getVaccinationConfig = async (userId: number) => {
  const response = await fetch(`${API_URL}/vaccines/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar configuração de vacinação");
  }
  return response.json();
};
export const getMedicationConfig = async (userId: number) => {
  const response = await fetch(`${API_URL}/medications/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar configuração de medicação");
  }
  return response.json();
};
export const createLitterConfig = async (data: unknown) => {
  const response = await fetch(`${API_URL}/litter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar configuração de areia");
  }
  return response.json();
};

export const createFoodConfig = async (data: unknown) => {
  const response = await fetch(`${API_URL}/food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar configuração de comida");
  }
  return response.json();
};

export const createVaccinationConfig = async (data: unknown) => {
  const response = await fetch(`${API_URL}/vaccines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar configuração de vacinação");
  }
  return response.json();
};

export const createMedicationConfig = async (data: unknown) => {
  const response = await fetch(`${API_URL}/medications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar configuração de medicação");
  }
  return response.json();
};

export const deleteCat = async (catId: number) => {
  const response = await fetch(`${API_URL}/cats/${catId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar gato");
  }
  return response.json();
};


export const getCalendarEvents = async (): Promise<Event[]> => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User ID não encontrado no localStorage");
  }
  const response = await fetch(`${API_URL}/calendar/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar eventos do calendário");
  }
  console.log(response.headers.get("Authorization"));
  console.log("Pegando token do localStorage:", getToken());
  console.log("Pegando eventos do calendário");
  console.log("Response:", response);
  return response.json();
};
