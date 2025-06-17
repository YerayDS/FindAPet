# FindAPet - Plataforma web para adoptar animales de forma sencilla y accesible

FindAPet es una aplicación web diseñada para conectar personas interesadas en adoptar mascotas con animales que buscan un nuevo hogar. 
La plataforma permite a usuarios registrados publicar mascotas en adopción, aplicar filtros avanzados para buscar por tipo, edad, tamaño, 
sexo o ubicación, y completar el proceso de adopción. También incluye funcionalidades como registro con autenticación, 
formularios de contacto, historial de adopciones exitosas y un panel de chat para mejorar la comunicación entre adoptantes y responsables de las mascotas.

---

## Instrucciones de instalación y ejecución

### Clonar el repositorio de forma local
```bash
git clone https://github.com/YerayDS/FindAPet.git
```
Dirigete hacia la carpeta 'client' y ejecuta ```npm install``` para descargar las dependencias necesarias. Haz lo mismo dirigiendote a la carpeta 'server' e introduciendo en el terminal
```npm install```. Una vez instaladas las dependecias, dirigiendote hacia la carpeta 'server' ejecuta ```npm run dev``` para ejecutar el servidor node
y, en otro terminal, yendo hacia la carpeta 'client' ejecuta ```npm run dev``` para poder ejecutar el frontend. Por último, te diriges a tu navegador y colocas en la barra de búsqueda 
```http://localhost:5173/``` para poder entrar a la aplicación.

