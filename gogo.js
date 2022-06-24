const cheerio = require('cheerio');
const base = "https://gogoanime.lu/"
require("isomorphic-fetch")

async function search (query) {
    let url = base + "search.html?keyword=" + query
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let result = []
    let main = $('div.last_episodes').children().children().toArray()
    for (let i = 0; i < main.length; i++) {
        let item = main[i]
        let title = $(item).find('a').attr('title')
        let image = $(item).find('img').attr('src')
        let url = $(item).find('a').attr('href')
        let obj = {
            title,
            image,
            url
        }
        result.push(obj)
    }
    return result
}

async function getImage (link) {
    let url = base + link
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let image = $('div.anime_info_body').find('img').attr('src')
    return image
}

async function newEpisodes (page) {
    if (page == null) page = 1;
    let url = `${base}?page=${page}`
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let result = []
    let main = $('div.last_episodes').children().children().toArray()
    for (let i = 0; i < main.length; i++) {
        let item = main[i]
        let title = $(item).find('a').attr('title')
        let image = $(item).find('img').attr('src')
        let url = $(item).find('a').attr('href')
        let animeUrl = url.split("-episode-")[0]
        let obj = {
            title,
            image,
            url,
            anime: "/category" + animeUrl
        }
        result.push(obj)
    }
    return result
}

async function get (link) {
    let url = base + link
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let videos = $('div.anime_video_body').children("#episode_page").children().toArray()
    let title
    try {
        title = $("h1").text()
    } catch (e) {
        title = "N/A"
    }
    let image
    try {
        image = $("div.anime_info_body_bg").children("img").attr("src")
    } catch (e) {
        image = "https://hub.koneko.link/cdn/icons/black.png"
    }
    let description;
    try {
        description = $("div.anime_info_body_bg").children("p.type").find("span").toArray()[1].next.data
    } catch (e) {
        description = "N/A"
    }
    let date
    try {
        date = $("div.anime_info_body_bg").children("p.type").find("span").toArray()[3].next.data
    } catch (e) {
        date = "N/A"
    }
    let altName;
    try {
        altName = $("div.anime_info_body_bg").children("p.type").find("span").toArray()[5].next.data
    } catch (e) {
        altName = "N/A"
    }
    let genres = []
    try {
        let d = $("div.anime_info_body_bg").children("p.type").find("a[title]").toArray()
        //remove first element from d
        d.shift()
        for (let i = 0; i < d.length; i++) {
            genres.push(d[i].attribs.title)
        }
        genres.pop()
    } catch (e) {
        genres = ["N/A"]
    }
    //get all numbers of videos
    let num = $(videos[videos.length - 1]).html().replace(/\s+/g, "").split("ep_end")[1].split(">")[0].replace(/"/g, "").replace("=", "")
    //compile all into obj
    let obj = {
        title,
        alternative: altName,
        image,
        description,
        episodes: num,
        date,
        genres,
    }
    return obj
}

async function getSources (link) {
    let url = base + link
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let videos = $('div.anime_muti_link').children().children().toArray()
    let result = []
    for (let i = 0; i < videos.length; i++) {
        let item = videos[i]
        let url = $(item).find('a').attr('data-video')
        result.push(url)
    }
    return result
}

async function getGenres () {
    let raw = await fetch(base).then((res) => res.text())
    let $ = cheerio.load(raw)
    let result = []
    let main = $('.genre').children().children().toArray()
    for (let i = 0; i < main.length; i++) {
        let item = main[i]
        let title = $(item).find('a').attr('title')
        let url = $(item).find('a').attr('href')
        let obj = {
            title,
            url
        }
        result.push(obj)
    }
    return result
}

async function getAnimeFromGenre (link, page) {
    if (page == null) page = 1;
    let url = base + link
    let raw = await fetch(url + "?page=" + page).then((res) => res.text())
    let $ = cheerio.load(raw)
    let result = []
    let main = $('div.last_episodes').children().children().toArray()
    for (let i = 0; i < main.length; i++) {
        let item = main[i]
        let title = $(item).find('a').attr('title')
        let image = $(item).find('img').attr('src')
        let url = $(item).find('a').attr('href')
        let obj = {
            title,
            image,
            url
        }
        result.push(obj)
    }
    return result
}

async function getSeasonAnime (page) {
    if (page == null) page = 1;
    let url = base + "new-season.html?page=" + page
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let result = []
    let main = $('div.last_episodes').children().children().toArray()
    for (let i = 0; i < main.length; i++) {
        let item = main[i]
        let title = $(item).find('a').attr('title')
        let image = $(item).find('img').attr('src')
        let url = $(item).find('a').attr('href')
        let obj = {
            title,
            image,
            url
        }
        result.push(obj)
    }
    return result
}

async function showAnimeList (letter, page) {
    let url
    if (letter == "None") url = base + "anime-list.html"
    else url = base + "anime-list-" + letter.toUpperCase()
    url += "?page=" + page
    // console.log(url)
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let result = []
    let main = $('.listing').children().toArray()
    for (let i = 0; i < main.length; i++) {
        let item = main[i]
        let title = $(item).find('a').text()
        let url = $(item).find('a').attr('href')
        let obj = {
            title,
            url
        }
        result.push(obj)
    }
    return result
}

// async function test () {
//     let results = await showAnimeList("Z", 1)
//     console.log(results)
// }

// test()

module.exports = {
    search,
    getImage,
    newEpisodes,
    get,
    getSources,
    getGenres,
    getSeasonAnime,
    getAnimeFromGenre,
    showAnimeList
}