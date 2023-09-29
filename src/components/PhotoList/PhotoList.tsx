import React from 'react';
import { Photo } from '../Photo';

interface Props {
  photoList: File[];
  onChange: (value: File[]) => void;
  isDisabled: boolean;
}

export const PhotoList: React.FC<Props> = ({ photoList, onChange, isDisabled }) => {
  return (
    <>
      {photoList.length > 0 && (
        <article
          className="photo-list"
          style={{ gridTemplateColumns: `repeat(${photoList.length}, 100px)` }}
        >
          {photoList.map((photo, index) => {
            const isLink = typeof photo === 'string';

            return (
              <Photo
                key={isLink ? photo : photo.lastModified}
                index={index}
                photo={photo}
                photoList={photoList}
                onRemove={() => onChange(photoList.filter(
                  ({ lastModified }) =>
                    lastModified !== photo.lastModified
                ))}
                isDisabled={isDisabled}
              />
            );
          })}
        </article>
      )}
    </>
  );
};
