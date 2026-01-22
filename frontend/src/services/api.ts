const API_URL = "http://localhost:8080";

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function setToken(token: string) {
    localStorage.setItem("token", token);
}

export function removeToken() {
    localStorage.removeItem("token");
}


export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {

    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });
}


