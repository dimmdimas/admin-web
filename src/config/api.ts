// src/config/api.ts

// Cukup ubah URL ini jika server pindah domain!
export const BASE_URL = 'https://api.muhdimas.my.id/api';

export const API_ENDPOINTS = {
  // Ambil Tanggal
  date: (day: string) => `${BASE_URL}/date?targetDay=${day}`,
  
  // Kelola User
  users: `${BASE_URL}/users`,
  userByNik: (nik: string) => `${BASE_URL}/users/${nik}`,
  
  // Monitoring
  monitoring: (day: string) => `${BASE_URL}/monitoring/status?day=${day}`,
  listUsers: `${BASE_URL}/list-users`,
  
  // Form Lembur & Submit
  day1: `${BASE_URL}/day1`,
  day2: `${BASE_URL}/day2`,
  exportExcel: (day: string, nikOSH: string, nikManager: string, nikHRD: string) => 
    `${BASE_URL}/export-excel/${day}?nikOSH=${nikOSH}&nikManager=${nikManager}&nikHRD=${nikHRD}`
};