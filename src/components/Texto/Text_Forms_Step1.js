import '@/styles/components/Forms_Step1.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheck, faFileArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

import { toast } from 'sonner';

import { useDropzone } from 'react-dropzone';
import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setTitle, setOriginalContentCategory, setOriginalContentLanguage, setDescription } from '@/slicers/TempTextContentSlice';

import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Text_Forms_Step1({ handleNextStep, original_content_file, setOriginal_content_file, original_content_PreviewUrl, setOriginal_content_PreviewUrl }) {
  const title = useSelector((state) => state.TempTextContentSlice.title || '');
  const original_content_category = useSelector((state) => state.TempTextContentSlice.original_content_category || '');
  const original_content_language = useSelector((state) => state.TempTextContentSlice.original_content_language || '');
  const description = useSelector((state) => state.TempTextContentSlice.description);

  const dispatch = useDispatch();

  const maxSize = 100 * 1024 * 1024; // 100 MB
  const [error, setError] = useState('');

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);
  useEffect(() => {
    setStepValidations([
      {
        title: 'Título',
        isValid: Boolean(title.trim()),
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
        isValid: Boolean(description.trim()),
      },
      {
        title: 'Conteúdo original',
        isValid: Boolean(original_content_file),
      },
    ]);
  }, [title, original_content_category, original_content_language, description, original_content_file]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // handlePreview abre um separador com o documento original aberto

  const handlePreview = () => {
    if (original_content_PreviewUrl) {
      window.open(original_content_PreviewUrl, '_blank'); // Abre o ficheiro num novo separador
    } else {
      // trigger de feedback a dizer que o documento não foi carregado
    }
  };

  const handleRemoveFile = () => {
    setOriginal_content_file('');
    setOriginal_content_PreviewUrl('');
  };

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
    setOriginal_content_file(acceptedFiles[0]);
    setOriginal_content_PreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    setError('');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: maxSize,
    multiple: false,
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
              placeholder="Título do conteúdo original..."
              maxLength="80"
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value.trimStart()))}
              required
            />
          </div>
          <div>
            <label htmlFor="content_category">Categoria</label>
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
                  Categoria do conteúdo original...
                </option>
                <option value="Livro">Livro</option>
                <option value="Artigo">Artigo</option>
                <option value="Tese/Dissertação">Tese/Dissertação</option>
                <option value="Relatório">Relatório</option>
                <option value="Slides">Slides</option>
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
            placeholder="Descrição do conteúdo original..."
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value.trimStart()))}
            required
          />
        </div>
        {original_content_file ? (
          <div
            className="forms-input-file"
            aria-live="assertive"
          >
            <label>Conteúdo original (Carrega um ficheiro de texto)</label>
            <div
              className="file-uploaded-container"
              aria-label="Acabaste de carregar aqui um documento"
              tabIndex="0"
            >
              <div className="file-uploaded-zone">
                <div className="file-side-bar">
                  <FontAwesomeIcon icon={faFileLines} />
                  <p>PDF</p>
                  <button
                    className="negative-button"
                    type="button"
                    onClick={handleRemoveFile}
                  >
                    Apagar documento
                  </button>
                </div>
                <div className="file-side-info">
                  <div>
                    <span>Nome</span>
                    <p>{original_content_file ? original_content_file.name : 'noFile'}</p>
                  </div>
                  <div className="file-side-info-row">
                    <div>
                      <span>Tamanho</span>
                      <p>
                        {original_content_file ? (original_content_file.size / 1024 / 1024).toFixed(2) : 'noFile'}
                        MB
                      </p>
                    </div>
                    <div>
                      <span>Última modificação</span>
                      <p>{original_content_file ? new Date(original_content_file.lastModified).toLocaleDateString() : 'noFile'}</p>
                    </div>
                  </div>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handlePreview}
                  >
                    Ver documento
                  </button>
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
            <label htmlFor="fileImport">Conteúdo original (Carrega um ficheiro de texto)</label>
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
                <p>PDF</p>
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
