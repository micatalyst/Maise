'use client';

import '@/styles/components/Content_Card.scss';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkRegular, faFileImage } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';

export default function Content_Card(props) {
  const UrlPathWithQueryString = `/Conteudo?id=${props.id}`;

  const handleSaveButtonClick = (event) => {
    event.preventDefault();
    props.toggleSaved();
  };

  return (
    <Link href={UrlPathWithQueryString}>
      <div className="content-card">
        <div className="content-card-header">
          <div className="content-type">
            <FontAwesomeIcon icon={faFileImage} />
            <span>{props.type}</span>
          </div>
          <button
            type="button"
            className="save-button"
            onClick={handleSaveButtonClick}
          >
            {props.saved ? <FontAwesomeIcon icon={faBookmarkSolid} /> : <FontAwesomeIcon icon={faBookmarkRegular} />}
          </button>
        </div>
        <div className="content-card-title">
          <h4>{props.title}</h4>
          {/* {props.sections && props.sections.length && <div>{props.sections.length} secções</div>} */}
        </div>
        <div className="content-card-date">
          <span>{props.date}</span>
        </div>
      </div>
    </Link>
  );
}
