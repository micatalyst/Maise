'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTextFormsReset } from '@/slicers/TempTextContentSlice';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import Text_Forms_Step1 from '@/components/Texto/Text_Forms_Step1';
import Text_Forms_Step2 from '@/components/Texto/Text_Forms_Step2';

export default function Texto() {
  const [step, setStep] = useState(1);

  const [original_content_file, setOriginal_content_file] = useState(null);
  const [original_content_PreviewUrl, setOriginal_content_PreviewUrl] = useState('');

  const [accessibleAudioFiles, setAccessibleAudioFiles] = useState([]);

  const tempTextContentSliceData = useSelector((state) => state.TempTextContentSlice);
  const { name, numMecan } = useSelector((state) => state.userSlice);

  const router = useRouter();
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

  const handleSubmit = useCallback(async (e) => {
    e && e.preventDefault(); // Este código é importante para evitar que o utilizador envie o formulário sem querer ao precionar "enter" enquanto prencher algum input dentro do forms.
    console.log(tempTextContentSliceData);
    console.log(original_content_file);

    console.log(accessibleAudioFiles);

    try {
      const formData = new FormData();

      // Filtrar só o que interessa enviar (porque o tempTextContentSliceData tem outras coisas)

      //
      // Step 1
      //
      const fieldsToUploadStep1 = {
        title: tempTextContentSliceData.title,
        original_content_category: tempTextContentSliceData.original_content_category,
        original_content_language: tempTextContentSliceData.original_content_language,
        description: tempTextContentSliceData.description,
        title: tempTextContentSliceData.title,
        content_typology: 'Texto',
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
      formData.append('created_content_language', tempTextContentSliceData.created_content_language);
      tempTextContentSliceData.sections.forEach((section, index) => {
        const sectionAudio = accessibleAudioFiles.find((audio) => audio.id === section.id);
        formData.append(`sections[${index}].id`, section.id);
        formData.append(`sections[${index}].title`, section.title);
        formData.append(`sectionFiles[${index}]`, sectionAudio.audioFile); // send the file on a separate array, to help multer on backend
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

  const desktopBreakpoint = '(min-width: 1066px)';
  const isMatching = window.matchMedia(desktopBreakpoint).matches;
  const [mediaQueryMatches, setMediaQueryMatches] = useState(isMatching);

  useEffect(() => {
    // Define a função de verificação da media query
    const checkMediaQuery = () => {
      const isMatching = window.matchMedia(desktopBreakpoint).matches;
      setMediaQueryMatches(isMatching);
    };

    // Adiciona um listener de eventos para mudanças na media query
    const mediaQueryList = window.matchMedia(desktopBreakpoint);
    mediaQueryList.addEventListener('change', checkMediaQuery);

    // Limpeza ao desmontar o componente
    return () => mediaQueryList.removeEventListener('change', checkMediaQuery);
  }, []); // Não depende de nada, roda apenas na montagem do componente

  return (
    <main className="main">
      {mediaQueryMatches === undefined ? (
        ''
      ) : mediaQueryMatches ? (
        <>
          <h1>Conteúdo de Texto</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <Text_Forms_Step1
                handleNextStep={handleNextStep}
                original_content_file={original_content_file}
                setOriginal_content_file={setOriginal_content_file}
                original_content_PreviewUrl={original_content_PreviewUrl}
                setOriginal_content_PreviewUrl={setOriginal_content_PreviewUrl}
                setAccessibleAudioFiles={setAccessibleAudioFiles}
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
        </>
      ) : (
        <>
          <h1>Conteúdo de Texto</h1>
          <h3>Pedimos desculpa mas a criação de conteúdos não está disponível para o seu dispositivo</h3>
        </>
      )}
    </main>
  );
}
