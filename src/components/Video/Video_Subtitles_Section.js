import '@/styles/components/Video_Subtitles_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';
import { setOnEditingSubtitleId } from '@/slicers/TempVideoContentSlice';

export default function Video_Subtitles_Section({ id, language, date, setIsEditingCreatingSubtitleCues, openModal }) {
  const dispatch = useDispatch();

  return (
    <>
      <span className="all-subtitles-table-body first-body-component">{language}</span>
      <div className="all-subtitles-table-section">
        <span className="all-subtitles-table-body">{date}</span>
        <div className="all-subtitles-table-body all-subtitles-table-section-btns">
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setIsEditingCreatingSubtitleCues(true);
              dispatch(setOnEditingSubtitleId(id));
            }}
          >
            Editar Legendas
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              dispatch(setOnEditingSubtitleId(id));
              openModal('updateSubtitlesLanguage');
            }}
          >
            {/* <FontAwesomeIcon icon={faFilePen} /> */}
            Editar Idioma
          </button>
          <button
            className="negative-button icon"
            type="button"
            onClick={() => {
              dispatch(setOnEditingSubtitleId(id));
              openModal('deleteSubtitles');
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            Apagar
          </button>
        </div>
      </div>
    </>
  );
}
