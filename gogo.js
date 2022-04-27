const cheerio = require('cheerio');
const base = "https://gogoanime.sk/"
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

async function newEpisodes () {
    let url = base
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

async function get (link) {
    let url = base + link
    let raw = await fetch(url).then((res) => res.text())
    let $ = cheerio.load(raw)
    let videos = $('div.anime_video_body').children("#episode_page").children().toArray()
    let title = $("h1").text()
    let image = $("div.anime_info_body_bg").children("img").attr("src")
    let description = $("div.anime_info_body_bg").children("p.type").find("span").toArray()[1].next.data
    //get all numbers of videos
    let num = $(videos[videos.length - 1]).html().replace(/\s+/g, "").split("ep_end")[1].split(">")[0].replace(/"/g, "").replace("=", "")
    //compile all into obj
    let obj = {
        title,
        image,
        description,
        episodes: num
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

// async function test () {
//     let results = await getSources('/date-a-live-episode-1')
//     console.log(results)
// }

// test()

module.exports = {
    search,
    getImage,
    newEpisodes,
    get,
    getSources
}