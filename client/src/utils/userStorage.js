const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return "anonymous";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || "anonymous";
  } catch {
    return "anonymous";
  }
};

export const getUserStorageKey = (key) => `${key}:${getUserIdFromToken()}`;
