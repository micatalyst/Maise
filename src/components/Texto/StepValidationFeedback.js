import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

import '@/styles/components/Forms_Step1.scss';

export default function StepValidationFeedback({ title, validation }) {
  return (
    <div className="forms-step1-input-feedback">
      <p>{title}</p>
      <div
        style={{
          gridTemplateColumns: `repeat(${validation.length}, max-content)`,
        }}
        className="forms-step1-input-feedback-container"
      >
        {validation.map((valObj, index) => (
          <div
            key={index}
            className={valObj.isValid ? 'valid' : ''}
          >
            {valObj.isValid ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
            <span>{valObj.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
