(function() {
    'use strict';

    // Налаштування
    var settings = {
        buttons_style_mode: 'main2' // 'default', 'all', 'main2'
    };

    // Функція для отримання іконки провайдера
    function extractProviderIcon(btn) {
        var iconHtml = '';
        var $btn = $(btn);
        
        // Перевіряємо SVG
        if ($btn.find('svg').length) {
            var icon = $btn.find('svg').clone();
            icon.attr({
                width: 32,
                height: 32,
                style: 'width:32px;height:32px;display:block;'
            });
            iconHtml = icon[0].outerHTML;
        }
        // Перевіряємо зображення
        else if ($btn.find('img').length) {
            var imgSrc = $btn.find('img').attr('src');
            iconHtml = '<img src="' + imgSrc + '" style="width:32px;height:32px;display:block;object-fit:contain;" />';
        }
        // Перевіряємо елементи з класом ico
        else if ($btn.find('.ico').length) {
            var icoElement = $btn.find('.ico').clone();
            icoElement.attr('style', 'width:32px;height:32px;display:block;');
            iconHtml = icoElement[0].outerHTML;
        }
        // Якщо нічого не знайдено, використовуємо першу літеру
        else {
            var providerName = $btn.text().trim();
            if (providerName) {
                var firstLetter = providerName.charAt(0).toUpperCase();
                iconHtml = '<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background-color:#3498db;color:white;border-radius:50%;font-weight:bold;font-size:18px;">' + firstLetter + '</div>';
            }
        }
        
        return iconHtml;
    }

    // Функція для створення меню кнопки "Ще"
    function createMoreButtonMenu(otherButtons) {
        return function() {
            var items = [];
            otherButtons.forEach(function(btn) {
                var btnText = $(btn).text().trim();
                var iconHtml = extractProviderIcon(btn);
                
                items.push({
                    title: btnText,
                    icon: iconHtml,
                    btn: btn
                });
            });
            
            if (Lampa.Select && typeof Lampa.Select.show === 'function') {
                Lampa.Select.show({
                    title: 'Додаткові опції',
                    items: items,
                    onSelect: function(selected) {
                        if (selected && selected.btn) {
                            $(selected.btn).trigger('hover:enter');
                        }
                    }
                });
            }
        };
    }

    // Основна функція для відображення всіх кнопок
    function showAllButtons() {
        // Додаємо стилі для кнопок
        if (!document.getElementById('custom_buttons_style')) {
            var buttonStyle = document.createElement('style');
            buttonStyle.id = 'custom_buttons_style';
            buttonStyle.innerHTML = `
                .full-start-new__buttons, .full-start__buttons {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: 0.7em !important;
                }
                
                .custom-online-btn { 
                    background-color: #2f2f2fd1; 
                    box-shadow: 0 0 13px #00b2ff; 
                    margin: 0.6em; 
                    margin-right: 1.1em; 
                }
                
                .custom-torrent-btn { 
                    background-color: #2f2f2fd1; 
                    box-shadow: 0 0 13px #00ff40; 
                }
                
                .main2-more-btn { 
                    background-color: #2f2f2fd1; 
                    margin-left: 1.4em; 
                    font-weight: bold; 
                    box-shadow: 0 0 13px #e67e22; 
                }
                
                .custom-online-btn.focus,
                .custom-torrent-btn.focus,
                .main2-more-btn.focus {
                    background-color: #3f3f3fd1 !important;
                    transform: scale(1.05);
                    transition: all 0.2s ease;
                }
                
                @media (max-width: 600px) {
                    .custom-online-btn, 
                    .custom-torrent-btn, 
                    .main2-more-btn {
                        margin: 0.4em;
                        font-size: 0.9em;
                    }
                }
            `;
            document.head.appendChild(buttonStyle);
        }

        // Функція для організації кнопок
        function organizeButtons() {
            var targetContainer = $('.full-start-new__buttons, .full-start__buttons, .buttons-container').first();
            if (!targetContainer.length) return;

            var allButtons = [];
            var buttonSelectors = [
                '.full-start__button',
                '.button',
                '.buttons--container .full-start__button',
                '.buttons-container .button'
            ];

            buttonSelectors.forEach(function(selector) {
                targetContainer.find(selector).each(function() {
                    if ($(this).is(':visible')) {
                        allButtons.push(this);
                    }
                });
            });

            if (allButtons.length === 0) return;

            // Режим "main2" - кастомні кнопки
            if (settings.buttons_style_mode === 'main2') {
                var onlineButtons = [];
                var torrentButtons = [];
                var otherButtons = [];
                
                // Сортуємо кнопки по категоріях
                $(allButtons).each(function() {
                    var $btn = $(this);
                    var btnClass = $btn.attr('class') || '';
                    var btnText = $btn.text().trim().toLowerCase();
                    
                    if (btnClass.includes('online') || btnClass.includes('view--online') || btnText.includes('онлайн')) {
                        onlineButtons.push($btn);
                    } else if (btnClass.includes('torrent') || btnClass.includes('view--torrent') || btnText.includes('торрент')) {
                        torrentButtons.push($btn);
                    } else {
                        otherButtons.push($btn);
                    }
                });

                // Ховаємо оригінальні кнопки
                allButtons.forEach(function(btn) {
                    $(btn).hide();
                });

                // Видаляємо старі кастомні кнопки
                targetContainer.find('.custom-online-btn, .custom-torrent-btn, .main2-more-btn').remove();

                // Створюємо кастомні кнопки
                if (onlineButtons.length > 0) {
                    var onlineBtn = $('<div class="full-start__button selector custom-online-btn" tabindex="0">Онлайн</div>')
                        .on('hover:focus', function(){ $(this).addClass('focus'); })
                        .on('hover:blur', function(){ $(this).removeClass('focus'); })
                        .on('hover:enter', function() {
                            if (onlineButtons.length === 1) {
                                onlineButtons[0].trigger('hover:enter');
                            } else if (onlineButtons.length > 1) {
                                // Показуємо перший доступний онлайн-провайдер
                                onlineButtons[0].trigger('hover:enter');
                            }
                        });
                    targetContainer.prepend(onlineBtn);
                }

                if (torrentButtons.length > 0) {
                    var torrentBtn = $('<div class="full-start__button selector custom-torrent-btn" tabindex="0">Торрент</div>')
                        .on('hover:focus', function(){ $(this).addClass('focus'); })
                        .on('hover:blur', function(){ $(this).removeClass('focus'); })
                        .on('hover:enter', function() {
                            if (torrentButtons.length > 0) {
                                torrentButtons[0].trigger('hover:enter');
                            }
                        });
                    targetContainer.prepend(torrentBtn);
                }

                if (otherButtons.length > 0) {
                    var moreBtn = $('<div class="full-start__button selector main2-more-btn" tabindex="0">⋯</div>')
                        .on('hover:focus', function(){ $(this).addClass('focus'); })
                        .on('hover:blur', function(){ $(this).removeClass('focus'); })
                        .on('hover:enter', createMoreButtonMenu(otherButtons));
                    targetContainer.prepend(moreBtn);
                }
            }
            // Режим "all" - показуємо всі кнопки
            else if (settings.buttons_style_mode === 'all') {
                targetContainer.css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.7em'
                });
                
                // Просто показуємо всі кнопки
                allButtons.forEach(function(btn) {
                    $(btn).show();
                });
            }
        }

        // Запускаємо організацію кнопок
        organizeButtons();

        // Спостерігач за змінами DOM
        var observer = new MutationObserver(function(mutations) {
            var shouldReorganize = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    var nodes = Array.from(mutation.addedNodes);
                    nodes.forEach(function(node) {
                        if (node.nodeType === 1 && (
                            node.classList.contains('full-start__button') ||
                            node.classList.contains('button') ||
                            node.querySelector('.full-start__button') ||
                            node.querySelector('.button')
                        )) {
                            shouldReorganize = true;
                        }
                    });
                }
            });
            
            if (shouldReorganize) {
                setTimeout(organizeButtons, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Слухач для повноекранного режиму
        if (Lampa.Listener) {
            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') {
                    setTimeout(organizeButtons, 300);
                }
            });
        }
    }

    // Ініціалізація
    function init() {
        // Чекаємо, поки Lampa буде готова
        if (window.Lampa && window.Lampa.App) {
            setTimeout(showAllButtons, 1000);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(showAllButtons, 2000);
            });
        }
        
        // Альтернативний спосіб ініціалізації
        var checkLampa = setInterval(function() {
            if (window.Lampa) {
                clearInterval(checkLampa);
                setTimeout(showAllButtons, 1000);
            }
        }, 500);
    }

    // Запускаємо плагін
    init();

})();