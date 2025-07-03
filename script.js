document.addEventListener('DOMContentLoaded', function() {
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
        }
    }
    setInitialLogoTheme();

    // Logic for the flavor image viewer
    const flavorImageOverlay = document.getElementById('flavorImageOverlay');
    const flavorImage = document.getElementById('flavorImage');
    const flavorImageName = document.getElementById('flavorImageName');
    const closeModalButtons = document.querySelectorAll('.close-modal-button');

    // Define all flavor images.
    const genericHotDrinksImage = "https://i.imgur.com/EtT387b.jpeg";

    const flavorImages = {
        "Litchi": "https://i.imgur.com/Pu7yFxo.jpeg",
        "Fresa": "https://i.imgur.com/UMxtB2o.jpeg",
        "Blueberry": "https://i.imgur.com/XMfisGw.jpeg",
        "Mango": "https://i.imgur.com/VGEGSkT.jpeg",
        "Piña colada": "https://i.imgur.com/U6LUnZt.jpeg",
        "Maracuyá": "https://i.imgur.com/hrULvVp.jpeg",
        "Guanábana": "https://placehold.co/300x300/E0F2FE/555555?text=Guanabana",
        "Sandía": "https://i.imgur.com/FwsLeZz.jpeg",
        "Chocolate Mexicano": "https://placehold.co/300x300/8B4513/FFFFFF?text=Choco+Mexicano",
        "Taro": "https://i.imgur.com/epvVrkT.jpeg",
        "Mazapán": "https://i.imgur.com/jrELu9J.jpeg",
        "Chai": "https://i.imgur.com/wRIJ7AO.jpeg",
        "Mocha": "https://i.imgur.com/Pdp3Q4O.jpeg",
        "Cookies & Cream": "https://i.imgur.com/0e402nf.jpeg",
        "Crema Irlandesa": "https://i.imgur.com/fJocyJw.jpeg",
        "Matcha": "https://i.imgur.com/6QIRLrZ.jpeg",
        "Chocolate Caliente": genericHotDrinksImage,
        "Taro Caliente": genericHotDrinksImage,
        "Mazapán Caliente": genericHotDrinksImage,
        "Chai Caliente": genericHotDrinksImage,
        "Mocha Caliente": genericHotDrinksImage,
        "Cookies & Cream Caliente": genericHotDrinksImage,
        "Crema Irlandesa Caliente": genericHotDrinksImage,
        "Matcha Caliente": genericHotDrinksImage,
        "Frappé Fresas con Crema (Temporada)": "https://i.imgur.com/m2Fc29F.jpeg"
    };

    // Event handler to open the image modal
    function openFlavorImageModal(flavorName) {
        const imageUrl = flavorImages[flavorName] || 'https://placehold.co/300x300/CCCCCC/FFF?text=Imagen+no+disponible';
        if (flavorImage) {
            flavorImage.src = imageUrl;
            flavorImage.alt = `Imagen de ${flavorName}`; // Update alt text
            flavorImage.onerror = function() {
                this.src = 'https://placehold.co/300x300/FF6347/FFFFFF?text=Error+al+cargar';
                this.alt = 'Error al cargar la imagen';
            };
        }
        if (flavorImageName) {
            flavorImageName.textContent = flavorName;
        }
        if (flavorImageOverlay) {
            flavorImageOverlay.classList.add('show');
            flavorImageOverlay.focus(); // Focus the overlay for accessibility
        }
    }

    // Event listeners for flavor items (open image modal)
    document.querySelectorAll('.flavor-item').forEach(item => {
        item.addEventListener('click', function(event) {
            // Prevent the button click from activating the image overlay
            if (event.target.tagName === 'BUTTON') {
                return;
            }
            const flavorName = this.querySelector('.flavor-name').textContent;
            openFlavorImageModal(flavorName);
        });
        // Allow activation with Enter/Space for accessibility
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent scroll if it's Space
                const flavorName = this.querySelector('.flavor-name').textContent;
                openFlavorImageModal(flavorName);
            }
        });
    });

    // Event listener for the strawberry and cream promotion (open image modal)
    const fresasConCremaPromotion = document.getElementById('fresasConCremaPromotion');
    if (fresasConCremaPromotion) {
        fresasConCremaPromotion.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                return;
            }
            openFlavorImageModal("Frappé Fresas con Crema (Temporada)");
        });
        fresasConCremaPromotion.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openFlavorImageModal("Frappé Fresas con Crema (Temporada)");
            }
        });
    }

    // Close modals when clicking on the overlay or the close button
    if (flavorImageOverlay) {
        flavorImageOverlay.addEventListener('click', function(event) {
            if (event.target === flavorImageOverlay) { // Only close if the background is clicked
                flavorImageOverlay.classList.remove('show');
            }
        });
    }
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.flavor-image-overlay, .topping-selection-overlay').classList.remove('show');
        });
    });
    // Close modals with the ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (flavorImageOverlay && flavorImageOverlay.classList.contains('show')) {
                flavorImageOverlay.classList.remove('show');
            }
            if (toppingSelectionOverlay && toppingSelectionOverlay.classList.contains('show')) {
                toppingSelectionOverlay.classList.remove('show');
            }
        }
    });

    // Shopping Cart and Topping Selection Logic
    let cart = []; // Stores selected items: { id, name, basePrice, selectedToppings: [{ name, price }] }
    let currentDrinkBeingCustomized = null; // Stores the drink object while toppings are being selected
    let lastClickedAddButton = null; // Reference to the button that was clicked

    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalElement = document.getElementById('cartTotal');
    const clearCartButton = document.getElementById('clearCartButton');
    const orderWhatsAppButton = document.getElementById('orderWhatsAppButton');
    const addDrinkToCartButtons = document.querySelectorAll('.add-drink-to-cart-button');

    const cartItemCountElement = document.getElementById('cartItemCount');
    const cartIconEmojiElement = document.getElementById('cartIconEmoji');
    const cartSummaryElement = document.getElementById('cartSummary');
    const shoppingCartSection = document.getElementById('shoppingCartSection');

    // Topping Modal Elements
    const toppingSelectionOverlay = document.getElementById('toppingSelectionOverlay');
    const toppingDrinkNameElement = document.getElementById('toppingDrinkName');
    const toppingsModalGrid = document.getElementById('toppingsModalGrid');
    const confirmToppingsButton = document.getElementById('confirmToppingsButton');
    const noToppingsButton = document.getElementById('noToppingsButton');
    const cancelToppingsButton = document.getElementById('cancelToppingsButton');

    // Available toppings (matches HTML data)
    const availableToppings = [
        { name: "Perlas explosivas de frutos rojos", price: 10 },
        { name: "Perlas explosivas de manzana verde", price: 10 },
        { name: "Perlas explosivas de litchi", price: 10 },
        { name: "Jelly arcoiris", price: 10 }
    ];

    // Function to open the topping selection modal
    function openToppingSelectionModal(drinkName, drinkPrice, clickedButton) {
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
                });
            });
        }

        if (toppingSelectionOverlay) {
            toppingSelectionOverlay.classList.add('show');
            toppingSelectionOverlay.focus(); // Focus the overlay for accessibility
        }
    }

    // Function to add the customized drink to the main cart
    function addCustomizedDrinkToCart() {
        if (currentDrinkBeingCustomized) {
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
    }

    // Event Listeners for "Add to Cart" buttons
    addDrinkToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('[data-name][data-price]');
            if (itemElement) {
                const name = itemElement.dataset.name;
                const price = parseFloat(itemElement.dataset.price);
                openToppingSelectionModal(name, price, this); // Pass the clicked button
            }
        });
    });

    // Event Listeners for Topping Modal buttons
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
        });
    }

    // Function to clear the entire cart
    function clearCart() {
        cart = []; // Empty the cart array
        updateCartDisplay(); // Update the UI

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
        if (!cartItemsList || !cartTotalElement || !cartItemCountElement) {
            console.error("Cart elements not found.");
            return;
        }
        cartItemsList.innerHTML = ''; // Clear current display
        let total = 0;

        // Group identical items for display
        const groupedCart = {};
        cart.forEach(item => {
            const toppingNames = item.selectedToppings.map(t => t.name).sort().join(', ');
            const key = `${item.name}|${toppingNames}`;

            if (groupedCart[key]) {
                groupedCart[key].quantity++;
            } else {
                groupedCart[key] = {
                    name: item.name,
                    selectedToppings: item.selectedToppings,
                    quantity: 1,
                    totalItemPrice: item.basePrice + item.selectedToppings.reduce((sum, t) => sum + t.price, 0),
                    originalIds: [item.id] // Store the original ID to allow removing one instance
                };
            }
        });

        const sortedGroupedItems = Object.values(groupedCart).sort((a, b) => a.name.localeCompare(b.name));

        if (sortedGroupedItems.length === 0) {
            cartItemsList.innerHTML = '<li class="empty-cart-message">¡Tu carrito está vacío, añade algo delicioso! 💖</li>';
            clearCartButton.disabled = true;
            orderWhatsAppButton.disabled = true;
        } else {
            clearCartButton.disabled = false;
            orderWhatsAppButton.disabled = false;
            sortedGroupedItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';

                let toppingsText = '';
                if (item.selectedToppings && item.selectedToppings.length > 0) {
                    toppingsText = `(+ ${item.selectedToppings.map(t => t.name).join(', ')})`;
                }

                li.innerHTML = `
                    <div class="item-main-info">
                        <span class="item-quantity">${item.quantity}x</span>
                        <span class="item-name">${item.name}</span>
                    </div>
                    <div class="item-details">
                        <span class="item-toppings">${toppingsText}</span>
                        <span class="item-price">$${(item.totalItemPrice * item.quantity).toFixed(2)}</span>
                        <button class="remove-item-button" data-key="${item.name}|${item.selectedToppings.map(t => t.name).sort().join(', ')}" aria-label="Quitar un ${item.name} del carrito">➖</button>
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

        // Re-attach event listeners for dynamically created remove buttons
        cartItemsList.querySelectorAll('.remove-item-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemKeyToRemove = event.target.dataset.key;

                const [itemName, toppingNamesString] = itemKeyToRemove.split('|');
                const toppingsToMatch = toppingNamesString.split(', ').filter(Boolean);

                const indexToRemove = cart.findIndex(cartItem =>
                    cartItem.name === itemName &&
                    cartItem.selectedToppings.length === toppingsToMatch.length &&
                    cartItem.selectedToppings.every(t => toppingsToMatch.includes(t.name)) &&
                    toppingsToMatch.every(tName => cartItem.selectedToppings.some(st => st.name === tName))
                );

                if (indexToRemove > -1) {
                    cart.splice(indexToRemove, 1);
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
            return;
        }

        let message = "¡Hola! Me gustaría hacer el siguiente pedido de Capibobba:\n\n";
        let finalTotal = 0;

        const groupedForWhatsApp = {};
        cart.forEach(item => {
            const toppingNames = item.selectedToppings.map(t => t.name).sort().join(', ');
            const key = `${item.name}|${toppingNames}`;

            if (groupedForWhatsApp[key]) {
                groupedForWhatsApp[key].quantity++;
                groupedForWhatsApp[key].totalPricePerItem += item.basePrice + item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
            } else {
                groupedForWhatsApp[key] = {
                    name: item.name,
                    basePrice: item.basePrice,
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
                    orderWhatsAppButton.textContent = "Order by WhatsApp 📱";
                    orderWhatsAppButton.style.background = "linear-gradient(45deg, #25D366, #128C7E)";
                }, 4000);
            }
        }
    }

    // Attach Event Listeners
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    if (orderWhatsAppButton) {
        orderWhatsAppButton.addEventListener('click', generateWhatsAppMessage);
    }

    // Initial update of the cart display when the page loads
    updateCartDisplay();

    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-in-left, .animate-slide-in-right');

    const observerOptions = {
        root: null, /* viewport */
        rootMargin: '0px',
        threshold: 0.1 /* 10% of the element visible to activate */
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Logic for the cart to follow the scroll
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

        // Click event for the cart icon
        cartSummaryElement.addEventListener('click', function() {
            if (shoppingCartSection) {
                shoppingCartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});
