import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
import axios from 'axios';

import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Header from './components/Header/Header';
import Recent from './components/Recent/Recent';
import Modal from './components/UI/Modal';
import Footer from './components/Footer/Footer';
import './App.css';

export type RouteType = 'signin' | 'signout' | 'home' | 'register';
export type DetectionType = 'general' | 'face' | 'apparel';
export type inputType = {
  type: DetectionType;
  url: string;
};
export type UserType = {
  id: string;
  name: string;
  email: string;
  entries: number;
  created_at: string;
};
export type BoxType =
  | {
      label: string;
      leftCol: number;
      topRow: number;
      rightCol: number;
      bottomRow: number;
    }[]
  | undefined;

const App = () => {
  const [input, setInput] = useState<inputType>({
    type: 'general',
    url: '',
  });
  const [imageURL, setImageURL] = useState('');
  const [detectionType, setDetectionType] = useState<DetectionType>('general');
  const [inputIsValid, setInputIsValid] = useState(true);
  const [showSearchedImage, setShowSearchedImage] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [route, setRoute] = useState<RouteType>('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<UserType>({
    id: '',
    name: '',
    email: '',
    entries: 0,
    created_at: '',
  });
  const [box, setBox] = useState<BoxType>([
    {
      label: '',
      leftCol: 0,
      topRow: 0,
      rightCol: 0,
      bottomRow: 0,
    },
  ]);

  useEffect(() => {
    // const checkTokenExists = Cookies.get('checkToken');
    const checkTokenExists = document.cookie.split('checkToken=')[1];

    if (checkTokenExists) {
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_REMOTE_URL}/api/authToken`,
        withCredentials: true,
      })
        .then((res) => {
          // handle response - if successful, set the state...
          // to persist the user
          setUser({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            entries: res.data.entries,
            created_at: res.data.created_at,
          });
          setIsSignedIn(true);
        })
        .catch((err) => {
          console.log('Error with checkToken', err);
        });
    }
  }, []);

  const loadUser = (data: UserType) => {
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      created_at: data.created_at,
    };

    setUser(userData);
  };

  const calculateFaceLocation = (data: any) => {
    const image = document.getElementById(
      'inputimage'
    ) as HTMLImageElement | null;

    const width = Number(image?.width);
    const height = Number(image?.height);

    return data.outputs[0].data.regions.map((region: any) => {
      return {
        label: region.data.concepts[0].name,
        leftCol: region.region_info.bounding_box.left_col * width,
        topRow: region.region_info.bounding_box.top_row * height,
        rightCol: width - region.region_info.bounding_box.right_col * width,
        bottomRow: height - region.region_info.bounding_box.bottom_row * height,
      };
    });
  };

  const onInputChange = (url?: string, type?: DetectionType) => {
    setInput({
      type: !type ? 'general' : type,
      url: !url ? input.url : url,
    });
  };

  const onButtonSubmit = async () => {
    if (!isSignedIn) {
      onRouteChange('signin');
      return setShowModal(true);
    }

    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    let urlIsValid = urlRegex.test(input.url);

    if (urlIsValid) setInputIsValid(true);
    else return setInputIsValid(false);

    setImageURL(input.url);
    setDetectionType(input.type);
    setShowSearchedImage(true);
    setIsDetecting(true);

    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_REMOTE_URL}/api/imageurl`,
        withCredentials: true,
        data: {
          input,
        },
      });

      if (response) {
        const count = await axios({
          method: 'put',
          url: `${process.env.REACT_APP_REMOTE_URL}/api/image`,
          withCredentials: true,
          data: {
            id: user.id,
            url: input.url,
            type: input.type,
            created_at: new Date().toISOString(),
          },
        });

        setUser({ ...user, entries: count.data.entries });
        setBox(calculateFaceLocation(response.data));
      }
    } catch (err) {
      console.log(err);
      setShowSearchedImage(false);
      setInputIsValid(false);
    }

    setIsDetecting(false);
  };

  const imageClickHandler = async (url: string, type: DetectionType) => {
    if (!isSignedIn) {
      onRouteChange('signin');
      return setShowModal(true);
    }

    setInput({
      type,
      url,
    });

    setInputIsValid(true);
    setImageURL(url);
    setDetectionType(type);
    setShowSearchedImage(true);
    setIsDetecting(true);

    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_REMOTE_URL}/api/imageurl`,
        withCredentials: true,
        data: {
          input: { url, type },
        },
      });

      if (response) {
        const count = await axios({
          method: 'put',
          url: `${process.env.REACT_APP_REMOTE_URL}/api/image`,
          withCredentials: true,
          data: {
            id: user.id,
            url,
            created_at: new Date().toISOString(),
          },
        });

        setUser({ ...user, entries: count.data.entries });
        setBox(calculateFaceLocation(response.data));
      }
    } catch (err) {
      console.log(err);
      setShowSearchedImage(false);
      setInputIsValid(false);
    }

    setIsDetecting(false);
  };

  const onRouteChange = (route: RouteType) => {
    if (route === 'signout') {
      // Delete checkToken Cookie
      document.cookie = `checkToken=; Max-Age=0; path=/; domain=.rbernard.ca`;

      setInput({
        type: 'general',
        url: '',
      });
      setShowSearchedImage(false);
      setBox([
        {
          label: '',
          leftCol: 0,
          topRow: 0,
          rightCol: 0,
          bottomRow: 0,
        },
      ]);
      setRoute('signin');
      setIsSignedIn(false);
      setUser({
        id: '',
        name: '',
        email: '',
        entries: 0,
        created_at: '',
      });
    } else if (route === 'home') {
      setIsSignedIn(true);
      setShowModal(false);
      setShowSearchedImage(false);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <Navigation
        isSignedIn={isSignedIn}
        onRouteChange={onRouteChange}
        onInputChange={onInputChange}
        setShowModal={setShowModal}
        userName={user.name}
        input={input}
        entries={user.entries}
      />
      <Header
        onRouteChange={onRouteChange}
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
        input={input}
        inputIsValid={inputIsValid}
      />
      <Recent
        imageClickHandler={imageClickHandler}
        showSearchedImage={showSearchedImage}
        box={box}
        imageURL={imageURL}
        detectionType={detectionType}
        isDetecting={isDetecting}
        user={user}
      />
      {showModal && (
        <Modal setShowModal={setShowModal}>
          {route === 'signin' && (
            <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
          )}
          {route === 'register' && (
            <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          )}
        </Modal>
      )}
      <Footer />
      {/* {route === 'home' ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <Header
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          {showImage && <FaceRecognition box={box} imageUrl={input} />}
        </div>
      ) : route === 'signin' || route === 'signout' ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )} */}
    </div>
  );
};

export default App;
