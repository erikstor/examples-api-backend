#!/usr/bin/env node

/**
 * Script de build para el CLI Builder Architecture Generator
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build del CLI Builder Architecture Generator...\n');

try {
  // Limpiar directorio dist
  if (fs.existsSync('dist')) {
    console.log('🧹 Limpiando directorio dist...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Compilar TypeScript
  console.log('📦 Compilando TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Verificar que el build fue exitoso
  if (fs.existsSync('dist/index.js')) {
    console.log('✅ Build completado exitosamente');
    console.log('📁 Archivos generados en: dist/');
    
    // Listar archivos generados
    const files = fs.readdirSync('dist', { recursive: true });
    console.log('\n📋 Archivos generados:');
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    throw new Error('Build falló - archivo principal no encontrado');
  }

} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}

console.log('\n🚀 Build completado. Para probar el CLI:');
console.log('   npm run dev');
console.log('   o');
console.log('   node dist/index.js create');
