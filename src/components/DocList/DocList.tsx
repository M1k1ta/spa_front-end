import React from 'react';
import { Doc } from '../Doc/Doc';

interface Props {
  docList: File[];
  onChange: (value: File[]) => void;
  isDisabled: boolean;
}

export const DocList: React.FC<Props> = ({ docList, onChange, isDisabled }) => {
  return (
    <>
      {docList.length > 0 && (
        <article className="file-list">
          {docList.map((doc) => (
            <Doc
              key={doc.lastModified}
              doc={doc}
              onRemove={() => onChange(docList.filter(
                ({ lastModified }) =>
                  lastModified !== doc.lastModified
              ))}
              isDisabled={isDisabled}
            />
          ))}
        </article>
      )}
    </>
  );
};
