var container = document.getElementById("ep-cont");
container.innerHTML = `<iframe src='${link}' scrolling='no' frameborder='0' width='770px;' height='442px;' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true'></iframe>`;
let controls = document.querySelector(".episode-controls");

if (episode.prev != null) {
	let a = document.createElement("a");
	a.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
	a.href = "../../.." + episode.prev.url;
	controls.appendChild(a);
}
let b = document.createElement("a");
b.textContent = "All Episodes";
b.href = "../../../anime/" + title;
controls.appendChild(b);
if (episode.next != null) {
	let c = document.createElement("a");
	c.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
	c.href = "../../.." + episode.next.url;
	controls.appendChild(c);
}
