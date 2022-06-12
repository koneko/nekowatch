const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const scraper = require("./gogo");
const fs = require("fs");
const { data } = require("cheerio/lib/api/attributes");
const login = "http://track.koneko.link/login?callback=http://watch.koneko.link/login/callback"
app.use(express.static("public"));

app.get("/api/search", async (req, res) => {
	const query = req.query.q;
	let raw = await scraper.search(query);
	res.json(raw);
});

app.get("/api/popular", async (req, res) => {
	let raw = await scraper.newEpisodes();
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

app.get("/api/genres/:genre", async (req, res) => {
	let page = req.query.page;
	if (page == null) page = 1;
	let url = `/genre/${req.params.genre}`;
	let data = await scraper.getAnimeFromGenre(url, page);
	res.json(data);
})

app.get("/api/season", async (req, res) => {
	let page = req.query.page;
	if (page == null) page = 1;
	let raw = await scraper.getSeasonAnime(page)
	res.json(raw);
})

app.get("/api/list", async (req, res) => {
	let letter = req.query.letter;
	let page = req.query.page;
	if (page == null) page = 1;
	if (letter == null) letter = "None";
	let raw = await scraper.showAnimeList(letter, page);
	res.json(raw);
})

app.get("/api/popularPage", async (req, res) => {
	let page = req.query.page;
	let raw = await scraper.newEpisodes(+page);
	res.json(raw);
});

app.get("/anime/:title", async (req, res) => {
	try {
		const title = req.params.title;
		let url = "/category/" + title
		let data = await scraper.get(url);
		let image = await scraper.getImage(url);
		let genrecombined = data.genres.join(", ");
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
			href="https://hub.koneko.link/cdn/icons/purple.png"
			type="image/x-icon"
		/>
		<title>${data.title} | NekoWatch</title>
		<meta property="og:title" content="${data.title} | NekoWatch" />
		<meta name="description" content="${data.description}" />
		<meta property="og:description" content="${data.description}" />
		<meta property="og:image" content="${image}" />
		<meta property="twitter:title" content="${data.title}" />
	</head>
    <body>
    <div class="header">
    <a href="../../" class="logo"
        >NekoWatch<span style="color: purple">;</span></a
    >
    <div class="header-right">
		<a style="margin: 0; padding: 6px;" id="top-search">
			<input type="text" placeholder="query..." id="input" />
			<button onclick="outSearch()" id="submitbtn">
				<i class="fa fa-search" style="width: 30px"></i>
			</button>
		</a>
		<a href="../../" class="track">
            Home
        </a>
        <a href="http://track.koneko.link" class="track">Tracker</a>
    </div>
    </div>
    <div class="content">
    <div class="anime-info">
        <div class="anime-info-left">
            <img referrerpolicy="no-referrer" src="${image}" style="height:470px;" id="img-src"/>
        </div>
        <div class="anime-info-right">
            <h1>${data.title}</h1>
            <p><b>Description: </b>${data.description}</p>
			<p><b>Date: </b>${data.date}</p>
			<p><b>Genres: </b>${genrecombined}</p>
			<p><b>Alt: </b>${data.alternative}</p>
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
	var datatitle = "${data.title}"
    </script>
	<script src="/js/nekolist.js">
	</script>
    <script src="../../js/episodeManager.js">
    </script>
	<script>
	function outSearch() {
		var input = document.getElementById("input").value;
		if (input == "") return
		window.location.href = "/?q=" + input
	}
	document.getElementById("input").addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			outSearch();
		}
	});
	</script>
    </html>
    `);
	} catch (e) {
		console.log(e);
		res.send(`server encountered error: ${e}`);
	}
});


app.get("/view/:title", async (req, res) => {
	try {
		let title = req.params.title.split("-episode")[0];
		let videos, url, data, image, number, trytitle;
		url = "/category/" + title
		videos = await scraper.getSources("/" + req.params.title)
		data = await scraper.get(url);
		image = await scraper.getImage(url);
		number = req.params.title.split("episode-")[1];
		if (videos.length == 0) {
			data = await scraper.get(url);
			image = await scraper.getImage(url);
			trytitle = data.title
			//replace all spaces with -
			trytitle = trytitle.replace(/\s+/g, "-");
			//replace all uppercase with lowercase
			trytitle = trytitle.toLowerCase();
			trytitle = trytitle + "-episode-" + number
			// console.log("trytitle " + trytitle)
			videos = await scraper.getSources("/" + trytitle)
		}
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
		<meta property="og:title" content="${data.title}" />
		<meta name="og:description" content="${data.title} Episode ${number} on NekoWatch." />
		<meta property="og:image" content="${image}" />
		<meta property="twitter:title" content="${data.title}" />
		<title>NekoWatch</title>
	</head>
    <body>
    <div class="header">
    <a href="../../" class="logo"
        >NekoWatch<span style="color: purple">;</span></a
    >
    <div class="header-right">
		<a style="margin: 0; padding: 6px;" id="top-search">
			<input type="text" placeholder="query..." id="input" />
			<button onclick="outSearch()" id="submitbtn">
				<i class="fa fa-search" style="width: 30px"></i>
			</button>
		</a>
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
            <h1>${data.title} Episode <span id="blocker">${number}</span></h1>
        </div>
    </div>
    <div class="episode-container" id="ep-cont" style="text-align:center">
    </div>
	<br>
    <div class="episode-controls" style="text-align:center">
	</div>
    </body>
	<script>
	function outSearch() {
		var input = document.getElementById("input").value;
		if (input == "") return
		window.location.href = "/?q=" + input
	}
	document.getElementById("input").addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			outSearch();
		}
	});
	document.getElementById("blocker").addEventListener("click", event => {
		window.location.href = "?block=true"
	})
	</script>
    <script>
	var title = "${title}";
	var videos;
	var params = new URLSearchParams(window.location.search);
	if(params.get("block") == "true") videos = [];
	else videos = ${JSON.stringify(videos)};
	var number = ${number};
	var datatitle = "${data.title}";
	var max = ${data.episodes};
    </script>
	<script src="/js/nekolist.js"></script>
    <script src="/js/videoManager.js"></script>
    </html>
    `);
	} catch (e) {
		res.send(`server encountered error: ${e}`);
	}
});

