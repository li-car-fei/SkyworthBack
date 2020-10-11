'use strict';

const Service = require('egg').Service;

class PublicService extends Service {
    async get_resource(Model) {
        const data = await Model.find();
        return data
    }

    async get_resource_id(Model, id) {
        const data = await Model.findById(id);
        return data
    }

    async create_resource(Model, data) {
        const result = await Model.create(data);
        return result
    }

    async dele_resource(Model, id) {
        const result = await Model.findByIdAndDelete(id);
        return result
    }

    async update_resource(Model, id, data) {
        const result = await Model.findByIdAndUpdate(id, { $set: data }, { runValidators: true });
        return result
    }
}

module.exports = PublicService;
