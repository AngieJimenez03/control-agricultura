import Lote from '../schemas/lotes.js';
import mongoose from 'mongoose';

class lotesModel {

  async create(data) {
    return await Lote.create(data);
  }

  async getAll() {
    return await Lote.find()
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol");
  }

  async getOneById(id) {
    return await Lote.findById(id)
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol");
  }

  async update(id, data) {
    return await Lote.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Lote.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  }
}

export default new lotesModel();