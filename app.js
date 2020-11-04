'use strict';

const PARAMATERS = {
    scrollMargin: 5,
    query: 'fall',
    quantityOfPhotos: 1000,
    divSize: 5,
    filters: [
        { 
            name: 'saturate',
            min: 200,
            max: 1000,
            units: '%'
        },{ 
            name: 'brightness',
            min: 200,
            max: 1000,
            units: '%'
        },{ 
            name: 'contrast',
            min: 200,
            max: 1000,
            units: '%'
        }
    ]
}
const FILTER_STRING = generateFiltersString();

let getPhoto = async () => {
    let page = Math.round(random(1, PARAMATERS.quantityOfPhotos));
    let response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURI(PARAMATERS.query)}&per_page=1&page=${page}`, {
        headers: {
            Authorization: '563492ad6f917000010000017efc97adfe154c7bb2ea70d7db85bc5b'
        }
    });
    let json = await response.json();

    while (json.total_results <= 0) {
        page = Math.round(random(1, PARAMATERS.quantityOfPhotos));
        response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURI(PARAMATERS.query)}&per_page=1&page=${page}`, {
            headers: {
                Authorization: '563492ad6f917000010000017efc97adfe154c7bb2ea70d7db85bc5b'
            }
        });
        json = await response.json();
    }

    let smallSrc = json.photos[0].src.small;
    let bigSrc = json.photos[0].src.large2x;
    let image = document.getElementById('img');
    image.src = `${smallSrc}`;
    // image.bigSrc = `${bigSrc}`;
    // image.onload = () => {
    //     if (image.bigSrc) {
    //         image.src = image.bigSrc;
    //         image.bigSrc = undefined;
    //     }
    // };
}

function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}
function random(from, to) {
    let rnd = Math.random();
    return map(rnd, 0, 1, from, to);
}

function generateFiltersString() {
    let string = '';
    for (const filt of PARAMATERS.filters) {
        string += `${filt.name}(${random(filt.min, filt.max)}${filt.units}) `;
    }
    return string;
}

function setDivSize() {
    let divSize = (PARAMATERS.divSize + 1) * 100 + 'vw';
    document.getElementById('scrolldiv').style.width = divSize;
}

function setHueRotate() {
    let hueRotate = random(0, 360);
    let divScroll = map(hueRotate, 0, 360, 0 + PARAMATERS.scrollMargin, PARAMATERS.divSize*document.documentElement.clientWidth - PARAMATERS.scrollMargin);
    let resultString = `hue-rotate(${hueRotate}deg) `;

    document.getElementById('scrollcontainer').scrollTo(divScroll, 0);
    document.getElementById('scrollcontainer').onscroll = (e) => {
        let scroll = document.getElementById('scrollcontainer').scrollLeft;
        if (scroll < 0 + PARAMATERS.scrollMargin) {
            document.getElementById('scrollcontainer').scrollTo(PARAMATERS.divSize*document.documentElement.clientWidth - PARAMATERS.scrollMargin, 0);
            return;
        } else if (scroll > PARAMATERS.divSize*document.documentElement.clientWidth - PARAMATERS.scrollMargin) {
            document.getElementById('scrollcontainer').scrollTo(0 + PARAMATERS.scrollMargin, 0);
            return;
        }
        let hueRotate = map(scroll, 0 + PARAMATERS.scrollMargin, PARAMATERS.divSize*document.documentElement.clientWidth - PARAMATERS.scrollMargin, 0, 360);
        document.getElementById('img').style.filter = FILTER_STRING + `hue-rotate(${hueRotate}deg) `;
    };

    return resultString;
}


async function main() {
    setDivSize();
    await getPhoto(Math.round(random(1, PARAMATERS.quantityOfPhotos)));
    document.getElementById('img').style.filter = FILTER_STRING + setHueRotate();
}

(async () => {
    main();

    document.getElementById('btn').onclick = (e) => {
        document.getElementById('info').classList.toggle('expanded');
    }
})();





/*

original:
filter: saturate(1000%) brightness(200%) contrast(1000%) hue-rotate(215deg);

*/