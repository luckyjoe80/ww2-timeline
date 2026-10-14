"""Build data/timelines/medal-of-honor.js from English Wikipedia.

Recipients, ranks, places and dates come from "List of Medal of Honor recipients for World War II";
each event's text is the recipient's official Medal of Honor citation (a U.S. government work, in
the public domain) as quoted in their own article. Places are geocoded from Wikipedia coordinates,
with manual positions where that fails. Everything fetched is cached in ./moh_cache.
"""
import json, os, re, sys, time, unicodedata, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'moh_cache')  # git-ignored
OUT = os.path.join(HERE, '..', 'data', 'timelines', 'medal-of-honor.js')
os.makedirs(CACHE, exist_ok=True)
UA = {'User-Agent': 'ww2-timeline-builder/1.0 (personal history project)'}
API = 'https://en.wikipedia.org/w/api.php?'


def api(params, tries=10):
    url = API + urllib.parse.urlencode({'format': 'json', 'maxlag': 5, **params})
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                time.sleep(1)  # be polite between requests
                return json.load(r)
        except urllib.error.HTTPError as e:
            wait = int(e.headers.get('Retry-After') or 0) or 5 * (k + 1)
            print(f'  HTTP {e.code}, waiting {wait}s', flush=True)
            time.sleep(wait + 1)
        except Exception as e:
            time.sleep(5 * (k + 1))
    raise RuntimeError('failed: ' + url)


def wikitext_many(titles):
    # Page source for many titles per request (50 per batch), cached per title.
    todo = [t for t in titles if not os.path.exists(os.path.join(CACHE, re.sub(r'[^\w.-]+', '_', 'wt_' + t)[:150] + '.json'))]
    for i in range(0, len(todo), 50):
        b = todo[i:i + 50]
        j = api({'action': 'query', 'prop': 'revisions', 'rvprop': 'content', 'rvslots': 'main', 'redirects': 1, 'titles': '|'.join(b)})
        q = j.get('query', {})
        mp = {n['from']: n['to'] for n in q.get('normalized', []) + q.get('redirects', [])}
        pages = {pg['title']: pg for pg in q.get('pages', {}).values()}
        for t in b:
            k = mp.get(t, t); k = mp.get(k, k)
            pg = pages.get(k)
            text = pg['revisions'][0]['slots']['main']['*'] if pg and pg.get('revisions') else ''
            cached('wt_' + t, lambda: {'title': k, 'text': text})
        print(f'  fetched {i + len(b)}/{len(todo)}', flush=True)


def cached(name, fn):
    path = os.path.join(CACHE, re.sub(r'[^\w.-]+', '_', name)[:150] + '.json')
    if os.path.exists(path):
        return json.load(open(path, encoding='utf-8'))
    v = fn()
    json.dump(v, open(path, 'w', encoding='utf-8'))
    return v


def wikitext(title):
    def get():
        j = api({'action': 'parse', 'prop': 'wikitext', 'redirects': 1, 'page': title})
        if 'parse' not in j:
            return {'title': title, 'text': ''}
        return {'title': j['parse']['title'], 'text': j['parse']['wikitext']['*']}
    return cached('wt_' + title, get)


# ---------------------------------------------------------------- list
LIST = wikitext('List of Medal of Honor recipients for World War II')['text']
tables = re.findall(r'\{\| class="wikitable sortable"[\s\S]*?\n\|\}', LIST)


def split_cells(raw):
    cells, depth, cur, i = [], 0, '', 0
    while i < len(raw):
        two = raw[i:i + 2]
        if two in ('{{', '[['):
            depth += 1; cur += two; i += 2; continue
        if two in ('}}', ']]'):
            depth -= 1; cur += two; i += 2; continue
        if depth == 0 and ((raw[i] == '\n' and raw[i + 1:i + 2] == '|') or two == '||'):
            cells.append(cur); cur = ''; i += 2; continue
        cur += raw[i]; i += 1
    cells.append(cur)
    return [re.sub(r'^\s*style="[^"]*"\s*\|', '', re.sub(r'<ref[\s\S]*?(</ref>|/>)', '', c.lstrip('|'))).strip() for c in cells]


