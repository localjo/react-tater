import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useLocalStorage from './useLocalStorage';
import Marker from './marker';
import { findSafePosition } from './position';

const TaterFrame = styled.div`
  outline: 2px dotted green;
  display: inline-block;
  position: relative;
`;

const useGrid = (space) => {
  const ref = useRef();
  const [grid, setGrid] = useState({});

  const measureGrid = () => {
    const { height, width, left, top } =
      ref && ref.current ? ref.current.getBoundingClientRect() : {};
    const rows = Math.floor(height / space);
    const cols = Math.floor(width / space);
    return setGrid({ height, width, left, top, space, rows, cols });
  };

  useEffect(() => {
    measureGrid();
    window.addEventListener('resize', measureGrid);
    return () => window.removeEventListener('resize', measureGrid);
  }, []);

  return [grid, ref];
};

const Tater = ({ children: child, options }) => {
  if (Array.isArray(child)) {
    throw new Error('Tater only supports wrapping a single element');
  }
  const { name, space = 15 } = options;
  const ns = name || child.type.displayName;
  const [markers, setMarkers] = useLocalStorage(`${ns}-markers`, {});
  // Adding grid-visible:true to local storage makes grid visible for debug
  const [gridVisible] = useLocalStorage(`grid-visible`, false);
  const [grid, gridWrapper] = useGrid(space);
  const markerList = Object.keys(markers);
  const TaterGrid = styled.div`
    outline: 2px dotted red;
    position: relative;
    ${gridVisible
      ? `&:after {
      content: "${grid.cols}x${grid.rows}";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-size: ${grid.space}px ${grid.space}px;
      background-image:
        linear-gradient(to right, grey 1px, transparent 1px),
        linear-gradient(to bottom, grey 1px, transparent 1px);
    }`
      : ``}
  `;
  const handleClick = (e) => {
    const isChildClick = gridWrapper.current.contains(e.target);
    if (isChildClick) {
      const click = { x: e.clientX, y: e.clientY };
      const position = findSafePosition(click, grid, Object.values(markers));
      if (position) {
        addMarker({ ...position, open: true });
      } else {
        window.alert(
          "There's no room for an annotation here, try another spot."
        );
      }
    }
  };
  const addMarker = ({ xPercent, yPercent }) => {
    const newId =
      markerList.length > 0 ? Math.max.apply(Math, markerList) + 1 : 1;
    const newMarkers = { ...markers };
    newMarkers[newId] = { xPercent, yPercent };
    setMarkers(newMarkers);
  };
  const setMessage = ({ message, id }) => {
    const newMarkers = { ...markers };
    newMarkers[id].message = message;
    setMarkers(newMarkers);
  };
  const removeMarker = (id) => {
    const newMarkers = { ...markers };
    delete newMarkers[id];
    setMarkers(newMarkers);
  };

  return (
    <TaterFrame onClick={(e) => handleClick(e)}>
      {markerList.map((id) => {
        return (
          <Marker
            key={id}
            id={id}
            {...markers[id]}
            setMessage={(msg) => setMessage(msg)}
            removeMarker={(id) => removeMarker(id)}
          />
        );
      })}
      <TaterGrid ref={gridWrapper}>{child}</TaterGrid>
    </TaterFrame>
  );
};

export default Tater;
