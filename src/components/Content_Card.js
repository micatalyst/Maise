"use client";

import "@/styles/components/Content_Card.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as faBookmarkRegular,
  faFileImage,
} from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";

export default function Content_Card() {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <div className="content-type">
          <FontAwesomeIcon icon={faFileImage} />
          <span>Imagem</span>
        </div>
        <FontAwesomeIcon icon={faBookmarkRegular} />
        {/* <FontAwesomeIcon icon={faBookmarkSolid} /> */}
      </div>
      <div className="content-card-title">
        <h4>Manual Laboratório Química Orgânica</h4>
      </div>
      <div className="content-card-date">
        <span>24-03-2024</span>
      </div>
    </div>
  );
}
