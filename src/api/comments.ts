import { client } from './client';
import { NewMessage } from '../types/NewMessage';

export const getConversationList = async (
  order: string,
  sort: string,
  page: number
) => {
  return await client.get(`/messages?order=${order}&sort=${sort}&page=${page}`);
};

export const createMessage = async (data: NewMessage) => {
  return await client.post('/messages', data);
};
