import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

type Pt = { x: number; y: number };

type Poly = {
    id: string;
    points: Pt[];
    fill: string;
    stroke?: string;
    strokeWidth?: number;
};

@Component({
    selector: 'app-body-canvas',
    standalone: true,
    imports: [CommonModule, JsonPipe],
    templateUrl: './body-canvas.html',
    styleUrls: ['./body-canvas.scss']
})
export class BodyCanvas implements AfterViewInit {
    @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    // --- Konfiguracja / stan ---
    imgSrc = '/assets/images/Body-diagram-empty.png';

    hover: Pt | null = null;   // aktualna pozycja kursora
    collected: Pt[] = [];      // punkty zbierane kliknięciami (do stworzenia nowego wielokąta)

    // WIELE wielokątów (Twoje dane przeniesione jako pierwszy element listy)
    polygons: Poly[] = [
        {
            id: 'poly_1',
            fill: 'rgba(255, 0, 0, 0.35)',
            stroke: 'rgba(255, 0, 0, 0.9)',
            strokeWidth: 2,
            points: [
                { x: 430, y: 164 },
                { x: 424, y: 182 },
                { x: 419, y: 192 },
                { x: 413, y: 204 },
                { x: 410, y: 210 },
                { x: 420, y: 217 },
                { x: 429, y: 226 },
                { x: 435, y: 234 },
                { x: 440, y: 243 },
                { x: 445, y: 231 },
                { x: 454, y: 225 },
                { x: 466, y: 218 },
                { x: 470, y: 213 },
                { x: 475, y: 206 },
                { x: 470, y: 195 },
                { x: 463, y: 172 },
                { x: 458, y: 161 },
                { x: 452, y: 151 },
                { x: 445, y: 159 },
                { x: 435, y: 162 },
                { x: 431, y: 159 }
            ]
        },
        {
            id: 'polly_2',
            fill: 'rgba(255, 0, 0, 0.35)',
            stroke: 'rgba(255, 0, 0, 0.9)',
            strokeWidth: 2,
            points:[
                {
                    "x": 44,
                    "y": 80
                },
                {
                    "x": 33,
                    "y": 88
                },
                {
                    "x": 38,
                    "y": 107
                },
                {
                    "x": 49,
                    "y": 117
                },
                {
                    "x": 63,
                    "y": 120
                },
                {
                    "x": 79,
                    "y": 118
                },
                {
                    "x": 94,
                    "y": 102
                },
                {
                    "x": 94,
                    "y": 92
                },
                {
                    "x": 85,
                    "y": 83
                },
                {
                    "x": 61,
                    "y": 79
                },
                {
                    "x": 54,
                    "y": 79
                }
            ]
        }
    ];

    private ctx!: CanvasRenderingContext2D;
    private img = new Image();
    private dpr = 1;

    // --- Lifecycle ---
    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.ensureHiDpi(canvas, this.ctx);

        this.img.src = this.imgSrc;
        this.img.onload = () => this.redraw();

