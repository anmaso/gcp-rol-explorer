const BASE = "https://cloud.google.com";

// Node Fetch LAZY LOADING
let _fetch;
const fetch = () => {
  if (!_fetch) _fetch = require("node-fetch");
  return _fetch;
};
let _parser;
const HTMLParser = () => {
  if (!_parser) _parser = require("node-html-parser");
  return _parser;
};

const getIframeSrc = async () => {
  const rawHtml = await (
    await fetch()(BASE + "/iam/docs/permissions-reference")
  ).text();
  const domParent = HTMLParser().parse(rawHtml);
  return domParent.querySelector("iframe").attributes.src;
};

const getDOM = async () => {
  const src = await getIframeSrc();
  const rawHtml2 = await (await fetch()(src)).text();
  return HTMLParser().parse(rawHtml2);
};

const getData = async ()=> {
  let dom = await getDOM();
      return [... dom.querySelectorAll('.list tr')]
       .map(el => [...el.querySelectorAll('td')]
            .map(el => el.text)
            .filter(text => text !== undefined)
            .map(text => text.trim().split('\n').map(t => t.trim().replace(/\)/,'').split('(')))
       );
}

let cache;
const getCachedData = async()=>{
  if (!cache || !cache.length) {
    cache = await getData();  
  }
  return cache;
}


module.exports = {
  getHtml: getIframeSrc,
  getDOM,
  getData,
  getCachedData
};