MONTHS = {m: i for i, m in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 1)}
rows = []
for t in tables:
    for raw in re.split(r'\n\|-[^\n]*\n', t)[1:]:
        if not re.search('Sortname', raw, re.I):
            continue
        C = split_cells(raw)
        name_c = next((c for c in C if re.search('Sortname', c, re.I)), '')
        sn = re.search(r'\{\{Sortname\|([^|}]*)\|([^|}]*)(?:\|([^|}]*))?', name_c, re.I)
        svc_c = next((c for c in C if re.search(r'United States (Army|Navy|Marine Corps|Coast Guard)|Army Air Forces', c)), '')
        rank_c = next((c for c in C if '{{Sort|' in c), '') or next(
            (c for c in C if re.search(r'\b(Private|Sergeant|Corporal|Lieutenant|Captain|Major|Colonel|General|Commander|Ensign|Seaman|Mate|Technician|Boatswain|Machinist|Admiral)\b', c)
             and 'Sortname' not in c and '{{dts' not in c), '')
        date_i = next((i for i, c in enumerate(C) if re.search(r'\{\{dts', c, re.I)), -1)
        dts = re.search(r'\{\{dts\|(\d{4})\|?([A-Za-z]*)\|?(\d*)', C[date_i] if date_i >= 0 else '', re.I)
        rank_i = C.index(rank_c) if rank_c in C else -1
        place = C[rank_i + 1] if rank_i >= 0 and date_i > rank_i + 1 else C[date_i - 1]
        first, last, link = sn.group(1).strip(), sn.group(2).strip(), (sn.group(3) or '').strip() or None
        title = f'{first} {last}'
        if link and link.startswith('dab='):
            title = f'{first} {last} ({link[4:]})'
        elif link:
            title = link
        svc = ('Army Air Forces' if 'Air Forces' in svc_c else 'Marine Corps' if 'Marine' in svc_c else
               'Coast Guard' if 'Coast Guard' in svc_c else 'Navy' if 'Navy' in svc_c else 'Army' if 'Army' in svc_c else None)
        rank = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', re.sub(r'\{\{Sort\|[^|]*\|', '', rank_c)).rstrip('}').strip()
        rows.append(dict(first=first, last=last, title=re.sub(r'\s+', ' ', title), kia='KIA' in raw, svc=svc, rank=rank,
                         place=place, y=int(dts.group(1)), mo=MONTHS.get(dts.group(2)), d=int(dts.group(3)) if dts.group(3) else None,
                         note=' '.join(C[date_i + 1:]).strip()))
print('rows', len(rows))

# ---------------------------------------------------------------- articles
wikitext_many([r['title'] for r in rows])
arts = [wikitext(r['title']) for r in rows]
for r, a in zip(rows, arts):
    r['article'] = a['title']
    r['wt'] = a['text']
missing = [r['title'] for r in rows if not r['wt']]
print('articles missing:', missing)


def plain(s):
    s = re.sub(r'<ref[^>]*/>', '', s)
    s = re.sub(r'<ref[\s\S]*?</ref>', '', s)
    s = re.sub(r'\{\{(?:USS|USCGC|HMS|SS|ship)\|([^|}]*)(?:\|([^|}]*))?[^}]*\}\}',
               lambda m: (m.group(1) + ' ' + (m.group(2) or '')) if m.group(1) in ('USS', 'HMS') else 'USS ' + m.group(1), s, flags=re.I)
    s = re.sub(r'\{\{(?:nbsp|snd|spaced ndash|-)\}\}', ' ', s, flags=re.I)
    s = re.sub(r'\{\{convert\|([\d.]+)\|([a-z]+)[^}]*\}\}', r'\1 \2', s, flags=re.I)
    for _ in range(3):
        s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    s = re.sub(r'\{\{[^{}]*$', '', s)          # a template cut off by the end of a block
    s = re.sub(r'^[^{}]*?\}\}', '', s)         # ... or by its start
    # Images and files, including links nested in their captions.
    s = re.sub(r'\[\[(?:File|Image):(?:[^\[\]]|\[\[[^\]]*\]\])*\]\]', '', s, flags=re.I)
    s = re.sub(r'(?m)^\s*=+[^=\n]*=+\s*$', '', s)  # section headings
    s = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'\[https?:[^ \]]+ ([^\]]*)\]', r'\1', s)
    s = re.sub(r"'''?", '', s)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('&nbsp;', ' ').replace('&ndash;', '–').replace('&mdash;', '—').replace('&amp;', '&')
    return re.sub(r'\s+', ' ', s).strip()


def template_bodies(w, names):
    out = []
    for m in re.finditer(r'\{\{\s*(?:' + names + r')\s*\|', w, re.I):
        i = j = m.end(); d = 1
        while j < len(w) and d > 0:
            if w.startswith('{{', j): d += 1; j += 2; continue
            if w.startswith('}}', j): d -= 1; j += 2; continue
            j += 1
        body = w[i:j - 2]
        body = re.sub(r'^\s*(text|quote|1)\s*=', '', body)
        body = re.sub(r'\|\s*(author|source|sign|title|width|align|quoted|salign|bgcolor|style|2|3)\s*=[\s\S]*$', '', body)
        out.append(body)
    return out


KEY = re.compile(r'gallant|heroism|intrepidity|above and beyond|valor|courage|sacrifice', re.I)


CIT_WORDS = re.compile(r'call of duty|gallantry|intrepidity|heroism|distinguished (?:him|them)sel|conspicuous|extraordinary|devotion to duty|self-sacrific|valor|the action for which', re.I)
COMBAT = re.compile(r'\b(enemy|Japanese|German|hostile|fire|machine ?gun|company|platoon|squad|battalion|squadron|aircraft|bomber|plane|ship|vessel|attack|assault|grenade|tank|wounded|position|mortar|rifle|pillbox)\b', re.I)
# First-person narrative (memoirs, interviews), not "Company I" or "U.S.".
FIRST_PERSON = re.compile(r"\b(I (?:was|had|am|did|think|knew|remember|wasn't|couldn't|would|saw|felt|got)|I'm|I've|I'd|we (?:were|had|did|got)|my (?:men|life|family|father|mother|boys)|our (?:men|boys|family))\b")


