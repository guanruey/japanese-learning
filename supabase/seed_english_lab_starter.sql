insert into public.english_expressions (
  id, category, function, register, pattern, explanation_zh, usage_note, example_sentence, example_zh, common_errors, tags
) values
  (
    'exp-001', 'Contrast', 'Concession', 'Formal', 'While it is true that ..., ...',
    '先承認一部分事實，再提出主要觀點，適合寫作與正式討論。',
    '常用於避免語氣太絕對，讓論述顯得平衡。',
    'While it is true that online courses offer flexibility, they do not always provide the same level of interaction as face-to-face classes.',
    '雖然線上課程的確提供彈性，但它們未必能提供與實體課程相同程度的互動。',
    array['不要把前後兩句都寫成同一立場，否則讓步效果會消失。', '子句後通常要接逗點，再接主要主張。'],
    array['essay', 'discussion', 'balanced tone']
  ),
  (
    'exp-002', 'Cause', 'Interpretation', 'Formal', 'This suggests that ...',
    '用來根據前面的資訊提出推論，比直接下結論更審慎。',
    '很適合閱讀理解、圖表描述、或短篇評論寫作。',
    'The steady decline in attendance suggests that the current policy is no longer meeting students'' needs.',
    '出席率持續下降顯示目前的政策已不再符合學生的需求。',
    array['後面應接完整子句，不要只接名詞片語。', '若證據很弱，避免搭配過度確定的語氣。'],
    array['reading', 'analysis', 'evidence']
  ),
  (
    'exp-003', 'Reasoning', 'Alternative explanation', 'Formal', 'A more plausible explanation is that ...',
    '用來提出比前述說法更合理的解釋，常見於論證與評論。',
    '適合在比較不同原因時使用，能提升論述成熟度。',
    'A more plausible explanation is that employees were unclear about the new procedure rather than unwilling to follow it.',
    '更合理的解釋是員工並不是不願意遵守，而是不清楚新的流程。',
    array['plausible 表示「合理可信」，不要誤當成 possible 的單純替代。', '這個句型通常要對應前文已出現的另一種解釋。'],
    array['argument', 'comparison', 'logic']
  ),
  (
    'exp-004', 'Implication', 'Result', 'Formal', 'This may lead to ...',
    '用來說明某個現象可能帶來的後果，語氣保留，適合中高級寫作。',
    '比 will lead to 更保守，也更符合許多 GEPT 寫作情境。',
    'If students rely too heavily on translation software, this may lead to weaker independent writing skills.',
    '如果學生過度依賴翻譯軟體，這可能導致獨立寫作能力變弱。',
    array['後面通常接名詞片語，不一定要完整子句。', '不要和 definitely, certainly 這類絕對副詞混用。'],
    array['cause and effect', 'essay', 'prediction']
  ),
  (
    'exp-005', 'Evaluation', 'Recommendation', 'Semi-formal', 'It would be more effective to ...',
    '用來提出更佳做法，語氣比直接命令更成熟。',
    '很適合建議型寫作、報告、與回應問題。',
    'It would be more effective to provide students with guided practice before asking them to write independently.',
    '先提供引導式練習，再要求學生獨立寫作，效果會更好。',
    array['後面接原形動詞。', '這是委婉建議，不適合接過度強硬的評論。'],
    array['recommendation', 'teaching', 'response']
  ),
  (
    'exp-006', 'Summary', 'Conclusion', 'Formal', 'Taken together, these findings indicate that ...',
    '用於總結多項觀察或證據後，得出整體判斷。',
    '特別適合多點論證後的段落收束，也可用於閱讀摘要。',
    'Taken together, these findings indicate that convenience alone is not enough to keep users engaged.',
    '綜合來看，這些發現顯示光靠便利性還不足以維持使用者參與。',
    array['Taken together 常作句首插入語，後面要接完整句。', '若只有單一證據，不建議用這個句型。'],
    array['summary', 'evidence', 'academic tone']
  )
