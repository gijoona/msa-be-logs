const defaults = {
  "ip": process.env.NODE_ENV === 'development' ? 'localhost' : '35.200.103.250'
};

const distribute = Object.assign(
  {},
  defaults,
  { "port": 9000 });
const service = Object.assign(
  {},
  defaults,
  { "port": 9040 });
const redis = Object.assign(
  {},
  defaults,
  { "ip": "35.200.103.250", "port": 6379 });
const database = Object.assign(
  {},
  defaults,
  {
    "ip": "35.200.103.250",
    "port": null,
    "username": "root",
    "password": "",
    "schima": "monolithic"
  });
const elastic = Object.assign(
  {},
  defaults,
  {
    "port": 9200
  }
);

const setting = {
  "service": service,
  "distribute": distribute,
  "redis": redis,
  "database": database,
  "elastic": elastic
};

exports.setting = setting;
