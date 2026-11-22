# Applies a batch of rewritten questions (labels) and woven cover stories
# (weave) to data/magazines.json and data/heart/<slug>.json.
# Usage: python3 scripts/apply-voice.py scripts/voice/<batch>.json
import json, sys, os
root = os.path.join(os.path.dirname(__file__), '..')
batch = json.load(open(sys.argv[1]))
mpath = os.path.join(root, 'data/magazines.json')
mags = json.load(open(mpath))
for slug, spec in batch.items():
    m = next(x for x in mags if x['slug'] == slug)
    hp = os.path.join(root, 'data/heart', slug + '.json')
    h = json.load(open(hp))
    ids = {f['id'] for f in m['fields']} | {f['id'] for f in h.get('fields', [])}
    for k, lab in spec.get('labels', {}).items():
        assert k in ids, (slug, k)
        for f in m['fields'] + h.get('fields', []):
            if f['id'] == k: f['label'] = lab
    for k, ch in spec.get('chapters', {}).items():
        for f in h.get('fields', []):
            if f['id'] == k: f['chapter'] = ch
    for w in spec['weave']:
        for k in w.get('need', []): assert k in ids, (slug, k)
    h['weave'] = spec['weave']
    for k in ('weaveTitle', 'weaveKicker'):
        if k in spec: h[k] = spec[k]
    if 'hint' in spec: h.setdefault('story', {})['hint'] = spec['hint']
    if 'legend' in spec: h.setdefault('story', {})['legend'] = spec['legend']
    json.dump(h, open(hp, 'w'), ensure_ascii=False, indent=2)
json.dump(mags, open(mpath, 'w'), ensure_ascii=False, indent=2)
print('applied', len(batch))
