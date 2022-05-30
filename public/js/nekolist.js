const base = "http://track.koneko.link/api"

async function getList () {
    let token = localStorage.getItem("nekowatchtoken");
    if (!token) return alert("no log in uwu")
    let json = await fetch(`${base}/getList?token=${token}`)
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
    let res = await fetch(`${base}/edit?token=${token}&id=${id}&episode=${episode}`)
    if (await res.text() == "ok") {
        return true
    } else {
        return false
    }
}

async function addItem (name, src, episode) {
    let token = localStorage.getItem("nekowatchtoken");
    if (!token) return alert("no log in uwu")
    let res = await fetch(`${base}/add?token=${token}&name=${name}&src=${src}&episodes=${episode}`)
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
