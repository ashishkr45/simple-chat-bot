const express = require("express");
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(8000);
app.get("/", async (req, res) => {
	res.send('index.html');
})