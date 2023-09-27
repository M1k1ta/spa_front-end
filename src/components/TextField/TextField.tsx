import React, { ChangeEvent, useState } from 'react';
import { EditorState } from 'draft-js';
import {
  Editor,
  isBold,
  toggleBold,
  isItalic,
  toggleItalic,
  addLink,
  removeLink,
  getDefaultKeyBindingFn,
  shortcutHandler,
} from 'contenido';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import LinkIcon from '@mui/icons-material/Link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Input } from '../Input';
import { PhotoList } from '../PhotoList';
import { DocList } from '../DocList';
import { ErrorModal } from '../ErrorModal';
import classNames from 'classnames';
import { validateLink } from '../../utils/validateFunctions';

interface Props {
  value: EditorState;
  onChange: (value: EditorState) => void;
  selectedPhotos: File[];
  setSelectedPhotos: (value: File[]) => void;
  selectedFiles: File[];
  setSelectedFiles: (value: File[]) => void;
  error?: string;
  checkError?: (value: EditorState) => void;
  disabled?: boolean;
}

export const TextField: React.FC<Props> = ({
  value,
  onChange,
  selectedPhotos,
  setSelectedPhotos,
  selectedFiles,
  setSelectedFiles,
  error = '',
  checkError = () => { return; },
  disabled = false,
}) => {
  const [link, setLink] = useState('');
  const [isLinkInput, setIsLinkInput] = useState(false);
  const [modalError, setModalError] = useState('');
  const [errorLink, setErrorLink] = useState('');

  const handleAddLink = () => {
    addLink(value, onChange, {
      href: link,
    });
    setIsLinkInput(false);
  };

  const handleRemoveLink = () => {
    removeLink(value, onChange);
    setIsLinkInput(false);
  };

  const handleAddFile = (event: ChangeEvent<HTMLInputElement>) => {
    const newFileList: File[] = Array.from(
      event.target.files ? event.target.files : []
    );

    const photos: File[] = [];
    const docs: File[] = [];
    const lastModifiedList = [...selectedFiles, ...selectedPhotos].map(
      ({ lastModified }) => lastModified
    );
    const listSetLM = new Set(lastModifiedList);

    newFileList.forEach((file) => {
      if (listSetLM.has(file.lastModified)) {
        return;
      }

      if (file.type === 'text/plain') {
        const sizeKB = file.size / 1024;

        sizeKB <= 100
          ? docs.push(file)
          : setModalError('File size exceeds 100KB limit.');
        return;
      }

      photos.push(file);
    });

    setSelectedPhotos([...selectedPhotos, ...photos]);
    setSelectedFiles([...selectedFiles, ...docs]);
  };

  return (
    <article className="text-field">
      <header className="text-field__header">
        <ToggleButtonGroup
          className="text-field__formats"
          value={true}
          aria-label="text formatting"
        >
          <ToggleButton
            className="text-field__button"
            type="button"
            value={isBold(value)}
            aria-label="bold"
            color="primary"
            onClick={() => {
              toggleBold(value, onChange);
            }}
          >
            <FormatBoldIcon />
          </ToggleButton>

          <ToggleButton
            type="button"
            value={isItalic(value)}
            aria-label="italic"
            color="primary"
            onClick={() => {
              toggleItalic(value, onChange);
            }}
          >
            <FormatItalicIcon />
          </ToggleButton>

          <ToggleButton
            type="button"
            value={false}
            aria-label="link"
            color="primary"
            onClick={() => setIsLinkInput(!isLinkInput)}
            disabled={value.getSelection().isCollapsed()}
          >
            <LinkIcon />
          </ToggleButton>

          <ToggleButton value={false}>
            <AttachFileIcon />
            <label className="text-field__label">
              <input
                type="file"
                name="file"
                accept="image/png, image/jpeg, image/gif, text/plain"
                style={{ display: 'none' }}
                onChange={handleAddFile}
                multiple
              />
            </label>
          </ToggleButton>
        </ToggleButtonGroup>

        {isLinkInput && (
          <div className="text-field__input-box">
            <Input
              name="https://dom.com/link"
              value={link}
              onChange={setLink}
              error={errorLink}
              checkError={(value) => setErrorLink(validateLink(value))}
            />

            <IconButton type="button" onClick={handleAddLink}>
              <AddLinkIcon />
            </IconButton>

            <IconButton type="button" onClick={handleRemoveLink}>
              <LinkOffIcon />
            </IconButton>
          </div>
        )}
      </header>

      <div className={classNames({
        'text-field__error-border': error,
      })}>
        {error && (
          <div className='text-field__error'>
            {error}
          </div>
        )}
        <Editor
          editorState={value}
          onChange={(value: EditorState) => {
            onChange(value);
            setIsLinkInput(false);
            checkError(value);
          }}
          handleKeyCommand={shortcutHandler(onChange)}
          keyBindingFn={getDefaultKeyBindingFn}
          readOnly={disabled}
        />
      </div>

      <PhotoList
        photoList={selectedPhotos}
        onChange={setSelectedPhotos}
        disabled={disabled}
      />

      <DocList
        docList={selectedFiles}
        onChange={setSelectedFiles}
        disabled={disabled}
      />

      <ErrorModal
        error={modalError}
        onChange={setModalError}
      />
    </article>
  );
};
