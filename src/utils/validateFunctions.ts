import { EditorState } from 'draft-js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export const validateUserName = (newUserName: string) => {
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

export const validateEmail = (newEmail: string) => {
  if (!newEmail) {
    return 'Email is required';
  }

  if (!emailRegex.test(newEmail)) {
    return 'Email is not valid';
  }

  return '';
};

export const validateHomePage = (newHomePage: string) => {
  if (!urlRegex.test(newHomePage) && newHomePage) {
    return 'Home page should be URL';
  }

  return '';
};

export const validateLink = (newLink: string) => {
  if (newLink === '') {
    return 'Link is required';
  }

  if (!urlRegex.test(newLink)) {
    return 'Link should be URL';
  }

  return '';
};

export const validateMessage = (newText: EditorState) => {
  const text = newText.getCurrentContent().getPlainText('\u0001');

  if (!text) {
    return 'Message is required';
  }

  if (text.length <= 30) {
    return 'The length of the message must be more than 30 letters';
  }

  return '';
};
