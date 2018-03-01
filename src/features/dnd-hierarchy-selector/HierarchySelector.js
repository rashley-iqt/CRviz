import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { DragDropContext} from 'react-beautiful-dnd';

import {
  compose,
  differenceWith,
  eqBy,
  equals,
  find,
  findIndex,
  identity,
  insert,
  isNil,
  join,
  prop,
  remove
} from "ramda";

import { selectConfiguration } from "domain/dataset";
import { setHierarchyConfig, selectControls } from "domain/controls";

import SelectedFieldList from './SelectedFieldList';
import AvailableFieldList from './AvailableFieldList';

import availableFieldListStyle from './AvailableFieldList.module.css';

const SELECTED_FIELD_LIST_ID = 'SelectedFieldList';
const AVAILABLE_FIELD_LIST_ID = 'AvailableFieldList';

class HierarchySelector extends React.Component {

  state = {
    dragState: null
  }

  onDragStart = (dragStart) => {
    this.setState({
      dragState: dragStart
    });
  }

  onDragUpdate = (dragUpdate) => {
    this.setState({
      dragState: dragUpdate
    })
  }

  onDragEnd = (dropResult) => {
    const { draggableId, destination } = dropResult;
    this.setState({ dragState: null })

    if (destination === null) {
      return;
    } else if (destination.droppableId === SELECTED_FIELD_LIST_ID) {
      this.updateHierarchy(draggableId, destination.index)
    } else {
      this.removeField(draggableId);
    }
  }

  updateHierarchy = (fieldId, newIndex) => {
    const { fields } = this.props.configuration;
    const { hierarchyConfig } = this.props.controls;

    const index = findFieldIndex(hierarchyConfig, fieldId);
    if (index === newIndex) { return; }

    const hasId = (id) => (field) => getFieldId(field) === id;
    const field = find(hasId(fieldId), fields)

    const removeOld = isNil(index) ? identity : remove(index, 1);
    const addNew = insert(newIndex, field);
    const updatedHierarchy = compose(addNew, removeOld)(hierarchyConfig)

    this.props.setHierarchyConfig(updatedHierarchy)
  }

  removeField = (fieldId) => {
    const { hierarchyConfig } = this.props.controls;
    const { setHierarchyConfig } = this.props;
    const index = findFieldIndex(hierarchyConfig, fieldId);

    if (index !== null) {
      setHierarchyConfig(remove(index, 1, hierarchyConfig ))
    }
  }

  render() {
    if (this.props.configuration === null) {
      return null;
    }

    const hierarchyConfig = this.props.controls.hierarchyConfig;

    const availableFields = differenceWith(
      eqBy(getFieldId),
      this.props.configuration.fields,
      hierarchyConfig
    );

    return (
      <div>
        <DragDropContext
          onDragStart={ this.onDragStart }
          onDragUpdpate={ this.onDragUpdate }
          onDragEnd={ this.onDragEnd }>

          <SelectedFieldList
            fields={ hierarchyConfig }
            droppableId={ SELECTED_FIELD_LIST_ID }
            getFieldId={ getFieldId }
          />
          <AvailableFieldList
            style={ availableFieldListStyle }
            fields={ availableFields }
            droppableId={ AVAILABLE_FIELD_LIST_ID }
            getFieldId={ getFieldId }
            dragState={ this.state.dragState }
          />

        </DragDropContext>
      </div>
    );
  }
}

HierarchySelector.propTypes = {
  configuration: PropTypes.shape({
    fields: PropTypes.array.isRequired
  }),
  controls: PropTypes.shape({
    hierarchyConfig: PropTypes.array.isRequired
  })
};

const findFieldIndex = (list, fieldId) => {
  const matchId = compose(equals(fieldId), getFieldId)
  const index = findIndex(matchId, list)
  return index === -1 ? null : index;
}
const getFieldId = compose(join("."), prop("path"));

const mapStateToProps = (state) => ({
  configuration: selectConfiguration(state),
  controls: selectControls(state)
});

const mapDispatchToProps = {
  setHierarchyConfig
};

export default connect(mapStateToProps, mapDispatchToProps)(HierarchySelector);
