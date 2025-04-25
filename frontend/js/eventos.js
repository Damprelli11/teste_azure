document.addEventListener("DOMContentLoaded", async () => {
  const eventosList = document.getElementById("eventosList");
  const logoutButton = document.getElementById("logout");
  const userNameElement = document.getElementById("userName");

  // Display the user's name
  const userName = localStorage.getItem("userName");
  if (userName && userNameElement) {
    userNameElement.textContent = `Olá ${userName}`;
  }

  // Evento de logout
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token"); // Remove o token do localStorage
      localStorage.removeItem("userName"); // Remove o nome do usuário, se armazenado
      window.location.href = "login.html"; // Redireciona para a página de login
    });
  }

  try {
    // Faz uma chamada à API para buscar os eventos
    const response = await fetch("http://localhost:3000/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Envia o token JWT, se necessário
      },
    });

    if (response.ok) {
      const eventos = await response.json();

      // Renderizar eventos
      eventos.forEach((evento) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4"); // Responsividade: 3 colunas por linha em telas médias
        col.innerHTML = `
          <div class="evento-card">
            <img src="../../backend/uploads/${
              evento.imagem
            }" alt="Imagem do Evento" class="img-fluid">
            <h3>${evento.titulo}</h3>
            <p>${evento.descricao}</p>
            <p class="data">${new Date(evento.data).toLocaleDateString()}</p>
            <button class="btn btn-primary">Inscrever-se</button>
          </div>
        `;
        eventosList.appendChild(col);
      });
    } else {
      console.error("Erro ao buscar eventos.");
      eventosList.innerHTML = `<p class="text-danger">Erro ao carregar eventos.</p>`;
    }
  } catch (error) {
    console.error("Erro ao conectar à API:", error);
    eventosList.innerHTML = `<p class="text-danger">Erro ao conectar ao servidor.</p>`;
  }
});
