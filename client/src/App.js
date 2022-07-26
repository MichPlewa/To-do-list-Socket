import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);
    console.log('effect');
    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTask(id));
    socket.on('updataData', (allTasks) => {
      console.log('appdata');
      updataData(allTasks);
    });
  }, [io]);

  const submitForm = (e) => {
    e.preventDefault();
    const id = shortid();
    addTask({ name: taskName, id });
    socket.emit('addTask', { name: taskName, id });
    setTaskName('');
  };

  const updataData = (allTasks) => setTasks(allTasks);

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const removeTask = (id, isLocal) => {
    setTasks((tasks) =>
      tasks.filter((item) => {
        console.log(item, id);
        return item.id !== id;
      })
    );
    console.log('funkca do usunięcia', tasks);
    console.log('usunięte', isLocal);
    if (isLocal) {
      console.log('local', id);
      socket.emit('removeTask', id);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((item) => (
            <li key={item.id} className="tasks">
              {item.name}
              {'  '}
              <button
                className="btn btn--red"
                onClick={() => {
                  removeTask(item.id, true);
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form
          id="add-task-form"
          onSubmit={(e) => {
            submitForm(e);
          }}
        >
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value);
            }}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
