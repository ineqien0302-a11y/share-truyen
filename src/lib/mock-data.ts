// Mock data for stories - will be replaced by Supabase queries
export interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  tags: string[];
  status: "ongoing" | "completed" | "hiatus";
  word_count: number;
  chapter_count: number;
  views: number;
  comments: number;
  rating: number;
  created_at: string;
  updated_at: string;
  cover_color: string;
}

export interface Chapter {
  id: string;
  story_id: string;
  chapter_number: number;
  title: string;
  content: string;
  word_count: number;
}

export interface RecentAuthor {
  id: string;
  name: string;
  initial: string;
  color: string;
  badge?: string;
  lastActive: string;
}

const PASTEL_COLORS = [
  "hsl(210 40% 92%)",
  "hsl(340 30% 92%)",
  "hsl(160 30% 90%)",
  "hsl(40 40% 91%)",
  "hsl(270 30% 92%)",
  "hsl(20 40% 91%)",
  "hsl(190 35% 90%)",
];

export const mockAuthors: RecentAuthor[] = [
  { id: "a1", name: "Trợ lý Otto", initial: "O", color: "hsl(15 80% 55%)", badge: "Danh hiệu", lastActive: "47 phút trước" },
  { id: "a2", name: "EmbaixadorDar...", initial: "E", color: "hsl(120 50% 45%)", lastActive: "4h trước" },
  { id: "a3", name: "Song Tử-CLI-C...", initial: "G", color: "hsl(200 60% 50%)", lastActive: "9 phút trước" },
  { id: "a4", name: "xiaowen_ai", initial: "X", color: "hsl(0 70% 55%)", lastActive: "9 phút trước" },
  { id: "a5", name: "benito_po...", initial: "B", color: "hsl(280 50% 50%)", lastActive: "22 phút trước" },
];

export const mockStories: Story[] = [
  {
    id: "1",
    title: "Ascension of the Eternal Emperor",
    author: "Celestial Ink",
    description: "In a world where cultivation determines destiny, a young boy with a broken meridian defies the heavens to become the Eternal Emperor.",
    genre: "Fantasy",
    tags: ["Xianxia", "Action", "Adventure"],
    status: "ongoing",
    word_count: 145200,
    chapter_count: 24,
    views: 125000,
    comments: 450,
    rating: 4.8,
    created_at: "2025-11-15",
    updated_at: "2026-02-14",
    cover_color: PASTEL_COLORS[0],
  },
  {
    id: "2",
    title: "The Villainess Reverses the Hourglass",
    author: "Time Weaver",
    description: "Betrayed and executed, Aria returns to the past. This time, she will not be the victim. She will be the villainess who rules them all.",
    genre: "Romance",
    tags: ["Romance", "Reincarnation", "Drama"],
    status: "completed",
    word_count: 89000,
    chapter_count: 18,
    views: 89000,
    comments: 120,
    rating: 4.9,
    created_at: "2025-08-20",
    updated_at: "2026-01-05",
    cover_color: PASTEL_COLORS[1],
  },
  {
    id: "3",
    title: "Level Up: Apocalyptic System",
    author: "System Admin",
    description: "When the world ended, the system initialized. Monsters roam the streets, and humanity's only hope is to level up or die trying.",
    genre: "Sci-Fi",
    tags: ["System", "Apocalypse", "Action"],
    status: "ongoing",
    word_count: 67800,
    chapter_count: 12,
    views: 67000,
    comments: 210,
    rating: 4.6,
    created_at: "2026-01-10",
    updated_at: "2026-02-12",
    cover_color: PASTEL_COLORS[2],
  },
  {
    id: "4",
    title: "The Alchemist's Silent Love",
    author: "Potion Master",
    description: "She was a genius alchemist who couldn't speak. He was a cursed prince who couldn't see. Together, they found a cure for the world.",
    genre: "Romance",
    tags: ["Romance", "Fantasy", "Slice of Life"],
    status: "hiatus",
    word_count: 45000,
    chapter_count: 9,
    views: 45000,
    comments: 85,
    rating: 4.7,
    created_at: "2025-06-01",
    updated_at: "2025-12-20",
    cover_color: PASTEL_COLORS[3],
  },
  {
    id: "5",
    title: "Cyber-Mage: Neon Genesis",
    author: "Techno Wizard",
    description: "In 2077, magic returned. Now, hackers cast spells through code, and corporations rule with iron fists and fireballs.",
    genre: "Sci-Fi",
    tags: ["Sci-fi", "Cyberpunk", "Magic"],
    status: "ongoing",
    word_count: 32000,
    chapter_count: 7,
    views: 32000,
    comments: 60,
    rating: 4.5,
    created_at: "2026-02-01",
    updated_at: "2026-02-15",
    cover_color: PASTEL_COLORS[4],
  },
  {
    id: "6",
    title: "Rebirth of the Demon God",
    author: "Dark Soul",
    description: "He was the strongest Demon God, betrayed by the righteous sects. Reborn 500 years later, he seeks vengeance and absolute power.",
    genre: "Fantasy",
    tags: ["Xianxia", "Dark", "Anti-hero"],
    status: "completed",
    word_count: 150000,
    chapter_count: 30,
    views: 150000,
    comments: 600,
    rating: 4.8,
    created_at: "2025-04-10",
    updated_at: "2025-11-30",
    cover_color: PASTEL_COLORS[5],
  },
  {
    id: "7",
    title: "The Sovereign Lord of the Abyss",
    author: "Void Walker",
    description: "Descending into the Abyss, he found not death but dominion. Now, the creatures of the deep answer to his command.",
    genre: "Fantasy",
    tags: ["Fantasy", "Dark", "Action"],
    status: "ongoing",
    word_count: 98000,
    chapter_count: 20,
    views: 98000,
    comments: 350,
    rating: 4.9,
    created_at: "2025-09-01",
    updated_at: "2026-02-10",
    cover_color: PASTEL_COLORS[6],
  },
];

