// ================= SISTEM WAKTU REALTIME =================
function initClock() {
    const clockEl = document.getElementById('live-clock');
    setInterval(() => {
        const now = new Date();
        clockEl.innerText = now.toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        }) + " | " + now.toLocaleTimeString('id-ID', { hour12: false }) + " WIB";
    }, 1000);
}

// ================= AKSES WEB KAMERA LURUS =================
const video = document.getElementById('video');
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
    } catch (err) {
        console.error("Gagal memuat kamera web:", err);
    }
}

// ================= AMBIL DATA RIWAYAT DARI LOCAL STORAGE =================
let attendanceLogs = JSON.parse(localStorage.getItem('instant_logs')) || [];

function renderLogs() {
    const container = document.getElementById('log-container');
    const emptyState = document.getElementById('empty-state');
    const countEl = document.getElementById('log-count');
    
    // Perbarui counter
    countEl.innerText = `${attendanceLogs.length} Absen`;

    if (attendanceLogs.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    // Bersihkan isi kecuali empty state
    container.querySelectorAll('.log-item').forEach(el => el.remove());

    attendanceLogs.forEach(log => {
        const logHtml = `
            <div class="log-item flex justify-between items-center p-3 bg-beige-bg rounded-xl border border-beige-card/70 text-sm animate-fade-in">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-brown-text text-elegant-yellow flex items-center justify-center font-bold text-xs uppercase">
                        ${log.name.charAt(0)}
                    </div>
                    <div>
                        <p class="font-semibold text-brown-text">${log.name}</p>
                        <p class="text-[10px] text-brown-sub font-medium">${log.date}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-brown-text font-bold font-mono text-xs bg-beige-card px-2 py-1 rounded shadow-sm">${log.time} WIB</p>
                    <span class="text-[9px] text-green-600 font-semibold uppercase tracking-wider"><i class="fa-solid fa-circle-check mr-0.5"></i> Berhasil</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', logHtml);
    });
}

// ================= INTERAKSI TOMBOL ABSEN (SIMULASI AI) =================
const btnScan = document.getElementById('btn-scan');
const scannerBox = document.getElementById('scanner-box');
const inputName = document.getElementById('user-input-name');

btnScan.addEventListener('click', () => {
    const nameValue = inputName.value.trim();
    
    if (!nameValue) {
        alert("Silakan ketik nama terlebih dahulu pada kolom yang disediakan.");
        inputName.focus();
        return;
    }

    // Efek UI Loading Mendeteksi Wajah
    btnScan.innerText = "MENGANALISIS BIOMETRIK WAJAH...";
    btnScan.disabled = true;
    scannerBox.classList.remove('opacity-40');
    scannerBox.classList.add('scale-110', 'border-white', 'opacity-100');

    setTimeout(() => {
        // Kembalikan efek scanner ke semula
        scannerBox.classList.remove('scale-110', 'border-white', 'opacity-100');
        scannerBox.classList.add('opacity-40');
        btnScan.innerText = "KONFIRMASI & ABSEN SEKARANG";
        btnScan.disabled = false;

        // Ambil Jam dan Tanggal Sekarang
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
        const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

        // Simpan Log Baru
        const newRecord = {
            name: nameValue,
            time: timeStr,
            date: dateStr
        };

        attendanceLogs.unshift(newRecord); // Taruh paling atas
        localStorage.setItem('instant_logs', JSON.stringify(attendanceLogs));
        
        // Reset form input & render ulang daftar
        inputName.value = "";
        renderLogs();
        
        alert(`Absen Berhasil!\nSelamat Bekerja, ${newRecord.name}.`);
    }, 2000); // Simulasi scan wajah 2 detik
});

// ================= TOMBOL LOADING AWAL =================
window.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCamera();
    renderLogs();
});