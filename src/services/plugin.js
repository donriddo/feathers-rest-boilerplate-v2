
module.exports = exports = function plugin(schema) {
  schema.add({ isDeleted: { type: Boolean, default: false } });
  schema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });
};
