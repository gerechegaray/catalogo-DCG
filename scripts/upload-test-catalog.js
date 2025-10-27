#!/usr/bin/env node

/**
 * Script para subir archivos JSON de prueba a Firebase Storage
 * 
 * Uso: node scripts/upload-test-catalog.js
 */

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyA-GAWS25Pui6oMT03uavW1anaAwDEPivc',
  authDomain: 'catalogo-veterinaria-alegra.firebaseapp.com',
  projectId: 'catalogo-veterinaria-alegra',
  storageBucket: 'catalogo-veterinaria-alegra.firebasestorage.app',
  messagingSenderId: '43555517807',
  appId: '1:43555517807:web:0b09b4756ac6abf423249a',
  measurementId: 'G-CV0W041CKJ'
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Datos de prueba
const testCatalog = [
  {
    id: "1",
    name: "Vacuna Antirrábica",
    description: "Profilaxis canina y felina",
    price: 45000,
    stock: 150,
    category: "Vacunas",
    subcategory: "Antirrábica",
    supplier: "Laboratorio Vet",
    userType: "vet",
    image: "",
    code: "VAC-001",
    unit: "dosis",
    status: "active"
  },
  {
    id: "2",
    name: "Antipulgas Premium",
    description: "Control de parásitos externos",
    price: 35000,
    stock: 200,
    category: "Medicamentos",
    subcategory: "Antiparasitarios",
    supplier: "Pet Care Labs",
    userType: "pet",
    image: "",
    code: "APF-002",
    unit: "unidad",
    status: "active"
  },
  {
    id: "3",
    name: "Alimento Balanceado Premium",
    description: "Para perros adultos",
    price: 85000,
    stock: 80,
    category: "Alimentos",
    subcategory: "Balanceado",
    supplier: "Pet Nutrition",
    userType: "pet",
    image: "",
    code: "ALI-003",
    unit: "bolsa",
    status: "active"
  },
  {
    id: "4",
    name: "Desinfectante Clínico",
    description: "Para superficies e instrumental",
    price: 25000,
    stock: 120,
    category: "Equipos",
    subcategory: "Desinfección",
    supplier: "Vet Supplies",
    userType: "vet",
    image: "",
    code: "DES-004",
    unit: "litro",
    status: "active"
  },
  {
    id: "5",
    name: "Juguete Pelota Resistente",
    description: "Para perros activos",
    price: 15000,
    stock: 200,
    category: "Juguetes",
    subcategory: "Pelotas",
    supplier: "Pet Toys Inc",
    userType: "pet",
    image: "",
    code: "JUG-005",
    unit: "unidad",
    status: "active"
  }
];

async function uploadTestCatalog() {
  try {
    console.log('🚀 Iniciando subida de catálogos de prueba...\n');
    
    // Convertir a JSON
    const jsonContent = JSON.stringify(testCatalog, null, 2);
    const buffer = Buffer.from(jsonContent);
    
    // Subir veterinarios.json
    const vetRef = ref(storage, 'catalog/veterinarios.json');
    await uploadBytes(vetRef, buffer, {
      contentType: 'application/json',
    });
    console.log('✅ veterinarios.json subido exitosamente');
    
    // Subir petshops.json
    const petRef = ref(storage, 'catalog/petshops.json');
    await uploadBytes(petRef, buffer, {
      contentType: 'application/json',
    });
    console.log('✅ petshops.json subido exitosamente');
    
    console.log('\n🎉 ¡Catálogos de prueba subidos correctamente!');
    console.log('📦 5 productos listos para testing');
    console.log('\n💡 Ahora ejecuta: npm run dev');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Tip: Verifica que Firebase Storage esté configurado en tu proyecto');
    process.exit(1);
  }
}

uploadTestCatalog();

