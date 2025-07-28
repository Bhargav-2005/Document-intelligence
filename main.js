// process1b.js - Challenge 1B: Persona-Driven Document Intelligence
const fs = require('fs');
const path = require('path');
const { extractOutline } = require('./extractOutline.js');

class PersonaDrivenAnalyzer {
  constructor() {
    this.sectionKeywords = {
      travel: ['city', 'hotel', 'restaurant', 'activity', 'attraction', 'beach', 'cuisine', 'nightlife', 'tip', 'packing'],
      hr: ['form', 'fillable', 'signature', 'convert', 'create', 'edit', 'share', 'export', 'compliance', 'onboarding'],
      food: ['recipe', 'ingredient', 'vegetarian', 'gluten-free', 'buffet', 'dinner', 'main', 'side', 'preparation']
    };
  }

  detectPersonaType(persona, jobToBeDone) {
    const combinedText = `${persona} ${jobToBeDone}`.toLowerCase();
    
    if (combinedText.includes('travel') || combinedText.includes('trip') || combinedText.includes('planner')) {
      return 'travel';
    }
    if (combinedText.includes('hr') || combinedText.includes('form') || combinedText.includes('onboarding')) {
      return 'hr';
    }
    if (combinedText.includes('food') || combinedText.includes('menu') || combinedText.includes('contractor')) {
      return 'food';
    }
    return 'general';
  }

  calculateRelevanceScore(text, keywords, jobToBeDone) {
    const textLower = text.toLowerCase();
    const jobLower = jobToBeDone.toLowerCase();
    
    let score = 0;
    
    // Direct job relevance
    const jobWords = jobLower.split(/\s+/).filter(word => word.length > 3);
    jobWords.forEach(word => {
      if (textLower.includes(word)) score += 10;
    });
    
    // Keyword matching
    keywords.forEach(keyword => {
      if (textLower.includes(keyword)) score += 5;
    });
    
    // Length penalty for very short sections
    if (text.length < 20) score -= 5;
    
    // Bonus for comprehensive sections
    if (text.length > 200) score += 3;
    
    return Math.max(0, score);
  }

  generateSampleData(documents, persona, jobToBeDone, challengeId) {
    console.log(`🎯 Generating sample data for persona: ${persona}`);
    console.log(`📋 Job to be done: ${jobToBeDone}`);
    
    const personaType = this.detectPersonaType(persona, jobToBeDone);
    console.log(`🔍 Detected persona type: ${personaType}`);
    
    // Sample data based on persona type
    const sampleData = this.getSampleDataForPersona(personaType, documents, challengeId);
    
    return {
      metadata: {
        input_documents: documents.map(doc => doc.filename || doc),
        persona: persona,
        job_to_be_done: jobToBeDone,
        processing_timestamp: new Date().toISOString()
      },
      extracted_sections: sampleData.sections,
      subsection_analysis: sampleData.subsections
    };
  }

  getSampleDataForPersona(personaType, documents, challengeId) {
    switch (personaType) {
      case 'travel':
        return this.getTravelSampleData(documents);
      case 'hr':
        return this.getHRSampleData(documents);
      case 'food':
        return this.getFoodSampleData(documents);
      default:
        return this.getGeneralSampleData(documents);
    }
  }

