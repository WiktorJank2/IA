import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';
import {BODY_POLYGONS, PolyDef, Pt} from "@/layout/body-canvas/body-polygons.data";


type ColorKey = 'red' | 'orange' | 'green';

type PolyRender = PolyDef & {
    fill: string;
    stroke?: string;
    strokeWidth?: number;
    visible: boolean;
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

    // 3 kolory (paleta)
    private palette: Record<ColorKey, { fill: string; stroke: string }> = {
        red: {fill: 'rgba(255, 0, 0, 0.35)', stroke: 'rgba(255, 0, 0, 0.9)'},
        orange: {fill: 'rgba(255, 123, 0, 0.35)', stroke: 'rgba(255, 123, 0, 0.9)'},
        green: {fill: 'rgba(0, 200, 120, 0.25)', stroke: 'rgba(0, 200, 120, 0.85)'}
    };


    /**
     * MAPA: id -> kolor
     * (Ustawiane w constructorze)
     */
    polygonColors: Record<string, ColorKey> = {};

    /**
     * Widoczność: które id mają być rysowane
     * (Ustawiane w constructorze)
     */
    visibleIds = new Set<string>();

    /**
     * Lista do rysowania (geometria + styl + visible)
     */
    polygons: PolyRender[] = [];

    // Hover i zbieranie punktów
    hover: Pt | null = null;
    collected: Pt[] = [];

    // Canvas internals
    private ctx!: CanvasRenderingContext2D;
    private img = new Image();
    private dpr = 1;
    private adminMode = true

    // =========================================================
    // CONSTRUCTOR – logika startowa: lewa-noga zielona itd.
    // =========================================================
    constructor() {
        // Które elementy startowo pokazujemy
        this.visibleIds = new Set([]);
    }

    showBiceps() {

        this.showPolygon('biceps_1')
        this.setPolygonColor('biceps_1', 'red')

        this.showPolygon('biceps_2')
        this.setPolygonColor('biceps_2', 'red')

    }
    changeColorBiceps() {

        this.setPolygonColor('biceps_1', 'green')
        this.setPolygonColor('biceps_2', 'green')

    }

        // --- Lifecycle ---
    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // HiDPI (ostrość na retina)
        this.ensureHiDpi(canvas, this.ctx);

        // tło
        this.img.src = this.imgSrc;
        this.img.onload = () => {
            this.rebuildPolygons();
            this.redraw();
        };

        // (opcjonalnie) resize
        window.addEventListener('resize', () => {
            this.ensureHiDpi(canvas, this.ctx, true);
            this.redraw();
        });
    }

    // --- Budowanie listy do rysowania ---
    rebuildPolygons() {
        this.polygons = BODY_POLYGONS.map(def => {
            const colorKey = this.polygonColors[def.id] ?? 'red';
            const c = this.palette[colorKey];

            return {
                ...def,
                fill: c.fill,
                stroke: c.stroke,
                strokeWidth: 2,
                visible: this.visibleIds.has(def.id)
            };
        });
    }

    // --- API logiki: pokaz/ukryj/zmien kolor po ID ---
    showOnly(id: string) {
        this.visibleIds = new Set([id]);
        this.rebuildPolygons();
        this.redraw();
    }

    showMany(ids: string[]) {
        this.visibleIds = new Set(ids);
        this.rebuildPolygons();
        this.redraw();
    }

    hidePolygon(id: string) {
        this.visibleIds.delete(id);
        this.rebuildPolygons();
        this.redraw();
    }
    showPolygon(id: string) {
        this.visibleIds.add(id);
    }

    setPolygonColor(id: string, color: ColorKey) {
        this.polygonColors[id] = color;
        this.rebuildPolygons();
        this.redraw();
    }

    // --- Obsługa myszy (hover + zbieranie punktów) ---
    onMouseMove(evt: MouseEvent) {
        if(this.adminMode) {
            this.hover = this.getMousePos(evt);
            this.redraw();
        }

    }

    onMouseLeave() {
        this.hover = null;
        this.redraw();
    }

    addPoint() {
        if (!this.hover) return;
        this.collected.push({...this.hover});
        this.redraw();
        console.log(this.collected)
    }

    clearPoints() {
        this.collected = [];
        this.redraw();
    }

    /**
     * (Opcjonalnie) Zapis zebranych punktów jako NOWY element runtime.
     * Uwaga: nie zapisze do pliku .data.ts, tylko doda do polygons w pamięci.
     */
    saveCollectedAsRuntimePolygon(newId: string, color: ColorKey = 'red') {
        if (this.collected.length < 3) return;

        const c = this.palette[color];
        this.polygons.push({
            id: newId,
            points: this.collected.map(p => ({...p})),
            fill: c.fill,
            stroke: c.stroke,
            strokeWidth: 2,
            visible: true
        });

        this.collected = [];
        this.redraw();
    }

    // --- Rysowanie ---
    redraw() {
        const canvas = this.canvasRef.nativeElement;
        const ctx = this.ctx;
        if (!ctx) return;

        // rozmiar w jednostkach CSS (ważne przy HiDPI)
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.round(rect.width);
        const cssH = Math.round(rect.height);

        // tło
        ctx.clearRect(0, 0, cssW, cssH);
        ctx.drawImage(this.img, 0, 0, cssW, cssH);

        // wielokąty (tylko widoczne)
        for (const poly of this.polygons) {
            if (!poly.visible) continue;
            this.drawPolygon(ctx, poly.points, poly.fill, poly.stroke, poly.strokeWidth ?? 1);
        }

        // zebrane punkty (markery)
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

        // ctx jest przeskalowany o dpr, więc rysujemy w „CSS px”.
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
