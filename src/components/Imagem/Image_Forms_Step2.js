import '@/styles/components/Forms_Image_Step2.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown, faFileArrowUp, faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { faFileLines } from '@fortawesome/free-regular-svg-icons';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCreatedContentLanguage, setActiveSectionId, addSection, selectActiveSection } from '@/slicers/TempImageContentSlice';

import { useDropzone } from 'react-dropzone';

import Image_Section from '@/components/Imagem/Image_Section'; // Aba das sections (neste caso são diretamente as imagens e não é preciso guardar um titulo nem alterar o mesmo)
import Modal_Image_forms from '@/components/Imagem/Modal_Image_forms';
import Audio_Visualiser from '@/components/Texto/Audio_Visualiser';
import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Image_Forms_Step2({ handlePreviousStep, handleSubmit, original_content_file, accessibleAudioFiles, setAccessibleAudioFiles }) {
  const created_content_language = useSelector((state) => state.TempImageContentSlice.created_content_language);

  const sections = useSelector((state) => state.TempImageContentSlice.sections);
  const activeSectionId = useSelector((state) => state.TempImageContentSlice.activeSectionId);
  const activeSection = useSelector(selectActiveSection);

  const dispatch = useDispatch();

  const maxSize = 50 * 1024 * 1024; // 50 MB
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    if (sections.length === 1) {
      // Não havia sections antes, seleccionar a primeira (primeira vez ou depois de apagar todas)
      dispatch(setActiveSectionId(sections[0].id));
    }
  }, [sections]);

  // dispatch(
  //   // dispach que atualiza a lista de section (que neste caso tem de ser uma especie de mapping ou não. Mas tem de ser tudo de uma vez porque cada imagem carregada é uma secção)
  //   addSection({
  //     id: sections.length ? sections[sections.length - 1].id + 1 : 1,
  //     /* title: sectionOnChangeInputValue, */
  //   }),
  // );

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);
  useEffect(() => {
    // Verificar se os nomes das secçoes sao unicos.
    // 1) Criar um Set (chaves unicas) a partir do array de nomes. Um Set armazena apenas valores únicos. Significa que, se houver valores duplicados no array, o Set vai remover os duplicados
    // 2) Criar um array desse set
    // 3) Se os tamanhos (das sections e dos nomes unicos) forem iguais, entao os nomes sao unicos
    const allSectionsHaveUniqueNames = Boolean(sections.length > 0 && Array.from(new Set(sections.map((s) => s.title))).length === sections.length);

    setStepValidations([
      {
        title: 'Adicionar pelo menos uma secção',
        isValid: sections.length > 0, // usar > 0 em vez de so ver se tem length, para o isValid ser false em vez de 0 (que e falsy na mesma, mas nao e' boolean)
      },
      {
        title: 'Idioma do conteúdo criado',
        isValid: sections.length > 0 && Boolean(created_content_language),
      },
      {
        title: 'Secções devem ter nomes únicos',
        isValid: allSectionsHaveUniqueNames,
      },
      {
        title: 'Cada secção deve ter um áudio',
        isValid: sections.length > 0 && accessibleAudioFiles.length === sections.length,
      },
    ]);
  }, [sections, created_content_language, accessibleAudioFiles]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // Save current audio time for each section, to allow switching between them and restore the previous time
  const [sectionsCurrentAudioTime, setSectionsCurrentAudioTime] = useState({});
  const globalAudioVolume = useRef(0.5);

  const sectionTime = sectionsCurrentAudioTime[activeSectionId] || 0;

  function updateSectionTime(time, sectionId) {
    setSectionsCurrentAudioTime((state) => ({ ...state, [sectionId]: time }));
  }

  function deleteSectionAudioTimestamp(deletedSectionId) {
    setSectionsCurrentAudioTime((state) => {
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== deletedSectionId.toString()));
    });
  }

  function handleSectionDeleted(deletedSectionId) {
    // Remove audio time state
    deleteSectionAudioTimestamp(deletedSectionId);
  }

  function handleRemoveSectionAudio() {
    setAccessibleAudioFiles((state) => state.filter((file) => file.id !== activeSectionId));
    deleteSectionAudioTimestamp(activeSectionId);
  }

  // Modal

  const openModal = (modal) => {
    setModalType(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Carregamento da vertente mais acessivel (Áudio)

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Verifica se o arquivo foi aceite
    if (rejectedFiles.length > 0) {
      const errorMessage = rejectedFiles[0].errors[0].message;
      setError(errorMessage);
      return;
    }

    // Se o arquivo foi aceite

    setAccessibleAudioFiles((prevFiles) => [
      ...prevFiles,
      {
        id: activeSectionId,
        audioFile: acceptedFiles[0],
        audioFilePreviewUrl: URL.createObjectURL(acceptedFiles[0]),
      },
    ]);

    setError('');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
    },
    maxSize: maxSize, // Permite multiplos carregamente de uma só vez
  });

  // Componente quando há sections

  const contentCriationDisplay = (
    <div className="content-creation-container">
      <div className="content-creation-left-side-bar">
        <div className="sections-container">
          {sections.map((item) => (
            <Image_Section
              key={item.id}
              item={item}
            />
          ))}
        </div>
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
      </div>
      <div className="content-creation-description-preview"></div>
      <div className="content-creation-work-space">
        {/* <div className="content-creation-top-bar">
          {activeSection && (
            <>
              <h2>{activeSection.title}</h2>
              <button
                className="primary-button icon"
                type="button"
                onClick={() => {
                  openModal('updateSection');
                }}
              >
                <FontAwesomeIcon icon={faFilePen} />
                Editar titulo
              </button>
              <button
                className="negative-button icon"
                type="button"
                onClick={() => {
                  openModal('deleteSection');
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                Apagar secção
              </button>
            </>
          )}
        </div> */}
        <div className="content-creation-upload">
          {accessibleAudioFiles.find((file) => file.id === activeSectionId) ? (
            <>
              <Audio_Visualiser
                accessibleAudioFiles={accessibleAudioFiles}
                activeSectionId={activeSectionId}
                sectionTime={sectionTime}
                updateSectionTime={updateSectionTime}
                globalAudioVolume={globalAudioVolume}
                openModal={openModal}
              />
            </>
          ) : (
            <div
              {...getRootProps({
                className: 'dropzone',
                tabIndex: 0,
                'aria-labelledby': 'dropzone-label',
              })}
            >
              <div className="Centralisation">
                <input {...getInputProps({ id: 'fileImport', name: 'fileImport' })} />
                <div className="dropzone-info">
                  <FontAwesomeIcon icon={faFileArrowUp} />
                  <p>Arrasta e larga</p>
                  <span>ou</span>
                  <button
                    className="primary-button"
                    type="button"
                  >
                    Procura no PC
                  </button>
                </div>
                <div className="dropzone-file-type">
                  <span>Ficheiros (até: {maxSize / 1024 / 1024} MB)</span>
                  <p>MP3 / WAV</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal_Image_forms
          isOpen={isModalOpen}
          closeModal={closeModal}
          modal={modalType}
          setAccessibleAudioFiles={setAccessibleAudioFiles}
          accessibleAudioFiles={accessibleAudioFiles}
          activeSectionId={activeSectionId}
          handleSectionDeleted={handleSectionDeleted}
          handleRemoveSectionAudio={handleRemoveSectionAudio}
        />
      </div>
    </div>
  );

  return (
    <div className="forms-step2-image">
      {/* sections.length === 0 &&  */ contentCriationDisplay} {/* para já igualar a zero apra mostrar e poder construir e mais tarde com a logica voltar a meter maior que zero */}
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
        {/* <div className="forms-step-input-feedback-container"> */}
        <div className="forms-step-feedback-bar with-padding">
          <StepValidationFeedback
            title={'Requisitos obrigatórios para finalizar:'}
            validation={stepValidations}
            gridColumns="image-step2"
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
      {/* </div> */}
    </div>
  );
}
