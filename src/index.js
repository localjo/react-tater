import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useLocalStorage from './useLocalStorage';
import Marker from './marker';
import { findSafePosition } from './position';

const TaterFrame = styled.div`
  display: inline-block;
  position: relative;
`;

const useGrid = (space) => {
  const ref = useRef();
  const [grid, setGrid] = useState({});

  const measureGrid = () => {
    const { height, width, left, top } =
      ref && ref.current ? ref.current.getBoundingClientRect() : {};
    return setGrid({ height, width, left, top, space });
  };

  useEffect(() => {
    measureGrid();
    window.addEventListener('resize', measureGrid);
    return () => window.removeEventListener('resize', measureGrid);
  }, []);

  return [grid, ref];
};

const Tater = ({ children: child, options = {} }) => {
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
    position: relative;
    ${gridVisible
      ? `&:after {
      content: "Grid size: ${grid.space}";
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
      const coordinates = { x: e.clientX, y: e.clientY };
      const position = findSafePosition(
        coordinates,
        grid,
        Object.values(markers)
      );
      if (position) {
        addMarker(position);
      } else {
        window.alert(
          "There's no room for an annotation here, try another spot."
        );
      }
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('application/tater'), 10);
    const coordinates = { x: e.clientX, y: e.clientY };
    const position = findSafePosition(
      coordinates,
      grid,
      Object.values(markers)
    );
    if (position) {
      setMarkerPosition(id, position);
    } else {
      window.alert("There's no room for an annotation here, try another spot.");
    }
  };
  const addMarker = ({ xPercent, yPercent }) => {
    const newId =
      markerList.length > 0 ? Math.max.apply(Math, markerList) + 1 : 1;
    const newMarkers = { ...markers };
    newMarkers[newId] = { xPercent, yPercent, icon: [0x1f954] };
    setMarkers(newMarkers);
  };
  const setMarkerPosition = (id, coords) => {
    const newMarkers = { ...markers };
    newMarkers[id] = { ...newMarkers[id], ...coords };
    setMarkers(newMarkers);
  };
  const setMarkerIcon = (id, icon) => {
    const newMarkers = { ...markers };
    newMarkers[id] = { ...newMarkers[id], icon };
    setMarkers(newMarkers);
  };
  const setMessage = ({ message, id }) => {
    const newMarkers = { ...markers };
    newMarkers[id].message = message;
    setMarkers(newMarkers);
  };
  const togglePin = (id) => {
    const newMarkers = { ...markers };
    newMarkers[id].pinned = !markers[id].pinned;
    setMarkers(newMarkers);
  };
  const removeMarker = (id) => {
    const newMarkers = { ...markers };
    delete newMarkers[id];
    setMarkers(newMarkers);
  };

  return (
    <TaterFrame
      onClick={(e) => handleClick(e)}
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => e.preventDefault()} // Needed to enable drag and drop
    >
      {markerList.map((id) => {
        return (
          <Marker
            key={id}
            id={id}
            space={space}
            {...markers[id]}
            setMessage={(msg) => setMessage(msg)}
            setMarkerIcon={(id, icon) => setMarkerIcon(id, icon)}
            removeMarker={(id) => removeMarker(id)}
            togglePin={(id) => togglePin(id)}
          />
        );
      })}
      <TaterGrid ref={gridWrapper}>{child}</TaterGrid>
    </TaterFrame>
  );
};

export default Tater;
