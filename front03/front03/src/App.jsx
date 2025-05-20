import {Routes, Route} from 'react-router-dom'
import {PrivateRoute} from './components/PrivateRoute'
import {Menu} from './components/menu'
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

export default function App() {

  return (
    <>
    <Menu/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/cadastro' element={<Cadastro/>}/>
      <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path='/usuarios' element={<PrivateRoute><Usuarios/></PrivateRoute>}/>
      <Route path='/usuarios/novo' element={<PrivateRoute><CadastroUsuario/></PrivateRoute>}/>
      <Route path='/usuarios/editar/:id' element={<PrivateRoute><EditarUsuario/></PrivateRoute>}/>
      <Route path='/eventos' element={<PrivateRoute><Eventos/></PrivateRoute>}/>
      <Route path='/eventos/novo' element={<PrivateRoute><CadastroEvento/></PrivateRoute>}/>
      <Route path='/eventos/editar/:id' element={<PrivateRoute><EditarEvento/></PrivateRoute>}/>
    </Routes>
    </>
  )
}

