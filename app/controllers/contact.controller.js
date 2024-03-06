const ContactService = require("../services/contact.service");
const MongoDB = require('../utils/mongodb.util');
const ApiError = require("../api-error.js");



exports.create = async (req, res, next) => {
        if (!req.body?.name) {
            return next(new ApiError(400,'Name can not be empty'))
        }
       
        try {
            
            const contactService = new ContactService(MongoDB.client);
            const document = await contactService.create(req.body);
            return res.send(document);

        } catch (error) {
            // console.log(document+'document',contactService);
            
            // console.log(error)
            return next(
                new ApiError(500,error.message)
            );
        }
};
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500,error.message)
        );
    }
    return res.send(documents);
};
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
           return next( new ApiError(404,'your Id: '+ req.params.id+' :not found'))
        } 
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500,`Error restrieving with ${req.params.id}`)
        );
    } 
};
exports.update = async (req, res, next) => {
    
    if (Object.keys(res.body).length==0){
        return next(new ApiError(400,"Data to update cannot be emty!"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id,req.body);
        if (!document) {
           return next( new ApiError(404,'Contact not found'))
        } 
        return res.send({
            message: "contact was update succesfully",
            
        });
    } catch (error) {
        return next(
            new ApiError(500,`Error Upadte with this id: ${req.params.id}`)
        );
    }
};
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
           return next( new ApiError(404,"contact not found"));
        } 
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500,`could not delete with ${req.params.id}`)
        );
    }
};
exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deleteCount = await contactService.deleteAll();

        return res.send({message:`${deleteCount} was deleted Successfully`});
    } catch (error) {
        return next(
            new ApiError(500,"an error orrcured while removing favourite contacts")
        );
    }
};
exports.findAllFavorite = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
        
        
    } catch (error) {
        return next(
            new ApiError(500 ,"an error orrcured while retrieving favourite contacts")
        );
    }
}