def looks_like_citation(t, marked=False):
    """Official citations are third-person accounts of an action, with the usual award wording.
    `marked`: the text sits under a citation heading, so combat wording alone is enough."""
    if len(t) < 190 or FIRST_PERSON.search(t[:400]):
        return False
    if CIT_WORDS.search(t):
        return True
    return len(COMBAT.findall(t)) >= (3 if marked else 4) and (marked or bool(re.search(r'19(4[1-5])', t)))


OTHER_MEDAL = re.compile(r'presenting the (Navy Cross|Silver Star|Distinguished Service Cross|Distinguished Flying Cross|Bronze Star|Legion of Merit|Distinguished Service Medal|Air Medal|Navy and Marine Corps Medal|Soldier.s Medal|Purple Heart)|^The (Navy Cross|Silver Star|Distinguished Service Cross) is presented', re.I)
MOH_HALLMARK = re.compile(r'above and beyond the call of duty|Medal of Honor', re.I)


def citation(w):
    """The recipient's Medal of Honor citation, from wherever the article quotes it. Articles often
    quote several citations (Silver Star, Navy Cross...), so gather every candidate, drop those for
    other medals, and prefer one with the Medal of Honor's own wording."""
    found = []  # in priority order
    # 1) quotes or paragraphs under a "citation" heading, or after "citation reads" / "Citation:";
    #    then "Medal of Honor" sections (which may quote other things).
    starts = [m.start() for m in re.finditer(r"==[^=\n]*[Cc]itation[^=\n]*==|citation reads|'''Citation|Citation:", w)]
    starts += [m.start() for m in re.finditer(r"==[^=\n]*Medal of Honor[^=\n]*==", w)]
    for ci in starts:
        after = w[ci:ci + 20000]
        after_body = None
        if after.startswith('=='):
            body = re.split(r'\n==', after.split('\n', 1)[1] if '\n' in after else '', maxsplit=1)[0]
            if not re.search(r'<blockquote|\{\{\s*(?:block ?quote|quote|cquote|quotation)', body, re.I):
                after_body = body
        cands = [m.group(1) for m in re.finditer(r'<blockquote[^>]*>([\s\S]*?)</blockquote>', after, re.I)][:3]
        cands += template_bodies(after, r'block ?quote|quote box|quotation|quote|cquote')[:3]
        ind = re.search(r'\n((?::+[^\n]+\n?)+)', after)
        if ind:
            cands.append(re.sub(r'^:+', '', ind.group(1), flags=re.M))
        reads = re.search(r"(?:citation reads|Citation):?'*\s*\n*((?:[^\n{=][^\n]*\n?)+)", after, re.I)
        if reads:
            cands.append(reads.group(1))
        if after_body:
            paras = [p for p in after_body.split('\n\n') if p.strip() and not re.match(r'\s*[*|{!]', p)]
            cands.append('\n\n'.join(p for p in paras if not re.search(r'citation reads|Rank and organization', p, re.I)))
        found += [t for t in (plain(c) for c in cands) if looks_like_citation(t, marked=True)]
    # 2) any long quote that reads like a citation
    blocks = [m.group(1) for m in re.finditer(r'<blockquote[^>]*>([\s\S]*?)</blockquote>', w, re.I)]
    blocks += template_bodies(w, r'block ?quote|quote box|quotation|quote|cquote')
    found += [b for b in sorted((plain(b) for b in blocks), key=len, reverse=True) if looks_like_citation(b) and CIT_WORDS.search(b)]
    # 3) a paragraph in the article with the citation's usual wording
    paras = [plain(x) for x in w.split('\n\n')]
    found += sorted((x for x in paras if re.search(r'above and beyond the call of duty', x, re.I) and len(x) > 200
                     and not x.startswith('|') and looks_like_citation(x)), key=len, reverse=True)
    ok = [t for t in found if not OTHER_MEDAL.search(t[:400])]
    for t in ok:
        if MOH_HALLMARK.search(t):
            return t
    return ok[0] if ok else None


def strip_opening(t):
    # The formal opening, in its many variants, up to the recipient's name (or "CITATION:").
    t = t.lstrip(' "“:')
    m = re.match(r'^(?:For )?The President of the United States.{0,120}?takes (?:great )?(?:pride|pleasure) in presenting the (?:Congressional )?Medal of Honor(?: \(?posthumously\)?)?\s*to:?\s*', t, flags=re.I)
    if m:
        t = t[m.end():]
        c = re.search(r'as set forth in the following\W*CITATION\W*', t, flags=re.I)
        if c and c.start() < 250:
            t = t[c.end():]
    return t


