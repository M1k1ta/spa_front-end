import { FileFromServer } from './FileFromServer';

export interface Message {
  id: number;
  userName: string;
  email: string;
  homePage: string;
  editorState: string;
  photos: FileFromServer[];
  docs: FileFromServer[];
  relatedId: number | null;
  messages: Message[];
  createdAt: string;
}
