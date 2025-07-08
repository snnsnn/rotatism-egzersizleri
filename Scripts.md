## Get Most Frequently Used Words with R

```py
import os
import re
from collections import Counter
import pandas as pd

file_path = '/kaggle/input/turkish-wikipedia-dump/wiki_00'

word_counter = Counter()

with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        words = re.findall(r'\br\w+', line.lower())
        word_counter.update(words)

# Get top 100 most frequent words starting with 'r'
top_r_words = word_counter.most_common(100)

# Convert to DataFrame for display
df_top_r = pd.DataFrame(top_r_words, columns=['Word', 'Frequency'])
print(df_top_r)
```

## Get Most Frequently Used Words with R

```py
import os
import re
from collections import Counter
import pandas as pd

# Path to the wiki dump file
file_path = '/kaggle/input/turkish-wikipedia-dump/wiki_00'

# Count words starting with 'r'
word_counter = Counter()

with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        words = re.findall(r'\br\w+', line.lower())
        word_counter.update(words)

# Get top 100 most frequent words starting with 'r'
top_r_words = word_counter.most_common(100)

# Optional: print in notebook
pd.set_option('display.max_rows', 100)
df_top_r = pd.DataFrame(top_r_words, columns=['Word', 'Frequency'])
print(df_top_r)

# ✅ Save to TXT (tab-separated)
output_path = '/kaggle/working/top_r_words.txt'
with open(output_path, 'w', encoding='utf-8') as f:
    for word, freq in top_r_words:
        f.write(f"{word}\t{freq}\n")
```