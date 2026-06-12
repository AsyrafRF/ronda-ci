#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 1. Tentukan pengaturan standar (default) jika user tidak membuat file config
const DEFAULT_CONFIG = {
  optimize: {
    images: true,
    minifyHtml: true
  },
  budgets: {
    performance: 90,
    accessibility: 95
  }
};

async function main() {
  console.log("👮‍♂️ Ronda-CI sedang bersiap untuk berpatroli...");

  // 2. Ambil lokasi folder tempat user menjalankan perintah npx ronda-ci
  const userProjectRoot = process.cwd();
  const configPath = path.join(userProjectRoot, 'ronda.config.json');

  let userConfig = { ...DEFAULT_CONFIG };

  // 3. Coba membaca file ronda.config.json milik pengguna
  if (fs.existsSync(configPath)) {
    try {
      const fileData = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = JSON.parse(fileData);
      
      // Menggabungkan config user dengan config default
      userConfig = {
        optimize: { ...DEFAULT_CONFIG.optimize, ...parsedConfig.optimize },
        budgets: { ...DEFAULT_CONFIG.budgets, ...parsedConfig.budgets }
      };
      
      console.log("📄 Berhasil memuat konfigurasi dari 'ronda.config.json'.");
    } catch (error) {
      console.error("❌ Gagal membaca file ronda.config.json. Format JSON mungkin salah.");
      process.exit(1); // Hentikan proses CI/CD karena ada error config
    }
  } else {
    console.log("⚠️  File 'ronda.config.json' tidak ditemukan. Menggunakan pengaturan standar.");
  }

  // 4. Jalankan tugas patroli berdasarkan konfigurasi yang ada
  console.log("\n🔍 Memulai pengecekan kualitas web...");
  
  if (userConfig.optimize.images) {
    console.log("📸 [Tugas] Mengoptimalkan ukuran gambar...");
    // Panggil fungsi optimasi gambar Anda di sini
  }

  if (userConfig.optimize.minifyHtml) {
    console.log("📝 [Tugas] Mengecilkan (minify) file HTML...");
    // Panggil fungsi minify HTML Anda di sini
  }

  console.log(`\n🎯 Batas minimum skor performa: ${userConfig.budgets.performance}`);

  // 5. Simulasi selesai patroli dengan sukses
  console.log("\n✅ Ronda-CI selesai! Semua kualitas kode aman untuk dirilis.");
  process.exit(0); 
}

main();
