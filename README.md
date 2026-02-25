# Grid as System
An API-driven interactive archive project exploring the concept of the grid, created for Project 4: Links in my Parsons Typography &amp; Interaction course.

## Overview
This project is an interactive web experience that explores the concept of the grid through a dynamic archive of mixed media. Each colored tile represents a block pulled from an Are.na channel using the Are.na API. When selected, a modal reveals the content, which may contain either an image, text, link, video, embed, or PDF.

Instead of presenting content in a linear feed, the site treats the grid as both metaphor and interface. The system emphasizes structure, randomness, density, and spatial organization. Browsing becomes an exploration of order and variation rather than a simple scroll.

## Context
This project was built as a media-based web assignment using Are.na as a content management system. The goals were to:
* Curate themed content within Are.na
* Retrieve live data using the Are.na API
* Design and build a custom interface that reframes that content

The theme, grid, functions as both subject and structure. The grid appears in design systems, architecture, racing, typography, and digital interfaces. The interface mirrors that duality by being structured yet procedurally generated.

## System Architecture

### Spatial Grid System
The grid layout responds to viewport dimensions.
* On mobile, the canvas expands to allow scroll-based exploration
* On desktop, the grid fills the viewport
* Randomized density logic determines which tiles contain content
* Each tile maps to a block through data attributes
The layout balances structural consistency with controlled randomness.

### Modal System
Each block type renders a tailored modal experience:
* Images use responsive picture sources
* Text blocks include a sticky header and scrollable content area
* PDFs render with viewport-based sizing
* Links optionally display preview imagery
* Embeds are parsed and conditionally rendered
The modal system is type-aware, responsive, and internally scrollable while maintaining consistent structure.

## Key Interactions
### Tile Exploration
* Hover interactions introduce subtle scale and glow
* Randomized placement creates visual rhythm
* Filtering logic controls tile color and grouping

### Modal Reveal
* Selecting a tile opens a content-specific modal
* Text modals support internal scrolling with a sticky header
* Media such as video and PDF scale responsively
* A source link provides direct access to the original Are.na block

### Scroll Behavior
* On desktop, the grid is fixed to the viewport
* On mobile, the grid becomes scrollable
* Text modals isolate scrolling to prevent layout shift

## Design Systems
### Visual Language
* Color-coded tile system by content type
* Responsive typographic hierarchy
* Grid-based spatial alignment
* Constrained modal width for readability

### Structural Logic
* CSS Grid for macro layout
* Flexbox for modal stacking
* Logical properties such as inline-size and block-size for adaptability
* Type-based layout targeting using modern CSS selectors

## Challenges
### API Variability
* Are.na blocks do not always contain consistent metadata, and some link blocks lack preview images. I had to carefully evaluate which metadata was essential to maintain consistency without oversimplifying the modals, ensuring each one still communicated the grid theme clearly. Defensive programming using optional chaining and fallbacks was necessary to prevent rendering errors and maintain stability across block types.
### Scroll Management
* Managing internal scrolling within text modals required careful control of overflow, flex behavior, and sticky positioning. Cross-browser differences, especially on mobile Safari, required structural adjustments to prevent scroll chaining and layout instability.
### Responsive Consistency
* Ensuring consistent modal behavior across desktop and mobile environments required careful coordination between layout logic and viewport constraints. Because each media type behaves differently, I tailored the layout for images/videos, text, attachments, embeds, etc. so that each modal felt intentional and appropriate to its content while maintaining overall system consistency.

## Reflection
This project explores how structure can shape meaning. The grid functions not only as layout but as conceptual framework. It organizes, fragments, and recontextualizes content. The central tension lies between randomness and order, system and variation, rigidity and flexibility. The result is an interface that feels systematic yet dynamic.
