'use client';

import '@/styles/components/Content_Cards_Container.scss';

import Content_Card from '@/components/Content_Card';

export default function Content_Cards_Container({ data }) {
  return (
    <div className="content-cards-area">
      <div className="content-cards-container">
        {data.map((item, index) => (
          <Content_Card
            key={index}
            type={item.content_typology}
            title={item.title}
            date={item.publish_date}
            saved={item.saved}
            sections={item.sections}
          />
        ))}
      </div>
    </div>
  );
}
