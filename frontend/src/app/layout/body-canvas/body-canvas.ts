import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {CommonModule, JsonPipe} from "@angular/common";

type Pt = { x: number; y: number };

@Component({
  selector: 'app-body-canvas',
  imports: [JsonPipe, CommonModule],
  templateUrl: './body-canvas.html',
  styleUrl: './body-canvas.scss'
})
export class BodyCanvas implements AfterViewInit {
    @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    // --- Konfiguracja / stan ---
    imgSrc = '/assets/images/Body-diagram-empty.png';        // ścieżka do obrazka
    fill = 'rgba(255, 0, 0, 0.35)';            // kolor wypełnienia wielokąta
    stroke = 'rgba(255, 0, 0, 0.9)';           // kolor obrysu wielokąta

    // przykładowy nieregularny wielokąt
    polygon: Pt[] = [
        {
            "x": 430,
            "y": 164
        },
        {
            "x": 424,
            "y": 182
        },
        {
            "x": 419,
            "y": 192
        },
        {
            "x": 413,
            "y": 204
        },
        {
            "x": 410,
            "y": 210
        },
        {
            "x": 420,
            "y": 217
        },
        {
            "x": 429,
            "y": 226
        },
        {
            "x": 435,
            "y": 234
        },
        {
            "x": 440,
            "y": 243
        },
        {
            "x": 445,
            "y": 231
        },
        {
            "x": 454,
            "y": 225
        },
        {
            "x": 466,
            "y": 218
        },
        {
            "x": 470,
            "y": 213
        },
        {
            "x": 475,
            "y": 206
        },
        {
            "x": 470,
            "y": 195
        },
        {
            "x": 463,
            "y": 172
        },
        {
            "x": 458,
            "y": 161
        },
        {
            "x": 452,
            "y": 151
        },
        {
            "x": 445,
            "y": 159
        },
        {
            "x": 435,
            "y": 162
        },
        {
            "x": 431,
            "y": 159
        }
    ]

    hover: Pt | null = null;   // aktualna pozycja kursora (współrzędne canvasa)
    collected: Pt[] = [];      // zebrane punkty po kliknięciach

    private ctx!: CanvasRenderingContext2D;
    private img = new Image();
    private dpr = 1;           // devicePixelRatio użyty przy skalowaniu

    // --- Lifecycle ---
    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // dbałość o ostrość na HiDPI (Retina)
        this.ensureHiDpi(canvas, this.ctx);

        // wczytaj obraz i narysuj
        this.img.src = this.imgSrc;
        this.img.onload = () => this.redraw();

        // (opcjonalnie) przerysuj przy zmianie rozmiaru okna
        window.addEventListener('resize', () => {
            // jeżeli canvas ma się skalować responsywnie przez CSS,
            // można tu ponownie wywołać ensureHiDpi i redraw:
            this.ensureHiDpi(canvas, this.ctx, /*recalc*/ true);
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
        if (this.hover) {
            this.collected.push({ ...this.hover });
            this.redraw();
        }
        console.log(this.collected as [])
    }

    clearPoints() {
        this.collected = [];
        this.redraw();
    }

    // --- Akcje przykładowe ---
    toggleColor() {
        const redFill = 'rgba(255, 0, 0, 0.35)';
        const blueFill = 'rgba(0, 120, 255, 0.35)';
        this.fill = this.fill === redFill ? blueFill : redFill;
        this.stroke = this.fill === redFill ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 120, 255, 0.9)';
        this.redraw();
    }

    nudge() {
        // przesunięcie całego wielokąta w prawo o 10 px
        this.polygon = this.polygon.map(p => ({ x: p.x - 10, y: p.y }));
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

        // tło: obraz
        ctx.clearRect(0, 0, cssW, cssH);
        ctx.drawImage(this.img, 0, 0, cssW, cssH);

        // nieregularny wielokąt (przykład overlayu)
        this.drawPolygon(ctx, this.polygon, this.fill, this.stroke, 2);

        // zebrane punkty (markery)
        for (const p of this.collected) {
            this.drawPoint(ctx, p, '#ffd166');
        }

        // podgląd pozycji kursora (hover)
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
        ctx.lineTo(ctx.canvas.width / this.dpr, p.y); // długość po skali
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
    /** Mapa współrzędnych ekranu do współrzędnych canvasa (uwzględnia CSS scaling i HiDPI). */
    private getMousePos(evt: MouseEvent): Pt {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();

        // Skala między rozmiarem „CSS” a wewnętrzną siatką pikseli po skalowaniu HiDPI
        // Uwaga: ctx jest przeskalowany o dpr, więc logika rysowania używa wartości „CSS”.
        const scaleX = (canvas.width / this.dpr) / rect.width;
        const scaleY = (canvas.height / this.dpr) / rect.height;

        return {
            x: Math.round((evt.clientX - rect.left) * scaleX),
            y: Math.round((evt.clientY - rect.top) * scaleY)
        };
    }

    /**
     * Ustawia rozdzielczość canvasa pod HiDPI tak, by rysunek był ostry,
     * a współrzędne pozostały w „jednostkach CSS”.
     */
    private ensureHiDpi(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, recalc = false) {
        const rect = canvas.getBoundingClientRect();
        this.dpr = window.devicePixelRatio || 1;

        // Jeśli nie przeliczasz rozmiaru (np. masz stały width/height w atrybutach),
        // ten blok można uprościć.
        const displayWidth = Math.max(1, Math.round(rect.width));
        const displayHeight = Math.max(1, Math.round(rect.height));

        // ustaw fizyczną rozdzielczość canvasa
        canvas.width = Math.round(displayWidth * this.dpr);
        canvas.height = Math.round(displayHeight * this.dpr);

        // dopasuj styl (CSS) do rozmiaru „logicznego”
        if (recalc) {
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
        }

        // skala kontekstu tak, by 1 jednostka odpowiadała 1px CSS
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset ewentualnych wcześniejszych skal
        ctx.scale(this.dpr, this.dpr);
    }
}
