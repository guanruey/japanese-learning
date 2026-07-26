import os
import re
import sys

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove all dark: classes
    content = re.sub(r'\bdark:[a-zA-Z0-9/-]+', '', content)
    
    # 2. Remove gradient classes
    content = re.sub(r'\bbg-gradient-to-[a-z]+', '', content)
    content = re.sub(r'\bfrom-[a-zA-Z0-9/-]+', '', content)
    content = re.sub(r'\bto-[a-zA-Z0-9/-]+', '', content)
    content = re.sub(r'\bvia-[a-zA-Z0-9/-]+', '', content)
    
    # 3. Replace hardcoded text colors
    content = re.sub(r'\btext-slate-900\b', 'text-[var(--ink)]', content)
    content = re.sub(r'\btext-slate-800\b', 'text-[var(--ink)]', content)
    content = re.sub(r'\btext-slate-700\b', 'text-[var(--ink-2)]', content)
    content = re.sub(r'\btext-slate-600\b', 'text-[var(--ink-2)]', content)
    content = re.sub(r'\btext-slate-500\b', 'text-[var(--ink-3)]', content)
    content = re.sub(r'\btext-slate-400\b', 'text-[var(--ink-3)]', content)
    content = re.sub(r'\btext-slate-300\b', 'text-[var(--ink-3)]', content)
    
    # 4. Replace hardcoded background colors
    content = re.sub(r'\bbg-white\b', 'bg-[var(--surface)]', content)
    content = re.sub(r'\bbg-slate-50(?!/)\b', 'bg-[var(--surface-2)]', content)
    content = re.sub(r'\bbg-slate-100(?!/)\b', 'bg-[var(--surface-2)]', content)
    content = re.sub(r'\bbg-slate-200\b', 'bg-[var(--surface-3)]', content)
    
    # 5. Replace border colors
    content = re.sub(r'\bborder-slate-100\b', 'border-[var(--border)]', content)
    content = re.sub(r'\bborder-slate-200\b', 'border-[var(--border)]', content)
    content = re.sub(r'\bborder-slate-300\b', 'border-[var(--border)]', content)
    
    # 6. Primary color mapping (indigo)
    content = re.sub(r'\btext-indigo-600\b', 'text-[var(--primary)]', content)
    content = re.sub(r'\btext-indigo-500\b', 'text-[var(--primary)]', content)
    content = re.sub(r'\bbg-indigo-600\b', 'bg-[var(--primary)]', content)
    content = re.sub(r'\bbg-indigo-500\b', 'bg-[var(--primary)]', content)
    content = re.sub(r'\bbg-indigo-50\b', 'bg-[var(--primary-light)]', content)
    content = re.sub(r'\bbg-indigo-100\b', 'bg-[var(--primary-light)]', content)
    content = re.sub(r'\bborder-indigo-500\b', 'border-[var(--primary)]', content)
    content = re.sub(r'\bborder-indigo-600\b', 'border-[var(--primary)]', content)

    # Cleanup extra spaces inside class strings
    # This matches className="..." and cleans up multiple spaces
    def cleanup_spaces(match):
        inner = match.group(1)
        inner = re.sub(r'\s+', ' ', inner).strip()
        return f'className="{inner}"'
    content = re.sub(r'className="([^"]+)"', cleanup_spaces, content)

    def cleanup_spaces_ticks(match):
        inner = match.group(1)
        inner = re.sub(r'\s+', ' ', inner).strip()
        return f'className={{`{inner}`}}'
    content = re.sub(r'className=\{`([^`]+)`\}', cleanup_spaces_ticks, content)
    
    with open(filepath, 'w') as f:
        f.write(content)

if __name__ == '__main__':
    targets = [
        "PracticeHub.jsx",
        "SpeechSettingsPanel.jsx",
        "VocabularyBrowser.jsx",
        "CheckInBoard.jsx",
        "DailyEnglish.jsx",
        "DailyPhrase.jsx",
        "PhrasesLibrary.jsx",
        "SavedReview.jsx"
    ]
    base_dir = "/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/src/components"
    for t in targets:
        process_file(os.path.join(base_dir, t))
    print("Done")
