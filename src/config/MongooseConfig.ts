import mongoose from 'mongoose';

export default () => {
  // Allows mongoose to convert 'id' property to object id as it does with _id
  const objectIdOriginalCast = mongoose.Schema.Types.ObjectId.cast();
  mongoose.Schema.Types.ObjectId.cast((value) => {
    if (value.hasOwnProperty('id')) {
      return objectIdOriginalCast(value.id);
    }
    return objectIdOriginalCast(value);
  });

  return {};
};
