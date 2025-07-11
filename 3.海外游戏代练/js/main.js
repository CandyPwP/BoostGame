/**
 * GameBoostPro 游戏代练服务网站
 * 主要JavaScript功能实现
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有组件
    initGameSwitcher();
    initLanguageSwitcher();
    initCarousels();
    initCopyButtons(); // 保留但不会使用，因为我们不再需要复制Discord ID
    initQrCodeZoom(); // 初始化二维码点击放大功能
});

/**
 * 游戏切换功能
 */
function initGameSwitcher() {
    const gameButtons = document.querySelectorAll('.game-btn');
    const gameContents = document.querySelectorAll('.game-content');

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game;
            
            // 更新按钮状态
            gameButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            gameContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${game}-content`) {
                    content.classList.add('active');
                    
                    // 重置该游戏的轮播图
                    const carousel = content.querySelector('.carousel');
                    if (carousel) {
                        resetCarousel(carousel);
                    }
                }
            });
        });
    });
}

/**
 * 语言切换功能
 */
function initLanguageSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLang = document.getElementById('current-lang');
    const langOptions = document.querySelectorAll('.lang-option');

    // 显示/隐藏语言下拉菜单
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    // 点击其他地方关闭语言下拉菜单
    document.addEventListener('click', (e) => {
        if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
    });

    // 语言切换功能
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            currentLang.textContent = option.textContent;
            langDropdown.classList.remove('active');
            
            // 更新页面语言
            changeLang(lang);
        });
    });
}

/**
 * 轮播图功能初始化
 */
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.parentElement.querySelectorAll('.dot');
        const prevBtn = carousel.parentElement.querySelector('.prev');
        const nextBtn = carousel.parentElement.querySelector('.next');
        
        // 初始化轮播图
        let currentIndex = 0;
        updateCarousel();
        
        // 自动轮播
        let interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
        
        // 更新轮播图状态
        function updateCarousel() {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });
            
            if (dots && dots.length > 0) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        }
        
        // 重置轮播图计时器
        carousel.parentElement.addEventListener('mouseenter', () => {
            clearInterval(interval);
        });
        
        carousel.parentElement.addEventListener('mouseleave', () => {
            clearInterval(interval);
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }, 5000);
        });
        
        // 上一张/下一张按钮
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }
        
        // 点击指示点
        if (dots && dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
            });
        }
    });
}

/**
 * 重置特定轮播图
 */
function resetCarousel(carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === 0);
    });
    
    if (dots && dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === 0);
        });
    }
}

/**
 * 复制按钮功能 (保留但不再使用)
 */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.dataset.copy;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    const originalText = button.textContent;
                    button.textContent = '已复制!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                });
        });
    });
}

/**
 * 语言切换功能
 */
function changeLang(lang) {
    // 获取当前激活的游戏
    const activeGame = document.querySelector('.game-btn.active').dataset.game;
    
    // 翻译数据
    const translations = {
        'zh-CN': {
            wow: {
                title: '魔兽世界代练服务',
                slogan: '每小时仅需$10，100%手工操作，全程直播代练',
                services: [
                    {
                        title: '练级服务',
                        desc: '从1级到70级快速练级，包含装备升级，技能培训和专业技能提升。我们的专业团队将帮助您在最短时间内达到满级。',
                        price: '$10/小时'
                    },
                    {
                        title: '副本攻略',
                        desc: '专业团队带您攻克各种难度副本，获取稀有装备和成就。无论是经典副本还是最新团队副本，我们都能助您一臂之力。',
                        price: '$10/小时'
                    },
                    {
                        title: '个性化服务',
                        desc: '根据您的需求定制服务计划，包括PVP排位、稀有坐骑收集、成就点数冲刺等。告诉我们您的目标，我们来实现它。',
                        price: '$10/小时'
                    }
                ],
                carousel: [
                    {caption: '专业魔兽世界代练'},
                    {caption: '全职业副本攻略'},
                    {caption: '定制化练级方案'}
                ],
                contact: {
                    title: '联系我们',
                    telegram: 'Telegram',
                    wechat: '微信',
                    wechat_scan: '扫码添加客服'
                }
            },
            diablo4: {
                title: '暗黑破坏神4代练服务',
                slogan: '每小时仅需$10，100%手工操作，全程直播代练',
                services: [
                    {
                        title: '角色升级',
                        desc: '快速将您的角色升级至满级，获取游戏后期所需的技能点和属性点。我们的专业玩家将帮助您跳过枯燥的升级阶段。',
                        price: '$10/小时'
                    },
                    {
                        title: '装备收集',
                        desc: '帮助您获取游戏中最强大的装备和符文。我们会针对您的职业搭配最佳装备组合，提升角色战斗力。',
                        price: '$10/小时'
                    },
                    {
                        title: '地下城挑战',
                        desc: '攻克高难度地下城，获取稀有奖励和成就。我们的团队拥有丰富的暗黑破坏神4游戏经验，能够应对各种挑战。',
                        price: '$10/小时'
                    }
                ],
                carousel: [
                    {caption: '暗黑破坏神4专业代练'},
                    {caption: '高难度地下城通关'},
                    {caption: '顶级装备收集服务'}
                ],
                contact: {
                    title: '联系我们',
                    telegram: 'Telegram',
                    wechat: '微信',
                    wechat_scan: '扫码添加客服'
                }
            },
            lol: {
                title: '英雄联盟代练服务',
                slogan: '每小时仅需$10，100%手工操作，全程直播代练',
                services: [
                    {
                        title: '排位代练',
                        desc: '从铁到王者，我们的职业选手可以帮您提升段位。根据您的目标段位和当前分数，我们提供最高效的排位代练。',
                        price: '$10/小时'
                    },
                    {
                        title: '定位赛代打',
                        desc: '新赛季定位赛关系到一整个赛季的起点，让我们的高手为您打好开局，获得更好的起始排名。',
                        price: '$10/小时'
                    },
                    {
                        title: '英雄熟练度',
                        desc: '提升特定英雄的熟练度等级，解锁成就和限定皮肤。我们的代练精通所有位置和英雄，能高效提升熟练度。',
                        price: '$10/小时'
                    }
                ],
                carousel: [
                    {caption: '英雄联盟专业代练'},
                    {caption: '高分段排位冲分'},
                    {caption: '熟练度快速提升'}
                ],
                contact: {
                    title: '联系我们',
                    telegram: 'Telegram',
                    wechat: '微信',
                    wechat_scan: '扫码添加客服'
                }
            },
            nav: {
                wow: '魔兽世界',
                diablo4: '暗黑破坏神4',
                lol: '英雄联盟'
            },
            footer: {
                copyright: '© 2023 GameBoostPro - 专业游戏代练服务平台. 保留所有权利.'
            },
            sidebar: {
                telegram: 'Telegram',
                wechat: '微信'
            }
        },
        'en-US': {
            wow: {
                title: 'World of Warcraft Boosting Service',
                slogan: 'Only $10/hour, 100% manual operation with live streaming',
                services: [
                    {
                        title: 'Leveling Service',
                        desc: 'Quick leveling from 1 to 70, including gear upgrades, skill training and profession leveling. Our professional team will help you reach max level in the shortest time.',
                        price: '$10/hour'
                    },
                    {
                        title: 'Dungeon & Raid Runs',
                        desc: 'Our professional team will help you conquer dungeons of all difficulties and obtain rare gear and achievements.',
                        price: '$10/hour'
                    },
                    {
                        title: 'Customized Service',
                        desc: 'Customized service plans based on your needs, including PVP ranking, rare mount collection, achievement points, etc. Tell us your goal, we make it happen.',
                        price: '$10/hour'
                    }
                ],
                carousel: [
                    {caption: 'Professional WoW Boosting'},
                    {caption: 'All Classes Dungeon & Raid'},
                    {caption: 'Customized Leveling Plans'}
                ],
                contact: {
                    title: 'Contact Us',
                    telegram: 'Telegram',
                    wechat: 'WeChat',
                    wechat_scan: 'Scan QR code'
                }
            },
            diablo4: {
                title: 'Diablo IV Boosting Service',
                slogan: 'Only $10/hour, 100% manual operation with live streaming',
                services: [
                    {
                        title: 'Character Leveling',
                        desc: 'Quickly level up your character to the max level, gaining skill points and attribute points needed for the endgame. Our professional players will help you skip the tedious leveling phase.',
                        price: '$10/hour'
                    },
                    {
                        title: 'Gear Collection',
                        desc: 'Help you obtain the most powerful equipment and runes in the game. We will match the best equipment combination for your profession to enhance your character\'s combat power.',
                        price: '$10/hour'
                    },
                    {
                        title: 'Dungeon Challenge',
                        desc: 'Conquer high-difficulty dungeons and obtain rare rewards and achievements. Our team has rich Diablo IV gaming experience and can handle various challenges.',
                        price: '$10/hour'
                    }
                ],
                carousel: [
                    {caption: 'Diablo IV Professional Boosting'},
                    {caption: 'High Difficulty Dungeon Clearing'},
                    {caption: 'Top-tier Equipment Collection'}
                ],
                contact: {
                    title: 'Contact Us',
                    telegram: 'Telegram',
                    wechat: 'WeChat',
                    wechat_scan: 'Scan QR code'
                }
            },
            lol: {
                title: 'League of Legends Boosting Service',
                slogan: 'Only $10/hour, 100% manual operation with live streaming',
                services: [
                    {
                        title: 'Ranked Boosting',
                        desc: 'From Iron to Challenger, our professional players can help you improve your rank. Based on your target rank and current score, we provide the most efficient ranked boosting.',
                        price: '$10/hour'
                    },
                    {
                        title: 'Placement Matches',
                        desc: 'The new season\'s placement matches are crucial for your starting point. Let our experts play for you to get a better initial ranking.',
                        price: '$10/hour'
                    },
                    {
                        title: 'Champion Mastery',
                        desc: 'Improve specific champion\'s mastery level, unlock achievements and limited skins. Our boosters master all positions and champions, and can efficiently improve mastery.',
                        price: '$10/hour'
                    }
                ],
                carousel: [
                    {caption: 'LoL Professional Boosting'},
                    {caption: 'High-tier Ranked Climbing'},
                    {caption: 'Fast Mastery Improvement'}
                ],
                contact: {
                    title: 'Contact Us',
                    telegram: 'Telegram',
                    wechat: 'WeChat',
                    wechat_scan: 'Scan QR code'
                }
            },
            nav: {
                wow: 'World of Warcraft',
                diablo4: 'Diablo IV',
                lol: 'League of Legends'
            },
            footer: {
                copyright: '© 2023 GameBoostPro - Professional Game Boosting Service. All rights reserved.'
            },
            sidebar: {
                telegram: 'Telegram',
                wechat: 'WeChat'
            }
        },
        'es-ES': {
            wow: {
                title: 'Servicio de Boosting para World of Warcraft',
                slogan: 'Solo $10/hora, 100% operación manual con transmisión en vivo',
                services: [
                    {
                        title: 'Servicio de Nivelación',
                        desc: 'Nivelación rápida de 1 a 70, incluidas mejoras de equipo, entrenamiento de habilidades y nivelación de profesiones.',
                        price: '$10/hora'
                    },
                    {
                        title: 'Mazmorras y Bandas',
                        desc: 'Nuestro equipo profesional te ayudará a conquistar mazmorras de todas las dificultades y obtener equipos y logros raros.',
                        price: '$10/hora'
                    },
                    {
                        title: 'Servicio Personalizado',
                        desc: 'Planes de servicio personalizados según tus necesidades, incluido ranking PVP, colección de monturas raras, puntos de logros, etc.',
                        price: '$10/hora'
                    }
                ],
                carousel: [
                    {caption: 'Boosting Profesional de WoW'},
                    {caption: 'Mazmorras y Bandas para Todas las Clases'},
                    {caption: 'Planes de Nivelación Personalizados'}
                ],
                contact: {
                    title: 'Contáctanos',
                    telegram: 'Telegram',
                    wechat: 'WeChat',
                    wechat_scan: 'Escanear código QR'
                }
            },
            diablo4: {
                title: 'Servicio de Boosting para Diablo IV',
                slogan: 'Solo $10/hora, 100% operación manual con transmisión en vivo',
                services: [
                    {
                        title: 'Nivelación de Personaje',
                        desc: 'Sube rápidamente tu personaje al nivel máximo, obteniendo puntos de habilidad y atributos necesarios para el final del juego.',
                        price: '$10/hora'
                    },
                    {
                        title: 'Colección de Equipo',
                        desc: 'Te ayudamos a obtener el equipo y runas más poderosos del juego. Combinaremos el mejor equipo para tu profesión.',
                        price: '$10/hora'
                    },
                    {
                        title: 'Desafío de Mazmorras',
                        desc: 'Conquista mazmorras de alta dificultad y obtén recompensas y logros raros. Nuestro equipo tiene amplia experiencia en Diablo IV.',
                        price: '$10/hora'
                    }
                ],
                carousel: [
                    {caption: 'Boosting Profesional de Diablo IV'},
                    {caption: 'Limpieza de Mazmorras de Alta Dificultad'},
                    {caption: 'Colección de Equipo de Primera Clase'}
                ],
                contact: {
                    title: 'Contáctanos',
                    telegram: 'Telegram',
                    wechat: 'WeChat',
                    wechat_scan: 'Escanear código QR'
                }
            },
            lol: {
                title: 'Servicio de Boosting para League of Legends',
                slogan: 'Solo $10/hora, 100% operación manual con transmisión en vivo',
                services: [
                    {
                        title: 'Boosting de Clasificatorias',
                        desc: 'Desde Hierro hasta Retador, nuestros jugadores profesionales pueden ayudarte a mejorar tu rango.',
                        price: '$10/hora'
                    },
                    {
                        title: 'Partidas de Posicionamiento',
                        desc: 'Las partidas de posicionamiento de la nueva temporada son cruciales para tu punto de partida.',
                        price: '$10/hora'
                    },
                    {
                        title: 'Maestría de Campeones',
                        desc: 'Mejora el nivel de maestría de campeones específicos, desbloquea logros y aspectos limitados.',
                        price: '$10/hora'
                    }
                ],
                carousel: [
                    {caption: 'Boosting Profesional de LoL'},
                    {caption: 'Subida de Rango de Alto Nivel'},
                    {caption: 'Mejora Rápida de Maestría'}
                ],
                contact: {
                    title: 'Contáctanos',
                    telegram: 'Telegram',
                    wechat: 'WeChat',
                    wechat_scan: 'Escanear código QR'
                }
            },
            nav: {
                wow: 'World of Warcraft',
                diablo4: 'Diablo IV',
                lol: 'League of Legends'
            },
            footer: {
                copyright: '© 2023 GameBoostPro - Servicio Profesional de Boosting de Juegos. Todos los derechos reservados.'
            },
            sidebar: {
                telegram: 'Telegram',
                wechat: 'WeChat'
            }
        }
    };

    // 更新导航菜单
    document.querySelectorAll('.game-btn').forEach(btn => {
        const game = btn.dataset.game;
        btn.textContent = translations[lang].nav[game];
    });

    // 更新页脚
    document.querySelector('.copyright').textContent = translations[lang].footer.copyright;

    // 更新所有游戏内容
    for (const game in translations[lang].nav) {
        updateGameContent(game, translations[lang][game]);
    }

    // 更新侧边栏联系方式
    updateSidebarContact(lang, translations[lang].sidebar);

    function updateGameContent(game, content) {
        if (!content) return;
        
        const gameContent = document.getElementById(`${game}-content`);
        if (!gameContent) return;
        
        // 更新标题和标语
        gameContent.querySelector('h1').textContent = content.title;
        gameContent.querySelector('.game-header p').textContent = content.slogan;
        
        // 更新服务卡片
        if (content.services) {
            const serviceCards = gameContent.querySelectorAll('.service-card');
            content.services.forEach((service, index) => {
                if (serviceCards[index]) {
                    serviceCards[index].querySelector('h3').textContent = service.title;
                    serviceCards[index].querySelector('p').textContent = service.desc;
                    serviceCards[index].querySelector('.price').textContent = service.price;
                }
            });
        }
        
        // 更新轮播图
        if (content.carousel) {
            const slides = gameContent.querySelectorAll('.carousel-slide');
            content.carousel.forEach((slide, index) => {
                if (slides[index]) {
                    const caption = slides[index].querySelector('.carousel-caption h3');
                    if (caption) {
                        caption.textContent = slide.caption;
                    }
                }
            });
        }
        
        // 更新联系部分
        if (content.contact) {
            const contactSection = gameContent.querySelector('.contact-section');
            if (contactSection) {
                // 更新标题
                contactSection.querySelector('h2').textContent = content.contact.title;
                
                // 更新Telegram
                const telegramMethod = contactSection.querySelector('.contact-method:nth-child(1)');
                if (telegramMethod) {
                    telegramMethod.querySelector('h3').textContent = content.contact.telegram;
                }
                
                // 更新微信
                const wechatMethod = contactSection.querySelector('.contact-method:nth-child(2)');
                if (wechatMethod) {
                    wechatMethod.querySelector('h3').textContent = content.contact.wechat;
                    wechatMethod.querySelector('span').textContent = content.contact.wechat_scan;
                }
            }
        }
    }
}

/**
 * 更新侧边栏联系方式
 */
function updateSidebarContact(lang, sidebar) {
    if (!sidebar) return;
    
    // 更新Telegram标签
    document.querySelector('.contact-sidebar-item:nth-child(1) .contact-sidebar-label').textContent = sidebar.telegram;
    
    // 更新微信标签
    document.querySelector('.contact-sidebar-item:nth-child(2) .contact-sidebar-label').textContent = sidebar.wechat;
} 

/**
 * 二维码点击放大功能
 */
function initQrCodeZoom() {
    const modal = document.getElementById('qr-modal');
    const modalImg = document.getElementById('qr-modal-img');
    const closeBtn = document.querySelector('.qr-close');
    const zoomableQrCodes = document.querySelectorAll('.qr-code-zoomable');
    
    // 点击二维码图片时显示弹窗
    zoomableQrCodes.forEach(qrCode => {
        qrCode.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
        });
    });
    
    // 点击关闭按钮关闭弹窗
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击弹窗背景关闭弹窗
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
} 