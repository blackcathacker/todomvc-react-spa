import express from 'express';
import TaskList from '../models/task-list';
import wrapAsync from './wrap-async';
import mongoose from 'mongoose';
const router = express.Router();

async function getAll(req, res) {
  const taskList = await TaskList.find();
  return res.send(taskList);
}

async function get(req, res) {
  const task = await TaskList.findOne({id : req.params.id});
  if (task) {
    return res.send(task);
  } else {
    return res.status(401).send('not found');
  }
}

async function post(req, res) {
  const newTask = new TaskList({id : new mongoose.Types.ObjectId(), ...req.body});
  console.log('adding new task', newTask);
  await newTask.save();
  return res.send(newTask);
}

async function put(req, res) {
  const task = await TaskList.findOne({id: req.params.id});
  if (task) {
    Object.assign(task, req.body);
    console.log('updating task ', req.params.id, task.toObject());
    await task.save();
    return res.status(201).send('updated');
  } else {
    return res.status(401).send('not found');
  }
}

async function remove(req, res) {
  const task = await TaskList.findOne({id: req.params.id});
  if (task) {

    console.log('deleting task ', req.params.id, task.toObject());
    await task.remove();
    return res.status(201).send('updated');
  } else {
    return res.status(401).send('not found');
  }
}

router.get('/', wrapAsync(getAll));
router.post('/', wrapAsync(post));
router.get('/:id', wrapAsync(get));
router.put('/:id', wrapAsync(put));
router.delete('/:id', wrapAsync(remove));

export default router;
