export const fetchCurrentUser = async () => {
  const response = await fetch('/api/auth/me');
  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return await response.json();
};
export const fetchUserById = async (id: string) => {
  const response = await fetch(`/api/auth/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
};
