import { DecoratorComponentProps } from 'contenido';
import React from 'react';

export const EditorLink: React.FC<DecoratorComponentProps> = ({ href, children }) => {
  return <a href={href || '/'}>{children}</a>;
};