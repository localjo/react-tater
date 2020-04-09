import React from "react";
import styled from "styled-components";
import useLocalStorage from "./useLocalStorage";
import Marker from "./marker";

const TaterFrame = styled.div`
  outline: 2px dotted green;
  display: inline-block;
  position: relative;
`;

const Tater = ({ children: child, name }) => {
  if (Array.isArray(child)) {
    throw new Error("Tater only supports wrapping a single element");
  }
  const childWrapper = React.createRef();
  const ns = name || child.type.displayName;
  const [markers, setMarkers] = useLocalStorage(`${ns}-markers`, {});
  const markerList = Object.keys(markers);
  const handleClick = e => {
    const { clientX, clientY, target } = e;
    const isChildClick = childWrapper.current.contains(target);
    if (isChildClick) {
      const {
        left,
        top,
        width,
        height
      } = childWrapper.current.getBoundingClientRect();
      addMarker({
        x: ((clientX - left) / width) * 100,
        y: ((clientY - top) / height) * 100,
        open: true
      });
    }
  };
  const addMarker = ({ x, y }) => {
    const newId =
      markerList.length > 0 ? Math.max.apply(Math, markerList) + 1 : 1;
    const newMarkers = { ...markers };
    newMarkers[newId] = { x, y };
    setMarkers(newMarkers);
  };
  const setMessage = ({ message, id }) => {
    const newMarkers = { ...markers };
    newMarkers[id].message = message;
    setMarkers(newMarkers);
  };
  const removeMarker = id => {
    const newMarkers = { ...markers };
    delete newMarkers[id];
    setMarkers(newMarkers);
  };

  return (
    <TaterFrame onClick={e => handleClick(e)}>
      {markerList.map(id => {
        return (
          <Marker
            key={id}
            id={id}
            {...markers[id]}
            setMessage={msg => setMessage(msg)}
            removeMarker={id => removeMarker(id)}
          />
        );
      })}
      <div ref={childWrapper}>{child}</div>
    </TaterFrame>
  );
};

export default Tater;
