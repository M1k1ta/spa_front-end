import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  error: string;
  onChange: (value: string) => void;
}

export const ErrorModal: React.FC<Props> = ({ error, onChange }) => {
  if (error === '') {
    return <></>;
  }

  return (
    <article className="error-modal">
      <div className="error-modal__content">
        {error}
        <div className="error-modal__close">
          <IconButton onClick={() => onChange('')}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </article>
  );
};
