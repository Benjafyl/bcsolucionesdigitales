# BC Soluciones Digitales

Landing page liviana para `bcsolucionesdigitales.com`, creada con Vite, JavaScript vanilla, HTML y CSS propio. No incluye backend; el formulario queda preparado para integrarse mas adelante con Web3Forms, Formspree o un endpoint propio.

## Requisitos

- Node.js 20 o superior
- npm
- Docker, si se quiere construir y correr el contenedor

## Correr localmente

```bash
npm install
npm run dev
```

Vite mostrara la URL local en la terminal, normalmente `http://localhost:5173`.

## Construir para produccion

```bash
npm run build
```

El sitio compilado queda en la carpeta `dist/`.

## Correr con Docker

Construir la imagen:

```bash
docker build -t bc-soluciones-digitales .
```

Correr el contenedor:

```bash
docker run --rm -p 8080:80 bc-soluciones-digitales
```

Luego abrir `http://localhost:8080`.

## Despliegue en Dockploy

1. Sube este repositorio a GitHub.
2. Crea una nueva aplicacion en Dockploy desde el repositorio.
3. Usa el `Dockerfile` incluido.
4. Configura el puerto interno del contenedor como `80`.
5. Apunta el dominio `bcsolucionesdigitales.com` a tu servidor y asignalo a la aplicacion en Dockploy.

El contenedor final sirve el build estatico con Nginx Alpine en el puerto `80`.

## Placeholders editables

Antes de publicar, reemplaza estos datos en `index.html`:

- Telefono: `+56 9 0000 0000`
- WhatsApp: `https://wa.me/56900000000`
- Correo: `contacto@bcsolucionesdigitales.com`
- Instagram: `https://instagram.com/bcsolucionesdigitales`
- Facebook y LinkedIn: links placeholder actuales

## Documentacion del proyecto

- [AGENTS.md](AGENTS.md)
- [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/AI_AGENT_PLAN.md](docs/AI_AGENT_PLAN.md)
- [docs/SUPABASE_PLAN.md](docs/SUPABASE_PLAN.md)
- [docs/WHATSAPP_META_PLAN.md](docs/WHATSAPP_META_PLAN.md)
- [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md)
