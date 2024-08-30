const Log = require('../config/filesystem')
const util = require("util");
const user = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


// const saveDetails = async (req, res) => {
//     try {
//         Log("Info", 'user', JSON.stringify(req.body), 'user save')
//         let {isValidationFailed, msg} = await validateUserRequest(req.body)
//         if (isValidationFailed) {
//             return res.status(400).json({status: 400, msg: msg, body: {}})
//         }
//         const response = await UserModel.save(req.body)
//         if (Object.keys(response).length <= 0) {
//             return res.status(400).json({status: 400, msg: 'User failed to create', body: {}})
//         }
//
//         delete req.body?._id
//         res.status(200).json({
//             status: 200,
//             msg: 'User saved successfully',
//             body: {id: response?.insertedId.toHexString(), ...req.body}
//         })
//     } catch (e) {
//         Log('error', 'user', util.inspect(e, {depth: null}))
//         res.status(400).json({status: 400, msg: 'User failed to create', body: {}})
//     }
// }

const validateUserRequest = async (body) => {
    const errors = [];

    if (Object.keys(body).length === 0) {
        errors.push("Required params are missing");
    }

    if (!body.name || body.name.length <= 1) {
        errors.push("Name is missing or too short");
    }

    if (!body.password) {
        errors.push("password is missing");
    }

    if (!body.email || body.email.length <= 1) {
        errors.push("Email is missing or too short");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push("Enter valid email.");
    }

    if (!body.contact_no) {
        errors.push("Contact No is missing");
    } else if (!/[1-9]{1}[0-9]{9}/.test(body.contact_no)) {
        errors.push("Enter valid number");
    }

    const isValidationFailed = errors.length > 0;
    const msg = isValidationFailed ? errors[0] : '';

    return {isValidationFailed, msg};
};

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const deleteUser = async (req, res) => {
    try {
        Log("Info", "user", JSON.stringify(req.body), 'delete user')
        if (req.body?.email === undefined) {
            return res.status(400).json({status: 400, msg: 'Operation Failed!', body: {}})
        }

        const response = await UserModel.deleteByEmail(req.body?.email)
        if (response?.deletedCount === undefined) {
            return res.status(400).json({status: 400, msg: 'Operation Failed!', body: {}})
        }

        return res.status(200).json({status: 200, msg: 'User remove successfully', body: {}})
    } catch (e) {
        Log('error', 'user', util.inspect(e, {depth: null}))
        res.status(400).json({status: 400, msg: 'Operation Failed!', body: {}})
    }
}

exports.userCreate = async (req, res) => {
    try {
        Log("Info", "user", JSON.stringify(req.body), 'save user')
        let {isValidationFailed, msg} = await validateUserRequest(req.body);
        if (isValidationFailed) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: msg,
                data: []
            });
        }

        const {email, name, contact_no, password, role_name} = req.body;
        const isEmailExist = await user.findOne({email});
        if (isEmailExist) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email is already exits.",
                data: []
            })
        }

        const encryptPass = await encryptPassword(password);
        const response = await user.create({
            email,
            name,
            password: encryptPass,
            contact_no,
            role_name
        })

        if (Object.keys(response).length <= 0) {
            return res.status(400).json({status: 400, msg: 'User failed to create', body: {}})
        }

        delete req.body?._id

        return res.status(200).json({
            success: true,
            status: 200,
            data: response,
            message: "User register successfully."
        })
    } catch (e) {
        Log('error', 'user', util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

const encryptPassword = async (password) => {
    try {
        if (!password) {
            throw new Error("Password is required to encrypt.")
        }

        return await bcrypt.hash(password, 10);
    } catch (e) {
        throw e.message
    }
}

exports.userLogin = async (req, res) => {
    try {

        const {email, password} = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email is required.",
                data: []
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Password is required.",
                data: []
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Enter valid email.",
                data: []
            });
        }

        const isEmailExist = await user.findOne({email})
        if (!isEmailExist) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email doesn't exits.",
                data: []
            });
        }

        if (await bcrypt.compare(password, isEmailExist.password)) {
            const token = jwt.sign({
                id: isEmailExist?._id,
                name: isEmailExist?.name,
                email: isEmailExist?.email,
                contact_no: isEmailExist?.contact_no,
                role: isEmailExist?.role_name,
            }, process.env.JWT_SECRET_KEY, {expiresIn: '30d',});

            if (!token) {
                return res.status(403).json({
                    success: false,
                    status: 403,
                    message: "Failed to authorize user.",
                    data: []
                });
            }
            const userDetails = isEmailExist.toObject();
            delete userDetails?.password;
            userDetails.token = token
            res.cookie("token", token, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                httpOnly: true
            });
            return res.status(200).json({
                success: false,
                status: 200,
                message: "User authorized successfully",
                data: userDetails
            });
        }

        return res.status(401).json({
            success: false,
            status: 401,
            message: "Unauthorized user.",
            data: []
        });

    } catch (e) {
        Log('error', 'user', util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}