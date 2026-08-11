import { supabase } from '../supabaseClient.js';

/* Obtener categorias */
export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, color')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    return { data, error };
}