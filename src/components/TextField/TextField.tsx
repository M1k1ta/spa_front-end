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
  addAtomicBlock,
  getDefaultKeyBindingFn,
  shortcutHandler,
} from 'contenido';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import LinkIcon from '@mui/icons-material/Link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CodeIcon from '@mui/icons-material/Code';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Input } from '../Input';
import { PhotoList } from '../PhotoList';
import { DocList } from '../DocList';
import { ErrorModal } from '../ErrorModal';
import classNames from 'classnames';

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
  const [isInput, setIsInput] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleAddLink = () => {
    addLink(value, onChange, {
      href: link,
    });
    setIsInput(false);
  };

  const handleRemoveLink = () => {
    removeLink(value, onChange);
    setIsInput(false);
  };

  const handleAddCode = () => {
    addAtomicBlock(value, onChange, 'code');
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

      console.log(file.type, ' ', file.size / 1024);

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
            onMouseDown={(e) => {
              e.preventDefault();
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
            onMouseDown={(e) => {
              e.preventDefault();
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
            onClick={() => setIsInput(!isInput)}
            disabled={value.getSelection().isCollapsed()}
          >
            <LinkIcon />
          </ToggleButton>

          <ToggleButton
            type="button"
            value={false}
            aria-label="code"
            color="primary"
            onClick={handleAddCode}
          >
            <CodeIcon />
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

        {isInput && (
          <div className="text-field__input-box">
            <Input
              name="https://dom.com/link"
              value={link}
              onChange={setLink}
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
            setIsInput(false);
            checkError(value);
          }}
          handleKeyCommand={shortcutHandler(onChange)}
          keyBindingFn={getDefaultKeyBindingFn}
          readOnly={disabled}
        />
      </div>

      <PhotoList photoList={selectedPhotos} onChange={setSelectedPhotos} />

      <DocList docList={selectedFiles} onChange={setSelectedFiles} />

      <ErrorModal error={modalError} onChange={setModalError} />
    </article>
  );
};
