import '@/styles/components/Video_SubtitleCues_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';
import { selectActiveSubtitle } from '@/slicers/TempVideoContentSlice';

export default function Video_SubtitleCues_Section({ id, startTime, endTime, text }) {
  //const activeSubtitle = useSelector(selectActiveSubtitle);

  //const dispatch = useDispatch();

  return (
    <>
      <span className="subtitles-cues-table-body first-body-component">{text}</span>
      <span className="subtitles-cues-table-body">{startTime}</span>
      <div className="subtitles-cues-table-section">
        <span className="subtitles-cues-table-body">{endTime}</span>
        <div className="subtitles-cues-table-body subtitles-cues-table-buttons">
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
      </div>
    </>
  );
}
