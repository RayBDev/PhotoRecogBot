import React, { useState } from 'react';
import { BoxType, DetectionType, UserType } from '../../App';
import FaceRecognition from './FaceRecognition/FaceRecognition';
import Gallery from './Gallery/Gallery';

export type GalleryType = 'all' | 'general' | 'face' | 'apparel';

type Props = {
  imageClickHandler: (url: string, type: DetectionType) => void;
  showSearchedImage: boolean;
  imageURL: string;
  box: BoxType;
  detectionType: DetectionType;
  isDetecting: boolean;
  user: UserType;
};

const Recent = ({
  imageClickHandler,
  showSearchedImage,
  imageURL,
  box,
  detectionType,
  isDetecting,
  user,
}: Props) => {
  const [galleryType, setGalleryType] = useState<GalleryType>('all');

  return (
    <section id="recent" className="pt-10 pb-20">
      {!showSearchedImage ? (
        <div className="container">
          <ul className="flex justify-center mb-16">
            <li className="mr-5">
              <button
                className={
                  galleryType === 'all' ? 'border-b-2 border-slate-500' : ''
                }
                onClick={() => setGalleryType('all')}
              >
                All
              </button>
            </li>
            <li className="mr-5">
              <button
                className={
                  galleryType === 'general' ? 'border-b-2 border-slate-500' : ''
                }
                onClick={() => setGalleryType('general')}
              >
                General
              </button>
            </li>
            <li className="mr-5">
              <button
                className={
                  galleryType === 'face' ? 'border-b-2 border-slate-500' : ''
                }
                onClick={() => setGalleryType('face')}
              >
                Face
              </button>
            </li>
            <li className="">
              <button
                className={
                  galleryType === 'apparel' ? 'border-b-2 border-slate-500' : ''
                }
                onClick={() => setGalleryType('apparel')}
              >
                Apparel
              </button>
            </li>
          </ul>
          <h3 className="text-left mb-5">Recently Detected</h3>
          <Gallery
            user={user}
            imageClickHandler={imageClickHandler}
            galleryType={galleryType}
          />
        </div>
      ) : (
        <>
          <FaceRecognition
            imageUrl={imageURL}
            box={box}
            detectionType={detectionType}
            isDetecting={isDetecting}
          />
          <div className="container">
            <h3 className="text-left mb-5">Recently Detected</h3>
            <Gallery
              limited={true}
              user={user}
              imageQty={7}
              imageClickHandler={imageClickHandler}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default Recent;
