window.onerror = function(msg, url, line) { alert("Error: " + msg + " (Línea: " + line + ")"); };

import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';

function TestApp() {
  return React.createElement(
    'div',
    { style: { padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' } },
    React.createElement('h1', null, '¡Probando chivato en FitApp!'),
    React.createElement('p', null, 'Si ves esto, el script ha arrancado. Si hay un error oculto, saltará la alerta.')
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(TestApp));
