import { QueryClient } from "@tanstack/react-query";
import { getToken } from "../../auth/auth";
import axios from "axios";
import env from "react-dotenv";

export const queryClient = new QueryClient();
const BASE_URL = import.meta.env.VITE_API_URL;

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

export async function fetchItemsByPage({
  signal,
  page,
  itemsPerPage,
  searchQuery,
}) {
  const URL = `${BASE_URL}/itemsPaged?page=${page}&itemsPerPage=${itemsPerPage}&search=${searchQuery}`;

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

export async function fetchUserItems({ id, signal }) {
  const URL = `${BASE_URL}/items/user/${id}`;
  const response = await fetch(URL, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the items");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const items = await response.json();

  return items;
}

export async function resetPassword({ email }) {
  const URL = `${BASE_URL}/reset-password`;
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while resetting the password");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function resetPasswordWithToken({ token, password }) {
  const URL = `${BASE_URL}/reset-password/${token}`;
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while resetting the password");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function fetchUsers({ signal }) {
  const URL = `${BASE_URL}/users`;
  const response = await fetch(URL, {
    signal,
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching users");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const users = await response.json();

  return users;
}

export async function fetchUsersByPage({ signal, page, usersPerPage }) {
  const URL = `${BASE_URL}/usersPaged?page=${page}&itemsPerPage=${usersPerPage}`;
  const response = await fetch(URL, {
    signal,
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching users");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const users = await response.json();

  return users;
}

export async function fetchUser({ signal, id }) {
  const URL = `${BASE_URL}/users/${id}`;
  const response = await fetch(URL, {
    signal,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the user");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const user = await response.json();

  return user;
}

export async function fetchUserOrders({ signal, userId }) {
  const URL = `${BASE_URL}/orders/user/${userId}`;
  const response = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the orders");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const orders = await response.json();

  return orders;
}

export async function fetchUserOrdersByPage({
  signal,
  userId,
  page,
  ordersPerPage,
}) {
  const URL = `${BASE_URL}/ordersPaged/user/${userId}?page=${page}&ordersPerPage=${ordersPerPage}`;
  const response = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the orders");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const orders = await response.json();

  return orders;
}

export async function deleteUser({ id }) {
  const URL = `${BASE_URL}/users/${id}`;
  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
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
  const response = await fetch(URL, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
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

export async function deleteItem({ id }) {
  const URL = `${BASE_URL}/items/${id}`;
  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the item");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function editItem({ id, item }) {
  if (item.image.name !== null && item.image.name !== undefined) {
    const formData = new FormData();
    formData.append("file", item.image);
    formData.append("id", id);

    const res = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    item.image = res.data.url.secure_url;
  }

  const URL = `${BASE_URL}/items/${id}`;
  const response = await fetch(URL, {
    method: "PUT",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while editing the item");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function addItem({ item }) {
  const formData = new FormData();
  formData.append("file", item.image);

  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  item.image = res.data.url;

  const URL = `${BASE_URL}/items`;
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while adding the item");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function fetchReviews({ id }) {
  const URL = `${BASE_URL}/reviews/${id}`;
  const response = await fetch(URL);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the reviews");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const reviews = await response.json();
  reviews.comment = reviews.description;

  return reviews;
}

export async function fetchReviewsByPage({ id, signal, page, reviewsPerPage }) {
  const URL = `${BASE_URL}/reviewsPaged/${id}?page=${page}&itemsPerPage=${reviewsPerPage}`;
  const response = await fetch(URL, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the reviews");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const reviews = await response.json();

  return reviews;
}

export async function addReview({ item, userId }) {
  const URL = `${BASE_URL}/reviews`;
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ ...item, userId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while adding the review");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function fetchAverageRating({ id, signal }) {
  const URL = `${BASE_URL}/reviews/average/${id}`;
  const response = await fetch(URL, {
    method: "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the average rating"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const averageRating = await response.json();

  return averageRating.avg;
}

export async function fetchAllAverageRatings({ signal }) {
  const URL = `${BASE_URL}/allReviews/average`;
  const response = await fetch(URL, {
    method: "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the average ratings"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const averageRatings = await response.json();

  return averageRatings;
}

export async function fetchAllOrders() {
  const URL = `${BASE_URL}/orders`;
  const response = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the orders");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const orders = await response.json();

  return orders;
}

export async function fetchOrdersByPage({ signal, page, ordersPerPage }) {
  const URL = `${BASE_URL}/ordersPaged?page=${page}&itemsPerPage=${ordersPerPage}`;
  const response = await fetch(URL, {
    signal,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the orders");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const orders = await response.json();

  return orders;
}

export async function deleteOrder({ id }) {
  const URL = `${BASE_URL}/orders/${id}`;
  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the order");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function changeOrderStatus({ id, status }) {
  const URL = `${BASE_URL}/orderStatusChange/${id}`;

  const response = await fetch(URL, {
    method: "PUT",
    body: JSON.stringify({ status }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while changing the order status"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export async function sendPaymentInformation({ paymentInformation }) {
  const URL = `${BASE_URL}/payment`;
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(paymentInformation),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while sending the payment");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}
