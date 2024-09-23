import '@/styles/components/Image_upload.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';

export default function Image_upload({ item, handleRemoveFile }) {
  return (
    <div className="uploaded-image-container">
      <FontAwesomeIcon icon={faFileImage} />
      <div className="image-info">
        <p>{item.file.name}</p>
        <span>{(item.file.size / 1024 / 1024).toFixed(2)}</span>
      </div>
      {/* <button
        className="primary-button"
        type="button"
        //onClick={handleUpdateSection}
      >
        Ver
      </button> */}
      <button
        type="button"
        className="button-delete-image"
        onClick={() => {
          handleRemoveFile(item.id);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
