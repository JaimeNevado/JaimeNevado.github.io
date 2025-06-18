const workoutPlan = [
	// AÑADIDO: 'rest' en segundos para ejercicios compuestos
	{
		day: 1, focus: "Torso A - Empuje", time: 75, exercises: [
			{ name: "Press de Banca con Barra", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://i.pinimg.com/originals/a6/4d/df/a64ddf7b1d4775a7ca05302c0c31c881.gif" },
			{ name: "Press Inclinado con Mancuernas", sets: 3, reps: "10-12", time: 8, imageUrl: "https://i.pinimg.com/originals/f4/72/94/f47294c0af7d4dc0e55b83a6ce56167b.gif" },
			{ name: "Press Militar con Mancuernas", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://i.pinimg.com/originals/24/9f/c2/249fc2fd2614e0a54ee0e6c8839a0a9e.gif" },
			{ name: "Elevaciones Laterales", sets: 3, reps: "12-15", time: 7, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/03341301-Dumbbell-Lateral-Raise_shoulder-AFIX_720.gif" },
			{ name: "Fondos en Paralelas", sets: 3, reps: "Al fallo", time: 7, imageUrl: "https://www.thingys.com.ar/gymapps/tutorial/fondos.gif" },
			{ name: "Extensión de Tríceps en Polea", sets: 3, reps: "12-15", time: 7, imageUrl: "https://media.tenor.com/mbebKudZjxYAAAAM/tr%C3%ADceps-pulley.gif" },
			{ name: "Elevación de Piernas Colgado", sets: 4, reps: "15-20", time: 8, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/28871301-Cable-Hanging-Leg-Raise_Waist_720.gif" },
			{ name: "Plancha Abdominal", sets: 3, reps: "60 seg", time: 5, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/04631301-Front-Plank_waist-FIX_720.gif" },
		]
	},
	{
		day: 2, focus: "Torso B - Tracción", time: 70, exercises: [
			{ name: "Jalón al Pecho (en máquina)", sets: 4, reps: "8-10", time: 10, imageUrl: "https://vitruve.fit/wp-content/uploads/2021/11/vitruvs.gif" },
			{ name: "Remo con Barra", sets: 3, reps: "8-10", time: 8, rest: 120, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/01181301-Barbell-Reverse-Grip-Bent-over-Row_Back-FIX_720.gif" },
			{ name: "Remo en Máquina (agarre cerrado)", sets: 3, reps: "10-12", time: 7, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/13501301-Lever-Seated-Row_Back_720.gif" },
			{ name: "Pájaros (Elevaciones posteriores)", sets: 3, reps: "15-20", time: 7, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/03801301-Dumbbell-Rear-Lateral-Raise_Shoulders_720.gif" },
			{ name: "Curl de Bíceps con Barra Z", sets: 4, reps: "10-12", time: 8, imageUrl: "https://i.pinimg.com/originals/aa/6f/fe/aa6ffe1a46473271210fa4f6636f7a4d.gif" },
			{ name: "Curl Martillo con Mancuernas", sets: 3, reps: "12-15", time: 7, imageUrl: "https://i.pinimg.com/originals/85/c5/2a/85c52aede8d5bd99858c6ca83b89082f.gif" },
			{ name: "Encogimientos de Hombros", sets: 4, reps: "15", time: 7, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/04061301-Dumbbell-Shrug_Back-FIX_720.gif" },
			{ name: "Crunch en Polea Alta", sets: 4, reps: "15-20", time: 8, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/01751301-Cable-Kneeling-Crunch_Waist-FIX_720.gif" },
		]
	},
	{
		day: 3, focus: "Pierna y Cardio", time: 60, exercises: [
			{ name: "Sentadillas con Barra", sets: 4, reps: "8-10", time: 12, rest: 120, imageUrl: "https://static.wixstatic.com/media/c94d75_4288a5e3777e486bb5a72bda248d9540~mv2.gif" },
			{ name: "Prensa Inclinada", sets: 3, reps: "12-15", time: 8, rest: 120, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/15751301-Sled-45%C2%B0-Narrow-Stance-Leg-Press_Thighs_720.gif" },
			{ name: "Extensiones de Cuádriceps", sets: 3, reps: "15", time: 7, imageUrl: "https://i.pinimg.com/originals/2f/88/8a/2f888a80d3e49f5e31ee372116437540.gif" },
			{ name: "Curl Femoral Tumbado", sets: 4, reps: "12-15", time: 8, imageUrl: "https://fitcron.com/wp-content/uploads/2021/04/05861301-Lever-Lying-Leg-Curl_Thighs_720.gif" },
			{ name: "Elevación de Gemelos de pie", sets: 5, reps: "20", time: 8, imageUrl: "https://www.thingys.com.ar/gymapps/tutorial/parado_v.gif" },
			{ name: "Cardio en Elíptica/Bici", sets: 1, reps: "15 min", time: 15, imageUrl: "https://fitcron.com/wp-content/uploads/2021/03/21381301-Stationary-Bike-Run-version-3_Cardio_720.gif" },
		]
	},
	{
		day: 4, focus: "Torso A - Empuje (Intensidad)", time: 75, exercises: [
			{ name: "Press Inclinado con Barra", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://gymvisual.com/img/p/4/3/8/4/4384.gif" },
			{ name: "Aperturas con Mancuernas", sets: 3, reps: "12-15", time: 7, imageUrl: "https://gymvisual.com/img/p/1/0/2/3/8/10238.gif" },
			{ name: "Press Arnold (hombros)", sets: 4, reps: "10-12", time: 10, imageUrl: "https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/arnold-press.gif" },
			{ name: "Elevaciones Frontales con disco", sets: 3, reps: "12-15", time: 7, imageUrl: "https://weighttraining.guide/wp-content/uploads/2021/08/Plate-front-raise.gif" },
			{ name: "Press Francés", sets: 4, reps: "10-12", time: 8, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif" },
			{ name: "Patada de Tríceps en Polea", sets: 3, reps: "15", time: 7, imageUrl: "https://gymvisual.com/img/p/1/7/3/0/1/17301.gif" },
			{ name: "Rueda Abdominal", sets: 4, reps: "10-15", time: 8, imageUrl: "https://media.tenor.com/uQj5_83jMAIAAAAC/ab-roller-exercise.gif" },
			{ name: "Giros Rusos con peso", sets: 3, reps: "20", time: 5, imageUrl: "https://media.tenor.com/jAy0x3m25pAAAAAC/russian-twist.gif" },
		]
	},
	{
		day: 5, focus: "Torso B - Tracción (Intensidad)", time: 70, exercises: [
			{ name: "Remo con Mancuerna a una mano", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/dumbbell-row.gif" },
			{ name: "Jalón al Pecho (agarre ancho)", sets: 3, reps: "10-12", time: 8, imageUrl: "https://static.strengthlevel.com/images/illustrations/wide-grip-lat-pulldown-1000x1000.jpg" },
			{ name: "Face Pull (polea alta)", sets: 3, reps: "15-20", time: 7, imageUrl: "https://www.strengthlog.com/wp-content/uploads/2022/03/Face-pull.gif" },
			{ name: "Pullover en Polea Alta", sets: 3, reps: "12-15", time: 7, imageUrl: "https://www.strengthlog.com/wp-content/uploads/2022/03/Straight-Arm-Lat-Pulldown.gif" },
			{ name: "Curl de Bíceps Concentrado", sets: 4, reps: "12", time: 8, imageUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/11/concentration-curl.gif" },
			{ name: "Curl de Bíceps en Polea Baja", sets: 3, reps: "15", time: 7, imageUrl: "https://i.makeagif.com/media/9-19-2015/m7KzK2.gif" },
			{ name: "Hiperextensiones (Lumbares)", sets: 3, reps: "15", time: 7, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Hyperextension.gif" },
			{ name: "Abdominales en máquina", sets: 4, reps: "15-20", time: 8, imageUrl: "https://gymvisual.com/img/p/2/3/1/8/1/23181.gif" },
		]
	},
	{
		day: 6, focus: "DESCANSO ACTIVO", time: 30, exercises: [
			{ name: "Caminata ligera", sets: 1, reps: "20-30 min", time: 30, imageUrl: "https://cdn.dribbble.com/users/454993/screenshots/2596953/walk_cycle.gif" },
			{ name: "Estiramientos", sets: 1, reps: "10-15 min", time: 0, imageUrl: "https://www.icegif.com/wp-content/uploads/2022/08/icegif-945.gif" }]
	},
	{ day: 7, focus: "DESCANSO TOTAL", time: 0, exercises: [] },
	{
		day: 8, focus: "Torso A - Empuje", time: 75, exercises: [
			{ name: "Press de Banca con Barra", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/barbellbenchpress-1457475143.gif" },
			{ name: "Press Inclinado con Mancuernas", sets: 3, reps: "10-12", time: 8, imageUrl: "https://media1.popsugar-assets.com/files/thumbor/gD1-d_81W2l3-pZ_3d_T-s_T-ZU/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2019/02/13/815/n/1922729/e52a8c3866184852_PS19_02_08_NB_Pinterest_Fitness_Teaser_InclineDumbbell/i/Incline-Dumbbell-Press.gif" },
			{ name: "Press Militar con Mancuernas", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://www.burnthefatinnercircle.com/members/images/1897.gif" },
			{ name: "Elevaciones Laterales", sets: 3, reps: "12-15", time: 7, imageUrl: "https://newlife.com.cy/wp-content/uploads/2019/11/23161101-Dumbbell-Standing-Lateral-Raise_Shoulders_360.gif" },
			{ name: "Fondos en Paralelas", sets: 3, reps: "Al fallo", time: 7, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Dips.gif" },
			{ name: "Extensión de Tríceps en Polea", sets: 3, reps: "12-15", time: 7, imageUrl: "https://media.tenor.com/j67b3R8Z_JcAAAAC/tricep-pushdown.gif" },
			{ name: "Elevación de Piernas Colgado", sets: 4, reps: "15-20", time: 8, imageUrl: "https://i.pinimg.com/originals/0f/52/de/0f52de344f1741743a1a673413c19a44.gif" },
			{ name: "Plancha Abdominal", sets: 3, reps: "60 seg", time: 5, imageUrl: "https://media.self.com/photos/57d88de246d0cb351c8c4e6c/master/w_1600%2Cc_limit/PLANK.gif" }]
	},
	{
		day: 9, focus: "Torso B - Tracción", time: 70, exercises: [
			{ name: "Jalón al Pecho (en máquina)", sets: 4, reps: "8-10", time: 10, imageUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lat-pulldown.gif" },
			{ name: "Remo con Barra", sets: 3, reps: "8-10", time: 8, rest: 120, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif" },
			{ name: "Remo en Máquina (agarre cerrado)", sets: 3, reps: "10-12", time: 7, imageUrl: "https://gymvisual.com/img/p/1/7/3/6/3/17363.gif" },
			{ name: "Pájaros (Elevaciones posteriores)", sets: 3, reps: "15-20", time: 7, imageUrl: "https://i.makeagif.com/media/9-22-2015/MJJv3R.gif" },
			{ name: "Curl de Bíceps con Barra Z", sets: 4, reps: "10-12", time: 8, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/EZ-Bar-Curl.gif" },
			{ name: "Curl Martillo con Mancuernas", sets: 3, reps: "12-15", time: 7, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Hammer-Curl.gif" },
			{ name: "Encogimientos de Hombros", sets: 4, reps: "15", time: 7, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/04/Dumbbell-Shrug.gif" },
			{ name: "Crunch en Polea Alta", sets: 4, reps: "15-20", time: 8, imageUrl: "https://i.pinimg.com/originals/84/a3/3e/84a33e69615e43441de2a0335e4763ea.gif" }]
	},
	{
		day: 10, focus: "Pierna y Cardio", time: 60, exercises: [
			{ name: "Sentadillas con Barra", sets: 4, reps: "8-10", time: 12, rest: 120, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/barbellsquat-1457043813.gif" },
			{ name: "Prensa Inclinada", sets: 3, reps: "12-15", time: 8, rest: 120, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Leg-Press.gif" },
			{ name: "Extensiones de Cuádriceps", sets: 3, reps: "15", time: 7, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Leg-Extension.gif" },
			{ name: "Curl Femoral Tumbado", sets: 4, reps: "12-15", time: 8, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif" },
			{ name: "Elevación de Gemelos de pie", sets: 5, reps: "20", time: 8, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Standing-Calf-Raise.gif" },
			{ name: "Cardio en Elíptica/Bici", sets: 1, reps: "15 min", time: 15, imageUrl: "https://j.gifs.com/pQ3A1B.gif" }]
	},
	{
		day: 11, focus: "Torso A - Empuje (Intensidad)", time: 75, exercises: [
			{ name: "Press Inclinado con Barra", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://gymvisual.com/img/p/4/3/8/4/4384.gif" },
			{ name: "Aperturas con Mancuernas", sets: 3, reps: "12-15", time: 7, imageUrl: "https://gymvisual.com/img/p/1/0/2/3/8/10238.gif" },
			{ name: "Press Arnold (hombros)", sets: 4, reps: "10-12", time: 10, imageUrl: "https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/arnold-press.gif" },
			{ name: "Elevaciones Frontales con disco", sets: 3, reps: "12-15", time: 7, imageUrl: "https://weighttraining.guide/wp-content/uploads/2021/08/Plate-front-raise.gif" },
			{ name: "Press Francés", sets: 4, reps: "10-12", time: 8, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif" },
			{ name: "Patada de Tríceps en Polea", sets: 3, reps: "15", time: 7, imageUrl: "https://gymvisual.com/img/p/1/7/3/0/1/17301.gif" },
			{ name: "Rueda Abdominal", sets: 4, reps: "10-15", time: 8, imageUrl: "https://media.tenor.com/uQj5_83jMAIAAAAC/ab-roller-exercise.gif" },
			{ name: "Giros Rusos con peso", sets: 3, reps: "20", time: 5, imageUrl: "https://media.tenor.com/jAy0x3m25pAAAAAC/russian-twist.gif" }]
	},
	{
		day: 12, focus: "Torso B - Tracción (Intensidad)", time: 70, exercises: [
			{ name: "Remo con Mancuerna a una mano", sets: 4, reps: "8-10", time: 10, rest: 120, imageUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/dumbbell-row.gif" },
			{ name: "Jalón al Pecho (agarre ancho)", sets: 3, reps: "10-12", time: 8, imageUrl: "https://static.strengthlevel.com/images/illustrations/wide-grip-lat-pulldown-1000x1000.jpg" },
			{ name: "Face Pull (polea alta)", sets: 3, reps: "15-20", time: 7, imageUrl: "https://www.strengthlog.com/wp-content/uploads/2022/03/Face-pull.gif" },
			{ name: "Pullover en Polea Alta", sets: 3, reps: "12-15", time: 7, imageUrl: "https://www.strengthlog.com/wp-content/uploads/2022/03/Straight-Arm-Lat-Pulldown.gif" },
			{ name: "Curl de Bíceps Concentrado", sets: 4, reps: "12", time: 8, imageUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/11/concentration-curl.gif" },
			{ name: "Curl de Bíceps en Polea Baja", sets: 3, reps: "15", time: 7, imageUrl: "https://i.makeagif.com/media/9-19-2015/m7KzK2.gif" },
			{ name: "Hiperextensiones (Lumbares)", sets: 3, reps: "15", time: 7, imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Hyperextension.gif" },
			{ name: "Abdominales en máquina", sets: 4, reps: "15-20", time: 8, imageUrl: "https://gymvisual.com/img/p/2/3/1/8/1/23181.gif" }]
	},
	{
		day: 13, focus: "Full Body Ligero", time: 50, exercises: [
			{ name: "Press de Banca en Máquina", sets: 3, reps: "15", time: 10, imageUrl: "https://gymvisual.com/img/p/5/4/8/1/5481.gif" },
			{ name: "Jalón al Pecho", sets: 3, reps: "15", time: 10, imageUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lat-pulldown.gif" },
			{ name: "Press Hombros en Máquina", sets: 3, reps: "15", time: 10, imageUrl: "https://gymvisual.com/img/p/5/7/2/9/5729.gif" },
			{ name: "Curl Bíceps + Ext. Tríceps", sets: 3, reps: "15", time: 10, imageUrl: "https://thumbs.gfycat.com/LightheartedSinfulChuckwalla-size_restricted.gif" },
			{ name: "Plancha y Crunches", sets: 3, reps: "Al fallo", time: 10, imageUrl: "https://media.tenor.com/2oI5h2p-RwwAAAAC/crunches-workout.gif" }]
	},
	{
		day: 14, focus: "DESCANSO ACTIVO", time: 30, exercises: [
			{ name: "Caminata ligera", sets: 1, reps: "20-30 min", time: 30, imageUrl: "https://cdn.dribbble.com/users/454993/screenshots/2596953/walk_cycle.gif" },
			{ name: "Estiramientos", sets: 1, reps: "10-15 min", time: 0, imageUrl: "https://www.icegif.com/wp-content/uploads/2022/08/icegif-945.gif" }]
	},
	{ day: 15, focus: "DESCANSO TOTAL", time: 0, exercises: [] }
];

document.addEventListener('DOMContentLoaded', () => {
	const daysContainer = document.getElementById('days-container');
	const exercisesContainer = document.getElementById('exercises-container');
	const setsModal = document.getElementById('exercise-modal');
	const imageModal = document.getElementById('image-modal');
	const modalTitle = document.getElementById('modal-title');
	const modalBody = document.getElementById('modal-body');
	const setsCloseBtn = document.getElementById('sets-close-btn');
	const imageCloseBtn = document.getElementById('image-close-btn');
	const modalImage = document.getElementById('modal-image');

	const timerContainer = document.getElementById('timer-container');
	const timerDisplay = document.getElementById('timer-display');
	const notificationSound = document.getElementById('timer-finished-sound');
	let timerInterval = null;
	const DEFAULT_REST_SECONDS = 90;

	let progress = JSON.parse(localStorage.getItem('workoutProgress_timer_v1')) || {};

	function saveProgress() {
		localStorage.setItem('workoutProgress_timer_v1', JSON.stringify(progress));
	}

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		let remainingSeconds = seconds % 60;
		if (remainingSeconds < 10) {
			remainingSeconds = '0' + remainingSeconds;
		}
		return `${minutes}:${remainingSeconds}`;
	}

	function stopTimer() {
		clearInterval(timerInterval);
		timerInterval = null;
		if (timerContainer) { // Check if timerContainer exists before accessing its style
			timerContainer.style.display = 'none';
			timerContainer.classList.remove('finished');
		}
	}

	function startTimer(durationInSeconds) {
		stopTimer();

		let timeLeft = durationInSeconds;
		timerContainer.style.display = 'block';
		timerDisplay.textContent = formatTime(timeLeft);

		timerInterval = setInterval(() => {
			timeLeft--;
			timerDisplay.textContent = formatTime(timeLeft);

			if (timeLeft <= 0) {
				stopTimer();
				timerContainer.style.display = 'block';
				timerContainer.classList.add('finished');
				timerDisplay.textContent = "¡A por la siguiente!";
				notificationSound.play();
			}
		}, 1000);
	}

	function renderDays() {
		daysContainer.innerHTML = '';
		let firstUncompletedDay = workoutPlan.findIndex((day, index) => !progress[`day-${index}`]);
		if (firstUncompletedDay === -1) firstUncompletedDay = workoutPlan.length;

		workoutPlan.forEach((day, index) => {
			const dayBtn = document.createElement('button');
			dayBtn.className = 'day-btn';
			dayBtn.dataset.dayIndex = index;
			dayBtn.innerHTML = `<span class="day-title">Día ${day.day}</span><span class="day-focus">${day.focus}</span>`;

			if (progress[`day-${index}`]) dayBtn.classList.add('completed');
			else if (index === firstUncompletedDay) dayBtn.classList.add('current');
			else dayBtn.classList.add('locked');

			if (!dayBtn.classList.contains('locked')) {
				dayBtn.addEventListener('click', () => renderExercises(index));
			}
			daysContainer.appendChild(dayBtn);
		});
	}

	function renderExercises(dayIndex) {
		exercisesContainer.innerHTML = '';
		const dayData = workoutPlan[dayIndex];

		if (dayData.exercises.length === 0) {
			exercisesContainer.innerHTML = `<h3>Día de descanso. ¡Aprovéchalo para recuperarte!</h3>`;
			if (!progress[`day-${dayIndex}`]) {
				progress[`day-${dayIndex}`] = true;
				saveProgress();
				setTimeout(renderDays, 500);
			}
			return;
		}

		const header = document.createElement('div');
		header.id = 'workout-header';
		header.innerHTML = `<h2>Día ${dayData.day}: ${dayData.focus}</h2><span>Tiempo: ${dayData.time} min</span>`;
		exercisesContainer.appendChild(header);

		dayData.exercises.forEach((exercise, exerciseIndex) => {
			const key = `d${dayIndex}-e${exerciseIndex}`;
			const exerciseItem = document.createElement('div');
			exerciseItem.className = 'exercise-item';

			exerciseItem.innerHTML = `
                    <div class="exercise-content" data-day-index="${dayIndex}" data-exercise-index="${exerciseIndex}">
                        <span class="exercise-name">${exercise.name}</span>
                        <div class="exercise-details-preview">${exercise.sets} series x ${exercise.reps} reps</div>
                    </div>
                    <div class="exercise-info">
                        <span class="exercise-time">~${exercise.time} min</span>
                        <span class="info-icon" data-image-url="${exercise.imageUrl}" title="Ver demostración del ejercicio">i</span>
                    </div>`;

			if (progress[key]) exerciseItem.classList.add('completed');
			exercisesContainer.appendChild(exerciseItem);
		});

		exercisesContainer.querySelectorAll('.exercise-content').forEach(el => {
			el.addEventListener('click', (e) => {
				const dayIndex = e.currentTarget.dataset.dayIndex;
				const exerciseIndex = e.currentTarget.dataset.exerciseIndex;
				showSetsModal(parseInt(dayIndex), parseInt(exerciseIndex));
			});
		});

		exercisesContainer.querySelectorAll('.info-icon').forEach(el => {
			el.addEventListener('click', (e) => {
				e.stopPropagation();
				showImageModal(e.currentTarget.dataset.imageUrl);
			});
		});

		exercisesContainer.scrollIntoView({ behavior: 'smooth' });
	}

	function showSetsModal(dayIndex, exerciseIndex) {
		const exercise = workoutPlan[dayIndex].exercises[exerciseIndex];
		modalTitle.textContent = exercise.name;
		modalBody.innerHTML = '';
		stopTimer(); // Asegura que el timer está parado al abrir una nueva ventana

		for (let i = 0; i < exercise.sets; i++) {
			const setKey = `d${dayIndex}-e${exerciseIndex}-s${i}`;
			const setItem = document.createElement('div');
			setItem.className = 'set-item';
			setItem.innerHTML = `
                    <input type="checkbox" id="${setKey}" class="set-checkbox" ${progress[setKey] ? 'checked' : ''}>
                    <label for="${setKey}" class="set-label">Serie ${i + 1}: ${exercise.reps}</label>`;

			setItem.querySelector('.set-checkbox').addEventListener('change', (e) => {
				progress[e.target.id] = e.target.checked;
				saveProgress();
				checkCompletion(dayIndex, exerciseIndex);

				if (e.target.checked) {
					const restTime = exercise.rest || DEFAULT_REST_SECONDS;
					startTimer(restTime);
				} else {
					stopTimer();
				}
			});
			modalBody.appendChild(setItem);
		}
		setsModal.style.display = 'flex';
	}

	function showImageModal(imageUrl) {
		modalImage.src = imageUrl;
		imageModal.style.display = 'flex';
	}

	function checkCompletion(dayIndex, exerciseIndex) {
		const exercise = workoutPlan[dayIndex].exercises[exerciseIndex];
		const allSetsDone = Array.from({ length: exercise.sets }, (_, i) => progress[`d${dayIndex}-e${exerciseIndex}-s${i}`]).every(Boolean);

		const exerciseKey = `d${dayIndex}-e${exerciseIndex}`;
		if (allSetsDone) {
			if (!progress[exerciseKey]) {
				progress[exerciseKey] = true;
				saveProgress();
				renderExercises(dayIndex);
			}
		} else if (progress[exerciseKey]) {
			delete progress[exerciseKey];
			saveProgress();
			renderExercises(dayIndex);
		}

		const dayData = workoutPlan[dayIndex];
		const allExercisesDone = dayData.exercises.every((_, i) => progress[`d${dayIndex}-e${i}`]);

		if (allExercisesDone && dayData.exercises.length > 0 && !progress[`day-${dayIndex}`]) {
			progress[`day-${dayIndex}`] = true;
			saveProgress();
			renderDays();
			setTimeout(() => alert(`¡Día ${dayData.day} completado! ¡Gran trabajo!`), 500);
		}
	}

	function closeModal() {
		stopTimer();
		setsModal.style.display = 'none';
		imageModal.style.display = 'none';
		modalImage.src = "";
	}

	setsCloseBtn.addEventListener('click', closeModal);
	imageCloseBtn.addEventListener('click', closeModal);
	window.addEventListener('click', (e) => {
		if (e.target == setsModal || e.target == imageModal) {
			closeModal();
		}
	});

	renderDays();
});