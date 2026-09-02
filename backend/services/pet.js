import { InvalidArgumentException } from "../exceptions/invalid_argument_exception.js";
import { getDependency } from "../libs/dependencies.js";

export class PetService {
  static async get(filter = {}) {
    const PetModel = getDependency('PetModel');
    return await PetModel.find(filter);
  }

  static async getSingleOrNullByUuid(uuid) {
    const PetModel = getDependency('PetModel');
    return (await PetModel.find({ uuid }))[0];
  }

  static async create(petData) {
    if (!petData.name) {
      throw new InvalidArgumentException('Falta el nombre de la mascota.');
    }
    if (!petData.ownerUuid) {
      throw new InvalidArgumentException('Falta especificar el dueño de la mascota.');
    }
    if (!petData.species) {
      throw new InvalidArgumentException('Falta la especie de la mascota.');
    }

    petData.uuid = crypto.randomUUID();

    const PetModel = getDependency('PetModel');
    const newPet = new PetModel(petData);
    await newPet.save();
    return newPet;
  }

  static async updateByUuid(uuid, data) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el identificador UUID.');
    }

    const PetModel = getDependency('PetModel');
    const updated = await PetModel.findOneAndUpdate(
      { uuid },
      { $set: data },
      { new: true }
    );
    if (!updated) {
      throw new InvalidArgumentException('Mascota no encontrada.');
    }
    return updated;
  }

  static async deleteByUuid(uuid) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el identificador UUID.');
    }

    const PetModel = getDependency('PetModel');
    const pet = await PetModel.findOneAndDelete({ uuid });
    if (!pet) {
      throw new InvalidArgumentException('Mascota no encontrada.');
    }
  }
}
