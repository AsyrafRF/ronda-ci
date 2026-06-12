#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Pengaturan standar (default) jika user tidak membuat file config
const DEFAULT_CONFIG = {
  optimize: {
    images: true,
    minifyHtml: true
  },
  budgets: {
    performance: 90
  }
};

// ==========================================
// FUNGSI 1: MENGOPTIMALKAN UKURAN GAMBAR
// ==========================================
async function optimizeImages() {
  const targetDir = path.join(process.cwd(), 'dist', 'images'); // Asumsi folder output web user
  
  if (!fs.existsSync(targetDir)) {
    console.log("⚠️  Folder 'dist/images' tidak ditemukan. Lewati optimasi gambar.");
    return;
  }

  const files = fs.readdirSync(targetDir);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  if (imageFiles.length === 0) {
    console.log("📸 Tidak ada gambar JPG/PNG yang perlu dioptimalkan.");
    return;
  }

  console.log(`📸 Menemukan ${imageFiles.length} gambar. Mulai kompresi...`);

  for (const file of imageFiles) {
    const filePath = path.join(targetDir, file);
    const tempPath = path.join(targetDir, `opt-${file}`);

    try {
      // Mengompres gambar ke kualitas 80% tanpa merusak visual secara drastis
      await sharp(filePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(tempPath);

      // Ganti file lama dengan file yang sudah dikompres
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      console.log(`   ✅ ${file} berhasil dikompres!`);
    } catch (err) {
      console.error(`   ❌ Gagal mengoptimalkan gambar ${file}:`, err.message);
    }
  }
}

// ==========================================
// FUNGSI 2: CEK SKOR PERFORMA (GOOGLE PSI)
// ==========================================
async function checkPerformanceBudget(targetScore) {
  // Catatan: Di CI/CD asli, user biasanya memasang URL staging sementara mereka
  const urlToTest = "https://example.com"; 
  console.log(`🌐 Meminta Google PageSpeed Insights untuk menganalisis: ${urlToTest}...`);

  try {
    const apiUrl = `https://googleapis.com{encodeURIComponent(urlToTest)}&category=PERFORMANCE`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Mengambil skor performa (Skala API adalah 0 sampai 1.0, jadi kita kali 100)
    const currentScore = Math.round(data.lighthouseResult.categories.performance.score * 100);
    console.log(`📊 Skor Performa Saat Ini: ${currentScore}/100`);

    if (currentScore < targetScore) {
      console.error(`❌ GAGAL: Skor Performa (${currentScore}) di bawah batas minimum Anda (${targetScore})!`);
      return false; // Angka anggaran bocor
    }

    console.log(`🎉 AMAN: Skor Performa memenuhi anggaran kualitas Anda.`);
    return true;
  } catch (error) {
    console.error("❌ Gagal terhubung ke Google PageSpeed API:", error.message);
    return false;
  }
}

// ==========================================
// ALUR UTAMA (MAIN FLOW)
// ==========================================
async function main() {
  console.log("👮‍♂️ Ronda-CI sedang bersiap untuk berpatroli...");

  const userProjectRoot = process.cwd();
  const configPath = path.join(userProjectRoot, 'ronda.config.json');
  let userConfig = { ...DEFAULT_CONFIG };

  // Membaca file konfigurasi user jika ada
  if (fs.existsSync(configPath)) {
    try {
      const fileData = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = JSON.parse(fileData);
      userConfig = {
        optimize: { ...DEFAULT_CONFIG.optimize, ...parsedConfig.optimize },
        budgets: { ...DEFAULT_CONFIG.budgets, ...parsedConfig.budgets }
      };
      console.log("📄 Berhasil memuat konfigurasi dari 'ronda.config.json'.");
    } catch (error) {
      console.error("❌ Gagal membaca file ronda.config.json. Format JSON salah.");
      process.exit(1);
    }
  }

  console.log("\n🔍 Memulai pengecekan kualitas web...");
  
  // 1. Jalankan kompresi gambar jika aktif
  if (userConfig.optimize.images) {
    await optimizeImages();
  }

  // 2. Jalankan audit performa web
  const isPerformancePassed = await checkPerformanceBudget(userConfig.budgets.performance);

  // 3. Penentu kelulusan pipa CI/CD
  if (!isPerformancePassed) {
    console.log("\n🛑 Ronda-CI: Build dihentikan karena kualitas tidak memenuhi standar.");
    process.exit(1); // Menghentikan CI/CD dengan error
  }

  console.log("\n✅ Ronda-CI selesai! Semua kualitas kode aman untuk dirilis.");
  process.exit(0); // CI/CD sukses dan berlanjut
}

main();
