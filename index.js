const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const scraper = require("./gogo");
const fs = require("fs");
app.use(express.static("public"));

const api = require("anime-vostfr");
const cloudscraper = require("cloudscraper");
const e = require("express");
const req = require("express/lib/request");

app.get("/api/search", async (req, res) => {
	const query = req.query.q;
	let raw = await scraper.search(query);
	console.log(raw)
	res.json(raw);
});

app.get("/api/popular", async (req, res) => {
	const query = req.query.q;
	let raw = await scraper.newEpisodes(query);
	res.json(raw);
});

app.get("/anime", (req, res) => {
	res.redirect("/");
});

app.get("/api/image", async (req, res) => {
	res.send(await scraper.getImage(req.query.q));
});

app.get("/api/video", async (req, res) => {
	res.json(await scraper.getSources(req.query.q));
});

app.get("/api/episodes", async (req, res) => {
	const query = req.query.q;
	let raw = await scraper.get(query);
	res.json(raw);
});

app.get("/anime/:title", async (req, res) => {
	const title = req.params.title;
	let url = "/category/" + title
	let data = await scraper.get(url);
	let truetitle = toUpper(data.title.replace(/-/g, ""));
	let image = await scraper.getImage(url);
	res.send(`
    <html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
		/>
		<link rel="stylesheet" href="../../css/global.css" />
		<link rel="stylesheet" href="../../css/header.css" />
		<link
			rel="shortcut icon"
			href="https://hub.koneko.link/cdn/icons/blue.png"
			type="image/x-icon"
		/>
		<title>neko watch | ${data.title}</title>
	</head>
    <body>
    <div class="header">
    <a href="../../" class="logo"
        >NekoWatch<span style="color: dodgerblue">;</span></a
    >
    <div class="header-right">
        <a href="../../" class="track">
            Home
        </a>
        <a href="http://track.koneko.link" class="track">Tracker</a>
    </div>
    </div>
    <div class="content">
    <div class="anime-info">
        <div class="anime-info-left">
            <img referrerpolicy="no-referrer" src="${image}" style="height:470px;"/>
        </div>
        <div class="anime-info-right">
            <h1>${data.title}</h1>
            <p>${data.description}</p>
        </div>
    </div>
    <br>
    <div class="anime-episodes">
        <div class="regular">
            <h2>Regular</h2>
            <hr>
        </div>

    </div>
    </div>
    </body>
    <script>
    var episodes = ${data.episodes}
    var title = "${req.params.title}";
    </script>
    <script src="../../js/episodeManager.js">
    </script>
    </html>
    `);
});


app.get("/view/:title", async (req, res) => {
	let title = req.params.title.split("-episode")[0];
	let videos = await scraper.getSources("/" + req.params.title)
	let url = "/category/" + title
	let data = await scraper.get(url);
	let image = await scraper.getImage(url);
	let number = req.params.title.split("episode-")[1];
	res.send(`
    <html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script
			src="https://kit.fontawesome.com/11fc85fa63.js"
			crossorigin="anonymous"
		></script>
		<link rel="stylesheet" href="../../../css/global.css" />
		<link rel="stylesheet" href="../../../css/header.css" />
		<link
			rel="shortcut icon"
			href="https://hub.koneko.link/cdn/icons/purple.png"
			type="image/x-icon"
		/>
		<title>NekoWatch</title>
	</head>
    <body>
    <div class="header">
    <a href="../../" class="logo"
        >NekoWatch<span style="color: dodgerblue">;</span></a
    >
    <div class="header-right">
        <a href="../../" class="track">
            Home
        </a>
        <a href="http://track.koneko.link" class="track">Tracker</a>
    </div>
    </div>
	<br>
    <div class="content">
    <div class="anime-info">
        <div class="anime-info-left">
        <img referrerpolicy="no-referrer" src="${image}" style="height:120px; width:90px;"/>
        </div>
        <div class="anime-info-right">
            <h1>${data.title} Episode ${number}</h1>
        </div>
    </div>
    <div class="episode-container" id="ep-cont" style="text-align:center">
    </div>
	<br>
    <div class="episode-controls" style="text-align:center">
	</div>
    </body>
    <script>
	var title = "${title}";
	var videos = ${JSON.stringify(videos)};
	var number = ${number};
	var max = ${data.episodes};
    </script>
    <script src="/js/videoManager.js"></script>
    </html>
    `);
});
//scrolling="no" frameborder="0" width="700" height="430" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"

app.listen(port, () => console.log(`Listening on port ${port}`));

function toUpper (str) {
	return str
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word[0].toUpperCase() + word.substr(1);
		})
		.join(" ");
}

function getEpisode (array, filterid) {
	data.episodes.forEach((item) => {
		if (item.id != req.params.id) return;
		episode.number = array.indexOf(item) + 1;
		episode.index = array.indexOf(item);
		if (item.index == 0) {
			episode.prev = null;
		} else {
			episode.prev = array[item.index - 1];
		}
		if (item.index == array.length) {
			episode.next = null;
		} else {
			episode.next = array[episode.index + 1];
		}
		episode.title = item.title;
		episode.subtitle = item.subtitle;
		return episode;
	});
}
