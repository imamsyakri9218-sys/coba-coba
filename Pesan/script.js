document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Dapatkan Elemen Penting
    const musikLatar = document.getElementById('musik-latar');
    const tombolMusik = document.getElementById('tombol-musik');
    const galeriContainer = document.getElementById('galeri'); // Container galeri
    const modal = document.getElementById('modal');
    const modalFoto = document.getElementById('modal-foto');
    const modalPesan = document.getElementById('modal-pesan');
    const tombolTutup = document.getElementsByClassName('tombol-tutup')[0];
    
    let photoData = []; // Variabel untuk menyimpan data foto dari JSON

    // ===========================================
    // BAGIAN A: FUNGSI UTAMA (FETCH DATA & RENDER)
    // ===========================================

    async function initializeGallery() {
        try {
            // Ambil data dari file data.json secara Asinkron
            const response = await fetch('data.json'); 
            
            // Cek jika file tidak ditemukan
            if (!response.ok) {
                throw new Error('Gagal memuat data.json. Cek nama file!');
            }
            
            photoData = await response.json();
            
            // Bangun galeri setelah data berhasil diambil
            renderGallery(photoData);

        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data:', error);
            // Tampilkan pesan error yang ramah di galeri
            galeriContainer.innerHTML = `<p style="color: red;">Kesalahan memuat kado: ${error.message}</p>`;
        }
    }

    function renderGallery(data) {
        let htmlContent = '';
        
        // Loop (perulangan) untuk setiap item di data JSON
        data.forEach((item, index) => {
            // Kita gunakan variabel CSS --i untuk efek miring (Expert CSS sebelumnya)
            const rotationVariable = `--i: ${index + 1}`; 
            
            htmlContent += `
                <div class="foto-item" data-id="${item.id}" style="${rotationVariable}">
                    <img src="${item.url_foto}" alt="Foto Kenangan ${item.id}">
                </div>
            `;
        });
        
        // Masukkan HTML yang sudah dibuat ke dalam container galeri
        galeriContainer.innerHTML = htmlContent;
        
        // Setelah elemen baru dibuat, kita tambahkan Event Listener untuk klik
        setupPhotoClickListeners();
    }
    
    function setupPhotoClickListeners() {
        // Ambil lagi elemen foto yang baru dibuat
        const newlyCreatedPhotos = document.querySelectorAll('.foto-item');
        
        newlyCreatedPhotos.forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                // Cari data yang cocok di array photoData
                const dataItem = photoData.find(d => d.id === id);
                
                if (dataItem) {
                    // Isi Modal
                    modalFoto.src = dataItem.url_foto;
                    
                    // Tambahkan tanggal kenangan di pesan
                    const formattedPesan = `
                        <p style="font-style: italic; color: #e91e63;">
                            Kenangan Tanggal: ${dataItem.tanggal_kenangan}
                        </p>
                        <p>${dataItem.pesan_motivasi}</p>
                    `;
                    modalPesan.innerHTML = formattedPesan;

                    // Tampilkan Modal
                    modal.style.display = 'block';
                }
            });
        });
    }

    // ===========================================
    // BAGIAN B: KONTROL MUSIK & MODAL
    // ===========================================
    
    // 3. Kontrol Musik Latar
    tombolMusik.addEventListener('click', function() {
        if (musikLatar.paused) {
            musikLatar.play();
            tombolMusik.textContent = '⏸️ Jeda Musik Semangat';
        } else {
            musikLatar.pause();
            tombolMusik.textContent = '▶️ Putar Musik Semangat';
        }
    });

    // 4. Logika Menutup Modal
    tombolTutup.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Tutup saat area luar modal diklik
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Panggil fungsi inisialisasi saat website dimuat
    initializeGallery();
});