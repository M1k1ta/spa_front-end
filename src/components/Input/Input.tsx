import classNames from 'classnames';
import React from 'react';

interface Props {
  name: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  checkError?: (value: string) => void;
  disabled?: boolean;
}

export const Input: React.FC<Props> = ({
  name,
  type = 'text',
  value,
  onChange,
  error,
  checkError = () => {
    return;
  },
  disabled = false,
}) => (
  <label className="custom">
    <input
      className={classNames('custom__input', {
        'custom__input--error': error,
      })}
      type={type}
      name={name}
      placeholder={name}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        checkError(event.target.value);
      }}
      disabled={disabled}
    />
    {error && <div className="custom__error">{error}</div>}
  </label>
);
