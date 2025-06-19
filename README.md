# Homesleep

[![Version](https://img.shields.io/npm/v/homesleep)](https://www.npmjs.com/package/homesleep)  
[![Build Status](https://img.shields.io/github/actions/workflow/status/inmediamarketingweb/homesleep/deploy.yml?branch=main)](https://github.com/inmediamarketingweb/homesleep/actions)  
[![License](https://img.shields.io/github/license/inmediamarketingweb/homesleep)](LICENSE)

## Descripción

- Sitio web oficial de la empresa fabricante de muebles "homesleep" que les permite a los usuarios navegar y ver los diferentes productos de la empresa.
- Este proyecto sigue en etapa de desarrollo por lo que puede presentar algunas incogruencias en su funcionalidad, diseño o productos.
- Visita el sitio web oficial: [homesleep.pe](https://homesleep.pe)

## Características

- Navegación por categorías y subcategorías  
- Selección de distrito y tipo de envío con cálculo automático de costos
- Integración con JSON externo para tarifas de envío
- Interfaz responsive y accesible  
- Despliegue automático con GitHub Actions

## Instalación

1. Clona el repositorio  
   ```bash
   git clone https://github.com/inmediamarketingweb/homesleep.pe

2. Instalar dependencias
   ```bash
    npm install

3. Ejecutar modo de desarrollo
   ```bash
    npm start

## Arquitectura

homesleep/
├── public/                   # Assets estáticos
├── src/
│   ├── Componentes/          # Componentes React reutilizables
│   ├── Paginas/              # Páginas principales
│   └── App.js                # Rutas del proyecto
├── deploy.sh                 # Script de despliegue en producción
├── package.json
└── README.md

## Tecnologías

1. React
2. HTML
3. CSS

## Ayuda y soporte

1. inmediamarketingweb@gmail.com
2. leonardosoplapuco@gmail.com
