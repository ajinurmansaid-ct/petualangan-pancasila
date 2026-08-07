import React, { useState } from 'react';
import { Question, Difficulty, CorrectAnswerOption } from '../types';
import { parseCSVQuestions, exportQuestionsToCSV } from '../utils/csv';
import { CATEGORIES_LIST } from '../data/defaultData';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Shuffle,
  Copy,
  Download,
  Upload,
  BookOpen,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';

interface QuestionBankProps {
  questions: Question[];
  onSaveQuestions: (updated: Question[]) => void;
}

export const QuestionBankView: React.FC<QuestionBankProps> = ({ questions, onSaveQuestions }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // CSV Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importPreview, setImportPreview] = useState<Question[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Form Fields
  const [formData, setFormData] = useState<{
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: CorrectAnswerOption;
    category: string;
    difficulty: Difficulty;
    points: number;
    explanation: string;
  }>({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    category: 'Pancasila',
    difficulty: 'Mudah',
    points: 10,
    explanation: '',
  });

  // Filtered List
  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategoryFilter === 'all' || q.category === selectedCategoryFilter;
    const matchDifficulty =
      selectedDifficultyFilter === 'all' || q.difficulty === selectedDifficultyFilter;
    return matchSearch && matchCategory && matchDifficulty;
  });

  // Open Form for Create
  const handleOpenCreateForm = () => {
    setEditingQuestion(null);
    setFormData({
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      category: 'Pancasila',
      difficulty: 'Mudah',
      points: 10,
      explanation: '',
    });
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEditForm = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      category: q.category,
      difficulty: q.difficulty,
      points: q.points,
      explanation: q.explanation || '',
    });
    setIsFormOpen(true);
  };

  // Submit Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      alert('Pertanyaan tidak boleh kosong!');
      return;
    }
    if (
      !formData.optionA.trim() ||
      !formData.optionB.trim() ||
      !formData.optionC.trim() ||
      !formData.optionD.trim()
    ) {
      alert('Seluruh pilihan jawaban A, B, C, D harus diisi!');
      return;
    }

    if (editingQuestion) {
      // Update
      const updated = questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...formData } : q
      );
      onSaveQuestions(updated);
    } else {
      // Create new
      const newQuestion: Question = {
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...formData,
      };
      onSaveQuestions([newQuestion, ...questions]);
    }

    setIsFormOpen(false);
  };

  // Delete Question
  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
      onSaveQuestions(questions.filter((q) => q.id !== id));
    }
  };

  // Duplicate Question
  const handleDuplicate = (q: Question) => {
    const dup: Question = {
      ...q,
      id: `q_dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: `${q.text} (Salinan)`,
    };
    onSaveQuestions([dup, ...questions]);
  };

  // Shuffle Questions
  const handleShuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    onSaveQuestions(shuffled);
  };

  // File CSV Input Handler
  const handleCSVFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = parseCSVQuestions(content);
        setImportPreview(result.questions);
        setImportErrors(result.errors);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (importPreview.length === 0) return;
    onSaveQuestions([...importPreview, ...questions]);
    setIsImportModalOpen(false);
    setImportPreview([]);
    setImportErrors([]);
    alert(`Berhasil mengimpor ${importPreview.length} soal ke Bank Soal!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-6 rounded-3xl shadow-xl border-4 border-amber-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> BANK SOAL PPKn
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
            KELOLA SOAL PEMBELAJARAN
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-1">
            Tambah, edit, hapus, acak, import CSV, atau export bank soal untuk disesuaikan dengan kurikulum kelas.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-red-950 shadow-md border-b-2 border-amber-600 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>TAMBAH SOAL</span>
          </button>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-800 hover:bg-red-700 text-white border border-red-500 transition-all cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>ACAK</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 cursor-pointer shadow-xs">
            <Upload className="w-4 h-4" />
            <span>IMPORT CSV</span>
            <input type="file" accept=".csv" onChange={handleCSVFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => exportQuestionsToCSV(questions)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-700 hover:bg-blue-600 text-white border border-blue-500 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kata kunci soal / materi..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-900 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-900 focus:border-red-500 focus:outline-none"
        >
          <option value="all">Semua Materi ({questions.length})</option>
          {CATEGORIES_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficultyFilter}
          onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-900 focus:border-red-500 focus:outline-none"
        >
          <option value="all">Semua Tingkat Kesulitan</option>
          <option value="Mudah">Mudah</option>
          <option value="Sedang">Sedang</option>
          <option value="Sulit">Sulit</option>
        </select>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-100 text-xs font-black uppercase tracking-wider border-b text-slate-600">
              <tr>
                <th className="p-3 text-center w-12">No</th>
                <th className="p-3">Pertanyaan</th>
                <th className="p-3 w-36">Materi</th>
                <th className="p-3 w-28 text-center">Kesulitan</th>
                <th className="p-3 w-20 text-center">Poin</th>
                <th className="p-3 w-20 text-center">Kunci</th>
                <th className="p-3 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-500">
                    <p className="text-base font-bold">⚠️ Belum ada soal yang sesuai.</p>
                    <p className="text-xs mt-1">Silakan tambahkan soal baru atau sesuaikan kata kunci pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q, index) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900 line-clamp-2">{q.text}</p>
                      <div className="text-xs text-slate-500 mt-1 flex gap-2">
                        <span>A: {q.optionA}</span>
                        <span>• B: {q.optionB}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
                        {q.category}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full text-white ${
                          q.difficulty === 'Mudah'
                            ? 'bg-emerald-600'
                            : q.difficulty === 'Sedang'
                            ? 'bg-amber-600'
                            : 'bg-rose-600'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-3 text-center font-black text-amber-600">+{q.points}</td>
                    <td className="p-3 text-center">
                      <span className="font-extrabold bg-amber-400 text-red-950 px-2 py-0.5 rounded-lg text-xs shadow-xs">
                        {q.correctAnswer}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditForm(q)}
                          title="Edit Soal"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(q)}
                          title="Duplikasi Soal"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          title="Hapus Soal"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-400 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-red-700 to-amber-600 text-white p-4 flex items-center justify-between border-b-4 border-amber-400">
              <h3 className="font-black text-lg text-amber-300">
                {editingQuestion ? '✏️ EDIT SOAL PPKn' : '➕ TAMBAH SOAL BARU'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-amber-200 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Question Text */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">PERTANYAAN *</label>
                <textarea
                  rows={3}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Tuliskan teks pertanyaan soal..."
                  className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-sm focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Pilihan A *</label>
                  <input
                    type="text"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Pilihan B *</label>
                  <input
                    type="text"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Pilihan C *</label>
                  <input
                    type="text"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Pilihan D *</label>
                  <input
                    type="text"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Correct Answer & Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Kunci Jawaban</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correctAnswer: e.target.value as CorrectAnswerOption,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-extrabold text-sm text-red-700 bg-amber-50"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Materi / Bab</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Kesulitan</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value as Difficulty })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-sm"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Poin</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({ ...formData, points: parseInt(e.target.value, 10) || 10 })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                  />
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Penjelasan Jawaban (Pembahasan)
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Penjelasan pembahasan singkat..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-xs bg-amber-500 hover:bg-amber-400 text-red-950 shadow-md border-b-2 border-amber-700"
                >
                  💾 SIMPAN SOAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT PREVIEW MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-400 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <h3 className="font-black text-lg">📥 PREVIEW IMPORT SOAL CSV</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-white hover:text-emerald-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {importErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-300 p-3 rounded-2xl text-xs text-rose-800">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Peringatan / Format Error:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {importErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
                <span>Total Soal Valid Ditemukan:</span>
                <span className="font-black text-sm bg-white px-3 py-1 rounded-full border border-emerald-400">
                  {importPreview.length} Soal
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {importPreview.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border rounded-xl text-xs">
                    <p className="font-bold text-slate-900">{idx + 1}. {q.text}</p>
                    <p className="text-slate-500 mt-1">
                      Materi: {q.category} | Kunci: {q.correctAnswer} | Poin: {q.points}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={importPreview.length === 0}
                className="px-6 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md disabled:opacity-50"
              >
                KONFIRMASI IMPORT ({importPreview.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
