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
var selectedBulanAwalIndex = bulanAwalSelect.value;
var selectedTahunAwalIndex = tahunAwalSelect.value;
var selectedBulanAkhirIndex = bulanAkhirSelect.value;
var selectedTahunAkhirIndex = tahunAkhirSelect.value;

var bulanTahunAwal = "";
var bulanTahunAkhir = "";

// event ketika konfirmasi button diklik
konfirmasiButton.addEventListener("click", function () {
    var namaBulanAwalDipilih = "";
    var namaBulanAkhirDipilih = "";

    // kalau setiap dropdown sudah dipilih, maka tampilkan rentang yang dipilih
    if (
        selectedBulanAwalIndex &&
        selectedTahunAwalIndex &&
        selectedBulanAkhirIndex &&
        selectedTahunAkhirIndex
    ) {
        // cek kalo bulan awal yang dipilih cuma 1 digit, tambahin 0 di depannya
        if (selectedBulanAwalIndex.length == 1) {
            namaBulanAwalDipilih = "0" + selectedBulanAwalIndex;
            namaBulanAkhirDipilih = "0" + selectedBulanAkhirIndex;
        }

        bulanTahunAwal = selectedTahunAwalIndex + "-" + namaBulanAwalDipilih;
        bulanTahunAkhir = selectedTahunAkhirIndex + "-" + namaBulanAkhirDipilih;

        rentangDipilihSpan.textContent = bulanTahunAwal + " s.d. " + bulanTahunAkhir;

        var i = selectedBulanAwalIndex;
        var y = 0;
        while (i <= selectedBulanAkhirIndex) {
            console.log(selectedTahunAwalIndex+"-"+i)

            // pr : tambahkan fungsi menambah angka 0 di depan bulan 1 digit
            y += cekTarifBulan(selectedTahunAwalIndex+"-0"+i, "Kelas III");
            i++;
        }
        console.log(y);
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

// html2pdf(element);