app.get("/genres", async (req, res) => {
	let genres = await scraper.getGenres();
	res.send(`
	<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script
		src="https://kit.fontawesome.com/11fc85fa63.js"
		crossorigin="anonymous"
	></script>
	<link rel="stylesheet" href="/css/global.css" />
	<link rel="stylesheet" href="/css/header.css" />
	<link
		rel="shortcut icon"
		href="https://hub.koneko.link/cdn/icons/purple.png"
		type="image/x-icon"
	/>
	<title>NekoWatch</title>
</head>
<body style="width: 100%; height: 100%">
	<div class="header">
		<a href="/" class="logo"
			>NekoWatch<span style="color: purple">;</span></a
		>
		<div class="header-right">
			<a style="margin: 0; padding: 6px;" id="top-search">
				<input type="text" placeholder="query..." id="input" />
				<button onclick="outSearch('input', 'searchres')" id="submitbtn">
					<i class="fa fa-search" style="width: 30px"></i>
				</button>
			</a>
			<a href="http://track.koneko.link" class="track" style="display: block !important;">Tracker</a>
				<a href="/login" class="track" id="trackerlogin" style="display: block !important;">Login</a>
		</div>
	</div>
	<div class="main" style="height: 100%; width: 100%">
		<br />
		<div id="searchres"></div>
		<div style="text-align: center; height: 100%; width: 100%" id="searchdiv">
			<br /><br /><br /><br /><br /><br /><br /><br />
		</div>
		<br />
		<script>
		function outSearch() {
			var input = document.getElementById("input").value;
			if (input == "") return
			window.location.href = "/?q=" + input
		}
		document.getElementById("input").addEventListener("keyup", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				outSearch();
			}
		});
		</script>
		<script>
		let genres = ${JSON.stringify(genres)};
		function generate() {
			let arr = []
			let searchres = document.getElementById("searchres");
			searchres.innerHTML = "";
			document.getElementById("searchdiv").style.display = "none";
			genres.forEach(genre => {
				//check if exists
				let div = document.createElement("div");
            	div.id = "searchdiv";
            	div.innerHTML = \`<button onclick="document.getElementById('\$\{genre.title\}').click()" style="width: 100%; height: 120px;"><a href="\$\{genre.url\}" style="color:white;">\$\{genre.title\}</a></button>\`;
            	document.getElementById("searchres").appendChild(div);
			})
		}
		generate()
		</script>
	</div>
</body>
	`)
})

