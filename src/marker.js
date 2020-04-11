import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Mark = styled.div`
  display: block;
  background: rgb(0, 0, 0, 0.3);
  border-radius: 5px;
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  z-index: 2;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: grab;
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
  background: rgb(0, 0, 0, 0.7);
  border-radius: 0px 5px 5px 5px;
  min-width: 180px;
  padding: 10px;
  display: block;
  position: absolute;
  top: 0;
  left: 100%;
  color: rgb(255, 255, 255);
  cursor: default;
  p {
    margin: 2px;
    margin-top: 3px;
    display: block;
    cursor: text;
  }
  textarea {
    font-family: 'Helvetica', sans-serif;
    font-size: 14px;
    color: rgb(255, 255, 255);
    border: 0;
    padding: 2px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.2);
    width: calc(100% - 4px);
    resize: none;
  }
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
  }
`;

const Button = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: rgb(255, 255, 255);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  margin: 2px 2px 0 0;
  padding: 2px 5px;
  appearance: none;
  font-size: 10px;
  flex: 1;
  &:hover {
    background: rgba(0, 0, 0, 1);
  }
`;

const Marker = ({
  xPercent,
  yPercent,
  space,
  id,
  message,
  setMessage,
  removeMarker,
  pinned,
  togglePin
}) => {
  const [mode, setMode] = useState('hide');
  const [toolTip, setTooltip] = useState(message);
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isHide = mode === 'hide';
  const isShowing = isView || (isHide && pinned);
  const tooltipRef = useRef();
  const textFieldRef = useRef();
  useEffect(() => {
    if (isEdit && textFieldRef && textFieldRef.current) {
      textFieldRef.current.style.height = '0px';
      const scrollHeight = textFieldRef.current.scrollHeight;
      textFieldRef.current.style.height = scrollHeight + 'px';
    }
  }, [toolTip, isEdit]);
  return (
    <Mark
      draggable={true}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
        height: `${space}px`,
        width: `${space}px`,
        ...(isEdit || isShowing
          ? { zIndex: 3, borderRadius: '5px 0 0 5px' }
          : {})
      }}
      onDragStart={(e) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('application/tater', id);
      }}
      onMouseEnter={() => {
        if (isHide) setMode('view');
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
            ref={textFieldRef}
            placeholder="Add a note..."
            value={toolTip}
            onChange={(e) => setTooltip(e.target.value)}
          />
          <div className="toolbar">
            <Button
              onClick={() => {
                setMessage({ message: toolTip, id });
                setMode('view');
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setTooltip(message);
                setMode('view');
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => togglePin(id)}>
              {pinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button onClick={() => removeMarker(id)}>Remove</Button>
          </div>
        </Tooltip>
      ) : isShowing ? (
        <Tooltip
          onClick={(e) => {
            if (isView) {
              setMode('edit');
            }
          }}
        >
          <p>{toolTip || 'Click on this message to edit'}</p>
        </Tooltip>
      ) : null}
    </Mark>
  );
};

export default Marker;
