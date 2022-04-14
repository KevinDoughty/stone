import { h, Component } from "preact";
import { firstSelection } from "./shared.js";

class Buttons extends Component {
	equalArrays(a,b) {
		if (a && b && a.length === b.length) {
			const length = a.length;
			for (let i=0; i<length; i++) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		}
		return false;
	}
	matches(sort,ascending) {
		const props = this.props;
		const sorted = this.props.sorted;
		return (props.sort === sort && props.ascending[sort] === ascending && 
			this.equalArrays(props.selection, firstSelection(sort,sorted,props))
		);
	}
	render(props) {
		const zero = this.matches(3,false) ? " lit" : ""
		const one = this.matches(4,true) ? " lit" : ""
		const two = this.matches(5,true) ? " lit" : ""
		return (
			<div class="buttons">
				<button class={ "button" + zero } value="weight" onClick={ props.handleButton(0) } { ...props }>Weight 🥇</button>
				<button class={ "button" + one } value="time" onClick={ props.handleButton(1) }{ ...props }>Time 🥇</button>
				<button class={ "button" + two } value="combined" onClick={ props.handleButton(2) }{ ...props }>Combined 🥇</button>
			</div>
		);
	}
}
export default Buttons;