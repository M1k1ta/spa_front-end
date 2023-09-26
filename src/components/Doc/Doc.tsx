import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { FileFromServer } from '../../types/FileFromServer';

const shortingName = (value: string) => {
  if (value.length > 15) {
    return value.slice(0, 15) + '...';
  }

  return value;
};

interface Props {
  doc: File | FileFromServer;
  onRemove?: () => void;
}

export const Doc: React.FC<Props> = ({ doc, onRemove }) => {
  return (
    <>
      <div className="doc">
        <div className="doc__icon">
          <img className="doc__img" src="./img/txt.png" alt="file.txt" />
        </div>

        <div className="doc__info">
          <div className="doc__name">{shortingName(doc.name)}</div>
          <div className="doc__type">TXT</div>
        </div>

        {onRemove && (
          <div className="doc__close">
            <IconButton color="inherit" size="small" onClick={onRemove}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>
    </>
  );
};
