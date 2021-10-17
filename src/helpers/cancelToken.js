import axios from 'axios';

const CancelToken = axios.CancelToken;
export const cancelAxiosSource = CancelToken.source();