import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DetectionType, UserType } from '../../../App';
import { GalleryType } from '../Recent';

import './Gallery.css';

type PropTypes = {
  imageClickHandler: (url: string, type: DetectionType) => void;
  limited?: boolean;
  imageQty?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  user: UserType;
  galleryType?: GalleryType;
};

type ImageUrlArrayType = {
  url: string;
  type: DetectionType;
}[];

const Gallery = ({
  limited = false,
  imageQty = 9,
  user,
  imageClickHandler,
  galleryType = 'all',
}: PropTypes) => {
  const [imageUrlArray, setImageUrlArray] = useState<ImageUrlArrayType>([
    { url: '', type: 'general' },
  ]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_REMOTE_URL}/api/images/${imageQty}/${galleryType}`,
      withCredentials: true,
    })
      .then((imageUrls) => {
        setImageUrlArray(imageUrls.data);
      })
      .catch((err) => console.log('A server error has occurred'));
  }, [imageQty, user.entries, galleryType]);

  let allGalleryImages = imageUrlArray.map((urlObject, index) => (
    <figure
      key={`galleryImage${index + 1}`}
      className={`gallery__item gallery__item--${index + 1}`}
    >
      <img
        src={urlObject.url}
        alt={`Gallery Entry ${index + 1}`}
        className="gallery__img cursor-pointer"
        onClick={() => imageClickHandler(urlObject.url, urlObject.type)}
      />
    </figure>
  ));

  let limitedGalleryImages = imageUrlArray.map((urlObject, index) => (
    <figure
      key={`limitedGalleryImage${index + 1}`}
      className={`gallery__item gallery__item__limited--${index + 1}`}
    >
      <img
        src={urlObject.url}
        alt={`Gallery Entry ${index + 1}`}
        className="gallery__img cursor-pointer"
        onClick={() => imageClickHandler(urlObject.url, urlObject.type)}
      />
    </figure>
  ));

  return (
    <section className={limited ? 'gallery__limited' : 'gallery'}>
      {limited ? limitedGalleryImages : allGalleryImages}
    </section>
  );
};

export default Gallery;
