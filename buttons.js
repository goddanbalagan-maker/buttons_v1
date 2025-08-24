(function() {
    'use strict';

    console.log('Custom image buttons plugin loaded');

    // === ЗМІНІТЬ ЦІ ПОСИЛАННЯ НА СВОЇ ===
    const buttonImages = {
        online: 'https://i.ibb.co/ваш-код-1/online.png',    // Замініть на своє посилання
        torrent: 'https://i.ibb.co/ваш-код-2/torrent.png',  // Замініть на своє посилання
        trailer: 'https://i.ibb.co/ваш-код-3/trailer.png'   // Замініть на своє посилання
    };
    // === КІНЕЦЬ НАЛАШТУВАНЬ ===

    // Резервні картинки (якщо ваші не завантажаться)
    const fallbackImages = {
        online: 'https://cdn-icons-png.flaticon.com/512/2991/2991111.png',
        torrent: 'https://cdn-icons-png.flaticon.com/512/3515/3515272.png',
        trailer: 'https://cdn-icons-png.flaticon.com/512/724/724927.png'
    };

    function createCustomButtons() {
        var checkContainer = setInterval(function() {
            var buttonsContainer = document.querySelector('.full-start-new__buttons, .full-start__buttons, .buttons-container');
            
            if (buttonsContainer) {
                clearInterval(checkContainer);
                
                // Зберігаємо оригінальні кнопки перед очищенням контейнера
                const originalButtons = Array.from(buttonsContainer.querySelectorAll('a, button, div[class*="button"]'));
                
                // Застосовуємо кастомні кнопки тільки якщо ще не застосовані
                if (!buttonsContainer.querySelector('.image-button')) {
                    applyCustomButtons(buttonsContainer, originalButtons);
                }
            }
        }, 1000);
    }

    function applyCustomButtons(container, originalButtons) {
        console.log('Applying custom image buttons to container:', container);
        
        // Зберігаємо оригінальні кнопки для подальшого використання
        const buttonMap = {
            online: originalButtons.find(btn => 
                btn.textContent.toLowerCase().includes('онлайн') || 
                btn.textContent.toLowerCase().includes('online') ||
                btn.className.toLowerCase().includes('online') ||
                (btn.href && btn.href.toLowerCase().includes('online'))
            ),
            torrent: originalButtons.find(btn => 
                btn.textContent.toLowerCase().includes('торрент') || 
                btn.textContent.toLowerCase().includes('torrent') ||
                btn.className.toLowerCase().includes('torrent') ||
                (btn.href && btn.href.toLowerCase().includes('torrent'))
            ),
            trailer: originalButtons.find(btn => 
                btn.textContent.toLowerCase().includes('трейлер') || 
                btn.textContent.toLowerCase().includes('trailer') ||
                btn.className.toLowerCase().includes('trailer') ||
                (btn.href && btn.href.toLowerCase().includes('trailer'))
            )
        };

        console.log('Found original buttons:', buttonMap);

        // Очищаємо контейнер
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Додаємо стилі
        if (!document.getElementById('custom-image-buttons-styles')) {
            var style = document.createElement('style');
            style.id = 'custom-image-buttons-styles';
            style.textContent = `
                .image-button {
                    background: linear-gradient(45deg, #2c3e50, #34495e) !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 15px !important;
                    margin: 8px !important;
                    cursor: pointer !important;
                    width: 80px !important;
                    height: 80px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.3s ease !important;
                    position: relative !important;
                }

                .image-button:hover,
                .image-button.focus {
                    background: linear-gradient(45deg, #3498db, #2980b9) !important;
                    transform: translateY(-3px) scale(1.1) !important;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.4) !important;
                }

                .image-button img {
                    width: 50px !important;
                    height: 50px !important;
                    object-fit: contain !important;
                    transition: transform 0.3s ease !important;
                }

                .image-button:hover img,
                .image-button.focus img {
                    transform: scale(1.2) !important;
                }

                .image-button.online {
                    background: linear-gradient(45deg, #27ae60, #2ecc71) !important;
                }

                .image-button.torrent {
                    background: linear-gradient(45deg, #e74c3c, #c0392b) !important;
                }

                .image-button.trailer {
                    background: linear-gradient(45deg, #f39c12, #e67e22) !important;
                }

                .image-button .tooltip {
                    position: absolute !important;
                    bottom: -30px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    background: rgba(0,0,0,0.8) !important;
                    color: white !important;
                    padding: 5px 10px !important;
                    border-radius: 4px !important;
                    font-size: 12px !important;
                    white-space: nowrap !important;
                    opacity: 0 !important;
                    transition: opacity 0.3s ease !important;
                    pointer-events: none !important;
                }

                .image-button:hover .tooltip {
                    opacity: 1 !important;
                }

                @media (max-width: 768px) {
                    .image-button {
                        width: 60px !important;
                        height: 60px !important;
                        padding: 10px !important;
                        margin: 5px !important;
                    }

                    .image-button img {
                        width: 40px !important;
                        height: 40px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Створюємо кнопки з картинками
        const buttons = [
            { type: 'online', tooltip: 'Онлайн перегляд', originalButton: buttonMap.online },
            { type: 'torrent', tooltip: 'Торренти', originalButton: buttonMap.torrent },
            { type: 'trailer', tooltip: 'Трейлери', originalButton: buttonMap.trailer }
        ];

        buttons.forEach(function(buttonData) {
            var button = document.createElement('div');
            button.className = 'image-button ' + buttonData.type;
            button.setAttribute('tabindex', '0');

            // Створюємо картинку
            var img = document.createElement('img');
            img.src = buttonImages[buttonData.type];
            img.alt = buttonData.tooltip;
            img.onerror = function() {
                console.log('Failed to load image for', buttonData.type, 'using fallback');
                this.src = fallbackImages[buttonData.type];
            };

            // Додаємо підказку
            var tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = buttonData.tooltip;

            button.appendChild(img);
            button.appendChild(tooltip);

            button.addEventListener('click', function() {
                handleButtonClick(buttonData.originalButton, buttonData.type);
            });

            button.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleButtonClick(buttonData.originalButton, buttonData.type);
                }
            });

            container.appendChild(button);
        });

        console.log('Custom image buttons created successfully');
    }

    function handleButtonClick(originalButton, buttonType) {
        console.log('Image button clicked:', buttonType);
        console.log('Original button:', originalButton);
        
        if (originalButton) {
            try {
                originalButton.click();
                console.log('Successfully clicked original button');
            } catch (e) {
                console.error('Error clicking button:', e);
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                originalButton.dispatchEvent(event);
            }
        } else {
            console.warn('No original button found for:', buttonType);
            if (window.Lampa && window.Lampa.Noty) {
                Lampa.Noty.show('Функція ' + buttonType + ' не доступна');
            }
        }
    }

    function initPlugin() {
        console.log('Initializing custom image buttons plugin');
        
        createCustomButtons();
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    const hasButtonsContainer = Array.from(mutation.addedNodes).some(function(node) {
                        return node.nodeType === 1 && 
                              (node.classList.contains('full-start-new__buttons') ||
                               node.classList.contains('full-start__buttons') ||
                               node.classList.contains('buttons-container') ||
                               node.querySelector('.full-start-new__buttons') ||
                               node.querySelector('.full-start__buttons') ||
                               node.querySelector('.buttons-container'));
                    });
                    
                    if (hasButtonsContainer) {
                        setTimeout(createCustomButtons, 100);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (window.Lampa && window.Lampa.Listener) {
            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') {
                    setTimeout(createCustomButtons, 500);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        initPlugin();
    }

})();
