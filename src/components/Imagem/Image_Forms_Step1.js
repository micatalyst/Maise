import '@/styles/components/Forms_Step1.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheck, faFileArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

import { toast } from 'sonner';

import { useDropzone } from 'react-dropzone';
import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setTitle, setOriginalContentCategory, setOriginalContentLanguage, setDescription, addSection } from '@/slicers/TempImageContentSlice';

import StepValidationFeedback from '@/components/StepValidationFeedback';
import Image_upload from '@/components/Imagem/Image_upload';

export default function Image_Forms_Step1({ handleNextStep, original_content_file, setOriginal_content_file, original_content_PreviewUrl, setOriginal_content_PreviewUrl, handleRemoveFile }) {
  const title = useSelector((state) => state.TempImageContentSlice.title || '');
  const original_content_category = useSelector((state) => state.TempImageContentSlice.original_content_category || '');
  const original_content_language = useSelector((state) => state.TempImageContentSlice.original_content_language || '');
  const description = useSelector((state) => state.TempImageContentSlice.description);

  const sections = useSelector((state) => state.TempImageContentSlice.sections);

  const dispatch = useDispatch();

  const maxSize = 25 * 1024 * 1024; // 25 MB
  const [error, setError] = useState('');

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);
  useEffect(() => {
    setStepValidations([
      {
        title: 'Nome',
        isValid: Boolean(title),
      },
      {
        title: 'Conteúdo',
        isValid: Boolean(original_content_category),
      },
      {
        title: 'Idioma',
        isValid: Boolean(original_content_language),
      },
      {
        title: 'Descrição',
        isValid: Boolean(description),
      },
      {
        title: 'Conteúdo original',
        isValid: Boolean(original_content_file.length > 0),
      },
    ]);
  }, [title, original_content_category, original_content_language, description, original_content_file]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  useEffect(() => {
    console.log(sections);
  }, [sections]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Verifica se o arquivo foi aceito
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

    // Se o arquivo foi aceito

    // id criado apartir do index + date porque as imagens precisam de um id ao dar upload e denta forma é sempre garantido ids unicos pelo motivo de sempre que novas imagens entram o index volta a 0
    const generatedIds = acceptedFiles.map((file, index) => index.toString() + Date.now());

    const uploadFiles = acceptedFiles.map((file, index) => ({
      id: generatedIds[index],
      file,
    }));

    const dispatchUploadedFiles = acceptedFiles.map((file, index) => ({
      id: generatedIds[index],
      preview: URL.createObjectURL(file),
    }));

    setOriginal_content_file((prevFiles) => [...prevFiles, ...uploadFiles]);
    dispatch(addSection(dispatchUploadedFiles));

    setError('');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
    },
    maxSize: maxSize,
    multiple: true,
  });

  return (
    <div className="forms-step1">
      <div className="forms-step1-container">
        <div className="forms-triple-input">
          <div>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Título do Conteúdo..."
              maxLength="80"
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="content_category">Conteúdo</label>
            <div className="forms-select">
              <FontAwesomeIcon icon={faCaretDown} />
              <select
                id="content_category"
                name="content_category"
                value={original_content_category}
                onChange={(e) => dispatch(setOriginalContentCategory(e.target.value))}
                required
              >
                <option
                  value=""
                  disabled
                >
                  Especifica o Conteúdo...
                </option>
                <option value="Fotografia">Fotografia</option>
                <option value="Ilustração">Ilustração</option>
                <option value="Cartaz">Cartaz</option>
                <option value="Slides">Slides</option>
                <option value="Infográfico">Infográfico</option>
                <option value="Diagrama">Diagrama</option>
                <option value="Gráfico">Gráfico</option>
                <option value="Documento académico">Documento académico</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="original_content_language">Idioma</label>
            <div className="forms-select">
              <FontAwesomeIcon icon={faCaretDown} />
              <select
                id="original_content_language"
                name="original_content_language"
                value={original_content_language}
                onChange={(e) => dispatch(setOriginalContentLanguage(e.target.value))}
                required
              >
                <option
                  value=""
                  disabled
                >
                  Idioma do conteúdo original...
                </option>
                <option value="Português">Português</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </div>
        <div className="forms-text-area">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            placeholder="Nome do Conteúdo..."
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
            required
          />
        </div>
        {original_content_file.length > 0 ? (
          <div
            className="forms-input-file"
            aria-live="assertive"
            aria-label="procura o documento, que pretendes carregar, presente no teu PC"
          >
            <label htmlFor="fileImport">Conteúdo original (Carrega uma ou várias imagens)</label>
            <div className="images-uploaded-container">
              <div
                {...getRootProps({
                  className: 'images-uploaded-dropzone',
                  tabIndex: 0,
                  'aria-labelledby': 'dropzone-label',
                })}
              >
                {/* Estou a colocar o tabIndex para grantir que seja navegavel por teclado */}
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
              </div>
              <div className="dropzone-file-list">
                <p className="uploaded-content-header">Ficheiros carregados</p>
                <div className="uploaded-content-list">
                  {original_content_file.map((item, index) => (
                    <Image_upload
                      key={index}
                      item={item}
                      handleRemoveFile={handleRemoveFile}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="forms-input-file"
            aria-live="assertive"
            aria-label="procura o documento, que pretendes carregar, presente no teu PC"
          >
            <label htmlFor="fileImport">Conteúdo original (Carrega uma ou várias imagens)</label>
            <div
              {...getRootProps({
                className: 'dropzone',
                tabIndex: 0,
                'aria-labelledby': 'dropzone-label',
              })}
            >
              {/* Estou a colocar o tabIndex para grantir que seja navegavel por teclado */}
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
                <p>PNG / JPEG</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="forms-step-feedback-bar">
        <StepValidationFeedback
          title={'Preencha todos os campos:'}
          validation={stepValidations}
        />
        <button
          className={allStepValidationsValid ? 'forms-button' : 'forms-button invalid'}
          type="button"
          onClick={() => {
            allStepValidationsValid && handleNextStep();
          }}
          aria-disabled={allStepValidationsValid ? false : true}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
