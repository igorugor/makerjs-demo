import './App.css';
import { useMarker } from './useMaker';

function App() {
	const { drawStar, exportDrawing, createCircle, adjustCircle } = useMarker();

	drawStar();

	return (
		<div id="main-container">
			<div
				id="canvas-container"
				style={{
					height: 350,
				}}
			></div>
			<button id="btn-download" onClick={exportDrawing}>
				Download
			</button>

			<button id="btn-generate" onClick={createCircle}>
				Generate circle
			</button>
			<button id="btn-generate" onClick={adjustCircle}>
				Adjust last added circle posititon
			</button>
		</div>
	);
}

export default App;