def tidy_citation(t):
    t = re.sub(r'^.*?(?:official )?citation reads:?\s*', '', t, flags=re.I) if len(t) > 300 and re.search(r'citation reads', t[:200], re.I) else t
    t = re.sub(r'^Citation:\s*', '', t)
    if re.search(r'Rank and organization', t[:300], re.I) and re.search(r'Citation:', t, re.I):
        t = re.sub(r'^.*?Citation:\s*', '', t, count=1, flags=re.I | re.S)
    t = strip_opening(t)
    t = re.sub(r'\s*\((?:ASN|Service Number|Serial No\.?|SN)[^)]*\)', '', t, flags=re.I)
    t = t.strip(' "“”:')
    if t and t[0].islower():
        t = t[0].upper() + t[1:]
    # Abridge long citations at a sentence boundary.
    words = t.split()
    if len(words) > 170:
        cut = ' '.join(words[:170])
        end = max(cut.rfind('. '), cut.rfind('! '))
        t = (cut[:end + 1] if end > 300 else cut) + ' …'
    return t


def general_order(w):
    m = re.search(r"G\.\s?O\.\s*No\.?:?'*\s*([^\n}|<*]{2,60})", w)
    return plain(m.group(1)).strip(' .;,') if m else None


# Branches missing from the list: infer from the article, preferring the list where it has one.
def svc_from(w):
    head = plain(w[:6000])
    if re.search(r"corpsman|Pharmacist's Mate|Hospital Apprentice", head, re.I): return 'Navy'
    if re.search(r'Army Air Forces|Army Air Corps', head, re.I): return 'Army Air Forces'
    if re.search(r'United States Marine|Marine Corps', head): return 'Marine Corps'
    if re.search(r'Coast Guard', head): return 'Coast Guard'
    if re.search(r'United States Navy|U\.S\. Navy|Naval Reserve', head, re.I): return 'Navy'
    return 'Army'


for r in rows:
    if not r['svc']:
        r['svc'] = svc_from(r['wt'])
    c = citation(r['wt'])
    r['citation'] = tidy_citation(c) if c else None
    r['go'] = general_order(r['wt'])

# Our own summaries where no citation text is available.
OWN = {
    'Audie Murphy': 'Commanding Company B near Holtzwihr as six German tanks and waves of infantry attacked, he ordered his men back to the woods and stayed forward to direct artillery fire by telephone. He then climbed onto a burning tank destroyer and, alone and exposed on three sides, held off the attack for an hour with its machine gun, killing or wounding about 50 Germans. Wounded in the leg, he fought on until his ammunition ran out, then rejoined his company and led a counterattack that drove the Germans back.',
    'Jack J. Pendleton': 'When his company was stopped by a German machine gun in Bardenberg, he led his squad against it. Badly wounded, he ordered his men to stay back and crawled on alone, drawing the gun’s fire so that another squad could move up and destroy it. He was killed by its fire.',
    'George H. Cannon': 'Mortally wounded by Japanese shellfire during the bombardment of Midway on the night of 7 December 1941, he refused to be evacuated from his command post on Sand Island until his wounded men had been taken out, and kept reorganizing the post until he was carried away. He died of his wounds. He was the first Marine of the war to receive the Medal of Honor.',
    'Pedro Cano': 'Serving with the 4th Infantry Division near Schevenhütte, he repeatedly attacked German machine-gun positions with a rocket launcher and grenades in support of his own and a neighbouring company. Originally awarded the Distinguished Service Cross, his award was upgraded to the Medal of Honor in 2014.',
    'Rudolph B. Davila': 'With Company H, 7th Infantry, during the breakout near Artena, he led his machine-gun section under heavy fire, firing from an exposed position and then advancing alone to destroy enemy positions. Originally awarded the Distinguished Service Cross, it was upgraded to the Medal of Honor in 2000 after a review of awards to Asian American soldiers.',
    'Kiyoshi K. Muranaga': 'On the 442nd Regimental Combat Team\'s first day in action in Italy, near Suvereto, he stayed at his mortar to engage a German self-propelled gun at close range and was killed when it fired on his position. He was posthumously awarded the Distinguished Service Cross, upgraded to the Medal of Honor in 2000 after a review of awards to Asian American soldiers.',
    'Frederick C. Murphy': 'A medic with the 259th Infantry, 65th Infantry Division, he kept treating wounded men during an attack on the Siegfried Line at Saarlautern after being hit in the shoulder. Moving through a minefield to reach others, he lost a foot to one mine and was killed by another while still trying to help the wounded.',
    'Alfred B. Nietzel': 'When a German assault threatened to overrun his unit near Heistern, he covered his squad\'s withdrawal, firing until his ammunition ran out and holding his post until he was killed. His Distinguished Service Cross was upgraded to the Medal of Honor in 2014.',
    'Arlo L. Olson': 'Commanding a company of the 15th Infantry, 3rd Infantry Division, during the crossing of the Volturno River and the two weeks of fighting that followed, he repeatedly led attacks against German positions, capturing several himself, until he was mortally wounded on a reconnaissance patrol.',
    'Forrest E. Peden': 'When his artillery unit\'s observation party was ambushed near Biesheim, he gave first aid to two wounded men, then ran through heavy fire to find help. He guided a friendly tank back to the ambush site and was killed when it was hit.',
    'Cleto Rodríguez': 'When his platoon was stopped by heavy fire short of the Japanese-held Paco Railroad Station in Manila, he and Private First Class John N. Reese Jr. went forward on their own and, over more than two hours, killed many of the defenders and helped break the position.',
    'Donald Rudolph': 'While giving first aid to wounded men near Muñoz, he worked his way across open ground under fire and destroyed a series of Japanese pillboxes in turn with grenades, then a Japanese tank, allowing his company to advance.',
    'George B. Turner': 'A forward observer with an armored field artillery battalion near Philippsbourg, he fought off a German attack with rifle and rocket launcher, knocking out a tank, and later, though wounded, helped rescue the crew of a burning American tank.',
    'Jose F. Valdez': 'With his patrol in danger of being overrun near the Colmar Pocket, he volunteered to cover their withdrawal and, though severely wounded, kept firing until the others were safe. He died of his wounds three weeks later.',
    'Dirk J. Vlug': 'Serving with the 126th Infantry, 32nd Infantry Division, near Limon, he single-handedly destroyed five Japanese tanks with a rocket launcher.',
    'Henry F. Warner': 'Manning an antitank gun of the 26th Infantry near Bütgenbach, he kept firing through the night and into the next morning as German tanks closed in, disabling several before he was killed.',
    'Jay Zeamer Jr.': 'He volunteered to fly a B-17 on a photographic mapping mission over heavily defended Bougainville and Buka. Attacked by enemy fighters and badly wounded, he kept the crippled bomber in the fight and flew it back more than 500 miles to New Guinea with the photographs.',
}
# Articles whose page layout defeats extraction; the citation is given here directly.
FORCE = {
    'Douglas MacArthur': 'For conspicuous leadership in preparing the Philippine Islands to resist conquest, for gallantry and intrepidity above and beyond the call of duty in action against invading Japanese forces, and for the heroic conduct of defensive and offensive operations on the Bataan Peninsula. He mobilized, trained, and led an army which has received world acclaim for its gallant defense against a tremendous superiority of enemy forces in men and arms. His utter disregard of personal danger under heavy fire and aerial bombardment, his calm judgment in each crisis, inspired his troops, galvanized the spirit of resistance of the Filipino people, and confirmed the faith of the American people in their Armed Forces.',
}
for r in rows:
    if r['article'] in FORCE:
        r['citation'] = FORCE[r['article']]
    if not r['citation']:
        r['citation'] = OWN.get(r['article']) or OWN.get(r['title'])
