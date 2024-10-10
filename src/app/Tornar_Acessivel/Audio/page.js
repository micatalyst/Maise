'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioFormsReset } from '@/slicers/TempAudioContentSlice';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import Audio_Forms_Step1 from '@/components/Audio/Audio_Forms_Step1';
import Audio_Forms_Step2 from '@/components/Audio/Audio_Forms_Step2';

export default function Audio() {
  const [step, setStep] = useState(1);

  const [original_content_file, setOriginal_content_file] = useState(null);
  const [original_content_PreviewUrl, setOriginal_content_PreviewUrl] = useState('');

  const tempAudioContentSliceData = useSelector((state) => state.TempAudioContentSlice);
  const { name, numMecan } = useSelector((state) => state.userSlice);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAudioFormsReset());
  }, []);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = useCallback(async (e) => {
    e && e.preventDefault(); // Este código é importante para evitar que o utilizador envie o formulário sem querer ao precionar "enter" enquanto prencher algum input dentro do forms.
    console.log(tempAudioContentSliceData);
    console.log(original_content_file);

    try {
      const formData = new FormData();

      // Filtrar só o que interessa enviar (porque o tempAudioContentSliceData tem outras coisas)

      //
      // Step 1
      //
      const fieldsToUploadStep1 = {
        title: tempAudioContentSliceData.title,
        original_content_category: tempAudioContentSliceData.original_content_category,
        original_content_language: tempAudioContentSliceData.original_content_language,
        description: tempAudioContentSliceData.description,
        title: tempAudioContentSliceData.title,
        content_typology: 'Áudio',
        numMecan,
        author: name,
      };

      for (const fieldName in fieldsToUploadStep1) {
        formData.append(fieldName, fieldsToUploadStep1[fieldName]);
      }
      formData.append('file', original_content_file);

      //
      // Step 2
      //
      formData.append('created_content_language', tempAudioContentSliceData.created_content_language);
      tempAudioContentSliceData.sections.forEach((section, index) => {
        formData.append(`sections[${index}].id`, section.id);
        formData.append(`sections[${index}].title`, section.title);
        formData.append(`sections[${index}].description`, section.description);
        formData.append(`sections[${index}].startTime`, section.startTime);
        formData.append(`sections[${index}].endTime`, section.endTime);
        // formData.append(`sectionFiles[${index}]`, sectionAudio.audioFile); // send the file on a separate array, to help multer on backend
      });

      // Debug formData:
      for (let pair of formData.entries()) {
        console.log(`    ${pair[0]}: ${pair[1]}`);
      }

      const url = `${window.location.protocol}//${window.location.hostname}:3001/content`;
      let res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      console.log(res);
      router.push('/');
    } catch (e) {
      console.error('Could not send content:', e);
      toast.error('Sentimos muito, mas houve um erro ao tentar criar o seu conteúdo. Estamos a trabalhar para resolver isso. Por favor, tente novamente mais tarde.', {
        style: {
          background: '#f3b21b',
          color: '#1c1c1c',
          border: 'none',
        },
      });
    }
  });

  return (
    <main className="main">
      <h1>Conteúdo de Áudio</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <Audio_Forms_Step1
            handleNextStep={handleNextStep}
            original_content_file={original_content_file}
            setOriginal_content_file={setOriginal_content_file}
            original_content_PreviewUrl={original_content_PreviewUrl}
            setOriginal_content_PreviewUrl={setOriginal_content_PreviewUrl}
          />
        )}
        {step === 2 && ( // trocar os numeros dos steps novamente (apenas os troquei para facilitar a edição do step 2)
          <Audio_Forms_Step2
            handlePreviousStep={handlePreviousStep}
            handleSubmit={handleSubmit}
            original_content_file={original_content_file}
          />
        )}
      </form>
    </main>
  );
}
