// Middleware personalizado de aplicación: mide cuánto tarda cada petición
// y lo devuelve en la cabecera X-Response-Time.
const requestTimer = (req, res, next) => {
  const inicio = process.hrtime.bigint();
  const writeHead = res.writeHead;

  res.writeHead = function (...args) {
    const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
    res.setHeader('X-Response-Time', `${ms.toFixed(1)}ms`);
    return writeHead.apply(this, args);
  };

  next();
};

module.exports = requestTimer;
