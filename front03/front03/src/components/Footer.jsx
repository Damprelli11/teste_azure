export function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        textAlign: "center",
        padding: "18px 0 10px 0",
        color: "#6b7280",
        fontSize: 15,
        background: "transparent",
      }}
    >
      © {new Date().getFullYear()} Instituto Criativo. Desenvolvido por
      <span className="fourware-highlight" style={{ marginLeft: 4 }}>
        FourWare.
      </span>
    </footer>
  );
}
