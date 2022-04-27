for (let i = 1; i <= episodes; i++) {
	const episode = i;
	let div = document.createElement("div");
	let url = `${title}-episode-${i}`
	div.setAttribute("onclick", `openEpisode("${url}")`);
	div.innerHTML = `<a href="/view/${url}">Episode ${i}</a>`;
	document.querySelector(".regular").appendChild(div);
}




function openEpisode (iurl) {
	let url = `/view/${iurl}`;
	location = url;
}
