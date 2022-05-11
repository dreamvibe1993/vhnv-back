exports.corsDevConfig = {
  origin: [process.env.CLIENT_HOST, "http://192.168.0.103:3000", "http://localhost:3000"],
  credentials: true,
};
