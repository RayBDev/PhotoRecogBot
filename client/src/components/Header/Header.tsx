import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadTrianglesPreset } from 'tsparticles-preset-triangles';
import { Engine, IOptions, RecursivePartial } from 'tsparticles-engine';

import logo from '../../assets/images/logo.png';
import mosaic from '../../assets/images/mosaic.jpg';

import { DetectionType, inputType, RouteType } from '../../App';

const particlesOptions: RecursivePartial<IOptions> = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fullScreen: false,
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: '#ffffff',
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 20,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 2, max: 4 },
    },
  },
  detectRetina: true,
  preset: 'triangles',
};

type PropTypes = {
  onRouteChange: (route: RouteType) => void;
  input: inputType;
  onInputChange: (url?: string, type?: DetectionType) => void;
  onButtonSubmit: () => void;
  inputIsValid: boolean;
};

const ImageLinkForm = ({
  onRouteChange,
  input,
  onInputChange,
  onButtonSubmit,
  inputIsValid,
}: PropTypes) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadTrianglesPreset(engine);
  }, []);

  return (
    <header
      className="w-full relative bg-cover bg-blend-darken h-96"
      style={{ backgroundImage: `url(${mosaic})` }}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-70" />
      <Particles
        id="tsparticles"
        className="absolute top-0 left-0 right-0 bottom-0"
        init={particlesInit}
        options={particlesOptions}
      />

      <div className="container py-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <figure
          className="flex items-center text-center justify-center mb-10 cursor-pointer"
          onClick={() => onRouteChange('home')}
        >
          <img src={logo} alt="RecogBot Logo" className="w-16 h-16 mr-3" />
          <h1 className="text-white">Photo RecogBot</h1>
        </figure>
        <div className="flex flex-wrap sm:flex-nowrap justify-center z-20 mb-2">
          <select
            name="detection-type"
            className="select rounded-bl-md sm:rounded-l-md text-sm order-2 sm:order:1 w-1/2 sm:w-auto"
            id="detection-type"
            onChange={(e) =>
              onInputChange(input.url, e.target.value as DetectionType)
            }
            value={input.type}
          >
            <option value="general">General</option>
            <option value="face">Face</option>
            <option value="apparel">Apparel</option>
          </select>
          <input
            type="text"
            className={`form-input w-full sm:w-128 order-1 sm:order-2 ${
              !inputIsValid && 'border-red-600 text-red-600'
            }`}
            placeholder="Enter an absolute photo URL"
            onChange={(e) => onInputChange(e.target.value, input.type)}
            value={input.url}
          />
          <button
            onClick={onButtonSubmit}
            className="px-5 py-2 bg-blue-900 text-white transition-colors duration-300 focus:outline-none hover:bg-blue-800 rounded-br-md sm:rounded-r-md border-['36b7280'] text-sm font-bold order-3 sm:order:3 w-1/2 sm:w-auto"
          >
            Detect
          </button>
        </div>
        <p className="text-white text-sm">
          Detect items in your photo with our AI Photo Recognition Bot
        </p>
      </div>
    </header>
  );
};

export default ImageLinkForm;
