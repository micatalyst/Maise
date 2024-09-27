import '@/styles/components/Video_Subtitles_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

export default function Video_Subtitles_Section({ id, language, date, setSelectedSubtitleId, setIsEditingCreatingSubtitleCues }) {
  //const activeSectionId = useSelector((state) => state.TempTextContentSlice.activeSectionId);

  return (
    <div className="video-subtitles-section">
      <span>{language}</span>
      <span>{date}</span>
      <button
        className="primary-button"
        type="button"
        onClick={() => {
          setSelectedSubtitleId(id);
          setIsEditingCreatingSubtitleCues(true);
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
