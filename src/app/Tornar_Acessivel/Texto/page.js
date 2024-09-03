"use client";

import { useState } from "react";

import Text_Forms_Step1 from "@/components/Texto/Text_Forms_Step1";
import Text_Forms_Step2 from "@/components/Texto/Text_Forms_Step2";

export default function Texto() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_category: "",
    language: "",
    Content_Upload: "",
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    /* e.preventDefault();
    const response = await fetch('/api/submitForm', {
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
        {step === 1 && (
          <Text_Forms_Step1
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
          />
        )}
        {step === 2 && (
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
