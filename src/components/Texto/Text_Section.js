import "@/styles/components/Text_Section.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faGripLines } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

export default function Content_Card({
  id,
  title,
  activeSection,
  setActiveSection,
}) {
  return (
    <button
      type="button"
      className="btn-section"
      aria-pressed={id === activeSection}
      onClick={() => {
        setActiveSection(id);
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
        <FontAwesomeIcon icon={faGripLines} />
      </div>
    </button>
  );
}
