export const findOne = async (model, filter) => {
  return await model.findOne(filter);
};

export const find = async (model, filter = {}, select = "", options = {}) => {
  return await model.find(filter).select(select).limit(options.limit || 100);
};

export const create = async (model, data) => {
  const doc = new model(data);
  return await doc.save();
};

export const updateOne = async (model, filter, update) => {
  return await model.updateOne(filter, update);
};

export const deleteOne = async (model, filter) => {
  return await model.deleteOne(filter);
};