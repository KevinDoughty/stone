import { h, Component } from "preact";
import Graph from "./Graph.jsx";
import Table from "./Table.jsx";
import Buttons from "./Buttons.jsx";
import { firstSelection, sortFunction } from "./shared.js";

class Selection extends Component {
	state = {
		selection:[],
		sort: 5
	};
	constructor(props) {
		super();
		this.handleRow = this.handleRow.bind(this);
		this.handleButton = this.handleButton.bind(this);
		this.handleHeader = this.handleHeader.bind(this);
		const ascending = props.keys.map( function(key) {
			return true;
		});
		this.setState({ ascending });
  	}
	handleRow(row) {
		return (function(e) {
			const index = this.state.selection.indexOf(row);
			if (index !== -1) {
				const selection = [];
				this.setState({ selection });
			} else {
				const selection = [row];
				this.setState({ selection });
			}
		}).bind(this);
	}
	firstSelection(sort,sorted,props) {
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
	handleButton(index) {
		return (function(e) {
			const props = this.props;
			if (index === 0) { // weight
				const sort = 3;
				const ascending = this.state.ascending.slice(0);
				ascending[sort] = false;
				const sorted = this.sorted(sort,false);
				const selection = firstSelection(sort,sorted,props);
				this.setState({ sort, ascending, selection });
			} else if (index === 1 ) { // time
				const sort = 4;
				const ascending = this.state.ascending.slice(0);
				ascending[sort] = true;
				const sorted = this.sorted(sort,true);
				const selection = firstSelection(sort,sorted,props);
				this.setState({ sort, ascending, selection });
			} else if (index === 2) { // combined
				const sort = 5;
				const ascending = this.state.ascending.slice(0);
				ascending[sort] = true;
				const sorted = this.sorted(sort,true);
				const selection = firstSelection(sort,sorted,props);
				this.setState({ sort, ascending, selection });
			}
		}).bind(this);
	}
	handleHeader(sort) {
		return (function(e) {
			const ascending = this.state.ascending.slice(0);
			if (sort === this.state.sort) {
				ascending[sort] = !ascending[sort];
			}
			this.setState({ sort, ascending });
		}).bind(this);
	}
	sorted(sort,ascending,props) {
		if (typeof props === "undefined") props = this.props;
		if (typeof sort === "undefined") sort = this.state.sort;
		if (typeof ascending === "undefined") ascending = this.state.ascending[sort];
		const key = props.sorters[sort];
		const found = props.strings.find(o => o === key);
		const isAlphabetic = found ? true : false;
		return props.race.sort(sortFunction(key,ascending,isAlphabetic));
	}
	reset(props,state) {
		if (props.race === state.race) return;

		const sort = 5;
		const sorted = this.sorted(sort,true,props);
		const ascending = this.props.keys.map( function(key) {
		return true;
		});
		const selection = firstSelection(sort, sorted, props);
		this.setState({ sort, ascending, selection, race:props.race });
	}
	componentDidMount() {
		this.reset(this.props,this.state);
	}
	componentWillUpdate(props,state) {
		this.reset(props,this.state);
	}
	render(props) {
		const sorted = this.sorted();
		return (
			<section>
				<Graph { ...props } handleRow={ this.handleRow } selection={ this.state.selection }/>
				<div>
					<Buttons {...props } sorted={ sorted } handleButton={ this.handleButton } selection={ this.state.selection } sort={ this.state.sort } ascending={ this.state.ascending }/>
					<Table { ...props } sorted={ sorted } handleRow={ this.handleRow } handleHeader={ this.handleHeader } selection={ this.state.selection } sort={ this.state.sort } ascending={ this.state.ascending }/>
				</div>
			</section>
		);
	}
}
export default Selection;