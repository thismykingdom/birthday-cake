// ========================================
// 音乐控制
// ========================================
const musicBtn = document.getElementById('musicToggle');
const birthdaySong = document.getElementById('birthdaySong');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        birthdaySong.pause();
        musicBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        birthdaySong.play();
        musicBtn.classList.add('playing');
        isPlaying = true;
    }
});

// 自动播放音乐
window.addEventListener('load', () => {
    birthdaySong.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
    }).catch(() => {
        console.log('请点击音乐按钮开始播放');
    });
});

// ========================================
// 3D粒子蛋糕效果（增强版）
// ========================================
const canvas = document.getElementById('cakeCanvas');
const ctx = canvas.getContext('2d');

// 设置canvas尺寸
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 粒子类
class Particle {
    constructor(x, y, z, color, size, type = 'cake') {
        // {{ AURA: Modify - 添加初始随机位置用于凝聚动画 }}
        // 目标位置（蛋糕形状）
        this.baseX = x;
        this.baseY = y;
        this.baseZ = z;

        // 如果是蛋糕粒子，设置随机的初始位置（全屏范围）
        if (type === 'cake' || type === 'flame') {
            this.startX = (Math.random() - 0.5) * 800;
            this.startY = (Math.random() - 0.5) * 600;
            this.startZ = (Math.random() - 0.5) * 800;
            // 当前位置从起始位置开始
            this.x = this.startX;
            this.y = this.startY;
            this.z = this.startZ;
        } else {
            // 特效粒子直接在目标位置
            this.x = x;
            this.y = y;
            this.z = z;
            this.startX = x;
            this.startY = y;
            this.startZ = z;
        }

        this.color = color;
        this.size = size;
        this.type = type;
        this.alpha = 1;
        this.sparkle = Math.random() * Math.PI * 2;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.life = 1;
    }

    // 3D投影到2D
    project(rotationX, rotationY, scale) {
        let x = this.x;
        let y = this.y;
        let z = this.z;

        // 绕Y轴旋转
        let cosY = Math.cos(rotationY);
        let sinY = Math.sin(rotationY);
        let tempX = x * cosY - z * sinY;
        let tempZ = x * sinY + z * cosY;
        x = tempX;
        z = tempZ;

        // 绕X轴旋转
        let cosX = Math.cos(rotationX);
        let sinX = Math.sin(rotationX);
        let tempY = y * cosX - z * sinX;
        tempZ = y * sinX + z * cosX;
        y = tempY;
        z = tempZ;

        // 透视投影
        const perspective = 800;
        const scaleProjection = perspective / (perspective + z);

        return {
            x: canvas.width / 2 + x * scale * scaleProjection,
            y: canvas.height / 2 - y * scale * scaleProjection,
            scale: scaleProjection * scale / 3,
            z: z
        };
    }

    update() {
        this.sparkle += 0.05;

        // 如果是特效粒子，更新位置和生命值
        if (this.type === 'firework' || this.type === 'explosion') {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.z += this.velocity.z;
            this.velocity.y += 0.2; // 重力
            this.life -= 0.02; // {{ AURA: Modify - 加快特效粒子消失速度，防止累积 }}
        }
    }
}

// 创建蛋糕粒子
const particles = [];
const backgroundParticles = []; // {{ AURA: Add - 全屏背景粒子 }}
const candles = []; // 存储蜡烛状态
const MAX_PARTICLES = 10000; // 粒子数量上限（防止性能问题）
const BASE_PARTICLE_COUNT = 6000; // 基础蛋糕粒子数量

// {{ AURA: Add - 动画控制变量 }}
let animationProgress = 0; // 凝聚动画进度 0-1
const ANIMATION_DURATION = 3; // 动画持续3秒
let animationStartTime = null;

// {{ AURA: Add - 祝福语系统 }}
const blessings = [
    "🎂 祝智艳生日快乐，心想事成！",
    "✨ 愿你的每一天都充满欢笑和阳光！",
    "🌟 愿你永远年轻美丽，幸福安康！",
    "💖 祝你事业顺利，爱情甜蜜！",
    "🎉 新的一岁，愿所有美好如约而至！",
    "🌸 愿你的生活像花儿一样灿烂！",
    "🎈 生日快乐！愿梦想成真，快乐永恒！"
];

const textBlossoms = []; // 存储文字烟花对象

