// src/controllers/pdfController.js
import DocumentEmbedding from '../models/documentEmbedding.js';
import { getEmbedding, chatModel } from '../utils/ai.js';
import { cosineSimilarity, chunkText } from '../utils/textProcessing.js';
import AWS from 'aws-sdk'

export const generatePDF = async (req, res) => {
  try {
    const { questions, sessionId } = req.body;
    console.log(questions);
    
    const userId = req.userId;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!Array.isArray(questions)) return res.status(400).json({ message: 'Questions must be an array' });

    const responses = [];

    for (const question of questions) {
      if (responses.length > 0) await new Promise(resolve => setTimeout(resolve, 2000));

      const questionEmbedding = await getEmbedding(question);
      const documents = await DocumentEmbedding.find({ sessionId });

      const similarContent = documents
      .map(doc => ({
        ...doc.toObject(),
        similarity: cosineSimilarity(doc.embedding, questionEmbedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

      const context = similarContent.map(doc => doc.text).join('\n');
      const prompt = `
  Based on the following context, please answer the question in a structured manner.

  Context:
  ${context}

  Question: ${question}

  Please provide a detailed, well-structured response with relevant information from the context.
  Don't just answer the question directly, explain the concepts and provide examples where necessary.
  Include section headings where appropriate and organize the information logically.`;
      const result = await chatModel.generateContent(prompt);
      const ele = result.response.text();
      responses.push(`**Q${responses.length + 1}.** ${question}?\n\n**Answer:**\n\n${ele}`);
    }

    // Convert responses to markdown and generate PDF
    const markdownContent = responses.join('\n\n---\n\n');
    const pdfResponse = await fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `markdown=${encodeURIComponent(markdownContent)}&css=${encodeURIComponent(`
      body { font-family: Arial, sans-serif; }
      h1, h2 { color: #333; }
      ul, ol { margin-left: 15px; }
      li { margin-bottom: 5px; }
      `)}`,
    });

    if (!pdfResponse.ok) {
      throw new Error('PDF generation failed');
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const s3 = new AWS.S3();
    const pdfKey = `${userId}/${Date.now()}_response.pdf`;

    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pdfKey,
      Body: Buffer.from(pdfBuffer),
      ContentType: 'application/pdf'
    }).promise();

    const pdfUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pdfKey,
      Expires: 3600 // URL expires in 1 hour
    });

    res.json({ 
      message: 'PDF generated successfully',
      url: pdfUrl
    });
  } catch (err) {
    console.error('Error generating responses:', err);
    res.status(500).json({ message: 'Error generating responses' });
  }
};
