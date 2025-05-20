import { useNavigate } from "react-router-dom"

export default function Dashboard(){

    const navigate = useNavigate()
    const handleLogout = () =>{
        localStorage.removeItem('auth')
        navigate('/')
    }

    return(
        <div>
            <h1>Dashboard</h1>
            <p>Área privada da aplicação</p>
            <button onClick={handleLogout}>Sair</button>
        </div>
    )
}