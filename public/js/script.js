import { data, bulan, tahun } from "./iuran.js";

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

// padStart(). =  otomatis memastikan string panjangnya 2 karakter, jika kurang ditambah "0" di depannya.
const monthFormat = (bulan) => String(bulan).padStart(2, '0');

// 1. Tanda '?.' (Optional Chaining) akan mengecek: apakah 'dataDitemukan' ada isinya? 
//    Jika tidak ada, dia tidak akan membuat program error, melainkan otomatis menghasilkan 'undefined'.
// 2. Tanda '??' (Nullish Coalescing) akan mengecek: jika nilai di sebelah kirinya 'undefined' atau 'null', 
//    maka gunakan nilai di sebelah kanannya (yaitu angka 0).
const cekTarifBulan = (bulanDicari, kelasDicari) => {
    const dataDitemukan = data.find(
        item => bulanDicari >= item.periode_mulai && bulanDicari <= item.periode_akhir
    );
    return dataDitemukan?.tarif[kelasDicari] ?? 0;
}

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

// event ketika konfirmasi button diklik
konfirmasiButton.addEventListener("click", () => {
    // mengisi variabel dengan nilai yang dipilih saat ini
    const selectedBulanAwalIndex = bulanAwalSelect.value;
    const selectedTahunAwalIndex = tahunAwalSelect.value;
    const selectedBulanAkhirIndex = bulanAkhirSelect.value;
    const selectedTahunAkhirIndex = tahunAkhirSelect.value;
    const kelasDipilih = kelasDipilihSpan.value;
    const tahunDefault = ["2021", "2022", "2023", "2024", "2025", "2026"];

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
    const jumlahTahunRekon = selectedTahunAkhirIndex - selectedTahunAwalIndex;
    let jumlahBulan = !statusCheckboxBulanSaja ? hitungJumlahBulanRekon(selectedBulanAwalIndex, selectedBulanAkhirIndex, selectedTahunAwalIndex, selectedTahunAkhirIndex, jumlahTahunRekon) : 1;

    // cek kalo bulan lah lebih dari 24 bulan
    if(jumlahBulan > 24) {
        rentangDipilihSpan.textContent = "Tunggakan tidak mungkin melebihi 24 bulan";
        return;
    }

    let i = parseInt(selectedBulanAwalIndex);
    let y = parseInt(selectedTahunAwalIndex);
    let z = 0; //z digunakan dalam perulangan tahun
    let jumlahIuran = 0; //variabel untuk menyimpan jumlah iuran yang harus dibayar

    if(tahunDefault.includes(selectedTahunAwalIndex) && (statusCheckboxBulanSaja || tahunDefault.includes(selectedTahunAkhirIndex))){
        jumlahIuran += jumlahBulan * cekTarifBulan("2021-01", kelasDipilih);
    } else {
        while(true) {
            jumlahIuran += cekTarifBulan(`${y}-${monthFormat(i.toString())}`, kelasDipilih);

            // cek apakah sudah di tahun terakhir dan bulan terakhir
            if(i == selectedBulanAkhirIndex && y == selectedTahunAkhirIndex) break;

            // cek apakah bulannyo lah lebih dari 12
            if(i == 12) {
                i = 1;
                y+=1;
            } else i++;
        }
    }

    // cek apakah ada bulan berjalan
    if(statusCheckboxBulanBerjalan) {
        jumlahBulan += 1;
        rentangDipilihText += ` dan ${currentYear}-${monthFormat(currentMonth)}`; // tambahin bulan berjalan ke rentang yang dipilih
        jumlahIuran += cekTarifBulan(`${currentYear}-${monthFormat(currentMonth)}`, kelasDipilih);
    } 

    rentangDipilihSpan.textContent = rentangDipilihText;
    iuranDipilihSpan.textContent = `Rp ${jumlahIuran.toLocaleString("id-ID")}`;
    bulanDipilihSpan.textContent = `${jumlahBulan} bulan`;
    
});





// fungsi menghitung jumlah bulan rekon
const hitungJumlahBulanRekon = (bulanAwal, bulanAkhir, tahunAwal, tahunAkhir, jumlahTahunRekon) => {
        let i = parseInt(bulanAwal);
        let y = parseInt(tahunAwal);
        let total = 0;

        let z = 0; //z digunakan dalam perulangan tahun
        let jumlahBulan = 0; //jumlahBulan digunakan untuk menghitung jumlah bulan yang dipilih

        while(z <= jumlahTahunRekon) {
            
            jumlahBulan++;
            // cek apakah sudah di tahun terakhir dan bulan terakhir
            if(i == bulanAkhir && y == tahunAkhir) break;

            // cek apakah bulannyo lah lebih dari 12
            if(i == 12) {
                i = 1;
                z+=1;
                y+=1;
            } else {
                i++;
            }
        }
        return jumlahBulan;
}



// html2pdf(element);

