import React, { useEffect, useState } from 'react';
import { client } from '../../api/client';

interface Props {
  doc: string | null;
  onChange: (value: string | null) => void;
}

export const TxtModal: React.FC<Props> = ({ doc, onChange }) => {
  const [text, setText] = useState('');

  // useEffect(() => [
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     setFileContent(event.target.result as string);
  //   };
  //   reader.readAsText(selectedFile);
  // ], []);

  if (!doc) {
    return <></>;
  }

  const loadText = async () => {
    const { data } = await client.get(doc);

    setText(data);
  };

  useEffect(() => {
    loadText();
  }, []);

  return (
    <div>
      {doc && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => onChange(null)}>
              &times;
            </span>
            <pre>{text}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
