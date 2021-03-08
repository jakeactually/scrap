const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");
const fs = require('fs');

(async () => {
    const res = await axios.get('https://commons.wikimedia.org/wiki/Category:SVG_playing_cards');
    const dom = new JSDOM(res.data);
    const nodes = dom.window.document.querySelectorAll('.galleryfilename');
    const links = [...nodes].map((x) => x.href);
    const valid = links.filter((x) => /[0-9JQKA]{1,2}[CDHS]\.svg/.test(x));
    
    for (const item of valid) {
        const res = await axios.get(`https://commons.wikimedia.org${item}`);
        const dom = new JSDOM(res.data);
        const link = dom.window.document.querySelector('.fullImageLink a');
        const card = await axios.get(link.href);
        fs.writeFile(item.split(':')[1], card.data, () => {});
    }
})();
