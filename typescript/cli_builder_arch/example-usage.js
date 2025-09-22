#!/usr/bin/env node

/**
 * Script de ejemplo para probar el CLI Builder Architecture Generator
 * Este script demuestra cómo usar el CLI programáticamente
 */

const { spawn } = require('child_process');
const path = require('path');

async function testCLI() {
  console.log('🧪 Probando CLI Builder Architecture Generator...\n');

  // Simular entrada del usuario
  const input = [
    '1', // Seleccionar Layered Architecture
    'test-layered-project', // Nombre del proyecto
    '\n', // Enter para confirmar
    '\n', // Enter para confirmar
    '\n', // Enter para confirmar
  ].join('\n');

  return new Promise((resolve, reject) => {
    const child = spawn('node', ['dist/index.js', 'create'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ CLI ejecutado exitosamente');
        resolve(output);
      } else {
        console.log('\n❌ CLI falló con código:', code);
        reject(new Error(`CLI failed with code ${code}: ${errorOutput}`));
      }
    });

    // Enviar entrada simulada
    child.stdin.write(input);
    child.stdin.end();
  });
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  testCLI()
    .then(() => {
      console.log('\n🎉 Prueba completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en la prueba:', error.message);
      process.exit(1);
    });
}

module.exports = { testCLI };
