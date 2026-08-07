import React from 'react';
import { HelpCircle, Play, Dices, BookOpen, Award, Sparkles } from 'lucide-react';

export const HowToPlayView: React.FC = () => {
  const steps = [
    {
      no: '1',
      title: 'Pembagian Kelompok',
      desc: 'Guru membagi kelas menjadi 2 hingga 6 kelompok dan memasukkan nama kelompok pada menu Persiapan.',
      icon: '👥',
    },
    {
      no: '2',
      title: 'Pemilihan Bank Soal',
      desc: 'Guru dapat memilih materi/bab dan tingkat kesulitan soal yang ingin dimainkan.',
      icon: '📚',
    },
    {
      no: '3',
      title: 'Bidak Berbeda Setiap Kelompok',
      desc: 'Setiap kelompok mendapatkan bidak berwarna khusus (Garuda, Nusantara, Pancasila, dll).',
      icon: '🔴',
    },
    {
      no: '4',
      title: 'Kocok Dadu Digital',
      desc: 'Kelompok bergiliran menekan tombol 🎲 KOCOK DADU untuk mendapatkan angka 1 hingga 6 secara acak.',
      icon: '🎲',
    },
    {
      no: '5',
      title: 'Pergerakan Bidak',
      desc: 'Bidak bergerak secara otomatis kotak demi kotak sesuai angka dadu yang diperoleh.',
      icon: '🏃',
    },
    {
      no: '6',
      title: 'Menjawab Soal PPKn',
      desc: 'Ketika berhenti di kotak soal, popup pertanyaan muncul. Kelompok harus menjawab sebelum timer habis!',
      icon: '❓',
    },
    {
      no: '7',
      title: 'Poin Jawaban & Streak Bonus',
      desc: 'Jawaban benar mendapatkan +10 poin (atau 2x poin pada kotak khusus). Jawaban benar 3x berturut-turut mendapat bonus +10 poin!',
      icon: '⭐',
    },
    {
      no: '8',
      title: 'Fitur Tangga 🪜',
      desc: 'Mendarat di bawah tangga membuat bidak otomatis meluncur NAIK TANGGA ke kotak atas dan mendapat +5 poin bonus.',
      icon: '🪜',
    },
    {
      no: '9',
      title: 'Fitur Ular 🐍',
      desc: 'Mendarat di kepala ular membuat bidak meluncur TURUN ke ekor ular dan mendapat penalti -5 poin.',
      icon: '🐍',
    },
    {
      no: '10',
      title: 'Kondisi Menang 🏆',
      desc: 'Kelompok pertama yang mencapai Kotak 50 (FINISH) menjadi PEMENANG permainan!',
      icon: '🏆',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-6 rounded-3xl shadow-xl border-4 border-amber-400">
        <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" /> PANDUAN KELAS
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
          📖 CARA BERMAIN ULAR TANGGA PPKn
        </h1>
        <p className="text-xs sm:text-sm text-red-100 mt-1">
          Panduan langkah demi langkah penggunaan permainan di kelas menggunakan satu proyektor/laptop.
        </p>
      </div>

      {/* Grid of steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div
            key={step.no}
            className="bg-white rounded-2xl p-4 shadow-md border-2 border-slate-200 flex items-start gap-3 hover:border-amber-400 transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-red-950 font-black text-lg flex items-center justify-center shrink-0 shadow-xs border border-amber-500">
              {step.no}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-base text-slate-900">
                <span>{step.icon}</span>
                <h3>{step.title}</h3>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Tips Box */}
      <div className="bg-amber-50 rounded-3xl p-5 border-2 border-amber-300 space-y-2">
        <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" /> TIPS UNTUK GURU SAAT PEMBELAJARAN
        </h3>
        <ul className="list-disc list-inside text-xs font-semibold text-amber-900 space-y-1 leading-relaxed">
          <li>Tampilkan layar laptop di proyektor kelas agar seluruh kelompok siswa dapat melihat papan dengan jelas.</li>
          <li>Gunakan perwakilan siswa dari setiap kelompok secara bergiliran untuk menekan tombol kocok dadu di laptop.</li>
          <li>Ajak seluruh anggota kelompok berdiskusi selama timer 20 detik sebelum memberikan jawaban akhir.</li>
          <li>Gunakan fitur Bank Soal untuk menambahkan soal latihan baru sesuai Bab yang sedang dipelajari minggu ini.</li>
        </ul>
      </div>
    </div>
  );
};
