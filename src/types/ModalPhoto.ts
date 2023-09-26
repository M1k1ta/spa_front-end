import { FileFromServer } from './FileFromServer';

export interface ModalPhoto {
  photo: File | FileFromServer;
  index: number;
}
