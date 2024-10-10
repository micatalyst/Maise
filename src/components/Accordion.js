'use client';

import '@/styles/components/Accordion.scss';

import { useState, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export default function Accordion({ type }) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const contentRef = useRef(null);

  const handleOpenDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen); // set true if false / set false if true
  };

  return (
    <div className="accordion-container">
      <div className="accordion-header">
        <button
          className={type === 'Áudio' ? 'accordion-dropdown-button audio-time' : 'accordion-dropdown-button'}
          type="button"
          onClick={handleOpenDropDown}
          aria-label="Botão para revelar o conteúdo da section neste accordion"
        >
          {isDropDownOpen ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}

          <h3> Titulo da section </h3>
          {type === 'Áudio' && (
            <div className="section-time">
              <p>00:04 - 00:05</p>
            </div>
          )}
        </button>
      </div>
      <div
        className="accordion-body"
        ref={contentRef}
        style={{
          maxHeight: isDropDownOpen ? `${contentRef.current.scrollHeight + 20}px` : '0px',
          padding: isDropDownOpen ? '0 0 20px' : '0',
        }}
      >
        Prepare-se para mergulhar no mundo vibrante e dinâmico da cultura em 2024! Nosso cartaz cultural deste ano é uma homenagem às inúmeras formas de expressão artística que definem e enriquecem nossas vidas. De eventos de música e dança a exposições de arte, teatro e cinema, este cartaz reúne
        uma seleção diversificada de atividades que vão encantar, inspirar e unir pessoas de todas as idades.
      </div>
    </div>
  );
}
