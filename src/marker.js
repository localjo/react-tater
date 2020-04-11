import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import emojis from './emojis';

const Mark = styled.div`
  display: block;
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
  font-family: Apple Color Emoji, sans-serif;
  text-align: center;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  user-select: none;
`;

const Tooltip = styled.div`
  background: rgb(0, 0, 0, 0.7);
  border-radius: 5px;
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
    pointer-events: auto;
    user-select: auto;
  }
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
  }
  .emoji {
    font-family: Apple Color Emoji, sans-serif;
    display: inline-block;
    margin: 1px;
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
  icon = emojis[0].code,
  message,
  setMessage,
  setMarkerIcon,
  removeMarker,
  pinned,
  togglePin
}) => {
  const [mode, setMode] = useState('hide');
  const [toolTip, setTooltip] = useState(message);
  const [isDraggable, toggleDraggable] = useState(true);
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isHide = mode === 'hide';
  const isIconPicker = mode === 'icon';
  const isShowing = isView || (isHide && pinned);
  const tooltipRef = useRef();
  const textFieldRef = useRef();
  useEffect(() => {
    if (isEdit && textFieldRef && textFieldRef.current) {
      textFieldRef.current.style.height = '0px';
      const scrollHeight = textFieldRef.current.scrollHeight;
      textFieldRef.current.style.height = scrollHeight + 'px';
      textFieldRef.current.focus();
    }
  }, [toolTip, isEdit]);
  const iconCharacter = String.fromCodePoint(...icon);
  return (
    <Mark
      draggable={isDraggable}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
        height: `${space}px`,
        width: `${space}px`,
        ...(isEdit || isShowing ? { zIndex: 3 } : {})
      }}
      onDragStart={(e) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('application/tater', id);
      }}
      onMouseEnter={() => {
        if (isHide) setMode('view');
      }}
      onMouseLeave={() => {
        if (isView) setMode('hide');
      }}
      onClick={(e) => {
        setMode(isIconPicker ? 'hide' : 'icon');
        e.stopPropagation();
      }}
    >
      <Icon style={{ fontSize: `${space - 4}px` }}>{iconCharacter}</Icon>
      {isEdit ? (
        <Tooltip
          ref={tooltipRef}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <textarea
            ref={textFieldRef}
            placeholder="Add a note..."
            value={toolTip}
            onFocus={(e) => toggleDraggable(false)}
            onBlur={(e) => toggleDraggable(true)}
            onChange={(e) => setTooltip(e.target.value)}
          />
          <div className="toolbar">
            <Button
              onClick={(e) => {
                setMessage({ message: toolTip, id });
                setMode('view');
                e.stopPropagation();
              }}
            >
              Save
            </Button>
            <Button
              onClick={(e) => {
                setTooltip(message);
                setMode('view');
                e.stopPropagation();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                togglePin(id);
                e.stopPropagation();
              }}
            >
              {pinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button
              onClick={(e) => {
                removeMarker(id);
                e.stopPropagation();
              }}
            >
              Remove
            </Button>
          </div>
        </Tooltip>
      ) : isShowing ? (
        <Tooltip
          onClick={(e) => {
            setMode('edit');
            e.stopPropagation();
          }}
        >
          <p>{toolTip || 'Click on this message to edit'}</p>
        </Tooltip>
      ) : isIconPicker ? (
        <Tooltip
          onClick={(e) => {
            setMode('hide');
            e.stopPropagation();
          }}
        >
          <p style={{ textAlign: 'center', cursor: 'pointer' }}>
            {emojis.map((emoji) => (
              <span
                key={emoji.name}
                onClick={(e) => {
                  setMarkerIcon(id, emoji.code);
                }}
                className="emoji"
                style={{ fontSize: `${space - 4}px` }}
              >
                {String.fromCodePoint(...emoji.code)}
              </span>
            ))}
          </p>
        </Tooltip>
      ) : null}
    </Mark>
  );
};

export default Marker;
