// script.js
console.log("Script file loaded and executing.");

// Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, onSnapshot, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Declaración de currentObserver en el ámbito global del módulo
let currentObserver = null;

// --- INICIO DE LA SECCIÓN CRÍTICA PARA LA CONFIGURACIÓN DE FIREBASE ---
// Configuración de Firebase
// IMPORTANTE: Para ejecutar localmente, necesitas pegar tu firebaseConfig aquí.
// Cuando el código se ejecuta en el entorno de Canvas, __firebase_config y __app_id
// son proporcionados automáticamente. Para desarrollo local, los definimos aquí.
const localFirebaseConfig = {
    apiKey: "AIzaSyCiu5jBUl_66TRYsJRxYuPsCIfMCjK9hak",  
    authDomain: "menu-capibobba.firebaseapp.com", 
    projectId: "menu-capibobba", 
    storageBucket: "menu-capibobba.firebasestorage.app", 
    messagingSenderId: "899370367978",
    appId: "1:899370367978:web:2143034b34964d6266d093"
};

// Usa la configuración proporcionada por Canvas si existe, de lo contrario usa la local.
// Hacemos firebaseConfig y appId globales para que el script de población pueda acceder.
window.firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : localFirebaseConfig;
window.appId = typeof __app_id !== 'undefined' ? __app_id : window.firebaseConfig.projectId || 'default-app-id'; // Usa projectId como fallback para appId si no está en Canvas

// Asegúrate de que firebaseConfig no esté vacío si no se pudo cargar
if (!window.firebaseConfig.projectId || window.firebaseConfig.apiKey === "TU_API_KEY_AQUI") {
    console.error("Firebase configuration is missing or placeholder. Please ensure 'localFirebaseConfig' is correctly filled or '__firebase_config' is available.");
    // No usar alert() aquí para evitar bloquear la carga inicial
}
// --- FIN DE LA SECCIÓN CRÍTICA PARA LA CONFIGURACIÓN DE FIREBASE ---


