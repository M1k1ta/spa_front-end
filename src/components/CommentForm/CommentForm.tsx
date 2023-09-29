import React, { FormEvent, useState } from 'react';
import { EditorState, convertToRaw, CompositeDecorator } from 'draft-js';
import { findEntitiesOfLink } from 'contenido';
import {
  Button,
  CircularProgress,
  circularProgressClasses,
} from '@mui/material';
import { Input } from '../Input';
import { TextField } from '../TextField';
import { saveFiles } from '../../api/files';
import { createMessage } from '../../api/comments';
import ReCaptcha from 'react-google-recaptcha';
import { validateEmail, validateMessage, validateHomePage, validateUserName } from '../../utils/validateFunctions';
import { ErrorModal } from '../ErrorModal';
import { EditorLink } from '../EditorLink';

interface Props {
  relatedId?: number;
  onIsForm?: () => void;
  onLoad: () => void;
}

export const CommentForm: React.FC<Props> = ({
  relatedId = null,
  onIsForm = () => {
    return;
  },
  onLoad,
}) => {
  const decorators = new CompositeDecorator([
    {
      component: EditorLink,
      strategy: findEntitiesOfLink,
    }
  ]);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [homePage, setHomePage] = useState('');
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorators)
  );
  const [errorUserName, setErrorUserName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorHomePage, setErrorHomePage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [captcha, setCaptcha] = useState<ReCaptcha | null>(null);
  const [modalError, setModalError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = {
      userName: validateUserName(userName),
      email: validateEmail(email),
      homePage: validateHomePage(homePage),
      message: validateMessage(editorState),
    };

    if (error.userName || error.email || error.homePage || error.message) {
      setErrorUserName(validateUserName(userName));
      setErrorEmail(validateEmail(email));
      setHomePage(validateHomePage(homePage));
      setErrorMessage(validateMessage(editorState));
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
        photos: data.photos || [],
        docs: data.docs || [],
        relatedId,
      });
    } catch (error) {
      setModalError('Sorry, the message was not sent. Please try again.');
    } finally {
      setIsLoading(false);
    }

    onLoad();
    resetForm();
  };

  const resetForm = () => {
    setIsVerified(false);
    setUserName('');
    setEmail('');
    setHomePage('');
    setSelectedFiles([]);
    setSelectedPhotos([]);
    setEditorState(EditorState.createEmpty());
    onIsForm();

    if (captcha) {
      captcha.reset();
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <Input
        name="User Name"
        value={userName}
        onChange={setUserName}
        error={errorUserName}
        checkError={(value) => setErrorUserName(validateUserName(value))}
        isDisabled={isLoading}
      />

      <Input
        name="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        error={errorEmail}
        checkError={(value) => setErrorEmail(validateEmail(value))}
        isDisabled={isLoading}
      />

      <Input
        name="Home Page"
        value={homePage}
        onChange={setHomePage}
        isDisabled={isLoading}
        error={errorHomePage}
        checkError={(value) => setErrorHomePage(validateHomePage(value))}
      />

      <div>
        <TextField
          value={editorState}
          onChange={setEditorState}
          selectedPhotos={selectedPhotos}
          setSelectedPhotos={setSelectedPhotos}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          error={errorMessage}
          checkError={(value) => setErrorMessage(validateMessage(value))}
          isDisabled={isLoading}
        />
      </div>

      <ReCaptcha
        ref={(e) => setCaptcha(e)}
        sitekey="6Lf2gjUoAAAAAP5gxAR3LNTc2iLyu_w-ddGaWdjX"
        onChange={() => setIsVerified(true)}
        onExpired={() => setIsVerified(false)}
      />

      {!isLoading ? (
        <Button
          className="comment-form__button"
          type="submit"
          variant="contained"
          disabled={!isVerified}
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

      {modalError && (
        <ErrorModal
          error={modalError}
          onChange={setModalError}
        />
      )}
    </form>
  );
};
