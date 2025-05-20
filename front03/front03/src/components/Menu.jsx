import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export function Menu() {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') === 'true')
    const location = useLocation()
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    const [relatorioOpen, setRelatorioOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false); // Novo estado para menu mobile
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('auth') === 'true')
        setMenuOpen(false); // Fecha menu ao navegar
    }, [location])

    if (!isAuthenticated) return null;

    const isActive = (to) => location.pathname.startsWith(to);

    // Função para exportar doações para Excel
    const exportarDoacoesExcel = async () => {
        try {
            const res = await axios.get('http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/doacoes/exportar-excel', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'doacoes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            alert('Erro ao exportar doações');
        }
    };

    // Função para logout
    const handleLogout = () => {
        localStorage.removeItem('auth');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
      <nav className="main-menu-bar">
        <div className="main-menu-logo-title">
          <img
            src="/image_1.png"
            alt="Instituto Criativo"
            className="main-menu-logo"
          />
          <span className="main-menu-title">Instituto Criativo</span>
        </div>
        {/* Botão hamburger para mobile */}
        <button
          className="main-menu-hamburger"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: 'auto',
            marginRight: 8,
            padding: 8,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect y="5" width="28" height="3" rx="1.5" fill="#fff"/>
            <rect y="12" width="28" height="3" rx="1.5" fill="#fff"/>
            <rect y="19" width="28" height="3" rx="1.5" fill="#fff"/>
          </svg>
        </button>
        <div
          className={`main-menu-links${menuOpen ? ' open' : ''}`}
          style={{
            ...(menuOpen
              ? {
                  position: 'absolute',
                  top: 56,
                  left: 0,
                  right: 0,
                  background: '#2c2c2c',
                  flexDirection: 'column',
                  zIndex: 100,
                  padding: '1rem 0',
                  gap: '0.5rem',
                  display: 'flex',
                }
              : {}),
          }}
        >
          <Link to="/home" className={isActive("/home") ? "active" : ""}>
            Home
          </Link>
          {/* Só mostra para quem NÃO é participante nem doador */}
          {usuario?.tipo !== "participante" && usuario?.tipo !== "doador" && (
            <>
              <Link
                to="/usuarios"
                className={isActive("/usuarios") ? "active" : ""}
              >
                Usuarios
              </Link>
              <Link to="/eventos" className={isActive("/eventos") ? "active" : ""}>
                Eventos
              </Link>
              <Link
                to="/projetos"
                className={isActive("/projetos") ? "active" : ""}
              >
                Projetos
              </Link>
            </>
          )}
          <Link to="/doacoes" className={isActive("/doacoes") ? "active" : ""}>
            Doação
          </Link>
          {/* Só mostra relatório para quem NÃO é participante nem doador */}
          {usuario?.tipo !== "participante" && usuario?.tipo !== "doador" && (
            <div
              className="menu-relatorio-dropdown"
              onMouseEnter={() => setRelatorioOpen(true)}
              onMouseLeave={() => setRelatorioOpen(false)}
              style={{ position: "relative" }}
            >
              <Link
                to="#"
                tabIndex={0}
                className={
                  isActive("/dashboard") || isActive("/relatorio-doacoes")
                    ? "active"
                    : ""
                }
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  userSelect: "none"
                }}
                onClick={e => e.preventDefault()}
                onFocus={() => setRelatorioOpen(true)}
                onBlur={() => setRelatorioOpen(false)}
              >
                Relatório ▾
              </Link>
              {relatorioOpen && (
                <div
                  className="menu-relatorio-dropdown-content"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "#fff",
                    minWidth: 180,
                    boxShadow: "0 2px 8px rgba(60,60,60,0.12)",
                    borderRadius: 8,
                    zIndex: 10,
                    padding: "0.5rem 0",
                    display: "block"
                  }}
                >

                  <Link
                    to="#"
                    className={isActive("/relatorio-doacoes") ? "active" : ""}
                    style={{
                      display: "block",
                      color: "#22223b",
                      padding: "0.5rem 1rem",
                      textDecoration: "none",
                    }}
                    onClick={e => {
                      e.preventDefault();
                      setRelatorioOpen(false);
                      exportarDoacoesExcel();
                    }}
                  >
                    Relatório de Doações
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="main-menu-user"
          style={{
            position: "relative",
            display: menuOpen ? "none" : undefined
          }}
        >
          <span>
            Olá <b>{usuario?.nome || ""}</b>
          </span>
          <span
            className="main-menu-user-icon"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            onClick={() => setUserMenuOpen(v => !v)}
            onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.15" />
              <circle cx="16" cy="13" r="5" fill="#fff" />
              <ellipse cx="16" cy="23" rx="7" ry="4" fill="#fff" />
            </svg>
            {userMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(60,60,60,0.12)",
                  zIndex: 20,
                  minWidth: 120,
                  padding: "0.5rem 0"
                }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "none",
                    color: "#f1416c",
                    border: "none",
                    padding: "0.7rem 1rem",
                    textAlign: "left",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: 6
                  }}
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            )}
          </span>
        </div>
      </nav>
    );
}