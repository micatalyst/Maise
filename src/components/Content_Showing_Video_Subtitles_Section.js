import '@/styles/components/Content_Showing_Video_Subtitles_Section.scss';

export default function Content_Showing_Video_Subtitles_Section({ index, language, date, setAtualVideoSubtitles, atualVideoSubtitles }) {
  return (
    <>
      <span className="all-subtitles-table-body first-body-component">{language}</span>
      <div className="all-subtitles-table-section">
        <span className="all-subtitles-table-body">{date}</span>
        <span className="all-subtitles-table-body">{atualVideoSubtitles === index && <p className="subtitles-active">Selecionado</p>}</span>
        <div className="all-subtitles-table-body all-subtitles-table-section-btns">
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setAtualVideoSubtitles(index);
            }}
          >
            Ativar Legendas
          </button>
        </div>
      </div>
    </>
  );
}