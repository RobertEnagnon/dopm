import React from "react";

const Preview = (props: { type: string }) => {
  return (
    <img
      className="droppable-element"
      draggable={true}
      unselectable="on"
      onDragStart={(e) => e.dataTransfer.setData("text/plain", "")}
      style={{ maxHeight: "200px", width: "200px", margin: "1.5em" }}
      onError={(e) =>
        (e.currentTarget.src = `https://source.unsplash.com/random/200x200`)
      }
      src={`/illustrations/${props.type}.png`}
      alt={`Previsualisation ${props.type}`}
    />
  );
};

export default Preview;
