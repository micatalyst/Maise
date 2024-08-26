"use client";

import "@/styles/components/Content_Cards_Container.scss";

import Content_Card from "@/components/Content_Card";
import Data from "@/Data/Data";

export default function Content_Cards_Container() {
  return (
    <div className="content-cards-area">
      <div className="content-cards-container">
        {Data.map((item, index) => (
          <Content_Card
            key={index}
            type={item.content_typology}
            title={item.title}
            date={item.publish_date}
            saved={item.saved}
          />
        ))}
      </div>
    </div>
  );
}
