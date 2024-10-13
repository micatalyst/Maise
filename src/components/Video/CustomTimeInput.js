import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbTack } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useEffect } from 'react';

const CustomTimeInput = ({ label, videoDuration, videoCurrentTime, setStartTimeOnChangeInputValue, setEndTimeOnChangeInputValue }) => {
  const [time, setTime] = useState('');

  const showHours = videoDuration >= 3600; // 3600 seconds = 1 hour

  useEffect(() => {
    // Serve para dar um default value de 00:00 aos inputs
    handleBlur();
  }, []);

  useEffect(() => {
    // Adiciona o listener de eventos de teclado quando o componente é montado
    window.addEventListener('keydown', handleKeyDown);

    // Remove o listener de eventos de teclado quando o componente é desmontado
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoCurrentTime]);

  // Function to format the time in seconds into HH:MM:SS or MM:SS
  const formatTime = (secondsTotal) => {
    const hours = Math.floor(secondsTotal / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = Math.floor(secondsTotal % 60);

    const formattedHours = showHours ? String(hours).padStart(2, '0') : null;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return showHours ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}` : `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleChange = (event) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    // Limit input to 6 digits for HHMMSS or 4 digits for MMSS
    const maxLength = showHours ? 6 : 4;
    if (value.length > maxLength) return;

    // Split the value into hours, minutes, and seconds
    let hours = showHours ? value.slice(0, 2) : '00';
    let minutes = value.slice(showHours ? 2 : 0, showHours ? 4 : 2);
    let seconds = value.slice(showHours ? 4 : 2, showHours ? 6 : 4);

    // Enforce the rules: minutes and seconds must be between 0 and 59
    if (minutes && parseInt(minutes) > 59) {
      minutes = '59';
    }
    if (seconds && parseInt(seconds) > 59) {
      seconds = '59';
    }

    // Rebuild the time string with colons
    if (showHours) {
      if (value.length > 2 && value.length <= 4) {
        value = hours + ':' + minutes;
      } else if (value.length > 4) {
        value = hours + ':' + minutes + ':' + seconds;
      }
    } else {
      if (value.length > 2 && value.length <= 4) {
        value = minutes + ':' + seconds;
      } else if (value.length <= 2) {
        value = minutes;
      }
    }

    if (label === 'Início') {
      setStartTimeOnChangeInputValue(value);
    } else if (label === 'Fim') {
      setEndTimeOnChangeInputValue(value);
    }

    setTime(value);
  };

  const handleBlur = () => {
    // Ensure time is formatted correctly on blur (adding missing parts)
    const parts = time.split(':');
    const formattedTime = showHours
      ? [
          String(parts[0] || '00').padStart(2, '0'), // Hour
          String(parts[1] || '00').padStart(2, '0'), // Minute
          String(parts[2] || '00').padStart(2, '0'), // Second
        ].join(':')
      : [
          String(parts[0] || '00').padStart(2, '0'), // Minute
          String(parts[1] || '00').padStart(2, '0'), // Second
        ].join(':');

    if (label === 'Início') {
      setStartTimeOnChangeInputValue(formattedTime);
    } else if (label === 'Fim') {
      setEndTimeOnChangeInputValue(formattedTime);
    }

    setTime(formattedTime);
  };

  // Function to handle the button click and apply `videoCurrentTime` to the input
  const handleSetCurrentTime = () => {
    setTime(formatTime(videoCurrentTime)); // Set the formatted time to the input

    if (label === 'Início') {
      setStartTimeOnChangeInputValue(formatTime(videoCurrentTime));
    }

    if (label === 'Fim') {
      setEndTimeOnChangeInputValue(formatTime(videoCurrentTime));
    }
  };

  const handleKeyDown = (event) => {
    const activeElement = document.activeElement;

    if (activeElement.tagName.toLowerCase() === 'input' || event.code === 'AltLeft' || event.code === 'AltRight') {
      // o alt serve para prevenir que quando o utilziador faz alt tab a página não atualize ambos os campos de input
      return;
    }

    if (label === 'Início' && event.code === 'KeyA') {
      handleSetCurrentTime();
      setStartTimeOnChangeInputValue(formatTime(videoCurrentTime));
    }

    if (label === 'Fim' && event.code === 'KeyD') {
      handleSetCurrentTime();
      setEndTimeOnChangeInputValue(formatTime(videoCurrentTime));
    }
  };

  const handleAriaLabel = () => {
    switch (label) {
      case 'Início':
        return 'inicial da legenda';
      case 'Fim':
        return 'final da legenda';
    }
  };

  return (
    <div className="input-time-container">
      <label htmlFor={label}>{label}</label>
      <div className="input-time">
        <input
          id={label}
          name={label}
          type="text"
          value={time}
          onChange={handleChange}
          onBlur={handleBlur} // Format the time on blur
          placeholder={showHours ? '00:00:00' : '00:00'}
          size={showHours ? '6' : '3'}
          maxLength={showHours ? 8 : 5} // Set max length based on format
          onFocus={(e) => e.target.select()} // Select input text on focus
        />
        <button
          type="button"
          onClick={handleSetCurrentTime}
          aria-label={`Botão para marcar o tempo ${handleAriaLabel()}`}
        >
          <FontAwesomeIcon icon={faThumbTack} />
        </button>
      </div>
    </div>
  );
};

export default CustomTimeInput;
