episodes.forEach((episode) => {
	episode.url = episode.url.replace(" ", "");
	let div = document.createElement("div");
	div.setAttribute("onclick", `openEpisode("${episode.url}")`);
	div.innerHTML = `<a href="..${episode.url}">${episode.title} - ${episode.subtitle}</a>`;
	document.querySelector(".regular").appendChild(div);
});

specials.forEach((episode) => {
	episode.url = episode.url.replace(" ", "");
	let div = document.createElement("div");
	div.setAttribute("onclick", `openEpisode("${episode.url}")`);
	div.innerHTML = `<a href="..${episode.url}">${episode.title} - ${episode.subtitle}</a>`;
	document.querySelector(".special").appendChild(div);
});

function openEpisode(iurl) {
	let url = `..${iurl}`;
	location = url;
}
