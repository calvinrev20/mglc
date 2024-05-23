require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
      payload: {
        maxBytes: 1000000,
        parse: true,
        output: "data",
        multipart: true,
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;
    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: `Terjadi kesalahan dalam melakukan prediksi`,
      });
      newResponse.code(400);
      return newResponse;
    }
    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });
      //.code(413);
      newResponse.code(response.output.statusCode);
      return newResponse;
    }
    return h.continue;
  });
  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
