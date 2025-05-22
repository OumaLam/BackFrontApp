import axios from "axios";
import { cookies } from "next/headers";

export async function fetchFromBackend<T>(path: string, method: string = 'GET', data?: any): Promise<T> {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) throw new Error("Token manquant");

  const res = await axios({
    method,
    url: `http://localhost:8080/api${path}`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