nocit = [r['title'] for r in rows if not r['citation']]
print('no text:', nocit)

# ---------------------------------------------------------------- geocoding
COARSE = {'France', 'Italy', 'Germany', 'Belgium', 'Philippines', 'Solomon Islands', 'Netherlands', 'Holland', 'Tunisia', 'Burma',
          'Romania', 'Austria', 'Luxembourg', 'Japan', 'China', 'New Guinea', 'Pacific Ocean', 'Mariana Islands', 'Ryukyu Islands',
          'Marshall Islands', 'Gilbert Islands', 'Volcano Islands', 'Palau Group', 'Palau', 'Netherlands East Indies', 'Algeria',
          'Morocco', 'French Morocco', 'Sicily', 'Czechoslovakia', 'Brittany', 'Normandy', 'Bataan Province', 'Luzon', 'Mindanao',
          'Leyte', 'Borneo'}


def segs(p):
    s = re.sub(r'\{\{USS\|([^|}]*)\|?([^|}]*)[^}]*\}\}', r'USS \1', p)
    s = re.sub(r'\{\{ill\|([^|}]*)[^}]*\}\}', r'\1', s)
    s = re.sub(r'\{\{[^}]*\}\}', '', s).replace("''", '')
    s = re.sub(r'\(\[\[[^\]]*\]\]\)', '', s)
    s = re.sub(r'\([^)]*\)', '', s)
    out = []
    for seg in re.split(r',| and ', s):
        seg = seg.strip()
        if not seg: continue
        link = re.search(r'\[\[([^|\]]+)(?:\|[^\]]*)?\]\]', seg)
        txt = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', seg)
        txt = re.sub(r'^(near|vicinity of|over|off|North of|South of|East of|West of|northeast of|aboard(?: a)?|in|at|on)\s+', '', txt, flags=re.I).strip()
        out.append((link.group(1).split('#')[0] if link else None, txt))
    return out


places = sorted({r['place'] for r in rows})
plan = {}
cands = set()
for p in places:
    lst = []
    for link, txt in segs(p):
        for t in (link, txt):
            if t and t not in COARSE and not t.startswith('USS ') and not re.search(r'[\[\]{}|#<>]', t) and len(t) < 120:
                lst.append(t)
    plan[p] = lst
    cands.update(lst)


