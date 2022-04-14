import { h, Component, Fragment } from "preact";
import { parse, ticks_to_string, process } from "./shared.js";
import Selection from "./Selection.jsx";
import gaussian from "gaussian";

const colors = ["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","orange","aliceblue","antiquewhite","aquamarine","azure","beige","bisque","blanchedalmond","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","gainsboro","ghostwhite","gold","goldenrod","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","limegreen","linen","magenta","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","oldlace","olivedrab","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellowgreen","rebeccapurple"];

class App extends Component {
	state = {
		values:[], 
		keys: ["id","firstname","lastname","weight","time","shortened"],
		names: ["Id", "First", "Last", "Weight", "Time", "Combined"],
		sorters:["id", "firstname", "lastname", "weightnum", "ticks", "combined"],
		padded:["id", "weight", "time"],
		strings:["firstname", "lastname"]
	 };
	 xx = [];
	 yy = [];
	 
	constructor() {
		super();
		this.loadCSV = this.loadCSV.bind(this);
	}

	componentDidMount() {  
		const short = colors.filter( string => string.length < 7 ).map( color => {
			const first = color.substring(0,1).toUpperCase();
			return first + color.substring(1);
		});
		const long = colors.filter( string => string.length > 6 ).map( color => {
			const first = color.substring(0,1).toUpperCase();
			return first + color.substring(1); 
		});

		const weight = gaussian(25,50 * 20);
		const titles = ["First", "Second", "Third", "Fourth", "Fifth"];
		const lengths = [21,39,14,3,6];
		const values = [];
		for (let i=0; i<lengths.length; i++) {
			const title = titles[i]
			const race = [];
			const length = lengths[i];
			const x = [];
			const y = [];
			const min = gaussian(1800,3600);
			const base = Math.max(0, Math.floor(min.ppf(Math.random() )))

			for (let j=0; j<length; j++) {
				const weightnum = Math.max(5, Math.floor(weight.ppf(Math.random() )));
				y.push(weightnum);
				const weightstring = weightnum + " lbs";
				const penalty = weightnum * 25;
				const time = gaussian(1800 + penalty, 900 * penalty);
				const ticks = base + Math.max(0, Math.floor(time.ppf(Math.random() ) * 10)/10);
				x.push(ticks);
				race.push({
					id: i * 100 + j,
					firstname: short[Math.floor(Math.random() * short.length)],
					lastname: long[Math.floor(Math.random() * long.length)],
					weight: weightstring,
					weightnum: weightnum,
					time: ticks_to_string(ticks),
					ticks: ticks,
				});
			}
			values.push({ title, race, x, y });
		}
		process(values);
		this.setState({ values });
	}

	loadCSV(e) {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		const that = this;
		reader.onload = function(e) {
			var contents = e.target.result;
			const values = parse(contents);
			that.setState({ values });
		};
		reader.readAsText(file);
	}

	render() {
		return (
			<div class="main">
				<input type="file" onChange={ this.loadCSV } />
				{ this.state.values.map( (value, index) => (
					<Fragment>
						<div class={ "parallax" + index }>
							<h1>{ value.title }</h1>
						</div>
						<Selection 
							race={ value.race } 
							keys={ this.state.keys }
							names={ this.state.names }
							sorters={ this.state.sorters }
							strings={ this.state.strings }
							padded={ this.state.padded }
							racenum={ index }
						/>
					</Fragment>	
				))}
			</div>
		);
	}
}							 
export default App;