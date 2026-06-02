import React, { useState } from "react";

import {
  Offcanvas,
  Button,
  Form,
  Spinner
} from "react-bootstrap";

import OpenAI from "openai";

import { supabase } from "../../database/supabaseconfig";

const ChatIA = () => {

  const [mostrar, setMostrar] =
    useState(false);

  const [pregunta, setPregunta] =
    useState("");

  const [respuesta, setRespuesta] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // OPENROUTER
  const openai = new OpenAI({

    baseURL:
      "https://openrouter.ai/api/v1",

    apiKey:
      import.meta.env
        .VITE_OPENROUTER_API_KEY,

    dangerouslyAllowBrowser: true,

    defaultHeaders: {

      "HTTP-Referer":
        "http://localhost:5173",

      "X-Title":
        "Ferreteria IA"

    }

  });

  // TOGGLE
  const toggleChat = () => {
    setMostrar(!mostrar);
  };

  // ENVIAR
  const enviarConsulta = async () => {

    try {

      if (!pregunta.trim()) return;

      setLoading(true);

      setRespuesta("");

      // IA
      const completion =
        await openai.chat.completions.create({

          model:
            "openai/gpt-3.5-turbo",

          messages: [

            {
              role: "system",

              content: `
Eres un asistente SQL PostgreSQL.

Tablas:

- empleados
- productos
- categorias
- clientes
- pedidos
- detalle_pedido

REGLAS:
- SOLO SQL
- SOLO SELECT
- NO markdown
- NO ;
`
            },

            {
              role: "user",
              content: pregunta
            }

          ]

        });

      // SQL
      let consultaSQL =
        completion
          .choices[0]
          .message
          .content
          .replace(/```sql/g, "")
          .replace(/```/g, "")
          .replace(/;/g, "")
          .replace(/\n/g, " ")
          .trim();

      console.log(
        "SQL IA:",
        consultaSQL
      );

      // VALIDAR
      if (!consultaSQL) {

        setRespuesta(
          "La IA no generó SQL"
        );

        return;
      }

      // SOLO SELECT
      if (
        !consultaSQL
          .toLowerCase()
          .startsWith("select")
      ) {

        setRespuesta(
          "Solo SELECT"
        );

        return;
      }

      // RPC
      const {
        data,
        error
      } = await supabase.rpc(
        "ejecutar_consulta_segura",
        {
          consulta_sql:
            consultaSQL
        }
      );

      // ERROR SQL
      if (error) {

        console.log(error);

        setRespuesta(
          error.message
        );

        return;
      }

      // RESPUESTA
      setRespuesta(
        JSON.stringify(
          data,
          null,
          2
        )
      );

    } catch (error) {

      console.log(error);

      setRespuesta(
        JSON.stringify(
          error,
          null,
          2
        )
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <>

      <Button
        variant="dark"
        className="rounded-circle shadow"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 9999
        }}
        onClick={toggleChat}
      >

        🤖

      </Button>

      <Offcanvas
        show={mostrar}
        onHide={toggleChat}
        placement="end"
      >

        <Offcanvas.Header closeButton>

          <Offcanvas.Title>
            IA Ferretería
          </Offcanvas.Title>

        </Offcanvas.Header>

        <Offcanvas.Body>

          <Form.Group className="mb-3">

            <Form.Label>
              Consulta
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={pregunta}
              onChange={(e) =>
                setPregunta(
                  e.target.value
                )
              }
            />

          </Form.Group>

          <Button
            className="w-100 mb-3"
            onClick={enviarConsulta}
            disabled={loading}
          >

            {loading ? (

              <Spinner
                animation="border"
                size="sm"
              />

            ) : (

              "Consultar"

            )}

          </Button>

          <div
            style={{
              whiteSpace:
                "pre-wrap",
              background:
                "#f5f5f5",
              padding:
                "10px",
              borderRadius:
                "10px",
              minHeight:
                "150px",
              overflow:
                "auto"
            }}
          >

            {respuesta ||
              "La respuesta aparecerá aquí"}

          </div>

        </Offcanvas.Body>

      </Offcanvas>

    </>
  );
};

export default ChatIA;