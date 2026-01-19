# Pricing Service (Node.js)

Microservicio de pricing y checkout desarrollado en Node.js con Express.
Simula un motor de precios típico de plataformas de retail o e-commerce de alto tráfico.

El servicio calcula precios finales considerando tipo de cliente, cupones de descuento, validación de stock y confirmación de órdenes.

---

## Descripción

Este microservicio representa un componente backend responsable del cálculo de precios y confirmación de compras.

Responsabilidades principales:
- Calcular precios finales
- Aplicar descuentos por categoría de cliente
- Aplicar cupones promocionales
- Validar disponibilidad de stock
- Confirmar órdenes de compra
- Exponer endpoints REST para consumo por otros servicios

El enfoque está en una arquitectura simple, clara y escalable, similar a la utilizada en entornos de microservicios reales.

---

## Arquitectura del proyecto

El proyecto está organizado por capas, separando responsabilidades:

- controllers  
  Manejan las solicitudes HTTP y las respuestas HTTP.

- routes  
  Definen las rutas de la API y conectan con los controllers.

- services  
  Contienen la lógica de negocio (pricing, descuentos, stock y órdenes).

- middlewares  
  Manejo centralizado de errores y trazabilidad de requests.

- data  
  Datos simulados (mock) para clientes, productos, cupones y órdenes.

---

## Estructura de carpetas

pricing-service/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── data/
├── index.js
├── package.json
├── package-lock.json
├── .env.example
└── .gitignore

---

## Variables de entorno

El proyecto utiliza variables de entorno para su configuración.
Estas variables no se versionan y se gestionan mediante un archivo `.env`.

Archivo `.env.example` de referencia:

PORT=3000  
SERVICE_NAME=pricing-service  

Para ejecutar el proyecto, se debe crear un archivo `.env` basado en este ejemplo y ajustar los valores según el entorno.

---

## Instalación y ejecución

Requisitos:
- Node.js 18 o superior
- npm

Instalación de dependencias:

npm install

Ejecución en modo desarrollo (con nodemon):

npm run dev

Ejecución en modo normal:

npm start

El servicio quedará disponible en el puerto configurado, por defecto:

http://localhost:3000

---

## Consideraciones técnicas

- La persistencia de datos está simulada en memoria (mock).
- No se utiliza una base de datos real.
- El proyecto está enfocado en la estructura backend, la lógica de negocio y las buenas prácticas de desarrollo.
- Está pensado como base para futuras extensiones, como integración con bases de datos, mensajería o despliegue en la nube.

---

## Autor

Proyecto desarrollado con fines educativos y de práctica profesional en desarrollo backend con Node.js.
