import "@/styles/components/Text_Section.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faGripLines } from "@fortawesome/free-solid-svg-icons";

import { Reorder, useDragControls, useMotionValue } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { setActiveSectionId } from "@/slicers/TempTextContentSlice";

export default function Content_Card({
  item,
  handleSectionActivation,
  handleDragStart,
  handleDragEnd,
}) {
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const dispatch = useDispatch();

  const activeSectionId = useSelector(
    (state) => state.TempTextContentSlice.activeSectionId
  );

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
        aria-pressed={item.id === activeSectionId}
        onClick={() => {
          handleSectionActivation(item.id); // Garante que sempre que uma secção é selecionada, esta fique guardada para poder saber sempre a secção atual ativa
          dispatch(setActiveSectionId(item.id));
        }}
      >
        <div
          className={
            item.id === activeSectionId
              ? "text-section selected"
              : "text-section"
          }
        >
          <div className="text-section-title">
            {item.id === activeSectionId ? (
              <FontAwesomeIcon className="selected" icon={faAngleRight} />
            ) : (
              ""
            )}
            <p className={item.id === activeSectionId ? "selected" : ""}>
              {item.title}
            </p>
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
