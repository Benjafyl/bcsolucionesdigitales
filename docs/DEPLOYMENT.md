# Deploy - BC Soluciones Digitales

## Dominio

Dominio principal:

https://bcsolucionesdigitales.com

Dominio con www:

https://www.bcsolucionesdigitales.com

El dominio fue comprado en Hostinger y conectado a Cloudflare mediante nameservers.

## Cloudflare

Cloudflare administra DNS y entrada publica.

Los registros del dominio apuntan al Cloudflare Tunnel.

No usar registros A hacia IP publica.

## Cloudflare Tunnel

El tunel se llama:

`servidor-byc`

El tunel apunta a:

`http://localhost:80`

Esto funciona porque Traefik, manejado por Dockploy, escucha en el puerto 80.

## Dockploy

Dockploy esta instalado y funcionando en el servidor.

Dockploy usa Traefik como reverse proxy.

La app actual esta conectada al repositorio de GitHub.

El deploy se ejecuta al hacer push a `main`.

## Flujo normal de trabajo

1. Editar codigo.
2. Probar localmente.
3. Hacer build si corresponde.
4. Hacer commit.
5. Hacer push a `main`.
6. Dockploy detecta el push.
7. Dockploy reconstruye el contenedor.
8. La web se actualiza publicamente.

Comandos tipicos:

```bash
git add .
git commit -m "actualizo landing"
git push
```

## Reglas importantes

- No usar Nginx del sistema para esta web.
- No apagar Traefik.
- No cambiar puertos de Traefik sin revisar Dockploy.
- No borrar el tunel `servidor-byc`.
- No mover DNS fuera de Cloudflare.
- No subir `.env` reales al repositorio.
- No exponer claves privadas en frontend.

## Variables futuras de deploy

Cuando se agregue backend, se deberan configurar variables en Dockploy o el entorno correspondiente.

Ver:

`docs/ENVIRONMENT_VARIABLES.md`
