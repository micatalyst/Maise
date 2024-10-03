import '@/styles/components/Forms_Video_Step2.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown, faFileArrowUp, faFilePen, faTrashCan, faPlay, faPause, faStop, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import Horizontal_Tab_Video_Forms from '@/components/Horizontal_Tab_Video_Forms';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSubtitleCreatedLanguage, addVideoSubtitle, addVideoSubtitleCue, selectActiveSubtitle, selectActiveSubtitleCues } from '@/slicers/TempVideoContentSlice';

import Video from 'next-video/player';
import CustomTimeInput from '@/components/Video/CustomTimeInput';

import Video_Subtitles_Section from '@/components/Video/Video_Subtitles_Section';
import Video_SubtitleCues_Section from '@/components/Video/Video_SubtitleCues_Section';

import Modal_Video_forms from '@/components/Video/Modal_Video_forms';
import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Video_Forms_Step2({ handlePreviousStep, handleSubmit, original_content_file, original_content_PreviewUrl, accessibleAudioFiles, setAccessibleAudioFiles }) {
  const subtitle_created_language = useSelector((state) => state.TempVideoContentSlice.subtitle_created_language);

  const videoSubtitles = useSelector((state) => state.TempVideoContentSlice.videoSubtitles);

  const videoSubtitleObj = useSelector(selectActiveSubtitle);

  const dispatch = useDispatch();

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isEditingCreatingSubtitleCues, setIsEditingCreatingSubtitleCues] = useState(false);

  const [subtitleTextOnChangeInputValue, setSubtitleTextOnChangeInputValue] = useState(''); // value do input do texto das legenda
  const [startTimeOnChangeInputValue, setStartTimeOnChangeInputValue] = useState(''); // value do input do tempo inicial das legenda
  const [endTimeOnChangeInputValue, setEndTimeOnChangeInputValue] = useState(''); // value do input do tempo final das legenda

  const [filterTab, setFilterTab] = useState('Legendas');

  const [handleAddSubtitleId, setHandleAddSubtitleId] = useState(2);
  const [handleAddSubtitleCueId, setHandleAddSubtitleCueId] = useState(2);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const [currentSubtitle, setCurrentSubtitle] = useState('');

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

  // Função para verificar sobreposição de tempos
  const isTimeOverlapping = (newStartTime, newEndTime, subtitlesCues) => {
    const newStartInSeconds = convertTimeToSeconds(newStartTime);
    const newEndInSeconds = convertTimeToSeconds(newEndTime);

    // Verificar se o startTime é maior que o endTime
    if (newStartInSeconds > newEndInSeconds) {
      alert('O tempo de início não pode ser maior que o tempo de término.');
      return true; // Bloqueia a criação
    }

    // Verificar sobreposição de tempos com as legendas existentes
    const isOverlapping = subtitlesCues.some((cue) => {
      const cueStartInSeconds = convertTimeToSeconds(cue.startTime);
      const cueEndInSeconds = convertTimeToSeconds(cue.endTime);

      return (newStartInSeconds >= cueStartInSeconds && newStartInSeconds < cueEndInSeconds) || (newEndInSeconds > cueStartInSeconds && newEndInSeconds <= cueEndInSeconds) || (newStartInSeconds <= cueStartInSeconds && newEndInSeconds >= cueEndInSeconds);
    });

    if (isOverlapping) {
      alert('O intervalo de tempo sobrepõe-se a uma legenda existente. Por favor, ajuste o tempo.');
    }

    return isOverlapping;
  };

  useEffect(() => {
    if (isEditingCreatingSubtitleCues) {
      const currentSubtitle = videoSubtitleObj.subtitlesCues.find((subtitle) => {
        const startTimeInSeconds = convertTimeToSeconds(subtitle.startTime);
        const endTimeInSeconds = convertTimeToSeconds(subtitle.endTime);
        return videoCurrentTime >= startTimeInSeconds && videoCurrentTime <= endTimeInSeconds; // Verifica se o tempo atual está no intervalo
      });

      if (currentSubtitle && currentSubtitle.haveTextValue) {
        setCurrentSubtitle(currentSubtitle.text); // Atualiza a legenda exibida
      } else {
        setCurrentSubtitle(''); // Limpa a legenda se não houver nenhuma válida
      }
    }
  }, [videoCurrentTime, isEditingCreatingSubtitleCues]); // Recalcular sempre que o tempo atual mudar

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);
  useEffect(() => {
    setStepValidations([
      {
        title: 'Criar pelo menos um grupo de legendas',
        isValid: videoSubtitles.length > 0,
      },
    ]);
  }, [videoSubtitles]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // Save current audio time for each section, to allow switching between them and restore the previous time

  const videoRef = useRef(null); // Para os controlos do video

  const handleLoadedData = () => {
    setIsVideoLoaded(true);

    // Pause the video once it has loaded data
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  // Modal

  const openModal = (modal) => {
    setModalType(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para adicionar legendas (pelo botão)

  const handleAddSubtitle = () => {
    if (subtitle_created_language) {
      const dateFormatter = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

      dispatch(
        addVideoSubtitle({
          id: videoSubtitles.length > 0 ? handleAddSubtitleId : 1,
          language: subtitle_created_language,
          date: dateFormatter.format(new Date()),
          subtitlesCues: [],
        }),
      );
      if (videoSubtitles.length) {
        setHandleAddSubtitleId((previousValue) => previousValue + 1);
      } else {
        setHandleAddSubtitleId(2);
      }

      dispatch(setSubtitleCreatedLanguage(''));
    }
  };

  const handleAddSubtitleCues = () => {
    if (startTimeOnChangeInputValue && endTimeOnChangeInputValue) {
      // Verificar se o tempo da nova legenda sobrepõe um já existente
      if (isTimeOverlapping(startTimeOnChangeInputValue, endTimeOnChangeInputValue, videoSubtitleObj.subtitlesCues)) {
        return; // Bloqueia a criação da legenda
      }

      dispatch(
        addVideoSubtitleCue({
          id: videoSubtitleObj.subtitlesCues.length > 0 ? handleAddSubtitleCueId : 1,
          startTime: startTimeOnChangeInputValue,
          endTime: endTimeOnChangeInputValue,
          text: subtitleTextOnChangeInputValue ? subtitleTextOnChangeInputValue : 'Preencha a legenda...',
          haveTextValue: subtitleTextOnChangeInputValue ? true : false,
        }),
      );

      if (videoSubtitleObj.subtitlesCues.length) {
        setHandleAddSubtitleCueId((previousValue) => previousValue + 1);
      } else {
        setHandleAddSubtitleCueId(2);
      }

      setSubtitleTextOnChangeInputValue('');
    }
  };

  /* const handleKeyDownAddSubtitleCues = (event) => {
    if (event.code === 'Enter') {
      console.log('entrou enter');
      handleAddSubtitleCues();
    }
  }; */

  const handleTab = (activeTab) => {
    setFilterTab(activeTab);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration); // Define a duração total do vídeo
    }
  };

  const handleTimeUpdate = () => {
    setVideoCurrentTime(videoRef.current.currentTime);
  };

  const videoDisplay = (
    <div className="video-display">
      <Video
        ref={videoRef}
        src={original_content_PreviewUrl} // Path to your video file in the public directory
        className="video"
        accentColor="#1167d3"
        autoPlay
        preload="metadata"
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        controls
      />
      {isEditingCreatingSubtitleCues ? <p className="current-subtitles-showing">{currentSubtitle}</p> : ''}
    </div>
  );

  const AllSubtitlesTable = (
    <div className="all-subtitles-table">
      <span className="all-subtitles-table-header">Idioma</span>
      <span className="all-subtitles-table-header">Data</span>
      {videoSubtitles &&
        videoSubtitles.map((item) => (
          <Video_Subtitles_Section
            key={item.id}
            id={item.id}
            language={item.language}
            date={item.date}
            setIsEditingCreatingSubtitleCues={setIsEditingCreatingSubtitleCues}
            openModal={openModal}
          />
        ))}
    </div>
  );

  const SubtitleCuesTable = (
    <div className="subtitles-cues-table">
      <span className="subtitles-cues-table-header">Legenda</span>
      <span className="subtitles-cues-table-header">Início</span>
      <span className="subtitles-cues-table-header">Fim</span>
      {isEditingCreatingSubtitleCues &&
        videoSubtitleObj.subtitlesCues.length > 0 &&
        videoSubtitleObj.subtitlesCues
          .slice() // Cria uma cópia do array para não modificar o original
          .sort((a, b) => convertTimeToSeconds(a.startTime) - convertTimeToSeconds(b.startTime)) // Ordena por startTime
          .map((item) => (
            <Video_SubtitleCues_Section
              key={item.id}
              id={item.id}
              startTime={item.startTime}
              endTime={item.endTime}
              text={item.text}
              openModal={openModal}
            />
          ))}
    </div>
  );

  const allSubtitlesDisplay = (
    <div className="all-subtitles-display">
      <div className="language-set-subtitles-creation">
        <div className="language-container">
          <label htmlFor="subtitle_created_language">Idioma</label>
          <div className="forms-select">
            <FontAwesomeIcon icon={faCaretDown} />
            <select
              id="subtitle_created_language"
              name="subtitle_created_language"
              value={subtitle_created_language}
              onChange={(e) => dispatch(setSubtitleCreatedLanguage(e.target.value))}
            >
              <option
                value=""
                disabled
              >
                Idioma da legenda...
              </option>
              <option value="Português">Português</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={handleAddSubtitle}
        >
          Criar legendas
        </button>
      </div>
      {AllSubtitlesTable}
    </div>
  );

  const subtitleCuesCreationDisplay = (
    <div className="subtitle-cues-creation-display">
      <div className="subtitle-cues-input-creation">
        <input
          id="subtitle"
          type="text"
          className="subtitle"
          placeholder="Adicionar legenda..."
          maxLength="80"
          value={subtitleTextOnChangeInputValue}
          onChange={(e) => setSubtitleTextOnChangeInputValue(e.target.value)}
        />
        <CustomTimeInput
          label="Início"
          videoCurrentTime={videoCurrentTime}
          videoDuration={videoDuration}
          setStartTimeOnChangeInputValue={setStartTimeOnChangeInputValue}
        />
        <CustomTimeInput
          label="Fim"
          videoCurrentTime={videoCurrentTime}
          videoDuration={videoDuration}
          setEndTimeOnChangeInputValue={setEndTimeOnChangeInputValue}
        />
        <button
          className="primary-button"
          type="button"
          onClick={handleAddSubtitleCues}
        >
          Adicionar legenda
        </button>
      </div>
      <div className="subtitles-cues-table-container">
        {SubtitleCuesTable}
        <button
          className="primary-button"
          type="button"
          onClick={() => setIsEditingCreatingSubtitleCues(false)}
        >
          Guardar legendas / Voltar
        </button>
      </div>
    </div>
  );

  const audiodescriptionDisplay = <div className="audiodescription-display">Em construção...</div>;

  return (
    <div className="forms-step2-video">
      <div className="content-creation-container">
        {<Horizontal_Tab_Video_Forms onActiveTab={handleTab} />}
        <div className="video-content-creation">
          {videoDisplay}
          {isVideoLoaded && <div className="subtitles-workspace">{filterTab === 'Legendas' ? (isEditingCreatingSubtitleCues ? subtitleCuesCreationDisplay : allSubtitlesDisplay) : audiodescriptionDisplay}</div>}
        </div>
      </div>

      {isEditingCreatingSubtitleCues ? (
        <div className="forms-step2-SubtitleCues-bottom-bar"></div> // Aqui ficaria o react dropzone para fazer o upload de legendas em formato vtt pré-feitas na paltaforma
      ) : (
        <div className="forms-step2-bottom-bar">
          <div className="forms-step2-back-button">
            <button
              className="forms-button"
              type="button"
              onClick={handlePreviousStep}
            >
              Voltar
            </button>
          </div>
          <div className="forms-step-feedback-bar with-padding">
            <StepValidationFeedback
              title="Requisitos obrigatórios para finalizar:"
              validation={stepValidations}
              gridColumns="video-step2"
            />
            <button
              className={allStepValidationsValid ? 'forms-button' : 'forms-button invalid'}
              type="button"
              onClick={(e) => {
                allStepValidationsValid && handleSubmit(e);
              }}
              disabled={!allStepValidationsValid}
              aria-disabled={allStepValidationsValid ? false : true}
            >
              {/* Fazer a logica para que esteja "disabled" no botão enquanto ainda faltar preencher alguma coisa. Isto ajudará*/}
              Submit
            </button>
          </div>
        </div>
      )}
      <Modal_Video_forms
        isOpen={isModalOpen}
        closeModal={closeModal}
        modal={modalType}
        isEditingCreatingSubtitleCues={isEditingCreatingSubtitleCues}
        videoCurrentTime={videoCurrentTime}
        videoDuration={videoDuration}
      />
    </div>
  );
}
