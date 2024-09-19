'use client';

import '@/styles/pages/ContentShowing_Page.scss';

import { useSearchParams } from 'next/navigation';
import { fetchContentById } from '@/slicers/dataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export default function Conteudo() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { currentContent, loading } = useSelector((state) => state.dataSlice); // Chamada da informação da "API" para mostrar o conteúdo

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContentById(id));
  }, []);

  const handleOriginalContentPreview = () => {
    if (currentContent && currentContent.originalFilePath) {
      const baseServerUrl = 'http://localhost:3001';
      const fileUrl = `${baseServerUrl}${currentContent.originalFilePath}`;
      window.open(fileUrl, '_blank');
    } else {
      // trigger de feedback a dizer que o documento não está disponível
    }
  };

  return (
    <main className="main grid-template-columns-1fr">
      {loading
        ? 'Loading content'
        : currentContent && (
            <div className="content-showing-container">
              <div class="original-content-general-info-container">
                <div className="original-content-description-container">
                  <h1>{currentContent.title}</h1>
                  <h3>Descrição</h3>
                  <p>{currentContent.description}</p>
                </div>
                <div className="original-content-general-info-footer">
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
                </div>
              </div>
              <div class="created-content-visualization-container"></div>
            </div>
          )}
    </main>
  );
}

{
  /* <p>{currentContent.title}</p> */
}
