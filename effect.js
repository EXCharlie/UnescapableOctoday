/**
 * 纯水平同步抖动 + RGB色散析出效果
 * 用法：引入此文件后，在 HTML 中使用 <div class="glitch-container"> ... </div> 包裹文本
 */
(function() {
    // 1. 动态注入 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
        .glitch-container {
            display: inline-block;
            will-change: transform;
        }
        .glitch {
            position: relative;
            display: inline-block;
            user-select: none;
        }
        /* 伪元素：红蓝析出层 */
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            opacity: 0;
            pointer-events: none;
        }
        .glitch::before { text-shadow: -2px 0 #ff00ff; }
        .glitch::after { text-shadow: 2px 0 #00ffff; }

        /* 激活状态 */
        .glitch-container.is-glitching .glitch::before,
        .glitch-container.is-glitching .glitch::after {
            opacity: 1;
            transform: translateX(var(--shift-x, 3px));
            animation: glitch-slice 0.2s infinite linear alternate-reverse;
        }

        /* 切片撕裂关键帧 */
        @keyframes glitch-slice {
            0% { clip-path: inset(10% 0 80% 0); }
            20% { clip-path: inset(80% 0 5% 0); }
            40% { clip-path: inset(30% 0 50% 0); }
            60% { clip-path: inset(50% 0 30% 0); }
            80% { clip-path: inset(5% 0 80% 0); }
            100% { clip-path: inset(80% 0 10% 0); }
        }
    `;
    document.head.appendChild(style);

    // 2. 核心逻辑
    const random = (min, max) => Math.random() * (max - min) + min;

    const initGlitch = (container) => {
        const lines = container.querySelectorAll('.glitch');
        
        // 自动将文字内容写入 data-text 供 CSS 使用
        lines.forEach(line => {
            line.setAttribute('data-text', line.textContent.trim());
        });

        const executeGlitch = (duration) => {
            container.classList.add('is-glitching');
            const startTime = performance.now();
            let lastUpdateTime = startTime;

            const updateFrame = (currentTime) => {
                // 结束动画
                if (currentTime - startTime > duration) {
                    container.classList.remove('is-glitching');
                    container.style.transform = 'none';
                    container.style.removeProperty('--shift-x');
                    scheduleNextGlitch();
                    return;
                }

                // 每 30ms 更新一次状态
                if (currentTime - lastUpdateTime > 30) {
                    // 整体左右拉扯
                    const randomX = random(-15, 15);
                    const randomSkew = random(-2, 2);
                    container.style.transform = `translateX(${randomX}px) skewX(${randomSkew}deg)`;
                    
                    // 红蓝错位幅度
                    const randomShiftX = random(-8, 8);
                    container.style.setProperty('--shift-x', `${randomShiftX}px`);

                    lastUpdateTime = currentTime;
                }
                requestAnimationFrame(updateFrame);
            };
            requestAnimationFrame(updateFrame);
        };

        const scheduleNextGlitch = () => {
            // 随机等待 2 - 6 秒
            const delay = random(2000, 6000);
            setTimeout(() => {
                // 随机持续 200ms - 600ms
                const duration = random(200, 600);
                executeGlitch(duration);
            }, delay);
        };

        // 启动该容器的循环
        scheduleNextGlitch();
    };

    // 3. 自动初始化页面上的所有目标
    document.addEventListener('DOMContentLoaded', () => {
        const containers = document.querySelectorAll('.glitch-container');
        containers.forEach(initGlitch);
    });
})();