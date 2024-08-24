"use client";

import "@/styles/components/Content_Cards_Container.scss";

import Content_Card from "@/components/Content_Card";

export default function Content_Cards_Container() {
  return (
    <div className="content-cards-area">
      <div className="content-cards-container">
        <Content_Card />
        <Content_Card />
        <Content_Card />
        <Content_Card />
        <Content_Card />
        <Content_Card />
      </div>
    </div>
  );
}
