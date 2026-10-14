# AI-Enabled Detection and Analysis of Microplastics in Drinking Water Systems

An advanced, peer-reviewed grade scientific frontend application designed for environmental laboratories, municipal water utilities, and academic researchers to demonstrate the computer-vision-assisted detection, morphological classification, and concentration profiling of microplastics in potable water systems.

---

## 🌟 Key Highlights & Features

- **Scientific Design System**: Deep navy, white, teal, cyan, and subtle environmental green palette, custom typography (Google Fonts *Plus Jakarta Sans* & *JetBrains Mono*), and dark/light mode toggle stored in `localStorage`.
- **Pure Web Technologies**: Built strictly using **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. No heavy JS frameworks (React, Angular, Vue), no TypeScript, and no build tools (Webpack, Vite) required.
- **Microscopy-Grade Visualizations**: High-resolution fluorescence micrographs, real 100x magnification grid counting slides, and interactive HTML5 canvas overlays with calibrated particle bounding boxes.
- **Four-Morphology Optical Classification**: Automated categorization into **Fibers**, **Fragments**, **Films**, and **Beads/Microspheres** with aspect ratios and confidence ratings.
- **Dynamic Interactive Dashboard**: Powered by Chart.js (CDN) for real-time morphology doughnuts, timeline detection trends, location concentration bar charts, and size distribution histograms.
- **Client-Side Data Persistence**: Browser `localStorage` sandbox manager (`WaterQualityDB`) providing immediate CRUD operations (Create, Read, Update, Delete), search, filtering, and sorting without needing an external database.
- **Reporting & Exporting**: 1-click CSV export of sample catalogs, JSON payload downloads, and print-ready formatted laboratory certificates via browser `@media print`.
- **Transparent Scientific Integrity**: Prominent **Demo Mode** labeling that explicitly separates simulated optical classification from genuine laser micro-spectroscopy (FTIR/Raman) and avoids unverified binary "safe/unsafe" water safety declarations.

---

## 📁 Project File Structure

```text
AI Detaction MicroPlastic/
├── index.html              # Scientific landing page & project overview
├── dashboard.html          # Real-time monitoring dashboard with KPI metrics & Chart.js charts
├── detection.html          # Water sample submission form & AI inference pipeline simulation
├── analysis.html           # In-depth optical micrograph canvas with interactive particle bounding boxes
├── samples.html            # Searchable, filterable sample repository with CRUD & pagination
├── research.html           # Deep academic monograph: morphology taxonomy, spectroscopy & limitations
├── contact.html            # Academic inquiry form with client-side validation
├── css/
│   ├── style.css           # Core scientific design system, themes, typography, cards & print styles
│   └── responsive.css      # Fluid layouts and media queries for mobile, tablet, and desktop
├── js/
│   ├── main.js             # Theme toggle, toast notifications, modals, and WaterQualityDB (localStorage)
│   ├── dashboard.js        # KPI calculators and dynamic Chart.js instances
│   ├── detection.js        # File upload validation, drag-and-drop, and multi-step pipeline simulation
│   ├── analysis.js         # HTML5 canvas bounding box rendering, hover tooltips, and report exports
│   ├── samples.js          # Search, status filtering, column sorting, pagination, and edit/delete modals
│   ├── research.js         # Interactive table of contents scroll-spy
│   └── contact.js          # Form validation and transparent demo submission logging
├── assets/
│   ├── images/
│   │   ├── hero_microplastic.jpg          # Fluorescence microscopy hero visual
│   │   ├── lab_analysis.jpg               # Modern water analysis laser spectrometer laboratory
│   │   └── sample_microscope_slide.jpg    # 100x calibrated microscope slide with fibers & fragments
│   └── icons/
└── README.md               # Complete documentation and execution guide
```

---

## 🚀 How to Run the Website Locally

No Node.js, npm, or build tools are needed. You can run the application using either of the following straightforward methods:

### Method 1: Direct Browser Launch (Simplest)
1. Navigate to the project folder:
   ```text
   c:\Users\91751\Desktop\AI Detaction MicroPlastic\
   ```
2. Double-click on `index.html` to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 2: Local HTTP Server (Recommended for Best Font & Canvas Performance)
If you have Python or a lightweight HTTP utility installed, you can serve the directory locally:

- **Using Python 3**:
  ```bash
  python -m http.server 8080
  ```
  Then open `http://localhost:8080` in your web browser.

- **Using VS Code Live Server**:
  Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🧪 Demonstration Mode vs. Production Architecture

This project is delivered as a **fully functional client-side scientific frontend**. To maintain strict scientific honesty and ethical transparency, the interface explicitly notes its current simulation boundary:

| Feature Area | Current Frontend Demo Implementation | External Production Integration Required |
| :--- | :--- | :--- |
| **Micrograph Ingestion** | Local drag-and-drop file preview with file type & 15MB size check. Instant "Load Demo Slide" feature. | Direct high-speed USB3 / GigE optical camera driver streaming from an automated microscope. |
| **Vision Inference** | Client-side heuristic pipeline simulating 4-stage edge detection, bounding coordinates, and confidence scores. | Deployed PyTorch or TensorFlow REST/gRPC API running a trained YOLOv9 or U-Net segmentation model on an NVIDIA GPU server. |
| **Data Persistence** | Saved locally in browser `localStorage`. Persists across reloads on the user's computer. | Relational database (PostgreSQL / MySQL) or LIMS (Laboratory Information Management System) connected via REST API. |
| **Spectroscopy Validation** | Educational guidance comparing optical findings to Micro-FTIR and Micro-Raman vibrational spectra. | Hardware driver integration with Horiba / Thermo Fisher laser spectrometers for automated point-and-shoot chemical verification. |
| **Contact Form** | Client-side validation for name, academic email, and character minimums. Payload logged to DevTools console. | Server-side SMTP or transactional email service (SendGrid, Mailgun, AWS SES, or Node.js Nodemailer). |

---

## 🔬 Scientific Methodology & Ethical Notice

1. **Candidate vs. Confirmed Polymers**:
   Optical microscopy can detect *candidate microplastic particles* based on morphology, color, and aspect ratio. However, natural particles (such as dyed cellulose, cotton fibers, and mineral silica) can mimic plastic particles. Definite polymer identification (e.g., Polyethylene, Polypropylene, PET, Polystyrene) requires micro-FTIR or micro-Raman spectroscopy.
2. **Potable Water Health Thresholds**:
   The World Health Organization (WHO) and EPA have not codified enforceable legal maximum contaminant levels (MCL) for microplastics in tap water due to ongoing toxicological research into human cellular absorption. Consequently, this application reports **particle counts and concentrations in particles per liter (part/L)** without claiming arbitrary "safe" or "unsafe" statuses.

---

## 📄 License & Academic Citation

Developed for academic coursework, student engineering demonstration, and environmental science research presentations.
If referencing this project in research, please cite:

> *AquaNanoAI Research Group (2026). "AI-Enabled Detection and Analysis of Microplastics in Drinking Water Systems: A Client-Side Optical Demonstration." Academic Software Repository.*
