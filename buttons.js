(function() {
    'use strict';

    console.log('Custom buttons plugin loaded');

    // Функція для створення кастомних кнопок
    function createCustomButtons() {
        // Чекаємо, поки з'явиться контейнер для кнопок
        var checkContainer = setInterval(function() {
            var buttonsContainer = document.querySelector('.full-start-new__buttons, .full-start__buttons, .buttons-container');
            
            if (buttonsContainer) {
                clearInterval(checkContainer);
                applyCustomButtons(buttonsContainer);
            }
        }, 1000);
    }

    function applyCustomButtons(container) {
        console.log('Applying custom buttons to container:', container);
        
        // Очищаємо контейнер від старих кнопок
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Додаємо стилі
        if (!document.getElementById('custom-buttons-styles')) {
            var style = document.createElement('style');
            style.id = 'custom-buttons-styles';
            style.textContent = `
                .custom-button {
                    background: linear-gradient(45deg, #2c3e50, #34495e) !important;
                    border: none !important;
                    border-radius: 8px !important;
                    padding: 12px 20px !important;
                    margin: 5px !important;
                    font-size: 16px !important;
                    font-weight: bold !important;
                    color: white !important;
                    cursor: pointer !important;
                    min-width: 120px !important;
                    text-align: center !important;
                    transition: all 0.3s ease !important;
                }

                .custom-button:hover,
                .custom-button.focus {
                    background: linear-gradient(45deg, #3498db, #2980b9) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
                }

                .custom-button.online {
                    background: linear-gradient(45deg, #27ae60, #2ecc71) !important;
                }

                .custom-button.torrent {
                    background: linear-gradient(45deg, #e74c3c, #c0392b) !important;
                }

                .custom-button.trailer {
                    background: linear-gradient(45deg, #f39c12, #e67e22) !important;
                }

                .custom-button.online:hover,
                .custom-button.online.focus {
                    background: linear-gradient(45deg, #2ecc71, #27ae60) !important;
                }

                .custom-button.torrent:hover,
                .custom-button.torrent.focus {
                    background: linear-gradient(45deg, #c0392b, #e74c3c) !important;
                }

                .custom-button.trailer:hover,
                .custom-button.trailer.focus {
                    background: linear-gradient(45deg, #e67e22, #f39c12) !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Створюємо кнопки
        var buttons = [
            { text: 'Онлайн', className: 'custom-button online', type: 'online' },
            { text: 'Торренти', className: 'custom-button torrent', type: 'torrent' },
            { text: 'Трейлери', className: 'custom-button trailer', type: 'trailer' }
        ];

        buttons.forEach(function(buttonData) {
            var button = document.createElement('div');
            button.className = buttonData.className;
            button.textContent = buttonData.text;
            button.setAttribute('tabindex', '0');
            
            // Додаємо обробники подій
            button.addEventListener('click', function() {
                handleButtonClick(buttonData.type);
            });

            // Для підтримки пульта
            button.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleButtonClick(buttonData.type);
                }
            });

            container.appendChild(button);
        });

        console.log('Custom buttons created successfully');
    }

    function handleButtonClick(buttonType) {
        console.log('Button clicked:', buttonType);
        
        // Тут можна додати логіку для кожного типу кнопки
        switch(buttonType) {
            case 'online':
                // Логіка для онлайн перегляду
                findAndClickOriginalButton('online');
                break;
            case 'torrent':
                // Логіка для торрентів
                findAndClickOriginalButton('torrent');
                break;
            case 'trailer':
                // Логіка для трейлерів
                findAndClickOriginalButton('trailer');
                break;
        }
    }

    function findAndClickOriginalButton(type) {
        // Шукаємо оригінальні кнопки за текстом або класом
        var selectors = {
            'online': ['.full-start__button', '.button', '[class*="online"]', '[class*="view--online"]'],
            'torrent': ['.full-start__button', '.button', '[class*="torrent"]', '[class*="view--torrent"]'],
            'trailer': ['.full-start__button', '.button', '[class*="trailer"]']
        };

        var buttons = document.querySelectorAll(selectors[type].join(','));
        
        if (buttons.length > 0) {
            // Клікаємо по першій знайденій кнопці
            var originalButton = buttons[0];
            if (typeof originalButton.click === 'function') {
                originalButton.click();
            } else if (typeof originalButton.dispatchEvent === 'function') {
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                originalButton.dispatchEvent(clickEvent);
            }
            console.log('Clicked original', type, 'button');
        } else {
            console.log('No original', type, 'button found');
            // Можна показати сповіщення
            if (window.Lampa && window.Lampa.Noty) {
                Lampa.Noty.show('Функція ' + type + ' не доступна');
            }
        }
    }

    // Запускаємо плагін
    function initPlugin() {
        console.log('Initializing custom buttons plugin');
        
        // Запускаємо одразу
        createCustomButtons();
        
        // Також слухаємо зміни DOM на випадок динамічного завантаження
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    var hasButtonsContainer = Array.from(mutation.addedNodes).some(function(node) {
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

        // Слухаємо події Lampa
        if (window.Lampa && window.Lampa.Listener) {
            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') {
                    setTimeout(createCustomButtons, 500);
                }
            });
        }
    }

    // Запускаємо після завантаження сторінки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        initPlugin();
    }

})();
