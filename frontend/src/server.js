const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Cloudinary
cloudinary.config({
	cloud_name: 'digykp2os',
	api_key: '369442163139246',
	api_secret: 'K9xHyv6q9lNhCzYafiWHxI0NvBY',
});

// Configuración de almacenamiento de imágenes con Multer y Cloudinary
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'map_markers', // Carpeta en tu cuenta de Cloudinary
		allowed_formats: ['jpg', 'png', 'jpeg'],
	},
});

const upload = multer({ storage });

// Conectar a MongoDB Atlas
mongoose.connect('mongodb+srv://wikiAdmin:_P5JP53hT8@cluster0.w2vxl.mongodb.net/JaimeIW?retryWrites=true&w=majority&appName=Cluster0', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log("Conectado a MongoDB Atlas");
	})
	.catch((err) => {
		console.error("Error al conectar con MongoDB Atlas:", err.message);
		process.exit(1); // Salir del proceso si no se puede conectar
	});

// Modelo de marcador (Marker)
const markerSchema = new mongoose.Schema({
	email: { type: String, required: true },
	location: { type: String, required: true },
	coordinates: { lat: Number, lon: Number },
	imageUrl: { type: String }, // URL de la imagen
});

const Marker = mongoose.model('Marker', markerSchema);

// Ruta para agregar un marcador con imagen
app.post('/add-marker', upload.single('image'), async (req, res) => {
	const { email, location } = req.body;
	const imageUrl = req.file ? req.file.path : null; // URL de la imagen en Cloudinary

	try {
		// Geocodificación con Nominatim
		const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
		const response = await axios.get(url);

		if (response.data.length === 0) {
			return res.status(404).json({ message: "No se encontraron coordenadas para la ubicación especificada." });
		}

		const { lat, lon } = response.data[0];

		// Guardar marcador en la base de datos
		const marker = new Marker({
			email,
			location,
			coordinates: { lat, lon },
			imageUrl,
		});

		await marker.save();
		res.status(201).json({ message: "Marcador agregado con éxito", marker });
	} catch (error) {
		console.error("Error al agregar el marcador:", error.message);
		res.status(500).json({ message: "Error al agregar el marcador" });
	}
});

// Ruta para obtener los marcadores de un usuario
app.get('/markers/:email', async (req, res) => {
	const { email } = req.params;

	try {
		const markers = await Marker.find({ email });
		res.json(markers);
	} catch (error) {
		console.error("Error al obtener los marcadores:", error.message);
		res.status(500).json({ message: "Error al obtener los marcadores" });
	}
});

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
