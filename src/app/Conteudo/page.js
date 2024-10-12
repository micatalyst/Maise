'use client';

import '@/styles/pages/ContentShowing_Page.scss';

import { useSearchParams } from 'next/navigation';
import { fetchContentById } from '@/slicers/dataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import { toast } from 'sonner';

import { motion } from 'framer-motion';

import Image from 'next/image';
import Content_Showing_Image_AudioDescription from '@/components/Content_Showing_Image_AudioDescription';

import Accordion from '@/components/Accordion';
import Audio_Forms_Visualiser from '@/components/Audio/Audio_Forms_Visualiser';

import Video from 'next-video/player';
import Content_Showing_Video_Subtitles_Section from '@/components/Content_Showing_Video_Subtitles_Section';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faFile } from '@fortawesome/free-solid-svg-icons';

export default function Conteudo() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { currentContent, loading } = useSelector((state) => state.dataSlice); // Chamada da informação da "API" para mostrar o conteúdo

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContentById(id));
  }, []);

  const [originalContentFile, setOriginalContentFile] = useState(null);
  const [originalFileUrl, setOriginalFileUrl] = useState(null);

  // Audio variables

  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const globalAudioVolume = useRef(0.5);

  // Image variables

  const [imageTotalContent, setImageTotalContent] = useState(1);
  const [imageSelectedContent, setImageSelectedContent] = useState(1);

  const [audioFileUrlPath, setAudioFileUrlPath] = useState(null);

  const [imageAltText, setImageAltText] = useState('');

  // Video variables

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [firstPlay, setFirstPlay] = useState(false);
  const videoRef = useRef(null); // Para os controlos do video

  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const [atualVideoSubtitles, setAtualVideoSubtitles] = useState(0);
  const [isSubtitlesOn, setIsSubtitlesOn] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  useEffect(() => {
    const createBlobFromUrl = async () => {
      const baseServerUrl = 'http://localhost:3001';
      if (currentContent && currentContent.originalFilePath && currentContent.content_typology !== 'Imagem') {
        const fileUrl = `${baseServerUrl}${currentContent.originalFilePath}`;
        setOriginalFileUrl(fileUrl);
        if (currentContent.content_typology === 'Áudio') {
          try {
            // Fazendo fetch do arquivo para obter os dados binários
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            const fileName = currentContent.originalFilePath.split('/').pop();

            // Cria um objeto File a partir do Blob, como se fosse o arquivo carregado
            const file = new File([blob], fileName, { type: blob.type });

            // Passa o arquivo para o estado
            setOriginalContentFile(file);
          } catch (error) {
            console.error('Erro ao criar Blob do conteúdo original:', error);
          }
        }
      } else if (currentContent) {
        setImageTotalContent(currentContent.sections.length);

        const fileUrl = `${baseServerUrl}${currentContent.sections[imageSelectedContent - 1].ImageFilePath}`; // imageSelectedContent - 1 (numero do slide ativo - 1 para obter o index)
        setOriginalFileUrl(fileUrl);

        //const audioFileUrlpath = `${baseServerUrl}${currentContent.sections[imageSelectedContent - 1].audioFilePath}`;
        console.log(currentContent.sections[imageSelectedContent - 1].id);
        setAudioFileUrlPath(`${baseServerUrl}${currentContent.sections[imageSelectedContent - 1].audioFilePath}`);

        setImageAltText(currentContent.sections[imageSelectedContent - 1].description);
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
  }, [currentContent, imageSelectedContent]);

  const handleOriginalContentPreview = () => {
    if (originalFileUrl) {
      window.open(originalFileUrl, '_blank');
    }
  };

  // Image

  const handleNextImage = () => {
    if (imageSelectedContent + 1 <= imageTotalContent) {
      console.log('está a aumentar');
      setImageSelectedContent((prevValue) => prevValue + 1);
    }
  };

  const handlePreviousImage = () => {
    if (imageSelectedContent - 1 > 0) {
      console.log('está a diminuir');
      setImageSelectedContent((prevValue) => prevValue - 1);
    }
  };

  // Video

  const convertTimeToSeconds = (time) => {
    const timeParts = time.split(':').map(Number); // Divide o tempo em partes e converte para números
    let seconds = 0;

    if (timeParts.length === 3) {
      // Caso o formato seja "hh:mm:ss"
      const [hours, minutes, secondsPart] = timeParts;
      seconds = hours * 3600 + minutes * 60 + secondsPart;
    } else if (timeParts.length === 2) {
      // Caso o formato seja "mm:ss"
      const [minutes, secondsPart] = timeParts;
      seconds = minutes * 60 + secondsPart;
    }

    return seconds;
  };

  useEffect(() => {
    if (isVideoLoaded) {
      const currentSubtitle = currentContent.videoSubtitles[atualVideoSubtitles].subtitlesCues.find((subtitle) => {
        const startTimeInSeconds = convertTimeToSeconds(subtitle.startTime);
        const endTimeInSeconds = convertTimeToSeconds(subtitle.endTime);
        return videoCurrentTime >= startTimeInSeconds && videoCurrentTime <= endTimeInSeconds; // Verifica se o tempo atual está no intervalo
      });

      if (currentSubtitle && isSubtitlesOn) {
        setCurrentSubtitle(currentSubtitle.text); // Atualiza a legenda exibida
      } else {
        setCurrentSubtitle(''); // Limpa a legenda se não houver nenhuma válida
      }
    }
  }, [videoCurrentTime, isSubtitlesOn, atualVideoSubtitles]); // Atualiza quando as legendas mudam, quando as legendas são ligadas ou desligadas e quando o grupo de legendas muda

  const handleLoadedData = () => {
    // Pause the video once it has loaded data
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    setIsVideoLoaded(true);
  };

  const handlePlay = () => {
    if (!firstPlay) {
      setFirstPlay(true);

      setIsSubtitlesOn(true);
    }
  };

  const handleTimeUpdate = () => {
    setVideoCurrentTime(videoRef.current.currentTime);
  };

  const typeExamples = (type) => {
    switch (type) {
      case 'Texto':
        return (
          <div className="Content-showing-container-audio-text">
            {currentContent.sections.map((item, index) => (
              <Accordion
                type="Texto"
                key={index}
                textId={item.id}
                title={item.title}
                textTypeAudioFilePath={item.audioFilePath}
                setAudioCurrentTime={setAudioCurrentTime}
                setAudioDuration={setAudioDuration}
                globalAudioVolume={globalAudioVolume}
              />
            ))}
          </div>
        );
      case 'Imagem':
        return (
          <div className="Content-showing-container-image">
            <div className="image-preview">
              {currentContent && originalFileUrl && (
                <Image
                  src={originalFileUrl}
                  //priority={true}
                  alt={imageAltText}
                  width={100}
                  height={100}
                  layout="responsive"
                />
              )}
            </div>
            <div className="image-preview-bottom-bar">
              <button
                className="imageSetBtn"
                onClick={handlePreviousImage}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <button
                className="imageSetBtn"
                onClick={handleNextImage}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
              <p className="imagesCountPreview">
                {imageSelectedContent} / {imageTotalContent}
              </p>
              <button
                className="primary-button btnContentPreview"
                type="button"
                onClick={handleOriginalContentPreview}
              >
                Abrir Imagem
              </button>
            </div>
            <div className="image-preview-audio">
              <Content_Showing_Image_AudioDescription
                audioFilePath={audioFileUrlPath}
                setAudioCurrentTime={setAudioCurrentTime}
                setAudioDuration={setAudioDuration}
                globalAudioVolume={globalAudioVolume}
              />
              {/* <Audio_Forms_Visualiser
                setAudioCurrentTime={setAudioCurrentTime}
                setAudioDuration={setAudioDuration}
                globalAudioVolume={globalAudioVolume}
                original_content_file={audioFile}
              /> */}
            </div>
          </div>
        );
      case 'Áudio':
        return (
          <div className="Content-showing-container-audio-text">
            <Audio_Forms_Visualiser
              setAudioCurrentTime={setAudioCurrentTime}
              setAudioDuration={setAudioDuration}
              globalAudioVolume={globalAudioVolume}
              original_content_file={originalContentFile}
            />
            {currentContent.sections.map((item, index) => (
              <Accordion
                type="Áudio"
                key={index}
                title={item.title}
                audioDescription={item.description}
                audioStartTime={item.startTime}
                audioEndTime={item.endTime}
              />
            ))}
          </div>
        );
      case 'Vídeo':
        return (
          <div className="Content-showing-container-video">
            <div className="video-display">
              <Video
                ref={videoRef}
                src={originalFileUrl} // Path to your video file in the public directory
                className="video"
                accentColor="#1167d3"
                onPlay={handlePlay}
                preload="metadata"
                onLoadedData={handleLoadedData}
                //onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                controls
              />
              {isSubtitlesOn && <p className="current-subtitles-showing">{currentSubtitle}</p>}
            </div>
            {currentContent && isVideoLoaded && currentContent.videoSubtitles && (
              <div className="all-subtitles-table">
                <span className="all-subtitles-table-header">Idioma</span>
                <span className="all-subtitles-table-header">Data</span>
                {currentContent.videoSubtitles.map((item, index) => (
                  <Content_Showing_Video_Subtitles_Section
                    key={item.id}
                    index={index}
                    language={item.created_content_language}
                    date={item.date}
                    setAtualVideoSubtitles={setAtualVideoSubtitles}
                    atualVideoSubtitles={atualVideoSubtitles}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <main className="main grid-template-columns-1fr">
      {loading
        ? 'Loading content'
        : currentContent && (
            <div className={currentContent.content_typology === 'Vídeo' ? 'content-showing-container video' : 'content-showing-container'}>
              <div className="original-content-general-info-container">
                <div className="original-content-description-container">
                  <h1>{currentContent.title}</h1>
                  <h3>Descrição</h3>
                  <p>{currentContent.description}</p>
                </div>
                <div className={currentContent.content_typology === 'Imagem' ? 'original-content-general-info-footer image' : 'original-content-general-info-footer'}>
                  <div className="original-content-adicional-info-container">
                    <div>
                      <h3>Conteúdo</h3>
                      <p>{`${currentContent.content_typology} - ${currentContent.original_content_category}`}</p>
                    </div>
                    <div>
                      <h3>Idioma</h3>
                      <p>{currentContent.original_content_language}</p>
                    </div>
                    <div>
                      <h3>Publicado por</h3>
                      <p>{currentContent.author}</p>
                    </div>
                    <div>
                      <h3>Inserido em</h3>
                      <p>{currentContent.publish_date}</p>
                    </div>
                  </div>
                  {currentContent.content_typology !== 'Imagem' && (
                    <div className="original-content-container">
                      <h3>Conteúdo Original</h3>
                      <FontAwesomeIcon icon={faFile} />
                      <button
                        className="primary-button"
                        type="button"
                        onClick={handleOriginalContentPreview}
                      >
                        Abrir / Transferir
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="created-content-visualization-container">{typeExamples(currentContent.content_typology)}</div>
            </div>
          )}
    </main>
  );
}
