import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API AgroControl",
      version: "1.0.0",
      description: "Documentación de la API del sistema AgroControl (Usuarios, Lotes, Tareas, Incidencias, Dashboard, Mensajes)",
    },
    servers: [
      {
        url: "http://localhost:5100",
        description: "Servidor local de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // <-- Swagger buscará los comentarios en todos tus routers
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
