import '@/styles/components/Image_Section.scss';

import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faGripLines } from '@fortawesome/free-solid-svg-icons';

import { Reorder, useDragControls, useMotionValue } from 'framer-motion';

import { useSelector } from 'react-redux';

export default function Image_Section({ item, handleSectionActivation, handleDragStart, handleDragEnd }) {
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const activeSectionId = useSelector((state) => state.TempImageContentSlice.activeSectionId);
  const sections = useSelector((state) => state.TempImageContentSlice.sections);
  const sectionIndex = sections.findIndex((section) => section.id === item.id);

  return (
    <Reorder.Item
      value={item}
      id={item}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ position: 'relative', y }}
    >
      <button
        type="button"
        className="btn-section"
        aria-pressed={item.id === activeSectionId}
        onClick={() => {
          handleSectionActivation(item.id); // Garante que sempre que uma secção é selecionada, esta fique guardada para poder saber sempre a secção atual ativa
        }}
      >
        <div className={item.id === activeSectionId ? 'image-section selected' : 'image-section'}>
          <div className="image-section-order">
            {item.id === activeSectionId ? (
              <FontAwesomeIcon
                className="selected"
                icon={faAngleRight}
              />
            ) : (
              ''
            )}
            <p className={item.id === activeSectionId ? 'selected' : ''}>{sectionIndex + 1}</p>
          </div>
          <div className="image-section-file">
            <Image
              src={item.preview}
              //priority={true}
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div
            className="drag-icon"
            onPointerDown={(event) => dragControls.start(event)}
          >
            <FontAwesomeIcon icon={faGripLines} />
          </div>
        </div>
      </button>
    </Reorder.Item>
  );
}
