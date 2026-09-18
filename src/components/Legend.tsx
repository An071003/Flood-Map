import React from 'react';

export const Legend: React.FC = () => {
  return (
    <section className="legend" aria-label="Chú giải mức độ ngập">
      <span>
        <i className="safe" aria-hidden="true"></i>An toàn
      </span>
      <span>
        <i className="watch" aria-hidden="true"></i>Theo dõi
      </span>
      <span>
        <i className="warning" aria-hidden="true"></i>Cảnh báo
      </span>
      <span>
        <i className="severe" aria-hidden="true"></i>Nghiêm trọng
      </span>
    </section>
  );
};