def coords_for(titles):
    def get():
        out = {}
        for i in range(0, len(titles), 40):
            b = titles[i:i + 40]
            j = api({'action': 'query', 'prop': 'coordinates|pageprops', 'colimit': 'max', 'redirects': 1, 'titles': '|'.join(b)})
            q = j.get('query', {})
            mp = {n['from']: n['to'] for n in q.get('normalized', []) + q.get('redirects', [])}
            pages = {pg['title']: pg for pg in q.get('pages', {}).values()}
            for t in b:
                k = mp.get(t, t); k = mp.get(k, k)
                pg = pages.get(k)
                if pg and pg.get('coordinates') and 'disambiguation' not in pg.get('pageprops', {}):
                    out[t] = [pg['coordinates'][0]['lat'], pg['coordinates'][0]['lon'], pg['title']]
        return out
    return cached('coords_' + str(len(titles)), get)


coords = coords_for(sorted(cands))

# Matches that resolve to the wrong place (another place of the same name, a ship, a region...).
BAD_TITLES = {'Hatten', 'Altavilla', 'Käyser Mountains', 'Pons Aemilius', 'Pacific Ocean', 'Aprilia', 'San Angelo, Texas',
              'Admiralty Group', 'Greenwich Island', 'Tabio', 'Aleutian Islands', 'West Loch Estate, Hawaii'}
coords = {k: v for k, v in coords.items() if v[2] not in BAD_TITLES}

