// Community Submission Manager for user-created GMs

const SUBMISSIONS_STORAGE_KEY = 'gm_generator_custom_submissions_v1';

export function getCustomSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addCustomSubmission(text, categoryId = 'crypto') {
  if (!text || !text.trim()) return false;

  const submissions = getCustomSubmissions();
  const newSubmission = {
    id: `custom_${Date.now()}`,
    text: text.trim(),
    category: categoryId,
    createdAt: new Date().toISOString()
  };

  submissions.unshift(newSubmission);

  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submission', e);
  }

  return newSubmission;
}
