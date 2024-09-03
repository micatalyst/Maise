import "@/styles/components/Forms_Step1.scss";

export default function Text_Forms_Step1({
  formData,
  setFormData,
  handleNextStep,
}) {
  return (
    <div>
      <div className="forms-step1-container">
        <div className="forms-triple-input">
          <div>
            <label for="title">Nome</label>
            <input
              id="title"
              type="text"
              placeholder="Nome do Conteúdo..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label for="content_category">Conteúdo</label>
            <input
              id="content_category"
              type="text"
              placeholder="Especifica o Conteúdo..."
              value={formData.content_category}
              onChange={(e) =>
                setFormData({ ...formData, content_category: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label for="language">Idioma</label>
            <input
              id="language"
              type="text"
              placeholder="Idioma do conteúdo original..."
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>
      <button className="forms-button" type="button" onClick={handleNextStep}>
        Continuar
      </button>
    </div>
  );
}
