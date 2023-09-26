import { client } from './client';

export const saveFiles = async (files: File[]) => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.set(`${i}`, files[i]);
  }

  return await client.post('/files', formData);
};
