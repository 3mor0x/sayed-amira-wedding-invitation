// 1. إعدادات Firebase لرسائل التهاني
const firebaseConfig = {
    databaseURL: "https://wedding-apps-cc913-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const wishesRef = database.ref('wishes/sayed_amira');

const audio = document.getElementById('bg-music');
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    buildCalendar();
    initParticles();

    wishesRef.on('child_added', (snapshot) => {
        const wish = snapshot.val();
        renderWish(wish, true);
    });
});

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.8,
            speedY: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.6 + 0.25
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#c5a059';

        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function openInvitation() {
    document.getElementById('heroGate').classList.add('open');
    audio.play().then(() => {
        isPlaying = true;
    }).catch(() => {
        isPlaying = false;
    });
}

function toggleAudio() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
}

// 17 أكتوبر 2026 - السبت الساعة 7:30 مساءً
const weddingDate = new Date('October 17, 2026 19:30:00').getTime();

setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff > 0) {
        document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000);
    } else {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
    }
}, 1000);

function buildCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    headers.forEach(h => {
        const div = document.createElement('div');
        div.className = 'cal-header';
        div.innerText = h;
        grid.appendChild(div);
    });

    for (let i = 0; i < 4; i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    for (let d = 1; d <= 31; d++) {
        const div = document.createElement('div');
        div.className = 'cal-day';
        if (d === 17) div.classList.add('active-wedding');
        div.innerText = d;
        grid.appendChild(div);
    }
}

function addWish() {
    const nameInput = document.getElementById('guestName');
    const msgInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();
    
    if (name && msg) {
        const newWish = {
            name: name,
            msg: msg,
            timestamp: Date.now()
        };
        
        wishesRef.push(newWish);
        nameInput.value = '';
        msgInput.value = '';
    }
}

function renderWish(wish, prepend = true) {
    const wishesList = document.getElementById('wishesList');
    const item = document.createElement('div');
    item.className = 'wish-item';
    
    let formattedDate = '';
    if (wish.timestamp) {
        const dateObj = new Date(wish.timestamp);
        formattedDate = dateObj.toLocaleDateString('ar-EG', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="wish-name">${wish.name}</span>
            <span class="wish-time">${formattedDate}</span>
        </div>
        <div class="wish-msg">${wish.msg}</div>
    `;
    
    if (prepend) {
        wishesList.prepend(item);
    } else {
        wishesList.appendChild(item);
    }
}