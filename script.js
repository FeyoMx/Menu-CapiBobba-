// script.js
console.log("Script file loaded and executing.");

// Declaración de currentObserver en el ámbito global
// Esto ayuda a diagnosticar problemas de ámbito o de inicialización específicos del entorno.
let currentObserver = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded. Starting script execution.");

    // Helper function to generate unique IDs
    function generateUniqueId() {
        return 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Throttle function to limit the execution frequency of a function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // --- PRODUCT DATA DEFINITION ---
    // Define all your products here. To add a new product, just add a new object to this array.
    const productsData = [
        // Frappés base agua
        {
            type: "water-based-frappe",
            name: "Frappé Litchi (Agua)",
            displayName: "Litchi",
            price: 75,
            description: "Dulce y exótico como un abrazo frutal de nube ☁️💕 (¡pruébalo si no lo conoces!)",
            imageUrl: "https://i.imgur.com/Pu7yFxo.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Fresa (Agua)",
            displayName: "Fresa",
            price: 75,
            description: "El clásico más tierno 🍓💖 ¡como una caricia de fresita!",
            imageUrl: "https://i.imgur.com/UMxtB2o.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Blueberry (Agua)",
            displayName: "Blueberry",
            price: 75,
            description: "Dulzura encantadora con un toque de magia azul 💙🫐",
            imageUrl: "https://i.imgur.com/XMfisGw.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Mango (Agua)",
            displayName: "Mango",
            price: 75,
            description: "Tropical y juguetón 🥭☀️ ¡Pura alegría líquida!",
            imageUrl: "https://i.imgur.com/VGEGSkT.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Piña Colada (Agua)",
            displayName: "Piña colada",
            price: 75,
            description: "Vacaciones kawaii en cada sorbo 🍍🥥 ¡fresca y coqueta!",
            imageUrl: "https://i.imgur.com/U6LUnZt.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Maracuyá (Agua)",
            displayName: "Maracuyá",
            price: 75,
            description: "Ácida y divertida, perfecta para los más atrevidos 💛✨",
            imageUrl: "https://i.imgur.com/hrULvVp.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Guanábana (Agua)",
            displayName: "Guanábana",
            price: 75,
            description: "Exótica y refrescante, con un dulzor suave y cremoso 💚✨",
            imageUrl: "https://i.imgur.com/xwZdwXY.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Sandía (Agua)",
            displayName: "Sandía",
            price: 75,
            description: "Refrescante y dulce, el sabor del verano en cada sorbo 🍉☀️",
            imageUrl: "https://i.imgur.com/FwsLeZz.jpeg"
        },
        {
            type: "water-based-frappe",
            name: "Frappé Tamarindo (Agua)",
            displayName: "Tamarindo",
            price: 75,
            description: "El toque agridulce y divertido que te hará bailar de alegría 🤎✨",
            imageUrl: "https://placehold.co/300x300/8B4513/FFFFFF?text=Tamarindo"
        },
        // Frappés base leche
        {
            type: "milk-based-frappe",
            name: "Frappé Chocolate Mexicano (Leche)",
            displayName: "Chocolate Mexicano",
            price: 75,
            description: "El toque tradicional de cacao con canela y un secreto de la abuela 🍫🌶️✨",
            imageUrl: "https://placehold.co/300x300/8B4513/FFFFFF?text=Choco+Mexicano"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Taro (Leche)",
            displayName: "Taro",
            price: 75,
            description: "Cremoso y delicado  🌰💜 (¡tu nuevo favorito si no lo conoces!)",
            imageUrl: "https://i.imgur.com/epvVrkT.jpeg"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Mazapán (Leche)",
            displayName: "Mazapán",
            price: 75,
            description: "Sabor a infancia mexicana 🎠💕 ¡un apapacho de cacahuate!",
            imageUrl: "https://i.imgur.com/jrELu9J.jpeg"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Chai (Leche)",
            displayName: "Chai",
            price: 75,
            description: "Especiado y cálido ☕✨ ¡ideal para días nublados!",
            imageUrl: "https://i.imgur.com/wRIJ7AO.jpeg"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Mocha (Leche)",
            displayName: "Mocha",
            price: 75,
            description: "Café y chocolate en perfecta armonía 🍫☕💞",
            imageUrl: "https://i.imgur.com/Pdp3Q4O.jpeg"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Cookies & Cream (Leche)",
            displayName: "Cookies & Cream",
            price: 75,
            description: "Como beber una galleta con leche 🍪🥛 ¡ñam!",
            imageUrl: "https://i.imgur.com/0e402nf.jpeg"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Crema Irlandesa (Leche)",
            displayName: "Crema Irlandesa",
            price: 75,
            description: "Cremosa y misteriosa 🍮✨ (sin alcohol)",
            imageUrl: "https://i.imgur.com/fJocyJw.jpeg"
        },
        {
            type: "milk-based-frappe",
            name: "Frappé Matcha (Leche)",
            displayName: "Matcha",
            price: 75,
            description: "Té verde japonés con energía kawaii 💚🌿 ¡pura paz zen!",
            imageUrl: "https://i.imgur.com/6QIRLrZ.jpeg"
        },
        // --- NUEVO: Producto de Temporada "Fresas con Crema" ---
        {
            type: "milk-based-frappe", // O un tipo "promotion" si se gestionan de forma diferente
            name: "Frappé Fresas con Crema (Temporada)",
            displayName: "Fresas con Crema",
            price: 75,
            description: "¡El clásico favorito de la abuela, pero en versión kawaii! Dulzura de fresa natural y cremosidad suave. 🍓🥛💖✨",
            imageUrl: "https://i.imgur.com/m2Fc29F.jpeg" // Reemplaza con la URL real de tu imagen
        },
        // --- NUEVA ESPECIALIDAD: CHAMOYADA ---
        {
            type: "chamoyada",
            name: "Chamoyada",
            displayName: "Chamoyada",
            price: 75, // Precio de la chamoyada, actualizado a $75
            description: "El toque picosito que estabas esperando en el menú, disfruta de una boba explosiva y llena de sabor. Escoge el sabor que quieres llevar al siguiente nivel entre las opciones base agua que tenemos.",
            imageUrl: "https://i.imgur.com/39xoolA.jpeg" // Placeholder para la imagen de Chamoyada
        },
        // --- FIN NUEVA ESPECIALIDAD ---
        // Bebidas Calientes (usarán una imagen genérica si no se especifica una individual)
        {
            type: "hot-drink",
            name: "Chocolate Caliente",
            displayName: "Chocolate Caliente",
            price: 60,
            description: "El abrazo más dulce y cálido en una taza 🍫☕💖",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg" // Generic hot drink image
        },
        {
            type: "hot-drink",
            name: "Taro Caliente",
            displayName: "Taro Caliente",
            price: 60,
            description: "Cremoso y delicado, perfecto para el frío 🌰💜",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
        },
        {
            type: "hot-drink",
            name: "Mazapán Caliente",
            displayName: "Mazapán Caliente",
            price: 60,
            description: "Sabor a infancia mexicana, ahora calientito 🎠💕",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
        },
        {
            type: "hot-drink",
            name: "Chai Caliente",
            displayName: "Chai Caliente",
            price: 60,
            description: "Especiado y reconfortante, un clásico invernal ✨☕",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
        },
        {
            type: "hot-drink",
            name: "Mocha Caliente",
            displayName: "Mocha Caliente",
            price: 60,
            description: "La combinación perfecta de café y chocolate, caliente y delicioso ☕🍫",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
        },
        {
            type: "hot-drink",
            name: "Cookies & Cream Caliente",
            displayName: "Cookies & Cream Caliente",
            price: 60,
            description: "Como beber una galleta con leche, pero calientita 🍪🥛",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
        },
        {
            type: "hot-drink",
            name: "Crema Irlandesa Caliente",
            displayName: "Crema Irlandesa Caliente",
            price: 60,
            description: "Cremosa y misteriosa, para una tarde acogedora 🍮✨",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
        },
        {
            type: "hot-drink",
            name: "Matcha Caliente",
            displayName: "Matcha Caliente",
            price: 60,
            description: "Té verde japonés con energía zen, calientito y reconfortante 💚🌿",
            imageUrl: "https://i.imgur.com/6QIRLrZ.jpeg"
        }
    ];

    console.log("productsData loaded:", productsData.length, "items.");

    // --- END PRODUCT DATA DEFINITION ---

    // Logic to display the logo based on the theme (light/dark)
    function setInitialLogoTheme() {
        const logoLight = document.getElementById('logoLight');
        const logoDark = document.getElementById('logoDark');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (logoLight && logoDark) {
            if (prefersDark) {
                logoLight.style.opacity = '0';
                logoDark.style.opacity = '1';
            } else {
                logoLight.style.opacity = '1';
                logoDark.style.opacity = '0';
            }
            console.log("Initial logo theme set.");
        } else {
            console.warn("Logo elements (logoLight or logoDark) not found.");
        }
    }
    setInitialLogoTheme();

    // Logic for the flavor image viewer
    const flavorImageOverlay = document.getElementById('flavorImageOverlay');
    const flavorImage = document.getElementById('flavorImage');
    const flavorImageName = document.getElementById('flavorImageName');
    // Actualiza la selección de botones para incluir el nuevo modal de Chamoyada
    const closeModalButtons = document.querySelectorAll('.close-modal-button');

    // Manejador de eventos para abrir el modal de imagen
    function openFlavorImageModal(flavorDisplayName, imageUrl) {
        if (flavorImage) {
            flavorImage.src = imageUrl;
            flavorImage.alt = `Imagen de ${flavorDisplayName}`; // Update alt text
            flavorImage.onerror = function() {
                this.src = 'https://placehold.co/300x300/FF6347/FFFFFF?text=Error+al+cargar';
                this.alt = 'Error al cargar la imagen';
                console.error(`Failed to load image for ${flavorDisplayName}: ${imageUrl}`);
            };
        } else {
            console.warn("flavorImage element not found.");
        }
        if (flavorImageName) {
            flavorImageName.textContent = flavorDisplayName;
        } else {
            console.warn("flavorImageName element not found.");
        }
        if (flavorImageOverlay) {
            flavorImageOverlay.classList.add('show');
            flavorImageOverlay.focus(); // Focus the overlay for accessibility
            console.log(`Opened image modal for: ${flavorDisplayName}`);
        } else {
            console.warn("flavorImageOverlay element not found.");
        }
    }

    // Lógica del Carrito de Compras y Selección de Toppings
    let cart = []; // Almacena los items seleccionados: { id, name, basePrice, selectedToppings: [{ name, price }] }
    let currentDrinkBeingCustomized = null; // Guarda el objeto de la bebida mientras se seleccionan los toppings
    let lastClickedAddButton = null; // Referencia al botón que fue clicado
    let currentChamoyadaCustomization = null; // Para almacenar la personalización de la Chamoyada

    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalElement = document.getElementById('cartTotal');
    const clearCartButton = document.getElementById('clearCartButton');
    const orderWhatsAppButton = document.getElementById('orderWhatsAppButton');
    let addDrinkToCartButtons; // Will be populated after dynamic rendering

    const cartItemCountElement = document.getElementById('cartItemCount');
    const cartIconEmojiElement = document.getElementById('cartIconEmoji');
    const cartSummaryElement = document.getElementById('cartSummary'); // Declaración principal
    const shoppingCartSection = document.getElementById('shoppingCartSection'); // Declaración principal

    // Elementos del Modal de Toppings
    const toppingSelectionOverlay = document.getElementById('toppingSelectionOverlay');
    const toppingDrinkNameElement = document.getElementById('toppingDrinkName');
    const toppingsModalGrid = document.getElementById('toppingsModalGrid');
    const confirmToppingsButton = document.getElementById('confirmToppingsButton');
    const noToppingsButton = document.getElementById('noToppingsButton');
    const cancelToppingsButton = document.getElementById('cancelToppingsButton');

    // NUEVO: Elementos del Modal de Chamoyada
    const chamoyadaCustomizationOverlay = document.getElementById('chamoyadaCustomizationOverlay');
    const chamoyadaBaseFlavorGrid = document.getElementById('chamoyadaBaseFlavorGrid');
    const chamoyadaToppingsGrid = document.getElementById('chamoyadaToppingsGrid');
    const confirmChamoyadaButton = document.getElementById('confirmChamoyadaButton');
    const cancelChamoyadaButton = document.getElementById('cancelChamoyadaButton');


    // Toppings disponibles (coincide con los datos del HTML)
    const availableToppings = [
        { name: "Perlas explosivas de frutos rojos", price: 10 },
        { name: "Perlas explosivas de manzana verde", price: 10 },
        { name: "Perlas explosivas de litchi", price: 10 },
        { name: "Jelly arcoiris", price: 10 }
    ];
    console.log("Toppings data loaded.");

    // --- DYNAMIC PRODUCT RENDERING ---
    function renderProducts() {
        console.log("Starting renderProducts function.");
        const waterFrappesGrid = document.getElementById('waterFrappesGrid');
        const milkFrappesGrid = document.getElementById('milkFrappesGrid');
        const hotDrinksGrid = document.getElementById('hotDrinksGrid');

        if (!waterFrappesGrid) { console.error("waterFrappesGrid not found."); return; }
        if (!milkFrappesGrid) { console.error("milkFrappesGrid not found."); return; }
        if (!hotDrinksGrid) { console.error("hotDrinksGrid not found."); return; }

        // Clear existing content in case of re-rendering
        waterFrappesGrid.innerHTML = '';
        milkFrappesGrid.innerHTML = '';
        hotDrinksGrid.innerHTML = '';
        console.log("Product grids cleared.");

        productsData.forEach((product, index) => {
            // Solo renderiza productos que no sean la promoción de Fresas con Crema o Chamoyada,
            // ya que esas son estáticas en el HTML.
            if (product.name === "Frappé Fresas con Crema (Temporada)" || product.name === "Chamoyada") {
                return; // Salta estos productos, ya están en el HTML
            }

            const flavorItemDiv = document.createElement('div');
            flavorItemDiv.className = `flavor-item animate-on-scroll`; // Add animate class
            flavorItemDiv.dataset.name = product.name; // Use full name for internal logic
            flavorItemDiv.dataset.price = product.price;
            flavorItemDiv.tabIndex = 0; // Make it focusable for keyboard navigation

            flavorItemDiv.innerHTML = `
                <h3 class="flavor-name">${product.displayName}</h3>
                <p class="flavor-description">${product.description}</p>
                <button class="add-drink-to-cart-button" aria-label="Añadir ${product.name} al carrito">Añadir 💖</button>
            `;

            // Apply transition delay for sequential animation
            flavorItemDiv.style.transitionDelay = `${index * 0.1}s`;

            // Attach event listener for opening the image modal
            flavorItemDiv.addEventListener('click', function(event) {
                if (event.target.tagName === 'BUTTON') {
                    return; // Don't open modal if button is clicked
                }
                openFlavorImageModal(product.displayName, product.imageUrl);
            });
            flavorItemDiv.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openFlavorImageModal(product.displayName, product.imageUrl);
                }
            });

            // Append to the correct grid based on type
            if (product.type === "water-based-frappe") {
                waterFrappesGrid.appendChild(flavorItemDiv);
            } else if (product.type === "milk-based-frappe") {
                milkFrappesGrid.appendChild(flavorItemDiv);
            } else if (product.type === "hot-drink") {
                hotDrinksGrid.appendChild(flavorItemDiv);
            }
        });
        console.log("Products appended to grids.");

        // Re-initialize Intersection Observer for new elements
        setupIntersectionObserver();
        console.log("setupIntersectionObserver called.");
    }

    // Call renderProducts as soon as DOM is ready
    renderProducts();
    console.log("renderProducts function executed.");


    // Close modals when clicking on the overlay or the close button
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Cierra cualquier modal que sea el ancestro más cercano
            this.closest('.flavor-image-overlay, .topping-selection-overlay, #chamoyadaCustomizationOverlay').classList.remove('show');
            console.log("Modal closed by button click.");
        });
    });

    // Close modals with the ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (flavorImageOverlay && flavorImageOverlay.classList.contains('show')) {
                flavorImageOverlay.classList.remove('show');
                console.log("Image modal closed by ESC.");
            }
            if (toppingSelectionOverlay && toppingSelectionOverlay.classList.contains('show')) {
                toppingSelectionOverlay.classList.remove('show');
                console.log("Topping modal closed by ESC.");
            }
            // NUEVO: Cierra el modal de Chamoyada con ESC
            if (chamoyadaCustomizationOverlay && chamoyadaCustomizationOverlay.classList.contains('show')) {
                chamoyadaCustomizationOverlay.classList.remove('show');
                console.log("Chamoyada modal closed by ESC.");
            }
        }
    });

    // Manejador de clic en el overlay para cerrar modales
    if (flavorImageOverlay) {
        flavorImageOverlay.addEventListener('click', function(event) {
            if (event.target === flavorImageOverlay) {
                flavorImageOverlay.classList.remove('show');
                console.log("Image modal closed by overlay click.");
            }
        });
    }
    if (toppingSelectionOverlay) {
        toppingSelectionOverlay.addEventListener('click', function(event) {
            if (event.target === toppingSelectionOverlay) {
                toppingSelectionOverlay.classList.remove('show');
                console.log("Topping modal closed by overlay click.");
            }
        });
    }
    // NUEVO: Manejador de clic en el overlay para cerrar el modal de Chamoyada
    if (chamoyadaCustomizationOverlay) {
        chamoyadaCustomizationOverlay.addEventListener('click', function(event) {
            if (event.target === chamoyadaCustomizationOverlay) {
                chamoyadaCustomizationOverlay.classList.remove('show');
                console.log("Chamoyada modal closed by overlay click.");
            }
        });
    }


    // Function to open the topping selection modal (for regular drinks)
    function openToppingSelectionModal(drinkName, drinkPrice, clickedButton) {
        console.log(`Opening topping selection modal for: ${drinkName}`);
        currentDrinkBeingCustomized = {
            id: generateUniqueId(), // Assign a temporary ID
            name: drinkName,
            basePrice: drinkPrice,
            selectedToppings: []
        };
        lastClickedAddButton = clickedButton; // Save button reference

        if (toppingDrinkNameElement) {
            toppingDrinkNameElement.textContent = drinkName;
        }
        if (toppingsModalGrid) {
            toppingsModalGrid.innerHTML = ''; // Clear previous toppings

            // Populate toppings in the modal
            availableToppings.forEach(topping => {
                const toppingItemDiv = document.createElement('div');
                toppingItemDiv.className = 'topping-modal-item';
                toppingItemDiv.dataset.name = topping.name;
                toppingItemDiv.dataset.price = topping.price;

                const isSelected = currentDrinkBeingCustomized.selectedToppings.some(t => t.name === topping.name);
                if (isSelected) {
                    toppingItemDiv.classList.add('selected');
                }

                toppingItemDiv.innerHTML = `
                    <span class="topping-modal-name">${topping.name}</span>
                    <span class="topping-modal-price">+$${topping.price}</span>
                    <button class="add-topping-button ${isSelected ? 'remove' : ''}"
                            data-action="${isSelected ? 'remove' : 'add'}"
                            aria-label="${isSelected ? 'Quitar' : 'Añadir'} ${topping.name}">
                        ${isSelected ? 'Quitar ➖' : 'Añadir ✨'}
                    </button>
                `;
                toppingsModalGrid.appendChild(toppingItemDiv);
            });

            // Attach event listeners for topping buttons in the modal
            toppingsModalGrid.querySelectorAll('.add-topping-button').forEach(button => {
                button.addEventListener('click', function() {
                    const toppingItemDiv = this.closest('.topping-modal-item');
                    const toppingName = toppingItemDiv.dataset.name;
                    const toppingPrice = parseFloat(toppingItemDiv.dataset.price);

                    const action = this.dataset.action;

                    if (action === 'add') {
                        currentDrinkBeingCustomized.selectedToppings.push({ name: toppingName, price: toppingPrice });
                        toppingItemDiv.classList.add('selected');
                        this.textContent = 'Quitar ➖';
                        this.dataset.action = 'remove';
                        this.classList.add('remove');
                        this.setAttribute('aria-label', `Quitar ${toppingName}`);
                    } else {
                        currentDrinkBeingCustomized.selectedToppings = currentDrinkBeingCustomized.selectedToppings.filter(t => t.name !== toppingName);
                        toppingItemDiv.classList.remove('selected');
                        this.textContent = 'Añadir ✨';
                        this.dataset.action = 'add';
                        this.classList.remove('remove');
                        this.setAttribute('aria-label', `Añadir ${toppingName}`);
                    }
                    console.log(`Topping ${toppingName} action: ${action}. Current selected toppings:`, currentDrinkBeingCustomized.selectedToppings);
                });
            });
        }

        if (toppingSelectionOverlay) {
            toppingSelectionOverlay.classList.add('show');
            toppingSelectionOverlay.focus(); // Focus the overlay for accessibility
        }
    }

    // NUEVO: Function to open the Chamoyada customization modal
    function openChamoyadaCustomizationModal(drinkName, drinkPrice, clickedButton) {
        console.log(`Opening Chamoyada customization modal for: ${drinkName}`);
        lastClickedAddButton = clickedButton;

        currentChamoyadaCustomization = {
            id: generateUniqueId(),
            name: drinkName,
            basePrice: drinkPrice,
            chamoyadaBaseFlavor: null, // To store the chosen water-based flavor
            selectedToppings: []
        };

        // Populate base water flavors
        if (chamoyadaBaseFlavorGrid) {
            chamoyadaBaseFlavorGrid.innerHTML = '';
            const waterBasedFlavors = productsData.filter(p => p.type === "water-based-frappe");

            waterBasedFlavors.forEach(flavor => {
                const flavorItemDiv = document.createElement('label');
                flavorItemDiv.className = 'chamoyada-base-flavor-item';
                flavorItemDiv.innerHTML = `
                    <input type="radio" name="chamoyadaBaseFlavor" value="${flavor.displayName}" data-full-name="${flavor.name}" aria-label="Sabor base ${flavor.displayName}">
                    <span>${flavor.displayName}</span>
                `;
                chamoyadaBaseFlavorGrid.appendChild(flavorItemDiv);

                flavorItemDiv.querySelector('input[type="radio"]').addEventListener('change', function() {
                    chamoyadaBaseFlavorGrid.querySelectorAll('.chamoyada-base-flavor-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    if (this.checked) {
                        this.closest('.chamoyada-base-flavor-item').classList.add('selected');
                        currentChamoyadaCustomization.chamoyadaBaseFlavor = {
                            name: this.value,
                            fullName: this.dataset.fullName
                        };
                        console.log("Chamoyada base flavor selected:", currentChamoyadaCustomization.chamoyadaBaseFlavor);
                    }
                });
            });
        }

        // Populate toppings for Chamoyada
        if (chamoyadaToppingsGrid) {
            chamoyadaToppingsGrid.innerHTML = ''; // Clear previous toppings
            availableToppings.forEach(topping => {
                const toppingItemDiv = document.createElement('div');
                toppingItemDiv.className = 'topping-modal-item'; // Reuse existing topping item styles
                toppingItemDiv.dataset.name = topping.name;
                toppingItemDiv.dataset.price = topping.price;

                const isSelected = currentChamoyadaCustomization.selectedToppings.some(t => t.name === topping.name);
                if (isSelected) {
                    toppingItemDiv.classList.add('selected');
                }

                toppingItemDiv.innerHTML = `
                    <span class="topping-modal-name">${topping.name}</span>
                    <span class="topping-modal-price">+$${topping.price}</span>
                    <button class="add-topping-button ${isSelected ? 'remove' : ''}"
                            data-action="${isSelected ? 'remove' : 'add'}"
                            aria-label="${isSelected ? 'Quitar' : 'Añadir'} ${topping.name}">
                        ${isSelected ? 'Quitar ➖' : 'Añadir ✨'}
                    </button>
                `;
                chamoyadaToppingsGrid.appendChild(toppingItemDiv);

                toppingItemDiv.querySelector('.add-topping-button').addEventListener('click', function() {
                    const toppingName = this.closest('.topping-modal-item').dataset.name;
                    const toppingPrice = parseFloat(this.closest('.topping-modal-item').dataset.price);
                    const action = this.dataset.action;

                    if (action === 'add') {
                        currentChamoyadaCustomization.selectedToppings.push({ name: toppingName, price: toppingPrice });
                        this.closest('.topping-modal-item').classList.add('selected');
                        this.textContent = 'Quitar ➖';
                        this.dataset.action = 'remove';
                        this.classList.add('remove');
                        this.setAttribute('aria-label', `Quitar ${toppingName}`);
                    } else {
                        currentChamoyadaCustomization.selectedToppings = currentChamoyadaCustomization.selectedToppings.filter(t => t.name !== toppingName);
                        this.closest('.topping-modal-item').classList.remove('selected');
                        this.textContent = 'Añadir ✨';
                        this.dataset.action = 'add';
                        this.classList.remove('remove');
                        this.setAttribute('aria-label', `Añadir ${toppingName}`);
                    }
                    console.log(`Chamoyada topping ${toppingName} action: ${action}. Current selected toppings:`, currentChamoyadaCustomization.selectedToppings);
                });
            });
        }

        if (chamoyadaCustomizationOverlay) {
            chamoyadaCustomizationOverlay.classList.add('show');
            chamoyadaCustomizationOverlay.focus();
        }
    }

    // Function to add the customized drink to the main cart (now handles Chamoyada too)
    function addCustomizedDrinkToCart() {
        if (currentDrinkBeingCustomized) { // For regular drinks
            let itemTotalPrice = currentDrinkBeingCustomized.basePrice;
            currentDrinkBeingCustomized.selectedToppings.forEach(t => {
                itemTotalPrice += t.price;
            });
            currentDrinkBeingCustomized.itemTotalPrice = itemTotalPrice;

            cart.push({ ...currentDrinkBeingCustomized }); // Push a copy
            currentDrinkBeingCustomized = null; // Clear temporary drink
            if (toppingSelectionOverlay) {
                toppingSelectionOverlay.classList.remove('show'); // Hide modal
            }
            updateCartDisplay();
            console.log("Drink added to cart:", cart);

            // Visual feedback on the add button
            if (lastClickedAddButton) {
                const originalText = 'Añadir 💖';
                const originalBackground = lastClickedAddButton.style.background || '';

                lastClickedAddButton.textContent = '¡Añadido! ✅';
                lastClickedAddButton.classList.add('added-feedback');

                setTimeout(() => {
                    lastClickedAddButton.textContent = originalText;
                    lastClickedAddButton.classList.remove('added-feedback');
                    lastClickedAddButton.style.background = originalBackground;
                }, 1000);
                lastClickedAddButton = null;
            }
        }
        // No need for a separate addChamoyadaToCart function, just handle confirmation in Chamoyada modal listeners
    }

    // Function to set up event listeners for add to cart buttons
    function setupAddToCartButtons() {
        // Selecciona TODOS los botones de añadir al carrito, tanto dinámicos como estáticos
        addDrinkToCartButtons = document.querySelectorAll('.add-drink-to-cart-button');
        console.log("Found addDrinkToCartButtons:", addDrinkToCartButtons.length);
        addDrinkToCartButtons.forEach(button => {
            // Remove existing listeners to prevent duplicates if called multiple times
            const oldClickListener = button.__clickListener;
            if (oldClickListener) {
                button.removeEventListener('click', oldClickListener);
            }

            const newClickListener = function() {
                const itemElement = this.closest('[data-name][data-price]');
                if (itemElement) {
                    const name = itemElement.dataset.name;
                    const price = parseFloat(itemElement.dataset.price);

                    // NUEVO: Condición para abrir el modal de Chamoyada
                    if (name === "Chamoyada") {
                        openChamoyadaCustomizationModal(name, price, this);
                    } else {
                        openToppingSelectionModal(name, price, this); // Existing logic for other drinks
                    }
                } else {
                    console.error("Could not find parent item element for add to cart button.", this);
                }
            };
            button.addEventListener('click', newClickListener);
            button.__clickListener = newClickListener; // Store reference to remove later
        });
    }

    // Event Listeners for Topping Modal buttons (for regular drinks)
    if (confirmToppingsButton) {
        confirmToppingsButton.addEventListener('click', addCustomizedDrinkToCart);
    } else { console.warn("confirmToppingsButton not found."); }
    if (noToppingsButton) {
        noToppingsButton.addEventListener('click', function() {
            if (currentDrinkBeingCustomized) {
                currentDrinkBeingCustomized.selectedToppings = [];
                addCustomizedDrinkToCart();
            }
        });
    } else { console.warn("noToppingsButton not found."); }
    if (cancelToppingsButton) {
        cancelToppingsButton.addEventListener('click', function() {
            currentDrinkBeingCustomized = null; // Discard current selection
            if (toppingSelectionOverlay) {
                toppingSelectionOverlay.classList.remove('show'); // Hide modal
            }
            if (lastClickedAddButton) { // Reset the button if canceled
                lastClickedAddButton.textContent = 'Añadir 💖';
                lastClickedAddButton.classList.remove('added-feedback');
                lastClickedAddButton.style.background = ''; // Revert to original background
                lastClickedAddButton = null;
            }
            console.log("Topping selection canceled.");
        });
    } else { console.warn("cancelToppingsButton not found."); }

    // NUEVO: Event Listeners for Chamoyada Modal buttons
    if (confirmChamoyadaButton) {
        confirmChamoyadaButton.addEventListener('click', function() {
            if (!currentChamoyadaCustomization.chamoyadaBaseFlavor) {
                // Reemplazar con un modal de alerta personalizado en producción
                alert("Por favor, selecciona un sabor base para tu Chamoyada.");
                return;
            }
            let itemTotalPrice = currentChamoyadaCustomization.basePrice;
            currentChamoyadaCustomization.selectedToppings.forEach(t => {
                itemTotalPrice += t.price;
            });
            currentChamoyadaCustomization.itemTotalPrice = itemTotalPrice;

            cart.push({ ...currentChamoyadaCustomization }); // Push a copy
            currentChamoyadaCustomization = null; // Clear temporary customization
            if (chamoyadaCustomizationOverlay) {
                chamoyadaCustomizationOverlay.classList.remove('show'); // Hide modal
            }
            updateCartDisplay();
            console.log("Chamoyada added to cart:", cart);

            // Visual feedback on the add button
            if (lastClickedAddButton) {
                const originalText = 'Añadir 💖';
                const originalBackground = lastClickedAddButton.style.background || '';

                lastClickedAddButton.textContent = '¡Añadido! ✅';
                lastClickedAddButton.classList.add('added-feedback');

                setTimeout(() => {
                    lastClickedAddButton.textContent = originalText;
                    lastClickedAddButton.classList.remove('added-feedback');
                    lastClickedAddButton.style.background = originalBackground;
                }, 1000);
                lastClickedAddButton = null;
            }
        });
    } else { console.warn("confirmChamoyadaButton not found."); }

    if (cancelChamoyadaButton) {
        cancelChamoyadaButton.addEventListener('click', function() {
            currentChamoyadaCustomization = null; // Discard current customization
            if (chamoyadaCustomizationOverlay) {
                chamoyadaCustomizationOverlay.classList.remove('show'); // Hide modal
            }
            if (lastClickedAddButton) { // Reset the button if canceled
                lastClickedAddButton.textContent = 'Añadir 💖';
                lastClickedAddButton.classList.remove('added-feedback');
                lastClickedAddButton.style.background = ''; // Revert to original background
                lastClickedAddButton = null;
            }
            console.log("Chamoyada customization canceled.");
        });
    } else { console.warn("cancelChamoyadaButton not found."); }


    // Function to clear the entire cart
    function clearCart() {
        cart = []; // Empty the cart array
        updateCartDisplay(); // Update the UI
        console.log("Cart cleared.");

        // Reset all add buttons
        addDrinkToCartButtons.forEach(button => {
            button.textContent = 'Añadir 💖';
            button.classList.remove('added-feedback');
            button.style.background = ''; // Revert to original background defined in CSS
        });
        lastClickedAddButton = null; // Ensure the reference is also cleared
    }

    // Function to update the cart display in the HTML
    function updateCartDisplay() {
        if (!cartItemsList) { console.error("cartItemsList not found."); return; }
        if (!cartTotalElement) { console.error("cartTotalElement not found."); return; }
        if (!cartItemCountElement) { console.error("cartItemCountElement not found."); return; }

        cartItemsList.innerHTML = ''; // Clear current display
        let total = 0;

        // Group identical items for display
        const groupedCart = {};
        cart.forEach(item => {
            let key;
            let displayName = item.displayName || item.name; // Use displayName if available, else name
            let toppingsText = item.selectedToppings.map(t => t.name).sort().join(', ');

            if (item.name === "Chamoyada" && item.chamoyadaBaseFlavor) {
                // For Chamoyada, key should include base flavor
                displayName = `Chamoyada (${item.chamoyadaBaseFlavor.name})`;
                key = `${item.name}|${item.chamoyadaBaseFlavor.name}|${toppingsText}`;
            } else {
                key = `${item.name}|${toppingsText}`;
            }

            if (groupedCart[key]) {
                groupedCart[key].quantity++;
            } else {
                groupedCart[key] = {
                    name: displayName, // This will be displayed
                    originalName: item.name, // Keep original name for internal logic (e.g., Chamoyada type check)
                    chamoyadaBaseFlavor: item.chamoyadaBaseFlavor, // Keep this for WA message
                    selectedToppings: item.selectedToppings,
                    quantity: 1,
                    totalItemPrice: item.basePrice + item.selectedToppings.reduce((sum, t) => sum + t.price, 0),
                    originalIds: [item.id]
                };
            }
        });

        const sortedGroupedItems = Object.values(groupedCart).sort((a, b) => a.name.localeCompare(b.name));

        if (sortedGroupedItems.length === 0) {
            cartItemsList.innerHTML = '<li class="empty-cart-message">¡Tu carrito está vacío, añade algo delicioso! 💖</li>';
            if (clearCartButton) clearCartButton.disabled = true;
            if (orderWhatsAppButton) orderWhatsAppButton.disabled = true;
        } else {
            if (clearCartButton) clearCartButton.disabled = false;
            if (orderWhatsAppButton) orderWhatsAppButton.disabled = false;
            sortedGroupedItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';

                let toppingsDetailText = '';
                if (item.selectedToppings && item.selectedToppings.length > 0) {
                    toppingsDetailText = `(+ ${item.selectedToppings.map(t => t.name).join(', ')})`;
                }

                // Construct the data-key for the remove button consistently
                let removeItemKey;
                if (item.originalName === "Chamoyada" && item.chamoyadaBaseFlavor) {
                    removeItemKey = `${item.originalName}|${item.chamoyadaBaseFlavor.name}|${item.selectedToppings.map(t => t.name).sort().join(', ')}`;
                } else {
                    removeItemKey = `${item.originalName}|${item.selectedToppings.map(t => t.name).sort().join(', ')}`;
                }

                li.innerHTML = `
                    <div class="item-main-info">
                        <span class="item-quantity">${item.quantity}x</span>
                        <span class="item-name">${item.name}</span>
                    </div>
                    <div class="item-details">
                        <span class="item-toppings">${toppingsDetailText}</span>
                        <span class="item-price">$${(item.totalItemPrice * item.quantity).toFixed(2)}</span>
                        <button class="remove-item-button" data-key="${removeItemKey}" aria-label="Quitar un ${item.name} del carrito">➖</button>
                    </div>
                `;
                cartItemsList.appendChild(li);
                total += item.totalItemPrice * item.quantity;
            });
        }

        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;

        // Update item count in the header and animate
        const totalItemsInCart = cart.length; // Count each instance
        cartItemCountElement.textContent = totalItemsInCart;

        if (cartIconEmojiElement && totalItemsInCart !== parseInt(cartItemCountElement.dataset.previousCount || 0)) {
            cartIconEmojiElement.classList.remove('pulse-animation');
            void cartIconEmojiElement.offsetWidth; // Trick to restart the animation
            cartIconEmojiElement.classList.add('pulse-animation');
        }
        cartItemCountElement.dataset.previousCount = totalItemsInCart; // Store current count
        console.log("Cart display updated. Total items:", totalItemsInCart);

        // Re-attach event listeners for dynamically created remove buttons
        cartItemsList.querySelectorAll('.remove-item-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemKeyToRemove = event.target.dataset.key;

                // Find the first item in the original `cart` array that matches this key
                const indexToRemove = cart.findIndex(cartItem => {
                    let currentItemKey;
                    let currentToppingsText = cartItem.selectedToppings.map(t => t.name).sort().join(', ');

                    if (cartItem.name === "Chamoyada" && cartItem.chamoyadaBaseFlavor) {
                        currentItemKey = `Chamoyada|${cartItem.chamoyadaBaseFlavor.name}|${currentToppingsText}`;
                    } else {
                        currentItemKey = `${cartItem.name}|${currentToppingsText}`;
                    }
                    return currentItemKey === itemKeyToRemove;
                });

                if (indexToRemove > -1) {
                    cart.splice(indexToRemove, 1);
                    console.log(`Removed item with key: ${itemKeyToRemove}. Remaining cart:`, cart);
                } else {
                    console.warn(`Attempted to remove item with key ${itemKeyToRemove} but not found.`);
                }
                updateCartDisplay();
            });
        });

        // Scroll the cart down
        cartItemsList.scrollTop = cartItemsList.scrollHeight;
    }

    // Function to generate the WhatsApp message
    function generateWhatsAppMessage() {
        if (cart.length === 0) {
            if (orderWhatsAppButton) {
                orderWhatsAppButton.textContent = "¡Carrito Vacío! Añade algo 🚫";
                orderWhatsAppButton.style.background = "#FF6347";
                setTimeout(() => {
                    orderWhatsAppButton.textContent = "Pedir por WhatsApp 📱";
                    orderWhatsAppButton.style.background = "linear-gradient(45deg, #25D366, #128C7E)";
                }, 2000);
            }
            console.log("Attempted to generate WhatsApp message with empty cart.");
            return;
        }

        let message = "¡Hola! Me gustaría hacer el siguiente pedido de Capibobba:\n\n";
        let finalTotal = 0;

        const groupedForWhatsApp = {};
        cart.forEach(item => {
            let toppingsText = item.selectedToppings.map(t => t.name).sort().join(', ');
            let key;
            let displayItemName = item.displayName || item.name;

            if (item.name === "Chamoyada" && item.chamoyadaBaseFlavor) {
                displayItemName = `Chamoyada (${item.chamoyadaBaseFlavor.name})`;
                key = `${item.name}|${item.chamoyadaBaseFlavor.name}|${toppingsText}`;
            } else {
                key = `${item.name}|${toppingsText}`;
            }

            if (groupedForWhatsApp[key]) {
                groupedForWhatsApp[key].quantity++;
                groupedForWhatsApp[key].totalPricePerItem += item.basePrice + item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
            } else {
                groupedForWhatsApp[key] = {
                    name: displayItemName, // Use the formatted name for display in WA
                    originalName: item.name, // Keep original name for type check
                    chamoyadaBaseFlavor: item.chamoyadaBaseFlavor,
                    selectedToppings: item.selectedToppings,
                    quantity: 1,
                    totalPricePerItem: item.basePrice + item.selectedToppings.reduce((sum, t) => sum + t.price, 0)
                };
            }
        });

        let itemNumber = 1;
        Object.values(groupedForWhatsApp).forEach(item => {
            let toppingsDetail = '';
            if (item.selectedToppings && item.selectedToppings.length > 0) {
                toppingsDetail = ` con ${item.selectedToppings.map(t => t.name).join(', ')}`;
            }
            
            message += `${itemNumber}. ${item.quantity}x ${item.name}${toppingsDetail} ($${(item.totalPricePerItem * item.quantity).toFixed(2)})\n`;
            finalTotal += item.totalPricePerItem * item.quantity;
            itemNumber++;
        });

        message += `\nTotal del pedido: $${finalTotal.toFixed(2)}`;
        message += `\n\n¡Estoy emocionado/a por mis bebidas kawaii! 💖`;

        const whatsappNumber = "5217712794633"; // Ensure this number is correct
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        const newWindow = window.open(whatsappUrl, '_blank');

        if (newWindow === null || typeof newWindow === 'undefined' || newWindow.closed) {
            if (orderWhatsAppButton) {
                orderWhatsAppButton.textContent = "Pop-up blocked. Check your browser! ⚠️";
                orderWhatsAppButton.style.background = "#FF6347";
                setTimeout(() => {
                    orderWhatsAppButton.textContent = "Pedir por WhatsApp 📱";
                    orderWhatsAppButton.style.background = "linear-gradient(45deg, #25D366, #128C7E)";
                }, 4000);
            }
            console.warn("WhatsApp pop-up blocked or failed to open.");
        } else {
            console.log("WhatsApp message generated and attempted to open:", whatsappUrl);
        }
    }

    // Attach Event Listeners for main cart buttons
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
        console.log("Clear cart button listener attached.");
    } else { console.warn("clearCartButton not found."); }

    if (orderWhatsAppButton) {
        orderWhatsAppButton.addEventListener('click', generateWhatsAppMessage);
        console.log("Order WhatsApp button listener attached.");
    } else { console.warn("orderWhatsAppButton not found."); }

    // Initial update of the cart display when the page loads
    updateCartDisplay();
    console.log("Initial cart display updated.");

    // Intersection Observer for scroll animations
    function setupIntersectionObserver() {
        console.log("setupIntersectionObserver called. currentObserver before check:", currentObserver);

        // Si ya existe un observador, desconéctalo.
        // Se usa `typeof` para una comprobación más robusta de que es un objeto con el método `disconnect`.
        if (currentObserver && typeof currentObserver.disconnect === 'function') {
            currentObserver.disconnect();
            console.log("Previous Intersection Observer disconnected.");
        } else if (currentObserver !== null) {
            console.warn("currentObserver exists but is not a valid IntersectionObserver instance for disconnect:", currentObserver);
        }

        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-in-left, .animate-slide-in-right');
        console.log("Found animated elements for new observer:", animatedElements.length);

        const observerOptions = {
            root: null, /* viewport */
            rootMargin: '0px',
            threshold: 0.1 /* 10% of the element visible to activate */
        };

        // Crea una nueva instancia de IntersectionObserver
        currentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Deja de observar una vez que es visible
                }
            });
        }, observerOptions);

        // Observa todos los elementos animados
        animatedElements.forEach(element => {
            currentObserver.observe(element);
        });
        console.log("New Intersection Observer setup and observing elements.");
    }

    // Llama a setupAddToCartButtons aquí para asegurarte de que tanto los botones dinámicos como los estáticos
    // (como el de Fresas con Crema y Chamoyada) tengan sus listeners adjuntos al cargar la página.
    setupAddToCartButtons();
    console.log("setupAddToCartButtons called after initial render and for static elements.");


    // Logic for the cart to follow the scroll
    // Las declaraciones de cartSummaryElement y shoppingCartSection ya están arriba, no se redeclaran aquí.
    if (cartSummaryElement) {
        const initialTopOffset = 20; // Initial position from the top of the viewport
        const scrollSpeedFactor = 0.1; // Movement factor (0.1 means 10% of the scroll)
        const maxTopOffset = 100; // Maximum position from the top of the viewport

        function updateCartPosition() {
            const currentScrollY = window.scrollY;
            let newTop = initialTopOffset + (currentScrollY * scrollSpeedFactor);

            // Limit the top position so it doesn't go too far
            newTop = Math.max(initialTopOffset, Math.min(maxTopOffset, newTop));

            cartSummaryElement.style.top = `${newTop}px`;
        }

        // Apply throttling for the scroll event
        window.addEventListener('scroll', throttle(updateCartPosition, 10)); // Execute every 10ms
        // Call the function once on load to set the initial position
        updateCartPosition();
        console.log("Cart summary scroll logic initialized.");

        // Click event for the cart icon
        cartSummaryElement.addEventListener('click', function() {
            if (shoppingCartSection) {
                shoppingCartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log("Cart summary clicked, scrolling to shopping cart section.");
            } else {
                console.warn("shoppingCartSection not found for scrollIntoView.");
            }
        });
    } else {
        console.warn("cartSummaryElement not found. Cart scroll logic not initialized.");
    }

    // Special case for the "Frappé Fresas con Crema (Temporada)" promotion
    const fresasConCremaPromotion = document.getElementById('fresasConCremaPromotion');
    if (fresasConCremaPromotion) {
        fresasConCremaPromotion.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                return; // Si se hace clic en el botón, la lógica del botón lo manejará
            }
            // Encuentra los datos del producto para esta promoción específica
            const promoProduct = productsData.find(p => p.name === "Frappé Fresas con Crema (Temporada)");
            if (promoProduct) {
                openFlavorImageModal(promoProduct.displayName, promoProduct.imageUrl);
            } else {
                console.error("Promotion product data not found for 'Frappé Fresas con Crema (Temporada)'. This should not happen if data is correctly loaded.");
            }
        });
        fresasConCremaPromotion.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const promoProduct = productsData.find(p => p.name === "Frappé Fresas con Crema (Temporada)");
                if (promoProduct) {
                    openFlavorImageModal(promoProduct.displayName, promoProduct.imageUrl);
                }
            }
        });
        console.log("Fresas con Crema promotion listener attached.");
    } else {
        console.warn("fresasConCremaPromotion element not found.");
    }

    // NUEVO: Special case for the "Chamoyada" promotion (click on the item itself)
    const chamoyadaPromotion = document.getElementById('chamoyadaPromotion');
    if (chamoyadaPromotion) {
        chamoyadaPromotion.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                return; // If button is clicked, button logic will handle it
            }
            // Find the product data for Chamoyada
            const promoProduct = productsData.find(p => p.name === "Chamoyada");
            if (promoProduct) {
                openFlavorImageModal(promoProduct.displayName, promoProduct.imageUrl);
            } else {
                console.error("Chamoyada product data not found. This should not happen if data is correctly loaded.");
            }
        });
        chamoyadaPromotion.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const promoProduct = productsData.find(p => p.name === "Chamoyada");
                if (promoProduct) {
                    openFlavorImageModal(promoProduct.displayName, promoProduct.imageUrl);
                }
            }
        });
        console.log("Chamoyada promotion listener attached.");
    } else {
        console.warn("chamoyadaPromotion element not found.");
    }
});
