import './App.css';
import { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { gapi } from "gapi-script";
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define the custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://emojitool.com/img/apple/ios-15.4/round-pushpin-2246.png', // Path to your custom marker image
  iconSize: [30, 30], // Size of the marker
  iconAnchor: [15, 40], // Point of the icon that corresponds to marker's location
  popupAnchor: [0, -40] // Position of the popup relative to the icon
});

function App() {
  const clientID = "686050150868-23kbsjg10ioih5rj4ui85e2ciq3l5ekm.apps.googleusercontent.com";

  const [user, setUser] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [visitEmail, setVisitEmail] = useState('');

  const onSuccess = async (response) => {
    const { email } = response.profileObj;
    setUser({ email, name: response.profileObj.name });
  };

  const onFailure = () => {
    alert("Error al iniciar sesión con Google.");
  };

  const handleLogout = () => {
    setUser(null);
    setMarkers([]);
  };

  const fetchMarkers = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/markers/${email}`);
      setMarkers(response.data);
    } catch (error) {
      console.error("Error al obtener los marcadores:", error);
    }
  };

  const handleAddMarker = async () => {
    if (!newLocation) return alert("Introduce una ubicación.");

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("location", newLocation);
    if (newImage) formData.append("image", newImage);

    try {
      await axios.post('http://localhost:5000/add-marker', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Marcador añadido con éxito.");
      setNewLocation('');
      setNewImage(null);
      fetchMarkers(user.email);
    } catch (error) {
      console.error("Error al añadir marcador:", error);
    }
  };

  const handleVisitUserMap = async () => {
    if (!visitEmail) return alert("Introduce un correo electrónico.");
    await fetchMarkers(visitEmail);
  };

  useEffect(() => {
    if (user) {
      fetchMarkers(user.email);
    }
  }, [user]);

  return (
    <div className="App">
      <div className="App-header">
        <h1>Mi Mapa</h1>
        {!user ? (
          <GoogleLogin
            clientId={clientID}
            buttonText="Inicia sesión con Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
          />
        ) : (
          <div>
            <h2>Bienvenido, {user.name}</h2>
            <button onClick={handleLogout}>Cerrar sesión</button>

            <h3>Agregar Marcador</h3>
            <input
              type="text"
              placeholder="Ubicación (ciudad o país)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
            <button onClick={handleAddMarker}>Agregar</button>

            <MapContainer
              center={[36.72016, -4.42034]}
              zoom={2}
              style={{ height: "400px", width: "100%" }}>

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={[marker.coordinates.lat, marker.coordinates.lon]}
                  icon={customIcon} // Apply the custom icon here
                >
                  <Popup>
                    <strong>{marker.location}</strong>
                    {marker.imageUrl && <img src={marker.imageUrl} alt={marker.location} style={{ width: "100px" }} />}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {user && (
        <div className="form-container">
          <h3>Visitar Mapa de Otro Usuario</h3>
          <input
            type="email"
            placeholder="Correo electrónico del usuario"
            value={visitEmail}
            onChange={(e) => setVisitEmail(e.target.value)}
          />
          <button onClick={handleVisitUserMap}>Visitar</button>
        </div>
      )}
    </div>
  );
}

export default App;
