import { Question, Difficulty, CorrectAnswerOption } from '../types';

export interface CSVParseResult {
  questions: Question[];
  errors: string[];
  totalParsed: number;
}

// Parses CSV string handling quoted values and commas
export const parseCSVQuestions = (csvText: string): CSVParseResult => {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  if (lines.length <= 1) {
    return { questions: [], errors: ['File CSV kosong atau hanya berisi header.'], totalParsed: 0 };
  }

  // Helper to split line by comma taking quotes into account
  const splitCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (c === ',' && !inQ) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const parsedQuestions: Question[] = [];
  const errors: string[] = [];

  // Ignore header row (index 0)
  for (let idx = 1; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    if (!rawLine) continue;

    const cols = splitCSVLine(rawLine);
    // Columns expected: No(0), Pertanyaan(1), A(2), B(3), C(4), D(5), Jawaban(6), Kelas/Materi...
    if (cols.length < 7) {
      errors.push(`Baris ${idx + 1}: Kolom kurang lengkap (minimal 7 kolom).`);
      continue;
    }

    const text = cols[1] || '';
    const optionA = cols[2] || '';
    const optionB = cols[3] || '';
    const optionC = cols[4] || '';
    const optionD = cols[5] || '';
    const rawAnswer = (cols[6] || '').toUpperCase().trim();

    let subject = 'PPKn / Pendidikan Pancasila';
    let targetClass = 'Umum';
    let category = 'Umum';
    let rawDifficulty = 'Mudah';
    let rawPoints = 10;
    let explanation = '';

    // Standard format with Mapel: No(0), Text(1), A(2), B(3), C(4), D(5), Answer(6), Mapel(7), Kelas(8), Materi(9), Kesulitan(10), Poin(11), Penjelasan(12)
    if (cols.length >= 13) {
      subject = cols[7] || 'PPKn / Pendidikan Pancasila';
      targetClass = cols[8] || 'Umum';
      category = cols[9] || 'Umum';
      rawDifficulty = cols[10] || 'Mudah';
      rawPoints = parseInt(cols[11], 10) || 10;
      explanation = cols[12] || '';
    } else if (cols.length >= 12) {
      targetClass = cols[7] || 'Umum';
      category = cols[8] || 'Umum';
      rawDifficulty = cols[9] || 'Mudah';
      rawPoints = parseInt(cols[10], 10) || 10;
      explanation = cols[11] || '';
    } else if (cols[7] && (cols[7].toLowerCase().startsWith('kelas') || cols[7].toLowerCase() === 'umum')) {
      targetClass = cols[7];
      category = cols[8] || 'Umum';
      rawDifficulty = cols[9] || 'Mudah';
      rawPoints = parseInt(cols[10], 10) || 10;
      explanation = cols[11] || '';
    } else {
      category = cols[7] || 'Umum';
      rawDifficulty = cols[8] || 'Mudah';
      rawPoints = parseInt(cols[9], 10) || 10;
      explanation = cols[10] || '';
    }

    if (!text) {
      errors.push(`Baris ${idx + 1}: Teks pertanyaan tidak boleh kosong.`);
      continue;
    }
    if (!optionA || !optionB || !optionC || !optionD) {
      errors.push(`Baris ${idx + 1}: Seluruh pilihan A, B, C, D harus diisi.`);
      continue;
    }

    let correctAnswer: CorrectAnswerOption = 'A';
    if (['A', 'B', 'C', 'D'].includes(rawAnswer)) {
      correctAnswer = rawAnswer as CorrectAnswerOption;
    } else {
      errors.push(`Baris ${idx + 1}: Jawaban harus berupa A, B, C, atau D.`);
      continue;
    }

    let difficulty: Difficulty = 'Mudah';
    if (['Mudah', 'Sedang', 'Sulit'].includes(rawDifficulty)) {
      difficulty = rawDifficulty as Difficulty;
    }

    parsedQuestions.push({
      id: `imported_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      category,
      difficulty,
      points: rawPoints > 0 ? rawPoints : 10,
      explanation,
      targetClass,
      subject,
    });
  }

  return {
    questions: parsedQuestions,
    errors,
    totalParsed: parsedQuestions.length,
  };
};

export const exportQuestionsToCSV = (questions: Question[]): void => {
  const header = ['No', 'Pertanyaan', 'A', 'B', 'C', 'D', 'Jawaban', 'Mapel', 'Kelas', 'Materi', 'Kesulitan', 'Poin', 'Penjelasan'];

  const escapeCSV = (str: string | number) => {
    const val = String(str ?? '');
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const rows = questions.map((q, index) => [
    index + 1,
    escapeCSV(q.text),
    escapeCSV(q.optionA),
    escapeCSV(q.optionB),
    escapeCSV(q.optionC),
    escapeCSV(q.optionD),
    escapeCSV(q.correctAnswer),
    escapeCSV(q.subject || 'PPKn / Pendidikan Pancasila'),
    escapeCSV(q.targetClass || 'Umum'),
    escapeCSV(q.category),
    escapeCSV(q.difficulty),
    q.points,
    escapeCSV(q.explanation),
  ]);

  const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Bank_Soal_PPKn_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
