const params = new URLSearchParams(window.location.search);

if (params.get("q")) {
	let override;
	if (params.get("o") == "true") override = true
	else override = false
	search("invalid", "searchres", params.get("q"), true);
} else {
	popular("searchres")
}

function querySearch () {
	let query = document.getElementById("input").value
	window.location.href = `/?q=${query}`
}

function search (inid, outid, override, or) {
	console.log("searching!");

	let input;
	if (inid == "invalid") {
		input = override;
	} else {
		input = document.getElementById(inid).value;
	}
	let output = document.getElementById(outid);
	if (document.getElementById("searchdiv")) {
		document.getElementById("searchdiv").remove();
	}
	if (document.getElementById("top-search").style.display == "none") {
		document.getElementById("top-search").style.display = "block";
	}
	document.getElementById("input").value = input;
	let qq = input.replace(/ /g, "+");
	fetch("/api/search?q=" + qq)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			output.innerHTML = "";
			data.forEach((item) => {
				let div = document.createElement("div");
				let title = item.url.replace("/category/", "").replace("/", "");
				if (or == true) {
					if (item.title == input) {
						window.location.href = `/anime/${title}`
					}
				}
				div.innerHTML = `
                <img referrerpolicy="no-referrer" src="${item.image
					}" style="width:111px;height:156px;">
                <div>
                <h3><a href="/anime/${title}">${item.title
					}</a></h3>
                </div>
                `;
				div.setAttribute(
					"onclick",
					"window.location.href='/anime/" + title + "'"
				);
				output.appendChild(div);
			});
		});
}

function popular (outid) {
	console.log("searching!");
	let output = document.getElementById(outid);
	if (document.getElementById("searchdiv")) {
		document.getElementById("searchdiv").remove();
	}
	if (document.getElementById("top-search").style.display == "none") {
		document.getElementById("top-search").style.display = "block";
	}
	fetch("/api/popular")
		.then((response) => response.json())
		.then((data) => {
			output.innerHTML = "";
			data.forEach((item) => {
				let url = "/view" + item.url
				let div = document.createElement("div");
				let title = item.url.replace("/category/", "").replace("/", "");
				let episode = item.url.split("-episode-")[1]
				let anime = "/anime" + item.url.split("-episode-")[0]
				div.innerHTML = `
				<img referrerpolicy="no-referrer" src="${item.image}" style="width:100px;height:145px;">
                <h3><a href="${url}">${item.title} Episode ${episode}</a><a href="${anime}"><i class="fa-solid fa-eye eye-button"></i></a></h3>
                `;
				div.setAttribute("onclick", "");
				output.appendChild(div);
			});
			//append more pages button
			let div = document.createElement("div");
			div.id = "searchdiv";
			div.innerHTML = `
			<button onclick="loadPage()" style="width: 100%; height: 100%;">More</button>
			`;
			output.appendChild(div);
		});
}

var input = document.getElementById("input");

input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("submitbtn").click();
	}
});

var input2 = document.getElementById("input2");
if (input2) {
	input2.addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			document.getElementById("submitbtn2").click();
		}
	});
}

function toUpper (str) {
	return str
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word[0].toUpperCase() + word.substr(1);
		})
		.join(" ");
}
if (localStorage.nekowatchtoken) {
	document.getElementById("trackerlogin").remove()
	let a = document.createElement("a")
	a.setAttribute("href", "#")
	a.setAttribute("onclick", "logout()")
	a.innerHTML = "Logout"
	document.querySelector(".header-right").appendChild(a)
}

function logout () {
	localStorage.removeItem("nekowatchtoken")
	window.location.reload()
}