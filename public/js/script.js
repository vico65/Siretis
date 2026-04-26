import { data } from "./iuran.js";

console.log("JS loaded");

var bulan = [
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

var tahun = [
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
var bulanAwalSelect = document.getElementById("bulan_awal_select");
var bulanAkhirSelect = document.getElementById("bulan_akhir_select");

var rentangDipilihSpan = document.querySelector(".rentang_dipilih");
var bulanDipilihSpan = document.querySelector(".bulan_dipilih");
var iuranDipilihSpan = document.querySelector(".iuran_dipilih");

var tahunAwalSelect = document.getElementById("tahun_awal_select");
var tahunAkhirSelect = document.getElementById("tahun_akhir_select");
var konfirmasiButton = document.getElementById("konfirmasi_button");

// isi dropdown tahun
tahun.forEach(function (tahunNama) {
    var option = document.createElement("option");
    option.value = tahunNama; // Nilai tahun
    option.text = tahunNama; // Nama tahun
    tahunAwalSelect.appendChild(option);
    tahunAkhirSelect.appendChild(option.cloneNode(true));
});

// isi dropdown bulan
bulan.forEach(function (bulanNama, index) {
    var option = document.createElement("option");
    option.value = index + 1; // Nilai bulan (1-12)
    option.text = bulanNama; // Nama bulan
    bulanAwalSelect.appendChild(option);
    bulanAkhirSelect.appendChild(option.cloneNode(true));
});

// mengisi variabel dengan nilai yang dipilih saat ini
var selectedBulanAwalIndex = "";
var selectedTahunAwalIndex = "";
var selectedBulanAkhirIndex = "";
var selectedTahunAkhirIndex = "";
var bulanTahunAwal = "";
var bulanTahunAkhir = "";

// event ketika konfirmasi button diklik
konfirmasiButton.addEventListener("click", function () {
    selectedBulanAwalIndex = bulanAwalSelect.value;
    selectedTahunAwalIndex = tahunAwalSelect.value;
    selectedBulanAkhirIndex = bulanAkhirSelect.value;
    selectedTahunAkhirIndex = tahunAkhirSelect.value;
    var namaBulanAwalDipilih = "";
    var namaBulanAkhirDipilih = "";

    // kalau setiap dropdown sudah dipilih, maka tampilkan rentang yang dipilih
    if (
        selectedBulanAwalIndex &&
        selectedTahunAwalIndex &&
        selectedBulanAkhirIndex &&
        selectedTahunAkhirIndex
    ) {
        // cek kalo bulan akhir yang dipilih lebih kecil dari bulan awal, kasih tau user
        if(selectedBulanAkhirIndex < selectedBulanAwalIndex || selectedTahunAkhirIndex < selectedTahunAwalIndex) {
            rentangDipilihSpan.textContent = "Tanggal akhir harus lebih besar dari tanggal awal";
            return;
        }

        // cek kalo bulan awal yang dipilih cuma 1 digit, tambahin 0 di depannya
        namaBulanAwalDipilih = monthFormat(selectedBulanAwalIndex);
        namaBulanAkhirDipilih = monthFormat(selectedBulanAkhirIndex);

        bulanTahunAwal = selectedTahunAwalIndex + "-" + namaBulanAwalDipilih;
        bulanTahunAkhir = selectedTahunAkhirIndex + "-" + namaBulanAkhirDipilih;

        rentangDipilihSpan.textContent = bulanTahunAwal + " s.d. " + bulanTahunAkhir;

        var i = selectedBulanAwalIndex;
        var y = selectedTahunAwalIndex;
        var jumlahIuran = 0;

        console.log(i)

        if (selectedTahunAwalIndex != selectedTahunAkhirIndex) {
            while (i <= 12) {
                jumlahIuran += cekTarifBulan(y + "-" + monthFormat(i), "Kelas III");
                i++;
            }
        } 

        // while (i <= selectedBulanAkhirIndex) {
        //     jumlahIuran += cekTarifBulan(selectedTahunAwalIndex+monthFormat(i), "Kelas III");
        //     i++;
        // }
        iuranDipilihSpan.textContent = "Rp " + jumlahIuran.toLocaleString("id-ID");
        bulanDipilihSpan.textContent = selectedBulanAkhirIndex - selectedBulanAwalIndex + 1 + " bulan";
    } else {
        rentangDipilihSpan.textContent = "Belum ada rentang yang dipilih";
    }
});

function cekTarifBulan(bulanDicari, kelasDicari) {
    // Cari di array mana bulan ini berada
    const dataDitemukan = data.find(
        (item) =>
            bulanDicari >= item.periode_mulai &&
            bulanDicari <= item.periode_akhir,
    );

    if (dataDitemukan) {
        return dataDitemukan.tarif[kelasDicari];
    } else {
        return "Tarif tidak ditemukan";
    }
}

function monthFormat(bulan) {
    if (bulan.length == 1) {
        return "0" + bulan;
    } else {
        return bulan;
    }
}

// html2pdf(element);