app.get("/genre/:genre", async (req, res) => {
	try {
		let genre = req.params.genre;
		res.send(`
		<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script
			src="https://kit.fontawesome.com/11fc85fa63.js"
			crossorigin="anonymous"
		></script>
		<link rel="stylesheet" href="/css/global.css" />
		<link rel="stylesheet" href="/css/header.css" />
		<link
			rel="shortcut icon"
			href="https://hub.koneko.link/cdn/icons/purple.png"
			type="image/x-icon"
		/>
		<title>NekoWatch</title>
	</head>
	<body style="width: 100%; height: 100%">
		<div class="header">
			<a href="/" class="logo"
				>NekoWatch<span style="color: purple">;</span></a
			>
			<div class="header-right">
				<a style="margin: 0; padding: 6px;" id="top-search">
					<input type="text" placeholder="query..." id="input" />
					<button onclick="outSearch()" id="submitbtn">
						<i class="fa fa-search" style="width: 30px"></i>
					</button>
				</a>
				<a href="http://track.koneko.link" class="track" style="display: block !important;">Tracker</a>
					<a href="/login" class="track" id="trackerlogin" style="display: block !important;">Login</a>
			</div>
		</div>
		<div class="main" style="height: 100%; width: 100%">
			<br />
			<div id="searchres"></div>
			<div style="text-align: center; height: 100%; width: 100%" id="searchdiv">
				<br /><br /><br /><br /><br /><br /><br /><br />

			</div>
			<br />
			<script>
			function outSearch() {
				var input = document.getElementById("input").value;
				if (input == "") return
				window.location.href = "/?q=" + input
			}
			document.getElementById("input").addEventListener("keyup", function (event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					outSearch();
				}
			});
			</script>
			<script>
			let genre = "${genre}";
			let page = 0;
			async function loadPage () {
				page++
				fetch("/api/genres/${genre}?page=" + page).then(res => res.json())
					.then(data => {
						// remove button
						document.getElementById("searchdiv").remove();
						data.forEach(item => {
							let url = "/anime" + item.url.replace("category/", "");
							let div = document.createElement("div");
							div.innerHTML = \`
							<img referrerpolicy="no-referrer" src="\$\{item.image\}" style="width:100px;height:145px;">
							<h3><a href="\$\{url\}">\$\{item.title\}</a></h3>
							\`;
							div.setAttribute("onclick", "");
							document.getElementById("searchres").appendChild(div);
						});
						// append button
						let div = document.createElement("div");
						div.id = "searchdiv";
						div.innerHTML = \`
						<button onclick="loadPage()" style="width: 100%; height: 100%;">More</button>
						\`;
						document.getElementById("searchres").appendChild(div);
					})
			}
			loadPage()
			</script>
		</div>
	</body>
		`)
	} catch (e) {
		res.send("server encountered error: " + e);
	}

})

app.get("/season", async (req, res) => {
	res.send(`
	<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script
		src="https://kit.fontawesome.com/11fc85fa63.js"
		crossorigin="anonymous"
	></script>
	<link rel="stylesheet" href="/css/global.css" />
	<link rel="stylesheet" href="/css/header.css" />
	<link
		rel="shortcut icon"
		href="https://hub.koneko.link/cdn/icons/purple.png"
		type="image/x-icon"
	/>
	<title>NekoWatch</title>
</head>
<body style="width: 100%; height: 100%">
	<div class="header">
		<a href="/" class="logo"
			>NekoWatch<span style="color: purple">;</span></a
		>
		<div class="header-right">
			<a style="margin: 0; padding: 6px;" id="top-search">
				<input type="text" placeholder="query..." id="input" />
				<button onclick="outSearch()" id="submitbtn">
					<i class="fa fa-search" style="width: 30px"></i>
				</button>
			</a>
			<a href="http://track.koneko.link" class="track" style="display: block !important;">Tracker</a>
				<a href="/login" class="track" id="trackerlogin" style="display: block !important;">Login</a>
		</div>
	</div>
	<div class="main" style="height: 100%; width: 100%">
		<br />
		<div id="searchres"></div>
		<div style="text-align: center; height: 100%; width: 100%" id="searchdiv">
			<br /><br /><br /><br /><br /><br /><br /><br />

		</div>
		<br />
		<script>
		function outSearch() {
			var input = document.getElementById("input").value;
			if (input == "") return
			window.location.href = "/?q=" + input
		}
		document.getElementById("input").addEventListener("keyup", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				outSearch();
			}
		});
		</script>
		<script>
		let page = 0;
		async function loadPage () {
			page++
			fetch("/api/season?page=" + page).then(res => res.json())
				.then(data => {
					// remove button
					document.getElementById("searchdiv").remove();
					data.forEach(item => {
						let url = "/anime" + item.url.replace("category/", "");
						let div = document.createElement("div");
						div.innerHTML = \`
						<img referrerpolicy="no-referrer" src="\$\{item.image\}" style="width:100px;height:145px;">
						<h3><a href="\$\{url\}">\$\{item.title\}</a></h3>
						\`;
						div.setAttribute("onclick", "");
						document.getElementById("searchres").appendChild(div);
					});
					// append button
					let div = document.createElement("div");
					div.id = "searchdiv";
					div.innerHTML = \`
					<button onclick="loadPage()" style="width: 100%; height: 100%;">More</button>
					\`;
					document.getElementById("searchres").appendChild(div);
				})
		}
		loadPage()
		</script>
	</div>
</body>`)
})

