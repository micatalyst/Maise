import "@/styles/components/Forms_Step1.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCheck,
  faFileArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function Text_Forms_Step1({
  formData,
  setFormData,
  handleNextStep,
  nextStep,
  setNextStep,
  file,
  setFile,
}) {
  //const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const [inputTitleValid, setInputTitleValid] = useState(false);
  const [inputContent_CategoryValid, setInputContent_CategoryValid] =
    useState(false);
  const [inputLanguageValid, setInputLanguageValid] = useState(false);
  const [inputDescriptionValid, setInputDescriptionValid] = useState(false);
  const [inputFileValid, setInputFileValid] = useState(false);

  useEffect(() => {
    formData.title ? setInputTitleValid(true) : setInputTitleValid(false);
    formData.content_category
      ? setInputContent_CategoryValid(true)
      : setInputContent_CategoryValid(false);
    formData.original_content_language
      ? setInputLanguageValid(true)
      : setInputLanguageValid(false);
    formData.description
      ? setInputDescriptionValid(true)
      : setInputDescriptionValid(false);
    file ? setInputFileValid(true) : setInputFileValid(false);

    if (
      formData.title &&
      formData.content_category &&
      formData.language &&
      formData.description &&
      file
    ) {
      setNextStep(true);
    } else {
      setNextStep(false);
    }
  }, [formData, setNextStep, file]);

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank"); // Abre o ficheiro num novo separador
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl("");
  };

  const maxSize = 5 * 1024 * 1024; // 5 MB

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Verifica se o arquivo foi aceito
    if (rejectedFiles.length > 0) {
      const errorMessage = rejectedFiles[0].errors[0].message;
      setError(errorMessage);
      return;
    }

    // Se o arquivo foi aceito
    setFile(acceptedFiles[0]);
    setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    setError("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: maxSize,
  });

  return (
    <div className="forms-step1">
      <div className="forms-step1-container">
        <div className="forms-triple-input">
          <div>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              placeholder="Título do Conteúdo..."
              maxLength="60"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="content_category">Conteúdo</label>
            <div className="forms-select">
              <FontAwesomeIcon icon={faCaretDown} />
              <select
                id="content_category"
                value={formData.content_category}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    content_category: e.target.value,
                  });
                }}
                required
              >
                <option value="" disabled>
                  Especifica o Conteúdo...
                </option>
                <option value="Poster">Poster</option>
                <option value="Banner">Banner</option>
                <option value="Video">Video</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="original_content_language">Idioma</label>
            <div className="forms-select">
              <FontAwesomeIcon icon={faCaretDown} />
              <select
                id="original_content_language"
                value={formData.original_content_language}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    original_content_language: e.target.value,
                  });
                }}
                required
              >
                <option value="" disabled>
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
            placeholder="Nome do Conteúdo..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
            required
          />
        </div>
        {file ? (
          <div className="forms-input-file" aria-live="assertive">
            <label>Conteúdo original</label>
            <div
              className="file-uploded-container"
              aria-label="Acabaste de carregar aqui um documento"
              tabIndex="0"
            >
              {/* Aqui em cima, acrescentei um "aria-live" para notificar os leitores de ecrâ (de forma "amigável" / sem interromper outras mensagens) que este conteudo atualizou */}
              <div className="file-uploded-zone">
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
                    <p>{file.name}</p>
                  </div>
                  <div className="file-side-info-row">
                    <div>
                      <span>Tamanho</span>
                      <p> {(file.size / 1024 / 1024).toFixed(2)} MB </p>
                    </div>
                    <div>
                      <span>Última modificação</span>
                      <p>{new Date(file.lastModified).toLocaleDateString()}</p>
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
            {/* Aqui em cima, acrescentei um "aria-live" para notificar os leitores de ecrâ (de forma "amigável" / sem interromper outras mensagens) que este conteudo atualizou */}
            <label htmlFor="fileImport">Conteúdo original</label>
            <div
              {...getRootProps({
                className: "dropzone",
                tabIndex: 0,
                "aria-labelledby": "dropzone-label",
              })}
            >
              {/* Estou a colocar o tabIndex para grantir que seja navegavel por teclado */}
              <input {...getInputProps({ id: "fileImport" })} />
              <div className="dropzone-info">
                <FontAwesomeIcon icon={faFileArrowUp} />
                <p>Arrasta e larga</p>
                <span>ou</span>
                <button className="primary-button" type="button">
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
      <div className="forms-step1-bottom-bar">
        <div className="forms-step1-input-feedback">
          <p>Preencha todos os campos:</p>
          <div className="forms-step1-input-feedback-container">
            <div className={inputTitleValid ? "valid" : ""}>
              {inputTitleValid ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faXmark} />
              )}
              <span>Nome</span>
            </div>
            <div className={inputContent_CategoryValid ? "valid" : ""}>
              {inputContent_CategoryValid ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faXmark} />
              )}
              <span>Conteúdo</span>
            </div>
            <div className={inputLanguageValid ? "valid" : ""}>
              {inputLanguageValid ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faXmark} />
              )}
              <span>Idioma</span>
            </div>
            <div className={inputDescriptionValid ? "valid" : ""}>
              {inputDescriptionValid ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faXmark} />
              )}
              <span>Descrição</span>
            </div>
            <div className={inputFileValid ? "valid" : ""}>
              {inputFileValid ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faXmark} />
              )}
              <span>Conteúdo original</span>
            </div>
          </div>
        </div>
        <div>
          <button
            className={nextStep ? "forms-button" : "forms-button invalid"}
            type="button"
            onClick={handleNextStep}
            aria-disabled={nextStep ? false : true}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
