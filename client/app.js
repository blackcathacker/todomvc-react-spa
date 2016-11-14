import React from 'react';
import ReactDOM from 'react-dom';
import TaskListItem from './task-list-item';
import cn from 'classnames';

var ENTER_KEY = 13;
var ESC_KEY = 27;

class App extends React.Component {
  constructor() {
    super();
    this.state = { taskList: [] };
  }

  componentDidMount() {
    fetch('/api/task-list')
      .then(response => response.json())
      .then(taskList => this.setState({taskList}))
  }

  onUpdate = (idx, task, value) => {
    this.persistChanges(idx, task, { task : value });
  }

  onToggle = (idx, task) => {
    this.persistChanges(idx, task, { complete : !task.complete })
  }

  onToggleAll = (e) => {
    this.state.taskList.forEach((task, idx) =>
      this.persistChanges(idx, task, { complete : e.target.checked }));
  }

  onDelete = (idx, task) => {
    fetch(`/api/task-list/${task.id}`, {
      method: 'DELETE',
    }).then(response => {
      if (response.ok) {
        this.setState({
          taskList : [
            ...this.state.taskList.slice(0, idx),
            ...this.state.taskList.slice(idx + 1)
          ]
        });
      }
    })
  }

  persistChanges = (idx, task, changes) => {
    const body = JSON.stringify(changes);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', body.length);
    fetch(`/api/task-list/${task.id}`, {
      method: 'PUT',
      body,
      headers
    }).then(response => {
      if (response.ok) {
        this.setState({
          taskList : [
            ...this.state.taskList.slice(0, idx),
            {...task, ...changes},
            ...this.state.taskList.slice(idx + 1)
          ],
          editing: -1
        })
      }
    })
  }

  onEdit = (index) => {
    this.setState({editing: index});
  }

  onCancel = () => {
    this.setState({editing: -1});
  }

  handleNewTodoChange = (e) => {
    this.setState({newTodo : e.target.value});
  }

  handleNewTodoKeyDown = (e) => {
    if (e.which === ENTER_KEY) {
      const changes = { task : this.state.newTodo, complete : false };
      const body = JSON.stringify(changes);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Content-Length', body.length);
      fetch(`/api/task-list/`, {
        method: 'POST',
        body,
        headers
      }).then(response => response.json())
      .then(newTask => {
        if (newTask) {
          this.setState({
            taskList : [
              ...this.state.taskList,
              newTask
            ],
            newTodo: ''
          });
        }
      });
    }
  }

  setFilter = (filter) => {
    this.setState({filter})
  }

  render() {
    return (
      <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input className="new-todo"
              placeholder="What needs to be done?"
              value={this.state.newTodo}
              onChange={this.handleNewTodoChange}
              onKeyDown={this.handleNewTodoKeyDown}
            />
          </header>
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.onToggleAll}
            checked={this.state.taskList.reduce((val, task) => val && task.complete, true)}
          />
          <ul className="todo-list">
            {this.state.taskList.map((task, idx) => ({...task, idx}))
              .filter(task => this.state.filter === undefined || this.state.filter === task.complete)
              .map(task =>
              <TaskListItem
                key={task.idx}
                task={task}
                editing={task.idx === this.state.editing}
                onEdit={this.onEdit.bind(this, task.idx)}
                onCancel={this.onCancel}
                onSave={this.onUpdate.bind(this, task.idx, task)}
                onToggle={this.onToggle.bind(this, task.idx, task)}
                onDelete={this.onDelete.bind(this, task.idx, task)}
              />)}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>1</strong> item left
          </span>
          <ul className="filters">
            <li><a href="#"
              className={cn({selected : this.state.filter === undefined})}
              onClick={this.setFilter.bind(this, undefined)}
            >
              All
            </a></li>
            <li><a href="#"
              className={cn({selected : this.state.filter === false})}
              onClick={this.setFilter.bind(this, false)}
            >
              Active
            </a></li>
            <li><a href="#"
              className={cn({selected : this.state.filter === true})}
              onClick={this.setFilter.bind(this, true)}
            >
              Completed
            </a></li>
          </ul>
        </footer>
        </section>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