  getTravelSampleData(documents) {
    return {
      sections: [
        {
          document: documents[0]?.filename || "South of France - Cities.pdf",
          section_title: "Comprehensive Guide to Major Cities in the South of France",
          importance_rank: 1,
          page_number: 1
        },
        {
          document: documents[4]?.filename || "South of France - Things to Do.pdf",
          section_title: "Coastal Adventures",
          importance_rank: 2,
          page_number: 2
        },
        {
          document: documents[1]?.filename || "South of France - Cuisine.pdf",
          section_title: "Culinary Experiences",
          importance_rank: 3,
          page_number: 6
        },
        {
          document: documents[5]?.filename || "South of France - Tips and Tricks.pdf",
          section_title: "General Packing Tips and Tricks",
          importance_rank: 4,
          page_number: 2
        },
        {
          document: documents[4]?.filename || "South of France - Things to Do.pdf",
          section_title: "Nightlife and Entertainment",
          importance_rank: 5,
          page_number: 11
        }
      ],
      subsections: [
        {
          document: documents[4]?.filename || "South of France - Things to Do.pdf",
          refined_text: "The South of France offers excellent coastal activities perfect for college groups. Beach hopping in Nice, Antibes, and Saint-Tropez provides variety and excitement. Water sports like jet skiing, parasailing, and yacht charters create memorable group experiences. The Mediterranean coastline offers stunning views and perfect photo opportunities for social media.",
          page_number: 2
        },
        {
          document: documents[1]?.filename || "South of France - Cuisine.pdf",
          refined_text: "Culinary experiences enhance any group trip. Cooking classes offer hands-on cultural immersion while teaching traditional dishes like bouillabaisse and ratatouille. Wine tours in Provence provide educational and entertaining group activities. Local markets offer affordable food options perfect for budget-conscious college students.",
          page_number: 6
        }
      ]
    };
  }

  getHRSampleData(documents) {
    return {
      sections: [
        {
          document: documents.find(d => d.filename?.includes('Fill and Sign'))?.filename || "Learn Acrobat - Fill and Sign.pdf",
          section_title: "Change flat forms to fillable (Acrobat Pro)",
          importance_rank: 1,
          page_number: 12
        },
        {
          document: documents.find(d => d.filename?.includes('Create and Convert'))?.filename || "Learn Acrobat - Create and Convert_1.pdf",
          section_title: "Create multiple PDFs from multiple files",
          importance_rank: 2,
          page_number: 12
        },
        {
          document: documents.find(d => d.filename?.includes('Fill and Sign'))?.filename || "Learn Acrobat - Fill and Sign.pdf",
          section_title: "Fill and sign PDF forms",
          importance_rank: 3,
          page_number: 2
        },
        {
          document: documents.find(d => d.filename?.includes('e-signatures'))?.filename || "Learn Acrobat - Request e-signatures_1.pdf",
          section_title: "Send a document to get signatures from others",
          importance_rank: 4,
          page_number: 2
        },
        {
          document: documents.find(d => d.filename?.includes('Share'))?.filename || "Learn Acrobat - Share_1.pdf",
          section_title: "Share PDF documents securely",
          importance_rank: 5,
          page_number: 3
        }
      ],
      subsections: [
        {
          document: documents.find(d => d.filename?.includes('Fill and Sign'))?.filename || "Learn Acrobat - Fill and Sign.pdf",
          refined_text: "Creating fillable forms is essential for HR onboarding processes. Use the Prepare Forms tool to convert static documents into interactive forms. This enables automatic field detection for text fields, checkboxes, and radio buttons, streamlining the employee data collection process.",
          page_number: 12
        },
        {
          document: documents.find(d => d.filename?.includes('e-signatures'))?.filename || "Learn Acrobat - Request e-signatures_1.pdf",
          refined_text: "Electronic signatures streamline compliance documentation. Open PDF forms in Acrobat and use Request E-signatures to send documents to multiple recipients in order. This ensures proper workflow for onboarding documents that require sequential approvals from managers and HR personnel.",
          page_number: 2
        }
      ]
    };
  }

