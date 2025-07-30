'use client';

import React from 'react';

interface TextoFormateadoProps {
  texto: string;
}

export const TextoFormateado: React.FC<TextoFormateadoProps> = ({ texto }) => {
  // Divide el texto por patrones tipo "1 ", "2 ", etc. usando lookahead para mantener el número
  const partes = texto.split(/(?=\d+[\.\s])/).filter(p => p.trim() !== '');

  return (
    <div className="space-y-1">
      {partes.map((parte, index) => {
        const match = parte.match(/^(\d+)[\.\s]+(.+)$/);
        if (match) {
          const numero = match[1];
          const contenido = match[2];
          return (
            <p key={index} className="leading-relaxed">
              <span className="font-bold">{numero}.</span> {contenido.trim()}
            </p>
          );
        }

        return <p key={index}>{parte.trim()}</p>;
      })}
    </div>
  );
};