        window.addEventListener('resize', () => {
            this.ensureHiDpi(canvas, this.ctx, true);
            this.redraw();
        });
    }

    // --- Obsługa myszy ---
    onMouseMove(evt: MouseEvent) {
        this.hover = this.getMousePos(evt);
        this.redraw();
    }

    onMouseLeave() {
        this.hover = null;
        this.redraw();
    }

    addPoint() {
        if (!this.hover) return;
        this.collected.push({ ...this.hover });
        this.redraw();
        console.log(this.collected)
    }

    clearPoints() {
        this.collected = [];
        this.redraw();
    }

    // Zapisz aktualnie zebrane punkty jako NOWY wielokąt
    saveCollectedAsPolygon() {
        if (this.collected.length < 3) return;

        const id = (crypto as any)?.randomUUID?.() ?? `poly_${Date.now()}`;

        this.polygons.push({
            id,
            points: this.collected.map(p => ({ ...p })),
            fill: 'rgba(0, 120, 255, 0.30)',
            stroke: 'rgba(0, 120, 255, 0.9)',
            strokeWidth: 2
        });

        this.collected = [];
        this.redraw();
    }

    // przykład przesuwania: przesuwa WSZYSTKIE wielokąty w lewo o 10px
    nudgeAllLeft() {
        this.polygons = this.polygons.map(poly => ({
            ...poly,
            points: poly.points.map(p => ({ x: p.x - 10, y: p.y }))
        }));
        this.redraw();
    }

    // opcjonalnie: przesuwaj konkretny wielokąt po id
    movePolygon(id: string, dx: number, dy: number) {
        const poly = this.polygons.find(p => p.id === id);
        if (!poly) return;
        poly.points = poly.points.map(pt => ({ x: pt.x + dx, y: pt.y + dy }));
        this.redraw();
    }

    // --- Rysowanie ---
    redraw() {
        const canvas = this.canvasRef.nativeElement;
        const ctx = this.ctx;
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const cssW = Math.round(rect.width);
        const cssH = Math.round(rect.height);

        ctx.clearRect(0, 0, cssW, cssH);
        ctx.drawImage(this.img, 0, 0, cssW, cssH);

        // rysuj WSZYSTKIE wielokąty
        for (const poly of this.polygons) {
            this.drawPolygon(
                ctx,
                poly.points,
                poly.fill,
                poly.stroke,
                poly.strokeWidth ?? 1
            );
        }

        // punkty zebrane (markery)
        for (const p of this.collected) {
            this.drawPoint(ctx, p, '#ffd166');
        }

        // hover HUD
        if (this.hover) {
            this.drawCrosshair(ctx, this.hover);
            this.drawLabel(ctx, this.hover, `(${this.hover.x}, ${this.hover.y})`);
        }
    }

    private drawPolygon(
        ctx: CanvasRenderingContext2D,
        points: Pt[],
        fillStyle: string,
        strokeStyle?: string,
        strokeWidth = 1
    ) {
        if (points.length < 3) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = fillStyle;
        ctx.fill();

        if (strokeStyle) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
        }
        ctx.restore();
    }

    private drawPoint(ctx: CanvasRenderingContext2D, p: Pt, color = '#ff0') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    private drawCrosshair(ctx: CanvasRenderingContext2D, p: Pt) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        // pozioma
        ctx.beginPath();
        ctx.moveTo(0, p.y);
        ctx.lineTo(ctx.canvas.width / this.dpr, p.y);
        ctx.stroke();

        // pionowa
        ctx.beginPath();
        ctx.moveTo(p.x, 0);
        ctx.lineTo(p.x, ctx.canvas.height / this.dpr);
        ctx.stroke();

        ctx.restore();
    }

    private drawLabel(ctx: CanvasRenderingContext2D, p: Pt, text: string) {
        ctx.save();
        ctx.font = '12px sans-serif';
        const padding = 4;
        const metrics = ctx.measureText(text);
        const w = metrics.width + padding * 2;
        const h = 16 + padding * 2;
        const x = p.x + 8;
        const y = p.y - (h + 8);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#fff';
        ctx.fillText(text, x + padding, y + 12 + padding - 2);
        ctx.restore();
    }

    // --- Współrzędne i HiDPI ---
    private getMousePos(evt: MouseEvent): Pt {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();

        const scaleX = (canvas.width / this.dpr) / rect.width;
        const scaleY = (canvas.height / this.dpr) / rect.height;

        return {
            x: Math.round((evt.clientX - rect.left) * scaleX),
            y: Math.round((evt.clientY - rect.top) * scaleY)
        };
    }

    private ensureHiDpi(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, recalc = false) {
        const rect = canvas.getBoundingClientRect();
        this.dpr = window.devicePixelRatio || 1;

        const displayWidth = Math.max(1, Math.round(rect.width));
        const displayHeight = Math.max(1, Math.round(rect.height));

        canvas.width = Math.round(displayWidth * this.dpr);
        canvas.height = Math.round(displayHeight * this.dpr);

        if (recalc) {
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(this.dpr, this.dpr);
    }
}
