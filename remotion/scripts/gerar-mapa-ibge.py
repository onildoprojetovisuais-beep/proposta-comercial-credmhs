# Gera src/motion/map/brazilGeo.ts e brazilGeoMeta.ts a partir da malha de UFs do IBGE (qualidade mínima).
# Uso (rodar com -I, dados baixados numa pasta à parte): python -I gerar-mapa-ibge.py <ufs.json> <ufs-list.json> <.../src/motion/map/brazilGeo.ts>
import json, math, sys, collections

src, names_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open(src, encoding="utf-8"))
names = {str(e["id"]): (e["sigla"], e["nome"]) for e in json.load(open(names_path, encoding="utf-8"))}

feats = []
for f in data["features"]:
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    feats.append((f["properties"]["codarea"], polys))

lons = [p[0] for _, polys in feats for poly in polys for r in poly for p in r]
lats = [p[1] for _, polys in feats for poly in polys for r in poly for p in r]
LON0, LON1, LAT0, LAT1 = min(lons), max(lons), min(lats), max(lats)
LATC = (LAT0 + LAT1) / 2
K = math.cos(math.radians(LATC))
W = 1000.0
PAD = 14.0
scale = (W - 2 * PAD) / ((LON1 - LON0) * K)
H = round((LAT1 - LAT0) * scale + 2 * PAD, 1)


def proj(p):
    return ((p[0] - LON0) * K * scale + PAD, (LAT1 - p[1]) * scale + PAD)


def q(v):
    return round(v, 1)


def fmt(v):
    s = f"{q(v):.1f}"
    return s[:-2] if s.endswith(".0") else s


def ring_path(pts):
    out_pts = []
    for p in pts:
        x, y = proj(p)
        t = (q(x), q(y))
        if not out_pts or out_pts[-1] != t:
            out_pts.append(t)
    if len(out_pts) > 1 and out_pts[0] == out_pts[-1]:
        out_pts.pop()
    if len(out_pts) < 3:
        return ""
    return "M" + "L".join(f"{fmt(x)} {fmt(y)}" for x, y in out_pts) + "Z"


def line_path(pts):
    s = []
    for p in pts:
        x, y = proj(p)
        t = (q(x), q(y))
        if not s or s[-1] != t:
            s.append(t)
    return "M" + "L".join(f"{fmt(x)} {fmt(y)}" for x, y in s)


# Arestas: 1 ocorrência = contorno do país; 2 = divisa entre UFs.
edges = collections.Counter()
for _, polys in feats:
    for poly in polys:
        for r in poly:
            for a, b in zip(r, r[1:]):
                if tuple(a) != tuple(b):
                    edges[frozenset((tuple(a), tuple(b)))] += 1


def chains(edge_set, closed_only=False):
    adj = collections.defaultdict(set)
    for e in edge_set:
        a, b = tuple(e)
        adj[a].add(b)
        adj[b].add(a)
    used = set()
    res = []
    # começa em nós de grau != 2 (junções triplas, pontas), depois ciclos
    starts = [n for n in adj if len(adj[n]) != 2] + list(adj.keys())
    for s in starts:
        for nb in list(adj[s]):
            e = frozenset((s, nb))
            if e in used:
                continue
            path = [s, nb]
            used.add(e)
            cur, prev = nb, s
            while len(adj[cur]) == 2:
                nxt = [n for n in adj[cur] if n != prev][0]
                e2 = frozenset((cur, nxt))
                if e2 in used:
                    break
                used.add(e2)
                path.append(nxt)
                prev, cur = cur, nxt
            res.append(path)
    return res


outer = chains({e for e, c in edges.items() if c == 1})
inner = chains({e for e, c in edges.items() if c == 2})
odd = collections.Counter(edges.values())


def plen(path):
    pts = [proj(p) for p in path]
    return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))


