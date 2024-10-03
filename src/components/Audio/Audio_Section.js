import '@/styles/components/Audio_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { setActiveSectionId } from '@/slicers/TempAudioContentSlice';

export default function Audio_Section({ id, title, description, startTime, endTime, openModal }) {
  return (
    <div className="section-container">
      <div className="section-header">
        <span className="section-time">
          {startTime} - {endTime}
        </span>
        <button
          className="primary-button icon"
          type="button"
          onClick={() => {
            dispatch(setActiveSectionId(id));
            openModal('updateSubtitlesLanguage');
          }}
        >
          <FontAwesomeIcon icon={faFilePen} />
          Editar secção
        </button>
        <button
          className="negative-button icon"
          type="button"
          onClick={() => {
            dispatch(setActiveSectionId(id));
            openModal('deleteSubtitles');
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} />
          Apagar secção
        </button>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