const colors = {
    cake1: ['#ffb3d9', '#ff8dc7', '#ff6bb5', '#ffccee', '#ff99cc'],
    cake2: ['#ffd93d', '#ffc107', '#ffab00', '#ffe082', '#ffd54f'],
    cake3: ['#ff6b9d', '#ff4081', '#f50057', '#ff80ab', '#ff5c8d'],
    cream: ['#ffffff', '#fff9e6', '#fffacd'],
    candle: ['#ff6b9d', '#ff4081', '#ff99bb'],
    flame: ['#ffaa00', '#ff6600', '#ffdd00', '#ff8800'],
    decoration: ['#ffd700', '#ffeb3b', '#fff176']
};

// 创建更真实的圆柱体（增加粒子密度）
function createDetailedCylinder(centerY, radius, height, colors, particleDensity, hasTexture = false) {
    for (let i = 0; i < particleDensity; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = centerY + (Math.random() - 0.5) * height;

        // 添加纹理变化
        const colorIndex = hasTexture ?
            Math.floor((y - centerY + height / 2) / height * colors.length) % colors.length :
            Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];

        // 粒子大小变化增加质感
        const size = 1.5 + Math.random() * 2.5;
        particles.push(new Particle(x, y, z, color, size));
    }
}

// 创建奶油装饰
function createCreamLayer(centerY, radius) {
    // {{ AURA: Modify - 减少奶油粒子数量 }}
    for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = centerY + (Math.random() - 0.5) * 8;
        const color = colors.cream[Math.floor(Math.random() * colors.cream.length)];
        const size = 2 + Math.random() * 2;
        particles.push(new Particle(x, y, z, color, size));
    }
}

// {{ AURA: Modify - 减少粒子密度，让凝聚动画更清爽 }}
// 创建三层蛋糕（优化版）
createDetailedCylinder(-20, 120, 50, colors.cake1, 1500, true);  // 底层（减少1000）
createCreamLayer(5, 120);  // 底层奶油
createDetailedCylinder(40, 100, 50, colors.cake2, 1200, true);   // 中层（减少800）
createCreamLayer(65, 100); // 中层奶油
createDetailedCylinder(95, 80, 50, colors.cake3, 900, true);     // 顶层（减少600）
createCreamLayer(120, 80); // 顶层奶油

// 创建5根蜡烛（更真实）
for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const candleX = Math.cos(angle) * 50;
    const candleZ = Math.sin(angle) * 50;

    // 蜡烛对象
    const candleObj = {
        x: candleX,
        z: candleZ,
        lit: true,
        particles: []
    };

    // {{ AURA: Modify - 减少蜡烛粒子 }}
    // 蜡烛身体
    for (let j = 0; j < 60; j++) {
        const r = 3 + Math.random() * 2;
        const a = Math.random() * Math.PI * 2;
        const x = candleX + Math.cos(a) * r;
        const z = candleZ + Math.sin(a) * r;
        const y = 125 + Math.random() * 35;
        const particle = new Particle(x, y, z, colors.candle[Math.floor(Math.random() * colors.candle.length)], 1.8);
        particles.push(particle);
        candleObj.particles.push(particle);
    }

    // {{ AURA: Modify - 减少火焰粒子 }}
    // 火焰
    for (let j = 0; j < 40; j++) {
        const r = Math.random() * 6;
        const a = Math.random() * Math.PI * 2;
        const x = candleX + Math.cos(a) * r;
        const z = candleZ + Math.sin(a) * r;
        const y = 160 + Math.random() * 20;
        const color = colors.flame[Math.floor(Math.random() * colors.flame.length)];
        const particle = new Particle(x, y, z, color, 1.5 + Math.random(), 'flame');
        particles.push(particle);
        candleObj.particles.push(particle);
    }

    candles.push(candleObj);
}

// {{ AURA: Modify - 减少装饰粒子 }}
// 添加装饰粒子
for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 140 + Math.random() * 30;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.random() * 160 - 20;
    const color = colors.decoration[Math.floor(Math.random() * colors.decoration.length)];
    particles.push(new Particle(x, y, z, color, 1 + Math.random() * 2));
}

// {{ AURA: Modify - 减少背景粒子数量 }}
// 创建全屏背景粒子
for (let i = 0; i < 80; i++) {
    const particle = {
        x: Math.random() * 2 - 1, // -1 到 1
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        vz: (Math.random() - 0.5) * 0.002,
        color: colors.decoration[Math.floor(Math.random() * colors.decoration.length)],
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.4
    };
    backgroundParticles.push(particle);
}

// 旋转控制
let rotationX = 0.3;
let rotationY = 0;
let targetRotationY = 0;
let scale = 2;
let hoverEffect = 0;

