'use client';

import '@/styles/components/Content_Cards_Container.scss';

import { useCallback } from 'react';
import Content_Card from '@/components/Content_Card';

import { useDispatch } from 'react-redux';
import { updateItem } from '@/slicers/dataSlice';

export default function Content_Cards_Container({ data }) {
  const dispatch = useDispatch();

  const toggleSaved = useCallback(async (item) => {
    const saved = !item.saved;
    dispatch(updateItem({ ...item, saved })); // do it right away
    try {
      const url = `${window.location.protocol}//${window.location.hostname}:3001/content/${item.id}`;
      let res = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saved,
        }),
      });

      // Update with the new value again, to ensure we have the right data
      // in case there is no technical error (might be a logic error when saving)
      // so it gets the actual value that is on the database
      const responseData = await res.json();
      console.log(responseData);
      dispatch(updateItem(responseData));
    } catch (e) {
      console.error('Could not save content:', e);
      // Revert
      dispatch(updateItem({ ...item, saved: !saved })); // do it right away
    }
  });

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
            toggleSaved={() => {
              toggleSaved(item);
            }}
          />
        ))}
      </div>
    </div>
  );
}
