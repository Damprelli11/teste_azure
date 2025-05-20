import {Routes, Route, Navigate} from 'react-router-dom'
import {PrivateRoute} from './components/PrivateRoute'
import {Menu} from './components/Menu'
import {Footer} from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import CadastroUsuario from './pages/CadastroUsuario'
import EditarUsuario from './pages/EditarUsuario'
import Eventos from './pages/Eventos'
import CadastroEvento from './pages/CadastroEvento'
import EditarEvento from './pages/EditarEvento'
import Projetos from './pages/Projetos'
import CadastroProjeto from './pages/CadastroProjeto'
import EditarProjeto from './pages/EditarProjeto'
import Doacoes from './pages/Doacoes'
import CadastroDoacao from './pages/CadastroDoacao'
import EventoDetalhe from './pages/EventoDetalhe'

export default function App() {

  // Checa se está autenticado
  const isAuthenticated = localStorage.getItem('auth') === 'true'

  return (
    <>
    <Menu/>
    <main className="dashboard-main">
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home/> : <Navigate to="/login" replace />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/cadastro' element={<Cadastro/>}/>
        <Route path='/home' element={<PrivateRoute><Home/></PrivateRoute>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path='/usuarios' element={<PrivateRoute><Usuarios/></PrivateRoute>}/>
        <Route path='/usuarios/novo' element={<PrivateRoute><CadastroUsuario/></PrivateRoute>}/>
        <Route path='/usuarios/editar/:id' element={<PrivateRoute><EditarUsuario/></PrivateRoute>}/>
        <Route path='/eventos' element={<PrivateRoute><Eventos/></PrivateRoute>}/>
        <Route path='/eventos/novo' element={<PrivateRoute><CadastroEvento/></PrivateRoute>}/>
        <Route path='/eventos/editar/:id' element={<PrivateRoute><EditarEvento/></PrivateRoute>}/>
        <Route path='/eventos/:id' element={<EventoDetalhe />} />
        <Route path='/projetos' element={<PrivateRoute><Projetos/></PrivateRoute>}/>
        <Route path='/projetos/novo' element={<PrivateRoute><CadastroProjeto/></PrivateRoute>}/>
        <Route path='/projetos/editar/:id' element={<PrivateRoute><EditarProjeto/></PrivateRoute>}/>
        <Route path='/doacoes' element={<PrivateRoute><Doacoes /></PrivateRoute>}/>
        <Route path='/doacoes/novo' element={<PrivateRoute><CadastroDoacao /></PrivateRoute>}/>
        <Route path='/doacoes/editar/:id' element={<PrivateRoute><CadastroDoacao /></PrivateRoute>}/>
      </Routes>
    </main>
    <Footer />
    </>
  )
}

