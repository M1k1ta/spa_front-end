export interface NewMessage {
  userName: string;
  email: string;
  homePage: string;
  editorState: string;
  photos: string[];
  docs: string[];
  relatedId: number | null;
}
