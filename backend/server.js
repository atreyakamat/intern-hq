const { createApp } = require('./app');
const PORT = process.env.PORT || 5000;
const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[InternSieve] Server running on port ${PORT}`);
  });
}

module.exports = app;
