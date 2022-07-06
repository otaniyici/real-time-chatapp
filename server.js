const path = require("path");
const express = require("express");
const http = require("http");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
