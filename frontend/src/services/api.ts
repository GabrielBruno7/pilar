const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

function clearSessionAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  headers.set("X-Requested-With", "XMLHttpRequest");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    clearSessionAndRedirect();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (response.status === 403) {
    clearSessionAndRedirect();
    throw new Error("Acesso negado. Faça login novamente.");
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      "Erro na requisição.";

    throw new Error(errorMessage);
  }

  return data as T;
}