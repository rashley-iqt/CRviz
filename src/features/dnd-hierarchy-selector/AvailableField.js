import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

function AvailableField({ style, displayName, index, draggableId }) {
  return (
    <Draggable draggableId={draggableId} type="Field" index={index}>
      {(provided, snapshot) => {
        return (
          <span className={style.draggableContainer}>
            <span
              className={style.field}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                transform: snapshot.isDragging
                  ? provided.draggableProps.style.transform
                  : "none"
              }}
            >
              {displayName}
            </span>
          </span>
        );
      }}
    </Draggable>
  );
}

const StyleProps = PropTypes.shape({
  draggableContainer: PropTypes.string.isRequired
});

AvailableField.propTypes = {
  style: StyleProps.isRequired,
  displayName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  draggableId: PropTypes.string.isRequired
};

export default AvailableField;
