# FeedbackFlow

Una plataforma de retroalimentación y evaluación para empleados dentro de una empresa que usa inteligencia artificial para reducir sesgos, sugerir planes de mejora y ayudar al empleado a resolver dudas diarias.

[📌 Diseño de Figma](https://www.figma.com/file/klnYbVO4bRceWdcZrKkmZq/MockUp?type=design&node-id=0%3A1&mode=design&t=ZbcneFEULlyu53gy-1)

![Mockup](mockup.png)

# 📚 Usage

To spawn the postgres container and get into it

```bash
docker pull postgres
docker run --name feedbackflow-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
docker exec -it feedbackflow-postgres psql -U postgres
```

Create the database before running

```sql
CREATE DATABASE feedbackflow_db;
\l
```

Push the schema directly to the database

```bash
npx drizzle-kit push:pg
```

Show the created tables

```
\c feedbackflow_db
\dt
```

To enable webhooks and make login work you have to use a proxy.

Log into [ngrok](https://ngrok.com/docs/) with the team google account.

Setup it in your [local machine](https://dashboard.ngrok.com/get-started/setup/macos)

Once you got it, run it to proxy calls in port 3000

```bash
ngrok http http://localhost:3000
```

You should get an url like `Forwarding https://<random uuid>.ngrok-free.app -> http://localhost:3000`

Go to clerk dashboard (with the team google account) and click on `webhooks`

Click on `Add endpoint` and paste the url you've got by appending `/api/webhooks`: `https://<random uuid>.ngrok-free.app/api/webhooks`

On description put your name, ex `Pedro-Testing`

Discover your `Signing Secret` on the dashboard and paste it into your `WEBHOOK_SECRET=<YOUR KEY>` in the `.env.local` file

Make sure you have the right `.env.local` file in your project

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR KEY>
CLERK_SECRET_KEY=<YOUR KEY>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
WEBHOOK_SECRET=<YOUR KEY>
```

To run the app

```bash
npm run dev
```

## Problema

Muchas empresas no cuentan con un sistema para dar retroalimentación entre los empleados, o si lo tienen, está de una manera muy sesgada, esto hace que muchas veces no se reconozca el esfuerzo de ciertos empleados que van muy bien, y no se le de un plan de mejora a aquellos que no van tan bien.

## Solución

Crear una plataforma que pueda brindar feedback y planes de mejora para el usuario, en el que el usuario pueda ver el progreso de este.

## Impacto

Autonocimiento y mejora de las habilidades del empleado, incremento en la productividad del mismo, más justicia dentro de la empresa, disminución de sesgos.

## Usuarios Principales

- Empleados supervisados (SWE)
- Managers
- Chief Officers

## Ideas de funcionalidades

- Dashboard del empleado
  - Propio y de los compañeros
  - Del project manager a su equipo
  - Del CEO a todas las areas que maneja
  - Análisis de métricas con inteligencia artificial generativa
- Análisis de mensajes en Slack
  - Lectura de los mensajes de un canal específico para cuidar que se mantengan las normas de rendimiento y respeto
- Presentación de issues/tasks de Github Projects y código de GitHub
  - Análisis de código y entrega según los guidelines
- Encuestas atómicas de rendimiento y coevaluación
- Asistente virtual de proyectos
- Alerta de rendimiento bajo
  - Detectar con anticipación a los colaboradores con resultados inferiores a los esperados
  - Dar soluciones como asistencia psicológica, workshops o mentoreo a personas en una crisis
- Plan de mejora personalizado generado con IA a partir de reviews
- Corrección de feedback eliminando sesgos e incrementando motivación
