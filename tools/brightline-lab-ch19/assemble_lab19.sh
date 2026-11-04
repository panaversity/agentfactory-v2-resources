#!/bin/bash
# Assemble labs/brightline-lab-ch19/ in the labs clone from the build outputs and the final pages.
set -euo pipefail
S=/private/tmp/claude-501/-Users-mjs-Documents-code-panaversity-official-tutorsgpt-agentfactory-v2/ba4b8bf0-4037-4b6b-86b4-bcb23de4b69c/scratchpad
W=/Users/mjs/Documents/code/panaversity-official/tutorsgpt/agentfactory-v2/.work/wt-ch19
L=/Users/mjs/Documents/code/panaversity-official/tutorsgpt/agentfactory-v2/.work/res-ch19/labs/brightline-lab-ch19
O=$S/build/out
rm -rf "$L"; mkdir -p "$L/answer-key"
cp -R "$O/start" "$L/brightline-ap"
python3 -I "$S/scripts/make_docs_19.py" "$W/knowledge/building-ai-workers/business-data-and-retrieval" "$L/brightline-ap/docs/chapter-19" >/dev/null
cp -R "$O/labroot/concept-blocks" "$O/labroot/lab-files" "$L/"
cp "$O"/labroot/answer-key/* "$L/answer-key/"
cp -R "$O/keyfiles" "$L/answer-key/files"
python3 -I "$S/scripts/make_keys_19.py" "$L/answer-key" >/dev/null
cp "$S/scripts/lab19-README.md" "$L/README.md"
cp "$S/scripts/lab19-answer-key-README.md" "$L/answer-key/README.md"
python3 -I "$W/.agents/skills/make-lab/scripts/copy-lab-page.py" "$W/knowledge/building-ai-workers/business-data-and-retrieval/lab.md" "$L/LAB.md"
find "$L" -name .DS_Store -delete
chmod +x "$L/brightline-ap/scripts/check-no-secret-output.sh" "$L/answer-key/files/scripts/check-no-secret-output.sh"   # as in the authors' repository
echo "assembled: $(find "$L" -type f | wc -l | tr -d ' ') files, $(du -sh "$L" | cut -f1)"
