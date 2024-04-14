import React, { useRef } from 'react';
import { generatePDF } from 'react-to-pdf';


const pdfComponent = ({ jsonData, name }) => {
  const pdfRef = useRef(null);

  const handleDownloadPDF = () => {
    const options = {
      fileName: name,
      scale: 0.8 // ajustable
    }

    const content = (
      <div ref={pdfRef}>
        {/* Use template literals and object destructuring to format content from JSON */}
        <h1>Reporte de Tickets</h1>
        <p>Nombre: Nombre</p>
        <p>Contenido: Contenido</p>
        {/* ... Add more content based on your JSON structure */}
      </div>
    );

    generatePDF(content, options);
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      {jsonData.map((item) => (
        <p>test</p>
      ))}
    </div>
  );
}



export default pdfComponent;