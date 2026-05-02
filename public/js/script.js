import { data } from "./iuran.js";

console.log("JS loaded");

let bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

let tahun = [
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
];

// deklarasi elemen-elemen yang dibutuhkan
let bulanAwalSelect = document.getElementById("bulan_awal_select");
let bulanAkhirSelect = document.getElementById("bulan_akhir_select");

let rentangDipilihSpan = document.querySelector(".rentang_dipilih");
let bulanDipilihSpan = document.querySelector(".bulan_dipilih");
let iuranDipilihSpan = document.querySelector(".iuran_dipilih");

let tahunAwalSelect = document.getElementById("tahun_awal_select");
let tahunAkhirSelect = document.getElementById("tahun_akhir_select");
let konfirmasiButton = document.getElementById("konfirmasi_button");

let checkboxBulanSaja = document.getElementById("checkbox_bulan");
let statusCheckboxBulanSaja = false; //variabel untuk menyimpan status checkbox bulan saja
let containerTanggalAkhir = document.getElementById("container_tanggal_akhir"); 


// isi dropdown tahun
tahun.forEach(function (tahunNama) {
    let option = document.createElement("option");
    option.value = tahunNama; // Nilai tahun
    option.text = tahunNama; // Nama tahun
    tahunAwalSelect.appendChild(option);
    tahunAkhirSelect.appendChild(option.cloneNode(true));
});

// isi dropdown bulan
bulan.forEach(function (bulanNama, index) {
    let option = document.createElement("option");
    option.value = index + 1; // Nilai bulan (1-12)
    option.text = bulanNama; // Nama bulan
    bulanAwalSelect.appendChild(option);
    bulanAkhirSelect.appendChild(option.cloneNode(true));
});

// event ketika checbox dipencet
checkboxBulanSaja.addEventListener("change", (e) => {
    if(checkboxBulanSaja.checked) {
        statusCheckboxBulanSaja = true;
        containerTanggalAkhir.classList.add("hidden");
    } else {
        statusCheckboxBulanSaja = false;
        containerTanggalAkhir.classList.remove("hidden");
    }
});                  

// event ketika konfirmasi button diklik
konfirmasiButton.addEventListener("click", () => {

    // mengisi variabel dengan nilai yang dipilih saat ini
    let selectedBulanAwalIndex = "";
    let selectedTahunAwalIndex = "";
    let selectedBulanAkhirIndex = "";
    let selectedTahunAkhirIndex = "";
    let bulanTahunAwal = "";
    let bulanTahunAkhir = "";

    selectedBulanAwalIndex = bulanAwalSelect.value;
    selectedTahunAwalIndex = tahunAwalSelect.value;
    selectedBulanAkhirIndex = bulanAkhirSelect.value;
    selectedTahunAkhirIndex = tahunAkhirSelect.value;

    let namaBulanAwalDipilih = "";
    let namaBulanAkhirDipilih = "";
    let statusCheckDropdown = statusCheckboxBulanSaja ?  selectedBulanAwalIndex && selectedTahunAwalIndex : selectedBulanAwalIndex && selectedTahunAwalIndex && selectedBulanAkhirIndex && selectedTahunAkhirIndex;
    console.log(statusCheckDropdown);
    console.log(selectedBulanAwalIndex, selectedTahunAwalIndex, selectedBulanAkhirIndex, selectedTahunAkhirIndex);

    // kalau setiap dropdown sudah dipilih, maka tampilkan rentang yang dipilih
    if (statusCheckDropdown) {
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
        rentangDipilihSpan.textContent = statusCheckboxBulanSaja ? `${bulanTahunAwal}` :`${bulanTahunAwal} s.d. ${bulanTahunAkhir}`;

        const jumlahTahunRekon = selectedTahunAkhirIndex - selectedTahunAwalIndex;
        let x = !statusCheckboxBulanSaja ? hitungJumlahBulanRekon(selectedBulanAwalIndex, selectedBulanAkhirIndex, selectedTahunAwalIndex, selectedTahunAkhirIndex, bulanTahunAwal, bulanTahunAkhir, jumlahTahunRekon) : 1;

        // cek kalo bulan lah lebih dari 24 bulan
        if(x > 24) {
            rentangDipilihSpan.textContent = "Tunggakan tidak mungkin melebihi 24 bulan";
            return;
        }

        let i = parseInt(selectedBulanAwalIndex);
        let y = parseInt(selectedTahunAwalIndex);
        let z = 0; //z digunakan dalam perulangan tahun
        let jumlahIuran = 0;

        // tahun 2021 - 2026 itu tarifnya sama
        let tahunDefault = ["2021", "2022", "2023", "2024", "2025", "2026"];
        if(tahunDefault.includes(selectedTahunAwalIndex) || (tahunDefault.includes(selectedTahunAkhirIndex) && !statusCheckboxBulanSaja)) {
            jumlahIuran = x * cekTarifBulan("2021-01", "Kelas III");
        } else {
            while(z <= jumlahTahunRekon) {
                jumlahIuran += cekTarifBulan(`${y}-${monthFormat(i.toString())}`, "Kelas III");
    
                // cek apakah sudah di tahun terakhir dan bulan terakhir
                if(i == selectedBulanAkhirIndex && y == selectedTahunAkhirIndex) break;
    
                // cek apakah bulannyo lah lebih dari 12
                if(i == 12) {
                    i = 1;
                    z+=1;
                    y+=1;
                } else {
                    i++;
                }
            }
        }
        iuranDipilihSpan.textContent = `Rp ${jumlahIuran.toLocaleString("id-ID")}`;
        bulanDipilihSpan.textContent = `${x} bulan`;
    } else {
        rentangDipilihSpan.textContent = "Belum ada rentang yang dipilih";
        iuranDipilihSpan.textContent = `-`;
        bulanDipilihSpan.textContent = `-`;
    }
});

const cekTarifBulan = (bulanDicari, kelasDicari) => {
    const dataDitemukan = data.find(
        (item) =>
            bulanDicari >= item.periode_mulai &&
            bulanDicari <= item.periode_akhir
    );

    return dataDitemukan ? dataDitemukan.tarif[kelasDicari] : "Tarif tidak ditemukan";
}

const monthFormat = (bulan) => {
    // ATURAN BARU: Javascript sekarang punya fungsi padStart(). 
    // Ini otomatis memastikan string panjangnya 2 karakter, jika kurang ditambah "0" di depannya.
    return String(bulan).padStart(2, '0');
}

// fungsi menghitung jumlah bulan rekon
const hitungJumlahBulanRekon = (bulanAwal, bulanAkhir, tahunAwal, tahunAkhir, bulanTahunAwal, bulanTahunAkhir, jumlahTahunRekon) => {
        let i = parseInt(bulanAwal);
        let y = parseInt(tahunAwal);

        let z = 0; //z digunakan dalam perulangan tahun
        let x = 0; //x digunakan untuk menghitung jumlah bulan yang dipilih

        while(z <= jumlahTahunRekon) {
            
            x++;
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
        return x;
}

// html2pdf(element);

