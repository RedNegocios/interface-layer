import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

/**
 *  ChatOrden admite 3 props:
 *    - ordenId            (obligatorio)  → ID de la orden
 *    - emisorUsuarioId    (opcional)     → si lo llama un usuario
 *    - emisorNegocioId    (opcional)     → si lo llama un negocio
 */
const ChatOrden = ({
  ordenId,
  emisorUsuarioId = null,
  emisorNegocioId = null,
}) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);

  const token = localStorage.getItem("authToken");

  const fetchMensajes = async () => {
    if (!ordenId || !token) {
      console.warn("ChatOrden: ordenId o token no disponible");
      return;
    }
    
    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/mensajes/orden/${ordenId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setMensajes(data);
      } else {
        console.error("Error al cargar mensajes:", res.status);
      }
    } catch (error) {
      console.error("Error de red al cargar mensajes:", error);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    if (!ordenId || !token) {
      console.warn("ChatOrden: ordenId o token no disponible para enviar mensaje");
      return;
    }

    const payload = {
      contenido: nuevoMensaje,
      emisorUsuarioId: emisorUsuarioId ?? null,
      emisorNegocioId: emisorNegocioId ?? null,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/mensajes/orden/${ordenId}/enviar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setNuevoMensaje("");
      } else {
        console.error("Error al enviar mensaje:", res.status);
      }
    } catch (error) {
      console.error("Error de red al enviar mensaje:", error);
    }
  };

  useEffect(() => {
    fetchMensajes();

    const socket = new SockJS(
      `http://localhost:8080/negocios/ws?token=${token}`
    );
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/orden/${ordenId}`, (message) => {
          const nuevoMensaje = JSON.parse(message.body);
          setMensajes((prev) => [...prev, nuevoMensaje]);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [ordenId, token]);

  useEffect(() => {
    if (chatBoxRef.current)
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [mensajes]);

  return (
    <div className="chat-container">
      <h4>Mensajes</h4>
      <div className="chat-box" ref={chatBoxRef}>
        {mensajes.map((m) => {
          const clase =
            m.emisorNombre === "Admin"
              ? "negocio"
              : m.emisorNombre
              ? "usuario"
              : "sistema";

          return (
            <div key={m.mensajeOrdenId || Math.random()} className={`mensaje ${clase}`}>
              <div className="mensaje-emisor">
                <strong>{m.emisorNombre || "Sistema"}</strong>
              </div>
              <div className="mensaje-contenido">{m.contenido}</div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <textarea
          rows={2}
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje…"
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatOrden;
