import { test, expect } from 'vitest';
import { jumlahIuran } from "../public/js/iuran.js";

let datas = [
    { "bulanAwal" : 10,
    "tahunAwal" : 2025,
    "bulanAkhir" : 5,
    "tahunAkhir" : 2026,
    "kelas" : 1,
    "statusCheckboxSatuBulan" : false,
    "statusCheckboxBulanBerjalan" : false,
    "iuranHarus" : 1200000
    }, 
    {
    "bulanAwal" : 4,
    "tahunAwal" : 2026,
    "bulanAkhir" : 0,
    "tahunAkhir" : 2026,
    "kelas" : 3,
    "statusCheckboxSatuBulan" : true,
    "statusCheckboxBulanBerjalan" : false,
    "iuranHarus" : 35000
    },
    {
    "bulanAwal" : 4,
    "tahunAwal" : 2026,
    "bulanAkhir" : 5,
    "tahunAkhir" : 2026,
    "kelas" : 1,
    "statusCheckboxSatuBulan" : false,
    "statusCheckboxBulanBerjalan" : false,
    "iuranHarus" : 300000
    },
    {
    "bulanAwal" : 8,
    "tahunAwal" : 2025,
    "bulanAkhir" : 4,
    "tahunAkhir" : 2026,
    "kelas" : 1,
    "statusCheckboxSatuBulan" : false,
    "statusCheckboxBulanBerjalan" : false,
    "iuranHarus" : 1350000
    },
]

test("Test jumlah iuran", () => {
    datas.forEach(data => {
        expect(jumlahIuran(data.bulanAwal, data.tahunAwal, data.bulanAkhir, data.tahunAkhir, data.kelas, data.statusCheckboxSatuBulan, data.statusCheckboxBulanBerjalan)[0]).toBe(data.iuranHarus);
    })
})