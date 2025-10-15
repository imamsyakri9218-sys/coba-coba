document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Dapatkan Elemen Penting
    const musikLatar = document.getElementById('musik-latar');
    const tombolMusik = document.getElementById('tombol-musik');
    const galeriContainer = document.getElementById('galeri');
    const modal = document.getElementById('modal');
    const modalFoto = document.getElementById('modal-foto');
    const modalPesan = document.getElementById('modal-pesan');
    const tombolTutup = document.getElementsByClassName('tombol-tutup')[0];
    
    let photoData = []; 

    // ===========================================
    // BAGIAN A: FUNGSI UTAMA (FETCH DATA & RENDER)
    // ===========================================

    async function initializeGallery() {
        try {
            // Ambil data dari file data.json secara Asinkron
            const response = await fetch('data.json'); 
            
            if (!response.ok) {
                // Memberi tahu pengguna jika file JSON tidak ditemukan
                throw new Error('Gagal memuat data.json. Cek nama file dan lokasi.');
            }
            
            photoData = await response.json();
            
            renderGallery(photoData);

        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data:', error);
            galeriContainer.innerHTML = `<p style="color: red;">Kesalahan memuat kado: ${error.message}. Pastikan data.json ada di root.</p>`;
        }
    }

    function renderGallery(data) {
        let htmlContent = '';
        
        data.forEach((item, index) => {
            // Menggunakan variabel CSS --i untuk efek miring
            const rotationVariable = `--i: ${index + 1}`; 
            
            htmlContent += `
                <div class="foto-item" data-id="${item.id}" style="${rotationVariable}">
                    <img src="${item.url_foto}" alt="Foto Kenangan ${item.id}">
                </div>
            `;
        });
        
        galeriContainer.innerHTML = htmlContent;
        
        setupPhotoClickListeners();
    }
    
    function setupPhotoClickListeners() {
        const newlyCreatedPhotos = document.querySelectorAll('.foto-item');
        
        newlyCreatedPhotos.forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const dataItem = photoData.find(d => d.id === id);
                
                if (dataItem) {
                    // Isi Modal
                    modalFoto.src = dataItem.url_foto;
                    
                    const formattedPesan = `
                        <p style="font-style: italic; color: #e91e63; font-weight: bold;">
                            Kenangan Tanggal: ${dataItem.tanggal_kenangan}
                        </p>
                        <p>${dataItem.pesan_motivasi}</p>
                    `;
                    modalPesan.innerHTML = formattedPesan;

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
            // Mencoba memutar musik
            musikLatar.play().catch(error => {
                console.log('Autoplay diblokir atau file tidak ditemukan:', error);
            });
            tombolMusik.textContent = '⏸️ Jeda Musik Semangat';
        } else {
            musikLatar.pause();
            tombolMusik.textContent = '▶️ Incomplite by SISQO';
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

