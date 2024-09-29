import '@/styles/components/Video_Subtitles_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';
import { setOnEditingSubtitleId } from '@/slicers/TempVideoContentSlice';

export default function Video_Subtitles_Section({ id, language, date, setIsEditingCreatingSubtitleCues }) {
  const activeSubtitleId = useSelector((state) => state.TempVideoContentSlice.activeSectionId);

  const dispatch = useDispatch();

  return (
    <div className="video-subtitles-section">
      <span>{language}</span>
      <span>{date}</span>
      <button
        className="primary-button"
        type="button"
        onClick={() => {
          setIsEditingCreatingSubtitleCues(true);
          dispatch(setOnEditingSubtitleId(id));
        }}
      >
        Abrir
      </button>
      <button
        className="primary-button icon"
        type="button"
        onClick={() => {
          //openModal('updateSection');
        }}
      >
        <FontAwesomeIcon icon={faFilePen} />
        Editar
      </button>
      <button
        className="negative-button icon"
        type="button"
        onClick={() => {
          //openModal('deleteSection');
        }}
      >
        <FontAwesomeIcon icon={faTrashCan} />
        Apagar
      </button>
    </div>
  );
}