// 鼠标控制
let isDragging = false;
let lastX = 0;
let lastY = 0;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (isDragging) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        targetRotationY += deltaX * 0.01;
        rotationX -= deltaY * 0.005;
        rotationX = Math.max(-0.5, Math.min(1, rotationX));
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

// 双击创建烟花效果
canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    createFirework(clickX, clickY);
});

// 点击蜡烛吹灭/点燃，或者点击其他位置放烟花
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 检测是否点击了蜡烛
    let clickedCandle = false;
    candles.forEach(candle => {
        const projected = new Particle(candle.x, 150, candle.z, '#000', 1).project(rotationX, rotationY, scale);
        const distance = Math.sqrt((clickX - projected.x) ** 2 + (clickY - projected.y) ** 2);

        if (distance < 30) {
            toggleCandle(candle);
            clickedCandle = true;
        }
    });

    // {{ AURA: Modify - 点击时创建烟花并显示随机祝福语 }}
    // 如果没有点击蜡烛，则在点击位置创建烟花
    if (!clickedCandle) {
        createFirework(clickX, clickY);
        createTextBlossom(clickX, clickY);
    }
});

// 切换蜡烛状态
function toggleCandle(candle) {
    candle.lit = !candle.lit;

    // 创建吹灭/点燃效果
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const particle = new Particle(
            candle.x,
            160,
            candle.z,
            candle.lit ? '#ffaa00' : '#888888',
            2,
            'explosion'
        );
        particle.velocity = {
            x: Math.cos(angle) * speed,
            y: -Math.random() * 5,
            z: Math.sin(angle) * speed
        };
        particles.push(particle);
    }
}

// 创建烟花效果
function createFirework(x, y) {
    // {{ AURA: Modify - 添加粒子数量检查，防止超出上限 }}
    if (particles.length > MAX_PARTICLES - 100) {
        // 如果粒子太多，先清理一些旧的特效粒子
        const effectParticles = particles.filter(p => p.type === 'firework' || p.type === 'explosion');
        effectParticles.slice(0, 50).forEach(p => p.life = 0);
    }

    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const speed = 5 + Math.random() * 5;
        const color = colors.decoration[Math.floor(Math.random() * colors.decoration.length)];
        const particle = new Particle(
            0, 100, 0, color, 2 + Math.random() * 2, 'firework'
        );
        particle.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 5,
            z: (Math.random() - 0.5) * speed
        };
        particles.push(particle);
    }
}

// {{ AURA: Add - 创建文字烟花效果 }}
function createTextBlossom(x, y) {
    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
    textBlossoms.push({
        text: blessing,
        x: x,
        y: y,
        alpha: 0,
        scale: 0.5,
        life: 1,
        phase: 'fadein' // fadein -> hold -> fadeout
    });
}

// 触摸支持
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging) {
        const deltaX = e.touches[0].clientX - lastX;
        const deltaY = e.touches[0].clientY - lastY;
        targetRotationY += deltaX * 0.01;
        rotationX -= deltaY * 0.005;
        rotationX = Math.max(-0.5, Math.min(1, rotationX));
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }
}, { passive: false });

canvas.addEventListener('touchend', () => isDragging = false);

// 滚轮缩放
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.002;
    scale = Math.max(1, Math.min(4, scale));
}, { passive: false });

