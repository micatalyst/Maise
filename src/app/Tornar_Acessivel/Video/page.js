'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoFormsReset } from '@/slicers/TempVideoContentSlice';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import Video_Forms_Step1 from '@/components/Video/Video_Forms_Step1';
import Video_Forms_Step2 from '@/components/Video/Video_Forms_Step2';

export default function Video() {
  const [step, setStep] = useState(1);

  const [original_content_file, setOriginal_content_file] = useState(null);
  const [original_content_PreviewUrl, setOriginal_content_PreviewUrl] = useState('');

  /* const [accessibleAudioFiles, setAccessibleAudioFiles] = useState([]); */

  const tempVideoContentSliceData = useSelector((state) => state.TempVideoContentSlice);
  const { name, numMecan } = useSelector((state) => state.userSlice);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setVideoFormsReset());
  }, []);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = useCallback(async (e) => {
    e && e.preventDefault(); // Este código é importante para evitar que o utilizador envie o formulário sem querer ao precionar "enter" enquanto prencher algum input dentro do forms.
    console.log(tempVideoContentSliceData);
    console.log(original_content_file);

    // console.log(accessibleAudioFiles);

    try {
      const formData = new FormData();

      // Filtrar só o que interessa enviar (porque o tempVideoContentSliceData tem outras coisas)

      //
      // Step 1
      //
      const fieldsToUploadStep1 = {
        title: tempVideoContentSliceData.title,
        original_content_category: tempVideoContentSliceData.original_content_category,
        original_content_language: tempVideoContentSliceData.original_content_language,
        description: tempVideoContentSliceData.description,
        title: tempVideoContentSliceData.title,
        content_typology: 'Vídeo',
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
      // formData.append('created_content_language', tempVideoContentSliceData.created_content_language);
      tempVideoContentSliceData.videoSubtitles.forEach((videoSubtitle, index) => {
        formData.append(`videoSubtitles[${index}].id`, videoSubtitle.id);
        formData.append(`videoSubtitles[${index}].created_content_language`, videoSubtitle.language);
        formData.append(`videoSubtitles[${index}].date`, videoSubtitle.date);
        //formData.append(`videoSubtitles[${index}].subtitlesCues`, JSON.stringify(videoSubtitle.subtitlesCues));
        videoSubtitle.subtitlesCues.forEach((cue, cueIndex) => {
          formData.append(`videoSubtitles[${index}].subtitlesCues[${cueIndex}].id`, cue.id);
          formData.append(`videoSubtitles[${index}].subtitlesCues[${cueIndex}].startTime`, cue.startTime);
          formData.append(`videoSubtitles[${index}].subtitlesCues[${cueIndex}].endTime`, cue.endTime);
          formData.append(`videoSubtitles[${index}].subtitlesCues[${cueIndex}].text`, cue.text);
        });
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
          <h1>Conteúdo de Vídeo</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <Video_Forms_Step1
                handleNextStep={handleNextStep}
                original_content_file={original_content_file}
                setOriginal_content_file={setOriginal_content_file}
                original_content_PreviewUrl={original_content_PreviewUrl}
                setOriginal_content_PreviewUrl={setOriginal_content_PreviewUrl}
              />
            )}
            {step === 2 && ( // trocar os numeros dos steps novamente (apenas os troquei para facilitar a edição do step 2)
              <Video_Forms_Step2
                handlePreviousStep={handlePreviousStep}
                handleSubmit={handleSubmit}
                original_content_file={original_content_file}
                original_content_PreviewUrl={original_content_PreviewUrl}
              />
            )}
          </form>
        </>
      ) : (
        <>
          <h1>Conteúdo de Vídeo</h1>
          <h3>Pedimos desculpa mas a criação de conteúdos não está disponível para o seu dispositivo</h3>
        </>
      )}
    </main>
  );
}
