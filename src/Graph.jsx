import { h, Component } from "preact";

class Graph extends Component {
	state = {};
	ref = null;
	setRef = (dom) => this.ref = dom;
	xLabel = "Time, slowest to fastest";
	yLabel = "Weight, lightest to heaviest";
	constructor(props) {
		super();
		this.onClick = this.onClick.bind(this);
	}
	x(x) {
		return 50 + x * 400;
	}
	y(y) {
		return 50 + 400 - y * 400;
	}
	scale(d) {
		return d * 400;
	}
	xx(x) {
		const rect = this.ref.getBoundingClientRect();
		const w = rect.width;
		const tenth = w / 10;
		const fourfifths = w * 4/5;
		return (x - tenth) / fourfifths;
	}
	yy(y) {
		const rect = this.ref.getBoundingClientRect();
		const h = rect.height;
		const tenth = h / 10;
		const fourfifths = h * 4/5;
		return 1.0 - (y - tenth) / fourfifths;
	}

	onClick(e) {
		let x = this.xx(e.offsetX);
		let y = this.yy(e.offsetY);
		let threshold = 0.05;

		let closest = null;
		this.props.race.forEach( person => {
			if (closest === null || Math.hypot(person.x-x,person.y-y) < Math.hypot(closest.x-x,closest.y-y)) {
			closest = person;
			}
		});
		if (closest !== null && Math.hypot(closest.x-x,closest.y-y) < threshold) this.props.handleRow(closest.uniqueIdentifier)();
	}

	render(props) {
		const selection = [];
		props.race.forEach( person => {
			if (props.selection.indexOf(person.uniqueIdentifier) !== -1) {
				selection.push(person);
			}
		});
		const xStyle = {
		}
		const yStyle = {
			transform:"translate3d(-50%,0,0) rotate(270deg) translate3d(50%,0,0) translate3d(0,5%,0)",
			transformOrigin: "center"
		}
		return (
			<svg class="aside" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" onClick={ this.onClick } ref={ this.setRef }>
				<defs>
					<clipPath id="0">
						<rect x="50" y="50" width="400" height="400" />
					</clipPath>
				</defs>
				<rect width="500" height="500" x="0" y="0" fill="white" />
				<rect width="400" height="400" x="50" y="50" fill="#c0c0c0" />
				<line x1={ this.x(0.0) } y1={ this.y(0.0) } x2={ this.x(0.0) } y2={ this.y(1.05) } stroke-width="1" stroke="black" />
				<line x1={ this.x(0.0) } y1={ this.y(0.0) } x2={ this.x(1.05) } y2={ this.y(0.0) } stroke-width="1" stroke="black" />
				<path d={ "M " + this.x(1.075) + " " + this.y(0.0) + " L " + this.x(1.05) + " " + this.y(0.0125) + " " + this.x(1.05) + " " + this.y(-0.0125) + " Z" } stroke-width="1" stroke="black" fill="none"/>
				<path d={ "M " + this.x(0.0) + " " + this.y(1.075) + " L " + this.x(0.0125) + " " + this.y(1.05) + " " + this.x(-0.0125) + " " + this.y(1.05) + " Z" } stroke-width="1" stroke="black" fill="none"/>
				<text y={ this.y(-0.05) } style={ xStyle } x="50%" dominant-baseline="middle" text-anchor="middle">{ this.xLabel }</text>
				<text style={ yStyle } y="50%" dominant-baseline="middle" text-anchor="middle">{ this.yLabel }</text>
				{ selection.map( selected => {
					return (
						<g>
							<path d={ "M " + this.x(1.0-selected.combined) + " " + this.y(1.0) + " A " + this.scale(selected.combined) + " " + this.scale(selected.combined) +", 0, 0, 0, " + this.x(1.0) + " " + this.y(1.0-selected.combined) + " L " + this.x(1.0) + " " + this.y(1.0) + " Z" } stroke-width="1" stroke="none" fill="white" fill-opacity="0.25" clip-path="url(#0)"/>
							<line x1={ this.x(selected.x) } y1={ this.y(selected.y) } x2={ this.x(1.0) } y2={ this.y(1.0) } stroke-width="1" stroke="yellow" />
							<circle cx={ this.x(selected.x) } cy={ this.y(selected.y) } r="6" stroke-width="1" stroke="purple" fill="yellow" />
						</g>
					);
				})}
				<g>
					{ props.race.map( person => {
						const x = this.x(person.x);
						const y = this.y(person.y);
						return (
							<circle cx={ x } cy={ y } r="3" fill={ person.uniqueIdentifier === props.selection ? "purple" : "purple" }/>
						)
					})}
				</g>
			</svg>
		);
	}
}
export default Graph;