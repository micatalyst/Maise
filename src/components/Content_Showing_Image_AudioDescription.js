'use client';

import { useState, useEffect } from 'react';

import Audio_Forms_Visualiser from '@/components/Audio/Audio_Forms_Visualiser';

export default function Content_Showing_Image_AudioDescription({ audioFilePath, setAudioCurrentTime, setAudioDuration, globalAudioVolume }) {
  const [contentFile, setContentFile] = useState(null);

  useEffect(() => {
    const createBlobFromUrl = async () => {
      if (audioFilePath) {
        try {
          // Fazendo fetch do arquivo para obter os dados binários
          const response = await fetch(audioFilePath);
          const blob = await response.blob();

          const fileName = audioFilePath.split('/').pop();

          // Cria um objeto File a partir do Blob, como se fosse o arquivo carregado
          const file = new File([blob], fileName, { type: blob.type });

          // Passa o arquivo para o estado
          setContentFile(file);
        } catch (error) {
          console.error('Erro ao criar Blob do conteúdo original:', error);
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
  }, [audioFilePath]);

  return (
    <Audio_Forms_Visualiser
      setAudioCurrentTime={setAudioCurrentTime}
      setAudioDuration={setAudioDuration}
      globalAudioVolume={globalAudioVolume}
      original_content_file={contentFile}
    />
  );
}
