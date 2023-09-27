import React, { FormEvent, useState } from 'react';
import { EditorState, convertToRaw, CompositeDecorator } from 'draft-js';
import { DecoratorComponentProps, findEntitiesOfLink } from 'contenido';
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
  const [errorHomePage, setErrorHomePage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [captcha, setCaptcha] = useState<ReCaptcha | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = {
      userName: validateUserName(userName),
      email: validateEmail(email),
      homePage: validateUrl(homePage),
      message: validateMessage(editorState),
    };

    if (error.userName || error.email || error.homePage || error.message) {
      setErrorUserName(validateUserName(userName));
      setErrorEmail(validateEmail(email));
      setHomePage(validateUrl(homePage));
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

    if (captcha) {
      captcha.reset();
    }
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

  const validateUrl = (newUrl: string) => {
    const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    if (!urlRegex.test(newUrl) && newUrl) {
      return 'Home page should be URL';
    }

    return '';
  };

  const validateMessage = (newText: EditorState) => {
    const text = newText.getCurrentContent().getPlainText('\u0001');
    if (!text) {
      return 'Message is required';
    }

    if (text.length <= 30) {
      return 'The length of the message must be more than 30 letters';
    }

    return '';
  };

  return (
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
        error={errorHomePage}
        checkError={(value) => setErrorHomePage(validateUrl(value))}
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
          disabled={isLoading}
        />
      </div>

      <ReCaptcha
        ref={(e) => setCaptcha(e)}
        sitekey="6Lf2gjUoAAAAAP5gxAR3LNTc2iLyu_w-ddGaWdjX"
        onChange={() => setVerified(true)}
        onExpired={() => setVerified(false)}
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
  );
};
