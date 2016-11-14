import mongoose from 'mongoose';

function transform(doc, ret) {
  delete ret.__v;
  delete ret._id;
  return ret;
}

const taskListSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  task: String,
  complete: Boolean
}, { toJSON : { transform }, toObject: { transform } });

export default mongoose.connection.model('TaskList', taskListSchema);
