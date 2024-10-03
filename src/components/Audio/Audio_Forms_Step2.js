import '@/styles/components/Forms_Audio_Step2.scss';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCreatedContentLanguage, addSection } from '@/slicers/TempAudioContentSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import CustomTimeInput from '@/components/Video/CustomTimeInput';

import Audio_Section from '@/components/Audio/Audio_Section';
import Modal_Audio_forms from '@/components/Audio/Modal_Audio_forms';
import Audio_Forms_Visualiser from '@/components/Audio/Audio_Forms_Visualiser';
import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Audio_Forms_Step2({ handlePreviousStep, handleSubmit, original_content_file, original_content_PreviewUrl }) {
  const created_content_language = useSelector((state) => state.TempAudioContentSlice.created_content_language);

  const sections = useSelector((state) => state.TempAudioContentSlice.sections);
  const activeSectionId = useSelector((state) => state.TempAudioContentSlice.activeSectionId);

  const dispatch = useDispatch();

  const [titleOnChangeInputValue, setTitleOnChangeInputValue] = useState(''); // value do input do texto das legenda
  const [startTimeOnChangeInputValue, setStartTimeOnChangeInputValue] = useState(''); // value do input do tempo inicial do áudio
  const [endTimeOnChangeInputValue, setEndTimeOnChangeInputValue] = useState(''); // value do input do tempo final do áudio
  const [descriptionOnChangeInputValue, setDescriptionOnChangeInputValue] = useState(''); // value do input da descrição do áudio

  const [handleAddSectionId, setHandleAddSectionId] = useState(2);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);

  useEffect(() => {
    // Verificar se os nomes das secçoes sao unicos
    // 1) Criar um Set (chaves unicas) a partir do array de nomes
    // 2) Criar um array desse set
    // 3) Se os tamanhos (das sections e dos nomes unicos) forem iguais, entao os nomes sao unicos

    // const allSectionsHaveUniqueNames = Boolean(sections.length > 0 && Array.from(new Set(sections.map((s) => s.title))).length === sections.length);

    setStepValidations([
      {
        title: 'Idioma do conteúdo criado',
        isValid: sections.length > 0 && Boolean(created_content_language),
      },
      {
        title: 'Adicionar pelo menos uma secção',
        isValid: sections.length > 0, // usar > 0 em vez de so ver se tem length, para o isValid ser false em vez de 0 (que e falsy na mesma, mas nao e' boolean)
      },
      /* {
        title: 'Secções devem ter títulos únicos',
        isValid: allSectionsHaveUniqueNames,
      }, */
    ]);
  }, [sections, created_content_language]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // Save current audio time for each section, to allow switching between them and restore the previous time

  const globalAudioVolume = useRef(0.5);

  const sectionTime = 0;

  // Modal

  const openModal = (modal) => {
    setModalType(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para adicionar sections (pelo botão)
  const handleAddSection = () => {
    if (titleOnChangeInputValue && startTimeOnChangeInputValue && endTimeOnChangeInputValue && descriptionOnChangeInputValue) {
      dispatch(
        addSection({
          id: sections.length ? handleAddSectionId : 1,
          title: titleOnChangeInputValue,
          description: descriptionOnChangeInputValue,
          startTime: startTimeOnChangeInputValue,
          endTime: endTimeOnChangeInputValue,
        }),
      );
      if (sections.length) {
        setHandleAddSectionId((previousValue) => previousValue + 1);
      } else {
        setHandleAddSectionId(2);
      }

      setTitleOnChangeInputValue('');
      setDescriptionOnChangeInputValue('');
    }
  };

  // Componente quando (não) há sections

  const noSectionsDisplay = (
    <div className="audio-sections-display-container">
      <div className="audio-sections-header">
        <h2>Secções</h2>
      </div>
      <div className="no-sections-container">
        <div>
          <p className="no-section-placeholder">
            Adiciona <span>Secções</span> para começar
          </p>
          <p className="no-section-placeholder">...</p>
        </div>
      </div>
    </div>
  );

  // Componente quando há sections

  const SectionsDisplay = (
    <div className="audio-sections-display-container">
      <div className="audio-sections-header">
        <h2>Secções</h2>
      </div>
      <div className="sections-container">
        {sections.map((item) => (
          <Audio_Section
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            startTime={item.startTime}
            endTime={item.endTime}
            openModal={openModal}
          />
        ))}
        <Modal_Audio_forms
          isOpen={isModalOpen}
          closeModal={closeModal}
          modal={modalType}
        />
      </div>
    </div>
  );

  // Componente de construção das sections

  const contentCreationDisplay = (
    <div className="content-creation-container">
      {/* <Audio_Forms_Visualiser
        accessibleAudioFiles={accessibleAudioFiles}
        activeSectionId={activeSectionId}
        sectionTime={sectionTime}
        updateSectionTime={updateSectionTime}
        globalAudioVolume={globalAudioVolume}
      /> */}
      <div className="audio-section-inputs-container">
        <div className="title-time-inputs">
          <div>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Titulo da secção..."
              maxLength="80"
              value={titleOnChangeInputValue}
              onChange={(e) => setTitleOnChangeInputValue(e.target.value)}
              required
            />
          </div>
          <div className="time-inputs">
            {/* <CustomTimeInput
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
            /> */}
          </div>
        </div>
        <div className="forms-text-area">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            placeholder="Descrição do conteúdo..."
            value={descriptionOnChangeInputValue}
            onChange={(e) => setDescriptionOnChangeInputValue(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="audio-section-inputs-footer-container">
        <div className="language-container">
          <label htmlFor="created_content_language">Idioma</label>
          <div className="forms-select">
            <FontAwesomeIcon icon={faCaretDown} />
            <select
              id="created_content_language"
              name="created_content_language"
              value={created_content_language}
              onChange={(e) => dispatch(setCreatedContentLanguage(e.target.value))}
            >
              <option
                value=""
                disabled
              >
                Idioma do conteúdo criado...
              </option>
              <option value="Português">Português</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={handleAddSection}
        >
          Adicionar secção
        </button>
      </div>
    </div>
  );

  return (
    <div className="forms-step2-audio">
      <div className="forms-step2-audio-container">
        {contentCreationDisplay}
        {/* <button
            type="button"
            onClick={handleAddSection}
            aria-label="Botão para a adição de secções"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button> */}
        {sections.length > 0 ? noSectionsDisplay : SectionsDisplay} {/* {sections.length > 0 ? SectionsDisplay : noSectionsDisplay} */}
      </div>
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
            gridColumns="audio-step2"
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
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
