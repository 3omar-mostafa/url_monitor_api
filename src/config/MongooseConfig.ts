import mongoose from 'mongoose';

export default () => {
  mongoose.set('toJSON', {
    virtuals: true,
    getters: true,
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  });

  mongoose.set('toObject', {
    virtuals: true,
    getters: true,
  });
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