# Hand-placed positions (approximate), for places Wikipedia lookups don't resolve or get wrong.
# Keyed by a distinctive fragment of the place text.
MANUAL = {
    'Hatten': (48.90, 7.98), 'Altavilla': (40.53, 15.13), 'Kayserberg': (48.14, 7.26), 'Ponte Rotto': (41.58, 12.85),
    'USS \'\'Growler\'\'': (-4.0, 151.5), 'Growler': (-4.0, 151.5), 'Aprilia': (41.59, 12.65), 'San Angelo': (41.45, 13.80),
    'Los Negros': (-2.02, 147.43), 'Greenwich Island': (1.07, 154.77), 'Tabio': (16.62, 120.70), 'Attu': (52.90, 173.20),
    'West Loch': (21.36, -158.03),
    'Arloncourt': (50.04, 5.79), 'Afua': (-3.14, 142.47), 'Carano': (41.55, 12.75), 'Petit-Coo': (50.42, 5.86),
    'Soy, Belgium': (50.29, 5.52), 'Borneo and Leyte': (8.0, 122.0), 'South Pacific area': (-9.0, 158.0),
    'Guignola': (44.15, 11.40), 'Buna': (-8.66, 148.40), 'Valmontone': (41.78, 12.92), 'Oliveto': (40.69, 15.23),
    'Culis': (14.75, 120.45), 'Mignano': (41.40, 13.98), 'Philippine waters': (12.0, 123.0), 'Central [[Solomon': (-8.0, 157.5),
    'South Manila': (14.56, 121.00), 'Favoratta': (37.13, 13.88), 'Artena': (41.74, 12.91), 'Lobenbacherhof': (49.15, 7.60),
    'Lumboy': (16.00, 120.45), 'Cape Cavalaire': (43.17, 6.53), 'Kalterherberg': (50.52, 6.21), 'Krinkelter Wald': (50.44, 6.36),
    'Untergriesheim': (49.24, 9.20), 'French West Africa': (14.6, -17.6), 'Goville': (49.25, -1.30), 'Kirchain': (50.82, 8.92),
    'Grammont': (47.60, 6.60), 'Harder': (5.5, 120.5), 'Kerling': (49.39, 6.36), 'Mintal': (7.08, 125.50),
    'Holzheim': (50.36, 6.30), 'Grosshau': (50.72, 6.38), 'near Berg': (50.60, 6.20), 'Villa Crocetta': (41.55, 12.70),
    'Isola Bella': (41.57, 12.85), 'near Kobe': (34.69, 135.19), 'Luchem': (50.84, 6.38), 'Tendola': (44.17, 10.03),
    'Cerasuolo': (41.60, 14.08), 'Assenois': (49.97, 5.69), 'Drabenderhohe': (50.93, 7.50), 'Maglamin': (8.10, 124.60),
    'Limon': (11.20, 124.75), 'Flamierge': (50.02, 5.62), 'Altuzzo': (44.08, 11.38), 'Alemert': (50.80, 6.20),
    'Scarperia': (43.99, 11.36), 'Lanuvio': (41.67, 12.70), 'Galiano': (16.50, 120.75), 'San Francisco\'\', [[Solomon': (-9.25, 159.90),
    'Po Valley': (45.0, 10.5), 'La Forge': (48.30, 6.70), 'LoiKang': (23.95, 97.65), 'Krinkelt': (50.44, 6.32),
    'Hamich': (50.78, 6.31), 'Schevenhütte': (50.76, 6.33), 'Woelfling': (49.10, 7.17), 'Kommerscheidt': (50.64, 6.41),
    'over Europe': (51.5, 9.0), 'Isle Adam': (49.11, 2.22), 'over Germany': (51.0, 10.0), 'Neiderzerf': (49.57, 6.66),
    'Sars la Bruyere': (50.37, 3.88), 'Radden': (48.70, 6.60), 'near Lohe': (50.90, 6.50), 'Philippine Sea': (15.0, 137.0),
    'Pawig': (11.10, 125.00), 'Cognon': (11.10, 124.80), 'La Torreto': (41.60, 12.80), 'MedjezelBab': (36.65, 9.61),
    'Seravezza': (43.99, 10.23), 'Padiglione': (41.53, 12.70), 'Saarlautern': (49.31, 6.75), 'Djebel Dardys': (37.10, 9.15),
    'Heistern': (50.81, 6.33), 'Suvereto': (43.08, 10.68), 'Grandcampe': (49.39, -1.04), 'Bardenberg': (50.84, 6.12),
    'Fluren': (51.68, 6.58), 'Pieve Di S. Luce': (43.47, 10.56), 'Eisern': (50.83, 8.02), 'Mount Belvedere': (44.24, 10.98),
    'Les Coates': (48.40, -4.50), 'LST 375': (37.08, 14.24), 'Coral Sea and adjacent': (-15.0, 155.0), 'Volturno': (41.20, 14.20),
    'Vassillio': (37.79, 14.60), 'Tillet': (50.00, 5.53), 'St. Pravel': (47.0, 2.5), 'Yorktown\'\', Battle of the Coral Sea': (-15.5, 155.0),
    'Mount Damiano': (41.33, 13.80), 'St. Jacques': (47.0, 2.5), 'Rosenkrantz': (48.15, 7.38), 'Rocherath': (50.44, 6.30),
    'Grufflingen': (50.25, 6.06), 'Mount Porchia': (41.42, 13.93), 'Nieder-Wurzbach': (49.24, 7.20), 'Saulx de Vesoul': (47.70, 6.27),
    'Ventoabbto': (44.10, 11.00), 'Tremensucli': (41.26, 13.75), 'Monte Frassino': (41.35, 13.80), 'Dom Butgenbach': (50.43, 6.18),
    'Wimereaux': (50.77, 1.61), 'Magliano': (42.60, 11.30), 'St. Hippolyte': (48.23, 7.37), 'Chaumont, Belgium': (49.99, 5.66),
    'Birken': (50.82, 7.73), 'at sea near New Guinea': (-5.0, 148.0), 'Siegfried Line in Germany': (50.40, 6.40),
    'Barb': (26.5, 120.3), 'Neosho': (-16.0, 158.0), 'Normandy, [[France]]': (49.30, -0.80), 'Germany': (51.0, 10.0), 'over [[Japan]]': (35.5, 138.0), '[[Solomon Islands]] area': (-9.0, 159.0),
    'Leyte, Philippines': (11.0, 124.85), 'Leyte, [[Philippines]]': (11.0, 124.85), 'Philippines': (12.0, 122.5),
    'Fondouk': (35.57, 9.85), 'Villa Verde': (16.10, 120.90), 'La Londe': (43.14, 6.23), 'St. Dié': (48.28, 6.95), 'St. Die': (48.28, 6.95),
    'Driniumor': (-3.15, 142.45), 'Belmont sur Buttant': (48.20, 6.80), 'Oberhoffen': (48.78, 7.86), 'Nuremberg': (49.45, 11.08),
    'Cisterna, [[Italy]]': (41.59, 12.83), 'Anamo': (-3.13, 142.43), 'Rechicourt': (48.68, 6.84), 'Merderet': (49.41, -1.37),
    'Montereau': (48.38, 2.95), 'Amfreville': (49.25, -0.24), 'Anzio': (41.45, 12.62), 'Casaglia': (44.07, 11.30),
    'Chambois': (48.81, 0.11), 'Ploiești Raid': (44.94, 26.03), 'Brest': (48.39, -4.49), 'Kesternich': (50.61, 6.31),
    'Gagliano': (37.71, 14.53), 'Pompey': (48.77, 6.12), 'Best, Holland': (51.51, 5.39), 'Hurtgen': (50.70, 6.36),
    'Woippy': (49.15, 6.15), 'over Luzon': (16.0, 121.0), 'Battaglia': (44.22, 11.62), 'Savo Island': (-9.13, 159.81),
    'Cordillera': (17.0, 121.0), 'Castellina': (43.47, 11.29), 'Cassino': (41.49, 13.81), 'Guebling': (48.87, 6.73),
    'Buka area': (-5.25, 154.62), 'Munoz': (15.72, 120.90), 'Lure': (47.68, 6.50), 'Stolberg': (50.77, 6.23), 'Haaren': (50.80, 6.13),
    'Dahl': (49.94, 5.98), 'Bezange': (48.75, 6.48),
}
# Places whose resolved position is a region or ocean, not a spot.
APPROX_WORDS = re.compile(r'area|waters|^over |at sea|Coral Sea|Po Valley|Siegfried Line in|Philippine Sea', re.I)