on conflict (id) do update set
  category = excluded.category,
  function = excluded.function,
  register = excluded.register,
  pattern = excluded.pattern,
  explanation_zh = excluded.explanation_zh,
  usage_note = excluded.usage_note,
  example_sentence = excluded.example_sentence,
  example_zh = excluded.example_zh,
  common_errors = excluded.common_errors,
  tags = excluded.tags,
  updated_at = timezone('utc', now());

insert into public.english_writing_points (
  id, category, error_type, tone, weak_sentence, better_sentence, best_sentence, explanation_zh, coaching_tip, tags
) values
  (
    'wri-001', 'Grammar', 'Double connector', 'General',
    'Because many students feel stressed, so they cannot focus on their homework.',
    'Because many students feel stressed, they cannot focus on their homework.',
    'When students are under too much stress, they often struggle to focus on their homework.',
    '英文通常不會同時用 because 和 so 連接同一組因果關係。修正版也把句子改得更自然。',
    '先選 because 或 so 其中一個，再檢查主詞和動詞是否完整。',
    array['sentence repair', 'cause', 'common error']
  ),
  (
    'wri-002', 'Word choice', 'Adjective misuse', 'General',
    'Online dictionaries make students more convenient to learn new words.',
    'Online dictionaries make it more convenient for students to learn new words.',
    'Online dictionaries make vocabulary learning more convenient for students.',
    'convenient 不能直接拿來形容人，常見句型是 make it convenient for someone to do something。',
    '看到 convenient 先檢查它後面修飾的是人還是事情。',
    array['word choice', 'structure', 'learner error']
  ),
  (
    'wri-003', 'Tone', 'Redundant stance marker', 'Essay',
    'In my opinion, I think schools should give students more time for independent study.',
    'I think schools should give students more time for independent study.',
    'Schools should give students more time for independent study.',
    'In my opinion 和 I think 功能重疊，正式寫作常直接寫主張，語氣更乾淨。',
    '如果句子已經很清楚表態，刪掉多餘的 stance marker 會更成熟。',
    array['tone upgrade', 'essay', 'concise writing']
  ),
  (
    'wri-004', 'Cohesion', 'Weak transition', 'Essay',
    'Students need more sleep. And they can learn better in class.',
    'Students need more sleep, and as a result, they can learn better in class.',
    'When students get enough sleep, they are better able to learn in class.',
    '原句兩個短句之間的關係太鬆。改寫後把因果連得更明確，也更像正式英文。',
    '相鄰句子若有因果或轉折，盡量讓關係在語言上被看見。',
    array['cohesion', 'transitions', 'essay writing']
  ),
  (
    'wri-005', 'Formality', 'Informal wording', 'Formal',
    'A lot of people think the rule is kind of unfair.',
    'Many people think the rule is somewhat unfair.',
    'Many people regard the rule as unfair.',
    'a lot of 與 kind of 偏口語。正式寫作可改成 many, somewhat, regard ... as 等更穩定的用法。',
    '在考試或正式文章中，先檢查句子裡有沒有太口語的字眼。',
    array['formal writing', 'register', 'revision']
  ),
  (
    'wri-006', 'Sentence control', 'Vague subject', 'Discussion',
    'This shows education is important.',
    'This shows that education is important.',
    'This example shows that education plays an important role in long-term social development.',
    'show 後面若接完整句，通常需要 that。再往上升級時，可補出更具體的主詞與影響。',
    '寫完一句話後問自己：誰在 show？重要在哪裡？能不能更具體？',
    array['sentence control', 'that-clause', 'clarity']
  )
on conflict (id) do update set
  category = excluded.category,
  error_type = excluded.error_type,
  tone = excluded.tone,
  weak_sentence = excluded.weak_sentence,
  better_sentence = excluded.better_sentence,
  best_sentence = excluded.best_sentence,
  explanation_zh = excluded.explanation_zh,
  coaching_tip = excluded.coaching_tip,
  tags = excluded.tags,
  updated_at = timezone('utc', now());

