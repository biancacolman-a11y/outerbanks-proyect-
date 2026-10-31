// ===== 1. MODO OSCURO / CLARO =====
function modoOscuro() {
  document.body.classList.toggle("dark");
}

// ===== 2. BOTÓN "DESCUBRÍ MÁS" (cambia un texto) =====
function mostrarMensaje() {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "Los Pogues están listos para una nueva aventura...";
}

// ===== 3. MOSTRAR / OCULTAR INFORMACIÓN =====
function mostrarInfo() {
  const info = document.getElementById("infoExtra");
  if (info.style.display === "none" || info.style.display === "") {
    info.style.display = "block";
  } else {
    info.style.display = "none";
  }
}

// ===== 4. ASISTENTE DE IA (AYUDA O SUGERENCIA) =====
// Pegá tu API key de Google Gemini acá (NO la subas a un GitHub público)
const API_KEY = "AQ.Ab8RN6J0LB-GL1lgVO6GHqjdra_0xbi9KZxW8_fFSX0xiaganA";
const MODELO = "gemini-2.5-flash";

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMensajes = document.getElementById("chatMensajes");
const chatEnviar = document.getElementById("chatEnviar");

// Instrucciones para la IA: acá le explicamos de qué trata la página
const INSTRUCCIONES = `Sos el asistente virtual de una página web sobre la serie Outer Banks, hecha por estudiantes.
La página tiene estas secciones: Inicio (los Pogues y los Kooks), Tripulación (John B, JJ, Sarah Cameron y Kiara), Temporadas (1, 2 y 3) y Galería.
Respondé siempre en español, de forma breve, amable y clara.
Ayudá con dudas sobre la serie y con sugerencias sobre cómo usar o mejorar la página.
Evitá spoilers grandes salvo que el usuario los pida.`;

// Historial para que la IA recuerde la conversación
const historial = [];

function agregarMensaje(texto, clase) {
  const div = document.createElement("div");
  div.className = "msg " + clase;
  div.textContent = texto;
  chatMensajes.appendChild(div);
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
  return div;
}

async function enviarPregunta(evento) {
  evento.preventDefault();
  const pregunta = chatInput.value.trim();
  if (pregunta === "") return;

  agregarMensaje(pregunta, "usuario");
  chatInput.value = "";
  historial.push({ role: "user", parts: [{ text: pregunta }] });

  const espera = agregarMensaje("Escribiendo...", "ia");
  chatEnviar.disabled = true;

  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
      MODELO + ":generateContent?key=" + API_KEY;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: INSTRUCCIONES }] },
        contents: historial
      })
    });

    if (!respuesta.ok) throw new Error("Error " + respuesta.status);

    const datos = await respuesta.json();
    const texto = datos.candidates[0].content.parts[0].text;
    espera.textContent = texto;
    historial.push({ role: "model", parts: [{ text: texto }] });
  } catch (error) {
    espera.textContent = "Ups, no pude responder ahora. Revisá la API key o probá de nuevo.";
    historial.pop(); // sacamos la pregunta que falló
  }

  chatEnviar.disabled = false;
  chatInput.focus();
}

// ===== CONECTAR LOS BOTONES =====
document.getElementById("btnTema").addEventListener("click", modoOscuro);
document.getElementById("btnDescubri").addEventListener("click", mostrarMensaje);
document.getElementById("btnInfo").addEventListener("click", mostrarInfo);
chatForm.addEventListener("submit", enviarPregunta);
