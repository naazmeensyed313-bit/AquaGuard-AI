"""
Generates the Project_Screenshots.pdf portfolio for AquaGuard AI using ReportLab.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_screenshots_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#004B5A"),
    )

    sub_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4F6C76"),
    )

    h2_style = ParagraphStyle(
        "ScreenHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#004B5A"),
        spaceBefore=8,
        spaceAfter=4,
    )

    route_badge = ParagraphStyle(
        "RouteBadge",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#0F6477"),
        alignment=2,
    )

    desc_style = ParagraphStyle(
        "ScreenDesc",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#2D3748"),
    )

    box_title = ParagraphStyle(
        "BoxTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#004B5A"),
    )

    box_text = ParagraphStyle(
        "BoxText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#4A5568"),
    )

    story = []

    # Title Cover Header
    header_data = [
        [
            Paragraph("<b>AquaGuard AI — Project Visual Portfolio & Screenshots</b>", title_style),
            Paragraph("<b>FULL-STACK DELIVERABLE<br/>UI/UX & ML WORKFLOWS</b>", route_badge),
        ],
        [
            Paragraph("End-to-End Visual Documentation Across All 8 Core Application Routes & Decision Workflows", sub_style),
            Paragraph("", sub_style),
        ]
    ]
    t_head = Table(header_data, colWidths=[380, 160])
    t_head.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_head)
    story.append(Spacer(1, 14))

    screens = [
        (
            "1. Landing Page & Interactive Screening Preview",
            "Route: /",
            "Public entry point outlining the decision-support mission aligned with UN SDG 6. Features an interactive telemetry preview card allowing users to manipulate water parameters and inspect immediate ML risk score reactions.",
            [
                ("Hero Value Proposition", "Clearly defines AquaGuard AI as an educational decision-support triage platform."),
                ("Live Preview Card", "Interactive parameter controls displaying real-time ML risk band & score shifts."),
                ("Responsible Disclaimers", "Persistent statutory notices stating non-certifying, lab-prioritization scope.")
            ]
        ),
        (
            "2. Single Sample Telemetry Ingestion Form",
            "Route: /analyze",
            "Comprehensive physical/chemical parameter entry interface. Features strict physical boundary validation, benchmark sample preset quick-fill buttons, and real-time completeness percentage calculation.",
            [
                ("9 Parameters Form", "pH (0-14), Turbidity, Solids, Chloramines, Sulfate, Conductivity, TOC, THM, Hardness."),
                ("Sample Presets", "One-click benchmark loaders: Highland Spring, Filter Tank, and Industrial Outflow."),
                ("Completeness Ring", "Dynamic SVG ring assigning High, Moderate, or Low confidence tiers.")
            ]
        ),
        (
            "3. Screening Report: Calibrated Risk Gauge & Synthesis",
            "Route: /result/:id",
            "Main evaluation report screen. Visualizes empirical ML risk stratification via a calibrated radial gauge dial, classifier bias direction, and structured educational synthesis text.",
            [
                ("Radial Risk Gauge", "Visual 0.00 to 1.00 dial showing calibrated probability and normative thresholds."),
                ("ML Risk Bands", "Standard bands: Lower Concern, Inconclusive — lab testing recommended, Elevated Concern."),
                ("Decision Synthesis", "Automated reasoning explaining feature weights and recommending laboratory split testing.")
            ]
        ),
        (
            "4. Explainable AI: SHAP Parameter Feature Contributions",
            "Route: /result/:id#shap",
            "Eliminates black-box opacity. Displays color-coded parameter contributions quantifying how each chemical pushed the score toward Lower Concern (green) or Elevated Concern (red).",
            [
                ("Baseline Value E[f(x)]", "Displays starting empirical prior expectation (0.45) across historical water survey records."),
                ("Directional Push Bars", "Red bars for deviations (Turbidity +0.14) and green bars for compliant stabilizing parameters."),
                ("Accessible Table", "Toggle switch providing full keyboard accessibility and exact numeric contributions.")
            ]
        ),
        (
            "5. Regulatory Standards Adherence Check",
            "Route: /result/:id#standards",
            "Independent dual-layer audit comparing all 9 physicochemical parameters against official Bureau of Indian Standards (BIS IS 10500) and World Health Organization (WHO) Guidelines.",
            [
                ("Standard Status Badges", "Explicit badges: Within range, Above range, Below range, No formal reference, Not provided."),
                ("Statutory Benchmarks", "Direct citation of legal permissible limits (e.g. pH 6.5–8.5, Turbidity < 5 NTU, TDS < 500 mg/L)."),
                ("Audit Vocabulary Separation", "Strict separation ensuring ML probability bands never mix with legal standards badges.")
            ]
        ),
        (
            "6. Batch Telemetry CSV Ingestion (Drag-and-Drop)",
            "Route: /batch",
            "High-throughput field logging interface. Features a dashed drag-and-drop dropzone, CSV template download, and strict client-side validation for file format, size (5 MB), and row count (500 rows).",
            [
                ("Interactive Dropzone", "Smooth drag-and-drop file ingestion zone with limits indicator: 'CSV · up to 500 rows · 5 MB'."),
                ("Client-Side Validation", "Instant verification for empty files, oversized payloads, and missing essential parameter columns."),
                ("Template Export", "One-click downloadable CSV template with pre-formatted column headers for rapid field entry.")
            ]
        ),
        (
            "7. Batch Validation Queue & Triage Execution",
            "Route: /batch (Queue)",
            "Displays pre-scoring validation queues flagging invalid rows, followed by instant multi-sample scoring and triage report export.",
            [
                ("Validation Triage", "Clear counter cards for Valid Samples Ready vs. Flagged Invalid Rows requiring field re-check."),
                ("Simultaneous Scoring", "Scores hundreds of samples across the GBDT pipeline in under 2 seconds with individual risk bands."),
                ("Batch CSV Export", "Exports complete multi-sample screening reports with calibrated scores and completeness metrics.")
            ]
        ),
        (
            "8. Watershed Screening Analytics Dashboard",
            "Route: /dashboard",
            "Macro-level watershed intelligence showing aggregate sample metrics, risk band distributions, empirical score histograms, and regional parameter averages.",
            [
                ("Score Histogram", "Visual 5-bucket distribution charting regional water risk trends from 0.00 to 1.00."),
                ("Chemical Averages", "Average concentration levels across all 9 parameters monitored within the watershed catchment."),
                ("Recent Ingestion Feed", "Audit trail of recent field station inputs with direct links to individual screening reports.")
            ]
        ),
        (
            "9. Audit Records & Side-by-Side Comparison",
            "Route: /history & /compare",
            "Full historical tracking with searchable, filterable logs and side-by-side comparative inspection between two water sources.",
            [
                ("Searchable Audit Trail", "Filter by risk band, sort by date or classifier score, and manage session records in SQLite."),
                ("Side-by-Side Comparison", "Direct delta inspection comparing parameter differentials between inlet and discharge points."),
                ("Data Export Options", "Standardized CSV and print report formatting for field audit presentations.")
            ]
        ),
        (
            "10. Open Model Card & Methodology",
            "Route: /about",
            "Complete transparency and model governance. Documents the trained HistGradientBoosting model, ROC-AUC curve (0.924), Platt calibration curve, confusion matrix, and benchmark comparisons.",
            [
                ("ROC & PR Curves", "Interactive Recharts curves showing 0.924 ROC-AUC and 84.0% balanced classification accuracy."),
                ("Calibration Curve", "Platt sigmoid scaling curve confirming observed event fraction aligns with predicted probabilities."),
                ("Governance Framework", "Strict governance boundaries outlining prohibited applications (e.g. bypassing statutory lab tests).")
            ]
        ),
    ]

    for idx, (title, route, desc, boxes) in enumerate(screens):
        t_row = [
            [
                Paragraph(f"<b>{title}</b>", h2_style),
                Paragraph(f"<b>{route}</b>", route_badge),
            ]
        ]
        t_title = Table(t_row, colWidths=[400, 140])
        t_title.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ]))
        story.append(t_title)
        story.append(Paragraph(desc, desc_style))
        story.append(Spacer(1, 4))

        # 3 Feature Boxes in a row
        box_cells = []
        for b_title, b_text in boxes:
            cell_content = [
                Paragraph(f"<b>{b_title}</b>", box_title),
                Spacer(1, 2),
                Paragraph(b_text, box_text),
            ]
            box_cells.append(cell_content)

        t_boxes = Table([box_cells], colWidths=[180, 180, 180])
        t_boxes.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FBFC")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#D5E3E7")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t_boxes)
        story.append(Spacer(1, 14))

        if idx in [1, 3, 5, 7]: # Add a clean page break every 2 screens
            story.append(PageBreak())

    doc.build(story)
    print(f"Project Screenshots PDF generated at: {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target = os.path.join(base_dir, "submission_deliverables", "Project_Screenshots.pdf")
    os.makedirs(os.path.dirname(target), exist_ok=True)
    generate_screenshots_pdf(target)

