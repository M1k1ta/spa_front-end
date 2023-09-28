import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://spa-back-end-5cn9.onrender.com',
});