insert into public.english_vocabulary (
  id, category, focus, register, headword, meaning_zh, nuance_note, examples, example_zh, collocations, confusables, coaching_tip, tags
) values
  (
    'voc-001', 'Evaluation', 'Synonym nuance', 'Formal', 'significant / substantial / considerable',
    '都可表示「相當大的」或「重要的」，但使用重點不同。',
    'significant 常帶有「有意義、值得注意」；substantial 偏向數量或程度很大；considerable 常表示相當可觀。',
    array[
      'The policy change had a significant effect on student motivation.',
      'The company invested a substantial amount of money in staff training.',
      'The proposal received considerable support from local residents.'
    ],
    array[
      '這項政策變動對學生動機產生了顯著影響。',
      '公司在員工培訓上投入了相當大的一筆資金。',
      '這項提案獲得了當地居民相當可觀的支持。'
    ],
    array['significant effect', 'substantial investment', 'considerable support'],
    array['important', 'large', 'major'],
    '看到中文「很大」時，先想你要強調的是影響、數量，還是整體分量。',
    array['essay', 'formal vocabulary', 'comparison']
  ),
  (
    'voc-002', 'Problem solving', 'Collocation family', 'Formal', 'address / tackle / respond to a problem',
    '三者都能處理「問題」，但語氣與力度不同。',
    'address 表示正面處理；tackle 表示積極對付較難問題；respond to 偏向回應已出現的情況或批評。',
    array[
      'The school needs to address students'' concerns more directly.',
      'The government must tackle the issue of rising housing costs.',
      'The company responded to the criticism by revising its policy.'
    ],
    array[
      '學校需要更直接地處理學生的疑慮。',
      '政府必須積極處理房價上升的問題。',
      '公司透過修訂政策來回應這些批評。'
    ],
    array['address concerns', 'tackle an issue', 'respond to criticism'],
    array['solve', 'deal with', 'fix'],
    '正式寫作裡不要只會用 solve，先問自己是在「處理」、「積極對付」，還是「回應」。',
    array['collocation', 'issue analysis', 'formal writing']
  ),
  (
    'voc-003', 'Impact', 'Natural phrasing', 'Formal', 'play a crucial role / have a profound impact',
    '都是高頻正式表達，用來描述重要性與影響力。',
    'play a crucial role 強調角色功能；have a profound impact 強調結果影響深遠。',
    array[
      'Parental support plays a crucial role in language development.',
      'Social media has had a profound impact on the way people communicate.'
    ],
    array[
      '家長支持在語言發展中扮演關鍵角色。',
      '社群媒體深刻影響了人們溝通的方式。'
    ],
    array['crucial role', 'profound impact', 'play a role in'],
    array['be important', 'change a lot'],
    '如果你正在寫原因或影響，先試著把 be important 改成角色或影響類表達。',
    array['impact', 'essay upgrade', 'academic tone']
  ),
  (
    'voc-004', 'Evidence', 'Register shift', 'Formal', 'show / indicate / demonstrate',
    '都能表達「顯示」，但正式程度和證據感不同。',
    'show 最通用；indicate 較中性且正式；demonstrate 常有「清楚證明」的力度。',
    array[
      'The survey shows that students prefer shorter lessons.',
      'The results indicate that the new method is more efficient.',
      'The case demonstrates how early intervention can improve outcomes.'
    ],
    array[
      '調查顯示學生偏好較短的課程。',
      '結果指出新方法更有效率。',
      '這個案例清楚證明及早介入如何改善結果。'
    ],
    array['results indicate', 'evidence demonstrates', 'survey shows'],
    array['prove', 'tell', 'say'],
    '若證據沒有強到能 prove，就先考慮 indicate 或 suggest。',
    array['evidence', 'reading', 'formal register']
  ),
  (
    'voc-005', 'Change', 'Degree and direction', 'General', 'increase / improve / enhance',
    '都和「變得更好或更多」有關，但意思不完全一樣。',
    'increase 是量變增加；improve 是一般改善；enhance 常指提升品質、效果、價值，較正式。',
    array[
      'The campaign increased public awareness of the issue.',
      'The new schedule improved communication between teams.',
      'These workshops are designed to enhance students'' presentation skills.'
    ],
    array[
      '這場宣導活動提高了大眾對此議題的認識。',
      '新的時程安排改善了團隊之間的溝通。',
      '這些工作坊旨在提升學生的簡報能力。'
    ],
    array['increase awareness', 'improve communication', 'enhance skills'],
    array['raise', 'develop', 'make better'],
    '先判斷你在寫的是數量增加，還是品質提升，再選字。',
    array['word choice', 'improvement', 'task response']
  ),
  (
    'voc-006', 'Attitude', 'Subtle distinction', 'Semi-formal', 'concern / issue / challenge',
    '都可能被翻成「問題」，但語氣與焦點不同。',
    'concern 偏向令人擔心的點；issue 是可討論或需處理的議題；challenge 則強調困難與挑戰性。',
    array[
      'One major concern is the lack of clear communication.',
      'Climate change remains a global issue.',
      'Balancing work and family is a challenge for many adults.'
    ],
    array[
      '一個主要的顧慮是缺乏清楚的溝通。',
      '氣候變遷仍然是全球性的議題。',
      '平衡工作與家庭對許多成年人來說是一項挑戰。'
    ],
    array['major concern', 'global issue', 'face a challenge'],
    array['problem', 'trouble', 'difficulty'],
    '中文看到「問題」時，先停一下，想它是顧慮、議題，還是挑戰。',
    array['nuance', 'discussion', 'precise vocabulary']
  )
