import React from "react";
import PropTypes from "prop-types";

import classNames from "classnames";

import { isEmpty, contains, map, sortBy } from "ramda";

import { Droppable } from "react-beautiful-dnd";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrashAlt";

import AvailableField from "./AvailableField";

function AvailableFieldList({
  style,
  fields,
  getFieldId,
  droppableId,
  dragState
}) {
  return (
    <Droppable droppableId={droppableId} type="Field">
      {(provided, snapshot) => {

        const dragForeign = isDraggingForeign(dragState, fields, getFieldId);

        return (
          <div
            className={classNames(style.listContainer, {
              [style.dragForeign]: dragForeign
            })}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {!isEmpty(fields) &&
              sortBy(getFieldId, fields).map((field, index) => {
                const id = getFieldId(field);
                return (
                  <AvailableField
                    style={style}
                    key={id}
                    draggableId={id}
                    displayName={field.displayName}
                    index={index}
                    withPlaceholder={false}
                  />
                );
              })}

            {dragForeign && (
              <div className={style.dragForeignContainer}>
                <span>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </div>
            )}
          </div>
        );
      }}
    </Droppable>
  );
}

const isDraggingForeign = (dragState, fields, getFieldId) => {
  return dragState &&
    dragState.draggableId &&
    !contains(dragState.draggableId, map(getFieldId, fields));
}


AvailableFieldList.defaultProps = {
  fields: []
};

const StyleProps = PropTypes.shape({
  listContainer: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  groupBy: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired
});

AvailableFieldList.propTypes = {
  style: StyleProps.isRequired,
  fields: PropTypes.array,
  getFieldId: PropTypes.func.isRequired,
  droppableId: PropTypes.string.isRequired
};

export default AvailableFieldList;
