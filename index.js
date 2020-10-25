const webpack = require('webpack');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const util = require('util');
const Markov = require('js-markov');

const markov = new Markov();

urls = [
	'https://en.wikipedia.org/wiki/The_Thirty-Nine_Steps',
	'https://www.quantamagazine.org/a-new-map-of-the-standard-model-of-particle-physics-20201022/',
	'https://en.wikipedia.org/wiki/Molecular_self-assembly',
	'https://www.poetryfoundation.org/poems/45496/blizzard-56d225206b7ca'
]

async function chat(text) {

	markov.addStates(text);
	await markov.train();
	console.log(markov.generateRandom(Math.round(Math.random()*150) + 100));

}

async function processPage(body) {
	let text = []
	const $ = cheerio.load(body);
	await $('p').each(function(index, el){
		text.push(( $( el ).text().trim()));
	})
	chat(text)
}

function runSpider() {
	let url = urls[Math.floor(Math.random()*urls.length)]

	try {
		fetch(url)
		.then(res => res.text())
		.then(body => processPage(body));
	}
	catch {
		console.log('err')
	}
}

setInterval(runSpider, 1500);