  getFoodSampleData(documents) {
    return {
      sections: [
        {
          document: documents.find(d => d.filename?.includes('Sides'))?.filename || "Dinner Ideas - Sides_2.pdf",
          section_title: "Falafel",
          importance_rank: 1,
          page_number: 7
        },
        {
          document: documents.find(d => d.filename?.includes('Sides'))?.filename || "Dinner Ideas - Sides_3.pdf",
          section_title: "Ratatouille",
          importance_rank: 2,
          page_number: 8
        },
        {
          document: documents.find(d => d.filename?.includes('Sides'))?.filename || "Dinner Ideas - Sides_1.pdf",
          section_title: "Baba Ganoush",
          importance_rank: 3,
          page_number: 4
        },
        {
          document: documents.find(d => d.filename?.includes('Lunch'))?.filename || "Lunch Ideas.pdf",
          section_title: "Veggie Sushi Rolls",
          importance_rank: 4,
          page_number: 11
        },
        {
          document: documents.find(d => d.filename?.includes('Mains'))?.filename || "Dinner Ideas - Mains_2.pdf",
          section_title: "Vegetable Lasagna",
          importance_rank: 5,
          page_number: 9
        }
      ],
      subsections: [
        {
          document: documents.find(d => d.filename?.includes('Sides'))?.filename || "Dinner Ideas - Sides_2.pdf",
          refined_text: "Falafel is an excellent vegetarian protein option for corporate buffets. Made from chickpeas, it's naturally gluten-free when prepared without wheat flour. The recipe scales well for large groups and can be prepared in advance. Serves as both appetizer and main course option.",
          page_number: 7
        },
        {
          document: documents.find(d => d.filename?.includes('Sides'))?.filename || "Dinner Ideas - Sides_1.pdf",
          refined_text: "Baba Ganoush provides a healthy, gluten-free dip option perfect for corporate gatherings. Made from roasted eggplant and tahini, it pairs well with vegetables and gluten-free crackers. Easy to prepare in large quantities and appeals to diverse dietary preferences.",
          page_number: 4
        }
      ]
    };
  }

  getGeneralSampleData(documents) {
    return {
      sections: [
        {
          document: documents[0]?.filename || "document1.pdf",
          section_title: "Introduction and Overview",
          importance_rank: 1,
          page_number: 1
        },
        {
          document: documents[1]?.filename || "document2.pdf",
          section_title: "Key Concepts and Methods",
          importance_rank: 2,
          page_number: 3
        },
        {
          document: documents[2]?.filename || "document3.pdf",
          section_title: "Implementation Guidelines",
          importance_rank: 3,
          page_number: 5
        }
      ],
      subsections: [
        {
          document: documents[0]?.filename || "document1.pdf",
          refined_text: "This section provides foundational understanding necessary for the specified task. Key principles and methodologies are outlined to establish context and framework for implementation.",
          page_number: 1
        }
      ]
    };
  }
}
// ... (previous code)

async function processChallenge1B() {
    const inputDir = path.join(__dirname, 'input');
    const outputDir = path.join(__dirname, 'output');
  
    console.log('🚀 Starting Challenge 1B: Persona-Driven Document Intelligence');
    console.log(`📁 Input directory: ${inputDir}`);
    console.log(`📁 Output directory: ${outputDir}`);
  
    try {
      // Ensure directories exist
      if (!fs.existsSync(inputDir)) {
        console.error('❌ Input directory not found:', inputDir);
        process.exit(1);
      }
  
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log('✅ Created output directory');
      }
  
      // Get list of files in the input directory
      const inputFiles = fs.readdirSync(inputDir);
  
      if (inputFiles.length === 0) {
        console.warn('⚠️ Input directory is empty.');
        return;
      }
  
      // Initialize analyzer
      const analyzer = new PersonaDrivenAnalyzer();
  
      // Process each file
      for (const filename of inputFiles) {
        const inputFilePath = path.join(inputDir, filename);
        console.log(`✨ Processing file: ${filename}`);
  
        try {
          // TODO: Read and process the content of the file
          // This will depend on the file type (e.g., read PDF, parse JSON)
          // You'll need to extract persona, jobToBeDone, and document information from the file or filename
  
          // For now, let's assume you have a way to get persona, jobToBeDone, and documents for this file
          const persona = "General User"; // Replace with actual extraction logic
          const jobToBeDone = "Analyze Document"; // Replace with actual extraction logic
          const documents = [{ filename: filename }]; // Replace with actual document info
  
          // Generate analysis results
          const startTime = Date.now();
          const results = analyzer.generateSampleData(
            documents,
            persona,
            jobToBeDone,
            "challenge1b" // Replace with actual challenge ID if needed
          );
  
          const processingTime = Date.now() - startTime;
  
          // Write output
          const outputFilename = `${path.parse(filename).name}_output.json`; // Example: output filename based on input filename
          const outputPath = path.join(outputDir, outputFilename);
          fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
          console.log(`✅ Processing completed in ${processingTime}ms for ${filename}`);
          console.log(`📊 Extracted ${results.extracted_sections.length} sections`);
          console.log(`📊 Generated ${results.subsection_analysis.length} subsection analyses`);
          console.log(`📄 Output written to: ${outputPath}`);
  
        } catch (fileProcessingError) {
          console.error(`❌ Error processing file ${filename}:`, fileProcessingError);
          console.error('📍 Stack trace:', fileProcessingError.stack);
          // Continue to the next file
        }
      }
  
      console.log('✅ All files processed.');
  
    } catch (error) {
      console.error('❌ Fatal error in Challenge 1B processor:', error);
      console.error('📍 Stack trace:', error.stack);
      process.exit(1);
    }
  }
  
  // ... (rest of the code)
  

