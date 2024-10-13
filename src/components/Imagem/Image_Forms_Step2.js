import '@/styles/components/Forms_Image_Step2.scss';

import Image from 'next/image';

import { toast } from 'sonner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown, faFileArrowUp, faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { faFileLines } from '@fortawesome/free-regular-svg-icons';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCreatedContentLanguage, setActiveSectionId, setReorderedSections, selectActiveSection, updateSectionDescription } from '@/slicers/TempImageContentSlice';

import { Reorder, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

import Image_Section from '@/components/Imagem/Image_Section';
import Modal_Image_forms from '@/components/Imagem/Modal_Image_forms';
import Audio_Visualiser from '@/components/Audio_Visualiser';
import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Image_Forms_Step2({ handlePreviousStep, handleSubmit, setOriginal_content_file, accessibleAudioFiles, setAccessibleAudioFiles }) {
  const created_content_language = useSelector((state) => state.TempImageContentSlice.created_content_language);

  const sections = useSelector((state) => state.TempImageContentSlice.sections);
  const activeSectionId = useSelector((state) => state.TempImageContentSlice.activeSectionId);
  const activeSection = useSelector(selectActiveSection);

  const dispatch = useDispatch();

  const maxSize = 150 * 1024 * 1024; // 150 MB
  const [error, setError] = useState('');

  const [isDragging, setIsDragging] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    if (sections.length > 0) {
      // Não havia sections antes, seleccionar a primeira (primeira vez ou depois de apagar todas)
      dispatch(setActiveSectionId(sections[0].id));
    }
  }, []);

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
    setStepValidations([
      {
        title: 'Idioma do conteúdo criado',
        isValid: sections.length > 0 && Boolean(created_content_language),
      },
      {
        title: 'Cada Imagem deve ter uma descrição alternativa',
        isValid: sections.length > 0 && sections.every((section) => section.description && section.description.trim() !== ''),
      },
      {
        title: 'Cada Imagem deve ter um áudio',
        isValid: sections.length > 0 && accessibleAudioFiles.length === sections.length,
      },
    ]);
  }, [sections, created_content_language, accessibleAudioFiles]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  useEffect(() => {
    console.log(sections);
  }, [sections]);

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
    setOriginal_content_file((prevFiles) => prevFiles.filter((file) => file.id !== activeSectionId));
    // Remove audio time state
    deleteSectionAudioTimestamp(deletedSectionId);
  }

  function handleRemoveSectionAudio() {
    setAccessibleAudioFiles((state) => state.filter((file) => file.id !== activeSectionId));
    deleteSectionAudioTimestamp(activeSectionId);
  }

  // handlePreview abre um separador com o documento original aberto

  const handlePreview = () => {
    if (activeSection && activeSection.preview) {
      window.open(activeSection.preview, '_blank'); // Abre o ficheiro num novo separador
    } else {
      // trigger de feedback a dizer que o documento não foi carregado
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

  // Handle onClick para ativação da section (se esta não estiver a ser arrastada)

  const handleSectionActivation = (id) => {
    if (!isDragging) {
      dispatch(setActiveSectionId(id)); // Só executa o clique se não estiver a ser arrastado
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Reordenação das sections

  const handleReorder = (reorderedSections) => {
    dispatch(setReorderedSections(reorderedSections));
  };

  // Atualiza a descrição da imagem
  const handleUpdateSection = (inputDescription) => {
    dispatch(updateSectionDescription({ id: activeSectionId, description: inputDescription.trimStart() }));
  };

  // Carregamento da vertente mais acessivel (Áudio)

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Verifica se o arquivo foi aceite
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map((rejectedFile) => {
        const error = rejectedFile.errors[0]; // Pega o primeiro erro
        if (error.code === 'file-too-large') {
          return `O arquivo ${rejectedFile.file.name} excede o tamanho máximo permitido.`;
        } else if (error.code === 'file-invalid-type') {
          return `O arquivo ${rejectedFile.file.name} possui um formato de arquivo inválido.`;
        } else {
          return `Erro no arquivo ${rejectedFile.file.name}: ${error.message}`;
        }
      });
      // Exibe todos os erros encontrados
      //alert(errorMessages.join('\n'));
      toast.warning(errorMessages.join('\n'), {
        style: {
          background: '#f3b21b',
          color: '#1c1c1c',
          border: 'none',
        },
      });
      setError(errorMessages.join(', '));
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

  const contentCreationDisplay = (
    <div className="content-creation-container">
      <div className="content-creation-left-side-bar">
        <motion.div
          className="sections-container"
          layoutScroll
        >
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={handleReorder}
            //className="sections-container"
          >
            {sections.map((item) => (
              <Image_Section
                key={item.id}
                item={item}
                handleSectionActivation={handleSectionActivation}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
              />
            ))}
          </Reorder.Group>
        </motion.div>
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
      <div className="content-creation-image-preview">
        <div className="image-preview">
          {activeSection && (
            <Image
              src={activeSection.preview}
              //priority={true}
              alt="imagem não acessível"
              width={100}
              height={100}
            />
          )}
        </div>
        <div className="image-preview-btns">
          <button
            className="primary-button"
            type="button"
            onClick={handlePreview}
          >
            Abrir Imagem
          </button>
          <button
            className="negative-button icon"
            type="button"
            onClick={() => {
              openModal('deleteSection');
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            Apagar imagem
          </button>
        </div>
        <div className="image-preview-description">
          {activeSection && (
            <>
              <label htmlFor="description">Descrição alternativa</label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Descrição pequena e direta..."
                maxLength="150"
                value={activeSection.description ? activeSection.description : ''}
                onChange={(e) => handleUpdateSection(e.target.value)}
              />
            </>
          )}
        </div>
      </div>
      <div className="content-creation-work-space">
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
          handlePreviousStep={handlePreviousStep}
        />
      </div>
    </div>
  );

  return (
    <div className="forms-step2-image">
      {contentCreationDisplay}
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
