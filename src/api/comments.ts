import { client } from './client';
import { NewMessage } from '../types/NewMessage';
import { Order } from '../types/Order';
import { Sort } from '../types/Sort';

export const getConversationList = async (
  order: Order,
  sort: Sort,
  page: number
) => {
  return await client.get(`/messages?order=${order}&sort=${sort}&page=${page}`);
};

export const createMessage = async (data: NewMessage) => {
  return await client.post('/messages', data);
};