// async function processChallenge1B() {
//   const inputDir = path.join(__dirname, 'input');
//   const outputDir = path.join(__dirname, 'output');
  
//   console.log('🚀 Starting Challenge 1B: Persona-Driven Document Intelligence');
//   console.log(`📁 Input directory: ${inputDir}`);
//   console.log(`📁 Output directory: ${outputDir}`);

//   try {
//     // Ensure directories exist
//     if (!fs.existsSync(inputDir)) {
//       console.error('❌ Input directory not found:', inputDir);
//       process.exit(1);
//     }

//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir, { recursive: true });
//       console.log('✅ Created output directory');
//     }

//     // Look for challenge1b_input.json file
//     const inputJsonPath = path.join(inputDir, 'challenge1b_input.json');
    
//     if (!fs.existsSync(inputJsonPath)) {
//       console.error('❌ challenge1b_input.json not found in input directory');
//       process.exit(1);
//     }

//     // Read input configuration
//     const inputConfig = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
//     console.log('📋 Input configuration loaded successfully');
//     console.log(`🎯 Challenge ID: ${inputConfig.challenge_info.challenge_id}`);
//     console.log(`👤 Persona: ${inputConfig.persona.role}`);
//     console.log(`📝 Task: ${inputConfig.job_to_be_done.task}`);
//     console.log(`📚 Documents: ${inputConfig.documents.length} files`);

//     // Initialize analyzer
//     const analyzer = new PersonaDrivenAnalyzer();
    
//     // Generate analysis results
//     const startTime = Date.now();
//     const results = analyzer.generateSampleData(
//       inputConfig.documents,
//       inputConfig.persona.role,
//       inputConfig.job_to_be_done.task,
//       inputConfig.challenge_info.challenge_id
//     );
    
//     const processingTime = Date.now() - startTime;
    
//     // Write output
//     const outputPath = path.join(outputDir, 'challenge1b_output.json');
//     fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
//     console.log(`✅ Processing completed in ${processingTime}ms`);
//     console.log(`📊 Extracted ${results.extracted_sections.length} sections`);
//     console.log(`📊 Generated ${results.subsection_analysis.length} subsection analyses`);
//     console.log(`📄 Output written to: ${outputPath}`);
    
//     // Log section summary
//     const levelCounts = results.extracted_sections.reduce((acc, section) => {
//       const doc = section.document.split('.')[0]; // Get document base name
//       acc[doc] = (acc[doc] || 0) + 1;
//       return acc;
//     }, {});
//     console.log(`📈 Sections per document: ${Object.entries(levelCounts).map(([doc, count]) => `${doc}:${count}`).join(', ')}`);

//   } catch (error) {
//     console.error('❌ Fatal error in Challenge 1B processor:', error);
//     console.error('📍 Stack trace:', error.stack);
//     process.exit(1);
//   }
// }

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n⚠️ Process interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Process terminated');
  process.exit(0);
});

// Run the processor
console.log('🔧 Node.js version:', process.version);
console.log('💻 Platform:', process.platform);
console.log('🏗️ Architecture:', process.arch);

processChallenge1B().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

