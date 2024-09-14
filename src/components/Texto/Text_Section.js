import "@/styles/components/Text_Section.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faGripLines } from "@fortawesome/free-solid-svg-icons";

import { Reorder, useDragControls, useMotionValue } from "framer-motion";

export default function Content_Card({
  item,
  id,
  title,
  activeSection,
  handleSectionActivation,
  handleDragStart,
  handleDragEnd,
}) {
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  return (
    <Reorder.Item
      value={item}
      id={item}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ position: "relative", y }}
    >
      <button
        type="button"
        className="btn-section"
        aria-pressed={id === activeSection}
        onClick={() => {
          handleSectionActivation(id); // Garante que sempre que uma secção é selecionada, esta fique guardada para poder saber sempre a secção atual ativa
        }}
      >
        <div
          className={
            id === activeSection ? "text-section selected" : "text-section"
          }
        >
          <div className="text-section-title">
            {id === activeSection ? (
              <FontAwesomeIcon className="selected" icon={faAngleRight} />
            ) : (
              ""
            )}
            <p>{title}</p>
          </div>
          <div onPointerDown={(event) => dragControls.start(event)}>
            <FontAwesomeIcon icon={faGripLines} />
          </div>
        </div>
      </button>
    </Reorder.Item>
  );
}
