import React, { useRef, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import emojis from './emojis';

const Mark = styled.div`
  display: block;
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  z-index: 2;
  padding-right: 10px;
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
  left: calc(100% - 1px);
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
  isPinned,
  togglePin
}) => {
  const reducer = (state, { type, payload }) => {
    const newState = { ...state };
    switch (type) {
      case 'hover':
        return { ...newState, isHover: payload };
      case 'blur':
        const { isEdit, isIconPicker, ...remaining } = newState;
        return {
          ...remaining,
          isBlurred: true,
          unBlur: { isEdit, isIconPicker },
          ...(isEdit ? { tooltip: message } : {})
        };
      case 'change':
        return { ...newState, tooltip: payload };
      case 'edit':
        return {
          ...newState,
          isBlurred: false,
          unBlur: {},
          isEdit: payload === 'open',
          isHover: payload === 'open',
          isDraggable: payload !== 'open',
          ...(payload === 'cancel' ? { tooltip: message } : {})
        };
      case 'icon':
        return {
          ...newState,
          isBlurred: false,
          unBlur: {},
          isIconPicker: payload,
          isEdit: false
        };
      default:
        return newState;
    }
  };
  const [marker, dispatch] = useReducer(reducer, {
    isHover: false,
    isEdit: !message,
    isIconPicker: false,
    isDraggable: true,
    isBlurred: false,
    unBlur: {},
    tooltip: message
  });
  const {
    isHover,
    isEdit,
    isIconPicker,
    isDraggable,
    isBlurred,
    tooltip,
    unBlur = {}
  } = marker;
  const isView = (isHover || isPinned) && !isEdit && !isIconPicker;
  const tooltipRef = useRef();
  const textFieldRef = useRef();
  useEffect(() => {
    if (isEdit && textFieldRef && textFieldRef.current) {
      textFieldRef.current.style.height = '0px';
      const scrollHeight = textFieldRef.current.scrollHeight;
      textFieldRef.current.style.height = scrollHeight + 'px';
      textFieldRef.current.focus();
    }
  }, [tooltip, isEdit, isIconPicker]);
  return (
    <Mark
      draggable={isDraggable} // draggable breaks textboxes in Firefox, so toggle off while editing
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
        height: `${space}px`,
        width: `${space}px`,
        zIndex: isHover ? 5 : isEdit || isIconPicker ? 4 : isPinned ? 3 : 2
      }}
      onDragStart={(e) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('application/tater', id);
      }}
      onMouseEnter={() => dispatch({ type: 'hover', payload: true })}
      onMouseLeave={() => dispatch({ type: 'hover', payload: false })}
      onBlur={() => {
        setTimeout(() => {
          // Wait before dispatching blur so clicks on removed elements are handled
          dispatch({ type: 'blur', payload: tooltip });
        }, 200);
      }}
    >
      <Icon
        style={{ fontSize: `${space - 4}px` }}
        onClick={() => {
          const trueEdit = isBlurred ? unBlur.isEdit : isEdit;
          const trueIcon = isBlurred ? unBlur.isIconPicker : isIconPicker;
          if (trueEdit || trueIcon) {
            setTimeout(() => {
              // Wait for blur to complete so this change doesn't get overwritten
              dispatch({ type: 'icon', payload: !trueIcon });
            }, 200);
          } else {
            dispatch({ type: 'edit', payload: 'open' });
          }
        }}
      >
        {String.fromCodePoint(...icon)}
      </Icon>
      {isEdit && !isIconPicker ? (
        <Tooltip ref={tooltipRef}>
          <textarea
            ref={textFieldRef}
            placeholder="Add a note..."
            value={marker.tooltip}
            onChange={(e) =>
              dispatch({ type: 'change', payload: e.target.value })
            }
          />
          <div className="toolbar">
            <Button
              onClick={() => {
                setMessage({ message: marker.tooltip, id });
                dispatch({ type: 'edit', payload: 'save' });
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => dispatch({ type: 'edit', payload: 'cancel' })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                togglePin(id);
                dispatch({ type: 'edit', payload: 'cancel' });
              }}
            >
              {isPinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button onClick={() => removeMarker(id)}>Remove</Button>
          </div>
        </Tooltip>
      ) : isView ? (
        <Tooltip onClick={() => dispatch({ type: 'edit', payload: 'open' })}>
          <p>{marker.tooltip || 'Click to add a message'}</p>
        </Tooltip>
      ) : isIconPicker ? (
        <Tooltip>
          <p style={{ textAlign: 'center', cursor: 'pointer' }}>
            {emojis.map((emoji) => (
              <span
                key={emoji.name}
                onClick={() => {
                  setMarkerIcon(id, emoji.code);
                  dispatch({ type: 'icon', payload: false });
                }}
                className="emoji"
                style={{ fontSize: `${space - 4}px` }}
              >
                {String.fromCodePoint(...emoji.code)}
              </span>
            ))}
            <textarea // This is a hack to trigger onBlur when a user clicks outside of the tooltip
              autoFocus
              style={{
                appearance: 'none',
                background: 'none',
                border: 0,
                height: '0px',
                width: '0px'
              }}
            />
          </p>
        </Tooltip>
      ) : null}
    </Mark>
  );
};

export default Marker;
