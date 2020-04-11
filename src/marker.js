import React, { useState } from 'react';
import styled from 'styled-components';

const Mark = styled.div`
  display: block;
  background: rgb(0, 0, 0, 0.3);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  z-index: 2;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
  text-align: left;
  &:hover {
    z-index: 3;
  }
`;

const Icon = styled.div`
  text-align: center;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  text-selection: none;
`;

const Tooltip = styled.div`
  background: rgb(0, 0, 0, 0.9);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 1);
  min-width: 150px;
  padding: 10px;
  display: block;
  position: absolute;
  top: 0;
  left: calc(100% + 10px);
  color: rgb(255, 255, 255);
  p {
    margin: 2px;
    margin-top: 3px;
    display: block;
  }
  textarea {
    font-family: 'Helvetica', sans-serif;
    font-size: 14px;
    color: rgb(255, 255, 255);
    border: 0;
    padding: 2px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.2);
    width: calc(100% - 4px);
  }
`;

const Marker = ({
  xPercent,
  yPercent,
  space,
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
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
        height: `${space}px`,
        width: `${space}px`,
        ...(isEdit ? { zIndex: 3 } : {})
      }}
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
      <Icon style={{ fontSize: `${space - 4}px` }}>&#x1F954;</Icon>
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
