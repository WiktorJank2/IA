import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {
    OnChanges,
    Input,
    SimpleChanges,
} from '@angular/core';
import {CommonModule, JsonPipe} from '@angular/common';
import {BODY_POLYGONS, PolyDef, Pt} from "@/layout/body-canvas/body-polygons.data";
import { MUSCLE_TO_POLYGONS } from '@/layout/body-canvas/muscle-polygons.map';



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
    imports: [
        CommonModule,
        JsonPipe,
    ],
    templateUrl: './body-canvas.html',
    styleUrls: ['./body-canvas.scss']
})
export class BodyCanvas implements AfterViewInit, OnChanges {




    @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    // --- Konfiguracja / stan ---
    imgSrc = '/assets/images/Body-diagram-empty.png';

    // 3 kolory (paleta)
    private palette: Record<ColorKey, { fill: string; stroke: string }> = {
        red: {fill: 'rgba(255, 0, 0, 0.35)', stroke: 'rgba(255, 0, 0, 0.9)'},
        orange: {fill: 'rgba(255, 123, 0, 0.35)', stroke: 'rgba(255, 123, 0, 0.9)'},
        green: {fill: 'rgba(0, 200, 120, 0.25)', stroke: 'rgba(0, 200, 120, 0.85)'}
    };


    polygonColors: Record<string, ColorKey> = {};
    visibleIds = new Set<string>();
    polygons: PolyRender[] = [];
    hoveredMuscle: string | null = null;
    // Hover i zbieranie punktów
    hover: Pt | null = null;
    collected: Pt[] = [];

    // Canvas internals
    private ctx!: CanvasRenderingContext2D;
    private img = new Image();
    private dpr = 1;
    private adminMode = false

    constructor() {
        // Które elementy startowo pokazujemy
        this.visibleIds = new Set([]);


    }

    showMuscles() {

        this.showPolygon('biceps_1')
        this.showPolygon('biceps_2')
        this.showPolygon('biceps_3')
        this.showPolygon('forearm_1')
        this.showPolygon('forearm_2')
        this.showPolygon('forearm_3')
        this.showPolygon('forearm_4')
        this.showPolygon('forearm_5')
        this.showPolygon('chest_1')
        this.showPolygon('chest_2')
        this.showPolygon('chest_3')
        this.showPolygon('abdominals_1')
        this.showPolygon('abdominals_2')
        this.showPolygon('abdominals_3')
        this.showPolygon('abdominals_4')
        this.showPolygon('abdominals_5')
        this.showPolygon('abdominals_6')
        this.showPolygon('abdominals_7')
        this.showPolygon('abdominals_8')
        this.showPolygon('abdominals_9')
        this.showPolygon('adductors_1')
        this.showPolygon('adductors_2')
        this.showPolygon('adductors_3')
        this.showPolygon('calves_1')
        this.showPolygon('calves_2')
        this.showPolygon('calves_3')
        this.showPolygon('calves_4')
        this.showPolygon('calves_5')
        this.showPolygon('calves_6')
        this.showPolygon('calves_7')
        this.showPolygon('glutes_1')
        this.showPolygon('glutes_2')
        this.showPolygon('hamstrings_1')
        this.showPolygon('hamstrings_2')
        this.showPolygon('hamstrings_3')
        this.showPolygon('hip-flexors_1')
        this.showPolygon('hip-flexors_2')
        this.showPolygon('hip-flexors_3')
        this.showPolygon('hip-flexors_4')
        this.showPolygon('hip-flexors_5')
        this.showPolygon('shoulders_1')
        this.showPolygon('shoulders_2')
        this.showPolygon('shoulders_3')
        this.showPolygon('shoulders_4')
        this.showPolygon('shoulders_5')
        this.showPolygon('triceps_1')
        this.showPolygon('triceps_2')
        this.showPolygon('triceps_3')
        this.showPolygon('obliques_1')
        this.showPolygon('obliques_2')
        this.showPolygon('obliques_3')
        this.showPolygon('obliques_4')
        this.showPolygon('obliques_5')
        this.showPolygon('quadriceps_1')
        this.showPolygon('quadriceps_2')
        this.showPolygon('quadriceps_3')
        this.showPolygon('rear-deltoids_1')
        this.showPolygon('rear-deltoids_2')
        this.showPolygon('upper-back_1')
        this.showPolygon('upper-back_2')
        this.showPolygon('upper-back_3')
        this.showPolygon('upper-back_4')
        this.showPolygon('lats_1')
        this.showPolygon('lats_2')
        this.showPolygon('lats_3')
        this.showPolygon('triceps_1')
        this.showPolygon('triceps_2')
        this.showPolygon('triceps_3')
        this.showPolygon('lower-back_1')
        this.showPolygon('neck_1')
        this.showPolygon('neck_2')
    }
    changeMuscleColor() {

        this.setPolygonColor('biceps_1', 'green')
        this.setPolygonColor('biceps_2', 'green')
        this.setPolygonColor('chest_1', 'red')

    }