outer.sort(key=plen, reverse=True)
outline = [line_path(p) for p in outer if plen(p) > 1.5]
inner_paths = []
for p in inner:
    pts = [proj(x) for x in p]
    cy = sum(y for _, y in pts) / len(pts)
    cx = sum(x for x, _ in pts) / len(pts)
    if plen(p) > 0.5:
        inner_paths.append((cy, cx, line_path(p)))
inner_paths.sort()


# ---- ponto interno (polo de inacessibilidade aproximado: busca em grade + refino) ----
def pip(x, y, rings):
    ins = False
    for r in rings:
        n = len(r)
        j = n - 1
        for i in range(n):
            xi, yi = r[i]
            xj, yj = r[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
                ins = not ins
            j = i
    return ins


def seg_dist(px, py, a, b):
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    L = dx * dx + dy * dy
    t = 0 if L == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)


def edge_dist(x, y, rings):
    return min(seg_dist(x, y, r[i - 1], r[i]) for r in rings for i in range(len(r)))


def pole(rings):
    xs = [p[0] for r in rings for p in r]
    ys = [p[1] for r in rings for p in r]
    best, bx, by = -1, 0, 0
    step = max(max(xs) - min(xs), max(ys) - min(ys)) / 40
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    for _ in range(4):
        y = y0
        while y <= y1:
            x = x0
            while x <= x1:
                if pip(x, y, rings):
                    d = edge_dist(x, y, rings)
                    if d > best:
                        best, bx, by = d, x, y
                x += step
            y += step
        x0, x1, y0, y1 = bx - step * 2, bx + step * 2, by - step * 2, by + step * 2
        step /= 5
    return bx, by, best


states = []
for code, polys in feats:
    uf, nome = names[code]
    d = "".join(ring_path(r) for poly in polys for r in poly)
    # maior polígono (área) para o ponto interno
    def area(poly):
        r = [proj(p) for p in poly[0]]
        return abs(sum(r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1] for i in range(len(r)))) / 2
    main = max(polys, key=area)
    rings = [[proj(p) for p in r] for r in main]
    px, py, rad = pole(rings)
    states.append({"code": code, "uf": uf, "name": nome, "d": d, "x": q(px), "y": q(py), "r": q(rad), "rings": rings, "allrings": [[proj(p) for p in r] for poly in polys for r in poly]})

