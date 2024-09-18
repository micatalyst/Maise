'use client';

import '@/styles/ContentShowing_Page.scss';

import { useSearchParams } from 'next/navigation';
import { fetchContentById } from '@/slicers/dataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export default function Conteudo() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { contentDataId, loading } = useSelector((state) => state.dataSlice); // Chamada da informação da "API" para mostrar o conteúdo

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContentById(1));
  }, []);

  /*  const handleOriginalContentPreview = () => {
    if (original_content_PreviewUrl) {
      window.open(original_content_PreviewUrl, '_blank'); // Abre o ficheiro num novo separador
    } else {
      // trigger de feedback a dizer que o documento não foi carregado
    }
  }; */

  return (
    <main className="main">
      <div className="content-showing-container">
        <div class="original-content-general-info-container">
          <div className="original-content-description-container">
            <h1>{contentDataId.title}</h1>
            <h3>Descrição</h3>
            <p>{contentDataId.description}</p>
          </div>
          <div className="original-content-general-info-footer">
            <div className="original-content-adicional-info-container">
              <div>
                <h3>Conteúdo</h3>
                <p>{`${contentDataId.content_typology} - ${contentDataId.original_content_category}`}</p>
              </div>
              <div>
                <h3>Idioma</h3>
                <p>{contentDataId.original_content_language}</p>
              </div>
              <div>
                <h3>Publicado por</h3>
                <p>{contentDataId.author}</p>
              </div>
              <div>
                <h3>Inserido em</h3>
                <p>{contentDataId.publish_date}</p>
              </div>
            </div>
            <div className="original-content-container">
              <h3>Conteúdo Original</h3>
              <FontAwesomeIcon icon={faFile} />
              <button
                className="primary-button"
                type="button"
                /* onClick={handleOriginalContentPreview} */
              >
                Abrir / Transferir
              </button>
            </div>
          </div>
        </div>
        <div class="created-content-visualization-container"></div>
      </div>
    </main>
  );
}

{
  /* <p>{contentDataId.title}</p> */
}
