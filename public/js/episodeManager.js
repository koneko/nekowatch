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
async function podarok () {
	if (!localStorage.nekowatchtoken) return
	let item = await itemInfoName(datatitle);
	console.log(item)
	if (item) {
		let div = document.createElement("div");
		let container = document.querySelector(".anime-info-right")
		div.innerHTML = `
		<h3>Status: <b>${item.state}</b></h3>
		<h4>Current episode: <b style="font-size:20px;">${item.currentEpisode}</b></h4>
		`
		container.appendChild(div);
	} else {
		let container = document.querySelector(".anime-info-right")
		let btn = document.createElement("button");
		btn.innerHTML = "Add to tracker";
		btn.setAttribute("onclick", `addItemExtra()`);
		container.appendChild(btn);
	}
}
podarok()

async function addItemExtra () {
	await addItem(datatitle, document.getElementById('img-src').src, "0")
	location.reload()
}