import { bulan, tahun, jumlahIuran, cekTarifBulan } from "./iuran.js";

console.log("JS loaded");

// deklarasi elemen-elemen yang dibutuhkan
let bulanAwalSelect = document.getElementById("bulan_awal_select");
let bulanAkhirSelect = document.getElementById("bulan_akhir_select");
let rentangDipilihSpan = document.querySelector(".rentang_dipilih");
let bulanDipilihSpan = document.querySelector(".bulan_dipilih");
let iuranDipilihSpan = document.querySelector(".iuran_dipilih");
let kelasDipilihSpan = document.querySelector("#kelas_select");
let tahunAwalSelect = document.getElementById("tahun_awal_select");
let tahunAkhirSelect = document.getElementById("tahun_akhir_select");
let konfirmasiButton = document.getElementById("konfirmasi_button");
let checkboxBulanSaja = document.getElementById("checkbox_bulan");
let checkboxBulanBerjalan = document.getElementById("checkbox_bulan_berjalan");
let containerTanggalAkhir = document.getElementById("container_tanggal_akhir"); 
let statusCheckboxBulanSaja = false; //variabel untuk menyimpan status checkbox bulan saja
let statusCheckboxBulanBerjalan = false;
let currentMonth = new Date().getMonth() + 1; 
let currentYear = 2026;
let containerLampiran = document.getElementById("container_lampiran");

// padStart(). =  otomatis memastikan string panjangnya 2 karakter, jika kurang ditambah "0" di depannya.
const monthFormat = (bulan) => String(bulan).padStart(2, '0');

// 1. Tanda '?.' (Optional Chaining) akan mengecek: apakah 'dataDitemukan' ada isinya? 
//    Jika tidak ada, dia tidak akan membuat program error, melainkan otomatis menghasilkan 'undefined'.
// 2. Tanda '??' (Nullish Coalescing) akan mengecek: jika nilai di sebelah kirinya 'undefined' atau 'null', 
//    maka gunakan nilai di sebelah kanannya (yaitu angka 0).


// ATURAN BARU: Gunakan 'new Option(text, value)' untuk mencetak elemen <option> jauh lebih singkat.
tahun.forEach((tahunNama) => {
    const option = new Option(tahunNama, tahunNama);
    tahunAwalSelect.appendChild(option);
    tahunAkhirSelect.appendChild(option.cloneNode(true));
});

bulan.forEach((bulanNama, index) =>{
    let option = new Option(bulanNama, index + 1);
    bulanAwalSelect.appendChild(option);
    bulanAkhirSelect.appendChild(option.cloneNode(true));
});

checkboxBulanSaja.addEventListener("change", (e) => {
    statusCheckboxBulanSaja = e.target.checked; 
    containerTanggalAkhir.classList.toggle("hidden");
});       

checkboxBulanBerjalan.addEventListener("change", (e) => statusCheckboxBulanBerjalan = e.target.checked);  

const showLampiranContainer = () => {
    fetch('../temp.html')
    .then(response => response.text())
    .then(data => {
        containerLampiran.innerHTML = data;
    });

    var opt = {
        margin:       0.5, // Beri margin agar tidak mepet tepi (dalam satuan inci)
        filename:     'Lampiran_Rekonsiliasi.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        // pagebreak mode 'avoid-all' dan 'css' sangat ampuh mencegah elemen terpotong
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }, 
        html2canvas:  { 
            scale: 2, // Scale 2 membuat hasil PDF tajam, tidak buram
            useCORS: true, // Wajib jika ada gambar/logo dari luar agar tidak hilang
            scrollY: 0 // Mencegah bug terpotong kalau user sedang men-scroll web
        },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(containerLampiran).save();
}

fetch('../temp.html')
    .then(response => response.text())
    .then(data => {
        containerLampiran.innerHTML = data;
    });

    

// event ketika konfirmasi button diklik
konfirmasiButton.addEventListener("click", () => {
    // mengisi variabel dengan nilai yang dipilih saat ini
    const selectedBulanAwalIndex = bulanAwalSelect.value;
    const selectedTahunAwalIndex = tahunAwalSelect.value;
    const selectedBulanAkhirIndex = bulanAkhirSelect.value;
    const selectedTahunAkhirIndex = tahunAkhirSelect.value;
    const kelasDipilih = kelasDipilihSpan.value;
    

    let bulanTahunAwal = "";
    let bulanTahunAkhir = "";
    let namaBulanAwalDipilih = "";
    let namaBulanAkhirDipilih = "";
   
    const statusCheckDropdown = Boolean(selectedBulanAwalIndex && selectedTahunAwalIndex && (statusCheckboxBulanSaja || (selectedBulanAkhirIndex && selectedTahunAkhirIndex)))

    if(!statusCheckDropdown) {
        rentangDipilihSpan.textContent = "Belum ada rentang yang dipilih";
        iuranDipilihSpan.textContent = `-`;
        bulanDipilihSpan.textContent = `-`;
        return;
    }

    if(kelasDipilihSpan.value == "0") {
        rentangDipilihSpan.textContent = "Pilih Kelas Terlebih Dahulu";
        return;
    }

    // cek kalo bulan awal yang dipilih cuma 1 digit, tambahin 0 di depannya
    namaBulanAwalDipilih = monthFormat(selectedBulanAwalIndex);
    namaBulanAkhirDipilih = monthFormat(selectedBulanAkhirIndex);

    // cek kalo bulan akhir yang dipilih lebih kecil dari bulan awal, kasih tau user
    if(!statusCheckboxBulanSaja && parseInt(selectedTahunAkhirIndex + namaBulanAkhirDipilih) < parseInt(selectedTahunAwalIndex + namaBulanAwalDipilih)) {
        rentangDipilihSpan.textContent = "Tanggal akhir harus lebih besar dari tanggal awal";
        return;
    }

    bulanTahunAwal = `${selectedTahunAwalIndex}-${namaBulanAwalDipilih}`;
    bulanTahunAkhir = `${selectedTahunAkhirIndex}-${namaBulanAkhirDipilih}`;

    let rentangDipilihText = statusCheckboxBulanSaja ? `${bulanTahunAwal}` :`${bulanTahunAwal} s.d. ${bulanTahunAkhir}`;

    let [jumlah, jumlahBulan] = jumlahIuran(selectedBulanAwalIndex, selectedTahunAwalIndex, selectedBulanAkhirIndex, selectedTahunAkhirIndex, kelasDipilih, statusCheckboxBulanSaja, statusCheckboxBulanBerjalan); //variabel untuk menyimpan jumlah iuran yang harus dibayar

    // cek kalo bulan lah lebih dari 24 bulan
    if(jumlahBulan > 24) {
        rentangDipilihSpan.textContent = "Tunggakan tidak mungkin melebihi 24 bulan";
        return;
    }

    // cek apakah ada bulan berjalan
    if(statusCheckboxBulanBerjalan) {
        jumlahBulan += 1;
        rentangDipilihText += ` dan ${currentYear}-${monthFormat(currentMonth)}`; // tambahin bulan berjalan ke rentan  g yang dipilih
    } 

    rentangDipilihSpan.textContent = rentangDipilihText;
    iuranDipilihSpan.textContent = `Rp  ${jumlah.toLocaleString("id-ID")}`;
    bulanDipilihSpan.textContent = `${jumlahBulan} bulan`;

    showLampiranContainer();
});





