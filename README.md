# neko-watch

anime watching application, that scrapes from [gogoanime.ee](https://gogoanime.ee/) <br>
doesnt do that much other than that it can

## features

> Searching anime
>
> Playing anime
>
> New releases tab
>
> Synopsis and Specials
>
> Anime information
>
> Genres, list by alphabetical order and seasonal anime viewability
>
> Integration with [NekoList](https://github.com/koneko/nekotracker)
### setup

setup is very simple, a little bit of javascript knowledge is preferred  
basically, if you want NekoList integration to be hosted on your own server, you need to setup your own server and  
change the "base" variable in `nekolist.js` and the login url in `index.html` to your own server urls and it should be good  
other than that just clone the repo, `npm i`  
after that you can just run `npm start` and it should be good