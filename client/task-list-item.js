import React from 'react';
import cn from 'classnames';

var ENTER_KEY = 13;
var ESC_KEY = 27;

export default class TaskListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editValue : props.task.task}
  }

  onChange = (e) => {
    this.setState({editValue : e.target.value});
  }

  onKeyDown = (e) => {
    if (e.which === ENTER_KEY) {
      this.props.onSave(this.state.editValue.trim());
    } else if (e.which === ESC_KEY) {
      this.onCancel();
    }
  }

  onCancel = () => {
    this.props.onCancel();
    this.setState({editValue : this.props.task.task});
  }

  componentDidUpdate = prevProps => {
    if (!prevProps.editing && this.props.editing) {
      const input = this.textInput;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  render() {
    const {
      task,
      editing,
      onEdit,
      onCancel,
      onDelete,
      onToggle } = this.props;
    return (
      <li className={cn({editing, completed: task.complete})}>
        <div className="view">
          <input className="toggle" type="checkbox" onChange={onToggle} checked={task.complete}/>
          <label onDoubleClick={onEdit}>{task.task}</label>
          <button className="destroy" onClick={onDelete}/>
        </div>
        <input
          ref={(input) => this.textInput = input}
          className="edit"
          onChange={this.onChange}
          value={this.state.editValue}
          onKeyDown={this.onKeyDown}
          onBlur={onCancel}
        />
      </li>
    );
  }
}
