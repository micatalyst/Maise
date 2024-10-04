import '@/styles/components/Audio_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from 'react-redux';

import { setActiveSectionId } from '@/slicers/TempAudioContentSlice';

export default function Audio_Section({ id, title, description, startTime, endTime, openModal }) {
  const dispatch = useDispatch();
  return (
    <div className="section-container">
      <div className="section-header">
        <div className="section-time">
          <p>
            {startTime} - {endTime}
          </p>
        </div>

        <button
          className="primary-button icon"
          type="button"
          onClick={() => {
            dispatch(setActiveSectionId(id));
            openModal('updateSection');
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
            openModal('deleteSection');
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
