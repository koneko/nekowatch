var container = document.getElementById("ep-cont");
container.innerHTML = `<iframe id="main-video" src='${videos[0]}' scrolling='no' frameborder='0' width='770px;' height='442px;' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true'></iframe>`;
let controls = document.querySelector(".episode-controls");
var sources = document.createElement("div")
document.querySelector(".content").appendChild(document.createElement("br"))
document.querySelector(".content").appendChild(sources);
sources.style.textAlign = "center";
sources.style.padding = "10px"
sources.className = "episode-sources";
if (number > 1) {
	let a = document.createElement("a");
	a.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
	a.href = "/view/" + title + "-episode-" + (number + -1);
	controls.appendChild(a);
}
let b = document.createElement("a");
b.textContent = "All Episodes";
b.href = "/anime/" + title;
controls.appendChild(b);
if (number != max) {
	let c = document.createElement("a");
	c.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
	c.href = "/view/" + title + "-episode-" + (number + 1);
	controls.appendChild(c);
}

let i = 1;
videos.forEach(element => {
	if (i > videos.length) return;
	let a = document.createElement("a");
	a.innerHTML = `Source ${i}`;
	a.href = "#";
	a.setAttribute("onclick", `changeSource('${element}')`);
	sources.appendChild(a);
	i++
});

function changeSource (src) {
	let main = document.getElementById("main-video");
	main.src = src;
}