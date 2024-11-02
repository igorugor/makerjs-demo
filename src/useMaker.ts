import makerjs from 'makerjs';
import { useEffect, useState } from 'react';

export const useMarker = () => {
	const [mainContainer, setMainContainer] = useState<HTMLElement | null>(null);

	const starModel = new makerjs.models.Star(5, 100);
	const rectangleModel = new makerjs.models.Rectangle(200, 150);

	const model = {
		models: {
			starModel,
			rectangleModel,
		},
		paths: {
			starModel: starModel.paths,
			rectangleModel: rectangleModel.paths,
		},
	};

	const drawStar = () => {
		if (mainContainer) {
			mainContainer.innerHTML = makerjs.exporter.toSVG(model);
		}
	};

	const exportDrawing = () => {
		const output = makerjs.exporter.toDXF(model);

		const blob = new Blob([output]);
		const blobUri = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.download = 'star.dxf';
		link.href = blobUri;
		link.click();
		link.remove();
	};

	useEffect(() => {
		const container = document.getElementById('canvas-container');
		if (container) {
			setMainContainer(container);
		}

		// Get references to the draggable element and the droppable area
		const draggableElement = document.getElementById('draggableElement');
		const droppableArea = document.getElementById('droppableArea');

		if (draggableElement && droppableArea) {
			// Event handler for when dragging starts
			draggableElement.addEventListener('dragstart', (event) => {
				// Set the data to be transferred during the drag operation
				event.dataTransfer.setData('text/plain', event.target.id);
			});

			// Event handler for when dropping occurs
			droppableArea.addEventListener('drop', (event) => {
				// Prevent the default behavior to allow dropping
				event.preventDefault();

				console.log(event.screenX, event.screenY);

				// Retrieve the data that was set during the drag operation
				const data = event.dataTransfer.getData('text/plain');

				// Find the draggable element based on the data
				const draggableElement = document.getElementById(data);

				// Append the draggable element to the droppable area
				event.target.appendChild(draggableElement);
			});

			// Event handler for when a draggable element is being dragged over the droppable area
			droppableArea.addEventListener('dragover', (event) => {
				// Prevent the default behavior to allow dropping
				event.preventDefault();
			});
		}
	}, []);

	return { drawStar, exportDrawing };
};
