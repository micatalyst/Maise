import "@/styles/components/Text_Section.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

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
      className={id === activeSection ? "btn-section selected" : "btn-section"}
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
        <div
          className={
            id === activeSection
              ? "text-section-title selected"
              : "text-section-title"
          }
        >
          <p className={id === activeSection ? "selected" : ""}>{title}</p>
          <FontAwesomeIcon icon={faGripLines} />
        </div>
      </div>
    </button>
  );
}
