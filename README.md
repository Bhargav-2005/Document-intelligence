# Challenge 1B: Persona-Driven Document Intelligence

## Overview
This solution implements an intelligent document analysis system that extracts and prioritizes relevant content from PDF collections based on specific personas and their job requirements.

## Features
- **Persona-Driven Analysis**: Adapts processing based on user role and objectives
- **Multi-Document Processing**: Handles 3-10 related PDFs simultaneously  
- **Intelligent Section Ranking**: Prioritizes content by relevance to persona and task
- **Detailed Subsection Analysis**: Provides refined text extraction with context
- **Generic Framework**: Works across diverse domains and use cases

## Supported Personas
- **Travel Planners**: Trip planning and destination analysis
- **HR Professionals**: Form creation and compliance management
- **Food Contractors**: Menu planning and recipe analysis
- **General Use Cases**: Adaptable to various other scenarios

## Project Structure
```
Document-intelligence/
├── main.js              # Main processing engine
├── extractOutline.js         # PDF structure extraction utility
├── package.json              # Dependencies and metadata
├── Dockerfile                # Container configuration
├── README.md                # This file
├── input/                   # Input directory (mount point)
│   └── challenge1b_input.json
└── output/                  # Output directory (mount point)
    └── challenge1b_output.json
```

## Input Format
The system expects a `challenge1b_input.json` file in the input directory:

```json
{
  "challenge_info": {
    "challenge_id": "input_XXX",
    "test_case_name": "specific_case",
    "description": "Brief description"
  },
  "documents": [
    {
      "filename": "document.pdf",
      "title": "Document Title"
    }
  ],
  "persona": {
    "role": "User Role"
  },
  "job_to_be_done": {
    "task": "Specific task description"
  }
}
```

## Output Format
The system generates a `challenge1b_output.json` file:

```json
{
  "metadata": {
    "input_documents": ["list of input files"],
    "persona": "User persona",
    "job_to_be_done": "Task description",
    "processing_timestamp": "ISO timestamp"
  },
  "extracted_sections": [
    {
      "document": "source.pdf",
      "section_title": "Section Title",
      "importance_rank": 1,
      "page_number": 1
    }
  ],
  "subsection_analysis": [
    {
      "document": "source.pdf",
      "refined_text": "Relevant content extract",
      "page_number": 1
    }
  ]
}
```

## Building and Running

### Docker Build
```bash
docker build --platform linux/amd64 -t document-intelligence:latest .
```

### Docker Run
```bash
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  --network none \
  document-intelligence:latest
```

### Local Development
```bash
npm install
node main.js
```

## Dependencies
- **Node.js**: >=16.0.0
- **pdfjs-dist**: PDF processing library
- **Platform**: linux/amd64 compatible

## Technical Specifications
- **Execution Time**: ≤60 seconds for document collections
- **Memory Usage**: ≤1GB including dependencies
- **Network**: No internet access required (offline mode)
- **CPU**: Optimized for amd64 architecture

## Algorithm Highlights
1. **Persona Detection**: Automatically classifies use cases based on role and task
2. **Relevance Scoring**: Multi-factor algorithm considering job relevance, keywords, and content quality
3. **Section Ranking**: Importance-based prioritization of extracted content
4. **Content Refinement**: Context-aware text extraction and summarization

## Testing
The solution has been tested with sample collections including:
- Travel planning scenarios (South of France guides)
- HR form management (Adobe Acrobat tutorials)  
- Menu planning (Recipe collections)

## Performance Optimizations
- Efficient PDF text extraction
- Smart keyword matching
- Minimal memory footprint
- Parallel processing capabilities

## Error Handling
- Graceful fallback for processing errors
- Robust input validation
- Comprehensive logging for debugging
- Consistent output format guarantee

---
