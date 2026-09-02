import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from './config.js';
import configureDependencies from './configure_dependencies.js';
import { getDependency } from './libs/dependencies.js';

async function seed() {
  try {
    console.log('🌱 Iniciando script de datos semilla en MongoDB...');
    await mongoose.connect(config.dbConnection);
    configureDependencies();

    const UserModel = getDependency('UserModel');
    const PetModel = getDependency('PetModel');
    const ServiceModel = getDependency('ServiceModel');
    const AppointmentModel = getDependency('AppointmentModel');
    const MedicalRecordModel = getDependency('MedicalRecordModel');

    // 1. Limpiar colecciones
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await ServiceModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await MedicalRecordModel.deleteMany({});

    console.log('🧹 Colecciones limpiadas.');

    // 2. Crear Usuarios
    const adminUser = await UserModel.create({
      uuid: crypto.randomUUID(),
      username: 'admin',
      hashedPassword: bcrypt.hashSync('admin123', 10),
      fullName: 'Administrador General',
      email: 'admin@vetcarepro.com',
      phone: '+54 9 11 4444-0000',
      address: 'Av. Corrientes 1234, CABA',
      dni: '30123456',
      roles: ['admin'],
    });

    const vetUser = await UserModel.create({
      uuid: crypto.randomUUID(),
      username: 'vet_lucas',
      hashedPassword: bcrypt.hashSync('vet123', 10),
      fullName: 'Dr. Lucas Martínez',
      email: 'lucas.martinez@vetcarepro.com',
      phone: '+54 9 11 4444-1111',
      address: 'Calle Falsa 123, CABA',
      dni: '32987654',
      roles: ['vet'],
    });

    const clientUser = await UserModel.create({
      uuid: crypto.randomUUID(),
      username: 'cliente_ana',
      hashedPassword: bcrypt.hashSync('client123', 10),
      fullName: 'Ana García',
      email: 'ana.garcia@gmail.com',
      phone: '+54 9 11 5555-1234',
      address: 'Av. Santa Fe 4321, CABA',
      dni: '38111222',
      roles: ['client'],
    });

    console.log('✅ Usuarios creados: admin, vet_lucas, cliente_ana');

    // 3. Crear Servicios en el Catálogo
    const s1 = await ServiceModel.create({
      uuid: crypto.randomUUID(),
      name: 'Consulta Médica General',
      description: 'Chequeo completo de salud, control térmico, auscultación y revisión clínica.',
      durationMinutes: 30,
      price: 15000,
      active: true,
    });

    const s2 = await ServiceModel.create({
      uuid: crypto.randomUUID(),
      name: 'Vacunación Séxtuple + Antirrábica',
      description: 'Inmunización completa anual para caninos y felinos.',
      durationMinutes: 20,
      price: 22000,
      active: true,
    });

    const s3 = await ServiceModel.create({
      uuid: crypto.randomUUID(),
      name: 'Ecografía Abdominal Completa',
      description: 'Estudio de imágenes de alta resolución para diagnóstico orgánico.',
      durationMinutes: 45,
      price: 35000,
      active: true,
    });

    const s4 = await ServiceModel.create({
      uuid: crypto.randomUUID(),
      name: 'Peluquería & Baño Sanitario',
      description: 'Corte de pelo según raza, baño con shampoo antiséptico y corte de uñas.',
      durationMinutes: 60,
      price: 18000,
      active: true,
    });

    console.log('✅ Catálogo de 4 servicios creado.');

    // 4. Crear Mascotas para Ana García
    const pet1 = await PetModel.create({
      uuid: crypto.randomUUID(),
      ownerUuid: clientUser.uuid,
      name: 'Rocco',
      species: 'perro',
      breed: 'Golden Retriever',
      birthDate: '2022-04-15',
      gender: 'macho',
      weight: 28.5,
      neutered: true,
      microchip: '985141001234567',
      notes: 'Carácter dócil, sensible a cambios de alimento.',
    });

    const pet2 = await PetModel.create({
      uuid: crypto.randomUUID(),
      ownerUuid: clientUser.uuid,
      name: 'Luna',
      species: 'gato',
      breed: 'Siamés',
      birthDate: '2023-01-10',
      gender: 'hembra',
      weight: 4.1,
      neutered: true,
      microchip: '985141009876543',
      notes: 'Vacunas al día. Asustadiza con ruidos fuertes.',
    });

    console.log('✅ Mascotas creadas: Rocco y Luna');

    // 5. Crear Turnos
    const app1 = await AppointmentModel.create({
      uuid: crypto.randomUUID(),
      clientUuid: clientUser.uuid,
      petUuid: pet1.uuid,
      vetUuid: vetUser.uuid,
      serviceUuid: s1.uuid,
      date: new Date(Date.now() + 86400000 * 2), // En 2 días
      status: 'confirmed',
      reason: 'Control anual de rutina y revisión de peso.',
    });

    const app2 = await AppointmentModel.create({
      uuid: crypto.randomUUID(),
      clientUuid: clientUser.uuid,
      petUuid: pet2.uuid,
      vetUuid: vetUser.uuid,
      serviceUuid: s2.uuid,
      date: new Date(Date.now() + 86400000 * 5), // En 5 días
      status: 'pending',
      reason: 'Refuerzo de vacuna antirrábica.',
    });

    console.log('✅ Turnos de prueba creados.');

    // 6. Crear Registro Médico / Historia Clínica
    await MedicalRecordModel.create({
      uuid: crypto.randomUUID(),
      petUuid: pet1.uuid,
      vetUuid: vetUser.uuid,
      appointmentUuid: app1.uuid,
      date: new Date(Date.now() - 86400000 * 15), // Hace 15 días
      reason: 'Chequeo de piel por prurito leve.',
      diagnosis: 'Dermatitis alérgica por picadura de pulga (DAPP).',
      treatment: 'Pipeta antipulgas de amplio espectro y baño con shampoo de lavanda.',
      prescription: '1. Bravecto 20-40kg (1 comprimido vía oral).\n2. Apoquel 16mg: 1/2 comprimido cada 12hs durante 5 días.',
      weight: 28.2,
      vaccinesApplied: ['Antirrábica'],
    });

    console.log('✅ Historia clínica de prueba creada.');

    console.log('\n🎉 ¡Proceso de Semilla finalizado con Éxito!');
    console.log('----------------------------------------------------');
    console.log('Credenciales de Acceso para Pruebas:');
    console.log('🔑 Admin:      usuario "admin"       / contraseña "admin123"');
    console.log('🔑 Vet/Médico: usuario "vet_lucas"   / contraseña "vet123"');
    console.log('🔑 Cliente:    usuario "cliente_ana" / contraseña "client123"');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error ejecutando seed:', err);
    process.exit(1);
  }
}

seed();
