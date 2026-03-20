import useSWR from 'swr';
import api from './api';

// Generic fetcher that works with both the real Axios instance and the demo mock API
const fetcher = (url) => api.get(url).then(res => res.data);

/**
 * Custom hook wrapping useSWR with the project's API fetcher.
 * @param {string|null} key - The API endpoint (e.g. '/students'). Pass null to skip fetching.
 * @param {object} options - SWR config overrides
 */
export const useAPI = (key, options = {}) => {
  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    ...options,
  });
};

export default fetcher;
