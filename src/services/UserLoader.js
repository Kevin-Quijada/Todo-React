import { getUsers } from './TodoServices.js';

export async function fetchUsers() {
  try {
    const data = await getUsers();
    return data || [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}