app.get("/list", async (req, res) => {
	res.send(`
	<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script
		src="https://kit.fontawesome.com/11fc85fa63.js"
		crossorigin="anonymous"
	></script>
	<link rel="stylesheet" href="/css/global.css" />
	<link rel="stylesheet" href="/css/header.css" />
	<link
		rel="shortcut icon"
		href="https://hub.koneko.link/cdn/icons/purple.png"
		type="image/x-icon"
	/>
	<title>NekoWatch</title>
</head>
<style>
#list-filter {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
	margin-right: 25%;
	margin-left: 25%;
}
.letter {
	margin-left: 5px;
	margin-right: 5px;
}
</style>
<body style="width: 100%; height: 100%">
	<div class="header">
		<a href="/" class="logo"
			>NekoWatch<span style="color: purple">;</span></a
		>
		<div class="header-right">
			<a style="margin: 0; padding: 6px;" id="top-search">
				<input type="text" placeholder="query..." id="input" />
				<button onclick="outSearch()" id="submitbtn">
					<i class="fa fa-search" style="width: 30px"></i>
				</button>
			</a>
			<a href="http://track.koneko.link" class="track" style="display: block !important;">Tracker</a>
				<a href="/login" class="track" id="trackerlogin" style="display: block !important;">Login</a>
		</div>
	</div>
	<div class="main" style="height: 100%; width: 100%">
		<br />
		<div id="list-filter">
		</div>
		<br />
		<div id="searchres"></div>
		<br />
		<script>
		function outSearch() {
			var input = document.getElementById("input").value;
			if (input == "") return
			window.location.href = "/?q=" + input
		}
		document.getElementById("input").addEventListener("keyup", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				outSearch();
			}
		});
		</script>
		<script>
		let page = 0;
		let letterToSend = "None";
		function createLetterButtons() {
			let container = document.getElementById("list-filter")
			//for every letter in the alphabet
			let a = document.createElement("a");
			a.innerHTML = "All";
			a.href = "javascript:setLetter('None')";
			a.className = "letter";
			container.appendChild(a);
			let b = document.createElement("a");
			b.innerHTML = "#";
			b.href = "javascript:setLetter('0')";
			b.className = "letter";
			container.appendChild(b);
			for (let i = 65; i <= 90; i++) {
				let letter = String.fromCharCode(i);
				let a = document.createElement("a");
				a.innerHTML = letter.toUpperCase();
				a.href = "javascript:setLetter('" + letter + "')";
				a.className = "letter";
				container.appendChild(a);
			}
		}
		function setLetter(letter) {
			letterToSend = letter;
			page = 0;
			document.getElementById("searchres").innerHTML = "";
			loadPage()
		}
		async function loadPage () {
			page++
			fetch(\`/api/list?letter=\$\{letterToSend\}&page=\$\{page\}\`).then(res => res.json())
				.then(data => {
					// remove button
					if(document.getElementById("searchbuttonthing")) document.getElementById("searchbuttonthing").remove();
					data.forEach(item => {
						let url = "/anime" + item.url.replace("category/", "");
						let div = document.createElement("div");
						div.id = "searchdiv";
						div.style.border = "none"
						div.style.padding = "20px"
						div.innerHTML = \`
						<a href="\$\{url\}" style="width: 100%; height: 100%;">\$\{item.title\}</a>
						\`;
						document.getElementById("searchres").appendChild(div);
					});
					// append button
					let div = document.createElement("div");
					div.id = "searchbuttonthing";
					div.innerHTML = \`
					<button onclick="loadPage()" style="width: 100%; height: 100%;">More</button>
					\`;
					document.getElementById("searchres").appendChild(div);
				})
		}
		createLetterButtons();
		loadPage()
		</script>
	</div>
</body>`)
})

//scrolling="no" frameborder="0" width="700" height="430" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"
app.get("/login/callback", (req, res) => {
	const token = req.query.token;
	res.send(`
	<script>
		localStorage.setItem("nekowatchtoken", "${token}");
		window.location.href = "/";
	</script>
	`)
})

app.get("/login", (req, res) => {
	res.redirect(login)
})

app.get("/gogo.js", (req, res) => {
	res.send(fs.readFileSync("./gogo.js"))
})

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
