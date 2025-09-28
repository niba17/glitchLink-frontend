// frontend-final/src/utils/jwt.ts
export function isTokenValid(token: string | null) {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) return false;

    // exp dalam detik, Date.now() dalam ms
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
