import { jumlahIuran } from "./public/js/script.js";

test("Test jumlah iuran", () => {
    expect(jumlahIuran(10, 2025, 2026, 1, "A")).toBe(100000);
})