    @Input() muscleLoad: Record<string, number> = {};
    applyMuscleColors() {
        for (const [muscle, load] of Object.entries(this.muscleLoad)) {
            const color = this.getColorForLoad(load); // returns 'green', 'orange', or 'red'
            console.log(muscle, color);
            const polygons = MUSCLE_TO_POLYGONS[muscle.toLowerCase()] ?? [];
            console.log('polygons for', muscle, MUSCLE_TO_POLYGONS[muscle]);
            polygons.forEach(polyId => {
                this.setPolygonColor(polyId, color); // set color for each polygon
                console.log('setting color for', polyId, color);
            });
        }

        this.rebuildPolygons(); // update fill/stroke
        this.redraw();          // render
    }

    initPolygons() {
        for (const muscle in MUSCLE_TO_POLYGONS) {
            MUSCLE_TO_POLYGONS[muscle].forEach(polyId => {
                const polygon = this.getPolygonById(polyId); // implement this to find the polygon object
                if (polygon) {
                    this.polygons.push(polygon);
                }
            });
        }
    }

    getPolygonById(id: string): PolyRender | undefined {
        return this.polygons.find(p => p.id === id);
    }

    getColorForLoad(load: number): ColorKey {
        if (load >= 380) return 'red';
        if (load >= 240) return 'orange';
        return 'green';
    }


        // --- Lifecycle ---
    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // HiDPI setup
        this.ensureHiDpi(canvas, this.ctx);

        // Load background image
        this.img.src = this.imgSrc;
        this.img.onload = () => {
            this.showMuscles();        // add IDs to visibleIds
            this.applyMuscleColors();  // sets colors & rebuilds polygons
            this.redraw();            // render everything
        };

    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['muscleLoad']) {
            this.applyMuscleColors();
        }
        if (changes['activeMuscles']) {
            this.applyActiveMuscles();
        }
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



    @Input() activeMuscles: string[] = [];
    applyActiveMuscles() {
        // All polygons start as red
        for (const muscle in MUSCLE_TO_POLYGONS) {
            MUSCLE_TO_POLYGONS[muscle].forEach(polyId => {
                this.polygonColors[polyId] = 'red';
            });
        }

        // Set selected muscles to green
        this.activeMuscles.forEach(muscle => {
            const polygons = MUSCLE_TO_POLYGONS[muscle.toLowerCase()] ?? [];
            polygons.forEach(polyId => {
                this.setPolygonColor(polyId, 'green');
            });
        });

        this.rebuildPolygons();
        this.redraw();
    }



    onMouseMove(evt: MouseEvent) {


        const mousePos = this.getMousePos(evt);
        this.hover = mousePos;

        // reset hovered muscle
        this.hoveredMuscle = null;

        // find first visible polygon under mouse
        for (const poly of this.polygons) {
            if (!poly.visible) continue;
            if (this.isPointInPolygon(mousePos, poly.points)) {
                // find which muscle this polygon belongs to
                const muscle = Object.keys(MUSCLE_TO_POLYGONS).find(m =>
                    MUSCLE_TO_POLYGONS[m].includes(poly.id)
                );
                this.hoveredMuscle = muscle ?? null;
                break;
            }
        }

        this.redraw();
    }

    private isPointInPolygon(point: Pt, polygon: Pt[]): boolean {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 0.00001) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    onMouseLeave() {
        this.hover = null;
        this.hoveredMuscle = null;
        this.redraw();
    }

    addPoint() {
        if(this.adminMode==true){
        if (!this.hover) return;
        this.collected.push({...this.hover});
        this.redraw();
        console.log(this.collected)
    }}

    clearPoints() {
        this.collected = [];
        this.redraw();
    }

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
        if (this.hover && this.hoveredMuscle) {
            this.drawLabel(ctx, this.hover, this.hoveredMuscle);
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
