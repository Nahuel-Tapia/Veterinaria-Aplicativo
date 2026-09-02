import { Routes, Route } from 'react-router-dom';
import useSession from './Session.jsx';

import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

import Usuarios from './Usuarios.jsx';
import Usuario from './Usuario.jsx';

import Mascotas from './Mascotas.jsx';
import MascotaForm from './MascotaForm.jsx';
import MascotaDetalle from './MascotaDetalle.jsx';

import Turnos from './Turnos.jsx';
import SolicitarTurno from './SolicitarTurno.jsx';

import HistoriaClinicaForm from './HistoriaClinicaForm.jsx';

import Servicios from './Servicios.jsx';
import ServicioForm from './ServicioForm.jsx';

export default function Router() {
  const session = useSession();
  const roles = session.user?.roles || [];
  const isAdmin = roles.includes('admin');
  const isVet = roles.includes('vet');

  return (
    <Routes>
      <Route path="/" element={session.isLoggedIn ? <Dashboard /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />

      {session.isLoggedIn && (
        <>
          {/* Rutas de Mascotas */}
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/mascota/nueva" element={<MascotaForm />} />
          <Route path="/mascota/editar/:uuid" element={<MascotaForm />} />
          <Route path="/mascota/:uuid" element={<MascotaDetalle />} />

          {/* Rutas de Turnos */}
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/turnos/solicitar" element={<SolicitarTurno />} />

          {/* Rutas Médicas */}
          {(isAdmin || isVet) && (
            <Route path="/historia-clinica/nueva" element={<HistoriaClinicaForm />} />
          )}

          {/* Rutas Administrativas */}
          {isAdmin && (
            <>
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/usuario/:uuid" element={<Usuario />} />

              <Route path="/servicios" element={<Servicios />} />
              <Route path="/servicio/nuevo" element={<ServicioForm />} />
              <Route path="/servicio/editar/:uuid" element={<ServicioForm />} />
            </>
          )}
        </>
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}