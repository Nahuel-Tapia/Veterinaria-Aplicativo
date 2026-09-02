import { InvalidArgumentException } from "../exceptions/invalid_argument_exception.js";
import { getDependency } from "../libs/dependencies.js";

export class ServiceCatalogService {
  static async get(filter = {}) {
    const ServiceModel = getDependency('ServiceModel');
    return await ServiceModel.find(filter);
  }

  static async getSingleOrNullByUuid(uuid) {
    const ServiceModel = getDependency('ServiceModel');
    return (await ServiceModel.find({ uuid }))[0];
  }

  static async create(data) {
    if (!data.name) {
      throw new InvalidArgumentException('Falta el nombre del servicio.');
    }
    if (data.price === undefined || data.price === null || isNaN(data.price)) {
      throw new InvalidArgumentException('El precio del servicio debe ser un número válido.');
    }

    data.uuid = crypto.randomUUID();

    const ServiceModel = getDependency('ServiceModel');
    const newService = new ServiceModel(data);
    await newService.save();
    return newService;
  }

  static async updateByUuid(uuid, data) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const ServiceModel = getDependency('ServiceModel');
    const updated = await ServiceModel.findOneAndUpdate(
      { uuid },
      { $set: data },
      { new: true }
    );
    if (!updated) {
      throw new InvalidArgumentException('Servicio no encontrado.');
    }
    return updated;
  }

  static async deleteByUuid(uuid) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const ServiceModel = getDependency('ServiceModel');
    const deleted = await ServiceModel.findOneAndDelete({ uuid });
    if (!deleted) {
      throw new InvalidArgumentException('Servicio no encontrado.');
    }
  }
}
