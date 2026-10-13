// Supermercados, categorías y utilidades de texto.
// Para añadir otro súper (Carrefour, Dia...) basta con meterlo en STORES.

export const STORES = [
	{ id: 'mercadona', name: 'Mercadona', short: 'M', color: '#0b8a46', dark: '#3cc57f', tint: '#e3f4ea' },
	{ id: 'lidl', name: 'Lidl', short: 'L', color: '#0050aa', dark: '#5f9df2', tint: '#e2ecf8', dot: '#ffd400' },
	{ id: 'any', name: 'Cualquiera', short: '·', color: '#8a8580', dark: '#9b958d', tint: '#efede9' },
];

export const storeById = (id) => STORES.find(s => s.id === id) || STORES[STORES.length - 1];

// El orden es aproximadamente el recorrido de un súper.
export const CATEGORIES = [
	{ id: 'fruta', name: 'Fruta y verdura', short: 'Fruta', emoji: '🥬' },
	{ id: 'pan', name: 'Panadería', short: 'Pan', emoji: '🥖' },
	{ id: 'carne', name: 'Carne', short: 'Carne', emoji: '🥩' },
	{ id: 'pescado', name: 'Pescado y marisco', short: 'Pescado', emoji: '🐟' },
	{ id: 'charcuteria', name: 'Charcutería y quesos', short: 'Charcutería', emoji: '🧀' },
	{ id: 'lacteos', name: 'Lácteos y huevos', short: 'Lácteos', emoji: '🥛' },
	{ id: 'despensa', name: 'Despensa', short: 'Despensa', emoji: '🥫' },
	{ id: 'congelados', name: 'Congelados', short: 'Congelados', emoji: '🧊' },
	{ id: 'bebidas', name: 'Bebidas', short: 'Bebidas', emoji: '🧃' },
	{ id: 'limpieza', name: 'Limpieza y hogar', short: 'Limpieza', emoji: '🧽' },
	{ id: 'higiene', name: 'Higiene', short: 'Higiene', emoji: '🧴' },
	{ id: 'otros', name: 'Otros', short: 'Otros', emoji: '🛍️' },
];

export const categoryById = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

const KEYWORDS = {
	fruta: 'manzana platano pera naranja mandarina limon lima fresa uva kiwi melon sandia pina mango aguacate tomate cherry lechuga cebolla cebolleta ajo patata zanahoria pimiento calabacin berenjena pepino espinaca rucula brocoli coliflor champinon seta puerro apio calabaza judias verdes esparrago perejil cilantro albahaca jengibre canonigos arandano frambuesa cereza melocoton nectarina ciruela granada higo boniato alcachofa rabano ensalada brotes fruta verdura hierbabuena menta',
	pan: 'pan baguette barra chapata croissant bolleria magdalena wraps tortillas de trigo picos biscotes pan de molde pan rallado bollos brioche',
	carne: 'pollo pechuga ternera cerdo solomillo carne picada hamburguesa salchicha costilla filete conejo cordero muslo contramuslo alitas panceta secreto entrecot carne',
	pescado: 'atun salmon merluza bacalao gamba gambon langostino mejillon calamar sepia pulpo dorada lubina sardina boqueron rape surimi pescado sushi sashimi almeja chipiron',
	charcuteria: 'jamon jamon york pavo chorizo salchichon fuet lomo embuchado queso mozzarella burrata parmesano bacon mortadela salami sobrasada pate hummus cecina',
	lacteos: 'leche yogur yogures kefir nata mantequilla huevo natillas flan cuajada batido margarina bebida de avena skyr queso fresco requeson',
	despensa: 'arroz pasta espaguetis macarrones tallarines harina azucar sal aceite vinagre garbanzos lentejas alubias tomate frito pesto salsa mayonesa ketchup mostaza cafe te infusion cacao galletas cereales copos de avena miel mermelada chocolate frutos secos almendras nueces pipas patatas fritas aceitunas conserva lata latas de atun atun en lata especias pimienta oregano caldo levadura soja salsa de soja nori wasabi sesamo quinoa cuscus noodles fideos crema de cacahuete nachos palomitas legumbres',
	congelados: 'congelado congelados helado pizza hielo croquetas nuggets empanadillas gyozas guisantes',
	bebidas: 'agua cerveza vino refresco coca cola zumo tonica gaseosa aquarius cava ron ginebra whisky kombucha isotonica',
	limpieza: 'detergente suavizante lejia friegasuelos lavavajillas fairy estropajo bayeta papel de cocina bolsas de basura bolsa de basura servilletas papel de aluminio papel film limpiacristales amoniaco ambientador fregona guantes pastillas lavavajillas',
	higiene: 'champu gel jabon desodorante pasta de dientes dentifrico cepillo de dientes colutorio papel higienico compresas tampones maquinilla cuchillas crema protector solar algodon bastoncillos toallitas panuelos hilo dental acondicionador',
};

