💖 Menú Capibobba - Optimizado para WhatsApp 🧋
Este proyecto es un menú digital interactivo para "Capibobba", una tienda de bebidas estilo Bubble Tea, diseñado para ser visualmente atractivo y funcional, especialmente optimizado para su uso y pedidos a través de WhatsApp.

✨ Características Principales
Diseño Kawaii y Atractivo: Un diseño vibrante y tierno con animaciones sutiles y elementos decorativos que reflejan la marca "Capibobba".

Modo Claro/Oscuro Automático: Se adapta automáticamente al tema de color preferido del sistema del usuario (claro u oscuro) para una experiencia visual cómoda.

Menú Interactivo:

Frappés Base Agua: Sección dedicada a bebidas refrescantes y frutales.

Frappés Base Leche: Sección para bebidas cremosas y reconfortantes.

Bebidas Calientes: Una sección específica para opciones cálidas.

Nueva Especialidad: Chamoyada: Una opción picosita y refrescante, donde puedes elegir un sabor base de la sección de frappés base agua y añadir toppings.

Imágenes de Sabores: Al hacer clic en cada sabor o promoción, se muestra una imagen representativa de la bebida en una ventana emergente.

Sección de Promociones y Novedades: Destaca ofertas especiales y nuevos productos, como el "Frappé Fresas con Crema" de temporada y la "Chamoyada".

Toppings Personalizables: Los usuarios pueden seleccionar toppings adicionales para cualquier bebida (frappés, bebidas calientes y chamoyadas) a través de un modal interactivo, que se añade al precio final de la bebida. Los botones de confirmación y cancelación en los modales de personalización tienen un diseño visualmente atractivo.

Carrito de Compras Integrado: Un carrito dinámico que permite a los usuarios añadir, ver y eliminar bebidas, mostrando el total acumulado. El carrito sigue el scroll para fácil acceso.

Pedido Directo por WhatsApp: Genera automáticamente un mensaje de WhatsApp pre-llenado con el detalle del pedido del carrito, listo para ser enviado al número de contacto de Capibobba.

Optimización Móvil: Diseño completamente responsivo que garantiza una excelente visualización y usabilidad en dispositivos móviles.

🚀 Cómo Usar
Explorar el Menú: Navega por las diferentes secciones de frappés (base agua y leche), bebidas calientes y promociones.

Ver Imágenes: Haz clic en cualquier sabor o promoción para ver una imagen de la bebida.

Añadir al Carrito: Haz clic en el botón "Añadir 💖" junto a la bebida deseada.

Personalizar Bebidas (Opcional):

Si añades un frappé o bebida caliente, se abrirá un modal donde podrás elegir los toppings. Puedes añadir varios, confirmar tu selección, elegir "Sin Toppings" o cancelar.

Si añades una Chamoyada, se abrirá un modal especial para que primero elijas su sabor base (de las opciones base agua) y luego añadas los toppings deseados.

Gestionar el Carrito: En la sección "Tu Carrito Kawaii", puedes ver los ítems añadidos, su cantidad y precio total. Utiliza el botón "➖" para eliminar un solo ítem del carrito o "Vaciar Carrito 🗑️" para eliminar todos los ítems.

Realizar Pedido por WhatsApp: Una vez que tu carrito esté listo, haz clic en "Pedir por WhatsApp 📱". Esto abrirá WhatsApp (o WhatsApp Web) con un mensaje pre-llenado con los detalles de tu pedido, listo para enviar.

🛠️ Estructura del Proyecto
El proyecto está compuesto por los siguientes archivos:

index.html: La estructura principal del menú, incluyendo las secciones de productos, promociones, carrito y modales. Contiene los atributos data-name y data-price para los productos estáticos.

styles.css: Estilos personalizados para el diseño, animaciones y responsividad. Se utiliza @import para la fuente 'Nunito' de Google Fonts.

script.js: La lógica para la interactividad del menú, la gestión del carrito, la selección de toppings, la personalización de la Chamoyada y la integración con WhatsApp.

🎨 Personalización
Datos de Productos (incluyendo imágenes y precios): Las URLs de las imágenes, los nombres, descripciones y precios de todos los productos (frappés, bebidas calientes, chamoyada) están definidas en el array productsData dentro del archivo script.js.

Toppings: La lista de availableToppings en el script.js puede ser modificada para añadir o quitar opciones de toppings y sus precios.

Número de WhatsApp: El número de contacto de WhatsApp está hardcodeado en la variable whatsappNumber en el script.js. Asegúrate de cambiarlo por tu número real.

Textos y Precios: Todos los textos y precios son fácilmente editables directamente en el HTML o en el array productsData de script.js según corresponda.

Logos: Se incluyen dos imágenes de logo (logoLight y logoDark) para adaptarse al modo claro/oscuro. Asegúrate de que las URLs de estas imágenes sean válidas en el index.html.

📝 Notas Adicionales
El menú está diseñado para una experiencia fluida en dispositivos móviles, lo que lo hace ideal para compartir directamente a través de plataformas como WhatsApp.

Se incluye manejo de errores básico para la carga de imágenes, mostrando un placeholder si una imagen no se carga correctamente.

Se ha implementado una medida para detectar si el navegador bloquea la apertura de la ventana de WhatsApp, proporcionando retroalimentación al usuario.

¡Esperamos que disfrutes usando el Menú Capibobba tanto como nosotros disfrutamos creándolo! 💖