### Despliegue con Vercel y Render
Además, tanto el cliente como el servidor están desplegados en Vercel(Frontend) y en Render(Backend. El enlace para acceder al cliente es ```https://find-a-pet-git-main-yeraydshs-projects.vercel.app/```
y para acceder al servidor ```https://render.com/docs/web-services#port-binding```.

## FUNCIONAMIENTO DE LA PÁGINA

### Sección de autentificación
<p align="center">
<img width="556" alt="image" src="https://github.com/user-attachments/assets/18508657-a494-4cfc-add0-639afb8918fc" />
<img width="556" alt="image" src="https://github.com/user-attachments/assets/4fd2c6b4-421e-4c16-a5d2-8bf64311d854" />
</p>

La aplicación incluye una página de autenticación con dos secciones:

- **Login:** Para iniciar sesión con correo y contraseña.
- **Registro:** Permite crear una cuenta indicando correo, nombre, contraseña y rol (`adopt` o `give_to_adoption`).

#### Tecnologías usadas

- **JWT:** Genera tokens para identificar al usuario y su rol.
- **bcrypt:** Encripta las contraseñas antes de guardarlas.

#### Rutas protegidas

- Las rutas del backend para modificar datos están protegidas con JWT.
- Solo los administradores autenticados pueden hacer cambios.
- Todos los datos se guardan en MongoDB.

### Sección de Home
<img width="1384" alt="image" src="https://github.com/user-attachments/assets/d61fe7ae-a74d-41ee-857c-ae5868e95e87" />

<img width="1384" alt="image" src="https://github.com/user-attachments/assets/dc6ad516-af31-4d33-b83a-ffdba7d86df1" />

<img width="1384" alt="image" src="https://github.com/user-attachments/assets/f8b6be17-7430-4e4c-8ba3-f7b2027a8592" />

<img width="1384" alt="image" src="https://github.com/user-attachments/assets/58c2f3ba-cd61-49ce-a6b9-b97f8bcc36bb" />


La página de inicio de **FindAPet** es el primer contacto del usuario con la plataforma. Está pensada para crear una conexión con quienes buscan 
adoptar y para destacar el propósito del sitio: facilitar la adopción de animales necesitados.

#### ¿Qué incluye?

- Una mascota destacada aleatoria, con su foto, nombre, edad, tamaño y género.
- Un apartado explicando por qué adoptar es una decisión importante y beneficiosa.
- Una sección dedicada a los rescatistas que colaboran con la plataforma.
- Datos sobre el abandono de animales, para generar conciencia.

### Sección de Pet List
<p align="center">
<img width="1378" alt="image" src="https://github.com/user-attachments/assets/613a6df4-ea6c-437a-9bba-04bce24a63d4" />
<img width="1378" alt="image" src="https://github.com/user-attachments/assets/61851bde-dced-452a-9c80-06c8fa01997a" />
<img width="1378" alt="image" src="https://github.com/user-attachments/assets/851273ee-36dd-4a96-9ae1-611d8ad3b9d8" />
<img width="678" alt="image" src="https://github.com/user-attachments/assets/32a0d513-4c6b-4fe5-8626-b0aa1beed348" />
</p>

La página **PetList** es el núcleo de la aplicación, donde los usuarios pueden **explorar, filtrar y registrar mascotas** disponibles para adopción.

#### Funcionalidades principales

- Listado de mascotas (foto, nombre, edad, género, tamaño).
- Filtros por:
  - Tipo de animal (perro, gato, etc.)
  - Edad
  - Tamaño
  - Género
  - Provincia
- Los usuarios que tienen el rol **`give_for_adoption`** pueden registrar nuevas mascotas a través de un formulario.
- Integración con chat para usuarios autenticados.
- Contador de adopciones exitosas.
- Diseño responsive para escritorio y dispositivos móviles.

#### Tecnologías utilizadas

- **React** para la construcción de la UI.
- **React Router** para navegación entre páginas.
- **Context API** para gestión de autenticación y estado global.
- **Axios** para llamadas HTTP.
- **CSS personalizado** para estilos.
- **React Icons** para íconos del menú y género.

#### Comunicación con Backend

Esta página se conecta al backend para recuperar y registrar información de mascotas:

- `GET /api/pets` → Obtener la lista completa de mascotas.
- `POST /api/pets` → Registrar una nueva mascota (requiere token JWT y rol `give_for_adoption`).

### Sección de detalles de la Pet
<img width="1381" alt="image" src="https://github.com/user-attachments/assets/b497801d-480a-4afb-900c-f9b74bcbba7e" />
<img width="1381" alt="image" src="https://github.com/user-attachments/assets/09742fe3-4ec2-44f4-906d-3b0c9b1c4e2d" />

La página **PetDetail** muestra la información detallada de una mascota específica y permite realizar acciones según el rol del usuario.

#### Funcionalidades principales

- Visualización de la foto y detalles completos de la mascota:
  - Información general (edad, tamaño, género, raza, provincia)
  - Estado de salud (vacunado, microchip, desparasitado, saludable)
  - Descripción "About Me"
- Edición de datos para usuarios con rol **`give_for_adoption`** y que sean dueños de la mascota.
- Eliminación de la mascota para el dueño con rol **`give_for_adoption`**.
- Adopción de la mascota (elimina la mascota y aumenta el contador de adopciones exitosas).
- Chat integrado para usuarios con rol **`adopt`** que no sean dueños de la mascota.
- Navegación intuitiva con botones para volver a la lista de mascotas.
- Manejo de estados de carga, errores y edición en línea.

#### Control de permisos y roles

- Solo los usuarios con rol **`give_for_adoption`** y que sean propietarios pueden editar o eliminar la mascota.
- Usuarios con rol **`adopt`** pueden iniciar chat con el dueño de la mascota y adoptar (eliminar la mascota).
- Usuarios no autenticados solo pueden ver la información.

#### Comunicación con Backend

- `GET /api/pets/:id` → Obtener detalles completos de una mascota.
- `PUT /api/pets/:id` → Actualizar datos de la mascota (requiere token y rol).
- `DELETE /api/pets/:id` → Eliminar mascota (para adopción o borrado, requiere token y rol).
- `POST /api/chats/get-or-create` → Crear o recuperar chat con dueño de la mascota.

### Sección de Chat
<p align="center">
<img width="436" alt="image" src="https://github.com/user-attachments/assets/654eafa6-9af6-4f11-8624-218d4761505c" />
<img width="436" alt="image" src="https://github.com/user-attachments/assets/757b9215-0a56-4306-8bd2-8dcaebde23d6" />
</p>

`ChatPanel` es un componente que permite a los usuarios ver su lista de chats, seleccionar una conversación y enviar/recibir mensajes en tiempo real usando WebSockets. 
Está integrado con un contexto de autenticación para manejar tokens y usuarios.


#### Características

- Obtiene la lista de chats del usuario autenticado mediante API REST.
- Permite seleccionar un chat para visualizar y enviar mensajes.
- Se conecta a un WebSocket para recibir mensajes en tiempo real.
- Envía mensajes al servidor mediante WebSocket.
- Crea un nuevo chat automáticamente si se accede desde un detalle de mascota (`isInPetDetail`) y no existe chat con el usuario objetivo (`targetUserId`).
- Utiliza CSS Modules para estilos encapsulados.
- Maneja apertura y cierre del panel de chat.


#### Props

| Prop           | Tipo    | Descripción                                                  |
|----------------|---------|--------------------------------------------------------------|
| `isInPetDetail`| Boolean | Indica si el chat se abre desde la vista detalle de mascota.|
| `targetUserId` | String  | ID del usuario con quien iniciar o continuar la conversación.|

### Sección de About

<img width="1284" alt="image" src="https://github.com/user-attachments/assets/f56e2107-95ca-456a-8b88-ef69a7114ade" />
<img width="1284" alt="image" src="https://github.com/user-attachments/assets/40138c9b-7557-41fa-ad2f-599bc1ba3b86" />
<img width="1284" alt="image" src="https://github.com/user-attachments/assets/e55a0f77-a3e0-4e71-8dc9-ec2da806188b" />
<img width="1284" alt="image" src="https://github.com/user-attachments/assets/374738dd-4870-4696-ba0d-6ecc3164953a" />

El componente `About` es una página que contiene:

- Barra de navegación responsive con menú desplegable y control de sesión.
- Sección "About" con texto e imagen.
- Formulario de contacto funcional que envía mensajes vía EmailJS.
- Sección FAQ con preguntas frecuentes y sistema acordeón para expandir respuestas.
- Integración del componente de chat (`ChatPanel`) si el usuario está logueado.
- Footer con información adicional.


#### Características

- **Navegación** con menú móvil usando `react-icons` para iconos de menú y cerrar.
- **Autenticación**: muestra diferentes opciones según si el usuario está logueado.
- **Formulario de contacto** con validación básica, envío por EmailJS y mensajes de éxito/error.
- **Animaciones de aparición** usando `IntersectionObserver` para secciones "About", contacto y FAQ.
- **FAQ** dinámico con toggle para expandir/cerrar respuestas.
- Responsive y estilizado con CSS propio (`About.css`).


#### Dependencias

- React 18+
- `react-router-dom` para enlaces y ubicación actual.
- `emailjs-com` para envío de emails.
- `react-icons` para iconos de menú.
- Contexto de autenticación (`AuthContext`) que provea usuario y logout.
- Componentes internos: `ChatPanel`, `Footer`.
- Archivo CSS: `About.css`.
