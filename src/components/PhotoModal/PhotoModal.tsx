import React from 'react';
import { ModalPhoto } from '../../types/ModalPhoto';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileFromServer } from '../../types/FileFromServer';

interface Props {
  photo: ModalPhoto;
  photoList: File[] | FileFromServer[];
  onChange: (value: ModalPhoto | null) => void;
}

export const PhotoModal: React.FC<Props> = ({
  photo: data,
  photoList,
  onChange,
}) => {
  const { photo, index } = data;

  return (
    <article className="modal">
      <button
        className="modal__prev"
        onClick={() =>
          onChange({ photo: photoList[index - 1], index: index - 1 })
        }
        disabled={index === 0}
      >
        &#10094;
      </button>

      <img
        src={photo instanceof File ? URL.createObjectURL(photo) : photo.link}
        alt="modal-img"
        className="modal__img"
      />

      <button
        className="modal__next"
        onClick={() =>
          onChange({ photo: photoList[index + 1], index: index + 1 })
        }
        disabled={index === photoList.length - 1}
      >
        &#10095;
      </button>

      <div className="modal__close">
        <IconButton onClick={() => onChange(null)} color="inherit" size="large">
          <CloseIcon />
        </IconButton>
      </div>
    </article>
  );
};
