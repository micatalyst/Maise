'use client';

import '@/styles/components/Accordion.scss';

import { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import Audio_Forms_Visualiser from '@/components/Audio/Audio_Forms_Visualiser';

export default function Accordion({ type, setAudioCurrentTime, setAudioDuration, globalAudioVolume, textId, textTypeAudioFilePath, title, audioDescription, audioStartTime, audioEndTime }) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const contentRef = useRef(null);

  const handleOpenDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen); // set true if false / set false if true
  };

  const [originalContentFile, setOriginalContentFile] = useState(null);

  useEffect(() => {
    const createBlobFromUrl = async () => {
      if (textTypeAudioFilePath && type === 'Texto') {
        const baseServerUrl = 'http://localhost:3001';
        const fileUrl = `${baseServerUrl}${textTypeAudioFilePath}`;
        if (type === 'Texto') {
          try {
            // Fazendo fetch do arquivo para obter os dados binários
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            const fileName = textTypeAudioFilePath.split('/').pop();

            // Cria um objeto File a partir do Blob, como se fosse o arquivo carregado
            const file = new File([blob], fileName, { type: blob.type });

            // Passa o arquivo para o estado
            setOriginalContentFile(file);
          } catch (error) {
            console.error('Erro ao criar Blob do conteúdo original:', error);
          }
        }
      } else {
        // trigger de feedback a dizer que o documento não está disponível
        /*  toast.error('Sentimos muito, mas houve um erro ao tentar abrir o conteúdo original. Estamos a trabalhar para resolver isso. Por favor, tente novamente mais tarde.', {
          style: {
            background: '#f3b21b',
            color: '#1c1c1c',
            border: 'none',
          },
        }); */
      }
    };

    createBlobFromUrl();
  }, [textTypeAudioFilePath]);

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

          <h3> {title} </h3>
          {type === 'Áudio' && (
            <div className="section-time">
              <p>
                {audioStartTime} - {audioEndTime}
              </p>
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
        {type === 'Áudio' ? (
          audioDescription
        ) : (
          <Audio_Forms_Visualiser
            setAudioCurrentTime={setAudioCurrentTime}
            setAudioDuration={setAudioDuration}
            globalAudioVolume={globalAudioVolume}
            original_content_file={originalContentFile}
          />
        )}
      </div>
    </div>
  );
}