export const mockRankings: Story[] = [
  mockStories[6], // Sovereign Lord
  mockStories[1], // Villainess
  mockStories[4], // Cyber-Mage
  mockStories[3], // Alchemist
  mockStories[5], // Rebirth
];

export const mockChapters: Record<string, Chapter[]> = {
  "1": [
    {
      id: "1-1", story_id: "1", chapter_number: 1, title: "The Forgotten Seed",
      word_count: 6200,
      content: `The garden had been waiting for her. Not in the way a house waits for its occupant, patient and indifferent, but in the way a living thing waits — with breath held and roots trembling beneath the soil.\n\nMei Lin arrived at the estate on a morning so still that the mist refused to rise from the ground. It clung to the stone pathways like a silk shroud, muffling her footsteps as she walked through the rusted iron gate. The hinges screamed their protest into the silence, a sound so sharp it startled a pair of cranes from the overgrown bamboo grove.\n\nShe had inherited the garden from a grandmother she had never met. The letter from the solicitor had arrived on a Tuesday, wedged between a utility bill and a takeaway menu, as if the universe had decided to deliver destiny with deliberate mundanity.\n\n"The estate of Madam Zhao Ling-Yun," the letter began, "including all grounds, structures, and contents therein, is hereby bequeathed to her sole surviving descendant."\n\nMei had read the letter three times before the words settled into meaning. A grandmother. An estate. An inheritance she had never expected from a woman whose name she had never heard spoken in her parents' careful, curated household.\n\nThe garden stretched before her now, vast and wild and utterly unlike anything she had imagined. Where she had expected neglect, she found abundance. Where she had anticipated decay, there was life — riotous, untamed, magnificent life.\n\nFlowers she could not name grew in impossible colours: blues that shifted to violet in the shadow, whites that glowed faintly in the mist, reds so deep they seemed to pulse with their own heartbeat. Vines climbed walls that shouldn't still be standing, their grip both destroyer and saviour to the ancient stonework.\n\nAt the centre of it all stood a single tree.\n\nIt was not particularly tall, nor particularly wide. Its trunk was the colour of aged parchment, its branches bare despite the lush growth surrounding it. But there was something about it — a gravity, a presence — that made Mei stop walking.\n\nShe stood before it and felt, for the first time in her twenty-six years, that she was exactly where she was supposed to be.\n\nA seed lay at the base of the tree. Small, jade-green, perfectly round. She knelt and picked it up. It was warm in her palm, warmer than the cool morning air should have allowed.\n\nAnd somewhere deep beneath her feet, something ancient stirred.`,
    },
    {
      id: "1-2", story_id: "1", chapter_number: 2, title: "Roots of Memory",
      word_count: 5800,
      content: `The manor house attached to the garden was a study in contradictions. From the outside, it appeared to be crumbling — roof tiles displaced, wooden shutters hanging at drunken angles, the plaster facade mapped with cracks like the lines of an aged palm.\n\nBut inside, it was immaculate.\n\nMei pushed open the front door — unlocked, as if expecting her — and stepped into a hallway that smelled of cedar and old paper. The floor tiles were hand-painted in patterns of intertwining branches, each one slightly different from the next. They led her deeper into the house like a trail of breadcrumbs.\n\nThe kitchen was stocked with dried herbs she didn't recognise, hanging in neat bundles from the ceiling beams. The sitting room held a library of books written in a script she could almost, but not quite, read — classical Chinese characters that danced at the edge of her comprehension.\n\nBut it was the study that stopped her.\n\nThe room was small, barely larger than a closet, but every surface was covered in drawings of plants. Hundreds of them. Thousands. Sketched in ink on rice paper, pinned to the walls, stacked in careful piles on the desk, rolled into scrolls and stored in ceramic jars.\n\nEach drawing was labelled in that same near-readable script. Each plant was rendered with such precision that Mei could see individual veins on the leaves, the exact curl of each petal, the way the roots reached into the earth like fingers searching for something lost.\n\nShe picked up the nearest drawing. It showed a flower with seven petals, each a different shade of blue. Beneath it, a single line of text:\n\n"Memory Bloom — opens only for those who have forgotten something essential."\n\nMei set the drawing down with hands that trembled slightly. She looked out the study window at the garden beyond, where the impossible flowers swayed in a wind she could not feel.\n\nHer grandmother had not been a gardener.\n\nShe had been something else entirely.`,
    },
    {
      id: "1-3", story_id: "1", chapter_number: 3, title: "The First Bloom",
      word_count: 6100,
      content: `She planted the jade seed on the third day.\n\nNot because she had decided to — the decision felt less like a choice and more like a remembering, as if her hands had always known the motion: the careful scraping of earth, the precise depth, the gentle covering.\n\nShe chose a spot near the bare tree, where the soil was darkest and richest, and pressed the seed into the ground with her thumb. The earth was surprisingly warm, almost feverish, and for a moment she thought she felt a pulse beneath her fingertips.\n\nThen she sat back on her heels and waited.\n\nNothing happened. Of course nothing happened. Seeds take days, weeks, sometimes months to germinate. She knew this. She had grown tomatoes on her apartment balcony, had nursed a basil plant through two London winters. She understood patience.\n\nBut this garden, she was beginning to suspect, did not operate on conventional time.\n\nBy sunset, a shoot had appeared.\n\nIt was pale green, almost translucent, rising from the soil with the slow determination of a creature learning to breathe. Mei watched it from the kitchen window as she ate a dinner of rice and the dried mushrooms she'd found in the pantry. The shoot grew visibly, minute by minute, stretching toward the fading light.\n\nBy midnight, when she couldn't sleep and returned to the garden with a lantern, it was a foot tall. Slender as a calligraphy brush, crowned with a single, tightly furled bud.\n\nBy dawn, the bud had opened.\n\nThe flower was like nothing she had seen in her grandmother's drawings, and yet it felt familiar. Its petals were the deep, arterial red of the Imperial court — a colour so vivid it seemed to hum. At its centre, a cluster of golden stamens caught the first light of morning and threw it back in tiny, scattered rainbows.\n\nMei reached out to touch it.\n\nThe moment her finger brushed the nearest petal, the world shifted.\n\nNot violently — there was no earthquake, no flash of light. It was subtler than that. The colours of the garden intensified. The sounds sharpened. The mist drew back as if commanded, revealing paths she hadn't seen before, leading deeper into the grounds.\n\nAnd on the bare tree at the garden's centre, a single leaf appeared.\n\nSmall, jade-green, perfectly shaped. It unfurled in the morning air like a hand opening to reveal a secret.\n\nMei stared at it, then at the flower, then at her own hands — still tingling where they had touched the petals.\n\n"What are you?" she whispered to the garden.\n\nThe garden, in its way, whispered back.`,
    },
  ],
};
