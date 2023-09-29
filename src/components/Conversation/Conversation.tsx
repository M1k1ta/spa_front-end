import React from 'react';
import { Message } from '../../types/Message';
import { CompositeDecorator, Editor, EditorState, convertFromRaw } from 'draft-js';
import { formatDateToCustom } from '../../utils/formatDateToCustom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OpenInNewOffIcon from '@mui/icons-material/OpenInNewOff';
import { IconButton } from '@mui/material';
import { CommentForm } from '../CommentForm';
import { Photo } from '../Photo';
import { Doc } from '../Doc';
import { findEntitiesOfLink } from 'contenido';
import { EditorLink } from '../EditorLink';

interface Props {
  message: Message;
  currentFormId: number;
  onSetCurrentFormId: (value: number) => void;
  onLoad: () => void;
}

export const Conversation: React.FC<Props> = ({
  message,
  currentFormId,
  onSetCurrentFormId,
  onLoad,
}) => {
  const decorators = new CompositeDecorator([
    {
      component: EditorLink,
      strategy: findEntitiesOfLink,
    }
  ]);

  const contentState = convertFromRaw(JSON.parse(message.editorState));
  const editorState = EditorState.createWithContent(contentState, decorators);

  const fakeSetState = () => {
    return;
  };

  return (
    <article className="message">
      <header className="message__header">
        <section className="message__header--section">
          <img className="message__img" src="./img/boy.jpg" alt="img boy" />
          <div className="message__name">{message.userName}</div>
          <div className="message__date">
            {formatDateToCustom(message.createdAt)}
          </div>
        </section>
        {currentFormId === message.id ? (
          <IconButton
            type="button"
            color="primary"
            onClick={() => onSetCurrentFormId(0)}
          >
            <OpenInNewOffIcon />
          </IconButton>
        ) : (
          <IconButton
            type="button"
            color="primary"
            onClick={() => onSetCurrentFormId(message.id)}
          >
            <OpenInNewIcon />
          </IconButton>
        )}
      </header>

      <div className="message__text">
        <Editor
          editorState={editorState}
          onChange={fakeSetState}
          readOnly={true}
        />
      </div>

      <div className="message__files">
        <div className="message__photos">
          {message.photos.map((photo, index) => (
            <Photo
              key={photo.id}
              index={index}
              photo={photo}
              photoList={message.photos}
            />
          ))}
        </div>

        <div className="message__docs">
          {message.docs.map((doc) => (
            <Doc
              key={doc.id}
              doc={doc}
            />
          ))}
        </div>
      </div>

      <div className='message__line'></div>

      {!!message.messages.length &&
        message.messages.map((message) => (
          <div className="message__box" key={message.id}>
            <Conversation
              message={message}
              currentFormId={currentFormId}
              onSetCurrentFormId={onSetCurrentFormId}
              onLoad={onLoad}
            />
          </div>
        ))}

      {currentFormId === message.id && (
        <div className="message__box">
          <CommentForm
            relatedId={message.id}
            onSetIsForm={() => onSetCurrentFormId(0)}
            onLoad={onLoad}
          />
        </div>
      )}
    </article>
  );
};
