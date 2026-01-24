// ---- Typy ----
export type Pt = { x: number; y: number };

export type PolyDef = {
    id: string;
    points: Pt[];
};

// ---- Dane ----
// TYLKO punkty, ZERO kolorów, ZERO logiki
export const BODY_POLYGONS: PolyDef[] = [
    {
        id: 'lewa-noga',
        points: [
            {
                "x": 58,
                "y": 97
            },
            {
                "x": 45,
                "y": 105
            },
            {
                "x": 38,
                "y": 125
            },
            {
                "x": 46,
                "y": 138
            },
            {
                "x": 56,
                "y": 146
            },
            {
                "x": 81,
                "y": 149
            },
            {
                "x": 103,
                "y": 146
            },
            {
                "x": 118,
                "y": 139
            },
            {
                "x": 119,
                "y": 118
            },
            {
                "x": 119,
                "y": 97
            },
            {
                "x": 99,
                "y": 91
            },
            {
                "x": 84,
                "y": 87
            },
            {
                "x": 67,
                "y": 92
            }
        ]
    },
    {
        id: 'prawa-noga',
        points: [
            {
                "x": 221,
                "y": 120
            },
            {
                "x": 212,
                "y": 130
            },
            {
                "x": 206,
                "y": 146
            },
            {
                "x": 209,
                "y": 168
            },
            {
                "x": 211,
                "y": 183
            },
            {
                "x": 227,
                "y": 182
            },
            {
                "x": 236,
                "y": 177
            },
            {
                "x": 240,
                "y": 160
            },
            {
                "x": 237,
                "y": 139
            },
            {
                "x": 232,
                "y": 129
            },
            {
                "x": 229,
                "y": 126
            }
        ]
    }
];
