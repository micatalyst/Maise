'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTextFormsReset } from '@/slicers/TempTextContentSlice';

import Text_Forms_Step1 from '@/components/Texto/Text_Forms_Step1';
import Text_Forms_Step2 from '@/components/Texto/Text_Forms_Step2';

export default function Texto() {
  const [step, setStep] = useState(1);
  const [original_content_file, setOriginal_content_file] = useState(null);
  const [original_content_PreviewUrl, setOriginal_content_PreviewUrl] = useState('');

  const [accessibleAudioFiles, setAccessibleAudioFiles] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // serve para garantir que o dispatch não corre mais vezes quando a página dá render (o upload do file / renderização do componente com as info do file)
    dispatch(setTextFormsReset());
  }, []);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Este código é importante para evitar que o utilizador envie o formulário sem querer ao precionar "enter" enquanto prencher algum input dentro do forms.

    alert('Submit Demo');

    /* const response = await fetch('/api/submitForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Form submitted successfully!');
    } else {
      alert('Failed to submit form');
    } */
  };

  return (
    <main className="main">
      <h1>Conteúdo de Texto</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <Text_Forms_Step1
            handleNextStep={handleNextStep}
            original_content_file={original_content_file}
            setOriginal_content_file={setOriginal_content_file}
            original_content_PreviewUrl={original_content_PreviewUrl}
            setOriginal_content_PreviewUrl={setOriginal_content_PreviewUrl}
          />
        )}
        {step === 2 && ( // trocar os numeros dos steps novamente (apenas os troquei para facilitar a edição do step 2)
          <Text_Forms_Step2
            handlePreviousStep={handlePreviousStep}
            handleSubmit={handleSubmit}
            original_content_file={original_content_file}
            original_content_PreviewUrl={original_content_PreviewUrl}
            accessibleAudioFiles={accessibleAudioFiles}
            setAccessibleAudioFiles={setAccessibleAudioFiles}
          />
        )}
      </form>
    </main>
  );
}
