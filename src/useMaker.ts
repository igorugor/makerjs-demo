import makerjs, { IModel, IPathCircle } from 'makerjs';
import { useEffect, useState } from 'react';

export const useMarker = () => {
	const screenWidth = window.innerWidth;

	const rectangleModel = new makerjs.models.Rectangle(screenWidth / 2, 350);
	rectangleModel.origin = [250, 50];

	makerjs.model.addCaption(rectangleModel, 'Rectangle sample');

	const [canvasContainer, setMainContainer] = useState<HTMLElement | null>(null);
	const [model, setModel] = useState<IModel>(rectangleModel);
	const [coords, setCoords] = useState([-1, -1]);

	const drawStar = () => {
		if (canvasContainer) {
			canvasContainer.innerHTML = makerjs.exporter.toSVG(model);
		}
	};

	const exportDrawing = () => {
		const output = makerjs.exporter.toDXF(model);

		const blob = new Blob([output]);
		const blobUri = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.download = 'model.dxf';
		link.href = blobUri;
		link.click();
		link.remove();
	};

	const convertToMarkerJsCoords = (x: number, y: number, container: HTMLElement) => {
		const containerRect = container.getBoundingClientRect();

		const makerJsX = x - containerRect.left;
		const makerJsY = containerRect.height - (y - containerRect.top);

		return {
			x: makerJsX,
			y: makerJsY,
		};
	};

	const convertToWindowCoords = (makerJsX: number, makerJsY: number, container: HTMLElement) => {
		const containerRect = container.getBoundingClientRect();

		const x = makerJsX + containerRect.left;
		const y = containerRect.height + containerRect.top - makerJsY;

		return {
			x,
			y,
		};
	};

	const onFigureDrop = (e: DragEvent, editModel: any) => {
		if (!canvasContainer) {
			return null;
		}
		const dragContainer = document.getElementById('drag');

		const converted = convertToMarkerJsCoords(e.clientX, e.clientY, canvasContainer);

		editModel.origin = [converted.x, converted.y];

		setCoords([converted.x, converted.y]);

		const newModel: IModel = {
			...model,
			paths: {
				...model.paths,
				editModel,
			},
		};

		if (canvasContainer) {
			canvasContainer.innerHTML = makerjs.exporter.toSVG(newModel);
		}

		dragContainer?.remove();
		setModel(newModel);
	};

	const adjustCircle = () => {
		if (canvasContainer) {
			const screenCoords = convertToWindowCoords(coords[0], coords[1], canvasContainer);

			const circle: IPathCircle = {
				type: 'circle',
				origin: [screenCoords.x, screenCoords.y],
				radius: 40,
			};

			const circleContainer = document.createElement('div');
			circleContainer.id = 'drag';
			circleContainer.draggable = true;
			circleContainer.classList.add('circle-container');
			circleContainer.style.top = `${screenCoords.y}px`;
			circleContainer.style.left = `${screenCoords.x}px`;
			canvasContainer.ondrop = (e) => onFigureDrop(e, circle);
			canvasContainer.ondragover = (e) => {
				e.preventDefault();
			};
			circleContainer.innerHTML = makerjs.exporter.toSVG(circle);

			const newModel: IModel = {
				...model,
				paths: {
					...model.paths,
					editModel: undefined,
				},
			};

			canvasContainer.innerHTML = makerjs.exporter.toSVG(newModel);

			canvasContainer.appendChild(circleContainer);
		}
	};

	const createCircle = () => {
		const canvas = document.getElementById('canvas-container');
		if (!canvas || !canvasContainer || !model) {
			return;
		}

		const circle: IPathCircle = {
			type: 'circle',
			origin: [0, 0],
			radius: 40,
		};

		const circleContainer = document.createElement('div');
		circleContainer.id = 'drag';
		circleContainer.draggable = true;
		circleContainer.classList.add('circle-container');
		canvasContainer.ondrop = (e) => onFigureDrop(e, circle);
		canvasContainer.ondragover = (e) => {
			e.preventDefault();
		};
		circleContainer.innerHTML = makerjs.exporter.toSVG(circle);

		canvasContainer.appendChild(circleContainer);
	};

	const handleResize = () => {
		if (canvasContainer) {
			canvasContainer.style.width = `${window.innerWidth / 2}px`;
			canvasContainer.innerHTML = makerjs.exporter.toSVG(model);
		}
	};

	useEffect(() => {
		const container = document.getElementById('canvas-container');
		if (container) {
			setMainContainer(container);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return { drawStar, exportDrawing, createCircle, adjustCircle };
};
