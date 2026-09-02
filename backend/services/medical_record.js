import { InvalidArgumentException } from "../exceptions/invalid_argument_exception.js";
import { getDependency } from "../libs/dependencies.js";

export class MedicalRecordService {
  static async get(filter = {}) {
    const MedicalRecordModel = getDependency('MedicalRecordModel');
    return await MedicalRecordModel.find(filter).sort({ date: -1 });
  }

  static async getByPetUuid(petUuid) {
    if (!petUuid) {
      throw new InvalidArgumentException('Falta la mascota.');
    }
    const MedicalRecordModel = getDependency('MedicalRecordModel');
    return await MedicalRecordModel.find({ petUuid }).sort({ date: -1 });
  }

  static async create(data) {
    if (!data.petUuid) {
      throw new InvalidArgumentException('Falta especificar la mascota.');
    }
    if (!data.vetUuid) {
      throw new InvalidArgumentException('Falta especificar el veterinario a cargo.');
    }
    if (!data.diagnosis) {
      throw new InvalidArgumentException('Falta el diagnóstico médico.');
    }

    data.uuid = crypto.randomUUID();
    data.date = data.date || new Date();

    const MedicalRecordModel = getDependency('MedicalRecordModel');
    const newRecord = new MedicalRecordModel(data);
    await newRecord.save();

    // Actualizar el peso de la mascota si se registró en la consulta
    if (data.weight) {
      try {
        const PetService = getDependency('PetService');
        await PetService.updateByUuid(data.petUuid, { weight: data.weight });
      } catch (err) {
        console.error('No se pudo actualizar el peso de la mascota:', err.message);
      }
    }

    // Marcar el turno asociado como completado si existe
    if (data.appointmentUuid) {
      try {
        const AppointmentService = getDependency('AppointmentService');
        await AppointmentService.updateByUuid(data.appointmentUuid, { status: 'completed' });
      } catch (err) {
        console.error('No se pudo actualizar el estado del turno:', err.message);
      }
    }

    return newRecord;
  }

  static async updateByUuid(uuid, data) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const MedicalRecordModel = getDependency('MedicalRecordModel');
    const updated = await MedicalRecordModel.findOneAndUpdate(
      { uuid },
      { $set: data },
      { new: true }
    );
    if (!updated) {
      throw new InvalidArgumentException('Historia clínica no encontrada.');
    }
    return updated;
  }

  static async deleteByUuid(uuid) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const MedicalRecordModel = getDependency('MedicalRecordModel');
    const deleted = await MedicalRecordModel.findOneAndDelete({ uuid });
    if (!deleted) {
      throw new InvalidArgumentException('Ficha médica no encontrada.');
    }
  }
}
