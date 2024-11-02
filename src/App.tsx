import './App.css';
import { useMarker } from './useMaker';

function App() {
	const { drawStar, exportDrawing } = useMarker();

	drawStar();

	return (
		<>
			<div id="canvas-container"></div>
			<button id="btn-download" onClick={exportDrawing}>
				Download
			</button>
		</>
	);
}

export default App;
