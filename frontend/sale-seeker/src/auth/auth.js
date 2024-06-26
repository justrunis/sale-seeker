import { redirect } from "react-router-dom";

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export function AuthVerify(token) {
  if (token) {
    const decodedToken = parseJwt(token);

    if (
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp * 1000 < new Date().getTime()
    ) {
      localStorage.removeItem("jwtToken");
      redirect("/");
    }
  }
}

export function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return JSON.parse(token).token;
}

export function getUserEmail(token) {
  if (token === undefined || token === null) {
    return;
  }
  const decodedToken = parseJwt(token);
  return decodedToken.email;
}

export function getUserId(token) {
  if (token === undefined || token === null) {
    return;
  }
  const decodedToken = parseJwt(token);
  return decodedToken.id;
}

export function getUserRole(token) {
  if (token === undefined || token === null) {
    return;
  }
  const decodedToken = parseJwt(token);
  return decodedToken.role;
}

export function getUsername(token) {
  if (token === undefined || token === null) {
    return;
  }
  const decodedToken = parseJwt(token);
  return decodedToken.username;
}

export function getExpiration(token) {
  if (token === undefined || token === null) {
    return;
  }
  const decodedToken = parseJwt(token);
  return decodedToken.exp;
}
