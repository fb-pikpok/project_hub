# ML Games Playground

## Purpose

This project is a small interactive portfolio hub to showcase machine learning / algorithmic experiments as web demos.  
The first demo is a top‑down warehouse scenario where a robot learns (via Q‑learning) to navigate through obstacles to reach a goal.  
The hub will allow visitors (friends, potential employers) to explore multiple projects, starting with this warehouse RL demo and a dummy placeholder project.

---

## Tech Stack & Choices

| Component | Technology | Why We Use It Now |
|---|---|---|
| **Web framework** | Next.js + React + TypeScript | To build the hub and project pages with clean routing, strong typing, good developer experience. |
| **Styling / UI** | Tailwind CSS + shadcn/ui | For quickly putting together consistent, clean UI components without writing lots of CSS from scratch. |
| **State management** | Zustand | Simple, lightweight global state for controlling simulation (play/pause, speed, parameters). |
| **2D rendering** | PixiJS | Fast GPU‑accelerated rendering for grid, agent, obstacles; needed for smooth animation. |
| **Learning algorithm** | Tabular Q‑learning (plain TS) | Easy to understand & implement; no heavy ML overhead; runs entirely in browser. |
| **Routing / Pages** | Next.js App Router | Simple file‑based routing: hub page → individual project pages. |

---

## Project Structure (soon)

```
/app
  /page.tsx                  ← Hub page listing projects
  /projects
    /warehouse
      page.tsx               ← Warehouse RL demo
      engine/
        grid.ts
        agent.ts
        sim.ts
      view/
        PixiStage.tsx
        Controls.tsx
    /dummy
      page.tsx               ← Dummy project (just text)
lib/
  store.ts                   ← Zustand store
styles/
  globals.css                ← Tailwind base
```

---

## Getting Started / Prototype Tasks

Here’s what to build first, in order, so that you have a working prototype:

1. **Initialize project**  
   - Create Next.js project with TypeScript  
   - Install Tailwind CSS & set up config  
   - Install shadcn/ui components  

2. **Hub page** (`/app/page.tsx`)  
   - Create two “cards”: *Warehouse RL* and *Dummy Project*  
   - Each card: title, short description, a button/link to open the project page  

3. **Dummy Project page** (`/app/projects/dummy/page.tsx`)  
   - Simple static page with heading + paragraph text explaining “this is a placeholder project”  

4. **Warehouse RL demo basics**  
   - **Grid & map**: draw a grid (e.g. 20×20) with obstacles, start, goal  
   - **Agent logic**: implement Q‑learning table, state transitions, reward/penalty logic in TypeScript  
   - **Rendering**: set up PixiJS stage to draw grid, obstacles, agent, goal; animate movement step by step  

5. **Controls / UI**  
   - Husl/ UI design: Play / Pause, Reset, Speed slider via Zustand store  
   - Hook up UI so user can start/stop simulation, reset the map  

6. **Linking things together & routing**  
   - Make sure the Warehouse page is reachable from hub → /projects/warehouse  
   - Make navigation consistent  

7. **Local Testing & Deploy**  
   - Run locally → check that hub page, dummy page, warehouse page all work without errors  
   - Deploy (e.g. via Vercel or similar) so the prototype is live  

---

## How to Run

```bash
# Clone repository
git clone <your‑repo‑url>
cd ml‑games‑playground

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser: http://localhost:3000
```

---

## Goals for This Prototype

- Show a working web hub with at least two projects (one real interactive, one dummy)  
- Have the warehouse RL demo functioning: grid, agent, controls (play/pause/reset/speed)  
- Ensure performance is acceptable in browser (no big lag for small grid)  

---

## License & Contact

You can use and modify this code as you like. If you have questions or feedback, reach out to __Your Name__ at __your email__.