// 动画循环
let time = 0;
function animate() {
    time += 0.016;

    // {{ AURA: Add - 更新凝聚动画进度 }}
    if (animationProgress < 1) {
        if (animationStartTime === null) {
            animationStartTime = time;
        }
        animationProgress = Math.min(1, (time - animationStartTime) / ANIMATION_DURATION);
        // 使用缓动函数让动画更流畅
        const easeProgress = 1 - Math.pow(1 - animationProgress, 3); // ease-out cubic

        // 更新所有蛋糕粒子的位置
        particles.forEach(p => {
            if (p.type === 'cake' || p.type === 'flame') {
                p.x = p.startX + (p.baseX - p.startX) * easeProgress;
                p.y = p.startY + (p.baseY - p.startY) * easeProgress;
                p.z = p.startZ + (p.baseZ - p.startZ) * easeProgress;
            }
        });
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // {{ AURA: Add - 绘制全屏背景粒子 }}
    backgroundParticles.forEach(p => {
        // 更新背景粒子位置
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 边界反弹
        if (Math.abs(p.x) > 1) p.vx *= -1;
        if (Math.abs(p.y) > 1) p.vy *= -1;
        if (Math.abs(p.z) > 1) p.vz *= -1;

        // 转换为屏幕坐标
        const screenX = (p.x * 0.5 + 0.5) * canvas.width;
        const screenY = (p.y * 0.5 + 0.5) * canvas.height;
        const scale = (p.z * 0.5 + 0.5) * 0.5 + 0.5; // 0.5 到 1

        ctx.save();
        ctx.globalAlpha = p.alpha * scale;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // 平滑旋转
    rotationY += (targetRotationY - rotationY) * 0.1;

    // 自动旋转
    if (!isDragging) {
        targetRotationY += 0.003;
    }

    // 更新和投影所有粒子
    const projectedParticles = [];

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();

        // {{ AURA: Modify - 更积极的清理策略 }}
        // 移除生命值耗尽的粒子
        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        // 如果粒子数量过多，优先清理远离视野中心的特效粒子
        if (particles.length > MAX_PARTICLES && (particle.type === 'firework' || particle.type === 'explosion')) {
            particles.splice(i, 1);
            continue;
        }

        // 检查粒子是否属于熄灭的蜡烛
        let shouldRender = true;
        if (particle.type === 'flame') {
            const parentCandle = candles.find(c =>
                c.particles.includes(particle)
            );
            if (parentCandle && !parentCandle.lit) {
                shouldRender = false;
            }
        }

        if (shouldRender) {
            projectedParticles.push({
                particle,
                projected: particle.project(rotationX, rotationY, scale)
            });
        }
    }

    // 按深度排序
    projectedParticles.sort((a, b) => b.projected.z - a.projected.z);

    // 绘制粒子
    projectedParticles.forEach(({ particle, projected }) => {
        const { x, y, scale: s, z } = projected;

        // 火焰闪烁效果
        let alpha = particle.alpha * particle.life;
        if (particle.type === 'flame') {
            alpha *= 0.6 + Math.sin(particle.sparkle) * 0.4;
        }

        // 深度透明度
        alpha *= Math.max(0.3, 1 - z / 400);

        ctx.save();
        ctx.globalAlpha = alpha;

        // 发光效果
        if (particle.type === 'flame' || particle.type === 'firework' || particle.color.includes('d7')) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color;
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, particle.size * s, 0, Math.PI * 2);
        ctx.fill();

        // 添加高光让粒子更立体
        if (particle.type === 'cake') {
            ctx.globalAlpha = alpha * 0.3;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x - particle.size * s * 0.3, y - particle.size * s * 0.3,
                particle.size * s * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    });

    // 显示提示文字
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText('💡 点击放烟花祝福 | 点击蜡烛吹灭/点燃 | 双击连续烟花', canvas.width / 2, 30);
    ctx.restore();

    // {{ AURA: Add - 绘制文字烟花 }}
    for (let i = textBlossoms.length - 1; i >= 0; i--) {
        const tb = textBlossoms[i];

        // 阶段控制：淡入 -> 保持 -> 淡出
        if (tb.phase === 'fadein') {
            tb.alpha += 0.03;
            tb.scale += 0.02;
            tb.y -= 0.5; // 缓慢上升
            if (tb.alpha >= 1) {
                tb.phase = 'hold';
                tb.holdTime = 0;
            }
        } else if (tb.phase === 'hold') {
            tb.holdTime = (tb.holdTime || 0) + 0.016;
            tb.y -= 0.3; // 继续缓慢上升
            if (tb.holdTime > 2) { // 保持2秒
                tb.phase = 'fadeout';
            }
        } else if (tb.phase === 'fadeout') {
            tb.alpha -= 0.02;
            tb.y -= 0.8; // 加速上升
            if (tb.alpha <= 0) {
                textBlossoms.splice(i, 1);
                continue;
            }
        }

        // 绘制文字
        ctx.save();
        ctx.globalAlpha = tb.alpha;
        ctx.font = `bold ${28 * tb.scale}px "Microsoft YaHei", Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 发光效果
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffd700';

        // 渐变填充
        const gradient = ctx.createLinearGradient(tb.x - 100, tb.y - 20, tb.x + 100, tb.y + 20);
        gradient.addColorStop(0, '#ff6bb5');
        gradient.addColorStop(0.5, '#ffd700');
        gradient.addColorStop(1, '#ff8dc7');
        ctx.fillStyle = gradient;

        // 描边
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeText(tb.text, tb.x, tb.y);
        ctx.fillText(tb.text, tb.x, tb.y);

        ctx.restore();
    }

    requestAnimationFrame(animate);
}

// 开始动画
animate();