# Whole-place matches only (these words also appear inside many other place names).
EXACT = {'Germany': (51.0, 10.0), 'Philippines': (12.0, 122.5), 'Normandy, [[France]]': (49.30, -0.80),
         'over [[Japan]]': (35.5, 138.0), '[[Solomon Islands]] area': (-9.0, 159.0), 'Leyte, Philippines': (11.0, 124.85),
         'Leyte, [[Philippines]]': (11.0, 124.85), 'over Germany': (51.0, 10.0), 'over Europe': (51.5, 9.0)}
for k in EXACT:
    MANUAL.pop(k, None)


def locate(p):
    if p in EXACT:
        return EXACT[p], True
    hit = next((t for t in plan[p] if t in coords), None)
    if hit:
        return (coords[hit][0], coords[hit][1]), False
    for frag, ll in sorted(MANUAL.items(), key=lambda kv: -len(kv[0])):
        if frag in p:
            return ll, True
    return None, True


def place_name(p):
    s = re.sub(r'\{\{USS\|([^|}]*)\|([^|}]*)[^}]*\}\}', r'USS \1 (\2)', p)
    s = re.sub(r'\{\{USS\|([^|}]*)[^}]*\}\}', r'USS \1', s)
    s = re.sub(r'\{\{ill\|([^|}]*)\|lt=([^|}]*)[^}]*\}\}', r'\2', s)
    s = re.sub(r'\{\{[^}]*\}\}', '', s)
    s = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', s).replace("''", '')
    s = re.sub(r'\s+', ' ', s).strip(' ,')
    return s[0].upper() + s[1:] if s else s


unplaced = []
for r in rows:
    ll, approx = locate(r['place'])
    if not ll:
        unplaced.append(r['place'])
        continue
    r['lat'], r['lng'] = ll
    r['loc_approx'] = approx or bool(APPROX_WORDS.search(place_name(r['place'])))
print('unplaced:', sorted(set(unplaced)))

# ---------------------------------------------------------------- output
def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def js(s):
    return json.dumps(s, ensure_ascii=False)


events = []
for r in rows:
    if 'lat' not in r:
        continue
    date = f"{r['y']}-{(r['mo'] or 1):02d}-{(r['d'] or 1):02d}"
    name = f"{r['first']} {r['last']}"
    pname = place_name(r['place'])
    regional = r['place'] in EXACT or bool(APPROX_WORDS.search(pname))
    facts = [['Recipient', name], ['Rank', r['rank']], ['Service', r['svc']], ['Place of action', pname]]
    if r['kia'] or r['go']:
        facts.append(['Awarded', ', '.join(x for x in ['Posthumously' if r['kia'] else '', f"G.O. No. {r['go']}" if r['go'] else ''] if x)])
    ev = {
        'id': f"{date}-{slug(r['last'])}-{slug(r['first'])[:12]}",
        'date': date,
        'title': f"{r['rank']} {name}",
        'type': 'loss' if r['kia'] else 'attack',
        'theater': r['svc'],
        'location': {'name': pname + (' (approx.)' if r['loc_approx'] else ''), 'lat': round(r['lat'], 4), 'lng': round(r['lng'], 4)},
        'zoom': 6 if regional else 9,
        'summary': r['citation'],
        'facts': facts,
        'wiki': {name: r['article'].replace(' ', '_')},
    }
    if not r['mo'] or not r['d']:
        ev['approx'] = True
    events.append(ev)

events.sort(key=lambda e: (e['date'], e['title']))
ids = [e['id'] for e in events]
assert len(ids) == len(set(ids)), 'duplicate ids'

head = '''// Timeline: Medal of Honor (Medals).
// Every Medal of Honor awarded for actions in World War II, placed at the date and place of the
// action. Recipients, ranks, places and dates come from the English Wikipedia "List of Medal of
// Honor recipients for World War II"; branches missing from that list are taken from each
// recipient's article. Each event's text is the recipient's official Medal of Honor citation (a U.S.
// government work, in the public domain) as quoted in their Wikipedia article, abridged where long;
// for the few articles without it, a short summary written for this project. "Awarded" gives the
// War or Navy Department general order where the article records it. Positions come from Wikipedia
// coordinates or were placed by hand; hand-placed and regional ones are marked "(approx.)".
//
// Generated by tools/build_moh.py (October 2026); run it again to rebuild. Event schema: see data/timelines/attack-on-hawaii.js.

WW2.events['medal-of-honor'] = [
'''
with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
    f.write(head)
    for e in events:
        f.write('  ' + json.dumps(e, ensure_ascii=False) + ',\n')
    f.write('];\n')
print('wrote', len(events), 'events to', OUT)
from collections import Counter
print(Counter(e['theater'] for e in events))
print('approx locations', sum(e['location']['name'].endswith('(approx.)') for e in events))
