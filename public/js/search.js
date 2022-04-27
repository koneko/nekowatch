const params = new URLSearchParams(window.location.search);

if (params.get("q")) {
	search("invalid", "searchres", params.get("q"));
} else {
	popular("searchres")
}

function search (inid, outid, override) {
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

	let qq = input.replace(/ /g, "+");
	fetch("/api/search?q=" + qq)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			output.innerHTML = "";
			data.forEach((item) => {
				let div = document.createElement("div");
				let title = item.title.replace(/ /g, "-");
				div.innerHTML = `
                <img referrerpolicy="no-referrer" src="${item.image
					}" style="width:111px;height:156px;">
                <div>
                <h3><a href="/anime/${item.rawTitle}">${toUpper(
						item.title
					)}</a></h3>
                </div>
                `;
				div.setAttribute(
					"onclick",
					"window.location.href='/anime/" + title + "'"
				);
				output.appendChild(div);
				let genres = item.genres;
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
			console.log(data);
			output.innerHTML = "";
			data.forEach((item) => {
				let div = document.createElement("div");
				let truetitle = item.rawTitle.split("Episode")[0];
				div.innerHTML = `
                
				<img referrerpolicy="no-referrer" src="${item.image
					}" style="width:100px;height:145px;">
                <h3><a href=".?q=${truetitle}">${item.rawTitle}</a></h3>
                
                `;

				div.setAttribute("onclick", "");
				output.appendChild(div);
				let genres = item.genres;
			});
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
