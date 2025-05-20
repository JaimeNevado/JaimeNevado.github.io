const images = document.querySelectorAll('.challenge-image');

images.forEach(image => {
	image.addEventListener('click', () => {
		const isCorrect = image.dataset.correct === "true";
		const existingMessage = document.getElementById('message');

		if (existingMessage) {
			existingMessage.remove();
		}

		const message = document.createElement('p');
		message.id = 'message';
		message.style.fontSize = '28px';
		message.style.marginTop = '30px';

		if (isCorrect) {
			message.textContent = '¡Correcto! Has encontrado el Airbus A380.';
			message.style.color = 'green';
		} else {
			message.textContent = '¡Vaya! No es el Airbus A380.';
			message.style.color = 'red';
		}

		document.querySelector('main').appendChild(message);
	});
});