on conflict (id) do update set
  category = excluded.category,
  focus = excluded.focus,
  register = excluded.register,
  headword = excluded.headword,
  meaning_zh = excluded.meaning_zh,
  nuance_note = excluded.nuance_note,
  examples = excluded.examples,
  example_zh = excluded.example_zh,
  collocations = excluded.collocations,
  confusables = excluded.confusables,
  coaching_tip = excluded.coaching_tip,
  tags = excluded.tags,
  updated_at = timezone('utc', now());

insert into public.english_readings (
  id, title, topic, difficulty, question_focus, passage, summary_zh, glossary, questions
) values
  (
    'read-001',
    'Why Shorter Meetings Can Improve Team Communication',
    'Work and communication',
    'GEPT Upper-Intermediate',
    'Main idea',
    'Many organizations assume that longer meetings lead to better decisions because they allow more time for discussion. In practice, however, extended meetings often reduce clarity rather than improve it. Participants may repeat points that have already been made, lose track of the original purpose, or hesitate to raise new concerns because the discussion has become too diffuse. Shorter meetings, by contrast, force teams to define priorities more clearly and encourage speakers to express their ideas more directly. This does not mean that every complex issue can be solved in twenty minutes. It does suggest, however, that time limits can improve the quality of interaction when teams already have enough background information to begin with.',
    '文章主張較短的會議不一定比較草率，反而可能讓團隊溝通更清楚、更聚焦。',
    '[
      {"word":"diffuse","zh":"發散的，不集中的"},
      {"word":"priority","zh":"優先事項"},
      {"word":"interaction","zh":"互動"}
    ]'::jsonb,
    '[
      {
        "question":"What is the main idea of the passage?",
        "choices":["Long meetings are necessary for every important decision.","Shorter meetings can improve clarity when participants already have enough context.","Teams should avoid discussing complex issues in meetings.","Employees often dislike meetings because they are too frequent."],
        "answer":1,
        "explanation":"作者不是說所有會議都該很短，而是說在已有背景資訊的前提下，時間限制可能提升互動品質。"
      },
      {
        "question":"Why do longer meetings sometimes reduce clarity?",
        "choices":["Because participants are usually unprepared.","Because teams spend too much time collecting background information.","Because discussion can become repetitive and lose focus.","Because managers refuse to let others speak."],
        "answer":2,
        "explanation":"第二句之後明確提到重複、失焦，以及不敢提出新顧慮，都是 clarity 下降的原因。"
      }
    ]'::jsonb
  ),
  (
    'read-002',
    'The Hidden Cost of Constant Translation Tools',
    'Technology and learning',
    'GEPT Upper-Intermediate',
    'Inference',
    'Translation tools have made foreign-language learning more accessible than ever before. Students can now check unfamiliar words instantly and produce readable drafts with minimal effort. Yet convenience can also create a subtle dependency. When learners rely on translation tools for every sentence, they may stop noticing gaps in their own vocabulary or grammar. As a result, they appear more fluent than they actually are, at least on the surface. This is particularly risky in environments where independent writing matters, such as examinations or workplace communication. The problem is not that translation tools are harmful in themselves. Rather, they become harmful when they replace the mental effort required for learners to organize and test their own ideas in the target language.',
    '文章指出翻譯工具本身不是壞事，但若取代了學習者自行組織語言的過程，就會造成依賴。',
    '[
      {"word":"accessible","zh":"容易取得的，易接近的"},
      {"word":"dependency","zh":"依賴"},
      {"word":"surface","zh":"表面上"}
    ]'::jsonb,
    '[
      {
        "question":"What can be inferred about students who rely too much on translation tools?",
        "choices":["They may seem more capable than they actually are in independent writing.","They usually perform better in all forms of communication.","They are less motivated to learn any new vocabulary.","They cannot use technology responsibly."],
        "answer":0,
        "explanation":"文中說 learners may appear more fluent than they actually are, at least on the surface，這就是推論依據。"
      },
      {
        "question":"Which statement best matches the author''s view?",
        "choices":["Translation tools should be banned in language classrooms.","Translation tools are useful only for advanced learners.","Translation tools are helpful unless they replace active thinking in the target language.","Translation tools mainly damage speaking rather than writing."],
        "answer":2,
        "explanation":"最後一句就是作者立場的濃縮：問題不在工具本身，而在它是否取代思考與組織過程。"
      }
    ]'::jsonb
  ),
  (
    'read-003',
    'Why Public Libraries Still Matter',
    'Education and society',
    'GEPT Upper-Intermediate',
    'Tone and paraphrase',
    'Some people argue that public libraries have become less relevant because so much information is now available online. This view, however, overlooks the broader role that libraries continue to play in many communities. Libraries do not simply provide access to books. They also offer quiet study environments, community programs, digital support, and reliable guidance for people who may struggle to evaluate online information on their own. In this sense, libraries are not disappearing institutions from an earlier age. They are adaptive public spaces that continue to respond to changing social needs. Dismissing them as outdated reveals more about a narrow definition of information access than about the actual services libraries provide.',
    '作者認為圖書館並未過時，而是在資訊時代中以不同形式持續回應社會需求。',
    '[
      {"word":"overlook","zh":"忽略，忽視"},
      {"word":"adaptive","zh":"能調適的"},
      {"word":"dismiss","zh":"輕率否定"}
    ]'::jsonb,
    '[
      {
        "question":"What is the author''s tone toward the idea that libraries are outdated?",
        "choices":["Strongly supportive","Mildly skeptical","Critical but reasoned","Completely indifferent"],
        "answer":2,
        "explanation":"作者明確反對這種看法，但語氣仍是分析式與論證式，不是情緒化攻擊。"
      },
      {
        "question":"Which is the best paraphrase of the final sentence?",
        "choices":["Libraries are outdated because online information is more efficient.","People who call libraries outdated may not fully understand what libraries now do.","Libraries should focus only on digital services in the future.","Information access is less important than community programs."],
        "answer":1,
        "explanation":"最後一句重點是：把圖書館視為過時，反映的是觀點太狹窄，而非圖書館真的沒價值。"
      }
    ]'::jsonb
  )
on conflict (id) do update set
  title = excluded.title,
  topic = excluded.topic,
  difficulty = excluded.difficulty,
  question_focus = excluded.question_focus,
  passage = excluded.passage,
  summary_zh = excluded.summary_zh,
  glossary = excluded.glossary,
  questions = excluded.questions,
  updated_at = timezone('utc', now());
