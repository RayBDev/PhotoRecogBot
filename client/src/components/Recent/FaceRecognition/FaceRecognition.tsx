import React from 'react';
import { BoxType, DetectionType } from '../../../App';
import ImageSpinner from '../../UI/ImageSpinner';

type Props = {
  imageUrl: string;
  detectionType: DetectionType;
  box: BoxType;
  isDetecting: boolean;
};

const FaceRecognition = ({
  imageUrl,
  detectionType,
  box,
  isDetecting,
}: Props) => {
  let boxes = box?.map((singleBox, index) => (
    <div
      key={`boxNum ${index}`}
      className="absolute flex flex-wrap cursor-pointer shadow-imageBox shadow-blue-500"
      style={{
        top: singleBox.topRow,
        right: singleBox.rightCol,
        bottom: singleBox.bottomRow,
        left: singleBox.leftCol,
      }}
    >
      {detectionType !== 'face' && (
        <span className="-mt-5 bg-blue-500 text-white h-5 px-1 rounded-t-md text-sm items-start">
          {singleBox.label}
        </span>
      )}
    </div>
  ));
  return (
    <div className="container flex pt-10 pb-20">
      <div className="m-auto">
        <h3 className="mb-5">
          {isDetecting
            ? 'Loading...'
            : detectionType === 'face'
            ? 'Face Detection Results'
            : 'Your Photo Recognition Results'}
        </h3>
        <div className="relative">
          <img
            id="inputimage"
            alt=""
            src={imageUrl}
            width="auto"
            height="700px"
          />
          {isDetecting ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ImageSpinner />
            </div>
          ) : (
            boxes
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
