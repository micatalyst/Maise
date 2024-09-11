"use client";

import { useState } from "react";

import Text_Forms_Step1 from "@/components/Texto/Text_Forms_Step1";
import Text_Forms_Step2 from "@/components/Texto/Text_Forms_Step2";

export default function Texto() {
  const [step, setStep] = useState(1);
  const [nextStep, setNextStep] = useState(false);
  const [tempFile, setTempFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_category: "",
    original_content_language: "",
    created_content_language: "",
    original_content_uploaded: "",
    sections: [],
  });

  const handleNextStep = () => {
    if (nextStep) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Este código é importante para evitar que o utilizador envie o formulário sem querer ao precionar "enter" enquanto prencher algum input dentro do forms.

    /* const response = await fetch('/api/submitForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Form submitted successfully!');
    } else {
      alert('Failed to submit form');
    } */
  };

  return (
    <main className="main">
      <h1>Conteúdo de Texto</h1>
      <form onSubmit={handleSubmit}>
        {step === 2 && (
          <Text_Forms_Step1
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
            setNextStep={setNextStep}
            nextStep={nextStep}
            file={tempFile}
            setFile={setTempFile}
          />
        )}
        {step === 1 && ( // trocar os numeros dos steps novamente (apenas os troquei para facilitar a edição do step 2)
          <Text_Forms_Step2
            formData={formData}
            setFormData={setFormData}
            handlePreviousStep={handlePreviousStep}
          />
        )}
      </form>
    </main>
  );
}
