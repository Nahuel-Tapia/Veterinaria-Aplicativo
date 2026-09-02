import { InvalidArgumentException } from "../exceptions/invalid_argument_exception.js";
import { getDependency } from "../libs/dependencies.js";

export class AppointmentService {
  static async get(filter = {}) {
    const AppointmentModel = getDependency('AppointmentModel');
    return await AppointmentModel.find(filter).sort({ date: 1 });
  }

  static async getSingleOrNullByUuid(uuid) {
    const AppointmentModel = getDependency('AppointmentModel');
    return (await AppointmentModel.find({ uuid }))[0];
  }

  static async create(data) {
    if (!data.clientUuid) {
      throw new InvalidArgumentException('Falta especificar el cliente.');
    }
    if (!data.petUuid) {
      throw new InvalidArgumentException('Falta especificar la mascota.');
    }
    if (!data.serviceUuid) {
      throw new InvalidArgumentException('Falta especificar el servicio solicitado.');
    }
    if (!data.date) {
      throw new InvalidArgumentException('Falta la fecha del turno.');
    }

    data.uuid = crypto.randomUUID();
    data.status = data.status || 'pending';

    const AppointmentModel = getDependency('AppointmentModel');
    const newAppointment = new AppointmentModel(data);
    await newAppointment.save();
    return newAppointment;
  }

  static async updateByUuid(uuid, data) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const AppointmentModel = getDependency('AppointmentModel');
    const updated = await AppointmentModel.findOneAndUpdate(
      { uuid },
      { $set: data },
      { new: true }
    );
    if (!updated) {
      throw new InvalidArgumentException('Turno no encontrado.');
    }
    return updated;
  }

  static async deleteByUuid(uuid) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const AppointmentModel = getDependency('AppointmentModel');
    const deleted = await AppointmentModel.findOneAndDelete({ uuid });
    if (!deleted) {
      throw new InvalidArgumentException('Turno no encontrado.');
    }
  }
}
