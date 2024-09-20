import '@/styles/components/Image_Section.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faGripLines } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId } from '@/slicers/TempTextContentSlice';

export default function Image_Section({ item }) {
  const dispatch = useDispatch();

  const activeSectionId = useSelector((state) => state.TempTextContentSlice.activeSectionId);

  return (
    <button
      type="button"
      className="btn-section"
      aria-pressed={item.id === activeSectionId}
      onClick={() => {
        dispatch(setActiveSectionId(item.id)); // Garante que sempre que uma secção é selecionada, esta fique guardada para poder saber sempre a secção atual ativa
      }}
    >
      <div className={item.id === activeSectionId ? 'text-section selected' : 'text-section'}>
        <div className="text-section-title">
          {item.id === activeSectionId ? (
            <FontAwesomeIcon
              className="selected"
              icon={faAngleRight}
            />
          ) : (
            ''
          )}
          <p className={item.id === activeSectionId ? 'selected' : ''}>{item.title}</p>
        </div>
        <div
          className="drag-icon"
          onPointerDown={(event) => dragControls.start(event)}
        >
          <FontAwesomeIcon icon={faGripLines} />
        </div>
      </div>
    </button>
  );
}
