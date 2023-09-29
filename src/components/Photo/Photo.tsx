import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { PhotoModal } from '../PhotoModal';
import { ModalPhoto } from '../../types/ModalPhoto';
import { FileFromServer } from '../../types/FileFromServer';

interface Props {
  index: number;
  photo: File | FileFromServer;
  photoList: File[] | FileFromServer[];
  onRemove?: () => void;
  isDisabled?: boolean;
}

export const Photo: React.FC<Props> = ({
  index,
  photo,
  photoList,
  onRemove,
  isDisabled = false,
}) => {
  const [modalPhoto, setModalPhoto] = useState<ModalPhoto | null>(null);

  return (
    <>
      <div className="photo" onClick={() => setModalPhoto({ photo, index })}>
        <img
          className="photo__img"
          alt="not found"
          src={photo instanceof File ? URL.createObjectURL(photo) : photo.link}
        />

        {(onRemove && !isDisabled) && (
          <div className="photo__close">
            <IconButton color="inherit" size="small" onClick={onRemove}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>

      {modalPhoto && (
        <PhotoModal
          photo={modalPhoto}
          photoList={photoList}
          onChange={setModalPhoto}
        />
      )}
    </>
  );
};
