import React from 'react';
import { Doc } from '../Doc/Doc';

interface Props {
  docList: File[];
  onChange?: (value: File[]) => void;
}

export const DocList: React.FC<Props> = ({ docList, onChange }) => {
  return (
    <>
      {docList.length > 0 && (
        <article className="file-list">
          {docList.map((doc) => (
            <Doc
              key={doc.lastModified}
              doc={doc}
              onRemove={onChange
                ? () => onChange(
                  docList.filter(
                    ({ lastModified }) =>
                      lastModified !== doc.lastModified
                  )
                )
                : undefined
              }
            />
          ))}
        </article>
      )}
    </>
  );
};
