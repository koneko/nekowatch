async function getList () {
    let token = localStorage.getItem("nekowatchtoken");
    if (!token) return alert("no log in uwu")
    let json = await fetch(`http://track.koneko.link/api/getList?token=${token}`)
    let returnn = await json.json()
    return returnn
}

async function editItem (episode, title) {
    let token = localStorage.getItem("nekowatchtoken");
    if (!token) return false
    let list = await getList()
    console.log(list)
    let item = list.find(item => item.name == title)
    if (!item) return false
    let id = item.id
    let res = await fetch(`http://track.koneko.link/api/edit?token=${token}&id=${id}&episode=${episode}`)
    if (await res.text() == "ok") {
        return true
    } else {
        return false
    }
}

async function addItem (name, src, episode) {
    let token = localStorage.getItem("nekowatchtoken");
    if (!token) return alert("no log in uwu")
    let res = await fetch(`http://track.koneko.link/api/add?token=${token}&name=${name}&src=${src}&episodes=${episode}`)
    console.log(res)
    if (await res.text() == "ok") {
        return true
    } else {
        return false
    }
}

async function itemInfoName (name) {
    let token = localStorage.getItem("nekowatchtoken");
    if (!token) return false
    let list = await getList()
    let item = list.find(item => item.name == name)
    if (!item) return false
    return item
}

function searchURL () {
    let url = document.getElementById("input").value
    if (!url) return
    location.href = '/?q=' + url
}