import React, { useState, useEffect } from 'react';

const CustomTimeInputModal = ({ label, videoDuration, setStartTimeOnChangeInputValue, setEndTimeOnChangeInputValue, subtitleStartTimeInputValue, subtitleEndTimeInputValue }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    if (label === 'Início') {
      setTime(subtitleStartTimeInputValue);
    }

    if (label === 'Fim') {
      setTime(subtitleEndTimeInputValue);
    }
    console.log('correu uma vez');
  }, [label, subtitleStartTimeInputValue, subtitleEndTimeInputValue]);

  const showHours = videoDuration >= 3600; // 3600 seconds = 1 hour

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
      </div>
    </div>
  );
};

export default CustomTimeInputModal;
