import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

export const useSearchParams = () => {
  const params = useParams();

  return useCallback((target) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.get('query');

    if (!query) return '';
    const [name, value] = query.split('=');
    return target === name ? value : ''; 
  }, [params]);
}