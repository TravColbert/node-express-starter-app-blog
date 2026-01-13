const fs = require("fs");
const path = require("path");
const express = require("express");

module.exports = function (app, appInstance) {
  const staticPath = path.join(__dirname, "..", "articles", "public");
  console.debug(`***** ${staticPath}`);
  if (fs.existsSync(staticPath)) {
    console.debug(`^^^ it's there!`);
    app.locals.debug &&
      console.debug(
        `Loading static config for: ${appInstance} at ${staticPath}`,
      );
    app.use(express.static(staticPath));
  }
};