// Frases de varias palabras van primero para que "tomate frito" gane a "tomate".
const RULES = (() => {
	const multi = [
		'judias verdes', 'pan de molde', 'pan rallado', 'tortillas de trigo', 'carne picada', 'jamon york',
		'lomo embuchado', 'bebida de avena', 'queso fresco', 'tomate frito', 'copos de avena', 'frutos secos',
		'patatas fritas', 'latas de atun', 'atun en lata', 'salsa de soja', 'crema de cacahuete', 'coca cola',
		'papel de cocina', 'bolsas de basura', 'bolsa de basura', 'papel de aluminio', 'papel film',
		'pastillas lavavajillas', 'pasta de dientes', 'cepillo de dientes', 'papel higienico', 'protector solar',
		'hilo dental',
	];
	const rules = [];
	for (const [cat, list] of Object.entries(KEYWORDS)) {
		let rest = ' ' + list + ' ';
		for (const phrase of multi) {
			if (rest.includes(' ' + phrase + ' ')) {
				rules.push([phrase, cat]);
				rest = rest.replace(' ' + phrase + ' ', ' ');
			}
		}
		rest.trim().split(/\s+/).forEach(w => rules.push([w, cat]));
	}
	rules.sort((a, b) => b[0].length - a[0].length);
	return rules.map(([kw, cat]) => [new RegExp(`(^|[^a-z])${kw}(s|es)?($|[^a-z])`), cat]);
})();

export function normalize(text) {
	return (text || '')
		.normalize('NFD').replace(/[̀-ͯ]/g, '')
		.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function productKey(name) {
	return normalize(name).replace(/[^a-z0-9 ]/g, '').trim().slice(0, 80);
}

export function guessCategory(name) {
	const n = normalize(name);
	for (const [re, cat] of RULES) if (re.test(n)) return cat;
	return 'otros';
}

const UNITS = 'kg|g|gr|grs|l|ml|cl|ud|uds|unidad(?:es)?|paquetes?|botes?|latas?|bricks?|botellas?|docenas?|bolsas?|cajas?|packs?|mallas?';
const LEADING = new RegExp(`^(\\d+(?:[.,]\\d+)?)(?:\\s*(${UNITS})\\b)?\\s+(?:x\\s+)?(?:de\\s+)?(.+)$`, 'i');
const TRAILING = /^(.+?)\s+[x×]\s*(\d+)$/i;

// "3 aguacates" → { qty: '3', name: 'Aguacates' }, "leche x2" → { qty: '2', name: 'Leche' }
export function parseInput(raw) {
	let text = (raw || '').trim().replace(/\s+/g, ' ');
	let qty = '';
	let m = text.match(TRAILING);
	if (m) {
		text = m[1];
		qty = m[2];
	} else if ((m = text.match(LEADING)) && /\D/.test(m[3])) {
		qty = m[2] ? `${m[1]} ${m[2]}` : m[1];
		text = m[3];
	}
	return { qty, name: capitalize(text) };
}

export function capitalize(s) {
	return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
