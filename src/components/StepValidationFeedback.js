import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

import '@/styles/components/StepValidationFeedback.scss';

export default function StepValidationFeedback({ title, validation, gridColumns }) {
  return (
    <div className="forms-step-input-feedback">
      <p>{title}</p>
      <div className={`forms-step-input-feedback-container ${gridColumns}`}>
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
