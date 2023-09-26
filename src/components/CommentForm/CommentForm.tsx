import React, { FormEvent, useState } from 'react';
import { EditorState, convertToRaw, CompositeDecorator } from 'draft-js';
import { DecoratorComponentProps, findEntitiesOfLink } from 'contenido';
import Reaptcha from 'reaptcha';
import {
  Button,
  CircularProgress,
  circularProgressClasses,
} from '@mui/material';
import { Input } from '../Input';
import { TextField } from '../TextField';
import { saveFiles } from '../../api/files';
import { createMessage } from '../../api/comments';

interface Props {
  relatedId?: number;
  onSetIsForm?: () => void;
  onLoad: () => void;
}

const EditorLink: React.FC<DecoratorComponentProps> = (props) => {
  return <a href={props.href || '/'}>{props.children}</a>;
};

export const CommentForm: React.FC<Props> = ({
  relatedId = null,
  onSetIsForm = () => {
    return;
  },
  onLoad,
}) => {
  const decorators = new CompositeDecorator([
    {
      component: EditorLink,
      strategy: findEntitiesOfLink,
    },
  ]);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [homePage, setHomePage] = useState('');
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorators)
  );
  const [errorUserName, setErrorUserName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState<Reaptcha | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorUserName(validateUserName(userName));
    setErrorEmail(validateEmail(email));

    if (errorUserName || errorEmail) {
      return;
    }

    setIsLoading(true);

    const editorStateJSON = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    try {
      const { data } = await saveFiles([...selectedPhotos, ...selectedFiles]);

      await createMessage({
        userName,
        email,
        homePage,
        editorState: editorStateJSON,
        photos: data.photosLinks || [],
        docs: data.docsLinks || [],
        relatedId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    onLoad();
    setVerified(false);
    setUserName('');
    setEmail('');
    setHomePage('');
    setSelectedFiles([]);
    setSelectedPhotos([]);
    setEditorState(EditorState.createEmpty());
    onSetIsForm();

    if (!captcha) {
      return;
    }

    captcha.reset();
  };

  const validateUserName = (newUserName: string) => {
    if (newUserName === '') {
      return 'User Name is required';
    }

    if (newUserName.length <= 3) {
      return 'User Name length should be greater';
    }

    if (newUserName[0] !== newUserName[0].toUpperCase()) {
      return 'User Name should begin with a capital letter';
    }

    return '';
  };

  const validateEmail = (newEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newEmail) {
      return 'Email is required';
    }

    if (!emailRegex.test(newEmail)) {
      return 'Email is not valid';
    }

    return '';
  };

  return (
    <>
      <form className="comment-form" onSubmit={handleSubmit}>
        <Input
          name="User Name"
          value={userName}
          onChange={setUserName}
          error={errorUserName}
          checkError={(value) => setErrorUserName(validateUserName(value))}
          disabled={isLoading}
        />

        <Input
          name="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          error={errorEmail}
          checkError={(value) => setErrorEmail(validateEmail(value))}
          disabled={isLoading}
        />

        <Input
          name="Home Page"
          value={homePage}
          onChange={setHomePage}
          disabled={isLoading}
        />

        <div>
          <TextField
            value={editorState}
            onChange={setEditorState}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            disabled={isLoading}
          />
        </div>

        <Reaptcha
          id={`${Math.random()}`}
          ref={(e) => setCaptcha(e)}
          sitekey="6Lf2gjUoAAAAAP5gxAR3LNTc2iLyu_w-ddGaWdjX"
          onVerify={() => setVerified(true)}
          onExpire={() => setVerified(false)}
        />

        {!isLoading ? (
          <Button
            className="comment-form__button"
            type="submit"
            variant="contained"
            disabled={!verified}
          >
            Send
          </Button>
        ) : (
          <Button className="comment-form__button" variant="contained" disabled>
            <CircularProgress
              variant="indeterminate"
              disableShrink
              sx={{
                color: '#cccccc',
                animationDuration: '550ms',
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'round',
                },
              }}
              size={30}
              thickness={3}
            />
          </Button>
        )}
      </form>
    </>
  );
};
