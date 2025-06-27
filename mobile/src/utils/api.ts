import { API_BASE_URL } from '../../config/apiConfig';

export function getEndpoint(path: string): string {
  const cleanedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanedPath}`;
}