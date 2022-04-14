import { h, Component } from "preact";

class Table extends Component {
	handleHeader(item) {
		return this.props.handleHeader(item);
	}
	handleRow(selection) {
		return this.props.handleRow(selection);
	}
	render(props) {
		const sorted = this.props.sorted;
		const up = "▲";//↑▴▲
		const down = "▼";//↓▾▼
		const marker = (this.props.ascending[this.props.sort] ? up : down);
		const selectedStyle = { backgroundColor: "yellow" };
		const unselectedStyle = {};
		const small = [];
		const large = [];
		const padders = {};
		props.padded.forEach( (key,index) => {
			let smallest = Number.POSITIVE_INFINITY;
			let largest = 0;
			sorted.forEach( item => {
				const string = item[key] + "";
				const length = string.length;
				if (length > largest) {
					largest = length;
					large[index] = item[key];
				}
				if (length < smallest) {
					smallest = length;
					small[index] = item[key];
				}
			});
			const full = large[index] + "";
			const array = [];
			sorted.forEach( item => {
				const string = item[key] + "";
				array.push(full.substring(0,full.length-string.length));  
			});
			padders[key] = array;
		});

		return (
			<table>
				<thead>
					<tr>
						{ props.names.map( (value,index) => {
							let classstring = "marker" + (this.props.sort !== index ? " hidden" : "");
							return (
								<th onClick={this.handleHeader(index)}>{ value }&nbsp;<span class={classstring}>{ marker }</span></th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{ sorted.map( (person,index) => (
						<tr style={ ( (props.selection.indexOf(person.uniqueIdentifier) === -1) ? unselectedStyle : selectedStyle) } onClick={this.handleRow(person.uniqueIdentifier)}>
							{ props.keys.map( (key) => {
								const pad = padders[key] && padders[key][index];
								return (
							<td>
								{ pad && pad.length && (
									<span class="padder">{ pad }</span>
								) } 
								{ person[key] }
							</td>
							)})}
						</tr>
					)) }
				</tbody>
			</table>
		)
	}
} 
export default Table;