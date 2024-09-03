export default function Text_Forms_Step2({
  formData,
  setFormData,
  handlePreviousStep,
}) {
  return (
    <div>
      <h1>Teste 2</h1>
      <button
        className="forms-button"
        type="button"
        onClick={handlePreviousStep}
      >
        Voltar
      </button>
      <button className="forms-button" type="submit">
        Submit
      </button>
    </div>
  );
}
