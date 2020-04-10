import React, { useState } from 'react';
import styled from 'styled-components';

const Mark = styled.div`
  height: 10px;
  width: 10px;
  background: red;
  display: block;
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  z-index: 2;
`;

const Tooltip = styled.div`
  background: green;
  display: block;
  position: absolute;
  top: 0;
  left: calc(100% + 10px);
`;

const Marker = ({
  xPercent,
  yPercent,
  id,
  message,
  setMessage,
  removeMarker
}) => {
  const [mode, setMode] = useState('hide');
  const [toolTip, setTooltip] = useState(message);
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isHide = mode === 'hide';
  const tooltipRef = React.createRef();
  return (
    <Mark
      style={{ top: `${yPercent}%`, left: `${xPercent}%` }}
      onMouseEnter={() => {
        if (isHide) setMode('view');
      }}
      onClick={(e) => {
        const hasTooltip = tooltipRef && tooltipRef.current;
        const isTooltip = hasTooltip && tooltipRef.current.contains(e.target);
        if (isView) {
          setMode('edit');
        } else if (!isTooltip) {
          setMessage({ message: toolTip, id });
          setMode('view');
        }
      }}
      onMouseLeave={() => {
        if (mode === 'view') {
          setMode('hide');
        }
      }}
    >
      {isEdit ? (
        <Tooltip ref={tooltipRef}>
          <textarea
            placeholder="Add a note..."
            value={toolTip}
            onChange={(e) => setTooltip(e.target.value)}
          />
          <button onClick={() => removeMarker(id)}>Remove</button>
        </Tooltip>
      ) : isView ? (
        <Tooltip>
          <p>{toolTip || 'Click on marker to edit'}</p>
        </Tooltip>
      ) : null}
    </Mark>
  );
};

export default Marker;
