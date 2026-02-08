// Danh sách phần thưởng
const rewards = [
    "GIẢM 5% CHO ĐƠN HÀNG",         
    "GIẢM 20% TOÀN SHOP",           
    "FREESHIP & TẶNG QUÀ",          
    "GIẢM 25% SIÊU DEAL",           
    "TẶNG 01 PIN TIỂU",             
    "TẶNG BAO LÌ XÌ ĐỘC QUYỀN"      
];

// Danh sách hình ảnh
const sticks = [
    '11.png', '12.png', '13.png', 
    '14.png', '15.png', '16.png'
];

// Khai báo giao diện
const shakeBtn = document.getElementById('shake-btn');
const shaker = document.getElementById('shaker');
const stickImg = document.getElementById('result-stick');
const modal = document.getElementById('modal');
const rewardText = document.getElementById('reward-text');
const closeBtn = document.querySelector('.close-btn');
const fillerSticks = document.querySelectorAll('.filler-stick'); 

// --- KHAI BÁO ÂM THANH ---
const bgMusic = document.getElementById('bg-music');
const shakeSound = document.getElementById('shake-sound');
const winSound = document.getElementById('win-sound');

// Cấu hình volume
bgMusic.volume = 0.5;   
shakeSound.volume = 1.0; 
winSound.volume = 1.0;  

// --- MẸO: TỰ ĐỘNG PHÁT NHẠC (AUTO PLAY HACK) ---
function tryPlayMusic() {
    bgMusic.play().then(() => {
        // Nếu phát được thì tốt
        console.log("Nhạc nền đã tự chạy");
    }).catch(error => {
        // Nếu bị chặn, chờ người dùng click bất cứ đâu để phát
        console.log("Trình duyệt chặn autoplay, chờ click...");
        document.addEventListener('click', function() {
            bgMusic.play();
        }, { once: true }); // Chỉ cần bắt 1 lần click đầu tiên
    });
}

// Gọi hàm chạy nhạc ngay khi web tải xong
window.addEventListener('DOMContentLoaded', tryPlayMusic);


// --- LOGIC CHỐNG CHEAT ---
const daGieo = localStorage.getItem('hasPlayed');
const quaDaNhan = localStorage.getItem('savedReward');

if (daGieo === 'true' && quaDaNhan) {
    chuyenCheDoXemLai(quaDaNhan);
} else {
    shakeBtn.addEventListener('click', gieoQue);
}

function chuyenCheDoXemLai(phanThuong) {
    shakeBtn.innerText = "Xem Lại Lộc Của Bạn";
    shakeBtn.style.backgroundColor = "#555";
    
    shakeBtn.removeEventListener('click', gieoQue);
    
    shakeBtn.addEventListener('click', () => {
        // Đảm bảo nhạc nền chạy khi xem lại
        if (bgMusic.paused) bgMusic.play();
        
        rewardText.innerText = phanThuong;
        modal.classList.remove('hidden'); 
        modal.classList.add('show'); 
    });
}

// HÀM GIEO QUẺ CHÍNH
function gieoQue() {
    // 1. Đảm bảo nhạc nền đang chạy
    if (bgMusic.paused) bgMusic.play();

    // Hiệu ứng Audio Ducking: Nhạc nền nhỏ lại
    bgMusic.volume = 0.1; 
    
    // Tiếng lắc to lên
    shakeSound.currentTime = 0;
    shakeSound.play(); 

    // 2. Xử lý hình ảnh
    stickImg.classList.add('hidden');
    shaker.classList.add('shaking');
    fillerSticks.forEach(stick => stick.classList.add('shaking-stick'));
    
    shakeBtn.disabled = true;
    shakeBtn.innerText = "Đang thỉnh thánh chỉ...";

    // 3. Sau 2 giây lắc
    setTimeout(() => {
        shakeSound.pause();
        shakeSound.currentTime = 0;

        shaker.classList.remove('shaking');
        fillerSticks.forEach(stick => stick.classList.remove('shaking-stick'));

        const randomIndex = Math.floor(Math.random() * rewards.length);
        const resultReward = rewards[randomIndex];
        
        localStorage.setItem('hasPlayed', 'true');
        localStorage.setItem('savedReward', resultReward);

        rewardText.innerText = resultReward;
        modal.classList.remove('hidden'); 
        modal.classList.add('show'); 

        // Nhạc chúc mừng
        winSound.currentTime = 0;
        winSound.play();
        
        // Sau 7 giây thì tắt nhạc chúc mừng, nhạc nền to lại
        setTimeout(() => {
            winSound.pause();
            bgMusic.volume = 0.5; 
        }, 7000); 

        shakeBtn.disabled = false;
        chuyenCheDoXemLai(resultReward);

    }, 2000); 
}

// Đóng modal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    modal.classList.add('hidden');
    winSound.pause();
    bgMusic.volume = 0.5;
});

window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
        winSound.pause();
        bgMusic.volume = 0.5;
    }
}