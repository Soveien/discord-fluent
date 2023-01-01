const TWEMOJI_URL = "https://emojis.wiki/twitter/";
import fetch from "node-fetch";
import fs from "fs";

const toFluent = (emoji) => `https://api.iconify.design/fluent-emoji/${emoji}.svg`;
const toCSS = (emoji) => `img[aria-label*="${emoji.emoji}"] { content: url("${emoji.url}"); }\n`

const getEmojis = async () => {
    const response = await fetch(TWEMOJI_URL);
    const text = await response.text();
    const emojis = text.match(/(?<=alt=")(.*)(?=")/g).map(e => {
        const text = e.split("\"")[0].split(" ");
        const emoji = text.shift();
        const name = text.map(s => s.toLowerCase()).join("-").replace("keycap:-", "keycap-");

        if (name === "") return {emoji: null, url: null};
        return {emoji, url: toFluent(name)};
    });

    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");

    for (const a of alphabets) {
        emojis.push({emoji: a, url: null});
    }

    return emojis;
}

const generateCSS = (emojis) => {
    let css = "";
    for (const emoji of emojis) {
        if (emoji.emoji === null) continue;
        css += toCSS(emoji);
    }

    return css;
}

const saveFile = (css) => {
    fs.writeFile("emojis.css", css, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
}

getEmojis().then(generateCSS).then(saveFile);