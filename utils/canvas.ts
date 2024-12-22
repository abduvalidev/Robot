import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  idleMainFramesX,
  idleMainFramesY,
  InitialMainFrameState,
  MAIN_ROBOT_HEIGHT,
  MAIN_ROBOT_WIDTH,
  MAIN_ROBOT_Y,
} from "./constants";
import { SpriteObjectType } from "./types";

const mainRobotX = 100;

class MainRobotCanvas {
  private ctx!: CanvasRenderingContext2D | null;
  private main!: {
    idle: SpriteObjectType;
    idleImage: HTMLImageElement;
  };
  private frame!: number;

  constructor({ canvas }: { canvas: HTMLCanvasElement | null }) {
    if (canvas) {
      this.ctx = canvas.getContext("2d");
      this._resizeCanvas();
      this._setInitialState();
      this.frame = requestAnimationFrame(this._loop.bind(this));
    }
  }

  public async startAnimation(): Promise<void> {
    await this._init();
    this.frame = requestAnimationFrame(this._loop.bind(this));
  }

  private _resizeCanvas() {
    if (this.ctx && "canvas" in this.ctx) {
      this.ctx.canvas.width = CANVAS_WIDTH;
      this.ctx.canvas.height = CANVAS_HEIGHT;
    }
  }

  private _setInitialState(): void {
    this.main = {
      idle: { ...InitialMainFrameState },
      idleImage: new Image(),
    };
  }

  private async _init(): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        this.main.idleImage.onload = resolve;
        this.main.idleImage.onerror = reject;
        this.main.idleImage.src = "/idle.webp";
      });
    } catch (error) {
      console.error("Image failed to load", error);
    }
  }

  private _drawMainIdle(t: number): void {
    const { width, height, index_x, index_y, tickFrame, last_tick_at, frameNumber } = this.main.idle;
    const x = width * index_x;
    const y = height * index_y;

    if (!last_tick_at || t - last_tick_at >= tickFrame) {
      this.main.idle.last_tick_at = t;
      this.main.idle.frameNumber = frameNumber + 1;

      if (index_x < idleMainFramesX - 1) {
        this.main.idle.index_x += 1;
      } else if (index_y < idleMainFramesY - 1) {
        this.main.idle.index_x = 0;
        this.main.idle.index_y += 1;
      } else {
        this.main.idle.index_y = 0;
        this.main.idle.index_x = 0;
        this.main.idle.frameNumber = 0;
      }
    }

    if (this.ctx) {
      this.ctx.clearRect(mainRobotX, MAIN_ROBOT_Y, MAIN_ROBOT_WIDTH, MAIN_ROBOT_HEIGHT);
      this.ctx.drawImage(
        this.main.idleImage,
        x,
        y,
        width,
        height,
        mainRobotX,
        MAIN_ROBOT_Y,
        MAIN_ROBOT_WIDTH,
        MAIN_ROBOT_HEIGHT
      );
    }
  }

  private _loop(t: number): void {
    if (this.ctx) {
      this._drawMainIdle(t);
      this.frame = requestAnimationFrame(this._loop.bind(this));
    }
  }
}

export default MainRobotCanvas;
