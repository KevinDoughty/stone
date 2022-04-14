export const sortFunction = function(property, ascending, isAlphabetic) {
	const modifier = ascending ? 1 : -1
	const numeric = (a,b) => {
		if (a[property] < b[property]) return -1 * modifier;
		if (a[property] > b[property]) return 1 * modifier;
		if (a.id < b.id) return -1 * modifier;
		if (a.id > b.id) return 1 * modifier;
		return 0;
	};
	const alphabetic = (a, b) => {
		const A = a[property].toUpperCase();
		const B = b[property].toUpperCase();
		if (A < B) return -1 * modifier;
		if (A > B) return 1 * modifier;
		if (a.id < b.id) return -1 * modifier;
		if (a.id > b.id) return 1 * modifier;
		return 0;
	}
	if (isAlphabetic) return alphabetic;
	return numeric;
};

export const firstSelection = function(sort,sorted,props) {
	if (!sorted || !sorted.length) return [];
	const first = sorted[0];
	const row = first.uniqueIdentifier;
	if (row === -1) throw new Error("no negative ones");
	const selection = [row];
	if (first) {
		const key = props.sorters[sort];
		const value = first
		for (let i=1; i<sorted.length; i++) {
		const item = sorted[i];
		if (first[key] === item[key]) {
			selection.push(item.uniqueIdentifier);
		} else break;
		}
	}
	return selection;
}

export const string_to_ticks = function(string) {
	let hrs = 0;
	let mins = 0;
	let secs = 0;
	let hourindex = string.indexOf(':');
	if (hourindex != -1) {
		const sub = string.substr(0,hourindex);
		hrs = sub * 1.0;
		mins = sub * 1.0;
		string = string.substr(hourindex+1);
	}
	let secondhourindex = string.indexOf(':')
	if (secondhourindex != -1) {
		mins = string.substr(0,secondhourindex) * 1.0;
		string = string.substr(secondhourindex+1);
	} else {
		hrs = 0;
	}
	secs = string * 1.0;
	const ticks = hrs * 3600 + mins * 60 + secs;
	return ticks;
}

function zeropad(number) {
	if (number < 10) return "0" + number;
	return number + "";
}

export const ticks_to_string = function(ticks) {
	const tenths = (ticks * 10) % 10;
	ticks = Math.floor(ticks);
	const seconds = ticks % 60;
	const minutes = ((ticks-seconds) / 60 ) % 60;
	const hours = Math.floor(((ticks-seconds-minutes) / 3600)) ;
	let string = zeropad(minutes) + ":" + zeropad(seconds) + "." + tenths;
	if (hours > 0) string = hours + ":" + string;
	return string;
}


const csvToArray = function(strData) { // https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }
    return arrData;
}

export const parse = function(csv) {
	let count = 0;
	let xx = [];
	let yy = [];
	const title = [];
	const x = [];
	const y = [];
	const values = [];
	csvToArray(csv).forEach( function(line) {
		if (count === 0) {
			x.push([]);
			y.push([]);
			values.push([]);
			count = count + 1;
		} else if (line.length === 1) {
			x.push([]);
			y.push([]);
			values.push([]);
			count = count + 1;
		} else if (line.length > 3) {
			if (line[0].length === 0 && line[3].length === 0) {
				const weight = line[7] + " lbs";
				const weightnum = line[7] * 1.0;
				y[count-1].push(weightnum);
				const time = line[8];
				const ticks = string_to_ticks(line[8]);
				x[count-1].push(ticks);
				const lastname = line[5];
				const firstname = line[4];
				const id = line[6] * 1.0;
				const previous = line[11] * 1.0;
				const person = { id, firstname, lastname, weight, weightnum, time, ticks, previous };
				values[count-1].push(person);
			} else if (line[0].length > 0 && line[3].length === 0) {
				title.push(line[0]);
			}
		}
	});
	x.pop();
	y.pop();
	values.pop();

	const array = values.map( function(item,index) {
		return { title:title[index], race:item, x:x[index], y:y[index] };
	});

	process(array);
	return array;
}

export const process = function(values) {
	values.forEach( function(competition) {
		const min_x = Math.min(...competition.x);
		let min_y = Math.min(...competition.y);
		const max_x = Math.max(...competition.x);
		const max_y = Math.max(...competition.y);
		if (min_y === max_y) min_y = 0;
		let range_x = max_x - min_x;
		let range_y = max_y - min_y;
		if (range_x === 0) range_x = 1;
		if (range_y === 0) range_y = 1;
		const X = [];
		competition.x.forEach( function(item) {
			X.push( 1 - (item - min_x) / range_x);
		});
		competition.x = X;
		const Y = [];
		competition.y.forEach( function(item) {
			Y.push( (item - min_y) / range_y);
		});
		competition.y = Y;
	});

	let uniqueIdentifier = 0;
	values.forEach( function(competition) {
		let array = [];
		competition.race.forEach( function(person,index) {
			const x = competition.x[index];
			const y = competition.y[index];
			const combined = Math.hypot(1-y, 1-x);
			const extra = { x, y, combined, uniqueIdentifier };
			Object.assign(person, extra);
			uniqueIdentifier++;
			array.push(person);
		});

		let previous = "";
		const sorted = competition.race.sort(sortFunction("combined",true));
		sorted.forEach( function(person,index) {
			let precision = 5;
			const combined = person.combined;
			let compare = combined + "";
			person.shortened = compare.substring(0,precision);
			while (compare.substring(0,precision) === previous.substring(0,precision)
				|| person.shortened === previous.substring(0,person.shortened.length)
				|| (index+1<sorted.length && person.shortened === (sorted[index+1].combined+"").substring(0,person.shortened.length) )
				) {
				if (previous === compare || (precision >= compare.length && precision >= previous.length)) {
					break;
				} else {
					precision++;
					person.shortened = compare.substring(0,precision);
					if (index > 0 && precision > sorted[index-1].length) sorted[index-1].shortened = previous.substring(0,precision);
				}

			}
			previous = compare;
		});
	});
}