# ---- símbolos do slide 5 (EMU) -> UF ----
MAP_OFF = (6096000, 476250)
MAP_EXT = (5715000, 5905500)
IMG = (1200, 1240)
WHITE_BBOX = (15, 1117, 54, 1185)  # pixels brancos do image-5-1.png (medido com Pillow)
SYM = 190500
syms = [
    ("Image 1", 6886575, 2743200), ("Image 2", 11210925, 2695575), ("Image 3", 9144000, 1352550),
    ("Image 4", 7934325, 1790700), ("Image 5", 10839450, 3152775), ("Image 6", 10829925, 1876425),
    ("Image 7", 9572625, 3552825), ("Image 8", 10591800, 4181475), ("Image 9", 9391650, 3676650),
    ("Image 10", 10058400, 1704975), ("Image 11", 8467725, 3524250), ("Image 12", 8667750, 4200525),
    ("Image 13", 10106025, 4124325), ("Image 14", 9486900, 1562100), ("Image 15", 11325225, 2343150),
    ("Image 16", 9382125, 4886325), ("Image 17", 11325225, 2476500), ("Image 18", 10258425, 2066925),
    ("Image 19", 11277600, 2162175), ("Image 20", 9124950, 5524500), ("Image 21", 7419975, 2571750),
    ("Image 22", 7848600, 962025), ("Image 23", 9486900, 5191125), ("Image 24", 9744075, 4629150),
    ("Image 25", 11029950, 2867025), ("Image 26", 9515475, 2771775),
    ("Image 27 (destaque)", 10058400 + 476250 // 2 - SYM // 2, 4391025 + 476250 // 2 - SYM // 2),
]
lonlat_box = (LON0, LON1, LAT1, LAT0)
mapping = []
for name, ox, oy in syms:
    cx, cy = ox + SYM / 2, oy + SYM / 2
    ix = (cx - MAP_OFF[0]) / MAP_EXT[0] * IMG[0]
    iy = (cy - MAP_OFF[1]) / MAP_EXT[1] * IMG[1]
    lon = LON0 + (ix - WHITE_BBOX[0]) / (WHITE_BBOX[1] - WHITE_BBOX[0]) * (LON1 - LON0)
    lat = LAT1 - (iy - WHITE_BBOX[2]) / (WHITE_BBOX[3] - WHITE_BBOX[2]) * (LAT1 - LAT0)
    x, y = proj((lon, lat))
    hit = [s["uf"] for s in states if pip(x, y, s["allrings"])]
    near = sorted(states, key=lambda s: math.hypot(s["x"] - x, s["y"] - y))[:3]
    mapping.append((name, round(lon, 2), round(lat, 2), hit, [n["uf"] for n in near]))
for m in mapping:
    print(m, file=sys.stderr)
print("arestas", dict(odd), "contorno", len(outline), "divisas", len(inner_paths), "viewBox", W, H, "latc", LATC, file=sys.stderr)

with open(out, "w", encoding="utf-8", newline="\n") as fh:
    fh.write("// ARQUIVO GERADO — não editar à mão. Ver docs/V3-MAPA.md (fonte IBGE, projeção, script).\n")
    fh.write("// Malha: IBGE, API de malhas v3, país BR com intrarregião UF, qualidade mínima.\n")
    fh.write(f"// Projeção equirretangular, paralelo padrão {LATC:.2f}° (cos = {K:.4f}); {W:.0f} unidades de largura.\n\n")
    fh.write("export interface UfShape {\n  /** Sigla da UF. */\n  uf: string;\n  name: string;\n  /** Contorno da UF (preenchimento). */\n  d: string;\n  /** Ponto interno (polo de inacessibilidade aproximado) — posição do símbolo de presença, não um endereço. */\n  x: number;\n  y: number;\n  /** Distância do ponto interno à divisa mais próxima (unidades do viewBox). */\n  r: number;\n}\n\n")
    fh.write("export { GEO_WIDTH, GEO_HEIGHT } from './brazilGeoMeta';\n\n")
    fh.write("/** Contorno do país (arestas que pertencem a uma só UF), do maior para o menor trecho. */\n")
    fh.write("export const COUNTRY_OUTLINE: readonly string[] = [\n" + "".join(f"  '{p}',\n" for p in outline) + "];\n\n")
    fh.write("/** Divisas entre UFs (arestas compartilhadas, cada uma desenhada uma vez), de norte a sul. */\n")
    fh.write("export const STATE_BORDERS: readonly string[] = [\n" + "".join(f"  '{p}',\n" for _, _, p in inner_paths) + "];\n\n")
    fh.write("export const UF_SHAPES: readonly UfShape[] = [\n")
    for s in states:
        fh.write(f"  {{ uf: '{s['uf']}', name: '{s['name']}', x: {fmt(s['x'])}, y: {fmt(s['y'])}, r: {fmt(s['r'])}, d: '{s['d']}' }},\n")
    fh.write("];\n")

rj = next(s for s in states if s["uf"] == "RJ")
meta = out.replace("brazilGeo.ts", "brazilGeoMeta.ts")
NL = chr(10)
with open(meta, "w", encoding="utf-8", newline=NL) as fh:
    fh.write("// ARQUIVO GERADO (mesmo script de brazilGeo.ts) — medidas leves, sem geometria, para o bundle inicial." + NL)
    fh.write(f"export const GEO_WIDTH = {W:.0f};" + NL + f"export const GEO_HEIGHT = {fmt(H)};" + NL)
    fh.write("/** Ponto interno do Rio de Janeiro (destaque da rede própria), unidades do viewBox. */" + NL)
    fh.write("export const RJ_GEO_POINT = { x: " + fmt(rj["x"]) + ", y: " + fmt(rj["y"]) + " } as const;" + NL)
