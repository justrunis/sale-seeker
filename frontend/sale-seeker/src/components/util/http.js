import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
const BASE_URL = "http://localhost:4000";

export async function fetchItems({ signal }) {
  const URL = `${BASE_URL}/items`;

  const response = await fetch(URL, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching items");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const items = await response.json();

  return items;
}

export async function fetchItem({ id, signal }) {
  const URL = `${BASE_URL}/items/${id}`;
  const response = await fetch(URL, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the item");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const item = await response.json();

  return item;
}

export async function fetchUsers({ signal }) {
  const URL = `${BASE_URL}/users`;
  const response = await fetch(URL, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching users");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const users = await response.json();

  return users;
}

export async function deleteUser({ id }) {
  const URL = `${BASE_URL}/users/${id}`;
  const response = await fetch(URL, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the user");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function editUser({ id, user }) {
  const URL = `${BASE_URL}/users/${id}`;
  console.log("USER", user);
  const response = await fetch(URL, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while editing the user");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}