// Inicialización de Firebase
try {
    if (window.firebaseConfig.projectId && window.firebaseConfig.apiKey !== "TU_API_KEY_AQUI") { // Solo inicializa si la configuración es válida y no es placeholder
        window.app = initializeApp(window.firebaseConfig);
        window.db = getFirestore(window.app);
        window.auth = getAuth(window.app);
        console.log("Firebase initialized successfully.");
    } else {
        console.warn("Firebase not initialized due to missing or placeholder configuration.");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
}


// Array que contendrá los productos cargados desde Firestore
let productsData = [];

// Función para mostrar un modal personalizado en lugar de alert()
function showCustomModal(title, message, type = 'info') {
    const existingModal = document.getElementById('customAlertModal');
    if (existingModal) {
        existingModal.remove(); // Remove any existing modal to prevent duplicates
    }

    const modalHtml = `
        <div class="custom-modal-overlay show" id="customAlertModal" role="dialog" aria-modal="true" aria-labelledby="customAlertTitle">
            <div class="custom-modal-content ${type}">
                <h3 id="customAlertTitle" class="modal-title">${title}</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    <button id="customAlertCloseBtn" class="modal-button confirm-button">Aceptar</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('customAlertModal');
    const closeBtn = document.getElementById('customAlertCloseBtn');

    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
    closeBtn.focus(); // Focus the close button for accessibility
}


document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM Content Loaded. Starting script execution.");

    // --- NUEVO: Lógica para activar el modo desarrollador localmente ---
    // Define una variable para simular el token de desarrollador si no estamos en Canvas
    // Puedes activar/desactivar esto en la consola del navegador:
    // localStorage.setItem('devMode', 'true'); // Para activar
    // localStorage.removeItem('devMode');     // Para desactivar
    const isDeveloper = typeof __initial_auth_token !== 'undefined' || localStorage.getItem('devMode') === 'true';
    console.log("Is Developer Mode:", isDeveloper);
    // --- FIN NUEVO: Lógica para activar el modo desarrollador localmente ---


    // --- INICIO: Declaración de todas las variables de elementos del DOM al principio ---
    // Elementos del Logo y Tema
    const logoLight = document.getElementById('logoLight');
    const logoDark = document.getElementById('logoDark');

    // Elementos del Visor de Imágenes de Sabor
    const flavorImageOverlay = document.getElementById('flavorImageOverlay');
    const flavorImage = document.getElementById('flavorImage');
    const flavorImageName = document.getElementById('flavorImageName');
    const closeModalButtons = document.querySelectorAll('.close-modal-button'); // Incluye botones de todos los modales

    // Elementos del Carrito de Compras
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalElement = document.getElementById('cartTotal');
    const clearCartButton = document.getElementById('clearCartButton');
    const orderWhatsAppButton = document.getElementById('orderWhatsAppButton');
    let addDrinkToCartButtons; // Se inicializa más tarde

    const cartItemCountElement = document.getElementById('cartItemCount');
    const cartIconEmojiElement = document.getElementById('cartIconEmoji');
    const cartSummaryElement = document.getElementById('cartSummary');
    const shoppingCartSection = document.getElementById('shoppingCartSection');

    // Elementos del Modal de Selección de Toppings
    const toppingSelectionOverlay = document.getElementById('toppingSelectionOverlay');
    const toppingDrinkNameElement = document.getElementById('toppingDrinkName');
    const toppingsModalGrid = document.getElementById('toppingsModalGrid');
    const confirmToppingsButton = document.getElementById('confirmToppingsButton');
    const noToppingsButton = document.getElementById('noToppingsButton');
    const cancelToppingsButton = document.getElementById('cancelToppingsButton');

    // Elementos del Modal de Personalización de Chamoyada
    const chamoyadaCustomizationOverlay = document.getElementById('chamoyadaCustomizationOverlay');
    const chamoyadaBaseFlavorGrid = document.getElementById('chamoyadaBaseFlavorGrid');
    const chamoyadaToppingsGrid = document.getElementById('chamoyadaToppingsGrid');
    const confirmChamoyadaButton = document.getElementById('confirmChamoyadaButton');
    const cancelChamoyadaButton = document.getElementById('cancelChamoyadaButton');

    // Elementos del Contador de Visitantes
    const visitorCounterDisplay = document.getElementById('visitorCounterDisplay');
    const visitorCountElement = document.getElementById('visitorCount');
    const openAdminPanelButton = document.getElementById('openAdminPanelButton');
    console.log("openAdminPanelButton element:", openAdminPanelButton);

    // Elementos del Panel de Administración de Productos
    const adminPanelOverlay = document.getElementById('adminPanelOverlay');
    const productForm = document.getElementById('productForm');
    const productIdInput = document.getElementById('productId');
    const productTypeInput = document.getElementById('productType');
    const productNameInput = document.getElementById('productName');
    const productDisplayNameInput = document.getElementById('productDisplayName');
    const productPriceInput = document.getElementById('productPrice');
    const productDescriptionInput = document.getElementById('productDescription');
    const productImageUrlInput = document.getElementById('productImageUrl');
    const saveProductButton = document.getElementById('saveProductButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const adminProductsList = document.getElementById('adminProductsList');
    // --- FIN: Declaración de todas las variables de elementos del DOM al principio ---


    // Autenticación de Firebase
    if (window.auth) { // Usamos window.auth aquí
        try {
            if (isDeveloper) {
                if (typeof __initial_auth_token !== 'undefined') {
                    await signInWithCustomToken(window.auth, __initial_auth_token);
                    console.log("Signed in with custom token (Developer).");
                } else {
                    await signInAnonymously(window.auth);
                    console.log("Signed in anonymously (Local Developer Mode).");
                }
            } else {
                await signInAnonymously(window.auth);
                console.log("Signed in anonymously (Regular User).");
            }
            window.userId = window.auth.currentUser?.uid || crypto.randomUUID(); // Hacemos userId global
            console.log("Firebase Auth state ready. User ID:", window.userId);

            window.productsCollectionRef = collection(window.db, `artifacts/${window.appId}/users/${window.userId}/products`); // Hacemos productsCollectionRef global
            console.log("Firestore products collection reference set.");

        } catch (error) {
            console.error("Firebase authentication failed:", error);
            window.userId = crypto.randomUUID(); // Fallback a un ID aleatorio si la autenticación falla
        }
    } else {
        console.warn("Firebase Auth service not available, skipping authentication.");
        window.userId = crypto.randomUUID(); // Fallback a un ID aleatorio si auth no está disponible
    }


    // --- LÓGICA DEL CONTADOR DE VISITANTES ---
    async function updateVisitorCount() {
        if (!window.db) {
            console.error("Firestore is not initialized, cannot update visitor count.");
            return;
        }

        const sessionVisitedKey = `capibobba_visited_${window.appId}`;
        const hasVisitedThisSession = sessionStorage.getItem(sessionVisitedKey);

        const counterDocRef = doc(window.db, `artifacts/${window.appId}/public/data/visitor_counter/main_counter`);

        try {
            if (!hasVisitedThisSession) {
                await setDoc(counterDocRef, { count: increment(1) }, { merge: true });
                sessionStorage.setItem(sessionVisitedKey, 'true');
                console.log("Visitor count incremented in Firestore.");
            } else {
                console.log("Visitor already counted for this session.");
            }

            const docSnap = await getDoc(counterDocRef);
            if (docSnap.exists()) {
                const currentCount = docSnap.data().count;
                if (visitorCountElement) {
                    visitorCountElement.textContent = currentCount;
                    console.log("Current visitor count:", currentCount);
                }
            } else {
                await setDoc(counterDocRef, { count: 1 });
                if (visitorCountElement) {
                    visitorCountElement.textContent = 1;
                }
                sessionStorage.setItem(sessionVisitedKey, 'true');
                console.log("Visitor counter initialized to 1.");
            }

            // Mostrar el contador y el botón de administración solo si es el desarrollador
            if (isDeveloper) {
                if (visitorCounterDisplay) {
                    visitorCounterDisplay.style.display = 'block';
                    console.log("Visitor counter display is visible for developer.");
                }
                if (openAdminPanelButton) {
                    openAdminPanelButton.style.display = 'inline-flex'; // O 'block' si prefieres
                    console.log("Applying display style to admin button. Current display:", openAdminPanelButton.style.display);
                    console.log("Admin panel button is visible for developer.");
                }
            } else {
                if (visitorCounterDisplay) {
                    visitorCounterDisplay.style.display = 'none';
                    console.log("Visitor counter display is hidden for regular user.");
                }
                if (openAdminPanelButton) {
                    openAdminPanelButton.style.display = 'none';
                    console.log("Admin panel button is hidden for regular user.");
                }
            }

        } catch (e) {
            console.error("Error updating or getting visitor count: ", e);
            if (visitorCounterDisplay && isDeveloper) {
                visitorCounterDisplay.textContent = "Error al cargar el contador.";
                visitorCounterDisplay.style.display = 'block';
            }
        }
    }

    // Llama a la función del contador después de que Firebase Auth esté listo
    if (window.auth) { // Usamos window.auth aquí
        onAuthStateChanged(window.auth, (user) => { // Usamos window.auth aquí
            if (user) {
                updateVisitorCount();
                // Una vez autenticado y con userId disponible, cargar productos
                loadProductsFromFirestore();
                // Intentar poblar si el parámetro está en la URL y es la primera vez
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('populate') === 'true' && !localStorage.getItem('productsPopulated')) {
                    if (isDeveloper) { // Solo permitir población en modo desarrollador
                        populateFirestoreWithYourProducts().then(() => {
                            localStorage.setItem('productsPopulated', 'true'); // Marca como poblado
                            console.log("Products populated from script.js due to URL parameter.");
                        }).catch(e => {
                            console.error("Error populating products from script.js:", e);
                            showCustomModal("Error de Población", `Error al poblar la base de datos: ${e.message}`, 'error');
                        });
                    } else {
                        console.warn("Attempted to populate products with URL parameter, but not in developer mode.");
                    }
                }
            } else {
                console.log("Auth state changed, but user is null. Retrying visitor count update and skipping product load.");
                updateVisitorCount(); // Intentar de nuevo para usuarios anónimos
            }
        });
    } else {
        console.warn("Firebase Auth service not available, skipping onAuthStateChanged listener for visitor count and product load.");
    }

    // --- FIN LÓGICA DEL CONTADOR DE VISITANTES ---


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

    // Toppings disponibles (coincide con los datos del HTML)
    const availableToppings = [
        { name: "Perlas explosivas de frutos rojos", price: 10 },
        { name: "Perlas explosivas de manzana verde", price: 10 },
        { name: "Perlas explosivas de litchi", price: 10 },
        { name: "Jelly arcoiris", price: 10 }
    ];
    console.log("Toppings data loaded.");

    // --- DYNAMIC PRODUCT RENDERING (Ahora usa productsData global) ---
    function renderProducts() {
        console.log("Starting renderProducts function.");
        const waterFrappesGrid = document.getElementById('waterFrappesGrid');
        const milkFrappesGrid = document.getElementById('milkFrappesGrid');
        const hotDrinksGrid = document.getElementById('hotDrinksGrid');
        const chamoyadaPromotionDiv = document.getElementById('chamoyadaPromotion');
        const fresasConCremaPromotionDiv = document.getElementById('fresasConCremaPromotion');

        if (!waterFrappesGrid || !milkFrappesGrid || !hotDrinksGrid) {
            console.error("One or more product grids not found.");
            return;
        }

        // Clear existing content in case of re-rendering
        waterFrappesGrid.innerHTML = '';
        milkFrappesGrid.innerHTML = '';
        hotDrinksGrid.innerHTML = '';
        console.log("Product grids cleared.");

        // Ocultar las promociones estáticas por defecto, se mostrarán si se encuentran en productsData
        if (chamoyadaPromotionDiv) chamoyadaPromotionDiv.style.display = 'none';
        if (fresasConCremaPromotionDiv) fresasConCremaPromotionDiv.style.display = 'none';

        productsData.forEach((product, index) => {
            // Manejo de productos estáticos (promociones)
            if (product.name === "Chamoyada") {
                if (chamoyadaPromotionDiv) {
                    chamoyadaPromotionDiv.style.display = 'block'; // Mostrar la sección de Chamoyada
                    // Actualizar datos si es necesario (ej. si el precio cambia)
                    chamoyadaPromotionDiv.dataset.price = product.price;
                    chamoyadaPromotionDiv.querySelector('.promotion-item-description').textContent = product.description;
                    chamoyadaPromotionDiv.querySelector('.promotion-item-title').textContent = `🌶️🥭 ¡Nueva! Especialidad: ${product.displayName} 🥭🌶️`;
                }
                return;
            }
            if (product.name === "Frappé Fresas con Crema (Temporada)") {
                if (fresasConCremaPromotionDiv) {
                    fresasConCremaPromotionDiv.style.display = 'block'; // Mostrar la sección de Fresas con Crema
                    fresasConCremaPromotionDiv.dataset.price = product.price;
                    fresasConCremaPromotionDiv.querySelector('.promotion-item-description').textContent = product.description;
                    fresasConCremaPromotionDiv.querySelector('.promotion-item-title').textContent = `🍓🥛 Frappé de Temporada: "${product.displayName}" 🍓🥛`;
                }
                return;
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
        setupAddToCartButtons(); // Re-attach listeners for all buttons
    }

    // --- FIN DYNAMIC PRODUCT RENDERING ---

    // Lógica del Carrito de Compras y Selección de Toppings (sin cambios significativos aquí)
    let cart = [];
    let currentDrinkBeingCustomized = null;
    let lastClickedAddButton = null;
    let currentChamoyadaCustomization = null;

    // Close modals when clicking on the overlay or the close button
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.flavor-image-overlay, .topping-selection-overlay, #chamoyadaCustomizationOverlay, #adminPanelOverlay').classList.remove('show');
            console.log("Modal closed by button click.");
        });
    });

    // Close modals with the ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.flavor-image-overlay.show, .topping-selection-overlay.show, #chamoyadaCustomizationOverlay.show, #adminPanelOverlay.show').forEach(modal => {
                modal.classList.remove('show');
                console.log("Modal closed by ESC.");
            });
        }
    });

    // Manejador de clic en el overlay para cerrar modales
    document.querySelectorAll('.flavor-image-overlay, .topping-selection-overlay, #chamoyadaCustomizationOverlay, #adminPanelOverlay').forEach(overlay => {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                overlay.classList.remove('show');
                console.log("Modal closed by overlay click.");
            }
        });
    });

    function openFlavorImageModal(flavorDisplayName, imageUrl) {
        if (flavorImage) {
            flavorImage.src = imageUrl;
            flavorImage.alt = `Imagen de ${flavorDisplayName}`;
            flavorImage.onerror = function() {
                this.src = 'https://placehold.co/300x300/FF6347/FFFFFF?text=Error+al+cargar';
                this.alt = 'Error al cargar la imagen';
                console.error(`Failed to load image for ${flavorDisplayName}: ${imageUrl}`);
            };
        }
        if (flavorImageName) {
            flavorImageName.textContent = flavorDisplayName;
        }
        if (flavorImageOverlay) {
            flavorImageOverlay.classList.add('show');
            flavorImageOverlay.focus();
        }
    }

    function openToppingSelectionModal(drinkName, drinkPrice, clickedButton) {
        console.log(`Opening topping selection modal for: ${drinkName}`);
        currentDrinkBeingCustomized = {
            id: generateUniqueId(),
            name: drinkName,
            basePrice: drinkPrice,
            selectedToppings: []
        };
        lastClickedAddButton = clickedButton;

        if (toppingDrinkNameElement) {
            toppingDrinkNameElement.textContent = drinkName;
        }
        if (toppingsModalGrid) {
            toppingsModalGrid.innerHTML = '';

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
            toppingSelectionOverlay.focus();
        }
    }

    function openChamoyadaCustomizationModal(drinkName, drinkPrice, clickedButton) {
        console.log(`Opening Chamoyada customization modal for: ${drinkName}`);
        lastClickedAddButton = clickedButton;

        currentChamoyadaCustomization = {
            id: generateUniqueId(),
            name: drinkName,
            basePrice: drinkPrice,
            chamoyadaBaseFlavor: null,
            selectedToppings: []
        };

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

        if (chamoyadaToppingsGrid) {
            chamoyadaToppingsGrid.innerHTML = '';
            availableToppings.forEach(topping => {
                const toppingItemDiv = document.createElement('div');
                toppingItemDiv.className = 'topping-modal-item';
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

    function addCustomizedDrinkToCart() {
        if (currentDrinkBeingCustomized) {
            let itemTotalPrice = currentDrinkBeingCustomized.basePrice;
            currentDrinkBeingCustomized.selectedToppings.forEach(t => {
                itemTotalPrice += t.price;
            });
            currentDrinkBeingCustomized.itemTotalPrice = itemTotalPrice;

            cart.push({ ...currentDrinkBeingCustomized });
            currentDrinkBeingCustomized = null;
            if (toppingSelectionOverlay) {
                toppingSelectionOverlay.classList.remove('show');
            }
            updateCartDisplay();
            console.log("Drink added to cart:", cart);

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
    }

    function setupAddToCartButtons() {
        addDrinkToCartButtons = document.querySelectorAll('.add-drink-to-cart-button');
        console.log("Found addDrinkToCartButtons:", addDrinkToCartButtons.length);
        addDrinkToCartButtons.forEach(button => {
            const oldClickListener = button.__clickListener;
            if (oldClickListener) {
                button.removeEventListener('click', oldClickListener);
            }

            const newClickListener = function() {
                const itemElement = this.closest('[data-name][data-price]');
                if (itemElement) {
                    const name = itemElement.dataset.name;
                    const price = parseFloat(itemElement.dataset.price);

                    if (name === "Chamoyada") {
                        openChamoyadaCustomizationModal(name, price, this);
                    } else {
                        openToppingSelectionModal(name, price, this);
                    }
                } else {
                    console.error("Could not find parent item element for add to cart button.", this);
                }
            };
            button.addEventListener('click', newClickListener);
            button.__clickListener = newClickListener;
        });
    }

    if (confirmToppingsButton) {
        confirmToppingsButton.addEventListener('click', addCustomizedDrinkToCart);
    }
    if (noToppingsButton) {
        noToppingsButton.addEventListener('click', function() {
            if (currentDrinkBeingCustomized) {
                currentDrinkBeingCustomized.selectedToppings = [];
                addCustomizedDrinkToCart();
            }
        });
    }
    if (cancelToppingsButton) {
        cancelToppingsButton.addEventListener('click', function() {
            currentDrinkBeingCustomized = null;
            if (toppingSelectionOverlay) {
                toppingSelectionOverlay.classList.remove('show');
            }
            if (lastClickedAddButton) {
                lastClickedAddButton.textContent = 'Añadir 💖';
                lastClickedAddButton.classList.remove('added-feedback');
                lastClickedAddButton.style.background = '';
                lastClickedAddButton = null;
            }
            console.log("Topping selection canceled.");
        });
    }

    if (confirmChamoyadaButton) {
        confirmChamoyadaButton.addEventListener('click', function() {
            if (!currentChamoyadaCustomization.chamoyadaBaseFlavor) {
                showCustomModal("Selección Requerida", "Por favor, selecciona un sabor base para tu Chamoyada.", 'warning');
                return;
            }
            let itemTotalPrice = currentChamoyadaCustomization.basePrice;
            currentChamoyadaCustomization.selectedToppings.forEach(t => {
                itemTotalPrice += t.price;
            });
            currentChamoyadaCustomization.itemTotalPrice = itemTotalPrice;

            cart.push({ ...currentChamoyadaCustomization });
            currentChamoyadaCustomization = null;
            if (chamoyadaCustomizationOverlay) {
                chamoyadaCustomizationOverlay.classList.remove('show');
            }
            updateCartDisplay();
            console.log("Chamoyada added to cart:", cart);

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
    }

    if (cancelChamoyadaButton) {
        cancelChamoyadaButton.addEventListener('click', function() {
            currentChamoyadaCustomization = null;
            if (chamoyadaCustomizationOverlay) {
                chamoyadaCustomizationOverlay.classList.remove('show');
            }
            if (lastClickedAddButton) {
                lastClickedAddButton.textContent = 'Añadir 💖';
                lastClickedAddButton.classList.remove('added-feedback');
                lastClickedAddButton.style.background = '';
                lastClickedAddButton = null;
            }
            console.log("Chamoyada customization canceled.");
        });
    }

    function clearCart() {
        cart = [];
        updateCartDisplay();
        console.log("Cart cleared.");

        addDrinkToCartButtons.forEach(button => {
            button.textContent = 'Añadir 💖';
            button.classList.remove('added-feedback');
            button.style.background = '';
        });
        lastClickedAddButton = null;
    }

    function updateCartDisplay() {
        if (!cartItemsList || !cartTotalElement || !cartItemCountElement) {
            console.error("Cart display elements not found.");
            return;
        }

        cartItemsList.innerHTML = '';
        let total = 0;

        const groupedCart = {};
        cart.forEach(item => {
            let key;
            let displayName = item.displayName || item.name;
            let toppingsText = item.selectedToppings.map(t => t.name).sort().join(', ');

            if (item.name === "Chamoyada" && item.chamoyadaBaseFlavor) {
                displayName = `Chamoyada (${item.chamoyadaBaseFlavor.name})`;
                key = `${item.name}|${item.chamoyadaBaseFlavor.name}|${toppingsText}`;
            } else {
                key = `${item.name}|${toppingsText}`;
            }

            if (groupedCart[key]) {
                groupedCart[key].quantity++;
            } else {
                groupedCart[key] = {
                    name: displayName,
                    originalName: item.name,
                    chamoyadaBaseFlavor: item.chamoyadaBaseFlavor,
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
                    toppingsDetailText = `(+ ${item.selectedToppings.map(t => t.name).join(', ')}`;
                }

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

        const totalItemsInCart = cart.length;
        cartItemCountElement.textContent = totalItemsInCart;

        if (cartIconEmojiElement && totalItemsInCart !== parseInt(cartItemCountElement.dataset.previousCount || 0)) {
            cartIconEmojiElement.classList.remove('pulse-animation');
            void cartIconEmojiElement.offsetWidth;
            cartIconEmojiElement.classList.add('pulse-animation');
        }
        cartItemCountElement.dataset.previousCount = totalItemsInCart;
        console.log("Cart display updated. Total items:", totalItemsInCart);

        cartItemsList.querySelectorAll('.remove-item-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemKeyToRemove = event.target.dataset.key;

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

        cartItemsList.scrollTop = cartItemsList.scrollHeight;
    }

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
                    name: displayItemName,
                    originalName: item.name,
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

        const whatsappNumber = "5217712794633";
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

    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
        console.log("Clear cart button listener attached.");
    }

    if (orderWhatsAppButton) {
        orderWhatsAppButton.addEventListener('click', generateWhatsAppMessage);
        console.log("Order WhatsApp button listener attached.");
    }

    updateCartDisplay();
    console.log("Initial cart display updated.");

    let currentObserver = null;

    function setupIntersectionObserver() {
        console.log("setupIntersectionObserver called. currentObserver before check:", currentObserver);

        if (currentObserver && typeof currentObserver.disconnect === 'function') {
            currentObserver.disconnect();
            console.log("Previous Intersection Observer disconnected.");
        } else if (currentObserver !== null) {
            console.warn("currentObserver exists but is not a valid IntersectionObserver instance for disconnect:", currentObserver);
        }

        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-in-left, .animate-slide-in-right');
        console.log("Found animated elements for new observer:", animatedElements.length);

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        currentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            currentObserver.observe(element);
        });
        console.log("New Intersection Observer setup and observing elements.");
    }

    if (cartSummaryElement) {
        const initialTopOffset = 20;
        const scrollSpeedFactor = 0.1;
        const maxTopOffset = 100;

        function updateCartPosition() {
            const currentScrollY = window.scrollY;
            let newTop = initialTopOffset + (currentScrollY * scrollSpeedFactor);

            newTop = Math.max(initialTopOffset, Math.min(maxTopOffset, newTop));

            cartSummaryElement.style.top = `${newTop}px`;
        }

        window.addEventListener('scroll', throttle(updateCartPosition, 10));
        updateCartPosition();
        console.log("Cart summary scroll logic initialized.");

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

    const fresasConCremaPromotion = document.getElementById('fresasConCremaPromotion');
    if (fresasConCremaPromotion) {
        fresasConCremaPromotion.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                return;
            }
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
    }

    const chamoyadaPromotion = document.getElementById('chamoyadaPromotion');
    if (chamoyadaPromotion) {
        chamoyadaPromotion.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                return;
            }
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
    }

    // --- NUEVO: LÓGICA DEL PANEL DE ADMINISTRACIÓN ---
    // Función para abrir el panel de administración
    if (openAdminPanelButton) {
        openAdminPanelButton.addEventListener('click', function() {
            if (adminPanelOverlay) {
                adminPanelOverlay.classList.add('show');
                adminPanelOverlay.focus();
                renderAdminProductsList(); // Carga la lista de productos al abrir
                resetProductForm(); // Limpia el formulario al abrir
                console.log("Admin panel opened.");
            }
        });
    }

    // Función para cerrar el panel de administración
    if (cancelEditButton) { // Asegura que el botón exista antes de añadir el listener
        cancelEditButton.addEventListener('click', function() {
            resetProductForm();
        });
    }


    // Función para limpiar el formulario de productos
    function resetProductForm() {
        productIdInput.value = '';
        productTypeInput.value = '';
        productNameInput.value = '';
        productDisplayNameInput.value = '';
        productPriceInput.value = '';
        productDescriptionInput.value = '';
        productImageUrlInput.value = '';
        saveProductButton.textContent = 'Guardar Producto ✨';
        console.log("Product form reset.");
    }

    // Función para cargar un producto en el formulario para edición
    function editProduct(product) {
        productIdInput.value = product.id || '';
        productTypeInput.value = product.type || '';
        productNameInput.value = product.name || '';
        productDisplayNameInput.value = product.displayName || '';
        productPriceInput.value = product.price || '';
        productDescriptionInput.value = product.description || '';
        productImageUrlInput.value = product.imageUrl || '';
        saveProductButton.textContent = 'Actualizar Producto ✅';
        console.log("Product loaded for editing:", product.name);
    }

    // Función para guardar (añadir o actualizar) un producto en Firestore
    if (productForm) { // Asegura que el formulario exista
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            if (!window.productsCollectionRef) { // Usar window.productsCollectionRef
                console.error("Firestore products collection reference is not available.");
                showCustomModal("Error de Base de Datos", "No se pudo conectar a la base de datos para guardar el producto. Asegúrate de estar autenticado.", 'error');
                return;
            }

            const id = productIdInput.value;
            const productData = {
                type: productTypeInput.value,
                name: productNameInput.value,
                displayName: productDisplayNameInput.value,
                price: parseFloat(productPriceInput.value),
                description: productDescriptionInput.value,
                imageUrl: productImageUrlInput.value
            };

            try {
                if (id) {
                    // Actualizar producto existente
                    await setDoc(doc(window.db, `artifacts/${window.appId}/users/${window.userId}/products`, id), productData);
                    console.log("Product updated successfully:", productData.name);
                    showCustomModal("Producto Actualizado", `Producto "${productData.displayName}" actualizado con éxito.`, 'success');
                } else {
                    // Añadir nuevo producto
                    await addDoc(window.productsCollectionRef, productData);
                    console.log("New product added successfully:", productData.name);
                    showCustomModal("Producto Añadido", `Producto "${productData.displayName}" añadido con éxito.`, 'success');
                }
                resetProductForm();
            } catch (e) {
                console.error("Error saving product:", e);
                showCustomModal("Error al Guardar", `Error al guardar el producto: ${e.message}`, 'error');
            }
        });
    }

    // Función para eliminar un producto de Firestore
    async function deleteProduct(productId, productName) {
        // Usamos una modal personalizada en lugar de confirm()
        const confirmDelete = await new Promise(resolve => {
            const modalHtml = `
                <div class="custom-modal-overlay show" id="deleteConfirmModal" role="dialog" aria-modal="true" aria-labelledby="deleteConfirmTitle">
                    <div class="custom-modal-content">
                        <h3 id="deleteConfirmTitle" class="modal-title">Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que quieres eliminar el producto "${productName}"?</p>
                        <div class="modal-actions">
                            <button id="confirmDeleteBtn" class="modal-button confirm-button">Sí, Eliminar</button>
                            <button id="cancelDeleteBtn" class="modal-button cancel-button">Cancelar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const modal = document.getElementById('deleteConfirmModal');
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            const cancelBtn = document.getElementById('cancelDeleteBtn');

            confirmBtn.onclick = () => {
                modal.remove();
                resolve(true);
            };
            cancelBtn.onclick = () => {
                modal.remove();
                resolve(false);
            };
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            };
            // Para accesibilidad con teclado
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    resolve(false);
                }
            });
            confirmBtn.focus(); // Enfocar el botón de confirmación por defecto
        });

        if (!confirmDelete) {
            console.log("Eliminación de producto cancelada por el usuario.");
            return;
        }

        if (!window.productsCollectionRef) { // Usar window.productsCollectionRef
            console.error("Firestore products collection reference is not available for deletion.");
            showCustomModal("Error de Base de Datos", "No se pudo conectar a la base de datos para eliminar el producto.", 'error');
            return;
        }

        try {
            await deleteDoc(doc(window.db, `artifacts/${window.appId}/users/${window.userId}/products`, productId));
            console.log("Product deleted successfully:", productName);
            showCustomModal("Producto Eliminado", `Producto "${productName}" eliminado con éxito.`, 'success');
        } catch (e) {
            console.error("Error deleting product:", e);
            showCustomModal("Error al Eliminar", `Error al eliminar el producto: ${e.message}`, 'error');
        }
    }

    // Función para renderizar la lista de productos en el panel de administración
    function renderAdminProductsList() {
        if (!adminProductsList) {
            console.error("Admin products list element not found.");
            return;
        }
        adminProductsList.innerHTML = ''; // Limpiar la lista existente

        if (productsData.length === 0) {
            adminProductsList.innerHTML = '<li class="empty-list-message">No hay productos en la base de datos. ¡Añade uno!</li>';
            return;
        }

        productsData.forEach(product => {
            const li = document.createElement('li');
            li.className = 'admin-product-item';
            li.innerHTML = `
                <span>${product.displayName} (${product.type}) - $${product.price}</span>
                <div class="admin-item-actions">
                    <button class="edit-product-button" data-id="${product.id}" aria-label="Editar ${product.displayName}">✏️ Editar</button>
                    <button class="delete-product-button" data-id="${product.id}" data-name="${product.displayName}" aria-label="Eliminar ${product.displayName}">🗑️ Eliminar</button>
                </div>
            `;
            adminProductsList.appendChild(li);
        });

        // Añadir listeners a los botones de Editar y Eliminar
        adminProductsList.querySelectorAll('.edit-product-button').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productToEdit = productsData.find(p => p.id === productId);
                if (productToEdit) {
                    editProduct(productToEdit);
                }
            });
        });

        adminProductsList.querySelectorAll('.delete-product-button').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productName = this.dataset.name;
                deleteProduct(productId, productName);
            });
        });
    }

    // Función para cargar productos desde Firestore en tiempo real
    function loadProductsFromFirestore() {
        if (!window.productsCollectionRef) { // Usar window.productsCollectionRef
            console.warn("Products collection reference not available, skipping real-time listener.");
            // Si no hay productsCollectionRef (ej. no es desarrollador),
            // productsData se quedará vacía. Renderizamos el menú con lo que tengamos.
            renderProducts();
            return;
        }

        // Usar onSnapshot para escuchar cambios en tiempo real
        onSnapshot(window.productsCollectionRef, (snapshot) => {
            const fetchedProducts = [];
            snapshot.forEach(doc => {
                fetchedProducts.push({ id: doc.id, ...doc.data() });
            });
            productsData = fetchedProducts; // Actualiza el array global de productos
            console.log("Products loaded/updated from Firestore:", productsData);

            // Re-renderiza el menú principal con los datos actualizados
            renderProducts();
            // Si el panel de administración está abierto, también actualiza su lista
            const currentAdminPanelOverlay = document.getElementById('adminPanelOverlay');
            if (currentAdminPanelOverlay && currentAdminPanelOverlay.classList.contains('show')) {
                renderAdminProductsList();
            }
        }, (error) => {
            console.error("Error fetching products from Firestore:", error);
            showCustomModal("Error de Carga", "Error al cargar los productos del menú. Por favor, recarga la página o contacta al soporte.", 'error');
        });
    }

    // --- FIN NUEVO: LÓGICA DEL PANEL DE ADMINISTRACIÓN ---

    // --- INICIO: LÓGICA DE POBLACIÓN DE LA BASE DE DATOS (INTEGRADA) ---
    // PRODUCTOS EXTRAÍDOS DIRECTAMENTE DE TU script.js original
    const yourProductsToPopulate = [
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
            type: "promotion", // Cambiado a "promotion" para que la lógica de renderizado lo detecte.
            name: "Frappé Fresas con Crema (Temporada)",
            displayName: "Fresas con Crema",
            price: 75,
            description: "¡El clásico favorito de la abuela, pero en versión kawaii! Dulzura de fresa natural y cremosidad suave. 🍓🥛💖✨",
            imageUrl: "https://i.imgur.com/m2Fc29F.jpeg"
        },
        // --- NUEVA ESPECIALIDAD: CHAMOYADA ---
        {
            type: "promotion", // Cambiado a "promotion" para que la lógica de renderizado lo detecte.
            name: "Chamoyada",
            displayName: "Chamoyada",
            price: 75,
            description: "El toque picosito que estabas esperando en el menú, disfruta de una boba explosiva y llena de sabor. Escoge el sabor que quieres llevar al siguiente nivel entre las opciones base agua que tenemos.",
            imageUrl: "https://i.imgur.com/39xoolA.jpeg"
        },
        // --- FIN NUEVA ESPECIALIDAD ---
        // Bebidas Calientes (usarán una imagen genérica si no se especifica una individual)
        {
            type: "hot-drink",
            name: "Chocolate Caliente",
            displayName: "Chocolate Caliente",
            price: 60,
            description: "El abrazo más dulce y cálido en una taza 🍫☕💖",
            imageUrl: "https://i.imgur.com/EtT387b.jpeg"
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

    async function populateFirestoreWithYourProducts() {
        console.log("Iniciando script de población. Verificando estado de Firebase y autenticación...");

        if (!window.db || !window.auth || !window.auth.currentUser || !window.appId || !window.productsCollectionRef) {
            console.error("Firebase o la autenticación de usuario no están listos. No se puede poblar la base de datos.");
            showCustomModal("Error de Inicialización", "Firebase no está completamente inicializado o el usuario no está autenticado. Recarga la página y vuelve a intentarlo.", 'error');
            return;
        }

        console.log("Firebase y autenticación listos. User ID:", window.userId, "App ID:", window.appId);
        console.log("Procediendo a poblar la base de datos con los productos predefinidos.");

        let addedCount = 0;
        let errorCount = 0;

        for (const product of yourProductsToPopulate) {
            try {
                // Añade cada producto a la colección. Firestore generará un ID único automáticamente.
                await addDoc(window.productsCollectionRef, product);
                console.log(`Producto añadido: ${product.displayName}`);
                addedCount++;
            } catch (e) {
                console.error(`Error al añadir el producto ${product.displayName}:`, e);
                errorCount++;
            }
        }

        console.log(`Proceso de población de Firestore completado. Se añadieron ${addedCount} productos. Hubo ${errorCount} errores.`);
        showCustomModal("Población Completada", `Base de datos poblada. Se añadieron ${addedCount} productos. Hubo ${errorCount} errores. Por favor, recarga la página para ver los cambios.`, 'success');
    }
    // --- FIN: LÓGICA DE POBLACIÓN DE LA BASE DE DATOS (INTEGRADA) ---

});
