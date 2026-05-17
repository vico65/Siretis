export let data = [
  {
    "periode_mulai": "2014-01",
    "periode_akhir": "2016-03",
    "tarif": { "1": 59500, "2": 42000, "3": 25500 }
  },
  {
    "periode_mulai": "2016-04",
    "periode_akhir": "2018-12",
    "tarif": { "1": 80000, "2": 51000, "3": 25500 }
  },
  {
    "periode_mulai": "2019-01",
    "periode_akhir": "2019-12",
    "tarif": { "1": 80000, "2": 51000, "3": 25500 }
  },
  {
    "periode_mulai": "2020-01",
    "periode_akhir": "2020-03",
    "tarif": { "1": 160000, "2": 110000, "3": 42000 }
  },
  {
    "periode_mulai": "2020-04",
    "periode_akhir": "2020-06",
    "tarif": { "1": 80000, "2": 51000, "3": 25500 }
  },
  {
    "periode_mulai": "2020-07",
    "periode_akhir": "2020-12",
    "tarif": { "1": 150000, "2": 100000, "3": 25500 }
  },
  {
    "periode_mulai": "2021-01",
    "periode_akhir": "9999-12", 
    "tarif": { "1": 150000, "2": 100000, "3": 35000 }
  }
]

export const bulan = [
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

export const tahun = [
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

export const monthFormat = (bulan) => String(bulan).padStart(2, '0');

export const cekTarifBulan = (bulanDicari, kelasDicari) => {
    const dataDitemukan = data.find(
        item => bulanDicari >= item.periode_mulai && bulanDicari <= item.periode_akhir
    );
    return dataDitemukan?.tarif[kelasDicari] ?? 0;
}

export const jumlahIuran = (bulanAwal, tahunAwal, bulanAkhir, tahunAkhir, kelas, statusCheckboxBulanSaja, statusCheckboxBulanBerjalan) => {
    const tahunDefault = ["2021", "2022", "2023", "2024", "2025", "2026"];
    let jumlahBulan = !statusCheckboxBulanSaja ? (tahunAkhir - tahunAwal) * 12 + (bulanAkhir - bulanAwal) + 1 : 1;
    let jumlah = 0; //variabel untuk menyimpan jumlah iuran yang harus dibayar
    let currentMonth = new Date().getMonth() + 1; 
    let currentYear = 2026;

    if(tahunDefault.includes(tahunAwal) && (statusCheckboxBulanSaja || tahunDefault.includes(tahunAkhir))){
        jumlah += jumlahBulan * cekTarifBulan("2021-01", kelas);
    } else {
        let i = parseInt(bulanAwal);
        let y = parseInt(tahunAwal);

        for(let step = 0; step < jumlahBulan; step++) {
            jumlah += cekTarifBulan(`${y}-${monthFormat(i.toString())}`, kelas);

            // cek apakah bulannyo lah lebih dari 12
            if(i == 12) {
                i = 1;
                y+=1;
            } else i++;
        }
    }

    if(statusCheckboxBulanBerjalan) {
        jumlah += cekTarifBulan(`${currentYear}-${monthFormat(currentMonth)}`, kelas);
    } 

    return [jumlah, jumlahBulan];
}